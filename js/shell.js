"use strict";
/* ---------- App shell: one clean top bar, a customisable bottom bar, a customisable dashboard, ✕ always top right ---------- */
Object.assign(L.ur, { tabRead:"قرآن", tabQuran:"قرآن", navPrayer:"نماز", custT:"اپنی مرضی سے ترتیب دیں", custBar:"نیچے کی پٹی", custBarSub:n=>`ڈیش بورڈ اور قرآن کے علاوہ ${ud(n)} چیزیں چنیں — باقی ڈیش بورڈ پر نظر آئیں گی`,
  custDash:"ڈیش بورڈ پر کیا دکھائیں", dPrayer:"نماز کے اوقات", dCont:"پڑھنا جاری رکھیں", dTiles:"شارٹ کٹس", dAyah:"آج کی آیت", custBtn:"ڈیش بورڈ ترتیب دیں", custMax:n=>`زیادہ سے زیادہ ${ud(n)}`, allSet:"تمام ترتیبات", paraShort:"پارہ", surahShort:"سورت" });
Object.assign(L.en, { tabRead:"Quran", tabQuran:"Quran", navPrayer:"Prayer", custT:"Customise", custBar:"Bottom bar", custBarSub:n=>`Pick ${n} besides Dashboard and Quran — the rest show on the Dashboard`,
  custDash:"Show on the Dashboard", dPrayer:"Prayer times", dCont:"Continue reading", dTiles:"Shortcuts", dAyah:"Ayah of the day", custBtn:"Customise dashboard", custMax:n=>`Up to ${n}`, allSet:"All settings", paraShort:"Para", surahShort:"Surah" });
