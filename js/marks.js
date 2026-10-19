"use strict";
/* ---------- Bookmarks that land exactly on the ayah, managing bookmarks, and tafsir listening counted as reading ---------- */
Object.assign(L.ur, { bmDel:"بُک مارک ہٹائیں", bmDeleted:"بُک مارک ہٹا دیا گیا", bmUndo:"واپس لائیں", bmAll:"تمام بُک مارکس", bmClear:"سب ہٹائیں", bmClearQ:"تمام بُک مارکس ہٹا دیں؟", bmManage:"بُک مارکس سنبھالیں ›", bmHow:"آیت نمبر دبائیں ← بُک مارک۔ ہٹانے کے لیے ✕ دبائیں۔", tafRead:"تفسیر سنی — یہ آیات آج کی پڑھائی میں شامل" });
Object.assign(L.en, { bmDel:"Remove bookmark", bmDeleted:"Bookmark removed", bmUndo:"Undo", bmAll:"All bookmarks", bmClear:"Remove all", bmClearQ:"Remove all bookmarks?", bmManage:"Manage bookmarks ›", bmHow:"Tap an ayah number → Bookmark. Tap ✕ to remove.", tafRead:"Tafsir listened — these ayahs count as read today" });
/* ---- 1. go exactly to the ayah: the first word is put just under the top bar, and kept there while the page settles ---- */
function ayahTarget(s, a, w){
  const el = typeof ayEl === "function" ? ayEl(s, a) : document.getElementById("a" + a); if (!el) return null;
  return (w != null && el.querySelector(`.w[data-i="${w - 1}"]`)) || el.querySelector(".w") || el;   // the printed table's ayah has no box of its own
}
function landOn(s, a, w){
  const t = ayahTarget(s, a, w); if (!t) return false;
  const bar = document.querySelector(".bar"), top = document.body.classList.contains("bars-off") || !bar ? 10 : bar.getBoundingClientRect().bottom + 10;
  const r = t.getBoundingClientRect(); if (!r.height && !r.width) return false;
  scrollTo({ top: Math.max(0, scrollY + r.top - top), behavior: "auto" });
  return true;
}
function flashAyah(s, a){ const el = typeof ayEl === "function" ? ayEl(s, a) : null; if (!el) return;
  el.classList.add("goto"); setTimeout(() => el.classList.remove("goto"), 2200); }
const _openSurahK = openSurah;
openSurah = async function(n, a = 1, w = null){
  const r = await _openSurahK(n, a, w);
  if (a > 1 || w != null) {
    const mark = P.userScroll;
    const fix = () => { if (P.userScroll === mark && LV.view === "read") landOn(n, a, w); };
    requestAnimationFrame(fix); setTimeout(fix, 350); setTimeout(fix, 1200);   // again after fonts, tajweed and the surah above have loaded
    setTimeout(() => flashAyah(n, a), 100);
  }
  return r;
};
/* ---- 2. managing bookmarks: ✕ on the Dashboard card and in My Quran, undo, remove all ---- */
let bmLast = null;
function removeBm(k){
  if (!U.bm[k]) return; bmLast = [k, U.bm[k]]; delete U.bm[k]; saveU();
  const [s, a] = k.split(":").map(Number); if (typeof refreshAyah === "function") refreshAyah(s, a);
  toast(`${esc(T("bmDeleted"))} · <button class="linkbtn" data-bmundo="1" style="color:inherit">${esc(T("bmUndo"))}</button>`, 4500);
  if (LV.view === "home") renderHome(); else if (LV.view === "me") renderMe();
}
document.addEventListener("click", e => {
  const d = e.target.closest("[data-bmdel]"); if (d) { e.stopPropagation(); e.preventDefault(); removeBm(d.dataset.bmdel); return; }
  if (e.target.closest("[data-bmundo]")) { if (bmLast) { U.bm[bmLast[0]] = bmLast[1]; saveU(); bmLast = null; if (LV.view === "home") renderHome(); else if (LV.view === "me") renderMe(); } return; }
  if (e.target.closest("[data-bmclear]")) { if (confirm(T("bmClearQ"))) { U.bm = {}; saveU(); renderMe(); } return; }
  if (e.target.closest("[data-bmmanage]")) { showView("me"); setTimeout(() => { const x = document.getElementById("me-bm"); if (x) x.scrollIntoView({ block: "start" }); }, 80); }
}, true);
const _renderHomeK = renderHome;
renderHome = async function(){ const r = await _renderHomeK(); const c = $("#home .bm-card");
  if (c && !c.querySelector("[data-bmmanage]") && Object.keys(U.bm || {}).length) c.insertAdjacentHTML("beforeend", `<button class="linkbtn bm-manage" data-bmmanage="1">${T("bmManage")}</button>`); return r; };
VIEWS.home.render = renderHome;
const _renderMeK = renderMe;
renderMe = function(){
  _renderMeK();
  const h = [...document.querySelectorAll("#me .lh h3")].find(x => x.textContent === T("bmH")); if (!h) return;
  const lh = h.closest(".lh"), list = lh.nextElementSibling, bms = Object.keys(U.bm).sort((x, y) => U.bm[y] - U.bm[x]);
  lh.id = "me-bm"; if (bms.length) lh.insertAdjacentHTML("beforeend", `<button class="btn ghost" data-bmclear="1">${T("bmClear")}</button>`);
  const ref = k => { const [s, a] = k.split(":").map(Number); return `${esc(surahName(s))} ${nf(s)}:${nf(a)}`; };
  const html = bms.length ? `<ul class="bm-list me-bm">${bms.map(k => `<li><button data-go2="${k}"><span class="bm-i">★</span><span><b>${ref(k)}</b><small>${esc(when(U.bm[k]))}</small></span><span class="bm-del" data-bmdel="${k}" role="button" tabindex="0" aria-label="${esc(T("bmDel"))}">✕</span></button></li>`).join("")}</ul>`
    : `<p class="muted">${T("bmHow")}</p>`;
  if (list) list.outerHTML = html;
};
VIEWS.me.render = renderMe;
/* ---- 3. listening to tafsir counts as reading: every ayah the tafsir explains goes into today's reading (and its quiz) ---- */
let tafPrev = null;
function markRead(s, a){
  const k = s + ":" + a, d = dayKey(); U.rd = U.rd || {}; const Ld = U.rd[d] = U.rd[d] || [];
  if (!Ld.includes(k)) Ld.push(k);
  if (!U.read[k]) { U.read[k] = 1; U.days[d] = (U.days[d] || 0) + 1; }
}
const _tafFollowK = tafFollow;
tafFollow = function(s, a){
  const au = document.getElementById("vpAudio");
  if (au && !au.paused) {
    if (tafPrev && tafPrev[0] === s && a > tafPrev[1] && a - tafPrev[1] <= 60) for (let x = tafPrev[1]; x <= a; x++) markRead(s, x);   // everything the tafsir has gone through
    else markRead(s, a);
    tafPrev = [s, a]; saveU();
    if (typeof touchActive === "function") touchActive();
  }
  return _tafFollowK(s, a);
};
