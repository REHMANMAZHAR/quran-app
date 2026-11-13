"use strict";
/* ---------- v63: table rows without blank cells; pinch fixes ---------- */

/* ===== 1. No blank cells at the end of a ruku =====
   Each ruku is drawn as its own block (that keeps scrolling and resizing fast), so its last row usually ended
   short, and the rest of the row was left empty. Now the last two or three rows of each block are re-wrapped so
   they share the words evenly: no empty cells, and no word stretched across a whole row. This is done only for
   blocks on or near the screen, again after the text size or screen width changes. */
/* one pass for many blocks: clear old breaks, measure all at natural width (one layout), then insert the new breaks */
function ckBalance(list){
  if (!document.body.classList.contains("tbl")) return;
  const todo = [].concat(list).filter(ck => ck.isConnected && ck._bk !== ck.clientWidth + "|" + settings.size + "|" + (settings.ts || 1));
  if (!todo.length) return;
  todo.forEach(ck => { ck.querySelectorAll(".rbrk").forEach(x => x.remove()); ck.classList.add("bal-m"); });
  const plans = todo.map(ck => {
    const cells = [...ck.querySelectorAll(".words > .w, .words > .last")], cs0 = getComputedStyle(ck);
    const W = ck.clientWidth - parseFloat(cs0.paddingLeft) - parseFloat(cs0.paddingRight), rows = []; let top = null;
    for (const c of cells) { const t = c.offsetTop; if (t !== top) { rows.push([]); top = t; } rows[rows.length - 1].push([c, c.offsetWidth]); }
    return { ck, W, rows, ok: cells.length && cells[0].offsetWidth };
  });
  todo.forEach(ck => ck.classList.remove("bal-m"));
  for (const { ck, W, rows, ok } of plans) {
    if (!ok || !W) continue;                      // not laid out yet
    ck._bk = ck.clientWidth + "|" + settings.size + "|" + (settings.ts || 1);
    if (rows.length < 2) continue;
    const sum = r => r.reduce((t, x) => t + x[1], 0), last = rows[rows.length - 1];
    if (sum(last) / W >= .75) continue;           // nearly full: sharing the few spare pixels is enough
    for (const k of [3, 2]) {
      if (rows.length < k) continue;
      const cs = [].concat(...rows.slice(-k)), T = sum(cs), target = T / k, brk = [];
      let acc = 0, n = 1, bad = false;
      for (let i = 0; i < cs.length; i++) {
        const w = cs[i][1];
        if (acc && n < k && (acc + w / 2 > target || acc + w > W)) { brk.push(i); acc = 0; n++; }
        acc += w; if (acc > W) { bad = true; break; }
      }
      if (bad || brk.length !== k - 1) continue;
      brk.forEach(i => cs[i][0].insertAdjacentHTML("beforebegin", `<i class="rbrk"></i>`));
      break;
    }
  }
}
const balIO = new IntersectionObserver(es => { const on = []; es.forEach(e => { if (e.isIntersecting) { balRO.observe(e.target); on.push(e.target); } else balRO.unobserve(e.target); }); ckBalance(on); }, { rootMargin: "60% 0px" });
const balRO = new ResizeObserver(es => ckBalance(es.map(e => e.target)));
function ckWatch(root){ (root || document).querySelectorAll("#main .ck:not([data-bw])").forEach(ck => { ck.dataset.bw = 1; balIO.observe(ck); }); }
const _buildBlock63 = buildBlock;
buildBlock = function(d){ const blk = _buildBlock63(d); requestAnimationFrame(() => ckWatch()); return blk; };
const _applySettings63 = applySettings;
applySettings = function(){ const r = _applySettings63.apply(this, arguments); requestAnimationFrame(() => { ckWatch(); ckBalance([...document.querySelectorAll("#main .ck[data-bw]")].filter(ck => { const r2 = ck.getBoundingClientRect(); return r2.bottom > -innerHeight * .6 && r2.top < innerHeight * 1.6; })); }); return r; };
ckWatch();

/* ===== 2. Pinch ===== */
/* the mushaf page can be made smaller but not wider than the screen (it was cut off at the sides);
   a clear pinch out on a page goes back to the reading view */
pzSwitch = function(){
  if (!PZ.on) return false;
  if (LV.view === "read") return PZ.f < .38;
  if (LV.view === "page") return PZ.f > 1.45;
  return false;
};
const _pzEnd63 = pzEnd;
pzEnd = function(){
  const pv = LV.view === "page"; _pzEnd63();
  if (pv && LV.view === "page" && settings.mpz > 1) { settings.mpz = 1; store.set("settings", settings); if (typeof mpZoom === "function") mpZoom(); }
};
