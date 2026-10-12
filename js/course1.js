"use strict";
/* ---------- Quranic Arabic course — Level 1 "Understand without grammar" (data/learn/course1.json, built by scripts/build_course1.py) ---------- */
Object.assign(L.ur, { c1H:"قرآنی عربی کورس", c1Sub:"لیول ۱ — گرامر کے بغیر سمجھیں · ۲۰ اسباق", c1Back:"← کورس", c1Words:"الفاظ — سننے کے لیے دبائیں", c1Phr:"آیات", c1Tip:"یاد رکھیں", c1Quiz:"مشق شروع کریں", c1Done:s=>`مکمل ✓ ${ud(s)}٪`, c1Score:(s,p)=>p ? `ماشاءاللہ! ${ud(s)}٪ — سبق مکمل` : `${ud(s)}٪ — ۸۰٪ پر سبق مکمل ہوگا، دوبارہ کوشش کریں`,
  c1QW:"اس لفظ کا مطلب؟", c1QA:"یہ کس لفظ کا مطلب ہے؟", c1QP:"اس آیت کا مطلب؟", c1Next:"اگلا", c1Again:"دوبارہ", c1NextL:"اگلا سبق", c1Prog:(a,b)=>`${ud(a)} / ${ud(b)} اسباق مکمل`, c1Draft:"مسودہ — وضاحتیں ہماری اپنی ہیں؛ عالم کی نظرِ ثانی باقی", c1Lesson:n=>`سبق ${ud(n)}` });
Object.assign(L.en, { c1H:"Quranic Arabic course", c1Sub:"Level 1 — understand without grammar · 20 lessons", c1Back:"← Course", c1Words:"Words — tap to listen", c1Phr:"Ayahs", c1Tip:"Remember", c1Quiz:"Start practice", c1Done:s=>`Done ✓ ${s}%`, c1Score:(s,p)=>p ? `MashaAllah! ${s}% — lesson complete` : `${s}% — 80% completes the lesson, try again`,
  c1QW:"What does this word mean?", c1QA:"Which word means this?", c1QP:"What does this ayah mean?", c1Next:"Next", c1Again:"Try again", c1NextL:"Next lesson", c1Prog:(a,b)=>`${a} / ${b} lessons done`, c1Draft:"Draft — explanations are our own; scholar review pending", c1Lesson:n=>`Lesson ${n}` });
