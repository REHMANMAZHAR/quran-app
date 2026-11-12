"use strict";
/* ---------- Root insight: the curated "eye-opener" line + one graded hadith, shown in the word sheet
   for roots that have a reviewed note. Additive: it wraps openWord and injects a block after the word
   head, without changing the existing root / senses / occurrences machinery.
   Seeded roots live in data/insights.json; expand them via the scholar-review track. ---------- */

Object.assign(L.ur, {
  insightH: "بصیرت — ایک ہی مادہ، گہرا ربط",
  insightReviewed: "✓ نظرِ ثانی شدہ",
  insightHadith: "نبوی وضاحت"
});
Object.assign(L.en, {
  insightH: "Insight — one root, a deeper link",
  insightReviewed: "✓ reviewed",
  insightHadith: "Prophetic note"
});

DATA.insights = () => load("insights", `data/insights.json?v=${DV}`);

(function injectInsightStyles(){
  if (document.getElementById("insightCSS")) return;
  const s = document.createElement("style");
  s.id = "insightCSS";
  s.textContent = `
  .insight{margin:14px 0 4px;border:1px solid var(--line,rgba(128,128,128,.25));border-radius:12px;
    overflow:hidden;background:color-mix(in srgb, var(--saffron,#C98A1A) 8%, transparent)}
  .insight-top{padding:12px 14px}
  .insight-h{font-size:12px;letter-spacing:.04em;text-transform:uppercase;font-weight:700;
    color:var(--saffron,#9C6B14);margin:0 0 7px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .insight-tag{font-size:10px;font-weight:700;letter-spacing:.02em;color:var(--muted,#777);
    text-transform:none}
  .insight-aha{font-size:15px;line-height:1.6;color:var(--ink,inherit)}
  .insight-aha .q{font-family:var(--ar);font-size:17px}
  .insight-had{display:flex;align-items:flex-start;gap:10px;padding:11px 14px;
    border-top:1px solid var(--line,rgba(128,128,128,.22));
    background:color-mix(in srgb, var(--sage,#2E7D6B) 9%, transparent)}
  .insight-grade{flex:none;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
    color:#fff;background:var(--sage,#2E7D6B);border-radius:5px;padding:3px 7px;margin-top:2px}
  .insight-hbody{min-width:0}
  .insight-hlabel{font-size:10px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;
    color:var(--sage,#2E7D6B);margin-bottom:3px}
  .insight-htext{font-size:13.5px;line-height:1.55;color:var(--ink,inherit)}
  .insight-src{display:block;margin-top:4px;font-size:11.5px;color:var(--muted,#888);letter-spacing:.02em}
  .insight[dir="rtl"] .insight-h,.insight[dir="rtl"] .insight-hlabel{letter-spacing:0}
  `;
  document.head.appendChild(s);
})();

function insightHTML(d){
  const en = (typeof settings !== "undefined" && settings.lang === "en");
  const dir = en ? "ltr" : "rtl";
  const aha = en ? d.aha.en : d.aha.ur;
  const had = d.hadith;
  const grade = en ? (had.grade_en || "") : (had.grade_ur || had.grade_en || "");
  const htext = en ? had.en : had.ur;
  let h = `<div class="insight" dir="${dir}"><div class="insight-top">
      <div class="insight-h">${esc(T("insightH"))}<span class="insight-tag">${esc(T("insightReviewed"))}</span></div>
      <div class="insight-aha">${esc(aha)}</div></div>`;
  if (htext) h += `<div class="insight-had">
      <span class="insight-grade">${esc(grade)}</span>
      <div class="insight-hbody"><div class="insight-hlabel">${esc(T("insightHadith"))}</div>
        <div class="insight-htext">${esc(htext)}</div>
        <cite class="insight-src">${esc(had.src || "")}</cite></div></div>`;
  h += `</div>`;
  return h;
}

function rootOf(a, i){
  try {
    const w = CUR.ayahs[a-1].w[i], stem = w[5];
    if (stem < 0) return null;
    const Lm = META.lemmas[stem];
    if (!Lm || Lm[2] < 0) return null;
    return META.roots[Lm[2]][0];
  } catch (e) { return null; }
}

/* wrap the existing openWord: it builds #sheetBody synchronously, so we inject right after. */
const _openWordInsightK = openWord;
openWord = function(a, i){
  _openWordInsightK(a, i);
  const root = rootOf(a, i);
  if (!root) return;
  DATA.insights().then(INS => {
    const d = INS && INS[root];
    if (!d) return;
    const sb = $("#sheetBody");
    if (!sb || sb.querySelector(".insight")) return;
    const head = sb.querySelector(".wd-head");
    if (head) head.insertAdjacentHTML("afterend", insightHTML(d));
  }).catch(() => {});
};
