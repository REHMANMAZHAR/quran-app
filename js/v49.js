"use strict";
/* ---------- v49: speed (draw only what is on screen), exact resume, smooth pinch, Madina mushaf pages, dashboard cards, offline pack ---------- */

/* ===== 1. Reader in chunks: each ruku (or ~10 ayahs) is one block the browser skips drawing while it is off screen ===== */
const CK = { pxw: 26 };   // estimated height (px) per word until real chunks have been measured
function chunkBlock(blk, s){
  const box = blk.querySelector(".ayahs"); if (!box) return;
  const kids = [...box.children]; let ck = null, n = 0, words = 0;
  const close = () => { if (ck) { ck.style.containIntrinsicSize = `auto ${Math.max(200, Math.round(words * CK.pxw))}px`; ck.dataset.w = words; } ck = null; n = 0; words = 0; };
  for (const el of kids) {
    if (!ck) { ck = document.createElement("div"); ck.className = "ck"; box.insertBefore(ck, el); }
    ck.appendChild(el);
    if (el.classList.contains("ayah")) {
      n++; words += el.querySelectorAll(".w").length;
      const a = +el.dataset.a, m = typeof MK !== "undefined" && MK && MK[s] && MK[s][a];
      if ((m && m.r) || n >= (MK ? 16 : 10)) close();
    }
  }
  close();
}
const _buildBlock49 = buildBlock;
buildBlock = function(d){ const blk = _buildBlock49(d); try { chunkBlock(blk, d.n); } catch(e) {} return blk; };
/* learn the real height per word from chunks that have been drawn, so estimates for the rest get better */
function ckLearn(){
  let h = 0, w = 0;
  document.querySelectorAll("#main .ck").forEach(c => { const r = c.getBoundingClientRect(); if (r.bottom > -innerHeight && r.top < innerHeight * 2 && +c.dataset.w) { h += r.height; w += +c.dataset.w; } });
  if (w > 40) CK.pxw = Math.max(8, Math.min(80, h / w));
}
/* Safari has no built-in scroll anchoring: when a chunk above the screen gets its real height, move by the same amount */
const CKH = new WeakMap();
let ckRO = null;
function ckObserve(){
  if (!("ResizeObserver" in window)) return;
  if (!ckRO) ckRO = new ResizeObserver(ents => {
    if (LV.view !== "read" || ANC.hold > Date.now() || (typeof PZ !== "undefined" && PZ.on)) { ents.forEach(e => CKH.set(e.target, e.target.getBoundingClientRect().height)); return; }
    const line = ancLine(); let dy = 0;
    ents.forEach(e => { const el = e.target, nh = el.getBoundingClientRect().height, old = CKH.get(el); CKH.set(el, nh);
      if (old != null && Math.abs(nh - old) > .5 && el.getBoundingClientRect().bottom <= line) dy += nh - old; });
    if (Math.abs(dy) > .5) scrollBy(0, dy);
  });
  document.querySelectorAll("#main .ck:not([data-ro])").forEach(c => { c.dataset.ro = 1; CKH.set(c, c.getBoundingClientRect().height); ckRO.observe(c); });
}
new MutationObserver(() => { ckObserve(); }).observe($("#main"), { childList: true });
let ckT = 0; addEventListener("scroll", () => { clearTimeout(ckT); ckT = setTimeout(ckLearn, 400); }, { passive: true });

/* the ayah at the top of the screen, found without measuring every ayah (fast while scrolling; works in the table layout too) */
topAyah = function(){
  const y = ancLine() + 8;
  for (const x of [innerWidth / 2, innerWidth * .8, innerWidth * .2]) { const e = document.elementFromPoint(x, y); const a = e && e.closest("#main .ayah"); if (a) return a; const w = e && e.closest("#main .w"); if (w) return w.closest(".ayah"); }
  return null;
};

