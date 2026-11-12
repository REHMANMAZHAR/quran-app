"use strict";
/* ---------- v59: three reading-view fixes ---------- */

/* 1. Landscape on a phone: the top bar, the strip, the tab bar and the player left barely half the
      screen for the Quran - which is the one time you want more of it, not less. On a short
      landscape screen the reading view now starts with the top bar tucked away (the strip stays,
      so surah / para / progress are still there); a tap brings it back as usual. */
function shortLandscape(){
  return matchMedia("(orientation:landscape) and (max-height:520px)").matches;
}
function lsChrome(){
  if (typeof LV !== "undefined" && LV.view !== "read") return;
  if (settings.autoHide === false) return;
  if (document.querySelector("#sheet.on,#drawer.on,#picker.on")) return;
  if (shortLandscape()) document.body.classList.add("bars-off");
}
addEventListener("orientationchange", () => setTimeout(lsChrome, 250));
addEventListener("resize", () => { clearTimeout(lsChrome.t); lsChrome.t = setTimeout(lsChrome, 250); });

/* 2. First run: the help sheet used to cover the screen 0.9s after the first ayah appeared, before
      the reader had seen anything. Point at the help button instead and let them open it. */
if (typeof firstReadHelp === "function") {
  firstReadHelp = function(){
    const seen = store.get("helpSeen", {});
    if (seen.read) return;
    seen.read = 1; store.set("helpSeen", seen);
    setTimeout(() => toast(T("firstHelpTip"), 5200), 1400);
  };
}
Object.assign(L.ur, { firstHelpTip: "کسی لفظ کو دبا کر رکھیں — معنی، مادہ اور گرامر کھل جائے گی۔ مدد کے لیے ⓘ" });
Object.assign(L.en, { firstHelpTip: "Press and hold any word for its meaning, root and grammar. Tap ⓘ for help." });

setTimeout(lsChrome, 600);
