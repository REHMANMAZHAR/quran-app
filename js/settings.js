"use strict";
/* ---------- One Settings page: Display · Translation · Recitation · Tafsir · Learning · Prayer · App
   The reader's "Display" button opens this page at the Display section; the old Settings drawer tab and the separate Display sheet are gone. ---------- */
Object.assign(L.ur, { setT:"ترتیبات", setSub:"تمام ترتیبات ایک جگہ", stFind:"ترتیب تلاش کریں — مثلاً فونٹ، قاری", stDisp:"ڈسپلے", stTr:"ترجمہ اور معانی", stRec:"تلاوت", stTaf:"تفسیر", stLearn:"سیکھنا", stPr:"نماز اور یاد دہانی", stApp:"ایپ",
  stReset:"اصل حالت", stResetDone:"اصل ترتیبات بحال", stPrev:"نمونہ", stGl:"لفظی معنی کی زبان (پڑھتے وقت)", stTrNote:"جملے کا ترجمہ: ڈسپلے میں منتخب کریں", stOpenPr:"نماز کے اوقات اور الارم", stOpenRm:"اذکار اور پڑھائی کی یاد دہانیاں",
  stLang:"ایپ کی زبان", stCust:"نیچے کی پٹی اور ڈیش بورڈ", stHelp:"مدد", stBackup:"بیک اپ / بحالی (میرا قرآن)", stAbout:"ذرائع اور تعارف", stNone:"کچھ نہیں ملا" });
Object.assign(L.en, { setT:"Settings", setSub:"Everything in one place", stFind:"Find a setting — e.g. font, reciter", stDisp:"Display", stTr:"Translation & meanings", stRec:"Recitation", stTaf:"Tafsir", stLearn:"Learning", stPr:"Prayer & reminders", stApp:"App",
  stReset:"Reset", stResetDone:"Defaults restored", stPrev:"Preview", stGl:"Word-meaning language (while reading)", stTrNote:"Sentence translation: choose it under Display", stOpenPr:"Prayer times and alarms", stOpenRm:"Azkar and reading reminders",
  stLang:"App language", stCust:"Bottom bar and dashboard", stHelp:"Help", stBackup:"Backup / restore (My Quran)", stAbout:"Sources and about", stNone:"Nothing found" });
