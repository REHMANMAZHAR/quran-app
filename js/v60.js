"use strict";
/* ---------- v60: pinch behaviour ---------- */

/* Pinching out to make the text smaller was jumping to the mushaf-page view: the switch fired at
   60% (and at 82% whenever the Arabic size was 17 or less), which is inside the range you pass
   through on an ordinary zoom-out. The switch now needs a deliberate, much longer pinch, and the
   small-text shortcut is gone. */
pzSwitch = function(){
  if (!PZ.on) return false;
  if (LV.view === "read") return PZ.f < .38;
  if (LV.view === "page") return PZ.f > 1.75;
  return false;
};

/* Pinch used to resize the Arabic only, leaving the Urdu word meanings and the translation where
   they were. It now moves them together, in the same proportion, the way the A+ / A− buttons do. */
const _pzEnd60 = pzEnd;
pzEnd = function(){
  const was = settings.size, wasTs = settings.ts || 1;
  /* (v63) the Urdu keeps one fixed proportion to the Arabic. Before, each pinch multiplied the Urdu size and then
     clipped it at 1.8, so zooming in and back out left the meanings at their smallest (0.7). Now the proportion is
     remembered and only changes when you set the Urdu size yourself (A+ / A−). */
  let k = settings.tsk || wasTs / was;
  if (Math.abs(Math.min(2.2, Math.max(.7, was * k)) - wasTs) > .06) k = wasTs / was;   // you changed the Urdu size yourself
  _pzEnd60();
  if (!was || settings.size === was) return;
  settings.tsk = Math.round(k * 10000) / 10000;
  settings.ts = Math.round(Math.min(2.2, Math.max(.7, settings.size * k)) * 100) / 100;
  if (typeof applyUiz === "function") applyUiz();
  else document.documentElement.style.setProperty("--ts", settings.ts);
  saveSettings();
};

/* The reading view has two first-visit help triggers; v59 only replaced one, so the sheet still
   covered the screen on the first visit. Mark it seen and show the toast instead. */
const _showView60 = showView;
showView = function(v){
  if (v === "read") { const seen = store.get("helpSeen", {});
    if (!seen.read) { seen.read = 1; store.set("helpSeen", seen);
      setTimeout(() => toast(T("firstHelpTip"), 5200), 1400); } }
  _showView60(v);
};
