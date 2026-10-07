"use strict";
/* ---------- Learning language: Learn and Games (lessons, tests, quizzes, word meanings) in Urdu or English, independent of the app language ---------- */
Object.assign(L.ur, { llH:"سیکھنے کی زبان" });
Object.assign(L.en, { llH:"Learning language" });
if (!settings.llang) settings.llang = !/^en/.test(settings.tr || "") || settings.lang !== "en" ? "ur" : "en";
const LEARN_V = { learn: 1, games: 1 };
let REAL_LANG = null, llSync = false, LEMUR = null;
DATA.words().then(W => { LEMUR = W.lemUr; }).catch(() => {});
/* vocabulary and drill meanings follow the language on screen */
function swapMeanings(){
  const ur = settings.lang !== "en";
  if (LV.V) LV.V.words.forEach(w => { if (!w._en) w._en = [w[5], w[6], w[3], w[11]];
    if (ur && w[12]) { w[5] = w[12]; w[6] = ""; w[3] = w[13] || w._en[2]; w[11] = w[14] || w._en[3]; } else [w[5], w[6], w[3], w[11]] = w._en; });
  if (typeof DR !== "undefined" && DR) for (const k in DR) if (DR[k] && DR[k].items) DR[k].items.forEach(x => { if (x._en == null) x._en = x[7]; x[7] = ur && x[9] ? x[9] : x._en; });
}
function syncLearnLang(v){
  const real = REAL_LANG || settings.lang, want = LEARN_V[v] ? settings.llang : real;
  if (settings.lang === want) return;
  settings.lang = want; REAL_LANG = want === real ? null : real;
  llSync = true; try { applyLang(); } finally { llSync = false; }
  swapMeanings();
}
const _showViewLL = showView;
showView = function(v){ if (!llSync) { syncLearnLang(v); if (LEARN_V[v]) swapMeanings(); } _showViewLL(v); };
/* settings are always saved with the app language, never the temporary learning one */
const _saveSettingsLL = saveSettings;
saveSettings = function(){
  if (!REAL_LANG) return _saveSettingsLL();
  const t = settings.lang; settings.lang = REAL_LANG; store.set("settings", settings); settings.lang = t; applySettings();
};
const _drillsLL = drills;
drills = async function(){ const d = await _drillsLL(); swapMeanings(); return d; };
/* the switch on the Learn and Games pages */
function llSwitch(){
  return `<div class="ll-sw"><span>${T("llH")}</span><div class="rtb-seg"><button data-ll="ur" aria-pressed="${settings.llang === "ur"}">اردو</button><button data-ll="en" aria-pressed="${settings.llang === "en"}">English</button></div></div>`;
}
const addLL = sel => { const el = $(sel); if (el && !el.querySelector(".ll-sw")) el.insertAdjacentHTML("afterbegin", llSwitch()); };
const _learnHomeLL = learnHome;
learnHome = async function(...a){ const r = await _learnHomeLL(...a); if (LV.view === "learn") addLL("#learn"); return r; };
const _gamesHomeLL = gamesHome;
gamesHome = async function(...a){ const r = await _gamesHomeLL(...a); if (LV.view === "games") addLL("#learn"); return r; };
VIEWS.learn.render = () => learnHome();
VIEWS.games.render = gamesHome;
document.addEventListener("click", e => {
  const b = e.target.closest("[data-ll]"); if (!b) return;
  settings.llang = b.dataset.ll; saveSettings(); showView(LV.view); VIEWS[LV.view] && VIEWS[LV.view].render();
});
