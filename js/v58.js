"use strict";
/* ---------- v58: the pinned header follows the lowest ayah on screen ----------
   Before: the surah / para name came from the ayah at the top anchor line, so a new surah or para
   only showed in the header once it had scrolled past the top of the screen.
   Now: it comes from the lowest ayah actually on screen, so the moment a new surah or para appears
   from below, the header (and the para progress with it) already says so.
   Done by pointing topAyah at the lower line for the duration of the header update only — the
   reading position, resume point and everything else keep using the top line as before. */

function leadAyah(){
  const tb = document.querySelector(".tabbar");
  const pl = document.querySelector(".player.on");
  let y = innerHeight - 10;
  if (tb && getComputedStyle(tb).position === "fixed") y -= tb.offsetHeight;
  if (pl) y -= pl.offsetHeight;
  for (const x of [innerWidth / 2, innerWidth * .8, innerWidth * .2]) {
    const e = document.elementFromPoint(x, y);
    const a = e && e.closest && e.closest("#main .ayah"); if (a) return a;
    const w = e && e.closest && e.closest("#main .w"); if (w) return w.closest(".ayah");
  }
  return null;
}

const _rhUpdate58 = rhUpdate, _topAyah58 = topAyah;
rhUpdate = function(force){
  const real = topAyah;
  topAyah = function(){ return leadAyah() || real(); };
  try { _rhUpdate58(force); } finally { topAyah = real; }
};
