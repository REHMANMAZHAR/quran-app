"use strict";
/* ---------- Reading comfort: players hide while reading, a tap brings the bars back, app text follows the phone,
   and the Dashboard shows where you left off with bookmarks (date and time). ---------- */
Object.assign(L.ur, { uizH:"ایپ کے متن کا سائز", uizAuto:"فون کے مطابق", uizSub:"مینو، بٹن، ترجمہ اور اسباق کا سائز (قرآن کا سائز ڈسپلے میں الگ ہے)", bmCardH:"جہاں چھوڑا تھا اور بُک مارکس", bmLast:"آخری بار پڑھا", bmTaf:"تفسیر", bmAt:t=>`${t} پر`, bmNone:"بُک مارک کے لیے آیت نمبر دبائیں ← بُک مارک", dBm:"جہاں چھوڑا اور بُک مارکس" });
Object.assign(L.en, { uizH:"App text size", uizAuto:"Follow phone", uizSub:"Menus, buttons, translation and lessons (the Quran's own size is under Display)", bmCardH:"Where you left off & bookmarks", bmLast:"Last read", bmTaf:"Tafsir", bmAt:t=>`at ${t}`, bmNone:"To bookmark, tap an ayah number → Bookmark", dBm:"Where you left off & bookmarks" });
/* ---- 1. the recitation bar and the small tafsir player hide with the other bars; a tap on the page brings them back ---- */
let hideT = 0;
function hideSoon(){ clearTimeout(hideT); hideT = setTimeout(() => { if (LV.view === "read" && settings.autoHide !== false && !document.querySelector("#sheet.on,#drawer.on,#picker.on")) document.body.classList.add("bars-off"); }, 3500); }
onA("play", hideSoon);
const _openLectureC = openLecture;
openLecture = function(...a){ const r = _openLectureC(...a); const au = $("#vpAudio"); if (au) au.addEventListener("play", () => { if ($("#vpanel").classList.contains("mini")) hideSoon(); }); return r; };
$("#vpanel").addEventListener("click", e => { if (e.target.closest("[data-v=mini]")) hideSoon(); });
$("#main").addEventListener("click", e => {
  if (e.target.closest(".w,.end,.tafbtn,.tafmark,button,a,input,select,label,.endbox")) return;
  if (LV.view !== "read") return;
  document.body.classList.toggle("bars-off");
  if (!document.body.classList.contains("bars-off") && (P.s && !P.audio.paused)) hideSoon();
});
/* ---- 2. app text size: follows the phone's text size on iPhone/iPad, or a size you pick ---- */
function phoneScale(){
  try { const d = document.createElement("div"); d.style.cssText = "font:-apple-system-body;position:absolute;visibility:hidden"; document.body.appendChild(d);
    const fs = getComputedStyle(d).fontSize, ok = d.style.font && /-apple-system-body/.test(d.style.font); d.remove();
    if (ok && /^\d/.test(fs)) return Math.min(1.6, Math.max(0.9, parseFloat(fs) / 17)); } catch(e) {}
  return 1.1;   // other phones: a little larger than before by default
}
function applyUiz(){ const v = settings.uiz && settings.uiz !== "auto" ? +settings.uiz : phoneScale(), r = document.documentElement.style; r.setProperty("--uiz", v); r.setProperty("--ts", (settings.ts || 1) * v); }   // translation and word meanings grow with it too
const _applySettingsU = applySettings;
applySettings = function(){ _applySettingsU(); applyUiz(); };
applyUiz();
addEventListener("pageshow", applyUiz); document.addEventListener("visibilitychange", () => { if (!document.hidden) applyUiz(); });
const _renderSettingsU = renderSettings;
renderSettings = function(){
  _renderSettingsU();
  const app = $("#st-app h3"); if (!app) return;
  const cur = settings.uiz || "auto", b = (v, l) => `<button data-uiz="${v}" aria-pressed="${String(cur) === String(v)}">${l}</button>`;
  app.insertAdjacentHTML("afterend", `<div class="st-row"><b>${T("uizH")}</b><div class="rtb-seg wide">${b("auto", T("uizAuto"))}${b(1, "100%")}${b(1.15, "115%")}${b(1.3, "130%")}${b(1.5, "150%")}</div><p class="ds-note">${T("uizSub")}</p></div>`);
  const disp = $("#st-disp h3"); if (disp && !$("#st-disp [data-stgo=app]")) disp.insertAdjacentHTML("afterend", `<p class="ds-note" style="margin:-4px 0 8px">${T("uizH")}: <button class="linkbtn" data-stgo="app">${T("stApp")} ›</button></p>`);
};
VIEWS.settings.render = renderSettings;
document.addEventListener("click", e => { const b = e.target.closest("[data-uiz]"); if (b) { settings.uiz = b.dataset.uiz === "auto" ? "auto" : +b.dataset.uiz; saveSettings(); renderSettings(); } });
/* ---- 3. where you left off: remember when, and show it with bookmarks on the Dashboard ---- */
const _storeSetC = store.set.bind(store);
store.set = function(k, v){ const r = _storeSetC(k, v); if (k === "last") _storeSetC("lastAt", Date.now()); return r; };
function when(ts){
  if (!ts) return "";
  const d = new Date(ts), now = new Date(), loc = settings.lang === "en" ? "en-GB" : "ur-PK";
  const time = new Intl.DateTimeFormat(loc, { hour: "numeric", minute: "2-digit" }).format(d);
  const day = d.toDateString() === now.toDateString() ? (settings.lang === "en" ? "Today" : "آج") : new Intl.DateTimeFormat(loc, { day: "numeric", month: "short" }).format(d);
  return `${day} · ${time}`;
}
function bmCard(){
  const last = store.get("last", null), lastAt = store.get("lastAt", 0), bms = Object.keys(U.bm || {}).sort((x, y) => U.bm[y] - U.bm[x]).slice(0, 6);
  const tf = typeof VS !== "undefined" ? ["ur", "en", "bq"].map(k => VS[k] && VS[k].n ? [k, VS[k].n, VS[k].t ? VS[k].t[VS[k].n] || 0 : 0] : null).filter(Boolean)[0] : null;
  const row = (attr, ico, title, sub, right) => `<li><button ${attr}><span class="bm-i">${ico}</span><span><b>${title}</b><small>${sub}</small></span><span class="bm-t">${right}</span></button></li>`;
  const ay = k => { const [s, a] = k.split(":").map(Number); return `${esc(surahName(s))} ${nf(s)}:${nf(a)}`; };
  return `<section class="hm-card bm-card"><h3>${T("bmCardH")}</h3><ul class="bm-list">
    ${last ? row(`data-bmgo="${last.s}:${last.a}"`, "📖", T("bmLast"), ay(last.s + ":" + last.a), esc(when(lastAt))) : ""}
    ${tf ? row(`data-bmtaf="${tf[0]}:${tf[1]}"`, "🎧", T("bmTaf"), `${esc(T(TAF_SER[tf[0]].num, nf(tf[1])))} · ${esc(T("bmAt", mmss(tf[2])))}`, "") : ""}
    ${bms.map(k => row(`data-bmgo="${k}"`, "★", ay(k), esc(when(U.bm[k])), `<span class="bm-del" data-bmdel="${k}" role="button" tabindex="0" aria-label="${esc(T("bmDel"))}">✕</span>`)).join("")}
    ${bms.length ? "" : `<li class="muted bm-none">${T("bmNone")}</li>`}</ul></section>`;
}
if (settings.dash && settings.dash.bm == null) settings.dash.bm = 1;
const _renderHomeC = renderHome;
renderHome = async function(){
  const p = _renderHomeC();
  if (settings.dash.bm) { const after = $("#home .hm-cont") || $("#home .pw"); const html = bmCard();
    if (after) after.insertAdjacentHTML("afterend", html); else $("#home").insertAdjacentHTML("afterbegin", html); }
  return p;
};
VIEWS.home.render = renderHome;
$("#home").addEventListener("click", e => {
  const g = e.target.closest("[data-bmgo]"); if (g) { const [s, a] = g.dataset.bmgo.split(":").map(Number); showView("read"); openSurah(s, a); return; }
  const t = e.target.closest("[data-bmtaf]"); if (t) { const [k, n] = t.dataset.bmtaf.split(":"); openLecture(k, +n); }
});
/* the dashboard switch for this card */
const _custSheetC = custSheet;
custSheet = function(){ _custSheetC(); const last = [...document.querySelectorAll("#sheetBody .cu-sw")].pop();
  if (last) last.insertAdjacentHTML("afterend", `<label class="ds-row ds-sw cu-sw"><span><b>${T("dBm")}</b></span><input type="checkbox" role="switch" data-cdash="bm"${settings.dash.bm ? " checked" : ""}><i aria-hidden="true"></i></label>`); };
