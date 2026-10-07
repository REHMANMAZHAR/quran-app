"use strict";
/* ---------- My Quran progress: Planner, rings (reading · tafsir · understanding), Quran time, review quiz, reset ---------- */
Object.assign(L.ur, {
  pToday:"آج", pWeek:"اس ہفتے", pMonth:"اس مہینے", ringRead:"تلاوت / مطالعہ", ringTaf:"تفسیر", ringQuiz:"سمجھ (کوئز)",
  ayahsOf:(a,b)=>`${ud(a)} / ${ud(b)} آیات`, minsOf:(a,b)=>`${ud(a)} / ${ud(b)} منٹ`, rightOf:(a,b)=>`${ud(a)} / ${ud(b)} درست`,
  qTime:"قرآن کے ساتھ وقت", minShort:m=>`${ud(m)} منٹ`, avgLine:(w,m,t)=>`اوسط: ${ud(w)} منٹ روزانہ (پچھلے ۷ دن) · ${ud(m)} منٹ روزانہ (۳۰ دن) · کل ${t}`,
  hrs:(h,m)=>h ? `${ud(h)} گھنٹے ${ud(m)} منٹ` : `${ud(m)} منٹ`,
  planner:"پلانر", plFinish:"قرآن مکمل کریں", plNoEnd:"کوئی تاریخ نہیں — روزانہ ہدف خود چنیں", plDays:d=>`${ud(d)} دن میں`,
  plDaily:"روزانہ آیات", plTaf:"روزانہ تفسیر (منٹ)", plQuiz:"روزانہ کوئز (درست جوابات)", plAuto:(p,l)=>`ہدف خود بخود: روزانہ ${ud(p)} آیات · ${ud(l)} دن باقی`,
  plAdapt:"ہفتہ وار اور ماہانہ ہدف روزانہ ہدف سے خود بنتے ہیں (×۷، ×۳۰)۔",
  quizRead:p=>`کوئز: ${p} جو پڑھا`, quizNone:"پہلے کچھ آیات پڑھیں — پھر انہی سے کوئز بنے گا", quizH:"جو پڑھا اس سے کوئز",
  qAyah:"یہ کس آیت کا ترجمہ ہے؟", qWord:"اس لفظ کا مطلب؟", backMe:"میرا قرآن پر واپس",
  resetP:"پیش رفت ری سیٹ کریں", resetQ:"تمام پیش رفت (پڑھی گئی آیات، وقت، تفسیر، کوئز، پلانر) صاف ہو جائے گی۔ بک مارکس اور نوٹس محفوظ رہیں گے۔ جاری رکھیں؟", resetDone:"پیش رفت صاف ہو گئی"
});
Object.assign(L.en, {
  pToday:"Today", pWeek:"This week", pMonth:"This month", ringRead:"Reading", ringTaf:"Tafsir", ringQuiz:"Understanding (quiz)",
  ayahsOf:(a,b)=>`${a} / ${b} ayahs`, minsOf:(a,b)=>`${a} / ${b} min`, rightOf:(a,b)=>`${a} / ${b} correct`,
  qTime:"Time with the Quran", minShort:m=>`${m} min`, avgLine:(w,m,t)=>`Average: ${w} min a day (last 7 days) · ${m} min a day (30 days) · total ${t}`,
  hrs:(h,m)=>h ? `${h} h ${m} min` : `${m} min`,
  planner:"Planner", plFinish:"Finish the Quran", plNoEnd:"No end date — choose a daily goal", plDays:d=>`in ${d} days`,
  plDaily:"Ayahs a day", plTaf:"Tafsir a day (minutes)", plQuiz:"Quiz a day (correct answers)", plAuto:(p,l)=>`Target set automatically: ${p} ayahs a day · ${l} days left`,
  plAdapt:"Weekly and monthly targets follow the daily target (×7, ×30).",
  quizRead:p=>`Quiz: what I read ${p}`, quizNone:"Read some ayahs first — the quiz is made from them", quizH:"Quiz on what you read",
  qAyah:"Which ayah does this translation belong to?", qWord:"What does this word mean?", backMe:"Back to My Quran",
  resetP:"Reset progress", resetQ:"All progress (ayahs read, time, tafsir, quiz, planner) will be cleared. Bookmarks and notes are kept. Continue?", resetDone:"Progress cleared"
});
/* ---- stored data (added to U): rd{day:[keys]}, secs{day:s}, tafs{day:s}, qz{day:[ok,total]}, plan{} ---- */
["rd", "secs", "tafs", "qz"].forEach(k => { if (!U[k]) U[k] = {}; });
if (!U.plan) U.plan = { goal: U.goal || 10, days: U.khatam ? U.khatam.days : 0, start: U.khatam ? U.khatam.start : 0, base: 0, taf: 15, quiz: 10 };
const PV = { per: "d" };
const daysBack = n => { const out = []; for (let i = 0; i < n; i++) out.push(new Date(Date.now() - i * 864e5 - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10)); return out; };
const PER = { d: 1, w: 7, m: 30 };
const sumOver = (obj, n, f = x => x) => daysBack(n).reduce((t, d) => t + (obj[d] ? f(obj[d]) : 0), 0);
/* Quran time: counts while reading (recent activity), while recitation plays, or while tafsir plays */
let lastAct = Date.now();
function touchActive(){ lastAct = Date.now(); }
["scroll", "pointerdown", "keydown"].forEach(ev => addEventListener(ev, touchActive, { passive: true }));
setInterval(() => {
  if (document.visibilityState !== "visible" && !(P.audio && !P.audio.paused) && !tafPlaying()) return;
  const reading = LV.view === "read" || LV.view === "page", recit = P.audio && !P.audio.paused, taf = tafPlaying();
  if (!((reading && Date.now() - lastAct < 90e3) || recit || taf)) return;
  const d = dayKey(); U.secs[d] = (U.secs[d] || 0) + 15; if (taf) U.tafs[d] = (U.tafs[d] || 0) + 15; saveU();
}, 15e3);
function tafPlaying(){ const au = document.getElementById("vpAudio"); return !!(au && !au.paused); }
/* ---- targets (adaptive to the Planner) ---- */
function dailyReadTarget(){
  const pl = U.plan;
  if (pl.days) {
    const left = Math.max(1, pl.days - Math.floor((Date.now() - pl.start) / 864e5));
    const doneSince = Object.entries(U.rd).filter(([d]) => d >= new Date(pl.start).toISOString().slice(0, 10) && d < dayKey()).reduce((t, [, l]) => t + l.length, 0);
    return { pace: Math.max(1, Math.ceil(Math.max(0, TOTAL_AYAHS - pl.base - doneSince) / left)), left };
  }
  return { pace: pl.goal || 10, left: 0 };
}
function periodStats(per){
  const n = PER[per], dt = dailyReadTarget();
  const read = sumOver(U.rd, n, l => l.length) || (per === "d" ? (U.days[dayKey()] || 0) : 0);
  const taf = Math.round(sumOver(U.tafs, n) / 60), secs = sumOver(U.secs, n), q = daysBack(n).reduce((t, d) => { const x = U.qz[d]; return x ? [t[0] + x[0], t[1] + x[1]] : t; }, [0, 0]);
  return { read, readT: dt.pace * n, taf, tafT: (U.plan.taf || 15) * n, ok: q[0], asked: q[1], quizT: (U.plan.quiz || 10) * n, mins: Math.round(secs / 60) };
}
function rings3(vals){   // vals: [0..1] x3, outer → inner
  const col = ["var(--gold)", "#1f9d8b", "#8a63c9"], R = [48, 37, 26];
  return `<svg class="rings3" viewBox="0 0 112 112">${vals.map((v, i) => { const C = 2 * Math.PI * R[i];
    return `<circle cx="56" cy="56" r="${R[i]}" fill="none" stroke="${col[i]}" stroke-opacity=".18" stroke-width="9"/>
      <circle cx="56" cy="56" r="${R[i]}" fill="none" stroke="${col[i]}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(1, v))}" transform="rotate(-90 56 56)"/>`; }).join("")}</svg>`;
}
function progressCards(){
  const st = periodStats(PV.per), dt = dailyReadTarget(), pl = U.plan;
  const allSecs = Object.values(U.secs).reduce((a, b) => a + b, 0), hm = s => T("hrs", nf(Math.floor(s / 3600)), nf(Math.round(s % 3600 / 60)));
  const avg7 = Math.round(sumOver(U.secs, 7) / 60 / 7), avg30 = Math.round(sumOver(U.secs, 30) / 60 / 30);
  const tab = (k, l) => `<button data-per="${k}" aria-pressed="${PV.per === k}">${T(l)}</button>`;
  const opt = (arr, v) => arr.map(x => `<option value="${x}"${x === v ? " selected" : ""}>${nf(x)}</option>`).join("");
  return `<div class="lc prog3">
      <div class="seg3">${tab("d", "pToday")}${tab("w", "pWeek")}${tab("m", "pMonth")}</div>
      <div class="pr-row">${rings3([st.read / st.readT, st.taf / st.tafT, st.ok / st.quizT])}
        <ul class="pr-leg">
          <li><i style="background:var(--gold)"></i><b>${T("ringRead")}</b><span>${T("ayahsOf", nf(st.read), nf(st.readT))}</span></li>
          <li><i style="background:#1f9d8b"></i><b>${T("ringTaf")}</b><span>${T("minsOf", nf(st.taf), nf(st.tafT))}</span></li>
          <li><i style="background:#8a63c9"></i><b>${T("ringQuiz")}</b><span>${T("rightOf", nf(st.ok), nf(st.quizT))}</span></li>
          <li><i style="background:var(--ink)"></i><b>${T("qTime")}</b><span>${T("minShort", nf(st.mins))}</span></li>
        </ul></div>
      <p class="muted pr-avg">${T("avgLine", nf(avg7), nf(avg30), hm(allSecs))}</p>
      <button class="btn" data-pq="${PV.per}" style="width:100%">✎ ${T("quizRead", T(PV.per === "d" ? "pToday" : PV.per === "w" ? "pWeek" : "pMonth").toLowerCase())}</button>
    </div>
    <div class="lc"><h3 style="margin-top:0">${T("planner")}</h3>
      <label class="rng">${T("plFinish")} <select id="plDays"><option value="0"${pl.days ? "" : " selected"}>${T("plNoEnd")}</option>${[7, 15, 30, 40, 60, 90, 180, 365].map(d => `<option value="${d}"${pl.days === d ? " selected" : ""}>${T("plDays", nf(d))}</option>`).join("")}</select></label>
      ${pl.days ? `<p>${T("plAuto", nf(dt.pace), nf(dt.left))}</p>` : `<label class="rng">${T("plDaily")} <select id="plGoal">${opt([5, 10, 20, 30, 50, 100, 200], pl.goal)}</select></label>`}
      <label class="rng">${T("plTaf")} <select id="plTaf">${opt([5, 10, 15, 20, 30, 45, 60], pl.taf)}</select></label>
      <label class="rng">${T("plQuiz")} <select id="plQuiz">${opt([5, 10, 15, 20, 30], pl.quiz)}</select></label>
      <p class="muted" style="font-size:13px">${T("plAdapt")}</p></div>`;
}
function bindProgress(){
  const ch = (id, f) => { const el = document.getElementById(id); if (el) el.onchange = e => { f(+e.target.value); saveU(); renderMe(); }; };
  ch("plDays", v => { U.plan.days = v; U.plan.start = Date.now(); U.plan.base = Object.keys(U.read).length; });
  ch("plGoal", v => { U.plan.goal = v; U.goal = v; });
  ch("plTaf", v => { U.plan.taf = v; });
  ch("plQuiz", v => { U.plan.quiz = v; });
}
$("#me").addEventListener("click", e => {
  const p = e.target.closest("[data-per]"); if (p) { PV.per = p.dataset.per; renderMe(); return; }
  const q = e.target.closest("[data-pq]"); if (q) { reviewQuiz(q.dataset.pq); return; }
  const r = e.target.closest("[data-reset]"); if (r && confirm(T("resetQ"))) {
    ["read", "days", "rd", "secs", "tafs", "qz"].forEach(k => U[k] = {});
    U.khatam = null; U.plan = { goal: 10, days: 0, start: 0, base: 0, taf: 15, quiz: 10 }; saveU(); toast(esc(T("resetDone"))); renderMe();
  }
});
/* ---- review quiz built only from the ayahs read in the period ---- */
async function reviewQuiz(per){
  const keys = [...new Set(daysBack(PER[per]).flatMap(d => U.rd[d] || []))];
  if (!keys.length) { toast(esc(T("quizNone")), 3000); return; }
  const pick = shuf(keys).slice(0, 40), byS = {};
  pick.forEach(k => { const [s, a] = k.split(":").map(Number); (byS[s] = byS[s] || []).push(a); });
  const words = [], ayahs = [];
  for (const s of Object.keys(byS)) {
    const d = await DATA.surah(+s);
    byS[s].forEach(a => {
      const A = d.ayahs[a - 1]; if (!A) return;
      const tr = settings.lang === "en" ? (A.en2 || A.en) : (A.ur || A.ur2); if (tr) ayahs.push({ s: +s, a, tr, ar: A.w.map(w => w[0]).join(" ") });
      A.w.forEach((w, i) => { const lm = META.lemmas[w[5]]; if (lm && lm[4] && /^(N|V|ADJ|PN)/.test(lm[1]) && lm[3] < 2000) words.push([1e5 + w[5], w[0], "", lm[1], lm[3], (settings.llang !== "en" && typeof LEMUR !== "undefined" && LEMUR && LEMUR[w[5]]) || lm[4], "", +s, a, i + 1]); });
    });
  }
  const uniq = Object.values(Object.fromEntries(words.map(w => [w[0], w])));
  const qs = [], nQ = Math.max(5, Math.min(15, U.plan.quiz || 10));
  shuf(uniq).slice(0, Math.max(0, nQ - Math.min(4, Math.floor(ayahs.length / 4)))).forEach(w => qs.push(Object.assign(mcq(w, "w2m", uniq.length >= 4 ? uniq : uniq.concat(LV.V ? LV.V.words.slice(0, 60) : [])), {})));
  if (ayahs.length >= 4) shuf(ayahs).slice(0, Math.min(4, Math.floor(ayahs.length / 4))).forEach(A => {
    const others = shuf(ayahs.filter(x => x !== A)).slice(0, 3), opts = shuf([A, ...others]);
    qs.push({ prompt: `<div class="qm" style="font-size:16px;line-height:1.9">${esc(A.tr.length > 220 ? A.tr.slice(0, 220) + "…" : A.tr)}</div><div class="qh">${T("qAyah")}</div>`,
      opts: opts.map(o => `${esc(surahName(o.s))} ${nf(o.s)}:${nf(o.a)}`), ans: opts.indexOf(A) });
  });
  if (!qs.length) { toast(esc(T("quizNone")), 3000); return; }
  showView("learn");
  runQuiz(shuf(qs), { kind: "review", review: per });
}
/* record review results for the Understanding ring */
const _endQuiz = endQuiz;
endQuiz = function(){
  if (G && G.review && !G.done) { const d = dayKey(), x = U.qz[d] || [0, 0]; U.qz[d] = [x[0] + G.ok, x[1] + G.qs.length]; saveU(); }
  _endQuiz();
  if (G && G.review) { const box = document.querySelector("#learn .done-box"); if (box) box.insertAdjacentHTML("beforeend", `<p><button class="btn" data-backme="1">${T("backMe")}</button></p>`); }
};
$("#learn").addEventListener("click", e => { if (e.target.closest("[data-backme]")) showView("me"); });

/* close buttons: header ✕ (any view → back to reading), drawer ✕, sheet ✕ */
$("#btnBack").onclick = () => { if (typeof G !== "undefined" && G && !G.done && LV.view === "learn") G = null; showView("read"); };
$("#drX").onclick = closeAll;
$("#sheetX").onclick = closeAll;
