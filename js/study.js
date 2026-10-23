"use strict";
/* ---------- v41: para / quarter / ruku marks in the text · tafsir follows the exact ayah (groups, seek, ±15s, ayah steps)
   · screen stays awake · review quiz tests understanding with each word's meaning in its own ayah · word forms in "meanings of this word" ---------- */
Object.assign(L.ur, { jzStart:n=>`پارہ ${ud(n)}`, qLbl:["", "الربع", "النصف", "الثلاثة"], qName:["", "ربع پارہ", "نصف پارہ", "تین ربع پارہ"],
  rkT:(a,b,c)=>`رکوع ${ud(a)} (سورت) · ${ud(b)} (پارہ) · ${ud(c)} آیات`, nowAyahs:(s,a,b)=>`اب: ${s} — آیات ${ud(a)}–${ud(b)}`,
  tfBack:"۱۵ سیکنڈ پیچھے", tfFwd:"۱۵ سیکنڈ آگے", tfPrevA:"پچھلی آیت", tfNextA:"اگلی آیت",
  awakeH:"اسکرین روشن رکھیں", awakeSub:"قرآن پڑھتے، تلاوت یا تفسیر سنتے وقت فون بند نہ ہو",
  qCtx:"اس آیت میں نمایاں لفظ کا مطلب؟", qPick:m=>`اس آیت میں کون سا لفظ «${m}» کے معنی میں ہے؟`, qMeanA:"اس آیت کا مطلب؟", sfForms:"قرآن میں اس کی شکلیں" });
Object.assign(L.en, { jzStart:n=>`Para ${n}`, qLbl:["", "الربع", "النصف", "الثلاثة"], qName:["", "Quarter of the para", "Half of the para", "Three quarters of the para"],
  rkT:(a,b,c)=>`Ruku ${a} of the surah · ${b} of the para · ${c} ayahs`, nowAyahs:(s,a,b)=>`Now: ${s} — ayahs ${a}–${b}`,
  tfBack:"Back 15 seconds", tfFwd:"Forward 15 seconds", tfPrevA:"Previous ayah", tfNextA:"Next ayah",
  awakeH:"Keep the screen on", awakeSub:"The phone won't sleep while you read, or while recitation or tafsir plays",
  qCtx:"What does the highlighted word mean in this ayah?", qPick:m=>`Which word in this ayah means “${m}”?`, qMeanA:"What does this ayah mean?", sfForms:"Its forms in the Quran" });
/* ===== 1. para start, quarter (ربع / نصف / ثلاثہ) and ruku (ع) marks ===== */
const JZN = ["الٓمٓ", "سَيَقُولُ", "تِلْكَ الرُّسُلُ", "لَنْ تَنَالُوا", "وَالْمُحْصَنَاتُ", "لَا يُحِبُّ اللّٰهُ", "وَإِذَا سَمِعُوا", "وَلَوْ أَنَّنَا", "قَالَ الْمَلَأُ", "وَاعْلَمُوا",
  "يَعْتَذِرُونَ", "وَمَا مِنْ دَابَّةٍ", "وَمَا أُبَرِّئُ", "رُبَمَا", "سُبْحَانَ الَّذِي", "قَالَ أَلَمْ", "اقْتَرَبَ لِلنَّاسِ", "قَدْ أَفْلَحَ", "وَقَالَ الَّذِينَ", "أَمَّنْ خَلَقَ",
  "اتْلُ مَا أُوحِيَ", "وَمَنْ يَقْنُتْ", "وَمَا لِيَ", "فَمَنْ أَظْلَمُ", "إِلَيْهِ يُرَدُّ", "حٰمٓ", "قَالَ فَمَا خَطْبُكُمْ", "قَدْ سَمِعَ اللّٰهُ", "تَبَارَكَ الَّذِي", "عَمَّ"];
