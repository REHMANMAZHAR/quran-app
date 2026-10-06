"use strict";
/* ---------- Hifz check: recite from memory, the app listens and marks each word ----------
   Uses the phone's own speech recogniser (Web Speech API, Arabic). It checks WORDS (missed, changed, order),
   not harakat or tajweed — the recogniser writes standard Arabic without full vowel marks. */
Object.assign(L.ur, {
  hzBtn:"🎙 حفظ جانچیں", hzT:"حفظ جانچیں", hzFrom:"آیت سے", hzTo:"آیت تک", hzStart:"شروع کریں — پڑھنا شروع کریں", hzStop:"ختم", hzListen:"سن رہا ہے… پڑھتے جائیں",
  hzHow:"متن چھپ جائے گا۔ زبانی پڑھیں — جو لفظ صحیح پڑھا وہ سبز ہو کر ظاہر ہوگا، چھوٹا ہوا لال، اور شک والا نارنجی۔ تعوذ اور بسم اللہ پڑھ سکتے ہیں۔",
  hzLimit:"یہ الفاظ (چھوٹنا، بدلنا، ترتیب) جانچتا ہے — حرکات اور تجوید نہیں۔ آواز آپ کے فون کی اسپیچ سروس (Google / Apple) سمجھتی ہے؛ QuranToSoul آواز محفوظ نہیں کرتا۔",
  hzNo:"اس براؤزر میں آواز پہچاننے کی سہولت نہیں۔ اینڈرائیڈ پر Chrome یا آئی فون پر Safari استعمال کریں۔", hzMic:"مائیک کی اجازت نہیں ملی — براؤزر کی سیٹنگز میں اجازت دیں۔",
  hzRes:"نتیجہ", hzOk:n=>`${ud(n)} درست`, hzMiss:n=>`${ud(n)} چھوٹے`, hzChk:n=>`${ud(n)} دوبارہ دیکھیں`, hzScore:p=>`${ud(p)}٪ درست`,
  hzMissL:"چھوٹ گیا", hzChkL:"سنا گیا", hzListenA:"▶ درست تلاوت سنیں", hzAgain:"دوبارہ جانچیں", hzAll:"ماشاءاللہ! تمام الفاظ درست", hzHeard:"سنا:", hzNone:"کچھ سنائی نہیں دیا"
});
Object.assign(L.en, {
  hzBtn:"🎙 Check my hifz", hzT:"Check my hifz", hzFrom:"From ayah", hzTo:"to ayah", hzStart:"Start — begin reciting", hzStop:"Finish", hzListen:"Listening… keep reciting",
  hzHow:"The text is hidden. Recite from memory — each word you say correctly appears in green, a missed word in red, and a doubtful one in orange. You may start with ta'awwudh and basmalah.",
  hzLimit:"It checks words (missed, changed, order) — not harakat or tajweed. Your voice is understood by your phone's speech service (Google / Apple); QuranToSoul does not keep any recording.",
  hzNo:"This browser can't recognise speech. Use Chrome on Android or Safari on iPhone.", hzMic:"Microphone permission was refused — allow it in your browser settings.",
  hzRes:"Result", hzOk:n=>`${n} correct`, hzMiss:n=>`${n} missed`, hzChk:n=>`${n} to check`, hzScore:p=>`${p}% correct`,
  hzMissL:"Missed", hzChkL:"Heard", hzListenA:"▶ Hear the correct recitation", hzAgain:"Check again", hzAll:"MashaAllah! Every word correct", hzHeard:"Heard:", hzNone:"Nothing was heard"
});
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
/* Arabic normaliser shared by Quran text and recogniser output */
function hzNorm(t){
  return t.replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, "").replace(/[ٱأإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/ء/g, "").replace(/[^ء-ي]/g, "");
}
const hzKey = t => hzNorm(t).replace(/[اوي]/g, "");        // consonant skeleton: tolerant of long-vowel spelling (صلوة / صلاة)
function lev(a, b){ const m = a.length, n = b.length; if (!m || !n) return Math.max(m, n); let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; }
function hzSim(exp, got){
  const a = hzNorm(exp), b = hzNorm(got); if (!a || !b) return 0;
  if (a === b || hzKey(exp) === hzKey(got)) return 1;
  return 1 - lev(a, b) / Math.max(a.length, b.length);
}
const HZ_SKIP = new Set(["اعوذ", "بالله", "من", "الشيطان", "الرجيم", "بسم", "الله", "الرحمن", "الرحيم"].map(hzNorm));
const HZ = { on: false, E: [], p: 0, rec: null, heardAny: false, s: 0, a1: 0, a2: 0 };
function hzSetup(){
  if (!CUR) return;
  const top = typeof topAyah === "function" ? topAyah() : null, a1 = top ? +top.dataset.a : 1, n = CUR.ayahs.length;
  const opt = (sel) => Array.from({ length: n }, (_, k) => `<option value="${k + 1}"${k + 1 === sel ? " selected" : ""}>${nf(k + 1)}</option>`).join("");
  $("#sheetBody").innerHTML = `<h3 style="margin-top:0">${T("hzT")} · ${esc(surahName(CUR.n))}</h3>
    <div class="hz-range"><label>${T("hzFrom")} <select id="hzA1">${opt(a1)}</select></label><label>${T("hzTo")} <select id="hzA2">${opt(Math.min(n, a1 + 4))}</select></label></div>
    <p>${T("hzHow")}</p><p class="muted" style="font-size:13px">${T("hzLimit")}</p>
    ${SR ? `<button class="btn wide" data-hz="go">${T("hzStart")}</button>` : `<p class="fb no">${T("hzNo")}</p>`}`;
  openSheet();
}
function hzStart(a1, a2){
  if (a2 < a1) [a1, a2] = [a2, a1];
  closeAll(); if (P.s && !P.audio.paused) P.audio.pause();
  HZ.s = CUR.n; HZ.a1 = a1; HZ.a2 = a2; HZ.p = 0; HZ.on = true; HZ.heardAny = false; HZ.E = [];
  for (let a = a1; a <= a2; a++) CUR.ayahs[a - 1].w.forEach((w, i) => HZ.E.push({ a, i, t: w[0], st: "" }));
  document.body.classList.add("hifz", "hzon");
  document.querySelectorAll(".w.shown").forEach(x => x.classList.remove("shown"));
  document.querySelectorAll(".hz-ok,.hz-miss,.hz-chk").forEach(x => x.classList.remove("hz-ok", "hz-miss", "hz-chk"));
  const bar = document.createElement("div"); bar.id = "hzBar";
  bar.innerHTML = `<span class="hz-dot"></span><div><b>${T("hzListen")}</b><small id="hzLive"></small></div><button class="btn" data-hz="stop">${T("hzStop")}</button>`;
  document.body.appendChild(bar);
  document.getElementById("a" + a1).scrollIntoView({ block: "start" });
  hzListen();
}
function hzListen(){
  const r = HZ.rec = new SR(); r.lang = "ar-SA"; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
  r.onresult = e => {
    let interim = "";
    for (let k = e.resultIndex; k < e.results.length; k++) {
      const res = e.results[k], txt = res[0].transcript;
      if (res.isFinal) txt.split(/\s+/).filter(Boolean).forEach(hzToken); else interim += txt;
    }
    const lv = $("#hzLive"); if (lv) lv.textContent = interim;
    if (typeof touchActive === "function") touchActive();
  };
  r.onerror = e => { if (e.error === "not-allowed" || e.error === "service-not-allowed") { toast(esc(T("hzMic")), 4000); hzStop(); } };
  r.onend = () => { if (HZ.on) { try { r.start(); } catch(err) {} } };   // phones stop after a pause — keep listening
  try { r.start(); } catch(err) { toast(esc(T("hzNo")), 4000); hzStop(); }
}
function hzMark(k, st, heard){
  const x = HZ.E[k]; x.st = st; if (heard) x.heard = heard;
  const el = document.querySelector(`#a${x.a} .w[data-i="${x.i}"]`); if (!el) return;
  el.classList.add("shown", "hz-" + st); if (heard) el.title = `${T("hzHeard")} ${heard}`;
}
function hzToken(tok){
  if (!HZ.on || HZ.p >= HZ.E.length) return;
  HZ.heardAny = true;
  const t = hzNorm(tok); if (!t) return;
  // look ahead up to 4 words for a match (allows for skipped words)
  for (let j = HZ.p; j < Math.min(HZ.E.length, HZ.p + 4); j++) {
    const need = j === HZ.p ? 0.72 : 0.85;
    if (hzSim(HZ.E[j].t, tok) >= need) {
      for (let k = HZ.p; k < j; k++) hzMark(k, "miss");
      hzMark(j, "ok"); HZ.p = j + 1; hzFollow(); if (HZ.p >= HZ.E.length) setTimeout(hzStop, 600); return;
    }
  }
  if (HZ.p === 0 && HZ_SKIP.has(t)) return;                     // ta'awwudh / basmalah before the first ayah
  if (hzSim(HZ.E[HZ.p].t, tok) >= 0.45) { hzMark(HZ.p, "chk", tok); HZ.p++; hzFollow(); if (HZ.p >= HZ.E.length) setTimeout(hzStop, 600); }
  // otherwise: an extra word or recogniser noise — ignored
}
function hzFollow(){
  const x = HZ.E[Math.min(HZ.p, HZ.E.length - 1)]; const el = document.getElementById("a" + x.a);
  if (el) { const r = el.getBoundingClientRect(); if (r.bottom > innerHeight - 140 || r.top < 60) el.scrollIntoView({ block: "center", behavior: "smooth" }); }
}
function hzStop(){
  if (!HZ.on) return; HZ.on = false;
  try { HZ.rec && HZ.rec.stop(); } catch(e) {}
  const bar = document.getElementById("hzBar"); if (bar) bar.remove();
  document.body.classList.remove("hzon");
  const done = HZ.E.slice(0, HZ.p), ok = done.filter(x => x.st === "ok").length, miss = done.filter(x => x.st === "miss"), chk = done.filter(x => x.st === "chk");
  // save per-ayah results for later review
  U.hz = U.hz || {}; const byA = {};
  done.forEach(x => { const b = byA[x.a] = byA[x.a] || [0, 0]; b[1]++; if (x.st === "ok") b[0]++; });
  Object.entries(byA).forEach(([a, v]) => { U.hz[HZ.s + ":" + a] = [v[0], v[1], dayKey()]; }); saveU();
  const pct = done.length ? Math.round(ok / done.length * 100) : 0;
  const row = (x, lab) => `<li><span class="oar">${esc(x.t)}</span> <small>${lab}${x.heard ? `: «${esc(x.heard)}»` : ""} · ${nf(HZ.s)}:${nf(x.a)}</small> <button class="chip" data-hzplay="${x.a}">▶</button></li>`;
  $("#sheetBody").innerHTML = `<h3 style="margin-top:0">${T("hzRes")} · ${esc(surahName(HZ.s))} ${nf(HZ.a1)}–${nf(HZ.a2)}</h3>
    ${!HZ.heardAny ? `<p class="fb no">${T("hzNone")}</p>` : `<div class="big" style="font-size:34px;font-weight:700">${T("hzScore", nf(pct))}</div>
    <p>${T("hzOk", nf(ok))} · ${T("hzMiss", nf(miss.length))} · ${T("hzChk", nf(chk.length))}</p>
    ${miss.length || chk.length ? `<ul class="hzlist">${miss.map(x => row(x, T("hzMissL"))).join("")}${chk.map(x => row(x, T("hzChkL"))).join("")}</ul>` : (HZ.p >= HZ.E.length ? `<p class="fb ok">${T("hzAll")}</p>` : "")}`}
    <div style="display:grid;gap:8px;margin-top:12px"><button class="btn ghost wide" data-hzplay="${HZ.a1}">${T("hzListenA")}</button><button class="btn wide" data-hz="again">${T("hzAgain")}</button></div>
    <p class="muted" style="font-size:12px">${T("hzLimit")}</p>`;
  openSheet();
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-hz]");
  if (b) { const v = b.dataset.hz;
    if (v === "go") hzStart(+$("#hzA1").value, +$("#hzA2").value);
    else if (v === "stop") hzStop();
    else if (v === "again") { document.body.classList.remove("hifz"); closeAll(); hzStart(HZ.a1, HZ.a2); }
    else if (v === "setup") hzSetup();
    return; }
  const pl = e.target.closest("[data-hzplay]"); if (pl) { closeAll(); document.body.classList.remove("hifz"); document.querySelectorAll(".w.shown").forEach(x => x.classList.remove("shown")); playFrom(HZ.s, +pl.dataset.hzplay, true); }
});
/* entry point: button in the surah header */
const _surahToolsHZ = surahTools;
surahTools = function(n){ return _surahToolsHZ(n).replace(/<\/div>$/, "") + `<div class="tsz"><button data-hz="setup" style="min-width:auto;padding:0 14px">${T("hzBtn")}</button></div></div>`; };
