"use strict";
/* ---------- v47: keep your place when the phone turns or the text reflows ---------- */
/* We remember the word at the top of the screen while you scroll; when the screen width changes (rotation, split view,
   text size) we bring that same word back to the same height, a few times while the layout settles. */
const ANC = { el: null, off: 0, w: innerWidth, hold: 0, raf: 0 };
const ancLine = () => { const b = $(".bar"); return (b ? b.getBoundingClientRect().bottom : 60) + 12; };
function ancGrab(){
  ANC.raf = 0;
  if (ANC.hold > Date.now() || (LV.view !== "read" && LV.view !== "page")) return;
  const y = ancLine(); let el = null;
  for (const x of [innerWidth / 2, innerWidth * .75, innerWidth * .25]) { const e = document.elementFromPoint(x, y + 6); el = e && (e.closest("#main .w") || e.closest("#main .ayah")); if (el) break; }
  if (!el) {   /* over a heading or band: take the first word below the line, measuring only the chunk on screen (never the whole surah) */
    const cks = document.querySelectorAll("#main .ck"), pool = cks.length ? cks : document.querySelectorAll("#main .ayah");
    for (const c of pool) { if (c.getBoundingClientRect().bottom > y) { el = [...c.querySelectorAll(".w")].find(w => w.getBoundingClientRect().bottom > y) || c; break; } }
  }
  if (el) { ANC.el = el; ANC.off = el.getBoundingClientRect().top; }
}
function ancRestore(){
  if (!ANC.el || !ANC.el.isConnected) return;
  const dy = ANC.el.getBoundingClientRect().top - ANC.off; if (Math.abs(dy) > 1) scrollBy(0, dy);
}
function ancSettle(){
  ANC.hold = Date.now() + 900;
  [0, 60, 160, 320, 600, 850].forEach(t => setTimeout(() => requestAnimationFrame(ancRestore), t));
  setTimeout(() => { ANC.hold = 0; ancGrab(); }, 950);
}
addEventListener("scroll", () => { if (!ANC.raf) ANC.raf = requestAnimationFrame(ancGrab); }, { passive: true });
addEventListener("orientationchange", () => { ANC.hold = Date.now() + 900; });   // iPhone fires this before the new size is known
if (screen.orientation) screen.orientation.addEventListener("change", () => { ANC.hold = Date.now() + 900; });
addEventListener("resize", () => { if (Math.abs(innerWidth - ANC.w) < 2) return; ANC.w = innerWidth; ancSettle(); });
/* pinch-to-resize and display changes re-flow the page as well */
const _saveSettings47 = saveSettings;
saveSettings = function(){ if (LV.view === "read" || LV.view === "page") { if (!ANC.hold) ancGrab(); _saveSettings47(); ancSettle(); } else _saveSettings47(); };
document.fonts && document.fonts.ready.then(() => { ancRestore(); });
