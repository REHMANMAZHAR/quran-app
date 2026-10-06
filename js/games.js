"use strict";
/* ---------- Learn: games, Quest path, XP & badges, word of the day, Salah mode, root explorer (sections D, J) ---------- */
Object.assign(L.ur, {
  questH:"قرآن عربی کویسٹ", questSub:"مرحلہ وار راستہ — ہر یونٹ: الفاظ، کوئز، پاس", unit:n=>`یونٹ ${ud(n)}`, salahUnit:"نماز کے الفاظ", level:n=>`لیول ${ud(n)}`, xp:n=>`${ud(n)} XP`,
  learnW:"الفاظ سیکھیں", gate:"پاس کوئز (۸۰٪)", passed:"پاس ✓", locked:"بند", badgesH:"اعزازات",
  wotd:"آج کا لفظ", addCards:"میرے کارڈز میں شامل کریں", salahMode:"نماز موڈ", salahS:"فاتحہ اور چھوٹی سورتوں کے الفاظ",
  quizT:"کوئز", quizS:"لفظ ↔ معنی، سن کر پہچانیں", listenT:"سنیں اور چنیں", listenS:"آیت میں سنا ہوا لفظ تلاش کریں", builderT:"آیت جوڑیں", builderS:"الفاظ کو صحیح ترتیب میں لگائیں",
  rootHT:"مادہ تلاش", rootHS:"ایک مادے کے تمام الفاظ چنیں", speedT:"تیز راؤنڈ", speedS:"۶۰ سیکنڈ میں زیادہ سے زیادہ", passT:"فون گھمائیں", passS:"۲–۴ کھلاڑی، ایک فون", weekT:"ہفتہ وار چیلنج", weekS:"سب کے لیے ایک جیسے ۱۰ سوال",
  rootsT:"مادوں کا خزانہ", rootsS:"تمام ۱۶۵۱ مادے", courseT:"گرامر کورس", courseS:"قرآن سمجھنے کے لیے ضروری قواعد", irabT:"اعراب لیب", irabS:"آخری حرکت بدلے تو معنی کیا ہوگا؟",
  whatMeans:"اس کا معنی کیا ہے؟", whichWord:"کون سا لفظ؟", listenQ:"سنیں — اس کا معنی؟", tapHeard:"جو لفظ سنا اسے چنیں", tapOrder:"الفاظ کو ترتیب سے دبائیں", pickRoot:r=>`مادہ «${r}» کے تمام الفاظ چنیں`, check:"چیک کریں",
  correct:"درست!", wrong:"غلط — درست جواب:", score:(a,b)=>`${ud(a)} / ${ud(b)} درست`, earned:n=>`+${ud(n)} XP`, again2:"دوبارہ", next:"آگے", playN:n=>`${ud(n)} کھلاڑی`, player:n=>`کھلاڑی ${ud(n)}`,
  passTo:n=>`فون کھلاڑی ${ud(n)} کو دیں`, ready:"تیار", winner:n=>`جیتنے والا: کھلاڑی ${ud(n)}`, weekN:n=>`ہفتہ ${ud(n)}`, shareScore:"اسکور شیئر کریں", bestWeek:n=>`اس ہفتے کا بہترین: ${ud(n)}/۱۰`,
  hear:"▶ سنیں", timeLeft:s=>`${ud(s)} سیکنڈ`, unitDone:"یونٹ مکمل!", occH:"قرآن میں مقامات", search:"تلاش"
});
Object.assign(L.en, {
  questH:"Quran Arabic Quest", questSub:"Step-by-step path — each unit: words, quiz, pass", unit:n=>`Unit ${n}`, salahUnit:"Salah words", level:n=>`Level ${n}`, xp:n=>`${n} XP`,
  learnW:"Learn the words", gate:"Pass quiz (80%)", passed:"Passed ✓", locked:"Locked", badgesH:"Badges",
  wotd:"Word of the day", addCards:"Add to my cards", salahMode:"Salah mode", salahS:"Words of Al-Fatiha and short surahs",
  quizT:"Quiz", quizS:"Word ↔ meaning, listen and identify", listenT:"Listen & Tap", listenS:"Find the word you hear in the ayah", builderT:"Ayah Builder", builderS:"Put the words in the right order",
  rootHT:"Root Hunt", rootHS:"Pick every word from one root", speedT:"Speed Round", speedS:"As many as you can in 60 seconds", passT:"Pass the Phone", passS:"2–4 players, one phone", weekT:"Weekly Challenge", weekS:"Same 10 questions for everyone",
  rootsT:"Root Explorer", rootsS:"All 1,651 roots", courseT:"Grammar Course", courseS:"The rules you need to understand the Quran", irabT:"I'rab Lab", irabS:"What if the ending changes?",
  whatMeans:"What does it mean?", whichWord:"Which word?", listenQ:"Listen — what does it mean?", tapHeard:"Tap the word you heard", tapOrder:"Tap the words in order", pickRoot:r=>`Pick every word from the root «${r}»`, check:"Check",
  correct:"Correct!", wrong:"Not quite — answer:", score:(a,b)=>`${a} / ${b} correct`, earned:n=>`+${n} XP`, again2:"Play again", next:"Next", playN:n=>`${n} players`, player:n=>`Player ${n}`,
  passTo:n=>`Pass the phone to Player ${n}`, ready:"Ready", winner:n=>`Winner: Player ${n}`, weekN:n=>`Week ${n}`, shareScore:"Share score", bestWeek:n=>`Your best this week: ${n}/10`,
  hear:"▶ Listen", timeLeft:s=>`${s}s`, unitDone:"Unit complete!", occH:"Where it appears", search:"Search"
});
LS.xp = LS.xp || 0; LS.badges = LS.badges || {}; LS.unit = LS.unit || {}; LS.week = LS.week || {};
const BADGES = [["first","First steps","پہلا قدم"],["unit1","First unit passed","پہلا یونٹ پاس"],["perfect","Perfect quiz","مکمل درست کوئز"],["s3","3-day streak","۳ دن مسلسل"],["s7","7-day streak","۷ دن مسلسل"],["s30","30-day streak","۳۰ دن مسلسل"],
  ["p10","Know 10% of Quran words","قرآن کے ۱۰٪ الفاظ"],["p25","Know 25%","۲۵٪ الفاظ"],["p50","Know 50%","۵۰٪ الفاظ"],["week","Weekly challenge done","ہفتہ وار چیلنج"],["course","Grammar lesson done","گرامر سبق مکمل"]];
