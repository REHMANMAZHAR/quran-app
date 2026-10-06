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
  const last = store.get("last", null);
  await openSurah(last ? last.s : 1, last ? last.a : 1);
  if (last && (last.s !== 1 || last.a !== 1)) toast(esc(T("resume", settings.lang === "en" ? META.surahs[last.s-1].tr : META.surahs[last.s-1].ar, last.a)));
  if (!window.EMBED && "serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
