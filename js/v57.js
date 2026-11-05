"use strict";
/* ---------- v57: para progress in the strip (a thin bar with the quarter points, and a percent), para on the right and surah on the left ---------- */
Object.assign(L.ur, { ppT:(p, j)=>`پارہ ${ud(j)} کا ${ud(p)}٪ پڑھ لیا` });
Object.assign(L.en, { ppT:(p, j)=>`${p}% of para ${j} read` });
$("#rdHead").insertAdjacentHTML("beforeend", `<div class="rh-pg" aria-hidden="true"><i class="rh-pg-f"></i></div>`);
$("#rdHead .rh-p small").insertAdjacentHTML("afterend", `<em class="rh-pc"></em>`);
const PP = { j: 0, g0: 0, g1: 0, last: -1 };
function ppPara(j){
  if (PP.j === j) return; PP.j = j;
  const st = META.juz[j - 1], nx = META.juz[j];
  PP.g0 = gid(st[0], st[1]); PP.g1 = nx ? gid(nx[0], nx[1]) : gid(114, 6) + 1;
  /* the para's quarter points (ربع · نصف · ثلاثة) as small ticks on the bar */
  const bar = $("#rdHead .rh-pg"); bar.querySelectorAll(".rh-tk").forEach(x => x.remove());
  if (typeof MK !== "undefined" && MK) Object.keys(MK).forEach(s => Object.keys(MK[s]).forEach(a => {
    const m = MK[s][a]; if (!m.q || m.j) return; const g = gid(+s, +a); if (g <= PP.g0 || g >= PP.g1) return;
    bar.insertAdjacentHTML("beforeend", `<b class="rh-tk qm${m.q}" style="inset-inline-start:${((g - PP.g0) / (PP.g1 - PP.g0) * 100).toFixed(2)}%"></b>`);
  }));
}
function ppUpdate(){
  if (LV.view !== "read" || !CUR || typeof META === "undefined" || !META) return;
  const ay = topAyah(); if (!ay) return;
  const blk = ay.closest(".sblk"), s = blk ? +blk.dataset.s : CUR.n, a = +ay.dataset.a, j = paraOf(s, a);
  ppPara(j);
  /* the last ayah on screen counts as read once you reach the end of the para */
  const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
  const p = Math.max(0, Math.min(100, Math.round(((gid(s, a) - PP.g0) + (atEnd ? 1 : 0)) / (PP.g1 - PP.g0) * 100)));
  if (p === PP.last) return; PP.last = p;
  $("#rdHead .rh-pg-f").style.width = p + "%";
  $("#rdHead .rh-pc").textContent = `${nf(p)}٪`.replace("٪", settings.lang === "en" ? "%" : "٪");
  $("#rdHead .rh-p").setAttribute("aria-label", T("ppT", nf(p), nf(j)));
}
const _rhUpdate57 = rhUpdate;
rhUpdate = function(force){ _rhUpdate57(force); if (force) PP.last = -1; ppUpdate(); };
