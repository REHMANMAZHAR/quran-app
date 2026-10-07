"use strict";
/* ---------- Surah / Para picker, Home quick actions (big colourful icons), Tasbeeh counter, Qibla direction ---------- */
const PARA_NAMES = ["الٓمٓ", "سَيَقُولُ", "تِلْكَ ٱلرُّسُلُ", "لَن تَنَالُوا", "وَٱلْمُحْصَنَاتُ", "لَا يُحِبُّ ٱللَّهُ", "وَإِذَا سَمِعُوا", "وَلَوْ أَنَّنَا", "قَالَ ٱلْمَلَأُ", "وَٱعْلَمُوا",
  "يَعْتَذِرُونَ", "وَمَا مِن دَآبَّةٍ", "وَمَا أُبَرِّئُ", "رُبَمَا", "سُبْحَانَ ٱلَّذِي", "قَالَ أَلَمْ", "ٱقْتَرَبَ", "قَدْ أَفْلَحَ", "وَقَالَ ٱلَّذِينَ", "أَمَّنْ خَلَقَ",
  "ٱتْلُ مَا أُوحِيَ", "وَمَن يَقْنُتْ", "وَمَا لِيَ", "فَمَنْ أَظْلَمُ", "إِلَيْهِ يُرَدُّ", "حمٓ", "قَالَ فَمَا خَطْبُكُمْ", "قَدْ سَمِعَ ٱللَّهُ", "تَبَارَكَ ٱلَّذِي", "عَمَّ"];
Object.assign(L.ur, { pkSurah:"سورت", pkPara:"پارہ", paraN:n=>`پارہ ${ud(n)}`, qaRead:"قرآن پڑھیں", qaPrayer:"نماز کے اوقات", qaDua:"دعائیں", qaTafsir:"تفسیر", qaLearn:"عربی سیکھیں", qaHifz:"حفظ جانچیں", qaTasbih:"تسبیح", qaQibla:"قبلہ",
  tsReset:"صفر", tsTarget:"ہدف", tsTap:"گننے کے لیے دبائیں", qbH:"قبلہ کی سمت", qbDeg:d=>`شمال سے ${ud(d)}° (گھڑی کی سمت)`, qbTurn:"فون کو سیدھا رکھیں اور گھمائیں جب تک کعبہ کا نشان اوپر نہ آ جائے", qbStart:"کمپاس شروع کریں", qbNoSensor:"اس فون میں کمپاس دستیاب نہیں — اوپر دی گئی ڈگری اور کسی کمپاس کی مدد لیں", qbFrom:n=>`مقام: ${n}` });
Object.assign(L.en, { pkSurah:"Surah", pkPara:"Para", paraN:n=>`Para ${n}`, qaRead:"Read Quran", qaPrayer:"Prayer times", qaDua:"Duas", qaTafsir:"Tafsir", qaLearn:"Learn Arabic", qaHifz:"Check hifz", qaTasbih:"Tasbeeh", qaQibla:"Qibla",
  tsReset:"Reset", tsTarget:"Target", tsTap:"Tap to count", qbH:"Qibla direction", qbDeg:d=>`${d}° from north (clockwise)`, qbTurn:"Hold the phone flat and turn until the Kaaba mark points up", qbStart:"Start compass", qbNoSensor:"This phone has no compass — use the degrees above with any compass", qbFrom:n=>`From: ${n}` });
/* which para (juz) contains surah s, ayah a */
function paraOf(s, a){ let k = 0; META.juz.forEach((j, i) => { if (s > j[0] || (s === j[0] && a >= j[1])) k = i; }); return k + 1; }
function pickerHTML(tab){
  const cur = CUR ? CUR.n : 0, top = typeof topAyah === "function" && topAyah() ? +topAyah().dataset.a : 1, cp = CUR ? paraOf(CUR.n, top) : 0;
  const cells = tab === "s"
    ? META.surahs.map(S => `<button class="pk-c${S.n === cur ? " on" : ""}" data-pks="${S.n}"><span class="pk-n">${nf(S.n)}</span><span class="pk-ar">${esc(S.ar)}</span><small>${esc(S.tr)}</small></button>`)
    : META.juz.map((j, i) => `<button class="pk-c${i + 1 === cp ? " on" : ""}" data-pkj="${i}"><span class="pk-n">${nf(i + 1)}</span><span class="pk-ar">${esc(PARA_NAMES[i])}</span><small>${esc(surahName(j[0]))} ${nf(j[0])}:${nf(j[1])}</small></button>`);
  return `<div class="pk-top"><button class="iconbtn" data-pkx="1" aria-label="${T("closeV") || "Close"}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg><span class="cap">${T("capClose")}</span></button>
      <div class="rtb-seg"><button data-pkt="s" aria-pressed="${tab === "s"}">${T("pkSurah")}</button><button data-pkt="p" aria-pressed="${tab === "p"}">${T("pkPara")}</button></div></div>
    <div class="pk-grid">${cells.join("")}</div>`;
}
function openPicker(tab = "s"){
  let el = document.getElementById("picker");
  if (!el) { el = document.createElement("div"); el.id = "picker"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); document.body.appendChild(el); }
  el.innerHTML = pickerHTML(tab); el.classList.add("on");
  const on = el.querySelector(".pk-c.on"); if (on) on.scrollIntoView({ block: "center" });
}
function closePicker(){ const el = document.getElementById("picker"); if (el) el.classList.remove("on"); }
document.addEventListener("click", e => {
  const pk = e.target.closest("#picker [data-pks],#picker [data-pkj],#picker [data-pkt],#picker [data-pkx]"); if (!pk) return;
  if (pk.dataset.pkx) return closePicker();
  if (pk.dataset.pkt) { document.getElementById("picker").innerHTML = pickerHTML(pk.dataset.pkt); return; }
  closePicker(); if (LV.view !== "read") showView("read");
  if (pk.dataset.pks) openSurah(+pk.dataset.pks, 1); else { const j = META.juz[+pk.dataset.pkj]; openSurah(j[0], j[1]); }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closePicker(); });
