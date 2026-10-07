"use strict";
/* ---------- Reading display: font previews, page style, line separators, translation list, auto-hide bars, Go to ---------- */
Object.assign(L.ur, { fontH:"قرآن کا رسم الخط", fUth:"عثمانی", fIp:"انڈو پاک", fTaj:"عثمانی + تجوید", styleH:"صفحے کا انداز", stPlain:"سادہ", stBoxed:"خانوں میں (لفظی معنی)", linesSep:"سطروں کے درمیان لکیریں", autoHide:"پڑھتے وقت اوپر نیچے کی پٹیاں چھپائیں",
  trH:"ترجمہ منتخب کریں", trHide:"ترجمہ چھپائیں", goT:"جائیں", goSurah:"سورت", goAyah:"آیت", goPara:"پارہ", goPage:"صفحہ", goBtn:"جائیں" });
Object.assign(L.en, { fontH:"Quran script", fUth:"Uthmani", fIp:"Indo-Pak", fTaj:"Uthmani + Tajweed", styleH:"Page style", stPlain:"Plain", stBoxed:"Boxed (word meanings)", linesSep:"Lines between rows", autoHide:"Hide top and bottom bars while reading",
  trH:"Select translation", trHide:"Hide translation", goT:"Go to", goSurah:"Surah", goAyah:"Ayah", goPara:"Para", goPage:"Page", goBtn:"Go" });