/* ===== 2. Exact resume: the word at the top of the screen, in every case (switching tabs, restarting the app) ===== */
const RP = Object.assign({ s: 0, a: 0, i: 0, off: 0 }, store.get("lastw", {}));
let rpT = 0;
function rpTake(){
  if (LV.view !== "read" || !ANC.el || !ANC.el.isConnected) return;
  const ay = ANC.el.closest(".ayah"); if (!ay) return; const blk = ay.closest(".sblk");
  RP.s = blk ? +blk.dataset.s : CUR && CUR.n; RP.a = +ay.dataset.a; RP.i = ANC.el.classList.contains("w") ? +ANC.el.dataset.i : -1; RP.off = Math.round(ANC.off);
  clearTimeout(rpT); rpT = setTimeout(() => { store.set("lastw", RP); store.set("last", { s: RP.s, a: RP.a }); }, 500);
}
addEventListener("scroll", () => { if (LV.view === "read") requestAnimationFrame(rpTake); }, { passive: true });
function rpEl(){ const ay = RP.s && ayEl(RP.s, RP.a); if (!ay) return null; return (RP.i >= 0 && ay.querySelector(`.w[data-i="${RP.i}"]`)) || ay.querySelector(".w") || ay; }
function rpRestore(){
  const el = rpEl(); if (!el) return false;
  ANC.hold = Date.now() + 500;
  const go = () => { const dy = el.getBoundingClientRect().top - (RP.off || ancLine()); if (Math.abs(dy) > 1) scrollBy(0, dy); };
  go(); requestAnimationFrame(go); setTimeout(go, 120); setTimeout(() => { go(); ANC.hold = 0; }, 350);
  return true;
}
const _showView49 = showView;
showView = function(v){
  const was = LV.view;
  if (was === "read" && v !== "read") { ANC.hold = 0; ancGrab(); rpTake(); store.set("lastw", RP); }
  _showView49(v);
  if (v === "read" && was !== "read" && RP.s) {
    if (!rpRestore() && CUR) { /* that surah is no longer on screen: open it at the saved ayah */ openSurah(RP.s, RP.a).then(rpRestore); }
  }
};
/* the very first open after starting the app uses the saved word too */
const _openSurah49 = openSurah;
openSurah = async function(n, a = 1, w = null){
  const r = await _openSurah49(n, a, w);
  if (w == null && RP.s === n && RP.a === a && RP.i >= 0) rpRestore();
  return r;
};

/* ===== 3. Mushaf pages: the printed Madina page (or the IndoPak 15-line page), line for line, as real text =====
   Library: quran-madina-html by Tarek Eldeeb (Waqf GPL 2.0), fonts by DigitalKhatt (OFL) — self-hosted in vendor/qmh */