$("#btnTitle").onclick = () => openPicker("s");
/* toolbar: surah and para buttons next to Display / Hifz / Page (script switch moves into Display) */
const _surahToolsN = surahTools;
surahTools = function(n){
  const h = _surahToolsN(n), p = paraOf(n, 1);
  const pills = `<div class="pk-pills"><button class="pk-pill" data-pk="s"><span>${esc(META.surahs[n - 1].ar)}</span><i>▾</i></button><button class="pk-pill" data-pk="p"><span>${T("paraN", nf(p))}</span><i>▾</i></button></div>`;
  return h.replace(/<div class="rtb-seg" role="group">[\s\S]*?<\/div>/, pills);
};
$("#main").addEventListener("click", e => { const b = e.target.closest("[data-pk]"); if (b) openPicker(b.dataset.pk); });
/* script switch inside the Display sheet */
const _displaySheetN = displaySheet;
displaySheet = function(){
  _displaySheetN();
  const sc = v => settings.script === v ? ' aria-pressed="true"' : ' aria-pressed="false"';
  $("#sheetBody").querySelector(".ds-h").insertAdjacentHTML("afterend", `<section class="ds"><b>${settings.lang === "en" ? "Script" : "رسم الخط"}</b><div class="rtb-seg wide"><button data-tool="script" data-v="uth"${sc("uth")}>${T("uthmani")}</button><button data-tool="script" data-v="ip"${sc("ip")}>${T("indopak")}</button></div></section>`);
};
$("#sheetBody").addEventListener("click", async e => {
  const b = e.target.closest("[data-tool=script]"); if (!b) return;
  settings.script = b.dataset.v; saveSettings(); document.documentElement.classList.toggle("ipk", settings.script === "ip");
  if (settings.script === "ip" && !IPK) { try { IPK = await DATA.indopak(); } catch(err){} }
  displaySheet(); if (CUR) rerender();
});
/* ---------- Qibla ---------- */
function qiblaBearing(lat, lng){
  const K = [21.4225, 39.8262], f1 = rad(lat), f2 = rad(K[0]), dl = rad(K[1] - lng);
  return (deg(Math.atan2(Math.sin(dl) * Math.cos(f2), Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl))) + 360) % 360;
}
let qbHandler = null;
function qiblaSheet(){
  const L2 = prLoc(), b = Math.round(qiblaBearing(L2.lat, L2.lng));
  $("#sheetBody").innerHTML = `<h3 class="ds-h">${T("qbH")}</h3><p class="muted" style="margin:0">${T("qbFrom", esc(L2.name))}</p>
    <div class="qb-dial" id="qbDial"><div class="qb-rose"><span class="qb-n">N</span></div><div class="qb-needle" id="qbNeedle" style="transform:rotate(${b}deg)"><span>🕋</span></div></div>
    <p style="text-align:center;font-size:20px;font-weight:700;margin:6px 0">${T("qbDeg", nf(b))}</p>
    <p class="muted" style="text-align:center;font-size:13px">${T("qbTurn")}</p>
    <div style="display:flex;justify-content:center"><button class="btn" data-qb="go">${T("qbStart")}</button></div>`;
  openSheet();
}
document.addEventListener("click", async e => {
  if (!e.target.closest("#sheetBody [data-qb]")) return;
  const L2 = prLoc(), b = qiblaBearing(L2.lat, L2.lng);
  try { if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") { const r = await DeviceOrientationEvent.requestPermission(); if (r !== "granted") throw 0; } } catch(err) { toast(esc(T("qbNoSensor")), 4000); return; }
  if (qbHandler) removeEventListener("deviceorientationabsolute", qbHandler), removeEventListener("deviceorientation", qbHandler);
  let got = false;
  qbHandler = ev => { const heading = ev.webkitCompassHeading != null ? ev.webkitCompassHeading : (ev.absolute || ev.type === "deviceorientationabsolute") && ev.alpha != null ? (360 - ev.alpha) % 360 : null;
    if (heading == null) return; got = true;
    const d = document.getElementById("qbDial"), n = document.getElementById("qbNeedle"); if (!d) return;
    d.querySelector(".qb-rose").style.transform = `rotate(${-heading}deg)`; n.style.transform = `rotate(${b - heading}deg)`;
    n.classList.toggle("ok", Math.abs(((b - heading + 540) % 360) - 180) < 5); };
  addEventListener("deviceorientationabsolute", qbHandler); addEventListener("deviceorientation", qbHandler);
  setTimeout(() => { if (!got) toast(esc(T("qbNoSensor")), 4000); }, 2500);
});

/* ✕ on a page opened from the dashboard returns to the dashboard */
$("#btnBack").onclick = () => { if (typeof G !== "undefined" && G && !G.done && LV.view === "learn") G = null; showView(SUBPAGES[LV.view] ? "home" : "read"); };
/* header "Tafsir": pause/resume if a tafsir is playing, otherwise open the Tafsir page */
$("#btnTaf").onclick = () => {
  if (vCur && AUDIO_SER[vCur.series]) { const au = $("#vpAudio"); if (au) { au.paused ? au.play().catch(() => {}) : au.pause(); return; } }
  showView("tafsir");
};