let C1 = null; const C1S = Object.assign({ done: {} }, store.get("c1", {}));
const c1Save = () => store.set("c1", C1S);
async function c1Data(){ if (!C1) C1 = await load("course1", `data/learn/course1.json?v=${DV}`); return C1; }
const c1Txt = o => o ? (settings.lang === "en" ? o.en : o.ur) : "";
const c1Mean = w => settings.lmean === "en" ? w.en : settings.lmean === "ro" ? (w.ro || w.ur) : w.ur;
const c1MeanCls = () => settings.lmean === "ur" ? "ur" : "";
function c1Card(){
  const n = Object.keys(C1S.done).length;
  return `<button class="lc c1-card" data-c1="home"><span class="c1-badge">ع</span><span><b>${T("c1H")}</b><small>${T("c1Sub")}</small><i class="c1-bar"><em style="width:${n / 20 * 100}%"></em></i></span><span class="hm-go">›</span></button>`;
}
async function c1Home(){
  const D = await c1Data(), el = $("#learn"), n = Object.keys(C1S.done).length;
  el.innerHTML = `<div class="c1"><h2>${esc(c1Txt(D.title))}</h2><p class="muted">${T("c1Prog", nf(n), nf(D.lessons.length))} · <small>${T("c1Draft")}</small></p>
    <ol class="c1-list">${D.lessons.map(x => `<li><button data-c1l="${x.id}" class="${C1S.done[x.id] ? "ok" : ""}"><span class="pk-n">${nf(x.id)}</span><span><b>${esc(c1Txt(x.t))}</b>${C1S.done[x.id] ? `<small>${T("c1Done", nf(C1S.done[x.id]))}</small>` : ""}</span></button></li>`).join("")}</ol></div>`;
  scrollTo(0, 0);
}
async function c1Lesson(id){
  const D = await c1Data(), x = D.lessons.find(l => l.id === id), el = $("#learn");
  const words = x.w.map((w, i) => `<button class="c1-w" data-c1w="${i}"><span class="oar">${esc(w.ar)}</span><small class="${c1MeanCls()}">${esc(c1Mean(w))}</small></button>`).join("");
  const phr = x.p.map((p, i) => `<div class="c1-p"><button class="c1-play" data-c1p="${i}" aria-label="▶">▶</button><div><p class="oa" dir="rtl">${esc(p.ar)}</p><p class="${c1MeanCls()}">${esc(c1Mean(p))}</p><small>${esc(surahName(+p.ref.split(":")[0]))} ${nf(p.ref.split(":")[0])}:${nf(p.ref.split(":")[1])}</small></div></div>`).join("");
  el.innerHTML = `<div class="c1"><button class="btn ghost" data-c1="home">${T("c1Back")}</button>
    <h2><small>${T("c1Lesson", nf(x.id))}</small><br>${esc(c1Txt(x.t))}</h2><p class="c1-i">${esc(c1Txt(x.i))}</p>
    ${x.w.length ? `<h3>${T("c1Words")}</h3><div class="c1-grid">${words}</div>` : ""}
    ${x.p.length ? `<h3>${T("c1Phr")}</h3>${phr}` : ""}
    ${c1Txt(x.tip) ? `<div class="c1-tip"><b>${T("c1Tip")}</b><p>${esc(c1Txt(x.tip))}</p></div>` : ""}
    <button class="btn wide" data-c1q="${x.id}" style="margin-top:16px">${T("c1Quiz")}</button></div>`;
  el.dataset.c1cur = id; scrollTo(0, 0);
}
/* practice: 10 questions from the lesson's words and ayahs (the level test mixes all lessons) */
let CQ = null;
const shuf2 = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
async function c1Quiz(id){
  const D = await c1Data(), x = D.lessons.find(l => l.id === id);
  const pool = id === 20 ? D.lessons.flatMap(l => l.w) : x.w, all = D.lessons.flatMap(l => l.w);
  const uniq = arr => arr.filter((w, i, A) => A.findIndex(y => c1Mean(y) === c1Mean(w)) === i && c1Mean(w));
  const qs = [];
  shuf2(uniq(pool)).slice(0, id === 20 ? 20 : 8).forEach((w, k) => {
    const others = shuf2(uniq(all).filter(y => c1Mean(y) !== c1Mean(w) && y.ar !== w.ar)).slice(0, 3), opts = shuf2([w, ...others]);
    qs.push(k % 3 === 2 ? { kind: "a", w, opts, ans: opts.indexOf(w) } : { kind: "w", w, opts, ans: opts.indexOf(w) });
  });
  if (id !== 20) x.p.forEach(p => { const others = shuf2(D.lessons.flatMap(l => l.p).filter(y => y.ref !== p.ref)).slice(0, 3), opts = shuf2([p, ...others]); qs.push({ kind: "p", w: p, opts, ans: opts.indexOf(p) }); });
  CQ = { id, qs: shuf2(qs), i: 0, right: 0, picked: null };
  c1Q();
}
function c1Q(){
  const el = $("#learn"), q = CQ.qs[CQ.i];
  if (!q) {
    const s = Math.round(CQ.right / CQ.qs.length * 100), pass = s >= 80;
    if (pass) { C1S.done[CQ.id] = Math.max(s, C1S.done[CQ.id] || 0); c1Save(); }
    el.innerHTML = `<div class="c1 c1-end"><div class="big">${pass ? "🌟" : "↻"}</div><p>${T("c1Score", nf(s), pass)}</p>
      <div class="wd-actions" style="justify-content:center"><button class="btn ghost" data-c1q="${CQ.id}">${T("c1Again")}</button>${pass && CQ.id < 20 ? `<button class="btn" data-c1l="${CQ.id + 1}">${T("c1NextL")}</button>` : `<button class="btn" data-c1="home">${T("c1Back")}</button>`}</div></div>`;
    return;
  }
  const mean = w => `<span class="${c1MeanCls()}">${esc(c1Mean(w))}</span>`, ar = w => `<span class="oar">${esc(w.ar)}</span>`;
  const prompt = q.kind === "w" ? `<div class="qa">${esc(q.w.ar)}</div><div class="qh">${T("c1QW")}</div>` : q.kind === "a" ? `<div class="qm">${mean(q.w)}</div><div class="qh">${T("c1QA")}</div>` : `<div class="oa" dir="rtl" style="font-size:22px">${esc(q.w.ar)}</div><div class="qh">${T("c1QP")}</div>`;
  const opt = (o, i) => { const st = CQ.picked == null ? "" : i === q.ans ? " ok" : i === CQ.picked ? " no" : "";
    return `<button class="c1-o${st}" data-c1a="${i}"${CQ.picked != null ? " disabled" : ""}>${q.kind === "a" ? ar(o) : mean(o)}</button>`; };
  el.innerHTML = `<div class="c1 c1-quiz"><div class="c1-top"><button class="iconbtn" data-c1l="${CQ.id}" aria-label="✕"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><i class="c1-bar"><em style="width:${CQ.i / CQ.qs.length * 100}%"></em></i><span>${nf(CQ.i + 1)}/${nf(CQ.qs.length)}</span></div>
    <div class="lc qcard">${prompt}</div><div class="c1-opts">${q.opts.map(opt).join("")}</div>
    ${CQ.picked != null ? `<button class="btn wide" data-c1n="1">${T("c1Next")}</button>` : ""}</div>`;
}
let c1Au = null;
function c1PlayAyah(ref){ const [s, a] = ref.split(":"); const rec = /^mq:/.test(settings.rec || "") ? "Alafasy_128kbps" : settings.rec;
  if (c1Au) c1Au.pause(); c1Au = new Audio(`${AUDIO}${rec}/${p3(+s)}${p3(+a)}.mp3`); c1Au.play().catch(() => {}); }
