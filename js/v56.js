"use strict";
/* ---------- v56: tap الربع / النصف / الثلاثة to see that quarter of the para in brief (its rukus with their summaries) and start its tafsir ---------- */
Object.assign(L.ur, { qtH:(q, j)=>`پارہ ${ud(j)} — ${["", "ربع (پہلا چوتھائی ختم)", "نصف (آدھا ختم)", "ثلاثہ (تین چوتھائی ختم)"][q]}`,
  qtSub:"یہاں سے پارے کا اگلا حصہ شروع ہوتا ہے", qtRange:(a, b)=>`${a} سے ${b} تک`, qtRk:"اس حصے کے رکوع", qtRkN:(n)=>`رکوع ${ud(n)}`, qtAy:n=>`${ud(n)} آیات`,
  qtTaf:"یہاں سے تفسیر سنیں", qtRec:"تلاوت سنیں", qtRead:"یہاں سے پڑھیں" });
Object.assign(L.en, { qtH:(q, j)=>`Para ${j} — ${["", "Quarter (¼ done)", "Half (½ done)", "Three quarters (¾ done)"][q]}`,
  qtSub:"The next part of the para starts here", qtRange:(a, b)=>`${a} to ${b}`, qtRk:"Rukus in this part", qtRkN:n=>`Ruku ${n}`, qtAy:n=>`${n} ayahs`,
  qtTaf:"Tafsir from here", qtRec:"Listen", qtRead:"Read from here" });
/* where each part of a para starts: para starts and the three quarter marks, in Quran order */
let QB = null;
function qBounds(){
  if (QB) return QB; QB = [];
  Object.keys(MK).forEach(s => Object.keys(MK[s]).forEach(a => { const m = MK[s][a]; if (m.q || m.j) QB.push([+s, +a]); }));
  QB.sort((x, y) => x[0] - y[0] || x[1] - y[1]); return QB;
}
const prevAy = (s, a) => a > 1 ? [s, a - 1] : s > 1 ? [s - 1, META.surahs[s - 2].ayahs] : [1, 1];
async function openQuarter(s, a, q){
  if (!MK) return;
  const en = settings.lang === "en", D = await rkData(), B = qBounds();
  const i = B.findIndex(x => x[0] === s && x[1] === a), nx = B[i + 1], [es, ea] = nx ? prevAy(nx[0], nx[1]) : [114, 6];
  const g1 = gid(s, a), g2 = gid(es, ea), j = juzOf(s, a), nm = n => en ? META.surahs[n - 1].tr : META.surahs[n - 1].ar;
  const rows = D.filter(r => gid(r[0], r[2]) >= g1 && gid(r[0], r[1]) <= g2);
  const rkNo = r => D.filter(x => x[0] === r[0] && x[1] <= r[1]).length;
  const range = T("qtRange", `${esc(nm(s))} ${nf(s)}:${nf(a)}`, `${esc(nm(es))} ${nf(es)}:${nf(ea)}`);
  $("#sheetBody").innerHTML = `<div class="rk-sh qt-sh"><h3><span class="qm qm${q}">${T("qLbl")[q]}</span> ${T("qtH", q, nf(j))}</h3>
    <p class="rk-meta"><span>${range}</span><span>${T("qtAy", nf(g2 - g1 + 1))}</span></p>
    <p class="qt-sub">${T("qtSub")}</p>
    <div class="wd-actions rk-act"><button class="btn" data-rkt="${s}:${a}">${TAF_ICO} ${T("qtTaf")}</button><button class="btn ghost" data-rkp="${s}:${a}">▶ ${T("qtRec")}</button><button class="btn ghost" data-rko="${s}:${a}">${T("qtRead")}</button></div>
    <h4>${T("qtRk")}</h4>
    ${rows.map(r => { const sum = en ? r[4] : r[3]; return `<div class="rk-sum qt-rk"><b>${esc(nm(r[0]))} · ${T("qtRkN", nf(rkNo(r)))} <small dir="ltr">${nf(r[0])}:${nf(r[1])}–${nf(r[2])}</small></b>
      <p class="${en ? "" : "ur"}">${sum ? esc(sum) : T("rkNone")}</p><button class="qt-go" data-rkt="${r[0]}:${r[1]}">${TAF_ICO} ${T("rkTaf")}</button></div>`; }).join("")}
    ${rows.some(r => r[3]) ? `<p class="draft">${T("rkDraft")}</p>` : ""}</div>`;
  openSheet();
}
/* window first, so the ruku handler on the page never sees it */
addEventListener("pointerdown", e => { if (e.target.closest && e.target.closest("#main .qm[data-qt]")) e.stopPropagation(); }, true);
addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("#main .qm[data-qt]"); if (!b) return;
  e.stopPropagation(); e.preventDefault();
  const [s, a, q] = b.dataset.qt.split(":").map(Number); openQuarter(s, a, q);
}, true);
addEventListener("keydown", e => { const b = (e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest("#main .qm[data-qt]"); if (b) { e.preventDefault(); b.click(); } }, true);
