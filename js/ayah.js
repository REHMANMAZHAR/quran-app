"use strict";
/* ---------- ayah menu: bookmarks, highlights, notes, sharing, tafsir text, similar ayahs, loop, report (sections A, B, C, E, F) ---------- */
Object.assign(L.ur, {
  playHere:"یہاں سے تلاوت", bookmark:"بُک مارک", unbookmark:"بُک مارک ہٹائیں", highlight:"ہائی لائٹ", note:"نوٹ / تدبر", shareText:"متن شیئر کریں", shareImg:"تصویر شیئر کریں",
  shareRange:"کئی آیات شیئر کریں", copyLink:"لنک کاپی کریں", tafJal:"تفسیر جلالین (عربی)", tafIK:"تفسیر ابن کثیر (عربی)", similarA:n=>`ملتی جلتی آیات (${ud(n)})`,
  loopA:"یہاں سے دہرائی شروع", loopB:"یہاں تک دہرائیں", loopOn:(a,b)=>`آیات ${ud(a)}–${ud(b)} دہرائی جا رہی ہیں`, loopOff:"دہرائی بند",
  saved:"محفوظ ہو گیا", copied:"کاپی ہو گیا", notePh:"اس آیت پر اپنی سوچ یا سبق لکھیں…", save:"محفوظ کریں", del:"حذف کریں", toAyah:"آخری آیت:",
  share:"شیئر", none:"کوئی نہیں", tafNone:"اس آیت کی تفسیر علیحدہ نہیں — پچھلی آیت کے ساتھ دیکھیں", tafSrc:"کلاسیکی عربی متن (پبلک ڈومین)",
  reportSubj:r=>`غلطی کی اطلاع — ${r}`, reportBody:"کیا غلط ہے؟ درست کیا ہونا چاہیے؟ (حوالہ ساتھ ہو تو بہتر)\n\n", simH:"ملتی جلتی آیات (متشابہات)",
  shared:"اسے QuranToSoul پر پڑھیں"
});
Object.assign(L.en, {
  playHere:"Play from here", bookmark:"Bookmark", unbookmark:"Remove bookmark", highlight:"Highlight", note:"Note / reflection", shareText:"Share as text", shareImg:"Share as image",
  shareRange:"Share several ayahs", copyLink:"Copy link", tafJal:"Tafsir al-Jalalayn (Arabic)", tafIK:"Tafsir Ibn Kathir (Arabic)", similarA:n=>`Similar ayahs (${n})`,
  loopA:"Start loop here", loopB:"Loop up to here", loopOn:(a,b)=>`Looping ayahs ${a}–${b}`, loopOff:"Loop off",
  saved:"Saved", copied:"Copied", notePh:"Write your reflection or lesson from this ayah…", save:"Save", del:"Delete", toAyah:"Last ayah:",
  share:"Share", none:"None", tafNone:"No separate commentary for this ayah — see the ayah before it", tafSrc:"Classical Arabic text (public domain)",
  reportSubj:r=>`Mistake report — ${r}`, reportBody:"What is wrong? What should it be? (a reference helps)\n\n", simH:"Similar ayahs (mutashabihat)",
  shared:"Read it on QuranToSoul"
});
const U = Object.assign({ bm:{}, hl:{}, notes:{}, read:{}, days:{}, goal:10, khatam:null }, store.get("user", {}));
const saveU = () => store.set("user", U);
const dayKey = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const HL = ["gold", "teal", "rose", "sky"];
function ayahCls(n, a){
  const k = n + ":" + a; let c = "";
  if (U.hl[k]) c += " hl-" + U.hl[k];
  if (U.bm[k]) c += " bm";
  if (U.notes[k]) c += " hasnote";
  return c;
}
const SITE = "https://qurantosoul.com/";
const linkOf = (s, a, b) => `${SITE}?s=${s}&a=${a}${b && b !== a ? "-" + b : ""}`;
const surahName = s => settings.lang === "en" ? META.surahs[s - 1].tr : META.surahs[s - 1].ar;
const trOf = A => A[settings.tr] || A[settings.lang === "en" ? "en2" : "ur"] || A.en2 || "";
let SIMS = null;
async function openAyahMenu(n, a){
  if (!SIMS) DATA.similar().then(x => { SIMS = x; }).catch(() => {});
  const k = n + ":" + a, sims = (SIMS && SIMS[k]) || [];
  const lp = P.loop;
  const btn = (act, label, extra = "") => `<button data-am="${act}" ${extra}>${label}</button>`;
  $("#sheetBody").innerHTML = `<div class="am-head"><b>${esc(surahName(n))} ${nf(n)}:${nf(a)}</b></div>
    <div class="am-grid">
      ${btn("play", "▶ " + T("playHere"))}
      ${btn("bm", (U.bm[k] ? "★ " + T("unbookmark") : "☆ " + T("bookmark")))}
      ${btn("note", "✎ " + T("note"))}
      ${btn("text", T("shareText"))}${btn("img", T("shareImg"))}${btn("range", T("shareRange"))}${btn("link", T("copyLink"))}
      ${israrButtons(n, a)}
      ${btn("jal", T("tafJal"))}${btn("ik", T("tafIK"))}
      ${sims.length ? btn("sim", "≈ " + T("similarA", nf(sims.length))) : ""}
      ${lp && lp.s === n && lp.b == null ? btn("loopB", "⟲ " + T("loopB")) : btn("loopA", "⟲ " + T("loopA"))}
      ${lp ? btn("loopOff", T("loopOff")) : ""}
      ${btn("report", "⚑ " + T("report"))}
    </div>
    <div class="am-hl"><span>${T("highlight")}</span>${HL.map(c => `<button class="sw hl-${c}" data-hl="${c}" aria-label="${c}" aria-pressed="${U.hl[k] === c}"></button>`).join("")}<button data-hl="" class="sw none">${T("none")}</button></div>
    <div id="amExtra"></div>`;
  $("#sheetBody").dataset.ayah = k;
  openSheet();
}
function refreshAyah(n, a){ const el = document.getElementById("a" + a); if (el && CUR && CUR.n === n) el.className = "ayah" + ayahCls(n, a) + (P.s === n && P.a === a ? " playing" : ""); }
async function ayahText(n, a){ const d = await DATA.surah(n), A = d.ayahs[a - 1]; return { ar: A.w.map(w => w[0]).join(" "), tr: trOf(A) }; }
async function shareText(n, a, b){
  b = b || a; const parts = [];
  for (let x = a; x <= b; x++) { const t = await ayahText(n, x); parts.push(`${t.ar} ﴿${x}﴾`); if (t.tr) parts.push(t.tr); }
  const text = `${parts.join("\n")}\n— ${META.surahs[n - 1].tr} ${n}:${a}${b !== a ? "-" + b : ""}\n${linkOf(n, a, b)}`;
  if (navigator.share) { try { await navigator.share({ text }); return; } catch(e) { if (e.name === "AbortError") return; } }
  try { await navigator.clipboard.writeText(text); toast(esc(T("copied"))); } catch(e) {}
}
/* designed image card (1080x1350) for WhatsApp Status / Instagram */
async function shareImage(n, a){
  const t = await ayahText(n, a), c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const g = c.getContext("2d");
  try { await document.fonts.load('60px "Amiri Quran"'); await document.fonts.load('40px "Crimson Pro"'); await document.fonts.load('34px "Noto Nastaliq Urdu"'); } catch(e) {}
  const bg = g.createRadialGradient(540, 520, 60, 540, 600, 900); bg.addColorStop(0, "#1F3B40"); bg.addColorStop(1, "#0D1A1F"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1350);
  g.strokeStyle = "#D4AF5A"; g.lineWidth = 3; g.strokeRect(48, 48, 984, 1254); g.globalAlpha = .4; g.strokeRect(62, 62, 956, 1226); g.globalAlpha = 1;
  const wrap = (text, font, maxW, rtl) => { g.font = font; g.direction = rtl ? "rtl" : "ltr"; const words = text.split(" "), lines = []; let cur = "";
    for (const w of words) { const test = cur ? cur + " " + w : w; if (g.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else cur = test; } if (cur) lines.push(cur); return lines; };
  let size = 64, arL; do { arL = wrap(t.ar, `${size}px "Amiri Quran", serif`, 900, true); if (arL.length * size * 1.9 < 620) break; size -= 4; } while (size > 30);
  const urT = /[؀-ۿ]/.test(t.tr); let ts = urT ? 34 : 36, trL;
  do { trL = wrap(t.tr, `${ts}px ${urT ? '"Noto Nastaliq Urdu"' : '"Crimson Pro"'}, serif`, 880, urT); if (trL.length * ts * (urT ? 2.1 : 1.45) < 380) break; ts -= 2; } while (ts > 20);
  const arH = arL.length * size * 1.9, trH = trL.length * ts * (urT ? 2.1 : 1.45), top = Math.max(120, (1350 - arH - trH - 260) / 2);
  g.textAlign = "center"; g.fillStyle = "#F3EDE0"; g.direction = "rtl"; g.font = `${size}px "Amiri Quran", serif`;
  arL.forEach((l, i) => g.fillText(l, 540, top + size * 1.3 + i * size * 1.9));
  let y = top + arH + 50; g.fillStyle = "#D4AF5A"; g.fillRect(470, y, 140, 2); y += 60;
  g.fillStyle = "#C9D6D2"; g.direction = urT ? "rtl" : "ltr"; g.font = `${ts}px ${urT ? '"Noto Nastaliq Urdu"' : '"Crimson Pro"'}, serif`;
  trL.forEach((l, i) => g.fillText(l, 540, y + i * ts * (urT ? 2.1 : 1.45)));
  g.direction = "ltr"; g.fillStyle = "#D4AF5A"; g.font = '600 34px "Crimson Pro", serif'; g.fillText(`${META.surahs[n - 1].tr} · ${n}:${a}`, 540, 1180);
  g.fillStyle = "#9DB0AE"; g.font = '30px "Crimson Pro", serif'; g.fillText("qurantosoul.com", 540, 1235);
  const blob = await new Promise(r => c.toBlob(r, "image/png")), file = new File([blob], `quran-${n}-${a}.png`, { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text: linkOf(n, a) }); return; } catch(e) { if (e.name === "AbortError") return; } }
  const u = URL.createObjectURL(blob), l = document.createElement("a"); l.href = u; l.download = file.name; l.click(); setTimeout(() => URL.revokeObjectURL(u), 4000);
}
async function showTafsir(book, n, a){
  const box = $("#amExtra"); box.innerHTML = `<div class="loading" style="padding:20px">${T("loading")}</div>`;
  try {
    const d = await DATA.tafsir(book, n), ix = d.a[a - 1];
    box.innerHTML = `<h3>${book === "jalalayn" ? T("tafJal") : T("tafIK")}</h3>${ix >= 0 ? `<div class="taf" dir="rtl" lang="ar">${esc(d.t[ix]).replace(/\n+/g, "<br>")}</div>` : `<p class="muted">${T("tafNone")}</p>`}
      <div class="draft">${T("tafSrc")} — ${book === "jalalayn" ? "Jalal al-Din al-Mahalli & Jalal al-Din al-Suyuti" : "Ismail ibn Kathir"}</div>`;
    box.scrollIntoView({ block: "start", behavior: "smooth" });
  } catch(e) { box.innerHTML = `<p class="muted">${T("loadFail")}</p>`; }
}
async function showSimilar(n, a){
  const list = (SIMS && SIMS[n + ":" + a]) || [], box = $("#amExtra");
  const items = await Promise.all(list.map(async ([ref, run]) => { const [s, x] = ref.split(":").map(Number), t = await ayahText(s, x);
    return `<li><button data-go2="${ref}"><div class="oa">${esc(t.ar)}</div><div class="or">${esc(surahName(s))} ${nf(s)}:${nf(x)}</div></button></li>`; }));
  box.innerHTML = `<h3>${T("simH")}</h3><ul class="occ">${items.join("")}</ul>`;
  box.scrollIntoView({ block: "start", behavior: "smooth" });
}
function noteEditor(n, a){
  const k = n + ":" + a, cur = U.notes[k] ? U.notes[k].t : "";
  $("#amExtra").innerHTML = `<h3>${T("note")}</h3><textarea id="noteTx" class="notetx" rows="5" placeholder="${T("notePh")}">${esc(cur)}</textarea>
    <div class="wd-actions"><button data-am="noteSave">${T("save")}</button>${cur ? `<button data-am="noteDel">${T("del")}</button>` : ""}</div>`;
  $("#noteTx").focus();
}
function rangePicker(n, a){
  const max = META.surahs[n - 1].ayahs;
  $("#amExtra").innerHTML = `<h3>${T("shareRange")}</h3><label class="rng">${T("toAyah")} <input id="rngTo" type="number" min="${a}" max="${max}" value="${Math.min(a + 2, max)}"></label>
    <div class="wd-actions"><button data-am="rangeGo">${T("share")}</button></div>`;
}
function reportMistake(ref){
  const body = T("reportBody") + `Location: ${ref}\nApp: ${location.href}\nLanguage: ${settings.lang}`;
  location.href = `mailto:qurantosoulapp@gmail.com?subject=${encodeURIComponent(T("reportSubj", ref))}&body=${encodeURIComponent(body)}`;
}
$("#sheetBody").addEventListener("click", async e => {
  const k = $("#sheetBody").dataset.ayah; if (!k) return;
  const [n, a] = k.split(":").map(Number);
  const g2 = e.target.closest("[data-go2]"); if (g2) { const [s, x] = g2.dataset.go2.split(":").map(Number); closeAll(); openSurah(s, x); return; }
  const hl = e.target.closest("[data-hl]");
  if (hl) { if (hl.dataset.hl) U.hl[k] = hl.dataset.hl; else delete U.hl[k]; saveU(); refreshAyah(n, a); document.querySelectorAll(".am-hl [data-hl]").forEach(b => b.setAttribute("aria-pressed", b.dataset.hl === (U.hl[k] || ""))); return; }
  const b = e.target.closest("[data-am]"); if (!b) return;
  const act = b.dataset.am;
  if (act === "play") { closeAll(); playFrom(n, a); }
  else if (act === "bm") { if (U.bm[k]) delete U.bm[k]; else U.bm[k] = Date.now(); saveU(); refreshAyah(n, a); b.textContent = U.bm[k] ? "★ " + T("unbookmark") : "☆ " + T("bookmark"); toast(esc(T("saved"))); }
  else if (act === "note") noteEditor(n, a);
  else if (act === "noteSave") { const t = $("#noteTx").value.trim(); if (t) U.notes[k] = { t, ts: Date.now() }; else delete U.notes[k]; saveU(); refreshAyah(n, a); toast(esc(T("saved"))); closeAll(); }
  else if (act === "noteDel") { delete U.notes[k]; saveU(); refreshAyah(n, a); closeAll(); }
  else if (act === "text") shareText(n, a);
  else if (act === "img") shareImage(n, a);
  else if (act === "range") rangePicker(n, a);
  else if (act === "rangeGo") { const to = Math.max(a, Math.min(+$("#rngTo").value || a, META.surahs[n - 1].ayahs)); shareText(n, a, to); }
  else if (act === "link") { try { await navigator.clipboard.writeText(linkOf(n, a)); toast(esc(T("copied"))); } catch(e) { toast(esc(linkOf(n, a))); } }
  else if (act === "jal") showTafsir("jalalayn", n, a);
  else if (act === "ik") showTafsir("ibnkathir", n, a);
  else if (act === "sim") showSimilar(n, a);
  else if (act === "loopA") { P.loop = { s:n, a, b:null }; toast(esc(T("loopA")) + " · " + nf(a)); closeAll(); }
  else if (act === "loopB") { if (a < P.loop.a) [P.loop.a, P.loop.b] = [a, P.loop.a]; else P.loop.b = a; toast(esc(T("loopOn", nf(P.loop.a), nf(P.loop.b)))); closeAll(); playFrom(n, P.loop.a); }
  else if (act === "loopOff") { P.loop = null; toast(esc(T("loopOff"))); closeAll(); }
  else if (act === "report") reportMistake(k);
});
/* the word sheet reuses #sheetBody: clear the ayah context when a word opens */
const _openWord = openWord;
openWord = function(a, i){ delete $("#sheetBody").dataset.ayah; return _openWord(a, i); };
/* ---- reading progress: an ayah counts as read after 1.5 s on screen ---- */
let rio = null; const seenT = {};
function trackReading(){
  if (rio) rio.disconnect();
  rio = new IntersectionObserver(es => es.forEach(e => {
    const k = CUR.n + ":" + e.target.dataset.a;
    if (e.isIntersecting) seenT[k] = setTimeout(() => { if (!U.read[k]) { U.read[k] = 1; const d = dayKey(); U.days[d] = (U.days[d] || 0) + 1; saveU(); } }, 1500);
    else clearTimeout(seenT[k]);
  }), { threshold: 0.6 });
  document.querySelectorAll(".ayah").forEach(el => rio.observe(el));
}
const _render = render;
render = function(){ _render(); trackReading(); };
/* ---- deep links: ?s=2&a=255 (or a=255-257) and &w=3 ---- */
function deepLink(){
  const q = new URLSearchParams(location.search), s = +q.get("s");
  if (!(s >= 1 && s <= 114)) return null;
  const a = parseInt(q.get("a") || "1", 10) || 1, w = +q.get("w") || null;
  return { s, a: Math.min(Math.max(1, a), META.surahs[s - 1].ayahs), w };
}
