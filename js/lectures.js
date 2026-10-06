"use strict";
/* ---------- Lectures: Dr. Israr Ahmad (Bayan-ul-Quran) + Lisaan-ul-Quran, official YouTube embeds ---------- */
/* Bayan-ul-Quran 1998, 108 lectures. Ranges from the official list on drisrar.com: [n, s1,a1, s2,a2] (999 = end of surah, 0 = intro/closing). */
const BQ = [[1,0,0,0,0],[2,0,0,0,0],[3,0,0,0,0],[4,0,0,0,0],[5,1,1,1,999],[6,2,1,2,29],[7,2,30,2,46],[8,2,47,2,74],[9,2,75,2,107],[10,2,108,2,141],
[11,2,142,2,176],[12,2,177,2,196],[13,2,197,2,228],[14,2,229,2,253],[15,2,254,2,273],[16,2,274,2,999],[17,3,1,3,48],[18,3,48,3,101],[19,3,102,3,151],[20,3,152,3,999],
[21,4,1,4,30],[22,4,31,4,65],[23,4,66,4,100],[24,4,101,4,142],[25,4,143,5,4],[26,5,5,5,43],[27,5,43,5,86],[28,5,87,5,999],[29,6,1,6,49],[30,6,50,6,90],
[31,6,91,6,129],[32,6,130,7,19],[33,7,20,7,58],[34,7,59,7,129],[35,7,130,7,166],[36,7,166,7,999],[37,8,1,8,40],[38,8,41,8,999],[39,9,1,9,34],[40,9,35,9,85],
[41,9,86,9,999],[42,10,1,10,60],[43,10,61,11,24],[44,11,25,11,88],[45,11,89,12,35],[46,12,36,12,106],[47,12,107,14,9],[48,14,10,15,15],[49,15,16,15,999],[50,16,1,16,66],
[51,16,66,16,999],[52,17,1,17,35],[53,17,36,17,85],[54,17,86,18,28],[55,18,29,18,82],[56,18,83,19,50],[57,19,51,20,46],[58,20,47,21,10],[59,21,11,21,103],[60,21,104,22,38],
[61,22,39,22,999],[62,23,1,23,114],[63,23,115,24,40],[64,24,41,25,20],[65,25,21,26,9],[66,26,10,27,9],[67,27,10,28,6],[68,28,7,28,75],[69,28,76,29,13],[70,29,14,30,19],
[71,30,20,31,19],[72,31,20,33,8],[73,33,9,33,40],[74,33,41,34,21],[75,34,22,35,43],[76,35,44,37,53],[77,37,44,38,10],[78,38,11,39,4],[79,39,5,39,67],[80,39,68,40,66],
[81,40,67,41,46],[82,41,47,42,39],[83,42,40,43,999],[84,44,1,46,5],[85,46,6,47,14],[86,47,15,48,20],[87,48,21,49,999],[88,50,1,51,50],[89,51,51,53,47],[90,53,47,55,32],
[91,55,33,56,999],[92,57,1,57,20],[93,57,21,58,4],[94,58,5,59,10],[95,59,11,60,999],[96,61,1,62,999],[97,63,1,64,999],[98,65,1,67,4],[99,67,5,70,19],[100,70,20,73,999],
[101,74,1,76,999],[102,77,1,81,22],[103,81,23,86,999],[104,87,1,90,999],[105,91,1,95,999],[106,96,1,109,999],[107,110,1,114,999],[108,0,0,0,0]];
const SERIES = {
  bq: { list:"PLN5NkUdaF03i2YxYkzZxO3HjALil8_0Pi", total:108, credit:"Dr. Israr Ahmad · Bayan-ul-Quran (1998)", src:"https://www.tanzeem.org/bayan-ul-quran-by-dr-israr-ahmad/", srcName:"Tanzeem-e-Islami" },
  lq: { list:"UUZcujrtvcTaAiV9MzKBJJPQ", total:0, credit:"Lisan ul Quran · Ustad Amir Sohail", src:"https://play.google.com/store/apps/details?id=com.lisanulquran.amirsohail", srcName:"Lisan ul Quran app" }
};
Object.assign(L.ur, {
  bqName:"بیان القرآن — ڈاکٹر اسرار احمد", lqName:"لسان القرآن — استاد عامر سہیل", lecH:"لیکچرز", lec:n=>`لیکچر ${ud(n)}`, lesson:n=>`سبق ${ud(n)}`,
  lecAyahs:(a,b)=>`آیات ${ud(a)}–${ud(b)}`, intro:"تعارف", closing:"اختتامی خطاب", tafseerBtn:"تفسیر (ڈاکٹر اسرار)", startAt:t=>`${t} سے جاری رکھیں`,
  cont:"جاری رکھیں", startS:"شروع کریں", openYT:"یوٹیوب پر دیکھیں", prevL:"پچھلا", nextL:"اگلا", via:s=>`آفیشل یوٹیوب ویڈیو · ${s}`,
  lqNote:"آفیشل چینل کی ویڈیوز (نئی پہلے)", getApp:"ان کی آفیشل ایپ", noLec:"اس آیت کا لیکچر نہیں ملا"
});
Object.assign(L.en, {
  bqName:"Bayan-ul-Quran — Dr. Israr Ahmad", lqName:"Lisan ul Quran — Ustad Amir Sohail", lecH:"Lectures", lec:n=>`Lecture ${n}`, lesson:n=>`Lesson ${n}`,
  lecAyahs:(a,b)=>`Ayahs ${a}–${b}`, intro:"Introduction", closing:"Closing speech", tafseerBtn:"Tafseer (Dr. Israr)", startAt:t=>`Continue at ${t}`,
  cont:"Continue", startS:"Start", openYT:"Watch on YouTube", prevL:"Previous", nextL:"Next", via:s=>`Official YouTube video · ${s}`,
  lqNote:"Videos from the official channel (newest first)", getApp:"Their official app", noLec:"No lecture found for this ayah"
});
const VS = Object.assign({ bq:{ n:0, t:{}, off:null }, lq:{ i:0, t:{} } }, store.get("vid", {}));
const saveV = () => store.set("vid", VS);
const mmss = s => { s = Math.floor(s || 0); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const key = (s, a) => s * 1000 + a;
const lecFor = (s, a) => (BQ.find(L => L[1] && key(L[1], L[2]) <= key(s, a) && key(s, a) <= key(L[3], L[4])) || [0])[0];
const lecsInSurah = s => BQ.filter(L => L[1] && key(L[1], L[2]) <= key(s, 999) && key(L[3], L[4]) >= key(s, 1));
function lecLabel(n, s){
  const L = BQ[n - 1];
  if (!L[1]) return n <= 4 ? T("intro") : T("closing");
  if (s) { const cnt = META.surahs[s - 1].ayahs || 999; const a = L[1] === s ? L[2] : 1, b = L[3] === s ? Math.min(L[4], cnt) : cnt; return T("lecAyahs", nf(a), nf(b)); }
  const nm = x => settings.lang === "en" ? META.surahs[x - 1].tr : META.surahs[x - 1].ar;
  const end = (x, a) => a === 999 ? nm(x) : `${nm(x)} ${nf(a)}`;
  return L[1] === L[3] ? `${nm(L[1])} ${L[4] === 999 && L[2] === 1 ? "" : nf(L[2]) + "–" + (L[4] === 999 ? "" : nf(L[4]))}`.trim() : `${end(L[1], L[2]) } – ${end(L[3], L[4])}`;
}
/* surah header: lectures covering this surah */
function lecStrip(s){
  const ls = lecsInSurah(s); if (!ls.length) return "";
  return `<div class="lecstrip"><div class="lh2">${esc(T("bqName"))}</div><div class="chips">${ls.map(L =>
    `<button class="chip" data-lec="${L[0]}"><b>${T("lec", nf(L[0]))}</b><span>${esc(lecLabel(L[0], s))}</span>${VS.bq.t[L[0]] ? `<i>${mmss(VS.bq.t[L[0]])}</i>` : ""}</button>`).join("")}</div></div>`;
}
/* player panel */
let YTP = null, ytReady = null, vCur = null, vTimer = 0;
function loadYT(){
  if (!ytReady) ytReady = new Promise(res => { window.onYouTubeIframeAPIReady = res; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); });
  return ytReady;
}
const bqIndex = n => { const o = VS.bq.off; return !o ? n - 1 : o.rev ? (VS.bq.total || 108) - n + o.k : n - 1 + o.k; };
function openLecture(series, n){
  vCur = { series, n };
  const S = SERIES[series], start = series === "bq" ? (VS.bq.t[n] || 0) : (VS.lq.t[n] || 0);
  const title = series === "bq" ? `${T("lec", nf(n))} · ${esc(lecLabel(n))}` : T("lesson", nf(n + 1));
  $("#vpanel").innerHTML = `<div class="vp-top"><button class="iconbtn" data-v="close" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <div class="vp-t"><b>${esc(T(series === "bq" ? "bqName" : "lqName"))}</b><small id="vpTitle">${title}</small></div></div>
    <div class="vp-frame"><div id="ytp"></div></div>
    <div class="vp-nav"><button class="btn ghost" data-v="prev">${T("prevL")}</button><button class="btn ghost" data-v="next">${T("nextL")}</button></div>
    <p class="vp-credit">${esc(T("via", S.credit))} · <a href="${S.src}" target="_blank" rel="noopener">${esc(series === "lq" ? T("getApp") : S.srcName)}</a> ·
      <a id="vpYT" href="https://www.youtube.com/playlist?list=${S.list}" target="_blank" rel="noopener">${T("openYT")}</a>${series === "lq" ? `<br>${T("lqNote")}` : ""}</p>`;
  $("#vpanel").classList.add("on"); $("#scrim").classList.add("on");
  if (P.s && !P.audio.paused) P.audio.pause();
  const idx = series === "bq" ? bqIndex(n) : n;
  loadYT().then(() => {
    if (YTP) { try { YTP.destroy(); } catch(e){} }
    YTP = new YT.Player("ytp", { host:"https://www.youtube-nocookie.com", width:"100%", height:"100%",
      playerVars:{ listType:"playlist", list:S.list, index:idx, start:Math.floor(start), rel:0, playsinline:1, modestbranding:1 },
      events:{ onStateChange: onYTState } });
  });
  clearInterval(vTimer); vTimer = setInterval(saveVid, 4000);
  if (series === "bq") { VS.bq.n = n; } else VS.lq.i = n;
  saveV();
}
function onYTState(e){
  if (e.data !== 1 || !vCur) return;
  const d = YTP.getVideoData ? YTP.getVideoData() : {}, idx = YTP.getPlaylistIndex();
  const yt = $("#vpYT"); if (yt && d.video_id) yt.href = `https://www.youtube.com/watch?v=${d.video_id}`;
  if (vCur.series === "lq") { if (idx !== vCur.n) { vCur.n = idx; VS.lq.i = idx; $("#vpTitle").textContent = T("lesson", nf(idx + 1)); saveV(); } return; }
  const m = /(\d{1,3})\s*\/\s*108/.exec(d.title || "");
  if (m && !VS.bq.off) {               // learn how the official playlist is ordered, once
    const num = +m[1], fwd = idx - num + 1;
    VS.bq.off = Math.abs(fwd) <= 6 ? { rev:false, k:fwd } : { rev:true, k:idx - (108 - num) }; saveV();
    if (num !== vCur.n) { openLecture("bq", vCur.n); return; }
  }
  if (m && +m[1] !== vCur.n) { vCur.n = +m[1]; VS.bq.n = vCur.n; $("#vpTitle").textContent = `${T("lec", nf(vCur.n))} · ${lecLabel(vCur.n)}`; saveV(); }
}
function saveVid(){
  if (!YTP || !vCur || !YTP.getCurrentTime) return;
  const t = YTP.getCurrentTime(); if (!(t > 5)) return;
  if (vCur.series === "bq") VS.bq.t[vCur.n] = Math.floor(t); else VS.lq.t[vCur.n] = Math.floor(t);
  saveV();
}
function closeVideo(){
  saveVid(); clearInterval(vTimer);
  if (YTP) { try { YTP.pauseVideo(); YTP.destroy(); } catch(e){} YTP = null; }
  $("#vpanel").classList.remove("on"); $("#vpanel").innerHTML = ""; $("#scrim").classList.remove("on"); vCur = null;
  if (LV.view === "learn") learnHome(); else if (CUR) { const st = document.querySelector(".lecstrip"); if (st) st.outerHTML = lecStrip(CUR.n); }
}
$("#vpanel").addEventListener("click", e => {
  const b = e.target.closest("[data-v]"); if (!b || !vCur) return;
  const v = b.dataset.v;
  if (v === "close") return closeVideo();
  saveVid();
  const max = vCur.series === "bq" ? 108 : 999, min = vCur.series === "bq" ? 1 : 0;
  const n = Math.min(max, Math.max(min, vCur.n + (v === "next" ? 1 : -1)));
  if (n !== vCur.n) openLecture(vCur.series, n);
});
$("#scrim").addEventListener("click", () => { if (vCur) closeVideo(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && vCur) closeVideo(); });
$("#main").addEventListener("click", e => { const c = e.target.closest("[data-lec]"); if (c) openLecture("bq", +c.dataset.lec); });
$("#sheetBody").addEventListener("click", e => { const c = e.target.closest("[data-lec]"); if (c) { closeAll(); openLecture("bq", +c.dataset.lec); } });
/* Learn tab card */
function lecturesCard(){
  const bn = VS.bq.n || 5, bt = VS.bq.t[bn] || 0, li = VS.lq.i || 0, lt = VS.lq.t[li] || 0;
  return `<div class="lh"><h3>${T("lecH")}</h3></div><div class="games">
    <button class="game" data-lecs="bq"><b>${esc(T("bqName"))}</b><small>${T("lec", nf(bn))} · ${esc(lecLabel(bn))}</small><small>${bt ? T("startAt", mmss(bt)) : (VS.bq.n ? T("cont") : T("startS"))}</small></button>
    <button class="game" data-lecs="lq"><b>${esc(T("lqName"))}</b><small>${T("lesson", nf(li + 1))}</small><small>${lt ? T("startAt", mmss(lt)) : (VS.lq.i ? T("cont") : T("startS"))}</small></button></div>`;
}
$("#learn").addEventListener("click", e => { const c = e.target.closest("[data-lecs]"); if (c) openLecture(c.dataset.lecs, c.dataset.lecs === "bq" ? (VS.bq.n || 5) : (VS.lq.i || 0)); });