function addXP(n){ LS.xp += n; checkBadges(); saveL(); }
function badge(id){ if (!LS.badges[id]) { LS.badges[id] = Date.now(); const b = BADGES.find(x => x[0] === id); if (b) toast("🏅 " + esc(settings.lang === "en" ? b[1] : b[2]), 3000); } }
function checkBadges(){
  if (LS.xp > 0) badge("first");
  const st = LS.st.last >= today() - 1 ? LS.st.days : 0; if (st >= 3) badge("s3"); if (st >= 7) badge("s7"); if (st >= 30) badge("s30");
  if (LV.V) { const p = coverage().pct; if (p >= 10) badge("p10"); if (p >= 25) badge("p25"); if (p >= 50) badge("p50"); }
}
const _grade = grade; grade = function(g){ if (g > 0) addXP(2); _grade(g); };
/* seeded random (weekly challenge, word of the day) */
function rng(seed){ let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
const shuf = (a, r = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const weekNo = () => { const d = new Date(), t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7)); const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return t.getUTCFullYear() * 100 + Math.ceil(((t - y) / 864e5 + 1) / 7); };
/* ---- question builders ---- */
function pool(min = 12){ const seen = LV.V.words.filter(w => LS.c[w[0]]); return seen.length >= min ? seen : LV.V.words.slice(0, 60); }
function mcq(w, kind, src, r = Math.random){
  const others = shuf(src.filter(x => x[0] !== w[0] && shortM(x[5]).toLowerCase() !== shortM(w[5]).toLowerCase()), r).slice(0, 3), opts = shuf([w, ...others], r);
  if (kind === "m2w") return { prompt:`<div class="qm">${esc(shortM(w[5]))}</div><div class="qh">${T("whichWord")}</div>`, opts: opts.map(o => `<span class="oar">${esc(o[1])}</span>`), ans: opts.indexOf(w), w };
  if (kind === "listen") return { prompt:`<button class="btn" data-q="hear">${T("hear")}</button><div class="qh">${T("listenQ")}</div>`, opts: opts.map(o => esc(shortM(o[5]))), ans: opts.indexOf(w), w, audio:[w[7], w[8], w[9]] };
  return { prompt:`<div class="qa">${esc(w[1])}</div><div class="qh">${T("whatMeans")}</div>`, opts: opts.map(o => esc(shortM(o[5]))), ans: opts.indexOf(w), w };
}
/* ---- generic multiple-choice runner ---- */
let G = null;
function runQuiz(qs, opt = {}){ G = Object.assign({ qs, i: 0, ok: 0, picked: null, t0: Date.now() }, opt); drawQ(); }
function drawQ(){
  const el = $("#learn");
  if (G.timed && Date.now() - G.t0 > G.timed * 1000) return endQuiz();
  if (G.i >= G.qs.length) { if (G.more) { G.qs.push(...G.more()); } else return endQuiz(); }
  const q = G.qs[G.i], top = G.players ? `<b>${T("player", G.turn + 1)}</b>` : `<small>${G.timed ? `<span id="gT">${T("timeLeft", G.timed)}</span>` : `${G.i + 1}/${G.qs.length}`}</small>`;
  el.innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <div class="prog"><i style="width:${G.timed ? 100 : Math.round(G.i / G.qs.length * 100)}%"></i></div>${top}</div>
    <div class="card q">${q.prompt}</div><div class="opts">${q.opts.map((o, k) => `<button data-opt="${k}" class="${G.picked == null ? "" : k === q.ans ? "ok" : k === G.picked ? "no" : ""}">${o}</button>`).join("")}</div>
    ${G.picked != null ? `<div class="fb ${G.picked === q.ans ? "ok" : "no"}">${G.picked === q.ans ? T("correct") : T("wrong") + " " + q.opts[q.ans]}${q.w ? ` · <span class="oar">${esc(q.w[1])}</span> ${esc(q.w[5])}` : ""}</div><button class="btn wide" data-q="next">${T("next")}</button>` : ""}`;
  if (q.audio && G.picked == null && !G.played) { G.played = true; playWord(...q.audio); }
}
setInterval(() => { const t = $("#gT"); if (t && G && G.timed) { const left = Math.max(0, G.timed - Math.floor((Date.now() - G.t0) / 1000)); t.textContent = T("timeLeft", nf(left)); if (!left) endQuiz(); } }, 500);
function answer(k){
  if (G.picked != null) return; G.picked = k; const ok = k === G.qs[G.i].ans;
  if (ok) { G.ok++; addXP(G.players ? 0 : 5); if (G.players) G.scores[G.turn]++; } else if (navigator.vibrate) navigator.vibrate(80);
  if (G.timed) { G.i++; G.picked = null; G.played = false; return drawQ(); }
  drawQ();
}
function nextQ(){
  G.i++; G.picked = null; G.played = false;
  if (G.players && G.i < G.qs.length) { G.turn = G.i % G.players; $("#learn").innerHTML = `<div class="lc done-box"><h2>${T("passTo", nf(G.turn + 1))}</h2><button class="btn" data-q="go">${T("ready")}</button></div>`; return; }
  drawQ();
}
function endQuiz(){
  const n = G.timed ? G.i : G.qs.length, el = $("#learn"); let extra = "";
  addXP(10); if (!G.timed && !G.players && G.ok === n && n >= 5) badge("perfect");
  if (G.unit != null && G.ok / n >= 0.8) { LS.unit[G.unit] = 1; addXP(50); if (G.unit === 0 || Object.keys(LS.unit).length === 1) badge("unit1"); extra = `<p><b>${T("unitDone")}</b></p>`; }
  if (G.week) { const wk = weekNo(); LS.week[wk] = Math.max(LS.week[wk] || 0, G.ok); badge("week"); extra = `<p>${T("bestWeek", nf(LS.week[wk]))}</p><button class="btn ghost" data-q="shareW">${T("shareScore")}</button>`; }
  if (G.players) { const best = G.scores.indexOf(Math.max(...G.scores)); extra = `<p>${G.scores.map((s, i) => `${T("player", nf(i + 1))}: <b>${nf(s)}</b>`).join(" · ")}</p><h2>${T("winner", nf(best + 1))}</h2>`; }
  saveL();
  el.innerHTML = `<div class="lc done-box"><div class="big">${nf(G.ok)}${G.timed ? "" : "/" + nf(n)}</div><h2>${T("score", nf(G.ok), nf(n))}</h2><p>${T("earned", nf(G.ok * 5 + 10))}</p>${extra}
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn" data-q="again">${T("again2")}</button><button class="btn ghost" data-act="home">${T("back")}</button></div></div>`;
  G.done = true;
}
async function shareWeek(){
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1080; const g = c.getContext("2d"), s = LS.week[weekNo()] || 0;
  const bg = g.createRadialGradient(540, 460, 60, 540, 540, 760); bg.addColorStop(0, "#1F3B40"); bg.addColorStop(1, "#0D1A1F"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1080);
  g.strokeStyle = "#D4AF5A"; g.lineWidth = 3; g.strokeRect(48, 48, 984, 984); g.textAlign = "center";
  g.fillStyle = "#D4AF5A"; g.font = '600 46px "Crimson Pro", serif'; g.fillText("Quran Arabic Weekly Challenge", 540, 250);
  g.fillStyle = "#F3EDE0"; g.font = '700 220px "Crimson Pro", serif'; g.fillText(`${s}/10`, 540, 560);
  g.fillStyle = "#C9D6D2"; g.font = '40px "Crimson Pro", serif'; g.fillText(`Week ${String(weekNo()).slice(4)} · Can you beat me?`, 540, 680);
  g.fillStyle = "#D4AF5A"; g.font = '34px "Crimson Pro", serif'; g.fillText("qurantosoul.com", 540, 900);
  const blob = await new Promise(r => c.toBlob(r, "image/png")), f = new File([blob], "weekly-challenge.png", { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], text: "https://qurantosoul.com/" }); return; } catch(e) {} }
  const u = URL.createObjectURL(blob), l = document.createElement("a"); l.href = u; l.download = f.name; l.click();
}
/* ---- games ---- */
const GAMES = {
  quiz(){ const src = pool(), r = shuf(src).slice(0, 10); runQuiz(r.map((w, i) => mcq(w, ["w2m", "m2w", "listen"][i % 3], src)), { kind:"quiz" }); },
  speed(){ const src = pool(); runQuiz(shuf(src).slice(0, 15).map(w => mcq(w, "w2m", src)), { timed: 60, more: () => shuf(src).slice(0, 10).map(w => mcq(w, "w2m", src)), kind:"speed" }); },
  week(){ const r = rng(weekNo()), src = LV.V.words.slice(0, 300); runQuiz(shuf(src, r).slice(0, 10).map(w => mcq(w, "w2m", src, r)), { week: true, kind:"week" }); },
  pass(){ $("#learn").innerHTML = `<div class="lc done-box"><h2>${T("passT")}</h2><div class="opts">${[2, 3, 4].map(n => `<button data-q="pass${n}">${T("playN", nf(n))}</button>`).join("")}</div><button class="btn ghost" data-act="home">${T("back")}</button></div>`; },
  async listen(){ const qs = []; for (let k = 0; k < 6; k++) qs.push(await listenQ()); runQuiz(qs, { kind:"listen" }); },
  builder(){ ayahBuilder(); },
  roothunt(){ rootHunt(); }
};
async function shortAyah(min, max){
  const s = (CUR && Math.random() < .4) ? CUR.n : 78 + Math.floor(Math.random() * 37), d = await DATA.surah(s);
  const ok = d.ayahs.map((A, i) => [A, i + 1]).filter(([A]) => A.w.length >= min && A.w.length <= max);
  const [A, a] = ok.length ? ok[Math.floor(Math.random() * ok.length)] : [d.ayahs[0], 1]; return { s, a, A };
}
async function listenQ(){
  const { s, a, A } = await shortAyah(3, 9), i = Math.floor(Math.random() * A.w.length);
  return { prompt:`<button class="btn" data-q="hear">${T("hear")}</button><div class="qh">${T("tapHeard")}</div><div class="qref">${esc(surahName(s))} ${nf(s)}:${nf(a)}</div>`,
    opts: A.w.map(w => `<span class="oar">${esc(w[0])}</span>`), ans: i, audio:[s, a, i + 1] };
}
async function ayahBuilder(){
  const { s, a, A } = await shortAyah(3, 7), order = shuf(A.w.map((w, i) => i));
  G = { builder: { s, a, A, order, next: 0, miss: 0 } }; drawBuilder();
}
function drawBuilder(){
  const B = G.builder, done = B.next >= B.A.w.length;
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="prog"><i style="width:${Math.round(B.next / B.A.w.length * 100)}%"></i></div><small>${esc(surahName(B.s))} ${nf(B.s)}:${nf(B.a)}</small></div>
    <div class="card q"><div class="built" dir="rtl">${B.A.w.slice(0, B.next).map(w => `<span>${esc(w[0])}</span>`).join(" ") || "&nbsp;"}</div><div class="qh">${done ? esc(trOf(B.A)) : T("tapOrder")}</div></div>
    ${done ? `<div class="fb ok">${T("correct")} ${T("earned", nf(10))}</div><button class="btn wide" data-q="builder">${T("again2")}</button>` :
    `<div class="tiles" dir="rtl">${B.order.filter(i => i >= B.next).map(i => `<button class="tile ar" data-bw="${i}">${esc(B.A.w[i][0])}<small>${esc(B.A.w[i][1])}</small></button>`).join("")}</div>`}`;
  if (done && !B.paid) { B.paid = 1; addXP(10); }
}
function rootHunt(){
  const byRoot = {}; LV.V.words.forEach(w => { if (w[2]) (byRoot[w[2]] = byRoot[w[2]] || []).push(w); });
  const roots = Object.keys(byRoot).filter(r => byRoot[r].length >= 3), r = roots[Math.floor(Math.random() * roots.length)];
  const right = shuf(byRoot[r]).slice(0, 4), wrong = shuf(LV.V.words.filter(w => w[2] && w[2] !== r)).slice(0, 8 - right.length);
  G = { hunt: { r, tiles: shuf([...right, ...wrong]), right: new Set(right.map(w => w[0])), sel: new Set(), checked: false } }; drawHunt();
}
function drawHunt(){
  const H = G.hunt;
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="prog"><i style="width:0"></i></div></div>
    <div class="card q"><div class="rt">${esc(H.r)}</div><div class="qh">${T("pickRoot", esc(H.r))}</div></div>
    <div class="tiles">${H.tiles.map(w => { const c = H.checked ? (H.right.has(w[0]) ? (H.sel.has(w[0]) ? " ok" : " miss") : (H.sel.has(w[0]) ? " no" : "")) : (H.sel.has(w[0]) ? " sel" : "");
      return `<button class="tile ar${c}" data-hw="${w[0]}">${esc(w[1])}${H.checked ? `<small>${esc(shortM(w[5]))}</small>` : ""}</button>`; }).join("")}</div>
    ${H.checked ? `<button class="btn wide" data-q="roothunt">${T("again2")}</button>` : `<button class="btn wide" data-q="hcheck">${T("check")}</button>`}`;
}
/* ---- Quest path ---- */
function units(){ const d = decks(), u = [{ name: T("salahUnit"), salah: true }]; for (let i = 0; i < Math.min(d.length, 35); i++) u.push({ name: T("unit", nf(i + 1)), deck: i }); return u; }
let SALAH = null;
async function salahRanks(){
  if (SALAH) return SALAH; const set = new Set();
  for (const s of [1, 103, 108, 110, 112, 113, 114]) { const d = await DATA.surah(s); d.ayahs.forEach(A => A.w.forEach(w => { if (w[5] >= 0) { const r = rankOf(w[5]); if (r) set.add(r); } })); }
  return SALAH = [...set].sort((a, b) => a - b);
}
function unitWords(u){ return u.salah ? (SALAH || []) : LV.V.words.slice(...decks()[u.deck]).map(w => w[0]); }
function questHTML(){
  const U2 = units(); let open = true;
  return `<div class="lh"><h3>${T("questH")}</h3><small>${T("level", nf(Math.floor(LS.xp / 100) + 1))} · ${T("xp", nf(LS.xp))}</small></div>
    <div class="path">${U2.slice(0, 12).map((u, i) => { const done = !!LS.unit[i], st = done ? "done" : open ? "cur" : "lock"; if (!done) open = false;
      return `<button class="node ${st}" data-unit="${i}"${st === "lock" ? " disabled" : ""}><b>${esc(u.name)}</b><small>${done ? T("passed") : st === "lock" ? T("locked") : ""}</small></button>`; }).join("")}</div>`;
}
async function openUnit(i){
  const u = units()[i]; if (u.salah) await salahRanks();
  const ws = unitWords(u), known = ws.filter(r => isKnown(r)).length;
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="prog"><i style="width:${Math.round(known / Math.max(1, ws.length) * 100)}%"></i></div><small>${nf(known)}/${nf(ws.length)}</small></div>
    <div class="lc"><h2 style="margin:0 0 8px">${esc(u.name)}</h2><div class="unitw">${ws.slice(0, 40).map(r => `<span class="${isKnown(r) ? "k" : ""}">${esc(WR(r)[1])}</span>`).join("")}</div>
    <div style="display:grid;gap:8px;margin-top:14px"><button class="btn wide" data-uact="learn" data-u="${i}">${T("learnW")}</button><button class="btn ghost wide" data-uact="gate" data-u="${i}">${LS.unit[i] ? T("passed") : T("gate")}</button></div></div>`;
}
/* ---- word of the day, Salah mode, games grid (shown on the Learn home) ---- */
function wotdHTML(){
  const r = rng(today() * 7919)(), w = LV.V.words[Math.floor(r * 1000)];
  return `<div class="lc wotd"><small>${T("wotd")}</small><div class="qa" style="font-size:44px">${esc(w[1])}</div><div class="mean">${esc(w[5])}</div><div class="cnt">${T("inQ", nf(w[4]))} · ${esc(w[2])}</div>
    <div class="wd-actions"><button data-hear="${w[7]}:${w[8]}:${w[9]}">${T("hearIt")}</button>${LS.c[w[0]] ? "" : `<button data-q="addw" data-r="${w[0]}">${T("addCards")}</button>`}</div></div>`;
}
function gamesGridHTML(){   /* study tools on the Learn tab */
  const g = (id, t, s) => `<button class="game" data-q="${id}"><b>${T(t)}</b><small>${T(s)}</small></button>`;
  return `<div class="games">${g("salah", "salahMode", "salahS")}${g("course", "courseT", "courseS")}${g("irab", "irabT", "irabS")}${g("roots", "rootsT", "rootsS")}</div>`;
}
/* ---- Games tab ---- */
const GAME_LIST = [["match","matchT","matchS"],["quiz","quizT","quizS"],["listen","listenT","listenS"],["builder","builderT","builderS"],["roothunt","rootHT","rootHS"],
  ["speed","speedT","speedS"],["fix","fixT","fixS"],["pass","passT","passS"],["week","weekT","weekS"]];
VIEWS.games = { el:"#learn", title:() => [T("gamesT"), T("gamesSub")], render: gamesHome };
function goHome(){ if (LV.view === "games") gamesHome(); else learnHome(); }
async function gamesHome(){
  if (!LV.V) { try { LV.V = await DATA.vocab(); } catch(e) { return; } }
  const bm = LS.best.match, wk = LS.week[weekNo()];
  $("#learn").innerHTML = `<div class="lc xpbar"><b>${T("level", nf(Math.floor(LS.xp / 100) + 1))}</b><span class="pb2"><i style="width:${LS.xp % 100}%"></i></span><small>${T("xp", nf(LS.xp))}</small></div>
    <div class="games">${GAME_LIST.map(([id, t, s]) => `<div class="game"><button class="gplay" data-q="${id}"><b>${T(t)}</b><small>${T(s)}</small>
      ${id === "match" && bm ? `<small class="gbest">${T("best", fmtT(bm))}</small>` : ""}${id === "week" && wk != null ? `<small class="gbest">${T("bestWeek", nf(wk))}</small>` : ""}</button>
      <button class="ghow" data-intro="${id}">? ${T("howPlay")}</button></div>`).join("")}</div>
    <div class="lh"><h3>${T("badgesH")}</h3></div><div class="badges">${BADGES.map(b => `<span class="${LS.badges[b[0]] ? "on" : ""}">🏅 ${esc(settings.lang === "en" ? b[1] : b[2])}</span>`).join("")}</div>`;
}
GAMES.match = () => startMatch();
/* ---- Root explorer ---- */
let RQ = "";
function openRoots(){
  const list = META.roots.map((R, i) => [R, i]).filter(([R]) => !RQ || bareAr(R[0]).includes(bareAr(RQ).replace(/\s/g, ""))).sort((a, b) => b[0][1] - a[0][1]).slice(0, 200);
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><input id="rootQ" class="search" placeholder="${T("search")} — ق و ل" value="${esc(RQ)}"></div>
    <ul class="lemlist">${list.map(([R, i]) => `<li><button data-root="${i}"><span class="la">${esc(spaced(R[0]))}</span><span class="lg">${esc(R[2].slice(0, 3).map(li => META.lemmas[li][4]).filter(Boolean).join(" · "))}</span><span class="lc">${T("times", nf(R[1]))}</span></button></li>`).join("")}</ul>`;
  $("#rootQ").oninput = e => { RQ = e.target.value; const p = e.target.selectionStart; openRoots(); const q = $("#rootQ"); q.focus(); q.setSelectionRange(p, p); };
}
async function openRoot(i){
  if (LV.view !== "learn") showView("learn");
  const R = META.roots[i];
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-q="roots" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg></button><span></span></div>
    <div class="root"><span class="letters">${esc(spaced(R[0]))}</span><span class="cnt">${T("rootCnt", R[2].length, R[1])}</span></div>
    <ul class="lemlist">${R[2].map(li => { const X = META.lemmas[li]; return `<li><button data-lemo="${li}"><span class="la">${esc(X[0])}</span><span class="lg">${esc(X[4])}</span><span class="lc">${T("times", X[3])}</span></button></li>`; }).join("")}</ul><div id="lemOcc"></div>`;
}
async function lemmaOcc(li){
  const box = $("#lemOcc"), occ = (await DATA.occ())[li] || [];
  const items = await Promise.all(occ.slice(0, 30).map(async loc => { const [s, a, w] = loc.split(":").map(Number), d = await DATA.surah(s), A = d.ayahs[a - 1];
    return `<li><button data-go3="${loc}"><div class="oa">${A.w.map((x, k) => k === w - 1 ? `<mark>${esc(x[0])}</mark>` : esc(x[0])).join(" ")}</div><div class="or">${esc(surahName(s))} ${nf(s)}:${nf(a)}</div></button></li>`; }));
  box.innerHTML = `<h3>${T("occH")} · «${esc(META.lemmas[li][0])}» (${nf(occ.length)})</h3><ul class="occ">${items.join("")}</ul>`;
  box.scrollIntoView({ block: "start", behavior: "smooth" });
}
/* ---- click routing for everything above ---- */
$("#learn").addEventListener("click", async e => {
  const o = e.target.closest("[data-opt]"); if (o && G && G.qs) return answer(+o.dataset.opt);
  const bw = e.target.closest("[data-bw]"); if (bw && G && G.builder) { const B = G.builder; if (+bw.dataset.bw === B.next) { B.next++; drawBuilder(); } else { B.miss++; bw.classList.add("bad"); if (navigator.vibrate) navigator.vibrate(60); setTimeout(() => bw.classList.remove("bad"), 300); } return; }
  const hw = e.target.closest("[data-hw]"); if (hw && G && G.hunt && !G.hunt.checked) { const r = +hw.dataset.hw; if (G.hunt.sel.has(r)) G.hunt.sel.delete(r); else G.hunt.sel.add(r); drawHunt(); return; }
  const un = e.target.closest("[data-unit]"); if (un) return openUnit(+un.dataset.unit);
  const ua = e.target.closest("[data-uact]"); if (ua) { const i = +ua.dataset.u, u = units()[i]; if (u.salah) await salahRanks(); const ws = unitWords(u);
    if (ua.dataset.uact === "learn") return startCards(ws.filter(r => !LS.c[r] || LS.c[r][1] <= today()).length ? ws.filter(r => !LS.c[r] || LS.c[r][1] <= today()) : ws.slice(0, 10));
    const src = ws.map(WR); return runQuiz(shuf(src).slice(0, 10).map(w => mcq(w, Math.random() < .5 ? "w2m" : "m2w", src.length >= 4 ? src : LV.V.words.slice(0, 60))), { unit: i }); }
  const rt = e.target.closest("[data-root]"); if (rt) return openRoot(+rt.dataset.root);
  const lo = e.target.closest("[data-lemo]"); if (lo) return lemmaOcc(+lo.dataset.lemo);
  const g3 = e.target.closest("[data-go3]"); if (g3) { const [s, a, w] = g3.dataset.go3.split(":").map(Number); return openSurah(s, a, w); }
  const q = e.target.closest("[data-q]"); if (!q) return;
  const k = q.dataset.q;
  if (GAMES[k]) { G = null; LS.intro = LS.intro || {}; if (!LS.intro[k] && GAME_HELP[k]) return gameIntro(k); return GAMES[k](); }
  if (k === "hear" && G && G.qs) { const a = G.qs[G.i].audio; if (a) playWord(...a); }
  else if (k === "next") nextQ();
  else if (k === "go") drawQ();
  else if (k === "again" && G) { const kind = G.kind, unit = G.unit; G = null; if (unit != null) openUnit(unit); else if (GAMES[kind]) GAMES[kind](); else goHome(); }
  else if (k === "shareW") shareWeek();
  else if (/^pass\d$/.test(k)) { const n = +k.slice(4), src = pool(); runQuiz(shuf(src).slice(0, n * 5).map(w => mcq(w, "w2m", src)), { players: n, turn: 0, scores: Array(n).fill(0), kind:"pass" }); }
  else if (k === "hcheck") { const H = G.hunt; H.checked = true; let ok = 0; H.tiles.forEach(w => { if (H.right.has(w[0]) === H.sel.has(w[0])) ok++; }); addXP(ok === H.tiles.length ? 15 : 5); drawHunt(); }
  else if (k === "salah") { await salahRanks(); startCards(SALAH.filter(r => !LS.c[r] || LS.c[r][1] <= today()).length ? SALAH.filter(r => !LS.c[r] || LS.c[r][1] <= today()) : SALAH.slice(0, 10)); }
  else if (k === "addw") { const r = +q.dataset.r; LS.c[r] = [0, today(), 0]; saveL(); q.remove(); toast(esc(T("saved"))); }
  else if (k === "roots") openRoots();
  else if (k === "course") openCourse();
  else if (k === "irab") openIrabHome();
});
