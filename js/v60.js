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
  _pzEnd60();
  if (!was || settings.size === was) return;
  const ts = Math.min(1.8, Math.max(.7, wasTs * (settings.size / was)));
  settings.ts = Math.round(ts * 100) / 100;
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