const SVG = p => `<svg viewBox="0 0 24 24">${p}</svg>`;
/* every place you can go: [label key, icon colour, icon paths] */
const NAV = {
  home:     ["tabHome", "#13242A", `<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h4.5v-5.5h4V20h4.5V9.5"/>`],
  read:     ["tabQuran", "#13242A", `<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13"/>`],
  search:   ["capSearch", "#3E5C76", `<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>`],
  tafsir:   ["tlTafsir", "#8E2F3C", `<path d="M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5z"/><path d="M12 6.5v13M6.5 9.5h3M6.5 12.5h3M14.5 9.5h3M14.5 12.5h3"/>`],
  duas:     ["tabDuas", "#5B4B8A", `<path d="M7 21v-6.5C5.2 13.6 4 11.6 4 9.3V5.5c0-.8 1.2-.8 1.2 0V9M7 9V3.8c0-.8 1.3-.8 1.3 0V9M17 21v-6.5c1.8-.9 3-2.9 3-5.2V5.5c0-.8-1.2-.8-1.2 0V9M17 9V3.8c0-.8-1.3-.8-1.3 0V9"/>`],
  me:       ["tabMe", "#B8913A", `<path d="M6 3.5h12v17l-6-4-6 4z"/>`],
  prayer:   ["navPrayer", "#1F6E8C", `<path d="M12 3c-2 2.2-3 3.6-3 5h6c0-1.4-1-2.8-3-5zM6 21V12l6-4 6 4v9M4 21h16M10 21v-4a2 2 0 0 1 4 0v4"/>`],
  azkar:    ["tlAzkar", "#1E7A5A", `<path d="M12 3.5c-2.2 2.8-2.2 5.2 0 8 2.2-2.8 2.2-5.2 0-8z"/><path d="M5 20.5h14M7 20.5c0-4 2.2-6.5 5-6.5s5 2.5 5 6.5"/><circle cx="12" cy="17.5" r="1"/>`],
  learn:    ["tabLearn", "#2A5C9A", `<path d="M12 4 2.5 9 12 14l9.5-5zM6 11v4.5c1.5 1.5 3.7 2.5 6 2.5s4.5-1 6-2.5V11M21.5 9v5"/>`],
  games:    ["tabGames", "#A0522D", `<path d="M7 8h10a4 4 0 0 1 4 4.5l-.6 4a2.4 2.4 0 0 1-4.3 1.1L14.6 16H9.4l-1.5 1.6a2.4 2.4 0 0 1-4.3-1.1l-.6-4A4 4 0 0 1 7 8zM8 11v3M6.5 12.5h3M15.5 11.6h.01M17.5 13.4h.01"/>`],
  hifz:     ["tlHifz", "#C0562F", `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>`],
  qibla:    ["tlQibla", "#333F48", `<circle cx="12" cy="12" r="9"/><path d="m12 5 3 8h-6z"/><rect x="10" y="14.5" width="4" height="3.5" rx=".5"/>`],
  pdf:      ["tlPdf", "#2A5C9A", `<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 16.5h6M12 9.5v4"/>`],
  reminders:["tlRem", "#B8913A", `<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>`]
};
const NAV_PICK = 4, ACTIONS = { hifz: 1, qibla: 1, pdf: 1 };
if (!Array.isArray(settings.nav)) settings.nav = ["search", "tafsir", "duas", "me"];
if (!settings.dash) settings.dash = { prayer: 1, cont: 1, tiles: 1, ayah: 1 };
const barItems = () => ["home", "read", ...settings.nav.filter(k => NAV[k] && k !== "home" && k !== "read").slice(0, NAV_PICK)];
function goNav(k){
  if (k === "hifz") { const l = store.get("last", { s: 1, a: 1 }); showView("read"); openSurah(l.s, l.a).then(() => hzSetup()); }
  else if (k === "qibla") qiblaSheet();
  else if (k === "pdf") pdfSheet();
  else if (k === "read" && !CUR) { const l = store.get("last", { s: 1, a: 1 }); openSurah(l.s, l.a); }
  else showView(k);
}
/* bottom bar built from the user's choice */
labelTabs = function(){
  const bar = document.querySelector(".tabbar"); if (!bar) return;
  const cur = typeof LV !== "undefined" ? LV.view : "home";
  bar.innerHTML = barItems().map(k => `<button data-v="${k}" aria-selected="${k === cur || (k === "read" && cur === "page")}">${SVG(NAV[k][2])}<span>${T(NAV[k][0])}</span></button>`).join("");
};
document.querySelector(".tabbar").addEventListener("click", e => {
  const b = e.target.closest("[data-v]"); if (!b) return;
  e.stopImmediatePropagation();
  if (b.dataset.v !== LV.view || ACTIONS[b.dataset.v]) goNav(b.dataset.v);
}, true);
labelTabs();
/* tiles on the dashboard: everything that is not in the bottom bar */
document.addEventListener("click", e => {
  const o = e.target.closest("[data-nav]"); if (!o) return; goNav(o.dataset.nav);
});
const _renderHomeS = renderHome;
renderHome = async function(){
  const p = _renderHomeS(), el = $("#home"), D = settings.dash, inBar = barItems();
  if (!D.prayer) { const w = el.querySelector(".pw"); if (w) w.remove(); }
  if (!D.cont) { const c = el.querySelector(".hm-cont"); if (c) c.remove(); }
  const grid = el.querySelector(".qa-grid");
  if (grid) { if (!D.tiles) grid.remove(); else {
    const keys = Object.keys(NAV).filter(k => !inBar.includes(k) && !(k === "prayer" && D.prayer));
    grid.className = "qa-grid qa4"; grid.innerHTML = keys.map(k => `<button class="qa" data-nav="${k}"><span class="qa-ic" style="--c:${NAV[k][1]}">${SVG(NAV[k][2])}</span><span class="qa-t">${T(NAV[k][0])}</span></button>`).join(""); } }
  el.insertAdjacentHTML("beforeend", `<button class="hm-cust" data-cust="1"><svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z M13.5 6.5l4 4"/></svg>${T("custBtn")}</button>`);
  await p;
  if (!D.ayah) { const a = $("#hmAyah"); if (a) a.remove(); }
};
VIEWS.home.render = renderHome;
function custSheet(){
  const opts = Object.keys(NAV).filter(k => k !== "home" && k !== "read");
  const dash = [["prayer", "dPrayer"], ["cont", "dCont"], ["tiles", "dTiles"], ["ayah", "dAyah"]];
  $("#sheetBody").innerHTML = `<h3 class="ds-h">${T("custT")}</h3>
    <section class="ds"><b>${T("custBar")}</b><p class="ds-note" style="margin:2px 0 8px">${T("custBarSub", nf(NAV_PICK))}</p>
      <div class="cu-grid">${opts.map(k => `<button class="cu" data-cnav="${k}" aria-pressed="${settings.nav.includes(k)}"><span class="qa-ic" style="--c:${NAV[k][1]}">${SVG(NAV[k][2])}</span><span>${T(NAV[k][0])}</span></button>`).join("")}</div></section>
    <section class="ds"><b>${T("custDash")}</b>${dash.map(([k, l]) => `<label class="ds-row ds-sw cu-sw"><span><b>${T(l)}</b></span><input type="checkbox" role="switch" data-cdash="${k}"${settings.dash[k] ? " checked" : ""}><i aria-hidden="true"></i></label>`).join("")}</section>`;
  openSheet();
}
document.addEventListener("click", e => {
  if (e.target.closest("[data-cust]")) { custSheet(); return; }
  const c = e.target.closest("#sheetBody [data-cnav]"); if (!c) return;
  const k = c.dataset.cnav, i = settings.nav.indexOf(k);
  if (i >= 0) settings.nav.splice(i, 1);
  else { if (settings.nav.length >= NAV_PICK) settings.nav.shift(); settings.nav.push(k); }
  saveSettings(); labelTabs(); custSheet(); if (LV.view === "home") renderHome();
});
document.addEventListener("change", e => {
  const d = e.target.closest("[data-cdash]"); if (!d) return;
  settings.dash[d.dataset.cdash] = d.checked ? 1 : 0; saveSettings(); if (LV.view === "home") renderHome();
});
/* ---------- top bar ---------- */
$("#btnMenu").insertAdjacentHTML("afterend", `<button class="hpill" id="hSurah"><small></small><b></b><i>▾</i></button>`);
$("#btnPlay").insertAdjacentHTML("afterend", `
  <button class="iconbtn rdv" id="btnDisp" aria-label="Display">${ICO.display}<span class="cap" data-cap="dispT"></span></button>
  <button class="iconbtn rdv" id="btnHifz" aria-label="Hifz">${ICO.hifz}<span class="cap" data-cap="hifzT"></span></button>
  <button class="iconbtn rdv" id="btnPage" aria-label="Page">${ICO.page}<span class="cap" data-cap="pageT"></span></button>
  <button class="hpill" id="hPara"><small></small><b></b><i>▾</i></button>`);