let MK = null;
load("marks", `data/marks.json?v=${DV}`).then(x => { MK = x; markAll(); }).catch(() => {});
function markAll(){
  if (!MK) return;
  document.querySelectorAll("#main .ayah:not([data-mk])").forEach(ay => {
    ay.dataset.mk = 1;
    const blk = ay.closest(".sblk"), s = blk ? +blk.dataset.s : CUR && CUR.n, a = +ay.dataset.a, m = MK[s] && MK[s][a]; if (!m) return;
    if (m.j) ay.insertAdjacentHTML("beforebegin", `<div class="jz-band" role="note"><span>${T("jzStart", nf(m.j))}</span><b>${JZN[m.j - 1]}</b></div>`);
    else if (m.q) ay.insertAdjacentHTML("beforebegin", `<div class="q-band" role="note" title="${esc(T("qName")[m.q])}"><b>${T("qLbl")[m.q]}</b><small>${esc(T("qName")[m.q])}</small></div>`);
    if (m.r) {
      const [rs, rj, n] = m.r, t = esc(T("rkT", rs, rj, n));
      const html = `<span class="rk" role="button" tabindex="0" data-rk="${s}:${a - n + 1}:${a}:${rs}" title="${t}" aria-label="${t}"><i>${nf(rs)}</i><b>ع</b><i>${nf(rj)}</i></span>`;
      const end = ay.querySelector(".last .end"); if (end) end.insertAdjacentHTML("afterend", html); else ay.insertAdjacentHTML("beforeend", html);
    }
  });
}
new MutationObserver(markAll).observe($("#main"), { childList: true, subtree: true });
/* ===== 2. tafsir: the whole group of ayahs being explained, exact start, ±15s and ayah steps ===== */
tafNow = function(marks, t){
  if (!marks.length) return;
  let m = marks[0]; for (const x of marks) { if (x[2] <= t + 1) m = x; else break; }
  const grp = marks.filter(x => x[2] === m[2] && x[0] === m[0]), f = grp[0], l = grp[grp.length - 1];
  const k = f[0] + ":" + f[1] + "-" + l[1]; if (k === tafCur) return; tafCur = k;
  const el = $("#vpNow"); if (el) el.textContent = grp.length > 1 ? T("nowAyahs", surahName(f[0]), nf(f[1]), nf(l[1])) : T("nowAyah", surahName(f[0]), nf(f[1]));
  document.querySelectorAll(".vp-ayahs button").forEach(b => b.classList.toggle("on", grp.some(x => b.dataset.sa === x[0] + ":" + x[1])));
  const on = document.querySelector(".vp-ayahs button.on"); if (on) on.scrollIntoView({ block: "nearest", inline: "center" });
  tafFollow(f[0], f[1]);
  grp.slice(1).forEach(x => { const e = ayEl(x[0], x[1]); if (e) e.classList.add("tafnow"); });
};
const _openLectureS = openLecture;
openLecture = function(series, n, at){
  const r = _openLectureS(series, n, at), au = $("#vpAudio");
  if (!au || !AUDIO_SER[series]) return r;
  /* phones sometimes ignore the first seek on a stream: check again once it can play */
  if (at != null) { const fix = () => { if (Math.abs(au.currentTime - at) > 3 && at < (au.duration || 1e9) - 3) { try { au.currentTime = at; } catch(e){} } };
    au.addEventListener("canplay", fix, { once: true }); au.addEventListener("playing", fix, { once: true }); }
  const marks = partMarks(series, n);
  au.insertAdjacentHTML("afterend", `<div class="tf-ctl">
    <button data-tfj="-15" aria-label="${T("tfBack")}"><b>⟲</b><small>15</small></button>
    ${marks.length ? `<button data-tfa="-1" aria-label="${T("tfPrevA")}"><b>‹</b><small>${T("tfPrevA")}</small></button><button data-tfa="1" aria-label="${T("tfNextA")}"><b>›</b><small>${T("tfNextA")}</small></button>` : ""}
    <button data-tfj="15" aria-label="${T("tfFwd")}"><b>⟳</b><small>15</small></button></div>`);
  /* from the ayah menu in the Quran: keep the Quran in view */
  if (at != null && LV.view === "read") { const b = $("#vpanel").querySelector("[data-v=mini]"); if (b) setTimeout(() => { if (!$("#vpanel").classList.contains("mini")) b.click(); }, 50); }
  return r;
};
$("#vpanel").addEventListener("click", e => {
  const au = $("#vpAudio"); if (!au) return;
  const j = e.target.closest("[data-tfj]"); if (j) { e.stopPropagation(); au.currentTime = Math.max(0, au.currentTime + +j.dataset.tfj); return; }
  const s = e.target.closest("[data-tfa]"); if (!s || !vCur) return; e.stopPropagation();
  const times = [...new Set(partMarks(vCur.series, vCur.n).map(x => x[2]))].sort((x, y) => x - y), t = au.currentTime;
  let i = 0; times.forEach((x, k) => { if (x <= t + 1) i = k; });
  const go = +s.dataset.tfa < 0 ? (t - times[i] > 4 ? times[i] : times[Math.max(0, i - 1)]) : times[Math.min(times.length - 1, i + 1)];
  au.currentTime = go; tafCur = ""; au.play().catch(() => {});
}, true);
/* ===== 3. keep the screen on while reading or listening ===== */
if (settings.awake == null) settings.awake = true;
let WL = null, wlBusy = false;
async function wakeCheck(){
  if (!("wakeLock" in navigator) || wlBusy) return;
  const tau = $("#vpAudio");
  const want = settings.awake !== false && document.visibilityState === "visible" && (LV.view === "read" || (P.s && !P.audio.paused) || (tau && !tau.paused));
  wlBusy = true;
  try { if (want && !WL) { WL = await navigator.wakeLock.request("screen"); WL.addEventListener("release", () => { WL = null; }); } else if (!want && WL) { await WL.release(); WL = null; } } catch(e){}
  wlBusy = false;
}
document.addEventListener("visibilitychange", wakeCheck);
["play", "pause", "ended"].forEach(ev => document.addEventListener(ev, wakeCheck, true));
setInterval(wakeCheck, 5000);
const _showViewW = showView; showView = function(v){ const r = _showViewW(v); wakeCheck(); return r; };
const _renderSettingsW = renderSettings;
renderSettings = function(...a){
  const r = _renderSettingsW(...a), sec = $("#st-app");
  if (sec && !$("#stAwake")) sec.insertAdjacentHTML("beforeend", `<label class="ds-row ds-sw cu-sw"><span><b>${T("awakeH")}</b><small>${T("awakeSub")}</small></span><input type="checkbox" role="switch" id="stAwake"${settings.awake !== false ? " checked" : ""}><i aria-hidden="true"></i></label>`);
  return r;
};
VIEWS.settings.render = renderSettings;
document.addEventListener("change", e => { if (e.target.id === "stAwake") { settings.awake = e.target.checked; saveSettings(); wakeCheck(); } });
/* ===== 4. review quiz: understanding, with each word's meaning as it is used in that ayah ===== */
const ctxMean = w => settings.lmean === "en" ? (w[1] || "") : (w[3] || w[1] || "");
const ctxCls = () => settings.lmean === "en" ? "" : "ur";
const normM = x => x.replace(/[()\[\]«»"'.,،]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
function ctxSnippet(ws, i){
  const a = Math.max(0, i - 5), b = Math.min(ws.length, i + 6);
  return `<div class="qctx" dir="rtl">${a > 0 ? "… " : ""}${ws.slice(a, b).map((w, k) => a + k === i ? `<mark>${esc(w[0])}</mark>` : esc(w[0])).join(" ")}${b < ws.length ? " …" : ""}</div>`;
}
reviewQuiz = async function(per){
  const keys = [...new Set(daysBack(PER[per]).flatMap(d => U.rd[d] || []))];
  if (!keys.length) { toast(esc(T("quizNone")), 3000); return; }
  const pick = shuf(keys).slice(0, 40), items = [], ayahs = [];
  for (const k of pick) {
    const [s, a] = k.split(":").map(Number), d = await DATA.surah(s), A = d.ayahs[a - 1]; if (!A) continue;
    const tr = settings.lang === "en" ? (A.en2 || A.en) : (A.ur || A.ur2);
    ayahs.push({ s, a, ws: A.w, tr });
    A.w.forEach((w, i) => { const lm = META.lemmas[w[5]]; if (lm && /^(N|V|ADJ)/.test(lm[1]) && normM(ctxMean(w)).length > 1) items.push({ s, a, ws: A.w, i, w, lem: w[5], m: ctxMean(w) }); });
  }
  const nQ = Math.max(5, Math.min(15, U.plan.quiz || 10)), qs = [], cls = ctxCls();
  const fb = (w, m) => [0, w[0], "", "", 0, m];
  const distract = (it, n) => shuf(items.filter(x => x.lem !== it.lem && normM(x.m) !== normM(it.m))).filter((x, k, A) => A.findIndex(y => normM(y.m) === normM(x.m)) === k).slice(0, n);
  /* a) the word in its ayah → its meaning there */
  const used = new Set();
  shuf(items).forEach(it => {
    if (qs.length >= Math.ceil(nQ * 0.55) || used.has(it.lem)) return;
    const others = distract(it, 3); if (others.length < 3) return; used.add(it.lem);
    const opts = shuf([it, ...others]);
    qs.push({ prompt: `${ctxSnippet(it.ws, it.i)}<div class="qref">${esc(surahName(it.s))} ${nf(it.s)}:${nf(it.a)}</div><div class="qh">${T("qCtx")}</div>`,
      opts: opts.map(o => `<span class="${cls}">${esc(o.m)}</span>`), ans: opts.indexOf(it), w: fb(it.w, it.m) });
  });
  /* b) a meaning → which word of this ayah carries it */
  shuf(items).forEach(it => {
    if (qs.length >= Math.ceil(nQ * 0.8) || used.has("p" + it.s + ":" + it.a)) return;
    const same = shuf(it.ws.map((w, i) => ({ w, i })).filter(x => x.i !== it.i && normM(ctxMean(x.w)) !== normM(it.m) && x.w[0] !== it.w[0])).slice(0, 3);
    if (same.length < 3) return; used.add("p" + it.s + ":" + it.a);
    const opts = shuf([{ w: it.w, i: it.i }, ...same]);
    qs.push({ prompt: `<div class="qctx" dir="rtl">${esc(it.ws.length > 14 ? it.ws.slice(Math.max(0, it.i - 6), it.i + 7).map(w => w[0]).join(" ") : it.ws.map(w => w[0]).join(" "))}</div><div class="qh"><span class="${cls}">${esc(T("qPick", it.m))}</span></div>`,
      opts: opts.map(o => `<span class="oar">${esc(o.w[0])}</span>`), ans: opts.findIndex(o => o.i === it.i), w: fb(it.w, it.m) });
  });
  /* c) a short ayah in Arabic → its meaning */
  const short = shuf(ayahs.filter(A => A.tr && A.ws.length <= 14));
  short.forEach(A => {
    if (qs.length >= nQ) return;
    const others = shuf(ayahs.filter(x => x !== A && x.tr && x.tr !== A.tr)).slice(0, 3); if (others.length < 3) return;
    const opts = shuf([A, ...others]), cut = t => t.length > 160 ? t.slice(0, 160) + "…" : t, ur = settings.lang !== "en" ? "ur" : "";
    qs.push({ prompt: `<div class="qctx big" dir="rtl">${esc(A.ws.map(w => w[0]).join(" "))}</div><div class="qh">${T("qMeanA")}</div>`,
      opts: opts.map(o => `<span class="${ur}">${esc(cut(o.tr))}</span>`), ans: opts.indexOf(A) });
  });
  /* top up with more word-in-context questions if the read portion was small */
  shuf(items).forEach(it => { if (qs.length >= nQ) return; const others = distract(it, 3); if (others.length < 3) return; const opts = shuf([it, ...others]);
    qs.push({ prompt: `${ctxSnippet(it.ws, it.i)}<div class="qh">${T("qCtx")}</div>`, opts: opts.map(o => `<span class="${cls}">${esc(o.m)}</span>`), ans: opts.indexOf(it), w: fb(it.w, it.m) }); });
  if (!qs.length) { toast(esc(T("quizNone")), 3000); return; }
  showView("learn"); await new Promise(r => setTimeout(r, 300));   // let Learn finish drawing its home first
  runQuiz(shuf(qs), { kind: "review", review: per });
};
/* ===== 5. "meanings of this word": the Arabic form used in each place, with Urdu and English ===== */
const _senseHTML = senseHTML;
senseHTML = function(stem, w){ const h = _senseHTML(stem, w); if (h) setTimeout(fillSenses, 0); return h; };
async function fillSenses(){
  const rows = [...document.querySelectorAll("#sheetBody .senses li:not([data-sf])")];
  for (const li of rows) {
    li.dataset.sf = 1;
    const forms = new Map();
    for (const b of li.querySelectorAll("[data-sloc]")) {
      const [s, a, wi] = b.dataset.sloc.split(":").map(Number);
      try { const d = await DATA.surah(s), x = d.ayahs[a - 1].w[wi - 1]; if (!x) continue;
        b.innerHTML = `<span class="oar">${esc(x[0])}</span> ${nf(s)}:${nf(a)}`;
        if (!forms.has(x[0])) forms.set(x[0], x);
      } catch(e){}
    }
    if (!forms.size) continue;
    const box = document.createElement("div"); box.className = "sf-forms";
    box.innerHTML = [...forms.values()].map(x => `<span class="sf"><b class="oar">${esc(x[0])}</b><span class="ur">${esc(x[3] || "")}</span><small dir="ltr">${esc(x[1] || "")}</small></span>`).join("");
    const locs = li.querySelector(".locs"); if (locs) locs.before(box); else li.appendChild(box);
  }
}
