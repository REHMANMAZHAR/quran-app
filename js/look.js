"use strict";
/* ---------- Display: Quran text colour, table colour, ayah numbers, page view; page view ayah numbers open the ayah menu ---------- */
Object.assign(L.ur, { arcH:"قرآن کے متن کا رنگ", tbcH:"جدول کا رنگ", numH:"آیت نمبر", pvH:"صفحہ وار مصحف", pvSub:"مدنی مصحف کے ۶۰۴ صفحات، صفحہ بہ صفحہ", dflt:"اصل",
  c_black:"سیاہ", c_navy:"گہرا نیلا", c_green:"سبز", c_maroon:"عنابی", c_brown:"بھورا", c_white:"سفید", c_cream:"کریم", c_mint:"ہلکا سبز", c_sky:"ہلکا نیلا", c_rose:"گلابی", t_blue:"نیلا", t_green:"سبز", t_rose:"گلابی", t_sand:"ریتلا", t_grey:"سرمئی" });
Object.assign(L.en, { arcH:"Quran text colour", tbcH:"Table colour", numH:"Ayah numbers", pvH:"Page view", pvSub:"The 604 pages of the Madinah Mushaf, page by page", dflt:"Default",
  c_black:"Black", c_navy:"Navy", c_green:"Green", c_maroon:"Maroon", c_brown:"Brown", c_white:"White", c_cream:"Cream", c_mint:"Mint", c_sky:"Sky", c_rose:"Rose", t_blue:"Blue", t_green:"Green", t_rose:"Rose", t_sand:"Sand", t_grey:"Grey" });