function capLabels(){ document.querySelectorAll(".bar [data-cap]").forEach(c => { c.textContent = T(c.dataset.cap); }); }
capLabels();
const _applyLangS = applyLang;
applyLang = function(){ _applyLangS(); capLabels(); updPills(); };
function updPills(){
  if (!CUR || typeof META === "undefined" || !META) return;
  const S = META.surahs[CUR.n - 1], top = typeof topAyah === "function" && topAyah() ? +topAyah().dataset.a : (store.get("last", { a: 1 }).a || 1);
  $("#hSurah small").textContent = `${T("surahShort")} ${nf(S.n)}`; $("#hSurah b").textContent = S.ar;
  $("#hPara small").textContent = T("paraShort"); $("#hPara b").textContent = nf(paraOf(CUR.n, top));
}
$("#hSurah").onclick = () => openPicker("s");
$("#hPara").onclick = () => openPicker("p");
$("#btnDisp").onclick = () => { displaySheet(); openSheet(); };
$("#btnHifz").onclick = () => { hifzSheet(); openSheet(); };
$("#btnPage").onclick = () => openPageView();
let pillT; addEventListener("scroll", () => { if (LV.view !== "read") return; clearTimeout(pillT); pillT = setTimeout(updPills, 150); }, { passive: true });
const _openSurahS = openSurah;
openSurah = async function(...a){ const r = await _openSurahS(...a); updPills(); return r; };
/* the reading toolbar row is gone — its tools live in the top bar; keep only the "words you know" hairline */
surahTools = function(n){
  const p = LV.V && CUR ? surahKnown(CUR) : 0;
  return p ? `<div class="rtb-know top" title="${esc(T("knowSurah", nf(p)))}"><i style="width:${p}%"></i></div>` : "";
};
/* Display sheet links to the full settings */
const _displaySheetS = displaySheet;
displaySheet = function(){ _displaySheetS(); $("#sheetBody").insertAdjacentHTML("beforeend", `<button class="btn ghost wide" data-allset="1" style="margin-top:14px">⚙ ${T("allSet")}</button>`); };
document.addEventListener("click", e => { if (e.target.closest("[data-allset]")) { closeAll(); openDrawer("settings"); } });
/* ---------- ✕ goes back to where you came from ---------- */
const HIST = [];
const _showViewS = showView;
showView = function(v){
  if (LV.view && LV.view !== v) { HIST.push(LV.view); if (HIST.length > 20) HIST.shift(); }
  _showViewS(v);
  const rd = v === "read";
  document.body.classList.toggle("rd", rd);
  document.body.dataset.view = v;
  $("#btnBack").hidden = v === "home" || rd;
  $("#btnHelp").hidden = $("#btnSettings").hidden = v !== "home";
  document.querySelectorAll(".tabbar button").forEach(b => b.setAttribute("aria-selected", b.dataset.v === v || (b.dataset.v === "read" && v === "page")));
  if (rd) updPills();
};
$("#btnBack").onclick = () => {
  if (typeof G !== "undefined" && G && !G.done && LV.view === "learn") G = null;
  let to = "home"; while (HIST.length) { const p = HIST.pop(); if (p !== LV.view) { to = p; break; } }
  showView(to); HIST.pop();
};
