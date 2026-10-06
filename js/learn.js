"use strict";
/* ---------- Learn: flashcards, Word Match, "% understood" meter ---------- */
Object.assign(L.ur, {
  tabRead:"پڑھیں", tabLearn:"سیکھیں", learnT:"سیکھیں", learnSub:"قرآن کے الفاظ",
  meterH:p=>`آپ قرآن کے ${ud(p)}٪ الفاظ پہچانتے ہیں`, meterP:(k,n)=>`${ud(k)} الفاظ سیکھ لیے — اگلے ${ud(n)} الفاظ سے اور اضافہ ہوگا`,
  meterStart:"پہلے ۱۲۵ الفاظ قرآن کے ۶۱٫۷٪ الفاظ ہیں۔ شروع کریں!",
  known:"سیکھے گئے", due:"آج دہرائی", streak:"دن مسلسل", review:n=>`${ud(n)} الفاظ دہرائیں`, startNew:"نئے الفاظ سیکھیں",
  decksH:"الفاظ کے سیٹ", decksS:"سب سے زیادہ آنے والے الفاظ پہلے", deck:n=>`سیٹ ${ud(n)}`, gamesH:"کھیل",
  matchT:"الفاظ ملائیں", matchS:"عربی لفظ کو اس کے معنی سے ملائیں", soonT:"جلد آ رہا ہے", soonS:"کوئز، آیت جوڑیں، سنیں اور چنیں، مادہ تلاش",
  best:t=>`بہترین: ${t}`, tapReveal:"معنی دیکھنے کے لیے کارڈ دبائیں", again:"یاد نہیں تھا", good:"یاد تھا", easy:"بہت آسان", gradeHint:"آپ کو یہ لفظ کتنا یاد تھا؟ ہم اسے صحیح وقت پر دوبارہ دکھائیں گے۔", gAgain:"آج ہی دوبارہ دکھائیں", gIn:d=>d===1?"کل دوبارہ":`${ud(d)} دن بعد دوبارہ`, studyH:"سیکھنے کے اوزار",
  inQ:n=>`قرآن میں ${ud(n)} بار`, hearIt:"آیت میں سنیں", back:"واپس", sessDone:"شاباش!", sessP:(n,p)=>`${ud(n)} کارڈ مکمل۔ اب آپ قرآن کے ${ud(p)}٪ الفاظ پہچانتے ہیں۔`,
  noDue:"آج دہرانے کو کچھ نہیں — نئے الفاظ سیکھیں۔", matchDone:"سب جوڑے مل گئے!", time:"وقت", playAgain:"دوبارہ کھیلیں", newBest:"نیا ریکارڈ!",
  enNote:"معنی فی الحال انگریزی میں ہیں — اردو معنی جلد شامل ہوں گے۔"
});
Object.assign(L.en, {
  tabRead:"Read", tabLearn:"Learn", learnT:"Learn", learnSub:"Words of the Quran",
  meterH:p=>`You recognise ${p}% of the Quran's words`, meterP:(k,n)=>`${k} words learned — the next ${n} add even more`,
  meterStart:"The top 125 words make up 61.7% of all words in the Quran. Start here!",
  known:"Learned", due:"Due today", streak:"Day streak", review:n=>`Review ${n} words`, startNew:"Learn new words",
  decksH:"Word decks", decksS:"Most frequent words first", deck:n=>`Deck ${n}`, gamesH:"Games",
  matchT:"Word Match", matchS:"Match each Arabic word to its meaning", soonT:"Coming soon", soonS:"Quiz, Ayah Builder, Listen & Tap, Root Hunt",
  best:t=>`Best: ${t}`, tapReveal:"Tap the card to see the meaning", again:"Didn't know", good:"Knew it", easy:"Very easy", gradeHint:"How well did you know this word? We'll show it again at the right time.", gAgain:"Show again today", gIn:d=>d===1?"Again tomorrow":`Again in ${d} days`, studyH:"Study tools",
  inQ:n=>`${n} times in the Quran`, hearIt:"Hear it in the ayah", back:"Back", sessDone:"Well done!", sessP:(n,p)=>`${n} cards done. You now recognise ${p}% of the Quran's words.`,
  noDue:"Nothing due today — learn some new words.", matchDone:"All pairs matched!", time:"Time", playAgain:"Play again", newBest:"New best!",
  enNote:""
});
DATA.vocab = () => load("vocab", `data/learn/vocab.json?v=${DV}`);
const LV = { view:"read", V:null, q:[], i:0, done:0, flip:false, m:null };
const IV = [0, 1, 3, 7, 14, 30, 60];             // days until next review, by box
const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
const LS = Object.assign({ c:{}, st:{ last:0, days:0 }, best:{} }, store.get("learn", {}));
const saveL = () => store.set("learn", LS);
const box = r => (LS.c[r] || [0])[0];
const isKnown = r => box(r) >= 2;
const decks = () => { const d = []; for (let i = 0; i < 125; i += 5) d.push([i, i + 5]); for (let i = 125; i < 1000; i += 25) d.push([i, i + 25]); return d; };
const nf = n => settings.lang === "en" ? String(n) : ud(n);
function coverage(){
  const W = LV.V.words; let k = 0, c = 0;
  for (const w of W) if (isKnown(w[0])) { k++; c += w[4]; }
  return { known: k, pct: Math.round(c / LV.V.total * 1000) / 10 };
}
const dueList = () => LV.V.words.filter(w => LS.c[w[0]] && LS.c[w[0]][1] <= today()).map(w => w[0]);
const fmtT = ms => { const s = Math.round(ms / 100) / 10; return (s < 60 ? s.toFixed(1) + "s" : Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0")); };
const shortM = m => m.split(/ \/ |; /)[0].replace(/\s*\([^)]*\)/g, "").trim();
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const WR = r => LV.V.words[r - 1];

/* views: read (#main) plus full-screen sections; each module registers VIEWS[name] = { el, title:()=>[ar,en], render } */
const VIEWS = { learn: { el:"#learn", title:() => [T("learnT"), T("learnSub")], render:() => learnHome() } };
function showView(v){
  LV.view = v;
  $("#main").hidden = v !== "read";
  document.querySelectorAll("section.view").forEach(el => el.hidden = !(VIEWS[v] && el.matches(VIEWS[v].el)));
  document.querySelectorAll(".tabbar button").forEach(b => b.setAttribute("aria-selected", b.dataset.v === v || (v === "page" && b.dataset.v === "read") || (v === "search" && false)));
  $("#btnPlay").hidden = v !== "read" && v !== "page";
  if ($("#btnTaf")) $("#btnTaf").hidden = v !== "read";
  if ($("#btnBack")) $("#btnBack").hidden = v === "read";
  if (VIEWS[v]) { const [a, e] = VIEWS[v].title(); $("#tAr").textContent = a; $("#tEn").textContent = e; VIEWS[v].render(); }
  else if (CUR) { const S = META.surahs[CUR.n - 1]; $("#tAr").textContent = T("surahPre") + S.ar; $("#tEn").textContent = `${S.n}. ${S.tr} · ${S.en}`; }
  scrollTo(0, 0);
}
function ringSVG(p){
  const r = 46, C = 2 * Math.PI * r, off = C * (1 - Math.min(p, 100) / 100);
  return `<div class="ring"><svg viewBox="0 0 108 108"><circle cx="54" cy="54" r="${r}" fill="none" stroke="var(--line)" stroke-width="9"/>
    <circle cx="54" cy="54" r="${r}" fill="none" stroke="var(--gold)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}"/></svg>
    <div class="pct">${p}%</div></div>`;
}
async function learnHome(){
  const el = $("#learn");
  if (!LV.V) { el.innerHTML = `<div class="loading">${T("loading")}</div>`; try { LV.V = await DATA.vocab(); } catch(e) { el.innerHTML = `<div class="loading">${T("loadFail")}</div>`; return; } }
  const cv = coverage(), due = dueList().length, D = decks();
  const nextDeck = D.findIndex(([a, b]) => LV.V.words.slice(a, b).some(w => !LS.c[w[0]]));
  const streak = LS.st.last >= today() - 1 ? LS.st.days : 0;
  const deckHTML = D.map(([a, b], i) => {
    const ws = LV.V.words.slice(a, b), k = ws.filter(w => isKnown(w[0])).length;
    return `<button class="deck${k === ws.length ? " done" : ""}" data-deck="${i}"><div class="dn">${a + 1}–${b}</div><div class="da">${esc(ws[0][1])}</div>
      <div class="bar2"><i style="width:${Math.round(k / ws.length * 100)}%"></i></div></button>`;
  }).join("");
  const bm = LS.best.match;
  el.innerHTML = `<div class="lc"><div class="meter">${ringSVG(cv.pct)}<div><h2>${T("meterH", nf(cv.pct))}</h2>
      <p>${cv.known ? T("meterP", nf(cv.known), nf(25)) : T("meterStart")}</p></div></div>
      <div class="stats"><div class="stat"><b>${cv.known}</b><span>${T("known")}</span></div><div class="stat"><b>${due}</b><span>${T("due")}</span></div>
      <div class="stat"><b>${streak}</b><span>${T("streak")}</span></div></div>
      <div style="display:grid;gap:8px;margin-top:14px">${due ? `<button class="btn wide" data-act="review">${T("review", nf(due))}</button>` : ""}
      ${nextDeck >= 0 ? `<button class="btn ${due ? "ghost " : ""}wide" data-deck="${nextDeck}">${T("startNew")} · ${T("deck", nf(nextDeck + 1))}</button>` : ""}</div>
      ${T("enNote") ? `<p style="color:var(--muted);font-size:12.5px;margin:10px 0 0">${T("enNote")}</p>` : ""}</div>
    ${wotdHTML()}
    ${questHTML()}
    <div class="lh"><h3>${T("studyH")}</h3></div>
    ${gamesGridHTML()}
    ${lecturesCard()}
    <div class="lh"><h3>${T("decksH")}</h3><small>${T("decksS")}</small></div>
    <div class="decks">${deckHTML}</div>`;
}
/* flashcards */
function startCards(ranks){
  if (!ranks.length) { toast(esc(T("noDue"))); return; }
  LV.q = ranks.slice(); LV.i = 0; LV.done = 0; LV.flip = false; drawCard();
}
function deckRanks(i){
  const [a, b] = decks()[i], t = today();
  return LV.V.words.slice(a, b).filter(w => !LS.c[w[0]] || LS.c[w[0]][1] <= t).map(w => w[0]);
}
function drawCard(){
  const el = $("#learn");
  if (LV.i >= LV.q.length) {
    const cv = coverage();
    el.innerHTML = `<div class="lc done-box"><div class="big">${cv.pct}%</div><h2>${T("sessDone")}</h2><p>${T("sessP", nf(LV.done), nf(cv.pct))}</p>
      <button class="btn" data-act="home">${T("back")}</button></div>`;
    return;
  }
  const w = WR(LV.q[LV.i]), pct = Math.round(LV.i / LV.q.length * 100);
  const front = `<div class="big">${esc(w[1])}</div><div class="typ">${esc(w[3])}</div><div class="tap">${T("tapReveal")}</div>`;
  const back = `<div class="big" style="font-size:46px">${esc(w[1])}</div><div class="mean">${esc(w[5])}</div>${w[6] ? `<div class="also">${esc(w[6])}</div>` : ""}
    ${w[2] ? `<div class="rt">${esc(w[2])}</div>` : ""}<div class="cnt">${T("inQ", nf(w[4]))}</div>
    <div class="ex"><div class="ew">${esc(w[10])}</div><div class="eg">${esc(w[11])} · ${w[7]}:${w[8]}</div>
    <button class="hear" data-hear="${w[7]}:${w[8]}:${w[9]}">${T("hearIt")}</button></div>`;
  el.innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <div class="prog"><i style="width:${pct}%"></i></div><small>${LV.i + 1}/${LV.q.length}</small></div>
    <div class="card" data-act="flip" role="button" tabindex="0">${LV.flip ? back : front}</div>
    ${LV.flip ? `<p class="ghint">${T("gradeHint")}</p><div class="grades"><button class="g0" data-g="0">✗ ${T("again")}<small>${T("gAgain")}</small></button>
      <button class="g1" data-g="1">✓ ${T("good")}<small>${T("gIn", IV[Math.min(box(w[0]) + 1, 6)] || 1)}</small></button>
      <button class="g2" data-g="2">★ ${T("easy")}<small>${T("gIn", IV[Math.min(box(w[0]) + 2, 6)])}</small></button></div>` : ""}`;
}
function grade(g){
  const r = LV.q[LV.i], t = today(), c = LS.c[r] || [0, t, 0];
  if (g === 0) { c[0] = 0; c[1] = t; LV.q.splice(Math.min(LV.i + 4, LV.q.length), 0, r); }
  else { c[0] = Math.min((c[2] ? c[0] : 0) + g, 6); c[1] = t + IV[c[0]]; LV.done++; }
  c[2] = (c[2] || 0) + 1; LS.c[r] = c;
  if (LS.st.last !== t) { LS.st.days = LS.st.last === t - 1 ? LS.st.days + 1 : 1; LS.st.last = t; }
  saveL(); LV.i++; LV.flip = false; drawCard();
}
/* Word Match */
function startMatch(){
  const W = LV.V.words, seen = W.filter(w => LS.c[w[0]]);
  let pool = seen.length >= 6 ? seen : W.slice(0, 30);
  const pick = [], used = new Set();
  for (const w of shuffle(pool.slice())) { const m = shortM(w[5]).toLowerCase(); if (!used.has(m) && m) { used.add(m); pick.push(w); } if (pick.length === 6) break; }
  LV.m = { words: pick, left: shuffle(pick.map(w => w[0])), right: shuffle(pick.map(w => w[0])), sel: null, ok: new Set(), t0: Date.now(), pen: 0 };
  drawMatch();
}
function drawMatch(){
  const M = LV.m, el = $("#learn");
  if (M.ok.size === M.words.length) {
    const ms = Date.now() - M.t0 + M.pen, nb = !LS.best.match || ms < LS.best.match;
    if (nb) { LS.best.match = ms; saveL(); }
    el.innerHTML = `<div class="lc done-box"><div class="big">${fmtT(ms)}</div><h2>${T("matchDone")}</h2>${nb ? `<p>${T("newBest")}</p>` : `<p>${T("best", fmtT(LS.best.match))}</p>`}
      <div style="display:flex;gap:8px;justify-content:center"><button class="btn" data-act="match">${T("playAgain")}</button><button class="btn ghost" data-act="home">${T("back")}</button></div></div>`;
    return;
  }
  const tile = (r, side) => { const w = WR(r), cls = (M.ok.has(r) ? " ok" : "") + (M.sel && M.sel[0] === side && M.sel[1] === r ? " sel" : "");
    return `<button class="tile ${side === "a" ? "ar" : "en"}${cls}" data-m="${side}:${r}">${esc(side === "a" ? w[1] : shortM(w[5]))}</button>`; };
  el.innerHTML = `<div class="mt-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <span>${T("time")} <b id="mtT">0.0s</b></span><span>${M.ok.size}/${M.words.length}</span></div>
    <div class="mt" dir="ltr"><div class="col">${M.right.map(r => tile(r, "e")).join("")}</div><div class="col">${M.left.map(r => tile(r, "a")).join("")}</div></div>`;
}
setInterval(() => { const t = $("#mtT"); if (t && LV.m && LV.m.ok.size < LV.m.words.length) t.textContent = fmtT(Date.now() - LV.m.t0 + LV.m.pen); }, 200);
function tapTile(side, r, btn){
  const M = LV.m;
  if (!M.sel || M.sel[0] === side) { M.sel = [side, r]; drawMatch(); return; }
  if (M.sel[1] === r) { M.ok.add(r); M.sel = null; drawMatch(); return; }
  M.pen += 3000; M.sel = null; btn.classList.add("bad"); setTimeout(drawMatch, 300);
}
$("#learn").addEventListener("click", e => {
  const b = e.target.closest("[data-act],[data-deck],[data-g],[data-m],[data-hear]");
  if (!b) return;
  if (b.dataset.hear) { const [s, a, w] = b.dataset.hear.split(":").map(Number); playWord(s, a, w); return; }
  if (b.dataset.deck != null) return startCards(deckRanks(+b.dataset.deck));
  if (b.dataset.g != null) return grade(+b.dataset.g);
  if (b.dataset.m) { const [side, r] = b.dataset.m.split(":"); return tapTile(side, +r, b); }
  const a = b.dataset.act;
  if (a === "home") goHome();
  else if (a === "review") startCards(dueList());
  else if (a === "match") startMatch();
  else if (a === "flip") { LV.flip = !LV.flip; drawCard(); }
});
$("#learn").addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.dataset.act === "flip") { e.preventDefault(); LV.flip = !LV.flip; drawCard(); } });
document.querySelector(".tabbar").addEventListener("click", e => { const b = e.target.closest("[data-v]"); if (b && b.dataset.v !== LV.view) showView(b.dataset.v); });
function labelTabs(){ const K = { read:"tabRead", learn:"tabLearn", games:"tabGames", duas:"tabDuas", me:"tabMe" }; document.querySelectorAll(".tabbar [data-v]").forEach(b => b.querySelector("span").textContent = T(K[b.dataset.v])); }

