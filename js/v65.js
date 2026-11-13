"use strict";
/* ---------- v65: the word sheet follows the word-meaning language ----------
   With an English interface and Urdu word meanings, the sheet's headings, the "why this meaning" note, the i'rab table and the
   translations of every place the word appears were all in English. Now, when the meanings are Urdu, the whole sheet is Urdu. */
function wshOn(){ WSH = settings.gl === "ur" && settings.lang === "en"; const sh = $("#sheet"); if (sh) { sh.classList.toggle("wsh-ur", WSH); if (WSH) sh.setAttribute("dir", "rtl"); else sh.removeAttribute("dir"); } }
function wshOff(){ if (!WSH) return; WSH = false; const sh = $("#sheet"); if (sh) { sh.classList.remove("wsh-ur"); sh.removeAttribute("dir"); } }
const _openWord65 = openWord;
openWord = function(){ wshOn(); return _openWord65.apply(this, arguments); };
const _closeAll65 = closeAll;
closeAll = function(){ wshOff(); return _closeAll65.apply(this, arguments); };
/* any other sheet that opens replaces the word sheet */
const _openSheet65 = openSheet;
openSheet = function(){ if (WSH && !$("#sheetBody .wd-actions, #sheetBody #occH, #sheetBody .seg-row")) wshOff(); return _openSheet65.apply(this, arguments); };
document.addEventListener("click", e => { if (WSH && e.target.closest("#scrim")) wshOff(); }, true);

/* ---------- Urdu font choice (Settings → Translation) ----------
   Noto Nastaliq: the app's font until now. Gulzar: a compact, book-style Nastaliq, the closest free font to the printed
   IndoPak copies (self-hosted, SIL Open Font License). Naskh: plain upright letters, easiest at small sizes. */
const URF = [
  ["noto", "'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif", "نستعلیق"],
  ["gulzar", "'Gulzar','Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif", "کتابی نستعلیق"],
  ["naskh", "'Noto Naskh Arabic','Scheherazade New',serif", "نسخ"]
];
Object.assign(L.ur, { stUrF:"اردو کا خط" });
Object.assign(L.en, { stUrF:"Urdu font" });
function applyUrf(){
  const f = URF.find(x => x[0] === (settings.urf || "noto")) || URF[0];
  document.documentElement.style.setProperty("--ur", f[1]);
  document.documentElement.dataset.urf = f[0];
}
applyUrf();