Object.assign(L.ur, { mpListen:"یہاں سے سنیں", mpOpen:"لفظ بہ لفظ کھولیں", mpTaf:"تفسیر سنیں", mpSubM:"مدنی مصحف · ۱۵ سطریں", mpSubI:"انڈو پاک مصحف · ۱۵ سطریں", mpLoad:"مصحف کھل رہا ہے…" });
Object.assign(L.en, { mpListen:"Listen from here", mpOpen:"Open word by word", mpTaf:"Listen to tafsir", mpSubM:"Madinah Mushaf · 15 lines", mpSubI:"IndoPak Mushaf · 15 lines", mpLoad:"Opening the mushaf…" });
let MPP = null, MP_LOAD = null, MP_LAYOUT = null;
const mpLayout = () => settings.script === "ip" ? "IndoPak" : "1441H", mpKey = () => settings.script === "ip" ? "ip" : "m";
const mpFont = () => Math.max(12, Math.min(40, Math.floor((Math.min(innerWidth, 760) - 30) / 16.4)));
function mpLib(){
  if (MP_LOAD) return MP_LOAD;
  MP_LAYOUT = mpLayout();
  MP_LOAD = new Promise((res, rej) => {
    const sc = document.createElement("script"); sc.src = "vendor/qmh/dist/quran-madina-html.min.js?v=2.2.2";
    sc.setAttribute("data-cdn", new URL("vendor/qmh/", location.href).href); sc.setAttribute("data-layout", MP_LAYOUT); sc.setAttribute("data-font-size", mpFont());
    sc.onload = () => customElements.whenDefined("quran-madina-html").then(res); sc.onerror = rej; document.head.appendChild(sc);
  });
  return MP_LOAD;
}
const mpPages = () => MPP ? Promise.resolve(MPP) : load("mpages", `data/mushaf-pages.json?v=${DV}`).then(x => MPP = x);
function mpPageOf(s, a){ const L2 = MPP[mpKey()], x = gid(s, a); let lo = 0, hi = L2.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (L2[m] <= x) lo = m; else hi = m - 1; } return lo + 1; }
function mpZoom(){ const q = $("#mushaf quran-madina-html"); if (q) q.style.fontSize = Math.round(mpFont() * (settings.mpz || 1) * 10) / 10 + "px"; }
openPageView = async function(){
  if (!EX) EX = await DATA.extras(); await mpPages();
  const last = store.get("last", { s: CUR ? CUR.n : 1, a: 1 }); PG.n = mpPageOf(last.s, last.a); showView("page");
};
renderPage = async function(){
  const el = $("#mushaf");
  if (MP_LAYOUT && MP_LAYOUT !== mpLayout()) { store.set("last", store.get("last", {})); location.reload(); return; }   // the script (Uthmani / IndoPak) was changed: load the other print
  if (!customElements.get("quran-madina-html")) el.innerHTML = `<div class="loading">${T("mpLoad")}</div>`;
  try { await Promise.all([mpLib(), mpPages()]); } catch(e) { el.innerHTML = `<div class="loading">${T("loadFail")}</div>`; return; }
  const N = MPP[mpKey()].length; PG.n = Math.max(1, Math.min(N, PG.n));
  const [s, a] = idToSA(MPP[mpKey()][PG.n - 1]);
  el.innerHTML = `<div class="mp-head"><span>${esc(surahName(s))}</span><b>${nf(PG.n)}</b><span>${T("paraN", nf(paraOf(s, a)))}</span></div>
    <div class="mp-page" dir="rtl"><quran-madina-html page="${PG.n}"></quran-madina-html></div>
    <div class="nav mp-nav"><button data-mpg="${PG.n + 1}"${PG.n >= N ? " disabled" : ""}>‹ ${T("nextP")}</button><button data-pg="list">${T("toList")}</button><button data-mpg="${PG.n - 1}"${PG.n <= 1 ? " disabled" : ""}>${T("prevP")} ›</button></div>`;
  $("#tAr").textContent = T("pageT", nf(PG.n)); $("#tEn").textContent = T(settings.script === "ip" ? "mpSubI" : "mpSubM");
  mpZoom(); store.set("last", { s, a });
};
VIEWS.page.render = renderPage;
const mpGo = n => { const N = MPP ? MPP[mpKey()].length : 604; if (n < 1 || n > N) return; PG.n = n; renderPage(); scrollTo(0, 0); };
document.addEventListener("click", e => {
  if (LV.view !== "page") return;
  const b = e.target.closest("[data-mpg]"); if (b) { e.stopPropagation(); mpGo(+b.dataset.mpg); return; }
  const part = e.target.closest("#mushaf .quran-madina-html-part");
  const m = part && /quran-madina-html-(\d{3})-(\d{3})/.exec(part.className);
  if (m && e.target.closest(".quran-madina-html-word")) {
    e.stopPropagation(); const s = +m[1], a = +m[2]; if (a < 1) return;
    document.querySelectorAll("#mushaf .mp-sel").forEach(x => x.classList.remove("mp-sel"));
    document.querySelectorAll(`#mushaf .quran-madina-html-${m[1]}-${m[2]}`).forEach(x => x.classList.add("mp-sel"));
    $("#sheetBody").innerHTML = `<div class="am-head"><b>${esc(surahName(s))} ${nf(s)}:${nf(a)}</b></div><div class="am-grid">
      <button data-mpa="play" data-sa="${s}:${a}">▶ ${T("mpListen")}</button><button data-mpa="open" data-sa="${s}:${a}">${T("mpOpen")}</button><button data-mpa="taf" data-sa="${s}:${a}">🎧 ${T("mpTaf")}</button></div>`;
    openSheet();
  }
}, true);
$("#sheetBody").addEventListener("click", e => {
  const b = e.target.closest("[data-mpa]"); if (!b) return; e.stopPropagation();
  const [s, a] = b.dataset.sa.split(":").map(Number); closeAll();
  if (b.dataset.mpa === "open") openSurah(s, a);
  else if (b.dataset.mpa === "play") openSurah(s, a).then(() => playFrom(s, a));
  else if (b.dataset.mpa === "taf" && typeof playTafsir === "function") playTafsir(s, a);
}, true);
/* swipe between pages (right = next page, like turning a printed mushaf); ignores two-finger pinches */
let mpx = null;
document.addEventListener("touchstart", e => { if (LV.view !== "page") return; mpx = e.touches.length === 1 ? e.touches[0].clientX : null; if (e.target.closest("#mushaf")) e.stopPropagation(); }, { capture: true, passive: true });
document.addEventListener("touchend", e => {
  if (LV.view !== "page") return; if (e.target.closest("#mushaf")) e.stopPropagation();
  if (mpx == null || e.touches.length) { mpx = null; return; } const dx = e.changedTouches[0].clientX - mpx; mpx = null;
  if (Math.abs(dx) > 70) mpGo(PG.n + (dx > 0 ? 1 : -1));
}, { capture: true, passive: true });

