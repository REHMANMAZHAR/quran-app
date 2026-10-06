"use strict";
/* ---------- word parts, review labels, script choice, surah tools (sections A, M, N) ---------- */
Object.assign(L.ur, {
  partMean:"معنی:", baseMean:"بنیادی معنی:", reviewed:"✓ نظرِ ثانی شدہ", subj:"فاعل (کرنے والا)", obj:"مفعول / ضمیر",
  sensesH:"قرآن میں اس لفظ کے معنی", sensesNote:"خودکار مسودہ — ترجمہ شدہ معانی کو جمع کیا گیا ہے", here:"یہاں", followed:t=>`اکثر بعد میں «${t}»`,
  irabBtn:"اعراب لیب میں دیکھیں", caseN:"رفع (مرفوع)", caseA:"نصب (منصوب)", caseG:"جر (مجرور)",
  revWords:"لفظی معنی: Quran.com (اصلاح شدہ) · بنیادی معانی: عالم کی نظرِ ثانی (اکتوبر ۲۰۲۶)", revGram:"گرامر نوٹس: مسودہ — نظرِ ثانی باقی", report:"غلطی کی اطلاع دیں",
  knowSurah:p=>`آپ اس سورت کے ${ud(p)}٪ الفاظ جانتے ہیں`, uthmani:"عثمانی", indopak:"انڈو پاک", hifz:"حفظ", pageView:"صفحہ"
});
Object.assign(L.en, {
  partMean:"Meaning:", baseMean:"Base meaning:", reviewed:"✓ reviewed", subj:"subject (doer)", obj:"object / pronoun",
  sensesH:"Meanings of this word in the Quran", sensesNote:"Automatic draft — grouped from the word-by-word meanings", here:"here", followed:t=>`often followed by «${t}»`,
  irabBtn:"See in I'rab Lab", caseN:"Nominative (marfūʿ)", caseA:"Accusative (manṣūb)", caseG:"Genitive (majrūr)",
  revWords:"Word meanings: Quran.com (corrected) · Base meanings: scholar-reviewed (Oct 2026)", revGram:"Grammar notes: draft — scholar review pending", report:"Report a mistake",
  knowSurah:p=>`You know ${p}% of this surah's words`, uthmani:"Uthmani", indopak:"Indo-Pak", hifz:"Hifz", pageView:"Page"
});
Object.assign(DATA, {
  extras: () => load("extras", `data/extras.json?v=${DV}`),
  indopak: () => load("indopak", `data/indopak.json?v=${DV}`),
  similar: () => load("similar", `data/similar.json?v=${DV}`),
  senses: () => load("senses", `data/learn/senses.json?v=${DV}`),
  search: () => load("search", `data/search.json?v=${DV}`),
  tafsir: (b, n) => load(`tf_${b}_${n}`, `data/tafsir/${b}/${String(n).padStart(3, "0")}.json?v=${DV}`)
});
let EX = null, IPK = null, SENSES = null;
const tagsOf = ci => (EX && EX.parts[ci]) || "";
const bareAr = t => t.replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/[ٱأإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
/* Indo-Pak script: same words, other spelling (aligned per word; 7 ayahs fall back to Uthmani) */
function wordText(n, a, i, uth){ if (settings.script === "ip" && IPK) { const r = IPK[n + ":" + a]; if (r && r[i]) return r[i]; } return uth; }
document.documentElement.classList.toggle("ipk", settings.script === "ip");

/* ---- meaning of each part (prefix / suffix from a fixed table; stem from the reviewed base meaning) ---- */
const PREF = {
  CONJ:{ "و":["and","اور"], "ف":["so / then","پس / پھر"] }, DET:{ "*":["the","(ال) — معرفہ، 'the'"] },
  P:{ "ب":["with / by / in","سے / کے ساتھ / میں"], "ل":["for / to","کے لیے / کو"], "ك":["like","کی طرح"], "ت":["by (oath)","قسم ہے"], "و":["by (oath)","قسم ہے"] },
  REM:{ "*":["and / then (new sentence)","اور / پھر (نیا جملہ)"] }, EMPH:{ "*":["surely","یقیناً"] }, INTG:{ "*":["is…? / do…? (question)","کیا"] },
  VOC:{ "*":["O","اے"] }, RSLT:{ "*":["then (result)","تو"] }, ATT:{ "*":["(calls attention)","(توجہ دلانے کے لیے)"] }, PRP:{ "*":["so that","تاکہ"] },
  CIRC:{ "*":["while","جبکہ / اس حال میں کہ"] }, SUP:{ "*":["then (added)","پس"] }, FUT:{ "*":["will","عنقریب / گا"] }, CAUS:{ "*":["so (because)","پس / اس لیے"] },
  IMPV:{ "*":["let… (command)","چاہیے کہ"] }, EQ:{ "*":["whether","خواہ / برابر ہے کہ"] }, COM:{ "*":["with (together with)","کے ساتھ"] }
};
const PRON_S = { "1S":["I","میں"], "1P":["we","ہم"], "2MS":["you","تو / تم"], "2FS":["you (f.)","تو / تم (مؤنث)"], "2MP":["you all","تم سب"], "2FP":["you all (f.)","تم سب (مؤنث)"], "2D":["you two","تم دونوں"],
  "3MS":["he / it","وہ"], "3FS":["she / it","وہ (مؤنث)"], "3MP":["they","وہ سب"], "3FP":["they (f.)","وہ سب (مؤنث)"], "3D":["they two","وہ دونوں"], "3MD":["they two","وہ دونوں"], "3FD":["they two (f.)","وہ دونوں (مؤنث)"] };
const PRON_O = { "1S":["me / my","مجھے / میرا"], "1P":["us / our","ہمیں / ہمارا"], "2MS":["you / your","تمہیں / تمہارا"], "2FS":["you / your (f.)","تمہیں / تمہارا (مؤنث)"], "2MP":["you all / your","تم سب کو / تمہارا"], "2FP":["you all / your (f.)","تم سب کو / تمہارا (مؤنث)"], "2D":["you two / your","تم دونوں کو / کا"],
  "3MS":["him / his / it","اسے / اس کا"], "3FS":["her / it / its","اسے / اس کا (مؤنث)"], "3MP":["them / their","انہیں / ان کا"], "3FP":["them / their (f.)","انہیں / ان کا (مؤنث)"], "3D":["them two / their","ان دونوں کو / کا"], "3MD":["them two / their","ان دونوں کو / کا"], "3FD":["them two / their (f.)","ان دونوں کو / کا"] };
const SUBJ = new Set(["ت","تم","تما","تن","نا","وا","و","ا","ن","ون","ين","ان","ي"]);
function partMeaning(segs, j){
  const s = segs[j], t = tagsOf(s[1]).split("|"), b = bareAr(s[0]), en = settings.lang === "en";
  const pick = x => x ? (en ? x[0] : x[1] + " · " + x[0]) : "";
  if (s[3] === "p") {
    const k = Object.keys(PREF).find(k => t.includes(k)); if (!k) return "";
    const tab = PREF[k]; return pick(tab[b] || tab[b.slice(-1)] || tab["*"]);
  }
  if (s[3] === "s") {
    if (t.includes("PRON")) {
      const pgn = t.find(x => /^[123][MF]?[SDP]$/.test(x)); if (!pgn) return "";
      const prev = segs[j - 1], prevT = prev ? tagsOf(prev[1]).split("|") : [];
      const isSubj = prev && prev[3] === "" && prevT[0] === "V" && SUBJ.has(b);
      return pick((isSubj ? PRON_S : PRON_O)[pgn]) + (isSubj ? ` (${T("subj")})` : "");
    }
    if (t.includes("EMPH")) return pick(["(emphasis: surely)","(تاکید) ضرور"]);
    if (t.includes("VOC")) return pick(["O (calling)","اے (پکارنا)"]);
    if (t.includes("DIST")) return pick(["(distance: that)","(دوری: وہ)"]);
    if (t.includes("ADDR")) return pick(["(addressing — no separate meaning)","(خطاب کا حرف — الگ معنی نہیں)"]);
    return "";
  }
  if (s[2] >= 0) { const Lm = META.lemmas[s[2]]; if (Lm && Lm[4]) return `<b>${T("baseMean")}</b> ${esc(Lm[4])} <span class="rv">${T("reviewed")}</span>`; }
  return "";
}
function partMeaningHTML(segs, j){
  const m = partMeaning(segs, j); if (!m) return "";
  return segs[j][3] === "" ? `<div class="pm">${m}</div>` : `<div class="pm"><b>${T("partMean")}</b> ${esc(m)}</div>`;
}
/* ---- Meaning Explorer (section L): meanings of the base word across the Quran ---- */
function senseHTML(stem, w){
  if (stem < 0 || !SENSES) return "";
  const Lm = META.lemmas[stem], rt = Lm[2] >= 0 ? META.roots[Lm[2]][0] : "", S = SENSES[Lm[0] + "|" + rt];
  if (!S) return "";
  const here = (w[1] || "").toLowerCase();
  const rows = S.slice(0, 6).map(([g, c, locs, clue]) => {
    const isHere = here.includes(g.toLowerCase().replace(/s$/, ""));
    return `<li class="${isHere ? "here" : ""}"><b>${esc(g)}</b> <span class="c">${T("times", c)}</span>${isHere ? ` <i>${T("here")}</i>` : ""}
      ${clue ? `<small>${esc(T("followed", clue))}</small>` : ""}<span class="locs">${locs.map(l => `<button data-sloc="${l}">${l.split(":").slice(0, 2).join(":")}</button>`).join("")}</span></li>`;
  }).join("");
  return `<h3>${T("sensesH")}</h3><ul class="senses">${rows}</ul><div class="draft" style="margin-top:4px">${T("sensesNote")}</div>`;
}
/* ---- I'rab link (section K) ---- */
function caseOf(ci){ const t = tagsOf(ci).split("|"); return t.includes("NOM") ? "N" : t.includes("ACC") ? "A" : t.includes("GEN") ? "G" : ""; }
function irabHTML(n, a, i, segs){
  const st = segs.find(s => s[3] === ""); if (!st || st[2] < 0) return "";
  const c = caseOf(st[1]); if (!c || tagsOf(st[1]).startsWith("V")) return "";
  return `<div class="wd-actions" style="margin-top:12px"><button data-irab="${st[2]}">${T("case" + c)} · ${T("irabBtn")}</button></div>`;
}
/* ---- review labels + report (section M, A) ---- */
function reviewHTML(n, a, i){
  return `<div class="draft">${T("revWords")}<br>${T("revGram")}<br>${esc(META.sources.morphology)}</div>
    <div class="wd-actions" style="margin-top:8px"><button data-report="${n}:${a}:${i + 1}">⚑ ${T("report")}</button></div>`;
}
/* ---- surah tools: % known, script, hifz, page view ---- */
let RANK = null;
function rankOf(li){
  if (!LV.V) return 0;
  if (!RANK) { RANK = {}; LV.V.words.forEach(w => { RANK[w[1] + "|" + w[2].replace(/ /g, "")] = w[0]; }); }
  const Lm = META.lemmas[li]; return RANK[Lm[0] + "|" + (Lm[2] >= 0 ? META.roots[Lm[2]][0] : "")] || 0;
}
function surahKnown(d){
  let tot = 0, k = 0;
  d.ayahs.forEach(A => A.w.forEach(w => { const st = w[5]; if (st < 0) return; tot++; const r = rankOf(st); if (r && isKnown(r)) k++; }));
  return tot ? Math.round(k / tot * 100) : 0;
}
function surahTools(n){
  const p = LV.V && CUR ? surahKnown(CUR) : 0, on = (k, v) => settings[k] === v ? ' aria-pressed="true"' : ' aria-pressed="false"';
  return `<div class="stools">${p ? `<div class="sknow"><span style="width:${p}%"></span><em>${T("knowSurah", nf(p))}</em></div>` : ""}
    <div class="seg3 tiny"><button data-tool="script" data-v="uth"${on("script", "uth")}>${T("uthmani")}</button><button data-tool="script" data-v="ip"${on("script", "ip")}>${T("indopak")}</button>
    <button data-tool="hifz"${document.body.classList.contains("hifz") ? ' aria-pressed="true"' : ' aria-pressed="false"'}>${T("hifz")}</button><button data-tool="page" aria-pressed="false">${T("pageView")}</button></div></div>`;
}
$("#main").addEventListener("click", async e => {
  const b = e.target.closest("[data-tool]"); if (!b) return;
  const t = b.dataset.tool;
  if (t === "script") { settings.script = b.dataset.v; saveSettings(); document.documentElement.classList.toggle("ipk", settings.script === "ip"); if (settings.script === "ip" && !IPK) { try { IPK = await DATA.indopak(); } catch(e){} } rerender(); }
  else if (t === "hifz") { document.body.classList.toggle("hifz"); document.querySelectorAll(".w.shown").forEach(x => x.classList.remove("shown")); rerender(); }
  else if (t === "page") openPageView();
});
$("#sheetBody").addEventListener("click", e => {
  const l = e.target.closest("[data-sloc]"); if (l) { const [s, a, w] = l.dataset.sloc.split(":").map(Number); closeAll(); openSurah(s, a, w); return; }
  const ir = e.target.closest("[data-irab]"); if (ir) { closeAll(); openIrab(+ir.dataset.irab); return; }
  const rp = e.target.closest("[data-report]"); if (rp) { reportMistake(rp.dataset.report); return; }
});
