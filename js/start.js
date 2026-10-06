"use strict";
/* ---------- start ---------- */
(async function(){
  applySettings();
  const metaP = DATA.meta();
  if (!settings.lang) {
    settings.lang = await pickLanguage();
    settings.tr = settings.lang === "en" ? "en2" : "ur";
    settings.gl = settings.lang === "en" ? "en" : "ur";
    saveSettings();
  }
  if (!settings.tr) settings.tr = settings.lang === "en" ? "en2" : "ur";
  if (!settings.gl) settings.gl = settings.lang === "en" ? "en" : "ur";
  applyLang();
  try { META = await metaP; }
  catch(e){ $("#main").innerHTML = `<div class="loading">${T("loadFail")}</div>`; return; }
  try { [EX, LV.V] = await Promise.all([DATA.extras(), DATA.vocab()]); } catch(e) {}
  DATA.senses().then(x => { SENSES = x; }).catch(() => {});
  const dl = deepLink();
  if (dl) { await openSurah(dl.s, dl.a, dl.w); history.replaceState(null, "", location.pathname); return registerSW(); }
  const last = store.get("last", null);
  await openSurah(last ? last.s : 1, last ? last.a : 1);
  showView("home");
  registerSW();
})();
function registerSW(){ if (!window.EMBED && "serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {}); }