/* ===== 4. Dashboard: switch the Name-of-the-day and Hadith-of-the-day cards on or off ===== */
Object.assign(L.ur, { dNm:"آج کا نام (اسماء الحسنیٰ)", dHd:"آج کی حدیث" });
Object.assign(L.en, { dNm:"Name of the day", dHd:"Hadith of the day" });
if (settings.dash.nm == null) settings.dash.nm = 1;
if (settings.dash.hd == null) settings.dash.hd = 1;
const _renderHome49 = renderHome;
renderHome = async function(){
  const r = await _renderHome49();
  if (!settings.dash.nm) document.querySelectorAll("#home .nm-day").forEach(x => x.remove());
  if (!settings.dash.hd) document.querySelectorAll("#home .hd-day").forEach(x => x.remove());
  return r;
};
VIEWS.home.render = renderHome;
const _custSheet49 = custSheet;
custSheet = function(){ _custSheet49(); const last = [...document.querySelectorAll("#sheetBody .cu-sw")].pop(); if (!last) return;
  last.insertAdjacentHTML("afterend", [["nm", "dNm"], ["hd", "dHd"]].map(([k, l]) => `<label class="ds-row ds-sw cu-sw"><span><b>${T(l)}</b></span><input type="checkbox" role="switch" data-cdash="${k}"${settings.dash[k] ? " checked" : ""}><i aria-hidden="true"></i></label>`).join("")); };

/* ===== 5. Lighter start: grammar notes load only when word details or the course need them ===== */
DATA.grammar = () => META.grammar ? Promise.resolve() : load("grammar", `data/grammar.json?v=${DV}`).then(g => { META.grammar = g.grammar; META.grammar_en = g.grammar_en; });
const _openWord49 = openWord;
openWord = function(a, i){ if (META.grammar) return _openWord49(a, i); DATA.grammar().then(() => _openWord49(a, i)).catch(() => {}); };
const _openLesson49 = openLesson;
openLesson = async function(i){ await DATA.grammar(); return _openLesson49(i); };
setTimeout(() => { if (typeof META !== "undefined" && META) DATA.grammar().catch(() => {}); }, 6000);