$("#learn").addEventListener("click", async e => {
  const h = e.target.closest("[data-c1]"); if (h) { e.stopPropagation(); c1Home(); return; }
  const l = e.target.closest("[data-c1l]"); if (l) { e.stopPropagation(); c1Lesson(+l.dataset.c1l); return; }
  const q = e.target.closest("[data-c1q]"); if (q) { e.stopPropagation(); c1Quiz(+q.dataset.c1q); return; }
  const a = e.target.closest("[data-c1a]"); if (a && CQ && CQ.picked == null) { CQ.picked = +a.dataset.c1a; if (CQ.picked === CQ.qs[CQ.i].ans) CQ.right++; c1Q(); return; }
  if (e.target.closest("[data-c1n]")) { CQ.i++; CQ.picked = null; c1Q(); return; }
  const w = e.target.closest("[data-c1w]"); if (w) { const D = await c1Data(), x = D.lessons.find(y => y.id === +$("#learn").dataset.c1cur), it = x && x.w[+w.dataset.c1w];
    if (it && it.ref) playWord(...it.ref.split(":").map(Number)); w.classList.add("on"); setTimeout(() => w.classList.remove("on"), 600); return; }
  const p = e.target.closest("[data-c1p]"); if (p) { const D = await c1Data(), x = D.lessons.find(y => y.id === +$("#learn").dataset.c1cur); if (x) c1PlayAyah(x.p[+p.dataset.c1p].ref); }
}, true);
/* the course card sits at the top of Learn */
const _learnHomeC1 = learnHome;
learnHome = async function(...a){ const r = await _learnHomeC1(...a); if (LV.view === "learn" && !$("#learn .c1-card")) { const sw = $("#learn .ll-sw.ll-sm") || $("#learn .ll-sw"); if (sw) sw.insertAdjacentHTML("afterend", c1Card()); else $("#learn").insertAdjacentHTML("afterbegin", c1Card()); } return r; };
VIEWS.learn.render = () => learnHome();
