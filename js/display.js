"use strict";
/* ---------- Reading toolbar (one row), Display sheet, Hifz sheet, themes and accent colours ---------- */
Object.assign(L.ur, {
  viewH:"دکھائیں", vWbw:"لفظی معنی", vTr:"ترجمہ", vBoth:"دونوں", vAr:"صرف عربی", paperH:"صفحے کا رنگ", pp_mint:"ہلکا سبز", pp_white:"سفید", pp_cream:"کریم", pp_sky:"ہلکا نیلا", pp_sand:"ریتلا", pp_navy:"گہرا نیلا", pp_black:"سیاہ",
  dispT:"ڈسپلے", hifzT:"حفظ", pageT:"صفحہ", tsizeH:"متن کا سائز", tjH:"تجوید کے رنگ", tjSub:"عثمانی رسم الخط میں قواعد رنگوں سے", tjKeyBtn:"رنگوں کا مطلب",
  themeH:"تھیم", thAuto:"خودکار", thLight:"روشن", thSepia:"سیپیا", thDark:"تاریک", accentH:"رنگ", moreSizes:"عربی اور ترجمہ الگ الگ سائز: سیٹنگز",
  ac_gold:"سنہری", ac_emerald:"زمردی", ac_lapis:"نیلا", ac_maroon:"عنابی", ac_slate:"سرمئی",
  hideH:"متن چھپائیں", hideSub:"خاموشی سے خود کو جانچیں — لفظ دبائیں تو ظاہر ہو", checkH:"پڑھ کر جانچیں", checkSub:"زبانی پڑھیں، ایپ ہر لفظ سنے گی اور غلطیاں بتائے گی",
  hifzOn:"حفظ موڈ — متن چھپا ہے", showText:"متن دکھائیں"
});
Object.assign(L.en, {
  viewH:"Show", vWbw:"Word by word", vTr:"Translation", vBoth:"Both", vAr:"Arabic only", paperH:"Page colour", pp_mint:"Mint", pp_white:"White", pp_cream:"Cream", pp_sky:"Sky", pp_sand:"Sand", pp_navy:"Navy", pp_black:"Black",
  dispT:"Display", hifzT:"Hifz", pageT:"Page", tsizeH:"Text size", tjH:"Tajweed colours", tjSub:"Rules shown in colour, Uthmani script", tjKeyBtn:"What the colours mean",
  themeH:"Theme", thAuto:"Auto", thLight:"Light", thSepia:"Sepia", thDark:"Dark", accentH:"Accent colour", moreSizes:"Separate Arabic and translation sizes: Settings",
  ac_gold:"Gold", ac_emerald:"Emerald", ac_lapis:"Lapis", ac_maroon:"Maroon", ac_slate:"Slate",
  hideH:"Hide the text", hideSub:"Test yourself quietly — tap a word to peek", checkH:"Recite and check", checkSub:"Recite aloud; the app listens to every word and marks mistakes",
  hifzOn:"Hifz mode — text hidden", showText:"Show text"
});
const ACCENTS = ["gold", "emerald", "lapis", "maroon", "slate"];
if (!settings.accent) settings.accent = "gold";
function applyAccent(){ document.documentElement.setAttribute("data-accent", settings.accent || "gold"); }
applyAccent();
const _applySettingsD = applySettings;
applySettings = function(){ _applySettingsD(); applyAccent(); };
const ICO = {
  display:`<svg viewBox="0 0 24 24"><path d="M3.5 18.5 8.5 5.5l5 13M5.4 13.8h6.2"/><path d="M15.5 11.2c.6-1 1.6-1.5 2.8-1.5 1.8 0 2.7 1 2.7 2.8v6M21 14.6c-3.8-.3-5.6.6-5.6 2.2 0 1.1.8 1.8 2 1.8 2 0 3.6-1.5 3.6-4"/></svg>`,
  hifz:`<svg viewBox="0 0 24 24"><path d="M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5z"/><path d="M12 6.5v13"/><path d="m14.6 12.2 1.6 1.6 3-3.2"/></svg>`,
  page:`<svg viewBox="0 0 24 24"><rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5"/></svg>`
};
/* the reading toolbar: script switch + three tools; knowledge bar as a hairline under it */
surahTools = function(n){
  const p = LV.V && CUR ? surahKnown(CUR) : 0, hid = document.body.classList.contains("hifz");
  const sc = v => settings.script === v ? ' aria-pressed="true"' : ' aria-pressed="false"';
  return `<div class="rtb">
      <div class="rtb-seg" role="group"><button data-tool="script" data-v="uth"${sc("uth")}>${T("uthmani")}</button><button data-tool="script" data-v="ip"${sc("ip")}>${T("indopak")}</button></div>
      <div class="rtb-act">
        <button class="rtb-b" data-tool="display" aria-label="${T("dispT")}">${ICO.display}<span>${T("dispT")}</span></button>
        <button class="rtb-b" data-tool="hifzmenu" aria-label="${T("hifzT")}" aria-pressed="${hid}">${ICO.hifz}<span>${T("hifzT")}</span></button>
        <button class="rtb-b" data-tool="page" aria-label="${T("pageT")}">${ICO.page}<span>${T("pageT")}</span></button>
      </div></div>
    ${p ? `<div class="rtb-know" title="${esc(T("knowSurah", nf(p)))}"><i style="width:${p}%"></i></div><p class="rtb-kt">${T("knowSurah", nf(p))}</p>` : ""}`;
};
/* Display sheet */
function displaySheet(){
  const pct = Math.round((settings.size / 30) * 100), th = settings.theme || "auto";
  const vm = settings.wbw && settings.showTr !== false ? "both" : settings.wbw ? "wbw" : settings.showTr === false ? "ar" : "tr";
  const vb = (v, k) => `<button data-vm="${v}" aria-pressed="${vm === v}">${T(k)}</button>`;
  const dark = th === "dark" || (th === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  const papers = th === "sepia" ? [] : dark ? ["navy", "black"] : ["mint", "white", "cream", "sky", "sand"];
  const cur = settings.paper || "mint";
  const seg = (v, k) => `<button data-th="${v}" aria-pressed="${th === v}">${T(k)}</button>`;
  $("#sheetBody").innerHTML = `<h3 class="ds-h">${T("dispT")}</h3>
    <section class="ds"><b>${T("viewH")}</b><div class="rtb-seg wide">${vb("wbw", "vWbw")}${vb("tr", "vTr")}${vb("both", "vBoth")}${vb("ar", "vAr")}</div></section>
    <section class="ds"><div class="ds-row"><b>${T("tsizeH")}</b><span class="muted">${nf(pct)}%</span></div>
      <div class="ds-size"><button data-ds="-1" aria-label="${T("smaller")}">A−</button><div class="ds-prev" style="font-size:${settings.size}px">بِسْمِ ٱللَّهِ</div><button data-ds="1" aria-label="${T("bigger")}">A+</button></div>
      <p class="ds-note">${T("moreSizes")}</p></section>
    <section class="ds"><label class="ds-row ds-sw"><span><b>${T("tjH")}</b><small>${T("tjSub")}</small></span>
      <input type="checkbox" role="switch" id="dsTj"${settings.tajweed ? " checked" : ""}><i aria-hidden="true"></i></label>
      ${settings.tajweed ? `<details class="tjd"><summary>${T("tjKeyBtn")}</summary>${tajLegendHTML()}</details>` : ""}</section>
    <section class="ds"><b>${T("themeH")}</b><div class="rtb-seg wide">${seg("auto", "thAuto")}${seg("light", "thLight")}${seg("sepia", "thSepia")}${seg("dark", "thDark")}</div></section>
    ${papers.length ? `<section class="ds"><b>${T("paperH")}</b><div class="ds-acc">${papers.map(p => `<button data-paper="${p}" class="acc pp-${p}" aria-pressed="${cur === p || (dark && p === "navy" && cur !== "black")}" aria-label="${T("pp_" + p)}"><i></i><small>${T("pp_" + p)}</small></button>`).join("")}</div></section>` : ""}
    <section class="ds"><b>${T("accentH")}</b><div class="ds-acc">${ACCENTS.map(a => `<button data-acc="${a}" class="acc acc-${a}" aria-pressed="${settings.accent === a}" aria-label="${T("ac_" + a)}"><i></i><small>${T("ac_" + a)}</small></button>`).join("")}</div></section>`;
}
/* Hifz sheet */
function hifzSheet(){
  const hid = document.body.classList.contains("hifz");
  $("#sheetBody").innerHTML = `<h3 class="ds-h">${T("hifzT")}</h3>
    <label class="ds ds-row ds-sw"><span><b>${T("hideH")}</b><small>${T("hideSub")}</small></span><input type="checkbox" role="switch" id="dsHide"${hid ? " checked" : ""}><i aria-hidden="true"></i></label>
    <button class="ds ds-card" data-hz="setup"><span class="ds-mic"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg></span>
      <span><b>${T("checkH")}</b><small>${T("checkSub")}</small></span></button>`;
}
function setHide(on){
  document.body.classList.toggle("hifz", on);
  document.querySelectorAll(".w.shown").forEach(x => x.classList.remove("shown"));
  if (CUR) rerender(); hifzPill();
}
function hifzPill(){
  let pill = document.getElementById("hifzPill");
  const show = document.body.classList.contains("hifz") && !document.body.classList.contains("hzon") && LV.view === "read";
  if (!show) { if (pill) pill.remove(); return; }
  if (!pill) { pill = document.createElement("div"); pill.id = "hifzPill"; document.body.appendChild(pill); }
  pill.innerHTML = `<span>${T("hifzOn")}</span><button data-hide-off="1">${T("showText")}</button>`;
}
$("#main").addEventListener("click", e => {
  const b = e.target.closest("[data-tool=display],[data-tool=hifzmenu]"); if (!b) return;
  e.stopImmediatePropagation();
  if (b.dataset.tool === "display") displaySheet(); else hifzSheet();
  openSheet();
}, true);
document.addEventListener("click", e => {
  if (e.target.closest("[data-hide-off]")) { setHide(false); return; }
  const d = e.target.closest("#sheetBody [data-ds]"); if (d) { const k = +d.dataset.ds;
    settings.size = Math.min(48, Math.max(16, settings.size + k * 2)); settings.ts = Math.round(Math.min(1.8, Math.max(0.7, (settings.ts || 1) + k * 0.1)) * 100) / 100;
    saveSettings(); displaySheet(); return; }
  const th = e.target.closest("#sheetBody [data-th]"); if (th) { settings.theme = th.dataset.th; saveSettings(); displaySheet(); return; }
  const vm = e.target.closest("#sheetBody [data-vm]"); if (vm) { const v = vm.dataset.vm; settings.wbw = v === "wbw" || v === "both"; settings.showTr = v === "tr" || v === "both"; saveSettings(); displaySheet(); return; }
  const pp = e.target.closest("#sheetBody [data-paper]"); if (pp) { settings.paper = pp.dataset.paper; saveSettings(); displaySheet(); return; }
  const ac = e.target.closest("#sheetBody [data-acc]"); if (ac) { settings.accent = ac.dataset.acc; saveSettings(); displaySheet(); return; }
});
document.addEventListener("change", e => {
  if (e.target.id === "dsTj") { settings.tajweed = e.target.checked; if (settings.tajweed && settings.script === "ip") { settings.script = "uth"; document.documentElement.classList.remove("ipk"); } saveSettings(); displaySheet(); if (CUR) rerender(); }
  else if (e.target.id === "dsHide") { setHide(e.target.checked); if (e.target.checked) closeAll(); }
});
/* keep the pill in sync when views change or a hifz check starts/ends */
const _showViewD = showView;
showView = function(v){ _showViewD(v); hifzPill(); };
new MutationObserver(hifzPill).observe(document.body, { attributes: true, attributeFilter: ["class"] });
/* settings: theme gets Sepia, plus accent swatches */
const _drawDrawerD = drawDrawer;
drawDrawer = function(){
  _drawDrawerD();
  if (tab !== "settings") return;
  const set = document.querySelector("#drBody .set"); if (!set) return;
  const seg = set.querySelector('[data-set="theme"]'); if (seg && !set.querySelector('[data-set="theme"][data-v="sepia"]')) {
    const b = document.createElement("button"); b.dataset.set = "theme"; b.dataset.v = "sepia"; b.setAttribute("aria-pressed", settings.theme === "sepia"); b.textContent = T("thSepia");
    seg.parentNode.insertBefore(b, seg.parentNode.lastElementChild);
    seg.parentNode.classList.add("seg4");
  }
  set.insertAdjacentHTML("beforeend", `<span class="lbl">${T("accentH")}</span><div class="ds-acc">${ACCENTS.map(a => `<button data-acc2="${a}" class="acc acc-${a}" aria-pressed="${settings.accent === a}" aria-label="${T("ac_" + a)}"><i></i><small>${T("ac_" + a)}</small></button>`).join("")}</div>`);
};
$("#drBody").addEventListener("click", e => { const a = e.target.closest("[data-acc2]"); if (a) { settings.accent = a.dataset.acc2; saveSettings(); drawDrawer(); } });
/* ---------- auto-scroll: hands-free reading ---------- */
Object.assign(L.ur, { asH:"خودکار اسکرول", asSub:"صفحہ خود آہستہ آہستہ اوپر جائے — رفتار کم یا زیادہ کریں", asStart:"شروع کریں", asSpeed:n=>`رفتار ${ud(n)}`, asPause:"روکیں", asPlay:"چلائیں", asSlower:"آہستہ", asFaster:"تیز", asStop:"بند" });
Object.assign(L.en, { asH:"Auto-scroll", asSub:"The page moves up slowly by itself — make it slower or faster", asStart:"Start", asSpeed:n=>`Speed ${n}`, asPause:"Pause", asPlay:"Play", asSlower:"Slower", asFaster:"Faster", asStop:"Stop" });
const AS_SPEEDS = [8, 12, 17, 24, 33, 45, 60];   // pixels per second
const AS = { on: false, run: false, lv: settings.asLv != null ? settings.asLv : 2, last: 0, acc: 0, raf: 0 };
function asTick(t){
  if (!AS.on) return;
  if (AS.run) {
    const dt = AS.last ? Math.min(0.1, (t - AS.last) / 1000) : 0; AS.acc += AS_SPEEDS[AS.lv] * dt;
    if (AS.acc >= 1) { const px = Math.floor(AS.acc); AS.acc -= px; scrollBy(0, px);
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) { AS.run = false; asBar(); } }
  }
  AS.last = t; AS.raf = requestAnimationFrame(asTick);
}
function asBar(){
  let b = document.getElementById("asBar");
  if (!AS.on) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement("div"); b.id = "asBar"; document.body.appendChild(b); }
  b.innerHTML = `<button data-as="toggle" aria-label="${T(AS.run ? "asPause" : "asPlay")}">${AS.run ? `<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" style="fill:currentColor"/></svg>`}</button>
    <button data-as="-1" aria-label="${T("asSlower")}">−</button><span>${T("asSpeed", nf(AS.lv + 1))}</span><button data-as="1" aria-label="${T("asFaster")}">+</button>
    <button data-as="stop" aria-label="${T("asStop")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;
}
function asStart(){ AS.on = true; AS.run = true; AS.last = 0; cancelAnimationFrame(AS.raf); AS.raf = requestAnimationFrame(asTick); asBar(); }
function asStop(){ AS.on = false; AS.run = false; cancelAnimationFrame(AS.raf); asBar(); }
document.addEventListener("click", e => {
  const b = e.target.closest("[data-as]"); if (!b) return;
  const v = b.dataset.as;
  if (v === "start") { closeAll(); asStart(); }
  else if (v === "stop") asStop();
  else if (v === "toggle") { AS.run = !AS.run; AS.last = 0; asBar(); }
  else { AS.lv = Math.max(0, Math.min(AS_SPEEDS.length - 1, AS.lv + +v)); settings.asLv = AS.lv; saveSettings(); asBar(); }
});
/* a finger on the page pauses; leaving the reader stops */
addEventListener("touchstart", e => { if (AS.on && AS.run && !e.target.closest("#asBar")) { AS.run = false; asBar(); } }, { passive: true });
const _showViewAS = showView;
showView = function(v){ if (v !== "read") asStop(); _showViewAS(v); };
const _displaySheetAS = displaySheet;
displaySheet = function(){
  _displaySheetAS();
  $("#sheetBody").querySelector(".ds").insertAdjacentHTML("beforebegin", `<section class="ds ds-row"><span><b>${T("asH")}</b><small>${T("asSub")}</small></span><button class="btn" data-as="start">${T("asStart")}</button></section>`);
};