/* ===== 6. Save the whole Quran offline: text, meanings, grammar, tafsir marks, hadith and the mushaf pages — with progress ===== */
Object.assign(L.ur, { offPack:"پورا قرآن آف لائن محفوظ کریں (متن، معانی، مصحف · تقریباً ۱۸ MB)", offProg:(a,b)=>`محفوظ ہو رہا ہے… ${ud(a)} / ${ud(b)}`, offDone:"✓ پورا قرآن آف لائن دستیاب ہے — انٹرنیٹ کے بغیر بھی کھلے گا", offSaved:d=>`✓ آف لائن محفوظ · ${d}`, offPart:n=>`کچھ فائلیں نہیں آئیں (${ud(n)}) — دوبارہ دبائیں` });
Object.assign(L.en, { offPack:"Save the whole Quran offline (text, meanings, mushaf · about 18 MB)", offProg:(a,b)=>`Saving… ${a} / ${b}`, offDone:"✓ The whole Quran is available offline — it opens without internet", offSaved:d=>`✓ Saved offline · ${d}`, offPart:n=>`Some files did not arrive (${n}) — tap again` });
let OFF_BUSY = false;
saveOfflinePack = async function(){
  if (OFF_BUSY) return; OFF_BUSY = true;
  const v = `?v=${DV}`, f = ["meta", "grammar", "occ", "extras", "similar", "search", "words", "marks", "ruku", "pages", "mushaf-pages", "learn/vocab", "learn/senses", "hadith/nawawi40", "hadith/bukhari-tafsir", "tafsir/ur-times", "tafsir/ur-parts"].map(x => `data/${x}.json${v}`);
  f.push(`data/timing/${settings.rec}.json${v}`);
  for (let n = 1; n <= 114; n++) f.push(`data/s/${p3(n)}.json${v}`);
  if (settings.script === "ip") f.push(`data/indopak.json${v}`);
  const stem = settings.script === "ip" ? "IndoPak-15" : "Madina-1441H", font = settings.script === "ip" ? "indopak-qmh.woff2" : "madina-qmh.woff2";
  f.push("vendor/qmh/dist/quran-madina-html.min.js?v=2.2.2", "vendor/qmh/dist/quran-madina-html.css?v=1.1", `vendor/qmh/assets/db/v2/${font}`, `vendor/qmh/assets/db/v2/${stem}/manifest.json`, "vendor/qmh/assets/img/sura_border_sym4.svg", "fonts/KFGQPC-Uthmanic-Script-HAFS.otf");
  for (let j = 1; j <= 30; j++) f.push(`vendor/qmh/assets/db/v2/${stem}/juz-${String(j).padStart(2, "0")}.json`);
  const btn = () => document.querySelector('[data-stx="pack"]');
  let done = 0, fail = 0, i = 0;
  const worker = async () => { while (i < f.length) { const u = f[i++]; try { const r = await fetch(u); if (!r.ok) fail++; } catch(e) { fail++; } done++; const b = btn(); if (b) b.textContent = T("offProg", nf(done), nf(f.length)); } };
  await Promise.all([worker(), worker(), worker(), worker()]);
  OFF_BUSY = false;
  if (!fail) store.set("offlineAt", new Date().toISOString().slice(0, 10));
  const b = btn(); if (b) b.textContent = fail ? T("offPart", nf(fail)) : T("offDone");
  toast(esc(fail ? T("offPart", nf(fail)) : T("offDone")), 4000);
};
/* show whether the pack is already saved */
new MutationObserver(() => { const b = document.querySelector('[data-stx="pack"]:not([data-offc])'); if (!b) return; b.dataset.offc = 1; const d = store.get("offlineAt", null); if (d && !OFF_BUSY) b.insertAdjacentHTML("afterend", `<small class="off-ok">${esc(T("offSaved", d))}</small>`); }).observe($("#setv"), { childList: true, subtree: true });
