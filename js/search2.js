"use strict";
/* ---------- Search: Arabic, Urdu, Roman Urdu ("rehmat", "sabr", "zikr") and English — every result shows its translation ---------- */
Object.assign(L.ur, { searchSub:"عربی، اردو، رومن اردو یا انگریزی", searchPh:"مثلاً صبر، رحمت، rehmat، zikr، patience", wordsH:"الفاظ", ayWord:"اس لفظ والی آیات", inTr:"ترجمے میں", inUr:"اردو ترجمے میں", inAr:"عربی متن میں", occT:n=>`قرآن میں ${ud(n)} بار` });
Object.assign(L.en, { searchSub:"Arabic, Urdu, Roman Urdu or English", searchPh:"e.g. صبر, rehmat, zikr, patience", wordsH:"Words", ayWord:"Ayahs with this word", inTr:"In the translation", inUr:"In the Urdu translation", inAr:"In the Arabic text", occT:n=>`${n} times in the Quran` });
DATA.words = () => load("words", `data/words.json?v=${DV}`);
function skelR(s){
  s = s.toLowerCase();
  [["th", "s"], ["dh", "z"], ["ḍ", "z"], ["ẓ", "z"], ["ḥ", "h"], ["ṣ", "s"], ["ṭ", "t"], ["q", "k"], ["v", "w"], ["ph", "f"], ["ee", "i"], ["oo", "u"]].forEach(([a, b]) => { s = s.split(a).join(b); });
  s = s.normalize("NFD").replace(/[^a-z]/g, "");
  let out = "", prev = "";
  for (const c of s) {
    if ("aeiou".includes(c)) { prev = c; continue; }
    if ("wy".includes(c) && prev && "aeoui".includes(prev)) { prev = c; continue; }
    if (out.slice(-1) === c) { prev = c; continue; }
    out += c; prev = c;
  }
  return out;
}
let IDXOFF = null;
const trUr = () => !/^en/.test(settings.tr || "ur");
function rowAt(idx, s, a){ if (!IDXOFF) { IDXOFF = [0]; META.surahs.forEach(S => IDXOFF.push(IDXOFF[IDXOFF.length - 1] + S.ayahs)); } return idx[IDXOFF[s - 1] + a - 1]; }
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function hitHTML(r, mk){
  const ur = trUr(), tr = ur ? r[4] : r[3];
  const m = (txt, which) => mk && mk[which] ? esc(txt).replace(new RegExp(reEsc(esc(mk[which])), "gi"), x => `<mark>${x}</mark>`) : esc(txt);
  return `<li><button data-go2="${r[0]}:${r[1]}"><div class="oa">${m(r[2], "ar")}</div><div class="otr ${ur ? "ur" : "en"}" dir="${ur ? "rtl" : "ltr"}">${m(tr, ur ? "ur" : "en")}</div><div class="or">${esc(surahName(r[0]))} ${nf(r[0])}:${nf(r[1])}</div></button></li>`;
}
const hitsHTML = (rows, mk) => `<ul class="occ"${mk && mk.ar ? ` data-mk="${esc(mk.ar)}"` : ""}>${rows.map(r => hitHTML(r, mk)).join("")}</ul>`;
function lemHTML(ids, W){
  return `<ul class="lemlist">${ids.map(li => { const Lm = META.lemmas[li], u = W.lemUr[li];
    return `<li><button data-slem="${li}"><span class="la">${esc(Lm[0])}</span><span class="lg">${u && trUr() ? `<span class="ur">${esc(u)}</span> <small>${esc(Lm[4])}</small>` : esc(Lm[4])}</span><span class="lc">${T("times", Lm[3])}</span></button></li>`; }).join("")}</ul>`;
}
runSearch = async function(q){
  SQ = q; q = q.trim(); const out = $("#sres");
  if (q.replace(/\s/g, "").length < 2) { out.innerHTML = `<p class="muted">${T("typeMore")}</p>`; return; }
  out.innerHTML = `<div class="loading" style="padding:30px">${T("loading")}</div>`;
  let idx, W, occ;
  try { [idx, W, occ] = await Promise.all([DATA.search(), DATA.words(), DATA.occ()]); } catch(e) { out.innerHTML = `<p class="muted">${T("loadFail")}</p>`; return; }
  if (SQ.trim() !== q) return;
  let h = "";
  if (AR.test(q)) {
    const letters = bareAr(q).replace(/\s/g, "");
    const roots = META.roots.map((R, i) => [R, i]).filter(([R]) => letters.length <= 4 && bareAr(R[0]) === letters);
    const lems = META.lemmas.map((Lm, i) => i).filter(i => bareAr(META.lemmas[i][0]) === letters).slice(0, 8);
    if (roots.length || lems.length) h += `<h3>${T("wordsH")}</h3>${roots.length ? `<ul class="lemlist">${roots.map(([R, i]) => `<li><button data-root="${i}"><span class="la">${esc(spaced(R[0]))}</span><span class="lg">${T("rootCnt", R[2].length, R[1])}</span><span class="lc"></span></button></li>`).join("")}</ul>` : ""}${lemHTML(lems, W)}`;
    const needle = bareAr(q), arHits = idx.filter(r => r[2].includes(needle)), urHits = idx.filter(r => r[4].includes(q) && !r[2].includes(needle));
    if (arHits.length) h += `<h3>${T("inAr")} · ${T("results", nf(arHits.length))}</h3>` + hitsHTML(arHits.slice(0, 60), { ar: needle });
    if (urHits.length) h += `<h3>${T("inUr")} · ${T("results", nf(urHits.length))}</h3>` + hitsHTML(urHits.slice(0, 60), { ur: q });
  } else {
    const ql = q.toLowerCase(), toks = ql.split(/\s+/).filter(Boolean);
    /* Roman spelling → Arabic words (by sound), plus English glosses of the dictionary */
    const ids = [], add = li => { if (!ids.includes(li)) ids.push(li); };
    toks.forEach(t => { const k = skelR(t); if (k.length < 2) return;
      (W.sk[k] || []).forEach(add);
      if (k.length >= 3) Object.keys(W.sk).filter(x => x !== k && x.startsWith(k) && x.length <= k.length + 2).slice(0, 12).forEach(x => W.sk[x].slice(0, 2).forEach(add)); });
    if (ql.length >= 3) META.lemmas.forEach((Lm, i) => { if (new RegExp(`\\b${reEsc(ql)}`, "i").test(Lm[4])) add(i); });
    ids.sort((a, b) => META.lemmas[b][3] - META.lemmas[a][3]);
    const top = ids.slice(0, 10);
    if (top.length) {
      h += `<h3>${T("wordsH")}</h3>${lemHTML(top, W)}`;
      const seen = new Set(), rows = [];
      for (const li of top.slice(0, 3)) for (const loc of (occ[li] || [])) { const [s, a] = loc.split(":").map(Number), key = s * 1000 + a; if (!seen.has(key)) { seen.add(key); rows.push(rowAt(idx, s, a)); } if (rows.length >= 40) break; }
      if (rows.length) h += `<h3>${T("ayWord")}</h3>` + hitsHTML(rows);
    }
    const trHits = idx.filter(r => r[3].toLowerCase().includes(ql) || r[4].includes(q));
    if (trHits.length) h += `<h3>${T("inTr")} · ${T("results", nf(trHits.length))}</h3>` + hitsHTML(trHits.slice(0, 60), { en: q, ur: q });
  }
  out.innerHTML = h || `<p class="muted">${T("noRes")}</p>`;
};
/* a word from the results: its occurrences, each with the ayah's translation */
$("#searchv").addEventListener("click", e => {
  const b = e.target.closest("[data-slem]"); if (!b) return;
  const li = +b.dataset.slem, Lm = META.lemmas[li];
  $("#sheetBody").innerHTML = `<div class="wd-head"><div class="wd-word">${esc(Lm[0])}</div><div class="wd-sub">${T("occT", nf(Lm[3]))}</div></div>
    ${Lm[2] >= 0 ? `<button class="btn ghost" data-root-open="${Lm[2]}">${esc(spaced(META.roots[Lm[2]][0]))}</button>` : ""}
    <h3 id="occH"></h3><ul class="occ" id="occList"></ul><div id="occMore"></div>`;
  openSheet(); showOcc(li, "");
});
document.addEventListener("click", e => { const r = e.target.closest("#sheetBody [data-root-open]"); if (r) { closeAll(); openRoot(+r.dataset.rootOpen); } });
/* word sheet: occurrences carry a translation line; the lead meaning follows the chosen word-meaning language */
moreOcc = async function(){
  const st = occState, batch = st.list.slice(st.shown, st.shown + 12), ur = trUr();
  st.shown += batch.length;
  const items = await Promise.all(batch.map(async loc => {
    const [s, a, w] = loc.split(":").map(Number);
    const d = await DATA.surah(s), A = d.ayahs[a - 1], tr = ur ? A.ur : (A[settings.tr] || A.en);
    const text = A.w.map((x, k) => k === w - 1 ? `<mark>${esc(x[0])}</mark>` : esc(x[0])).join(" ");
    return `<li><button data-loc="${loc}"><div class="oa">${text}</div>${tr ? `<div class="otr ${ur ? "ur" : "en"}" dir="${ur ? "rtl" : "ltr"}">${esc(tr)}</div>` : ""}<div class="or">${esc(surahName(s))} ${nf(s)}:${nf(a)}${loc === st.current ? T("thisAyah") : ""}</div></button></li>`;
  }));
  $("#occList").insertAdjacentHTML("beforeend", items.join(""));
  $("#occMore").innerHTML = st.shown < st.list.length ? `<button class="more" id="btnMore">${T("more", st.list.length - st.shown)}</button>` : "";
};
const _openWordS = openWord;
openWord = function(a, i){
  _openWordS(a, i);
  const w = CUR.ayahs[a - 1].w[i], body = $("#sheetBody"), ur = settings.gl !== "en";
  const m = body.querySelector(".wd-mean"), sub = body.querySelector(".wd-mean + .wd-sub");
  if (m && w[3] && !ur && sub) { m.textContent = w[1]; m.className = "wd-mean en"; sub.textContent = w[3]; sub.classList.add("ur"); }
  if (ur) DATA.words().then(W => { body.querySelectorAll("[data-lem]").forEach(b => { const u = W.lemUr[+b.dataset.lem], g = b.querySelector(".lg");
    if (u && g && !g.querySelector(".ur")) g.innerHTML = `<span class="ur">${esc(u)}</span> <small>${esc(g.textContent)}</small>`; }); }).catch(() => {});
};
/* results arrive as plain letters; swap in the full Arabic text (with harakat) as each result scrolls into view */
const hitIO = new IntersectionObserver(ents => ents.forEach(en => {
  if (!en.isIntersecting) return; hitIO.unobserve(en.target);
  const b = en.target, [s, a] = b.dataset.go2.split(":").map(Number), oa = b.querySelector(".oa"), mk = (b.closest("[data-mk]") || {}).dataset;
  DATA.surah(s).then(d => { const toks = mk && mk.mk ? mk.mk.split(" ").filter(Boolean) : [];
    oa.innerHTML = d.ayahs[a - 1].w.map(w => { const t = esc(w[0]); return toks.some(k => bareAr(w[0]).includes(k)) ? `<mark>${t}</mark>` : t; }).join(" "); }).catch(() => {});
}), { rootMargin: "200px" });
new MutationObserver(() => document.querySelectorAll("#sres [data-go2]:not([data-io])").forEach(b => { b.dataset.io = 1; hitIO.observe(b); })).observe($("#searchv"), { childList: true, subtree: true });