const ARC = { black: "#0B0B0B", navy: "#12326B", green: "#0F5A3A", maroon: "#7A1E2C", brown: "#5B3A1A", white: "#FFFFFF", cream: "#F3E3B5", mint: "#BDEBD3", sky: "#BFDDF8", rose: "#F6C9CF" };
const TBC = ["blue", "green", "rose", "sand", "grey"];
const isDark = () => { const th = settings.theme || "auto"; return th === "dark" || (th === "auto" && matchMedia("(prefers-color-scheme: dark)").matches); };
function applyLook(){
  const r = document.documentElement, c = settings.arc && ARC[settings.arc];
  if (c) { r.dataset.arc = settings.arc; r.style.setProperty("--arc", c); } else { delete r.dataset.arc; r.style.removeProperty("--arc"); }
  r.dataset.tbc = settings.tbc || "blue";
}
const _applySettingsK = applySettings;
applySettings = function(){ _applySettingsK(); applyLook(); };
applyLook();
const _displaySheetK = displaySheet;
displaySheet = function(){
  _displaySheetK();
  const body = $("#sheetBody"), dark = isDark(), arcs = dark ? ["white", "cream", "mint", "sky", "rose"] : ["black", "navy", "green", "maroon", "brown"];
  const sw = (attr, v, cls, label, on) => `<button data-${attr}="${v}" class="acc ${cls}" aria-pressed="${on}" aria-label="${esc(label)}"><i${v && ARC[v] ? ` style="background:${ARC[v]}"` : ""}></i><small>${esc(label)}</small></button>`;
  const nb = (v, l) => `<button data-num="${v}" aria-pressed="${(settings.num || "ur") === v}">${l}</button>`;
  const html = `<section class="ds"><b>${T("arcH")}</b><div class="ds-acc">${sw("arc", "", "arc-def", T("dflt"), !settings.arc || !arcs.includes(settings.arc))}${arcs.map(v => sw("arc", v, "", T("c_" + v), settings.arc === v)).join("")}</div></section>
    ${settings.pstyle === "table" ? `<section class="ds"><b>${T("tbcH")}</b><div class="ds-acc">${TBC.map(v => sw("tbc", v, "tbc-" + v, T("t_" + v), (settings.tbc || "blue") === v)).join("")}</div></section>` : ""}
    <section class="ds"><b>${T("numH")}</b><div class="rtb-seg wide">${nb("ar", "١٢٣")}${nb("ur", "۱۲۳")}${nb("en", "123")}</div></section>
    <button class="ds ds-card" data-pv="1"><span class="ds-mic">${ICO.page}</span><span><b>${T("pvH")}</b><small>${T("pvSub")}</small></span></button>`;
  const anchor = body.querySelector("[data-allset]");
  if (anchor) anchor.insertAdjacentHTML("beforebegin", html); else body.insertAdjacentHTML("beforeend", html);
};
document.addEventListener("click", e => {
  const a = e.target.closest("#sheetBody [data-arc]"); if (a) { settings.arc = a.dataset.arc || null; saveSettings(); displaySheet(); return; }
  const t = e.target.closest("#sheetBody [data-tbc]"); if (t) { settings.tbc = t.dataset.tbc; saveSettings(); displaySheet(); return; }
  const n = e.target.closest("#sheetBody [data-num]"); if (n) { settings.num = n.dataset.num; saveSettings(); displaySheet(); if (CUR) rerender(); return; }
  if (e.target.closest("#sheetBody [data-pv]")) { closeAll(); openPageView(); }
});
/* page view: the ayah number works like everywhere else — play, tafsir, bookmark, share */
$("#mushaf").addEventListener("click", e => {
  const b = e.target.closest("[data-pgam]"); if (!b) return;
  e.stopPropagation(); const [s, a] = b.dataset.pgam.split(":").map(Number); openAyahMenu(s, a);
}, true);
/* ayah number with the tafsir book stacked under it, so the end of an ayah takes little room */
const _renderK = render;
render = function(){
  _renderK();
  /* ayah number: right after the last word (inside its Arabic band in the printed table, else a small mark);
     tafsir book: with the translation — end of the sentence translation, else under the last word's meaning, else under the number */
  const tbl = settings.pstyle === "table";
  document.querySelectorAll("#main .last").forEach(l => {
    const e = l.querySelector(":scope > .end"); if (!e) return;
    const t = l.querySelector(":scope > .tafbtn"), w = l.querySelector(".w"), ay = l.closest(".ayah"), tr = ay && ay.querySelector(".tr");
    let box = null;
    if (tbl && w) w.querySelector(".ar").appendChild(e);
    else { box = document.createElement("span"); box.className = "endbox"; e.before(box); box.appendChild(e); }
    if (!t) return;
    if (tr && !tbl && settings.showTr !== false) { tr.appendChild(t); t.classList.add("tr-taf"); }
    else if (settings.wbw && w && w.querySelector(".g")) { w.querySelector(".g").appendChild(t); t.classList.add("g-taf"); }
    else if (box) box.appendChild(t);
    else e.after(t);
  });
};
/* a tap on the ayah number or tafsir book is not a tap on the word */
$("#main").addEventListener("pointerdown", e => { if (e.target.closest(".end,.tafbtn")) e.stopPropagation(); }, true);
/* page view: a tafsir book after every ayah number */
$("#mushaf").addEventListener("click", e => {
  const b = e.target.closest("[data-taf]"); if (!b) return;
  e.stopPropagation(); const [s, a] = b.dataset.taf.split(":").map(Number); playTafsir(s, a);
}, true);
new MutationObserver(() => {
  document.querySelectorAll("#mushaf .end[data-pgam]:not([data-tf])").forEach(e => {
    e.dataset.tf = 1; const [s, a] = e.dataset.pgam.split(":"); if (settings.tafMark === false) return;
    e.insertAdjacentHTML("afterend", `<button class="tafbtn pg-taf" data-taf="${s}:${a}" aria-label="${esc(T("tafFrom", nf(+a)))}">${TAF_ICO}</button>`);
  });
}).observe($("#mushaf"), { childList: true, subtree: true });
/* share the app */
Object.assign(L.ur, { capShare:"شیئر", shareApp:"QuranToSoul — مفت، بغیر اشتہارات کے قرآن: لفظ بہ لفظ اردو و انگریزی ترجمہ، تفسیر، تلاوت اور عربی سیکھیں", linkCopied:"لنک کاپی ہو گیا" });
Object.assign(L.en, { capShare:"Share", shareApp:"QuranToSoul — free, ad-free Quran: word-by-word Urdu and English, tafsir, recitation and Arabic lessons", linkCopied:"Link copied" });
async function shareApp(){
  const url = "https://qurantosoul.com/", text = T("shareApp");
  if (navigator.share) { try { await navigator.share({ title: "QuranToSoul", text, url }); return; } catch(e) { if (e && e.name === "AbortError") return; } }
  try { await navigator.clipboard.writeText(text + "\n" + url); toast(esc(T("linkCopied"))); } catch(e) { prompt("", url); }
}
$("#btnShare").onclick = shareApp;