$("#sheetBody").classList.add("dsx");
const SECS = [["disp", "stDisp"], ["tr", "stTr"], ["rec", "stRec"], ["taf", "stTaf"], ["learn", "stLearn"], ["pr", "stPr"], ["app", "stApp"]];
const DISP_DEF = { qf: "uth", script: "uth", tajweed: false, wbw: true, showTr: true, pstyle: "plain", linesep: false, autoHide: true, size: 30, ts: 1, theme: "auto", paper: null, accent: "gold", arc: null, tbc: "blue", num: "en" };
let SET_GO = null;
/* the Display section reuses the Display controls: they are drawn into the page instead of the sheet */
const _displaySheetS2 = displaySheet;
function drawDisplayInto(host){
  const real = $("#sheetBody"); real.id = "sheetBody-x"; host.id = "sheetBody";
  try { _displaySheetS2(); } finally { host.id = "setDisp"; real.id = "sheetBody"; }
  host.querySelectorAll(".ds-h,[data-allset]").forEach(x => x.remove());
}
displaySheet = function(){
  const host = LV.view === "settings" && $("#setDisp");
  if (host) { drawDisplayInto(host); setPreview(); } else _displaySheetS2();
};
const seg = (attr, cur, opts) => `<div class="rtb-seg wide">${opts.map(([v, l]) => `<button data-${attr}="${v}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join("")}</div>`;
const row = (label, ctl) => `<div class="st-row"><b>${label}</b>${ctl}</div>`;
async function setPreview(){
  const box = $("#stPrev"); if (!box) return;
  try {
    const d = await DATA.surah(1), A = d.ayahs[1], tr = A[settings.tr] || A.ur || "";
    box.innerHTML = `<small>${T("stPrev")} · 1:2</small><div class="st-ayah" dir="rtl">${A.w.map((w, i) => `<span class="w"><span class="ar">${esc(wordText(1, 2, i, w[0]))}</span>${settings.wbw ? `<span class="g${glossOf(w).ur ? " ur" : ""}">${esc(glossOf(w).t)}</span>` : ""}</span>`).join("")}<span class="end">${ayNum(2)}</span></div>${settings.showTr !== false && tr ? `<p class="tr ${/^en/.test(settings.tr) ? "en" : "ur"}">${esc(tr)}</p>` : ""}`;
  } catch(e) {}
}
function renderSettings(){
  const el = $("#setv"), li = settings.lang === "en" ? 2 : 1;
  const recs = META.reciters.map(r => `<option value="${r[0]}"${settings.rec === r[0] ? " selected" : ""}>${esc(r[li])}</option>`).join("");
  el.innerHTML = `<div class="st-top"><input id="stq" class="search" type="search" placeholder="${esc(T("stFind"))}" aria-label="${esc(T("stFind"))}">
      <nav class="st-chips">${SECS.map(([k, l]) => `<button data-stgo="${k}">${T(l)}</button>`).join("")}</nav></div>
    <section class="st-sec" id="st-disp"><h3>${T("stDisp")}<button class="st-reset" data-streset="disp">↺ ${T("stReset")}</button></h3><div class="st-prev" id="stPrev"></div><div id="setDisp" class="dsx"></div></section>
    <section class="st-sec" id="st-tr"><h3>${T("stTr")}</h3>${row(T("stGl"), seg("stgl", settings.gl, [["ur", "اردو"], ["en", "English"]]))}<p class="ds-note">${T("stTrNote")}</p></section>
    <section class="st-sec" id="st-rec"><h3>${T("stRec")}</h3>${row(T("reciter"), `<select id="stRec" class="wide-sel">${recs}</select>`)}
      ${row(T("speed"), seg("stsp", settings.speed, [[0.75, T("slow")], [1, T("normal")], [1.25, T("fast")]]))}
      ${row(T("gapH"), seg("stgap", settings.gap || 0, [0, 1, 2, 3, 5].map(g => [g, g ? T("gapS", nf(g)) : T("gap0")])))}
      <div class="st-row"><b>${T("offH")}</b><div class="wd-actions" style="flex-direction:column;align-items:stretch"><button data-stx="pack">${T("offPack")}</button>${CUR ? `<button data-stx="audio">${T("dlAudio")} · ${esc(surahName(CUR.n))}</button>` : ""}</div></div></section>
    <section class="st-sec" id="st-taf"><h3>${T("stTaf")}</h3><div class="set">${tafSettingsHTML()}</div></section>
    <section class="st-sec" id="st-learn"><h3>${T("stLearn")}</h3>${typeof llSwitch === "function" ? llSwitch() : ""}</section>
    <section class="st-sec" id="st-pr"><h3>${T("stPr")}</h3><button class="ds ds-card" data-open="prayer"><span class="ds-mic">🕌</span><span><b>${T("stOpenPr")}</b></span></button><button class="ds ds-card" data-open="reminders"><span class="ds-mic">🔔</span><span><b>${T("stOpenRm")}</b></span></button></section>
    <section class="st-sec" id="st-app"><h3>${T("stApp")}</h3>${row(T("stLang"), seg("stlang", settings.lang, [["ur", "اردو"], ["en", "English"]]))}
      <button class="ds ds-card" data-cust="1"><span class="ds-mic">▦</span><span><b>${T("stCust")}</b></span></button>
      <button class="ds ds-card" data-stx="share"><span class="ds-mic">↗</span><span><b>${T("capShare")}</b></span></button>
      <button class="ds ds-card" data-open="me"><span class="ds-mic">⤓</span><span><b>${T("stBackup")}</b></span></button>
      <button class="ds ds-card" data-stx="help"><span class="ds-mic">?</span><span><b>${T("stHelp")}</b></span></button>
      <button class="ds ds-card" data-stx="fb"><span class="ds-mic">✉</span><span><b>${T("feedback")}</b></span></button>
      <details class="st-about"><summary>${T("stAbout")}</summary><div class="about">${T("sources")}<div class="en">Grammar data: ${esc(META.sources.morphology)}. ${esc(META.sources.audio)}. Word-by-word: ${esc(META.sources.wbw_en)}${META.sources.wbw_ur ? "; " + esc(META.sources.wbw_ur) : ""}. Translations: ${esc(META.sources.ur1)}, ${esc(META.sources.ur2)}, ${esc(META.sources.en2)}, ${esc(META.sources.en)}. Indo-Pak font: Quranic Universal Library (Tarteel). Full-surah recitations and timings: mp3quran.net.</div>${T("draftAbout")}<p style="font-size:13px;line-height:1.8">${T("scholarTxt")}</p></div></details></section>
    <p class="muted st-none" id="stNone" hidden>${T("stNone")}</p>`;
  drawDisplayInto($("#setDisp")); setPreview();
  if (SET_GO) { const t = $("#st-" + SET_GO); SET_GO = null; if (t) setTimeout(() => t.scrollIntoView({ block: "start" }), 30); }
}
VIEWS.settings = { el: "#setv", title: () => [T("setT"), T("setSub")], render: renderSettings };
function openSettings(sec){ SET_GO = sec || null; closeAll(); if (LV.view === "settings") renderSettings(); else showView("settings"); }
$("#btnSettings").onclick = () => openSettings();
$("#btnDisp").onclick = () => openSettings("disp");
const _openDrawerS = openDrawer;
openDrawer = function(t){ if (t === "settings") return openSettings(); _openDrawerS(t); };
document.querySelectorAll('.tabs [data-tab="settings"]').forEach(b => b.hidden = true);
document.addEventListener("click", e => {
  if (e.target.closest("[data-allset]")) { e.stopImmediatePropagation(); openSettings(); }
}, true);
$("#setv").addEventListener("click", async e => {
  const go = e.target.closest("[data-stgo]"); if (go) { const t = $("#st-" + go.dataset.stgo); if (t) t.scrollIntoView({ block: "start", behavior: "smooth" }); return; }
  const r = e.target.closest("[data-streset]"); if (r) { Object.assign(settings, DISP_DEF); delete settings.paper; delete settings.arc; saveSettings(); applySettings(); if (typeof applyQf === "function") applyQf(); renderSettings(); if (CUR) rerender(); toast(esc(T("stResetDone"))); return; }
  const gl = e.target.closest("[data-stgl]"); if (gl) { settings.gl = gl.dataset.stgl; saveSettings(); renderSettings(); if (CUR) rerender(); return; }
  const sp = e.target.closest("[data-stsp]"); if (sp) { settings.speed = +sp.dataset.stsp; P.audio.playbackRate = settings.speed; saveSettings(); renderSettings(); return; }
  const gp = e.target.closest("[data-stgap]"); if (gp) { settings.gap = +gp.dataset.stgap; saveSettings(); renderSettings(); return; }
  const lg = e.target.closest("[data-stlang]"); if (lg) { settings.lang = lg.dataset.stlang; saveSettings(); applyLang(); if (P.s) updateBar(); renderSettings(); if (CUR) rerender(); return; }
  const x = e.target.closest("[data-stx]"); if (!x) return;
  const k = x.dataset.stx;
  if (k === "pack") saveOfflinePack(); else if (k === "audio" && CUR) saveSurahAudio(CUR.n); else if (k === "share") shareApp(); else if (k === "help") openHelp();
  else if (k === "fb") location.href = `mailto:qurantosoulapp@gmail.com?subject=${encodeURIComponent(T("fbSubj"))}`;
});
$("#setv").addEventListener("change", e => {
  if (e.target.id === "stRec") { settings.rec = e.target.value; saveSettings(); if (P.s) playFrom(P.s, P.a, true); }
});
/* find a setting: hide the rows and sections that don't match */
$("#setv").addEventListener("input", e => {
  if (e.target.id !== "stq") return;
  const q = e.target.value.trim().toLowerCase(); let any = false;
  document.querySelectorAll("#setv .st-sec").forEach(sec => {
    const items = [...sec.querySelectorAll(".ds, .st-row, .set > *, .ll-sw, .ds-card")];
    let hit = !q || sec.querySelector("h3").textContent.toLowerCase().includes(q);
    items.forEach(it => { const m = !q || hit || it.textContent.toLowerCase().includes(q); it.hidden = !m; if (m) any = true; });
    sec.hidden = q && !hit && !items.some(it => !it.hidden);
  });
  $("#stNone").hidden = any || !q;
});
