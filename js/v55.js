"use strict";
/* ---------- v55: auto-scroll that keeps going when you scroll by hand, one fixed surah/para strip (the other icons hide),
   smaller bars in landscape, smooth pinch (the page scales under your fingers, then re-flows; pinch far to switch to mushaf pages and back),
   and a true black dark mode ---------- */

/* ===== 1. Auto-scroll ===== */
/* smooth: keep the exact position ourselves and move in the screen's own pixel steps (1/3 px on most phones), not whole pixels */
AS.y = null; AS.hold = false; AS.quiet = 0;
asTick = function(t){
  if (!AS.on) return;
  const dt = AS.last ? Math.min(0.1, (t - AS.last) / 1000) : 0; AS.last = t;
  if (AS.run && !AS.hold && t >= AS.quiet && LV.view === "read") {
    if (AS.y == null || Math.abs(scrollY - AS.y) > 3) AS.y = scrollY;   // you moved the page: carry on from where you left it
    AS.y += AS_SPEEDS[AS.lv] * dt;
    const q = 1 / (window.devicePixelRatio || 1), ny = Math.round(AS.y / q) * q;
    if (Math.abs(ny - scrollY) >= q / 2) scrollTo(0, ny);
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) { AS.run = false; asBar(); }
  } else AS.y = null;
  AS.raf = requestAnimationFrame(asTick);
};
/* a finger on the page only holds it while you scroll; when you let go (and the page stops gliding) it continues */
const asOwn = e => e.target.closest && e.target.closest("#rdHead,#asBar,.sheet,.bar,.tabbar");
addEventListener("touchstart", e => { if (AS.on && !asOwn(e)) AS.hold = true; }, { passive: true });
const asLetGo = e => { if (!e.touches || !e.touches.length) { AS.hold = false; AS.quiet = performance.now() + 450; } };
addEventListener("touchend", asLetGo, { passive: true });
addEventListener("touchcancel", asLetGo, { passive: true });
/* scrolling that is not ours (finger glide, mouse wheel, keys) waits until the page settles */
addEventListener("scroll", () => { if (AS.on && AS.y != null && Math.abs(scrollY - AS.y) > 3) AS.quiet = performance.now() + 300; }, { passive: true });
/* the header controls: play/pause works on the first tap; bigger − and + stay visible while auto-scroll is on */
rhAS = function(){
  const box = $("#rhAS"); if (!box) return;
  const on = AS.on, run = AS.on && AS.run;
  box.classList.toggle("on", on); box.classList.toggle("run", run);
  const d = box.querySelector(".rh-dot");
  d.innerHTML = run ? `<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" style="fill:currentColor;stroke:none"/></svg>`;
  d.setAttribute("aria-label", T(run ? "asPause" : "asPlay"));
  box.querySelector("[data-ras=slow]").setAttribute("aria-label", T("asSlower"));
  box.querySelector("[data-ras=fast]").setAttribute("aria-label", T("asFaster"));
  box.querySelector(".rh-lv").textContent = on ? nf(AS.lv + 1) : "";
  let x = box.querySelector("[data-ras=stop]");
  if (on && !x) { box.insertAdjacentHTML("beforeend", `<button data-ras="stop" class="rh-x"><svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17"/></svg></button>`); x = box.querySelector("[data-ras=stop]"); }
  if (x) { x.hidden = !on; x.setAttribute("aria-label", T("asStop")); }
};
$("#rdHead").addEventListener("click", e => {
  const b = e.target.closest("[data-ras=stop]"); if (!b) return; e.stopPropagation(); asStop(); rhAS();
}, true);
/* starting or pausing does not jump: always continue from where the page is now */
const _asStart55 = asStart;
asStart = function(){ AS.y = null; AS.hold = false; AS.quiet = 0; _asStart55(); };

/* ===== 2. One fixed strip for surah and para; the other icons hide by themselves ===== */
/* the surah and para buttons in the top bar repeated the strip below it, so in the reader they are gone (tap the strip to change) */
let barT = 0;
function barsLater(){
  clearTimeout(barT);
  barT = setTimeout(() => {
    if (LV.view === "read" && settings.autoHide !== false && !document.querySelector(".sheet.on,#sheet.on,#drawer.on,#picker.on,.pz-tip")) document.body.classList.add("bars-off");
  }, 4000);
}
new MutationObserver(() => { if (LV.view === "read" && !document.body.classList.contains("bars-off")) barsLater(); })
  .observe(document.body, { attributes: true, attributeFilter: ["class"] });
document.addEventListener("click", e => { if (e.target.closest(".bar,.tabbar")) barsLater(); }, true);
const _showView55 = showView;
showView = function(v){ _showView55(v); if (v === "read") barsLater(); };

/* ===== 3. Pinch like a printed page: the text scales smoothly under your fingers, then re-flows when you let go.
   Pinch far in to see whole mushaf pages; pinch out on a mushaf page to go back to reading. ===== */
