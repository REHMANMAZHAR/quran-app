"use strict";
/* ---------- Continuous Quran: surahs follow one another as you scroll; the top bar follows the surah and para you are in ---------- */
const BLK = {};
let flowBusy = false;
const blockEl = n => document.querySelector(`#main .sblk[data-s="${n}"]`);
const _renderFlow = render;
/* draw surah d into a detached block, using the full render chain (tajweed, styles, tafsir marks…) */
function buildBlock(d){
  const real = $("#main"), saved = CUR, tmp = document.createElement("div");
  real.id = "main-live"; tmp.id = "main"; tmp.style.display = "none"; document.body.appendChild(tmp);
  CUR = d;
  try { _renderFlow(); } finally { CUR = saved; tmp.remove(); real.id = "main"; }
  const blk = document.createElement("section"); blk.className = "sblk"; blk.dataset.s = d.n;
  while (tmp.firstChild) blk.appendChild(tmp.firstChild);
  blk.querySelectorAll(".ayah[id]").forEach(x => x.removeAttribute("id"));
  const S = META.surahs[d.n - 1];
  if (settings.pstyle !== "table") blk.insertAdjacentHTML("afterbegin", `<header class="sb-title"><b>سُورَةُ ${esc(S.ar)}</b><small>${nf(S.n)} · ${esc(settings.lang === "en" ? S.tr + " · " + S.en : S.ar)} · ${T("ayatN", nf(S.ayahs))}</small></header>`);
  BLK[d.n] = d;
  return blk;
}
/* the surah being read owns the a1…aN ids, so everything else (word sheet, hifz, tafsir) keeps working */
function activate(n){
  const blk = blockEl(n); if (!blk || !BLK[n]) return;
  CUR = BLK[n];
  document.querySelectorAll("#main .ayah[id]").forEach(x => x.removeAttribute("id"));
  blk.querySelectorAll(".ayah").forEach(x => { x.id = "a" + x.dataset.a; });
  if (typeof updPills === "function") updPills();
}
render = function(){
  const m = $("#main"), blk = buildBlock(CUR);
  m.innerHTML = ""; m.appendChild(blk); activate(CUR.n);
};
/* keep the view still while blocks are added or removed above it */
function keepPlace(fn){
  const anchor = blockEl(CUR.n) || $("#main .sblk"), y0 = anchor ? anchor.getBoundingClientRect().top : 0;
  fn();
  if (anchor && anchor.isConnected) { const dy = anchor.getBoundingClientRect().top - y0; if (Math.abs(dy) > 0.5) scrollBy(0, dy); }
}
async function addBlock(n, where){
  if (flowBusy || n < 1 || n > 114 || blockEl(n)) return;
  flowBusy = true;
  try {
    const d = await DATA.surah(n);
    if (settings.tajweed && settings.script !== "ip" && !TJ[n]) { try { TJ[n] = await load("tj" + n, `data/tajweed/${p3(n)}.json?v=${DV}`); } catch(e){} }
    if (blockEl(n) || !CUR) return;
    const blk = buildBlock(d), m = $("#main");
    keepPlace(() => {
      if (where === "start") m.insertBefore(blk, m.firstChild); else m.appendChild(blk);
      const all = [...m.querySelectorAll(".sblk")];
      if (all.length > 4) (where === "start" ? all[all.length - 1] : all[0]).remove();
    });
    if (typeof observeAyahs === "function") observeAyahs();
    if (typeof trackReading === "function") trackReading();
    if (P.s && blockEl(P.s)) markAyah();
  } finally { flowBusy = false; }
}
function flowEnsure(n){ if (!blockEl(n) && blockEl(n - 1)) addBlock(n, "end"); }
function flowCheck(){
  if (LV.view !== "read" || !CUR || !$("#main .sblk")) return;
  const blks = [...document.querySelectorAll("#main .sblk")], line = ($(".bar").getBoundingClientRect().bottom || 60) + 30;
  const here = blks.find(b => { const r = b.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
  if (here && +here.dataset.s !== CUR.n) activate(+here.dataset.s);
  const first = blks[0], last = blks[blks.length - 1];
  if (last.getBoundingClientRect().bottom < innerHeight * 2.5 && +last.dataset.s < 114) addBlock(+last.dataset.s + 1, "end");
  else if (first.getBoundingClientRect().top > -innerHeight && +first.dataset.s > 1 && P.userScroll && Date.now() - P.userScroll < 3000) addBlock(+first.dataset.s - 1, "start");
}
let flowT = 0;
addEventListener("scroll", () => { if (!flowT) flowT = requestAnimationFrame(() => { flowT = 0; flowCheck(); }); }, { passive: true });
/* opening a surah that is already on screen just moves to it */
const _openSurahF = openSurah;
openSurah = async function(n, a = 1, w = null){
  if (blockEl(n) && LV.view === "read") activate(n);
  const r = await _openSurahF(n, a, w);
  setTimeout(flowCheck, 400);
  return r;
};
/* a tap on a word or ayah number in the neighbouring surah makes that surah the current one first */
$("#main").addEventListener("pointerdown", e => { const b = e.target.closest(".sblk"); if (b && CUR && +b.dataset.s !== CUR.n) activate(+b.dataset.s); }, true);
$("#main").addEventListener("click", e => { const b = e.target.closest(".sblk"); if (b && CUR && +b.dataset.s !== CUR.n) activate(+b.dataset.s); }, true);
/* tafsir follows the Quran: the ayah being explained is marked and kept on screen */
function tafFollow(s, a){
  document.querySelectorAll(".ayah.tafnow").forEach(x => x.classList.remove("tafnow"));
  if (LV.view !== "read") return;
  const el = ayEl(s, a);
  if (!el) { if (Date.now() - P.userScroll > 5000) openSurah(s, a).then(() => { const e2 = ayEl(s, a); if (e2) e2.classList.add("tafnow"); }); return; }
  el.classList.add("tafnow");
  if (Date.now() - P.userScroll > 5000) { const r = el.getBoundingClientRect(); if (r.top < 90 || r.top > innerHeight * 0.6) el.scrollIntoView({ block: "start", behavior: "smooth" }); }
}
/* a tafsir started from the Tafsir page opens the Quran at the same place, with the player made small */
const _openLectureF = openLecture;
openLecture = function(series, n, at){
  const from = LV.view, r = _openLectureF(series, n, at);
  if (AUDIO_SER[series] && from !== "read") {
    const R = RANGES[series].find(L => L[0] === n);
    if (R && R[1]) { showView("read"); openSurah(R[1], R[2]); }
    const b = $("#vpanel").querySelector("[data-v=mini]"); if (b) b.click();
  }
  return r;
};