if (settings.autoHide == null) settings.autoHide = true;
function applyReading(){
  document.body.classList.toggle("boxed", settings.pstyle === "boxed");
  document.body.classList.toggle("linesep", !!settings.linesep);
}
const _applySettingsR = applySettings;
applySettings = function(){ _applySettingsR(); applyReading(); };
applyReading();
/* Display sheet: replace the script buttons with preview tiles and add page style, lines, translation list, auto-hide */
const _displaySheetR = displaySheet;
displaySheet = function(){
  _displaySheetR();
  const body = $("#sheetBody"), scr = [...body.querySelectorAll("section.ds")].find(s => s.querySelector("[data-tool=script]"));
  const cur = settings.script === "ip" ? "ip" : settings.tajweed ? "taj" : "uth";
  const tile = (v, k, cls) => `<button class="fp${cur === v ? " on" : ""}" data-font="${v}"><span class="fp-c ${cls}">${v === "taj" ? `<span class="tj tj-madd_6">أَنزَلَ</span> <span class="tj tj-ghunnah">إِلَيْكَ</span>` : "أَنزَلَ إِلَيْكَ"}</span><b>${T(k)}</b></button>`;
  const fonts = `<section class="ds"><b>${T("fontH")}</b><div class="fp-row">${tile("ip", "fIp", "fp-ip")}${tile("uth", "fUth", "")}${tile("taj", "fTaj", "")}</div></section>`;
  if (scr) scr.outerHTML = fonts; else body.querySelector(".ds-h").insertAdjacentHTML("afterend", fonts);
  const tjSec = [...body.querySelectorAll("section.ds")].find(s => s.querySelector("#dsTj")); if (tjSec) tjSec.remove();
  const show = [...body.querySelectorAll("section.ds")].find(s => s.querySelector("[data-vm]"));
  const sw = (id, on, label) => `<label class="ds ds-row ds-sw"><span><b>${label}</b></span><input type="checkbox" role="switch" id="${id}"${on ? " checked" : ""}><i aria-hidden="true"></i></label>`;
  const trList = `<section class="ds"><b>${T("trH")}</b><ul class="trl">${[["none", T("trHide")], ...TRS.map(x => [x[0], settings.lang === "en" ? x[2] : x[1]])].map(([k, l]) =>
    `<li><button data-trsel="${k}" aria-pressed="${(settings.showTr === false ? "none" : settings.tr) === k}"><span>${esc(l)}</span><i>✓</i></button></li>`).join("")}</ul></section>`;
  const extra = `<section class="ds"><b>${T("styleH")}</b><div class="rtb-seg wide"><button data-pst="plain" aria-pressed="${settings.pstyle !== "boxed"}">${T("stPlain")}</button><button data-pst="boxed" aria-pressed="${settings.pstyle === "boxed"}">${T("stBoxed")}</button></div></section>
    ${sw("dsLines", settings.linesep, T("linesSep"))}${sw("dsAuto", settings.autoHide, T("autoHide"))}`;
  if (show) { show.insertAdjacentHTML("afterend", extra); show.insertAdjacentHTML("afterend", trList); }
};
document.addEventListener("click", async e => {
  const f = e.target.closest("#sheetBody [data-font]");
  if (f) { const v = f.dataset.font;
    settings.script = v === "ip" ? "ip" : "uth"; settings.tajweed = v === "taj"; saveSettings();
    document.documentElement.classList.toggle("ipk", settings.script === "ip");
    if (settings.script === "ip" && !IPK) { try { IPK = await DATA.indopak(); } catch(err){} }
    displaySheet(); if (CUR) rerender(); return; }
  const t = e.target.closest("#sheetBody [data-trsel]");
  if (t) { const k = t.dataset.trsel; if (k === "none") settings.showTr = false; else { settings.tr = k; settings.showTr = true; } saveSettings(); displaySheet(); if (CUR) rerender(); return; }
  const p = e.target.closest("#sheetBody [data-pst]");
  if (p) { settings.pstyle = p.dataset.pst; if (settings.pstyle === "boxed") settings.wbw = true; saveSettings(); displaySheet(); if (CUR) rerender(); }
});
document.addEventListener("change", e => {
  if (e.target.id === "dsLines") { settings.linesep = e.target.checked; saveSettings(); }
  else if (e.target.id === "dsAuto") { settings.autoHide = e.target.checked; saveSettings(); if (!settings.autoHide) document.body.classList.remove("bars-off"); }
});
/* auto-hide bars: scrolling down in the reader hides header and tabs; scrolling up or tapping the top brings them back */
let lastY = scrollY;
addEventListener("scroll", () => {
  const y = scrollY, dy = y - lastY; lastY = y;
  if (!settings.autoHide || LV.view !== "read") { document.body.classList.remove("bars-off"); return; }
  if (y < 80 || dy < -6) document.body.classList.remove("bars-off");
  else if (dy > 6) document.body.classList.add("bars-off");
}, { passive: true });
/* Go to: surah + ayah, para, or mushaf page */
function gotoHTML(){
  const s = CUR ? CUR.n : 1;
  return `<div class="go">
    <label>${T("goSurah")}<select id="goS">${META.surahs.map(S => `<option value="${S.n}"${S.n === s ? " selected" : ""}>${S.n}. ${esc(S.tr)} — ${esc(S.ar)}</option>`).join("")}</select></label>
    <label>${T("goAyah")}<input id="goA" type="number" inputmode="numeric" min="1" value="1"></label>
    <button class="btn wide" data-go-sa="1">${T("goBtn")}</button>
    <div class="go-or"><label>${T("goPara")}<input id="goP" type="number" inputmode="numeric" min="1" max="30" placeholder="1–30"></label><button class="btn ghost" data-go-p="1">${T("goBtn")}</button></div>
    <div class="go-or"><label>${T("goPage")}<input id="goPg" type="number" inputmode="numeric" min="1" max="604" placeholder="1–604"></label><button class="btn ghost" data-go-pg="1">${T("goBtn")}</button></div></div>`;
}
const _pickerHTMLR = pickerHTML;
pickerHTML = function(tab){
  if (tab !== "g") return _pickerHTMLR(tab).replace(/(<button data-pkt="p"[^>]*>[^<]*<\/button>)/, `$1<button data-pkt="g" aria-pressed="false">${T("goT")}</button>`);
  return _pickerHTMLR("s").replace(/aria-pressed="true"/, 'aria-pressed="false"').replace(/(<button data-pkt="p"[^>]*>[^<]*<\/button>)/, `$1<button data-pkt="g" aria-pressed="true">${T("goT")}</button>`).replace(/<div class="pk-grid">[\s\S]*<\/div>$/, gotoHTML());
};
document.addEventListener("click", e => {
  const go = e.target.closest("#picker [data-go-sa],#picker [data-go-p],#picker [data-go-pg]"); if (!go) return;
  let s, a;
  if (go.dataset.goSa) { s = +$("#goS").value; a = Math.max(1, Math.min(META.surahs[s - 1].ayahs, +$("#goA").value || 1)); }
  else if (go.dataset.goP) { const p = Math.max(1, Math.min(30, +$("#goP").value || 1)); [s, a] = META.juz[p - 1]; }
  else { const pg = Math.max(1, Math.min(604, +$("#goPg").value || 1)); let g = (EX && EX.pages && EX.pages[pg]) || 1; s = 1;
    while (s < 114 && g > META.surahs[s - 1].ayahs) { g -= META.surahs[s - 1].ayahs; s++; } a = g; }
  closePicker(); if (LV.view !== "read") showView("read"); openSurah(s, a);
});
document.addEventListener("change", e => { if (e.target.id === "goS") { const n = +e.target.value; const a = $("#goA"); if (a) { a.max = META.surahs[n - 1].ayahs; a.placeholder = `1–${META.surahs[n - 1].ayahs}`; } } });
/* boxed style: a space between word boxes lets each row justify to the full width */
const _renderR = render;
render = function(){
  _renderR();
  if (settings.pstyle === "boxed" || !settings.wbw) document.querySelectorAll("#main .ayah .words").forEach(w => { [...w.children].forEach(c => c.after(" ")); });
};