Object.assign(L.ur, { pzPages:"مصحف کے صفحات", pzRead:"پڑھنے کا انداز" });
Object.assign(L.en, { pzPages:"Mushaf pages", pzRead:"Reading view" });
function pzSwitch(){
  if (!PZ.on) return false;
  if (LV.view === "read") return PZ.f < .6 || (settings.size <= 17 && PZ.f < .82);
  if (LV.view === "page") return PZ.f > 1.4;
  return false;
}
function pzInit55(e){
  PZ.cx = (e.touches[0].clientX + e.touches[1].clientX) / 2; PZ.cy = (e.touches[0].clientY + e.touches[1].clientY) / 2; PZ.org = 0;
  const el = document.elementFromPoint(PZ.cx, PZ.cy); PZ.pel = el;
}
/* window first, so the mushaf page (which keeps its own swipe) still gets the pinch */
addEventListener("touchstart", e => {
  if (e.touches.length !== 2 || document.querySelector(".sheet.on")) return;
  pzInit55(e);
  if (LV.view === "page") {
    PZ.on = true; PZ.d0 = tDist(e.touches); PZ.f = 1; PZ.u0 = 1; PZ.anchor = null;
    if (!$("#pzTip")) document.body.insertAdjacentHTML("beforeend", `<div id="pzTip" class="pz-tip">100%</div>`);
  }
}, { capture: true, passive: true });
addEventListener("touchend", e => { if (LV.view === "page" && PZ.on && e.touches.length < 2) pzEnd(); }, { capture: true, passive: true });
pzApply = function(){
  PZ.raf = 0; cancelPress();
  if (LV.view !== "read" && LV.view !== "page") { const r = document.documentElement.style; r.setProperty("--uiz", Math.min(1.9, Math.max(.8, PZ.u0 * PZ.f))); return; }
  const t = pzTarget(); if (!t) return;
  if (!PZ.org) { const r = t.getBoundingClientRect(); t.style.transformOrigin = `${PZ.cx - r.left}px ${PZ.cy - r.top}px`; t.style.willChange = "transform"; PZ.org = 1; }
  const sw = pzSwitch();
  t.style.transform = `scale(${PZ.f})`; t.classList.toggle("pz-sw", sw);
  const tip = $("#pzTip"); if (tip) { tip.textContent = sw ? T(LV.view === "read" ? "pzPages" : "pzRead") : Math.round(PZ.f * 100) + "%"; tip.classList.toggle("sw", sw); }
};
/* a second finger never starts (or keeps) the press-and-hold on a word; neither does a pinch or leaving the page */
const PTR = new Set();
$("#main").addEventListener("pointerdown", e => { PTR.add(e.pointerId); if (PTR.size > 1 || PZ.on) { cancelPress(); setTimeout(cancelPress, 0); } }, true);   // clear the first finger's timer before the second one replaces it
["pointerup", "pointercancel"].forEach(t => addEventListener(t, e => PTR.delete(e.pointerId), true));
const _showView55b = showView;
showView = function(v){ cancelPress(); PTR.clear(); _showView55b(v); };
/* lifting two fingers is not a tap on a word */
addEventListener("click", e => { if (performance.now() - (PZ.endT || -1e9) < 450) { e.stopPropagation(); e.preventDefault(); } }, true);
const _pzEnd55 = pzEnd;
pzEnd = function(){
  if (!PZ.on) return;
  PZ.endT = performance.now();
  const t = pzTarget(); if (t) t.classList.remove("pz-sw");
  if (pzSwitch()) {
    PZ.on = false; const tp = $("#pzTip"); if (tp) tp.remove();
    if (t) { t.style.transform = ""; t.style.transformOrigin = ""; t.style.willChange = ""; }
    if (LV.view === "read") {
      const ay = (PZ.anchor && PZ.anchor.closest && PZ.anchor.closest(".ayah")) || topAyah(), blk = ay && ay.closest(".sblk");
      if (ay && blk) store.set("last", { s: +blk.dataset.s, a: +ay.dataset.a });
      openPageView();
    } else {
      const part = PZ.pel && PZ.pel.closest && PZ.pel.closest(".quran-madina-html-part"), m = part && /quran-madina-html-(\d{3})-(\d{3})/.exec(part.className);
      let s, a; if (m && +m[2] > 0) { s = +m[1]; a = +m[2]; } else [s, a] = idToSA(MPP[mpKey()][PG.n - 1]);
      showView("read"); openSurah(s, a);
    }
    return;
  }
  _pzEnd55();
};

/* ===== 4. Black dark mode: the "Black" page colour is now true black with white Arabic and grey bars, and is the default in dark mode ===== */
const _displaySheet55 = displaySheet;
displaySheet = function(){
  _displaySheet55();
  const dark = document.documentElement.getAttribute("data-theme") === "dark" || (settings.theme !== "light" && settings.theme !== "sepia" && matchMedia("(prefers-color-scheme:dark)").matches);
  if (!dark) return;
  const navy = settings.paper === "navy";
  document.querySelectorAll('.dsx [data-paper="navy"],.dsx [data-paper="black"]').forEach(b => b.setAttribute("aria-pressed", (b.dataset.paper === "navy") === navy));
};
