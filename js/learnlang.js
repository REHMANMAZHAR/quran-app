"use strict";
/* ---------- Learn and Games: word meanings in Urdu, Roman Urdu or English (settings.lmean),
   and the lessons / questions in Urdu or English (settings.ltext), both independent of the app language ---------- */
Object.assign(L.ur, { lmH:"الفاظ کے معنی", ltH:"اسباق اور سوالات کی زبان", mUr:"اردو", mRo:"Roman", mEn:"English" });
Object.assign(L.en, { lmH:"Word meanings", ltH:"Lessons and questions in", mUr:"اردو", mRo:"Roman Urdu", mEn:"English" });
if (!settings.lmean) settings.lmean = settings.llang === "en" ? "en" : (!/^en/.test(settings.tr || "") || settings.lang !== "en") ? "ur" : "en";
if (!settings.ltext) settings.ltext = settings.lang || "ur";
delete settings.llang;
const LEARN_V = { learn: 1, games: 1 };
let REAL_LANG = null, llSync = false, LEMW = null;
DATA.words().then(W => { LEMW = W; }).catch(() => {});
/* the meaning of a dictionary entry (lemma) in the chosen language — used by the quiz on what you read */
function lemMean(li){ if (!LEMW) return ""; return settings.lmean === "ur" ? LEMW.lemUr[li] : settings.lmean === "ro" ? (LEMW.lemRo || [])[li] : ""; }
/* vocabulary and drill meanings follow the chosen meaning language */
function swapMeanings(){
  const m = settings.lmean;
  document.body.classList.toggle("lm-ur", m === "ur");
  if (LV.V) LV.V.words.forEach(w => { if (!w._en) w._en = [w[5], w[6], w[3], w[11]];
    if (m === "ur" && w[12]) { w[5] = w[12]; w[6] = ""; w[3] = w[13] || w._en[2]; w[11] = w[14] || w._en[3]; }
    else if (m === "ro" && w[15]) { w[5] = w[15]; w[6] = ""; w[3] = w[16] || w._en[2]; w[11] = w[17] || w._en[3]; }
    else [w[5], w[6], w[3], w[11]] = w._en; });
  if (typeof DR !== "undefined" && DR) for (const k in DR) if (DR[k] && DR[k].items) DR[k].items.forEach(x => { if (x._en == null) x._en = x[7]; x[7] = m === "ur" && x[9] ? x[9] : m === "ro" && x[10] ? x[10] : x._en; });
}
function syncLearnLang(v){
  const real = REAL_LANG || settings.lang, want = LEARN_V[v] ? settings.ltext : real;
  if (settings.lang === want) return;
  settings.lang = want; REAL_LANG = want === real ? null : real;
  llSync = true; try { applyLang(); } finally { llSync = false; }
}
const _showViewLL = showView;
showView = function(v){ if (!llSync) { syncLearnLang(v); swapMeanings(); } _showViewLL(v); };
/* settings are always saved with the app language, never the temporary learning one */
const _saveSettingsLL = saveSettings;
saveSettings = function(){
  if (!REAL_LANG) return _saveSettingsLL();
  const t = settings.lang; settings.lang = REAL_LANG; store.set("settings", settings); settings.lang = t; applySettings();
};
const _drillsLL = drills;
drills = async function(){ const d = await _drillsLL(); swapMeanings(); return d; };
/* the two switches at the top of Learn and Games */
function llSwitch(){
  const b = (k, v, l) => `<button data-${k}="${v}" aria-pressed="${settings[k === "lm" ? "lmean" : "ltext"] === v}">${l}</button>`;
  return `<div class="ll-sw"><span>${T("lmH")}</span><div class="rtb-seg">${b("lm", "ur", T("mUr"))}${b("lm", "ro", T("mRo"))}${b("lm", "en", T("mEn"))}</div></div>
    <div class="ll-sw ll-sm"><span>${T("ltH")}</span><div class="rtb-seg">${b("lt", "ur", "اردو")}${b("lt", "en", "English")}</div></div>`;
}
const addLL = sel => { const el = $(sel); if (el && !el.querySelector(".ll-sw")) el.insertAdjacentHTML("afterbegin", llSwitch()); };
const _learnHomeLL = learnHome;
learnHome = async function(...a){ const r = await _learnHomeLL(...a); if (LV.view === "learn") addLL("#learn"); return r; };
const _gamesHomeLL = gamesHome;
gamesHome = async function(...a){ const r = await _gamesHomeLL(...a); if (LV.view === "games") addLL("#learn"); return r; };
VIEWS.learn.render = () => learnHome();
VIEWS.games.render = gamesHome;
document.addEventListener("click", e => {
  const m = e.target.closest("[data-lm]"), t = e.target.closest("[data-lt]"); if (!m && !t) return;
  if (m) settings.lmean = m.dataset.lm; else settings.ltext = t.dataset.lt;
  saveSettings(); showView(LV.view); VIEWS[LV.view] && VIEWS[LV.view].render();
});
