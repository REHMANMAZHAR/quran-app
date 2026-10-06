"use strict";
/* ---------- Learning Path: placement test, 6 levels of harder units, grammar lessons 11–22, practice drawn from real ayahs ----------
   Every practice answer comes from the Quranic Arabic Corpus tags (data/learn/drills.json, built by scripts/build_drills.py). */
Object.assign(L.ur, {
  pathH:"سیکھنے کا راستہ", pathSub:"۶ لیول — ہر یونٹ میں ۱۲ سوال، پاس کرنے کے لیے ۸۰٪", placeT:"لیول ٹیسٹ (۱۸ سوال)", placeS:"جو آتا ہے وہ چھوڑ کر صحیح لیول سے شروع کریں",
  placed:n=>`آپ لیول ${ud(n)} سے شروع کر رہے ہیں`, retake:"لیول ٹیسٹ دوبارہ دیں", lvl:n=>`لیول ${ud(n)}`, wordsR:(a,b)=>`الفاظ ${ud(a)}–${ud(b)}`, lvlTest:"لیول کا امتحان",
  lessonLink:"سبق پڑھیں", practice:"مشق (۱۲ سوال، اصل آیات سے)", passNeed:p=>`پاس: ${ud(p)}٪ درست پہلی کوشش میں`, passedU:"پاس ✓", failedU:p=>`${ud(p)}٪ — پاس کے لیے ۸۰٪ چاہیے۔ غلطیاں دوبارہ آئیں گی، پھر کوشش کریں۔`,
  passedMsg:p=>`ماشاءاللہ! ${ud(p)}٪ — یونٹ پاس`, again:"غلط سوال دوبارہ:", fromAyahs:"اصل آیات سے مثالیں",
  qKind:"نشان زدہ لفظ کس قسم کا ہے؟", qTense:"یہ فعل کس زمانے کا ہے؟", qPerson:"کام کون کر رہا ہے؟", qSuffix:"آخر میں جڑی ضمیر کا مطلب؟", qCase:"اس لفظ کی حالت (اعراب)؟",
  qNumber:"واحد، تثنیہ یا جمع؟", qDefin:"معرفہ یا نکرہ؟", qPrefix:"شروع میں جڑے حرف کا مطلب؟", qPtc:"یہ کس قسم کا اسم ہے؟", qForm:"یہ فعل کس باب (وزن) کا ہے؟",
  qMood:"اس مضارع فعل کی حالت؟", qVoice:"معروف یا مجہول؟", qRoot:"اس لفظ کا مادہ (روٹ)؟", placeDone:"لیول ٹیسٹ مکمل"
});
Object.assign(L.en, {
  pathH:"Learning Path", pathSub:"6 levels — 12 questions a unit, 80% to pass", placeT:"Placement test (18 questions)", placeS:"Skip what you already know and start at the right level",
  placed:n=>`You start at Level ${n}`, retake:"Retake placement test", lvl:n=>`Level ${n}`, wordsR:(a,b)=>`Words ${a}–${b}`, lvlTest:"Level test",
  lessonLink:"Read the lesson", practice:"Practice (12 questions from real ayahs)", passNeed:p=>`Pass: ${p}% right on first try`, passedU:"Passed ✓", failedU:p=>`${p}% — you need 80% to pass. Mistakes come back; try again.`,
  passedMsg:p=>`MashaAllah! ${p}% — unit passed`, again:"Try again:", fromAyahs:"Examples from real ayahs",
  qKind:"What kind of word is the highlighted one?", qTense:"Which tense is this verb?", qPerson:"Who is doing the action?", qSuffix:"The pronoun joined at the end means:", qCase:"Which case (iʿrāb) is this word in?",
  qNumber:"Singular, dual or plural?", qDefin:"Definite or indefinite?", qPrefix:"What does the joined letter at the start mean here?", qPtc:"What kind of noun is this?", qForm:"Which verb form (wazn) is this?",
  qMood:"Which mood is this present-tense verb in?", qVoice:"Active or passive?", qRoot:"What is the root of this word?", placeDone:"Placement test complete"
});
const CLS = {
  kind3:{ q:"qKind", en:{ ism:"Noun (ism)", fil:"Verb (fiʿl)", harf:"Particle (ḥarf)" }, ur:{ ism:"اسم", fil:"فعل", harf:"حرف" } },
  tense:{ q:"qTense", en:{ past:"Past (māḍī)", present:"Present / future (muḍāriʿ)", command:"Command (amr)" }, ur:{ past:"ماضی", present:"مضارع (حال / مستقبل)", command:"امر (حکم)" } },
  person:{ q:"qPerson", en:{ he:"he", she:"she", they:"they (men)", they_f:"they (women)", we:"we", I:"I", you1:"you (one man)", youpl:"you all" },
    ur:{ he:"وہ (ایک مرد)", she:"وہ (ایک عورت)", they:"وہ سب (مرد)", they_f:"وہ سب (عورتیں)", we:"ہم", I:"میں", you1:"تُو (ایک مرد)", youpl:"تم سب" } },
  suffix:{ q:"qSuffix", en:{ he:"him / his", she:"her", they:"them / their", they_f:"them / their (women)", we:"us / our", I:"me / my", you1:"you / your (one)", youpl:"you all / your" },
    ur:{ he:"اسے / اس کا", she:"اسے / اس کی (مؤنث)", they:"انہیں / ان کا", they_f:"انہیں / ان کا (عورتیں)", we:"ہمیں / ہمارا", I:"مجھے / میرا", you1:"تجھے / تیرا", youpl:"تمہیں / تمہارا" } },
  case:{ q:"qCase", en:{ nom:"Rafʿ — nominative (‑u)", acc:"Naṣb — accusative (‑a)", gen:"Jarr — genitive (‑i)" }, ur:{ nom:"رفع — مرفوع (پیش)", acc:"نصب — منصوب (زبر)", gen:"جر — مجرور (زیر)" } },
  number:{ q:"qNumber", en:{ singular:"Singular (one)", dual:"Dual (two)", plural:"Plural (three or more)" }, ur:{ singular:"واحد", dual:"تثنیہ (دو)", plural:"جمع" } },
  defin:{ q:"qDefin", en:{ def:"Definite — “the …”", indef:"Indefinite — “a …”" }, ur:{ def:"معرفہ (خاص)", indef:"نکرہ (عام)" } },
  prefix:{ q:"qPrefix", en:{ wa:"and", fa:"so / then", bi:"with / by / in", li:"for / to", ka:"like / as", sa:"will (future)", la:"surely / indeed" },
    ur:{ wa:"اور", fa:"پس / پھر", bi:"سے / کے ساتھ / میں", li:"کے لیے / کو", ka:"کی طرح", sa:"عنقریب (مستقبل)", la:"یقیناً / ضرور" } },
  ptc:{ q:"qPtc", en:{ doer:"The one who does (ism fāʿil)", done:"The one it is done to (ism mafʿūl)", action:"Name of the action (maṣdar)" }, ur:{ doer:"کرنے والا (اسمِ فاعل)", done:"جس پر کام ہوا (اسمِ مفعول)", action:"کام کا نام (مصدر)" } },
  form:{ q:"qForm", en:{ I:"Form I — faʿala", II:"Form II — faʿʿala", III:"Form III — fāʿala", IV:"Form IV — afʿala", V:"Form V — tafaʿʿala", VI:"Form VI — tafāʿala", VII:"Form VII — infaʿala", VIII:"Form VIII — iftaʿala", IX:"Form IX — ifʿalla", X:"Form X — istafʿala" },
    ur:{ I:"باب I — فَعَلَ", II:"باب II — فَعَّلَ", III:"باب III — فَاعَلَ", IV:"باب IV — أَفْعَلَ", V:"باب V — تَفَعَّلَ", VI:"باب VI — تَفَاعَلَ", VII:"باب VII — اِنْفَعَلَ", VIII:"باب VIII — اِفْتَعَلَ", IX:"باب IX — اِفْعَلَّ", X:"باب X — اِسْتَفْعَلَ" } },
  mood:{ q:"qMood", en:{ ind:"Normal — marfūʿ (‑u / ‑ūna)", subj:"Subjunctive — manṣūb (after an, lan, li, ḥattā)", jussive:"Jussive — majzūm (after lam, lā “don’t”, or a condition)" },
    ur:{ ind:"عام — مرفوع (پیش / ـونَ)", subj:"منصوب (أَنْ، لَنْ، لِـ، حَتَّىٰ کے بعد)", jussive:"مجزوم (لَمْ، لَا نہی، یا شرط کے بعد)" } },
  voice:{ q:"qVoice", en:{ active:"Active — the doer is known", passive:"Passive — the doer is not mentioned" }, ur:{ active:"معروف — کرنے والا معلوم", passive:"مجہول — کرنے والے کا ذکر نہیں" } },
  root:{ q:"qRoot" }
};
let DR = null;
async function drills(){
  if (!DR) { DR = await load("drills", `data/learn/drills.json?v=${DV}`); for (const k in DR) { if (!DR[k].items) continue; const pos = {}; DR[k].items.forEach(x => { const c = x[3]; pos[c] = (pos[c] || 0) + 1; x.easy = pos[c] <= 35; }); } }
  return DR;
}
const lbl = (sk, c) => (CLS[sk][settings.lang === "en" ? "en" : "ur"] || {})[c] || c;
const rootTxt = i => DR.roots[i].split("").join(" ");
/* one question from a skill; opt.easy = frequent words only; opt.only = restrict classes */
function drillQ(sk, opt = {}){
  const D = DR[sk]; let pool = D.items.filter(x => (!opt.easy || x.easy) && (!opt.only || opt.only.includes(x[3])));
  if (!pool.length) pool = D.items;
  const x = pool[Math.floor(Math.random() * pool.length)], [s, a, w, c, before, word, after, gloss] = x;
  let opts, ans;
  if (sk === "root") { const others = shuf(D.items.map(y => y[3]).filter(r => r !== c)).filter((r, i, A) => A.indexOf(r) === i).slice(0, 3); opts = shuf([c, ...others]); ans = opts.indexOf(c); opts = opts.map(r => `<span class="oar">${esc(rootTxt(r))}</span>`); }
  else { const cls = (opt.only || D.classes).filter(k => k !== c); opts = shuf([c, ...shuf(cls).slice(0, 3)]); ans = opts.indexOf(c); opts = opts.map(k => esc(lbl(sk, k))); }
  return { prompt: `<div class="oa qctx" dir="rtl">${esc(before)} <mark>${esc(word)}</mark> ${esc(after)}</div><div class="qref">${esc(surahName(s))} ${nf(s)}:${nf(a)}</div><div class="qh">${T(CLS[sk].q)}</div>`,
    opts, ans, w: [0, word, "", "", "", `${gloss} — ${sk === "root" ? rootTxt(c) : lbl(sk, c)}`], ref: `${s}:${a}:${w}` };
}
function vocabQs(a, b, n){
  const src = LV.V.words.slice(a, b);
  return shuf(src).slice(0, n).map((w, i) => mcq(w, ["w2m", "m2w", "w2m", "listen"][i % 4], src));
}
/* ---- the path ---- */
const PATH = [
  { en:"Foundations", ur:"بنیاد", units:[{ v:[0, 60] }, { v:[60, 125] }, { sk:"kind3", les:0 }, { sk:"defin", les:1 }, { test:true }] },
  { en:"Building blocks", ur:"اینٹیں", units:[{ v:[125, 190] }, { v:[190, 250] }, { sk:"prefix", les:2 }, { sk:"suffix", les:3 }, { test:true }] },
  { en:"Verbs", ur:"افعال", units:[{ v:[250, 325] }, { v:[325, 400] }, { sk:"tense", les:4 }, { sk:"person", les:10 }, { test:true }] },
  { en:"Nouns and sentences", ur:"اسماء اور جملے", units:[{ v:[400, 475] }, { v:[475, 550] }, { sk:"case", les:7 }, { sk:"number", les:17 }, { test:true }] },
  { en:"Roots and patterns", ur:"مادے اور اوزان", units:[{ v:[550, 625] }, { v:[625, 700] }, { sk:"root", les:13 }, { sk:"ptc", les:14 }, { sk:"voice", les:12 }, { test:true }] },
  { en:"Advanced", ur:"اعلیٰ", units:[{ v:[700, 850] }, { v:[850, 1000] }, { sk:"form", les:15 }, { sk:"mood", les:11 }, { test:true }] }
];
PATH.forEach((P, li) => P.units.forEach((u, ui) => { u.id = `${li + 1}.${ui + 1}`; u.lv = li + 1; }));
LS.path = LS.path || {};
const SKN = { kind3:["Noun, verb or particle?", "اسم، فعل یا حرف؟"], defin:["“The” or “a”?", "معرفہ یا نکرہ؟"], prefix:["Joined little words", "جڑے ہوئے حروف"], suffix:["Pronoun endings", "جڑی ہوئی ضمیریں"],
  tense:["Past, present or command?", "ماضی، مضارع یا امر؟"], person:["Who is doing it?", "کام کون کر رہا ہے؟"], case:["The three cases", "تین حالتیں (اعراب)"], number:["One, two or many", "واحد، تثنیہ، جمع"],
  root:["Find the root", "مادہ پہچانیں"], ptc:["Doer, done-to, action", "فاعل، مفعول، مصدر"], voice:["Active or passive", "معروف یا مجہول"], form:["Verb forms I–X", "ابواب I–X"], mood:["Moods of the present verb", "مضارع کی حالتیں"] };
const unitName = u => u.test ? T("lvlTest") : u.v ? T("wordsR", nf(u.v[0] + 1), nf(u.v[1])) : SKN[u.sk][settings.lang === "en" ? 0 : 1];
const unitDone = u => !!LS.path[u.id] || (LS.place && u.lv < LS.place);
function questHTML(){
  let open = true;
  const lv = PATH.map((P, li) => { const wasOpen = open, nd = P.units.filter(unitDone).length;
    const nodes = P.units.map(u => { const done = unitDone(u), st = done ? "done" : open ? "cur" : "lock"; if (!done) open = false;
      return `<button class="node ${st}${u.test ? " test" : ""}" data-pu="${u.id}"${st === "lock" ? " disabled" : ""}><b>${esc(unitName(u))}</b><small>${done ? (LS.path[u.id] ? T("passedU") : "") : st === "lock" ? T("locked") : ""}</small></button>`; }).join("");
    const cur = wasOpen && nd < P.units.length;
    return `<details class="pl"${cur ? " open" : ""}><summary><h4>${T("lvl", nf(li + 1))} · ${esc(settings.lang === "en" ? P.en : P.ur)}</h4><span>${nf(nd)}/${nf(P.units.length)}</span></summary><div class="path">${nodes}</div></details>`; }).join("");
  return `<div class="lh"><h3>${T("pathH")}</h3><small>${T("pathSub")}</small></div>
    <div class="lc">${LS.place ? `<p style="margin:0 0 8px"><b>${T("placed", nf(LS.place))}</b></p><button class="btn ghost wide" data-place="1">${T("retake")}</button>`
      : `<button class="btn wide" data-place="1">${T("placeT")}</button><p class="muted" style="font-size:13px;margin:8px 0 0">${T("placeS")}</p>`}</div>${lv}`;
}
const findUnit = id => PATH.flatMap(P => P.units).find(u => u.id === id);
async function openPathUnit(id){
  const u = findUnit(id); await drills(); LS.lastUnit = id;
  if (u.v || u.test) return runPathUnit(id);
  const L2 = LESSONS[u.les], tx = settings.lang === "en" ? L2.en : L2.ur;
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><b>${T("lvl", nf(u.lv))} · ${esc(unitName(u))}</b></div>
    <div class="lc"><h2 style="margin-top:0">${esc(tx[0])}</h2>${tx[1].slice(0, 3).map(p => `<p>${esc(p)}</p>`).join("")}
      <div style="display:grid;gap:8px;margin-top:12px"><button class="btn wide" data-prun="${id}">${T("practice")}</button><button class="btn ghost wide" data-lesson="${u.les}">${T("lessonLink")}</button></div>
      <p class="muted" style="font-size:13px">${T("passNeed", nf(80))}</p></div>`;
}
async function runPathUnit(id){
  const u = findUnit(id); await drills(); LS.lastUnit = id; if (!LV.V) LV.V = await DATA.vocab();
  const easy = u.lv <= 3; let qs = [];
  if (u.v) qs = vocabQs(u.v[0], u.v[1], 12);
  else if (u.sk) for (let i = 0; i < 12; i++) qs.push(drillQ(u.sk, { easy }));
  else { const P = PATH[u.lv - 1]; P.units.forEach(x => { if (x.v) qs.push(...vocabQs(x.v[0], x.v[1], 4)); else if (x.sk) for (let i = 0; i < 4; i++) qs.push(drillQ(x.sk, { easy: false })); }); qs = shuf(qs).slice(0, 20); }
  runQuiz(qs, { kind: "path", path: id, retry: true, pass: u.test ? 0.85 : 0.8 });
}
async function placementTest(){
  await drills(); if (!LV.V) LV.V = await DATA.vocab();
  const sk = ["kind3", "suffix", "tense", "case", "root", "form"], qs = [];
  PATH.forEach((P, li) => { const v = P.units.find(u => u.v), a = v.v[0], b = PATH[li].units.filter(u => u.v).pop().v[1];
    const q1 = mcq(...[shuf(LV.V.words.slice(a, b))[0], "w2m", LV.V.words.slice(a, b)]); q1.lv = li + 1; qs.push(q1);
    for (let i = 0; i < 2; i++) { const q = drillQ(sk[li], { easy: li < 3 }); q.lv = li + 1; qs.push(q); } });
  runQuiz(qs, { kind: "place", place: true });
}
GAMES.path = () => runPathUnit(LS.lastUnit);
GAMES.place = () => placementTest();
/* mistakes come back once at the end; pass is judged on first tries */
const _answer = answer;
answer = function(k){
  if (G && G.picked == null && (G.retry || G.place)) {
    const q = G.qs[G.i], ok = k === q.ans;
    if (!q.re) { G.n1 = (G.n1 || 0) + 1; if (ok) G.ok1 = (G.ok1 || 0) + 1; if (G.place) { G.lv = G.lv || {}; const r = G.lv[q.lv] = G.lv[q.lv] || [0, 0]; r[1]++; if (ok) r[0]++; } }
    if (!ok && G.retry && !q.re) G.qs.push(Object.assign({}, q, { re: true, prompt: `<div class="qh" style="color:var(--rose,#b3261e)">${T("again")}</div>` + q.prompt }));
  }
  return _answer(k);
};
const _endQuiz2 = endQuiz;
endQuiz = function(){
  const g = G; _endQuiz2();
  if (!g || g.done2) return; g.done2 = true;
  const box = document.querySelector("#learn .done-box"); if (!box) return;
  if (g.path) {
    const p = Math.round((g.ok1 || 0) / Math.max(1, g.n1 || 1) * 100), ok = p >= g.pass * 100;
    if (ok) { LS.path[g.path] = Math.max(LS.path[g.path] || 0, p); addXP(40); saveL(); }
    box.insertAdjacentHTML("afterbegin", `<p class="${ok ? "fb ok" : "fb no"}" style="margin-top:0">${ok ? T("passedMsg", nf(p)) : T("failedU", nf(p))}</p>`);
  }
  if (g.place) {
    let lv = 1; for (let i = 1; i <= 6; i++) { const r = (g.lv || {})[i] || [0, 1]; if (r[0] >= 2) lv = i + 1; else break; }
    LS.place = Math.min(6, lv); saveL();
    box.insertAdjacentHTML("afterbegin", `<p class="fb ok" style="margin-top:0"><b>${T("placeDone")}</b> — ${T("placed", nf(LS.place))}</p>`);
  }
};
$("#learn").addEventListener("click", e => {
  const pu = e.target.closest("[data-pu]"); if (pu) { openPathUnit(pu.dataset.pu); return; }
  const pr = e.target.closest("[data-prun]"); if (pr) { runPathUnit(pr.dataset.prun); return; }
  const pl = e.target.closest("[data-place]"); if (pl) { placementTest(); return; }
  const ld = e.target.closest("[data-ldrill]"); if (ld) { const L2 = LESSONS[+ld.dataset.ldrill]; drills().then(() => { const qs = []; for (let i = 0; i < 12; i++) qs.push(drillQ(L2.drill, { only: L2.only })); runQuiz(qs, { kind: "lesson", retry: true, lessonI: +ld.dataset.ldrill, pass: 0.8 }); }); }
}, true);
/* lesson practice: mark the lesson done when passed */
const _endQuiz3 = endQuiz;
endQuiz = function(){
  const g = G; _endQuiz3();
  if (g && g.lessonI != null && !g.done3) { g.done3 = true; const p = (g.ok1 || 0) / Math.max(1, g.n1 || 1);
    if (p >= 0.8 && !LS.lessons[g.lessonI]) { LS.lessons[g.lessonI] = 1; addXP(30); badge("course"); saveL(); toast(esc(T("lessonDone"))); } }
};
/* ---- grammar course: drills for lessons 1–10, new lessons 11–22 ---- */
["kind3", "defin", "prefix", "suffix", "tense", "tense", "tense", "case", "case", "number"].forEach((d, i) => { LESSONS[i].drill = d; });
LESSONS[4].only = ["past", "present"]; LESSONS[6].only = ["command", "present"]; LESSONS[8].only = ["gen", "nom", "acc"];
LESSONS.push(
 { drill:"person", ex:[], q:[], en:["Who is doing it? Person on the verb", ["The verb itself tells you who does the action — no separate word is needed.", "Past: no ending = he · ـَتْ = she · ـُوا = they (men) · ـْنَ = they (women) · ـْتَ = you (one man) · ـْتُمْ = you all · ـْتُ = I · ـْنَا = we.", "Present: يَـ = he · تَـ = she or you · يَـ…ـُونَ = they · تَـ…ـُونَ = you all · أَ = I · نَـ = we.", "Example: قَالُوا = they said · نَعْبُدُ = we worship · أَعُوذُ = I seek refuge."]],
   ur:["کام کون کر رہا ہے؟ فعل میں فاعل", ["فعل خود بتا دیتا ہے کہ کام کس نے کیا — الگ لفظ کی ضرورت نہیں۔", "ماضی: کچھ نہیں = اس نے (مرد) · ـَتْ = اس نے (عورت) · ـُوا = انہوں نے · ـْنَ = انہوں نے (عورتیں) · ـْتَ = تُو نے · ـْتُمْ = تم سب نے · ـْتُ = میں نے · ـْنَا = ہم نے۔", "مضارع: يَـ = وہ · تَـ = وہ (عورت) یا تُو · يَـ…ـُونَ = وہ سب · تَـ…ـُونَ = تم سب · أَ = میں · نَـ = ہم۔", "مثال: قَالُوا = انہوں نے کہا · نَعْبُدُ = ہم عبادت کرتے ہیں · أَعُوذُ = میں پناہ مانگتا ہوں۔"]] },
 { drill:"mood", ex:[], q:[], en:["Moods of the present verb", ["A present verb normally ends in ‑u (or ‑ūna for plurals): this is marfūʿ, the normal mood.", "After أَنْ (that), لَنْ (will never), كَيْ / لِـ (so that) and حَتَّىٰ (until) it becomes manṣūb: the ending turns to ‑a and ‑ūna loses its nūn. لَن تَنَالُوا = you will never attain.", "After لَمْ (did not), لَا meaning “don’t!”, the lām of command, and in conditions (إِنْ) it becomes majzūm: the last letter takes a sukūn and ‑ūna loses its nūn. لَمْ يَلِدْ = He did not beget.", "The particle before the verb usually tells you the mood — and the mood confirms the meaning."]],
   ur:["مضارع کی حالتیں", ["مضارع عام طور پر پیش (ـُ) یا جمع میں ـُونَ پر ختم ہوتا ہے: یہ مرفوع، عام حالت ہے۔", "أَنْ (کہ)، لَنْ (ہرگز نہیں)، كَيْ / لِـ (تاکہ) اور حَتَّىٰ (یہاں تک کہ) کے بعد منصوب ہوتا ہے: آخر میں زبر اور ـُونَ کا نون گر جاتا ہے۔ لَن تَنَالُوا = تم ہرگز نہ پاؤ گے۔", "لَمْ (نہیں کیا)، لَا (مت کرو!)، امر کے لام اور شرط (إِنْ) کے بعد مجزوم ہوتا ہے: آخر میں سکون اور ـُونَ کا نون گر جاتا ہے۔ لَمْ يَلِدْ = اس نے نہیں جنا۔", "فعل سے پہلے والا حرف عموماً حالت بتا دیتا ہے — اور حالت معنی کی تصدیق کرتی ہے۔"]] },
 { drill:"voice", ex:[], q:[], en:["Passive verbs", ["In a passive verb the doer is not mentioned — only what happened.", "Past passive has the vowels u‑i: كُتِبَ = it was written / prescribed. كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ = fasting has been prescribed for you.", "Present passive has u‑a: يُقَالُ = it is said · يُنفَخُ = it will be blown.", "The thing done becomes the subject (nāʾib al‑fāʿil) and takes rafʿ (‑u)."]],
   ur:["فعلِ مجہول", ["مجہول فعل میں کرنے والے کا ذکر نہیں ہوتا — صرف یہ کہ کیا ہوا۔", "ماضی مجہول میں حرکات پیش‑زیر ہوتی ہیں: كُتِبَ = لکھا گیا / فرض کیا گیا۔ كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ = تم پر روزے فرض کیے گئے۔", "مضارع مجہول میں پیش‑زبر: يُقَالُ = کہا جاتا ہے · يُنفَخُ = پھونکا جائے گا۔", "جس پر کام ہوا وہ نائب فاعل بن کر مرفوع (پیش) ہوتا ہے۔"]] },
 { drill:"root", ex:[], q:[], en:["Roots: the three‑letter family", ["Most Quranic words are built on a root of three letters that carries a core meaning.", "ك ت ب = writing: كَتَبَ he wrote · كِتَاب book · مَكْتُوب written.", "ع ل م = knowing: عَلِمَ he knew · عِلْم knowledge · عَالِم scholar · عَلِيم All‑Knowing.", "Remove the extra letters (prefixes, endings, and pattern letters like م ت ا و ي) to find the root. Knowing one root opens many words."]],
   ur:["مادہ: تین حرفی خاندان", ["قرآن کے زیادہ تر الفاظ تین حرفی مادے سے بنتے ہیں جس کا ایک بنیادی معنی ہوتا ہے۔", "ك ت ب = لکھنا: كَتَبَ اس نے لکھا · كِتَاب کتاب · مَكْتُوب لکھا ہوا۔", "ع ل م = جاننا: عَلِمَ اس نے جانا · عِلْم علم · عَالِم عالم · عَلِيم سب کچھ جاننے والا۔", "زائد حروف (شروع اور آخر کے حروف، اور وزن کے حروف جیسے م ت ا و ي) ہٹا دیں تو مادہ ملتا ہے۔ ایک مادہ کئی الفاظ کھول دیتا ہے۔"]] },
 { drill:"ptc", ex:[], q:[], en:["Doer, done‑to and the name of the action", ["Ism fāʿil — the one who does: on the pattern فَاعِل (عَابِد worshipper, كَافِر disbeliever); in other verb forms it starts with مُـ and has kasra before the last letter (مُؤْمِن believer, مُسْلِم one who submits).", "Ism mafʿūl — the one it is done to: مَفْعُول (مَغْضُوب the one with whom anger is), or مُـ with fatha before the last letter (مُنزَل sent down).", "Maṣdar — the name of the action itself: عِبَادَة worship · إِيمَان believing · ذِكْر remembrance."]],
   ur:["فاعل، مفعول اور کام کا نام", ["اسمِ فاعل — کام کرنے والا: فَاعِل کے وزن پر (عَابِد عبادت کرنے والا، كَافِر انکار کرنے والا)؛ دوسرے ابواب میں مُـ سے شروع اور آخری حرف سے پہلے زیر (مُؤْمِن، مُسْلِم)۔", "اسمِ مفعول — جس پر کام کیا گیا: مَفْعُول (مَغْضُوب جس پر غضب ہوا)، یا مُـ اور آخری حرف سے پہلے زبر (مُنزَل اتارا گیا)۔", "مصدر — خود کام کا نام: عِبَادَة عبادت · إِيمَان ایمان لانا · ذِكْر یاد۔"]] },
 { drill:"form", only:["I", "II", "III", "IV"], ex:[], q:[], en:["Verb forms I–IV", ["Arabic adds letters to a root in fixed patterns (forms) that shift the meaning.", "Form I فَعَلَ — the basic meaning: عَلِمَ he knew · نَزَلَ it came down.", "Form II فَعَّلَ (middle letter doubled) — to make / to do intensely: عَلَّمَ he taught · نَزَّلَ he sent down (gradually).", "Form III فَاعَلَ (long ā after the first letter) — to do with or against someone: قَاتَلَ fought (with) · جَاهَدَ strove.", "Form IV أَفْعَلَ (a‑ at the start) — to cause: أَنزَلَ he sent down · أَسْلَمَ he submitted."]],
   ur:["ابواب I–IV", ["عربی مادے میں مقررہ وزن پر حروف بڑھاتی ہے جس سے معنی بدلتا ہے۔", "باب I فَعَلَ — بنیادی معنی: عَلِمَ اس نے جانا · نَزَلَ اترا۔", "باب II فَعَّلَ (درمیانی حرف پر شد) — کروانا / شدت سے کرنا: عَلَّمَ سکھایا · نَزَّلَ (تھوڑا تھوڑا) اتارا۔", "باب III فَاعَلَ (پہلے حرف کے بعد الف) — کسی کے ساتھ یا مقابلے میں کرنا: قَاتَلَ لڑا · جَاهَدَ کوشش کی۔", "باب IV أَفْعَلَ (شروع میں أ) — کروانا: أَنزَلَ اتارا · أَسْلَمَ فرمانبردار ہوا۔"]] },
 { drill:"form", only:["V", "VI", "VII", "VIII", "X"], ex:[], q:[], en:["Verb forms V–X", ["Form V تَفَعَّلَ — reflexive of II: تَذَكَّرَ he took heed.", "Form VI تَفَاعَلَ — doing with each other: تَسَاءَلُونَ you ask one another.", "Form VII اِنْفَعَلَ — happening by itself: اِنقَلَبَ he turned back.", "Form VIII اِفْتَعَلَ (ت after the first letter): اِخْتَلَفَ they differed · اِتَّقَى he was mindful of Allah.", "Form IX اِفْعَلَّ — colours: اِسْوَدَّتْ turned black. Form X اِسْتَفْعَلَ — to seek: اِسْتَغْفَرَ he sought forgiveness."]],
   ur:["ابواب V–X", ["باب V تَفَعَّلَ — باب II کا اپنے اوپر اثر: تَذَكَّرَ اس نے نصیحت حاصل کی۔", "باب VI تَفَاعَلَ — ایک دوسرے کے ساتھ: تَسَاءَلُونَ تم ایک دوسرے سے سوال کرتے ہو۔", "باب VII اِنْفَعَلَ — خود بخود ہونا: اِنقَلَبَ وہ پلٹ گیا۔", "باب VIII اِفْتَعَلَ (پہلے حرف کے بعد ت): اِخْتَلَفَ اختلاف کیا · اِتَّقَى تقویٰ اختیار کیا۔", "باب IX اِفْعَلَّ — رنگ: اِسْوَدَّتْ سیاہ ہو گئے۔ باب X اِسْتَفْعَلَ — طلب کرنا: اِسْتَغْفَرَ معافی مانگی۔"]] },
 { drill:"number", ex:[], q:[], en:["One, two, many — and gender", ["Dual (two): ـَانِ / ـَيْنِ — جَنَّتَانِ two gardens.", "Sound masculine plural: ـُونَ / ـِينَ — ٱلْمُؤْمِنُونَ. Sound feminine plural: ـَات — ٱلصَّالِحَات.", "Broken plurals change the inside of the word: كِتَاب → كُتُب · رَسُول → رُسُل · قَلْب → قُلُوب.", "Feminine nouns often end in ة: جَنَّة · رَحْمَة. Adjectives follow their noun in gender and number."]],
   ur:["واحد، تثنیہ، جمع — اور جنس", ["تثنیہ (دو): ـَانِ / ـَيْنِ — جَنَّتَانِ دو باغ۔", "جمع مذکر سالم: ـُونَ / ـِينَ — ٱلْمُؤْمِنُونَ۔ جمع مؤنث سالم: ـَات — ٱلصَّالِحَات۔", "جمع مکسر لفظ کے اندر سے بدلتی ہے: كِتَاب → كُتُب · رَسُول → رُسُل · قَلْب → قُلُوب۔", "مؤنث اسم اکثر ة پر ختم ہوتے ہیں: جَنَّة · رَحْمَة۔ صفت جنس اور عدد میں اپنے اسم کے مطابق ہوتی ہے۔"]] },
 { drill:"case", only:["nom", "acc", "gen"], ex:[], q:[], en:["The nominal sentence", ["A sentence that starts with a noun has two parts: the mubtadaʾ (topic) and the khabar (what is said about it).", "Both are normally in rafʿ (‑u). Arabic needs no word for “is”.", "ٱللَّهُ ٱلصَّمَدُ = Allah is the Eternal Refuge · ذَٰلِكَ ٱلْكِتَابُ = that is the Book.", "The khabar can also be a phrase: ٱلْحَمْدُ لِلَّهِ = (all) praise is for Allah."]],
   ur:["جملہ اسمیہ", ["جو جملہ اسم سے شروع ہو اس کے دو حصے ہیں: مبتدا (جس کے بارے میں بات ہے) اور خبر (جو اس کے بارے میں کہا گیا)۔", "دونوں عموماً مرفوع (پیش) ہوتے ہیں۔ عربی میں \"ہے\" کے لیے الگ لفظ نہیں چاہیے۔", "ٱللَّهُ ٱلصَّمَدُ = اللہ بے نیاز ہے · ذَٰلِكَ ٱلْكِتَابُ = یہ وہ کتاب ہے۔", "خبر ایک ٹکڑا بھی ہو سکتی ہے: ٱلْحَمْدُ لِلَّهِ = سب تعریف اللہ کے لیے ہے۔"]] },
 { drill:"case", only:["nom", "acc", "gen"], ex:[], q:[], en:["The verbal sentence", ["A sentence that starts with a verb: fiʿl (verb) → fāʿil (doer, rafʿ ‑u) → mafʿūl (object, naṣb ‑a).", "Word order is free because the endings show the roles: وَعَصَىٰٓ ءَادَمُ رَبَّهُۥ = Adam disobeyed his Lord.", "When the verb comes first it stays singular even if the doer after it is plural: قَالَ ٱلْمَلَأُ = the chiefs said."]],
   ur:["جملہ فعلیہ", ["جو جملہ فعل سے شروع ہو: فعل ← فاعل (کرنے والا، مرفوع) ← مفعول (جس پر کام ہوا، منصوب)۔", "ترتیب آزاد ہے کیونکہ اعراب کردار بتاتے ہیں: وَعَصَىٰٓ ءَادَمُ رَبَّهُۥ = آدم نے اپنے رب کی نافرمانی کی۔", "جب فعل پہلے آئے تو واحد رہتا ہے چاہے بعد کا فاعل جمع ہو: قَالَ ٱلْمَلَأُ = سرداروں نے کہا۔"]] },
 { drill:"case", only:["nom", "acc"], ex:[], q:[], en:["Inna and Kāna", ["إِنَّ (indeed) and its sisters أَنَّ، لَٰكِنَّ، كَأَنَّ، لَعَلَّ، لَيْتَ make the topic naṣb (‑a); the khabar stays rafʿ (‑u): إِنَّ ٱللَّهَ غَفُورٌ رَّحِيمٌ.", "كَانَ (was) and its sisters such as أَصْبَحَ، لَيْسَ، مَا زَالَ keep the topic rafʿ (‑u) and make the khabar naṣb (‑a): وَكَانَ ٱللَّهُ عَلِيمًا حَكِيمًا.", "So the same noun can end in ‑u or ‑a depending on the word before it."]],
   ur:["إِنَّ اور كَانَ", ["إِنَّ (بے شک) اور اس کے ساتھی أَنَّ، لَٰكِنَّ، كَأَنَّ، لَعَلَّ، لَيْتَ مبتدا کو منصوب (زبر) کرتے ہیں، خبر مرفوع رہتی ہے: إِنَّ ٱللَّهَ غَفُورٌ رَّحِيمٌ۔", "كَانَ (تھا) اور اس کے ساتھی جیسے أَصْبَحَ، لَيْسَ، مَا زَالَ مبتدا کو مرفوع رکھتے اور خبر کو منصوب کرتے ہیں: وَكَانَ ٱللَّهُ عَلِيمًا حَكِيمًا۔", "اس لیے ایک ہی اسم پہلے آنے والے لفظ کے مطابق پیش یا زبر لیتا ہے۔"]] },
 { drill:"prefix", only:["bi", "li", "ka"], ex:[], q:[], en:["Prepositions and the genitive", ["After a preposition the noun is in jarr (‑i): فِي in · مِنْ from · إِلَىٰ to · عَلَىٰ on · عَنْ about · مَعَ with.", "Three prepositions are one letter joined to the word: بِـ with / by / in · لِـ for / to · كَـ like.", "بِسْمِ ٱللَّهِ = in the name of Allah · لِلَّهِ = for Allah · كَٱلْجِبَالِ = like the mountains.", "The second noun of an iḍāfa (“X of Y”) is also in jarr."]],
   ur:["حروفِ جر اور مجرور", ["حرفِ جر کے بعد اسم مجرور (زیر) ہوتا ہے: فِي میں · مِنْ سے · إِلَىٰ کی طرف · عَلَىٰ پر · عَنْ کے بارے میں · مَعَ ساتھ۔", "تین حروفِ جر ایک حرف ہیں جو لفظ سے جڑ جاتے ہیں: بِـ سے / کے ساتھ · لِـ کے لیے · كَـ کی طرح۔", "بِسْمِ ٱللَّهِ = اللہ کے نام سے · لِلَّهِ = اللہ کے لیے · كَٱلْجِبَالِ = پہاڑوں کی طرح۔", "اضافت کا دوسرا اسم بھی مجرور ہوتا ہے۔"]] }
);
/* lesson page: examples from real ayahs + practice button */
const _openLesson = openLesson;
openLesson = async function(i){
  await _openLesson(i);
  const Ls = LESSONS[i]; if (!Ls.drill) return; await drills();
  const D = DR[Ls.drill], ex = shuf(D.items.filter(x => x.easy && (!Ls.only || Ls.only.includes(x[3])))).slice(0, 5);
  const html = `<div class="lh"><h3>${T("fromAyahs")}</h3></div><ul class="lemlist">${ex.map(x => `<li><button data-go3="${x[0]}:${x[1]}:${x[2]}"><span class="la" dir="rtl">${esc(x[5])}</span><span class="lg">${esc(x[7])}<small>${esc(Ls.drill === "root" ? rootTxt(x[3]) : lbl(Ls.drill, x[3]))}</small></span><span class="lc">${x[0]}:${x[1]}</span></button></li>`).join("")}</ul>
    <button class="btn wide" data-ldrill="${i}" style="margin:8px 0">${T("practice")}</button>`;
  const d = document.querySelector("#learn .draft"); if (d) d.insertAdjacentHTML("beforebegin", html);
};
