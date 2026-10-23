"use strict";
/* ---------- v43: reading counts in every layout · rings can go past 100% · tap ع for the ruku in brief · ayah number circles fit
   · Settings as a menu with clear pages · pinch to resize text (the page reflows to fit) ---------- */
Object.assign(L.ur, { rkH:(s,n)=>`${s} · رکوع ${ud(n)}`, rkAy:(a,b)=>`آیات ${ud(a)}–${ud(b)}`, rkOf:(n,t)=>`سورت کا ${ud(n)} / ${ud(t)} رکوع`, rkPara:n=>`پارہ ${ud(n)}`, rkMk:"مکی سورت", rkMd:"مدنی سورت",
  rkSum:"خلاصہ", rkTr:"پورا ترجمہ", rkWords:"اس رکوع کے اہم الفاظ", rkTaf:"اس رکوع کی تفسیر سنیں", rkRec:"تلاوت سنیں", rkRead:"یہاں سے پڑھیں",
  rkDraft:"خلاصہ ڈاکٹر اسرار احمد کی تفسیر بیان القرآن کی روشنی میں، ہمارے آسان الفاظ میں", rkNone:"اس رکوع کا خلاصہ جلد آ رہا ہے۔ تب تک پورا ترجمہ پڑھیں یا تفسیر سنیں۔",
  stMenuSub:{ disp:"رسم الخط، صفحہ، سائز، رنگ", tr:"ترجمہ اور لفظی معنی", rec:"قاری، رفتار، وقفہ", taf:"تفسیر کا ذریعہ", learn:"معانی اور اسباق کی زبان", pr:"نماز کے اوقات، یاد دہانیاں", app:"زبان، ڈیش بورڈ، بیک اپ، مدد" },
  stBack:"ترتیبات", gText:"قرآن کا متن", gPage:"صفحے کی ترتیب", gShow:"قرآن کے ساتھ دکھائیں", gColor:"رنگ اور تھیم", gRead:"پڑھتے وقت", zoomHint:"دو انگلیوں سے چھوٹا بڑا کریں" });
Object.assign(L.en, { rkH:(s,n)=>`${s} · Ruku ${n}`, rkAy:(a,b)=>`Ayahs ${a}–${b}`, rkOf:(n,t)=>`Ruku ${n} of ${t} in this surah`, rkPara:n=>`Para ${n}`, rkMk:"Makki surah", rkMd:"Madani surah",
  rkSum:"In brief", rkTr:"Full translation", rkWords:"Key words in this ruku", rkTaf:"Listen to the tafsir of this ruku", rkRec:"Listen to recitation", rkRead:"Read from here",
  rkDraft:"Summary in our own simple words, following Dr. Israr Ahmad's Bayan-ul-Quran", rkNone:"A summary for this ruku is coming. Meanwhile read the full translation or listen to the tafsir.",
  stMenuSub:{ disp:"Script, page, size, colours", tr:"Translation and word meanings", rec:"Reciter, speed, pause", taf:"Tafsir source", learn:"Language for meanings and lessons", pr:"Prayer times, reminders", app:"Language, dashboard, backup, help" },
  stBack:"Settings", gText:"Quran text", gPage:"Page layout", gShow:"Show with the Quran", gColor:"Colours and theme", gRead:"While reading", zoomHint:"Pinch with two fingers to resize" });
/* ===== 1. reading counts: whatever ayah stays on screen ~2 s is read (works for the printed table and long ayahs too) ===== */
if (typeof rio !== "undefined" && rio) rio.disconnect();
trackReading = function(){};
const DWELL = {}; let rdDirty = false;
function onScreenAyahs(){
  const top = ($(".bar") && !document.body.classList.contains("bars-off") ? $(".bar").getBoundingClientRect().bottom : 0) + 8;
  const tb = $(".tabbar"), bot = (tb && !document.body.classList.contains("bars-off") ? tb.getBoundingClientRect().top : innerHeight) - 8, seen = new Set();
  for (let y = top; y < bot; y += 28) for (const x of [innerWidth * .25, innerWidth * .5, innerWidth * .75]) {
    const el = document.elementFromPoint(x, y), ay = el && el.closest && el.closest("#main .ayah"); if (!ay) continue;
    const b = ay.closest(".sblk"); seen.add((b ? b.dataset.s : CUR && CUR.n) + ":" + ay.dataset.a);
  }
  return seen;
}
setInterval(() => {
  if (document.hidden) return;
  if (LV.view === "read" && CUR) {
    const vis = onScreenAyahs();
    Object.keys(DWELL).forEach(k => { if (!vis.has(k)) delete DWELL[k]; });
    vis.forEach(k => { DWELL[k] = (DWELL[k] || 0) + 1; if (DWELL[k] === 2) { const [s, a] = k.split(":").map(Number); markRead(s, a); rdDirty = true; } });
    if (vis.size && typeof touchActive === "function" && Date.now() - (P.userScroll || 0) < 90e3) touchActive();
  } else if (LV.view === "page" && typeof PG !== "undefined") pageDwell();
  if (rdDirty) { rdDirty = false; saveU(); }
}, 1000);
/* page view: a page read for 25 s counts all its ayahs */
let PAGES = null, pgT = { n: 0, s: 0 };
load("pages", `data/pages.json?v=${DV}`).then(x => { PAGES = x; }).catch(() => {});
function pageDwell(){
  if (!PAGES) return;
  if (pgT.n !== PG.n) { pgT = { n: PG.n, s: 0 }; return; }
  if (++pgT.s !== 25) return;
  const [s1, a1] = PAGES[PG.n - 1], nx = PAGES[PG.n] || [115, 1];
  let s = s1, a = a1;
  while (s < nx[0] || (s === nx[0] && a < nx[1])) { markRead(s, a); a++; if (a > META.surahs[s - 1].ayahs) { s++; a = 1; if (s > 114) break; } }
  rdDirty = true;
}
/* tafsir: every ayah of the group being explained counts as read */
const _tafNowR = tafNow;
tafNow = function(marks, t){
  _tafNowR(marks, t);
  const au = $("#vpAudio"); if (!au || au.paused || !marks.length) return;
  let m = marks[0]; for (const x of marks) { if (x[2] <= t + 1) m = x; else break; }
  marks.filter(x => x[2] === m[2] && x[0] === m[0]).forEach(x => markRead(x[0], x[1])); rdDirty = true;
};
/* ===== 2. rings: past the target the ring keeps going round in a deeper colour ===== */
const lapArc = (cx, r, v, col, w, rot) => { const C = 2 * Math.PI * r, laps = Math.max(0, v), full = laps >= 1, extra = laps - 1;
  let h = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(1, laps))}"${rot}/>`;
  if (full && extra > 0) h += `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" style="filter:brightness(.62) drop-shadow(0 0 2px rgba(0,0,0,.35))" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(1, extra))}"${rot}/>`;
  return h; };
ringSVG = function(p){
  return `<div class="ring${p > 100 ? " over" : ""}"><svg viewBox="0 0 108 108"><circle cx="54" cy="54" r="46" fill="none" stroke="var(--line)" stroke-width="9"/>${lapArc(54, 46, p / 100, "var(--gold)", 9, ' transform="rotate(-90 54 54)"')}</svg><div class="pct">${nf(p)}%</div></div>`;
};
rings3 = function(vals){
  const col = ["var(--gold)", "#1f9d8b", "#8a63c9"], R = [48, 37, 26];
  return `<svg class="rings3" viewBox="0 0 112 112">${vals.map((v, i) => `<circle cx="56" cy="56" r="${R[i]}" fill="none" stroke="${col[i]}" stroke-opacity=".18" stroke-width="9"/>${lapArc(56, R[i], isFinite(v) ? v : 0, col[i], 9, ' transform="rotate(-90 56 56)"')}`).join("")}</svg>`;
};
/* ===== 3. ayah number circles always fit their number; 3-digit numbers get a slightly smaller figure ===== */
function fitEnds(){ document.querySelectorAll("#main .end:not([data-fit]), #mushaf .end:not([data-fit])").forEach(e => { e.dataset.fit = 1; const n = e.textContent.trim().length; if (n >= 3) e.classList.add("d3"); else if (n === 2) e.classList.add("d2"); }); }
new MutationObserver(fitEnds).observe(document.body, { childList: true, subtree: true });
/* ===== 4. ruku in brief: tap the golden ع ===== */
let RK = null;
const rkData = () => RK ? Promise.resolve(RK) : load("ruku", `data/ruku.json?v=${DV}`).then(x => (RK = x)).catch(() => (RK = []));
const juzOf = (s, a) => { let j = 1; META.juz.forEach((x, k) => { if (s > x[0] || (s === x[0] && a >= x[1])) j = k + 1; }); return j; };
async function openRuku(s, a1, a2, rs){
  const S = META.surahs[s - 1], en = settings.lang === "en", D = await rkData(), d = await DATA.surah(s);
  const row = D.find(x => x[0] === s && x[1] === a1), total = D.filter(x => x[0] === s).length || rs;
  const sum = row ? (en ? row[4] : row[3]) : "";
  const trOf2 = A => (settings.showTr === false ? (en ? (A.en2 || A.en) : A.ur) : (A[settings.tr] || (en ? (A.en2 || A.en) : A.ur))) || "";
  const tr = d.ayahs.slice(a1 - 1, a2).map((A, k) => `${esc(trOf2(A))} <sup>${nf(a1 + k)}</sup>`).join(" ");
  /* key words: content words that occur in this ruku, most frequent in the Quran first */
  const seen = new Set(), words = [];
  d.ayahs.slice(a1 - 1, a2).forEach(A => A.w.forEach(w => { const lm = META.lemmas[w[5]]; if (!lm || !/^(N|V|ADJ)/.test(lm[1]) || seen.has(w[5])) return; seen.add(w[5]); words.push([lm[3], w]); }));
  words.sort((x, y) => (y[0] >= 3 && y[0] <= 400) - (x[0] >= 3 && x[0] <= 400) || y[0] - x[0]);   // the words that carry this passage: neither everywhere nor one-off
  const urTr = /[؀-ۿ]/.test(tr);
  $("#sheetBody").innerHTML = `<div class="rk-sh"><h3>${esc(T("rkH", en ? S.tr : S.ar, rs))}</h3>
    <p class="rk-meta"><span>${T("rkAy", nf(a1), nf(a2))}</span><span>${T("rkOf", nf(rs), nf(total))}</span><span>${T("rkPara", nf(juzOf(s, a1)))}</span><span>${T(S.type === "Meccan" ? "rkMk" : "rkMd")}</span></p>
    <div class="rk-sum"><b>${T("rkSum")}</b><p class="${en ? "" : "ur"}">${sum ? esc(sum) : T("rkNone")}</p></div>
    <div class="wd-actions rk-act"><button class="btn" data-rkt="${s}:${a1}">${TAF_ICO} ${T("rkTaf")}</button><button class="btn ghost" data-rkp="${s}:${a1}">▶ ${T("rkRec")}</button><button class="btn ghost" data-rko="${s}:${a1}">${T("rkRead")}</button></div>
    ${words.length ? `<h4>${T("rkWords")}</h4><div class="sf-forms">${words.slice(0, 8).map(([, w]) => `<span class="sf"><b class="oar">${esc(w[0])}</b><span class="ur">${esc(w[3] || "")}</span><small dir="ltr">${esc(w[1] || "")}</small></span>`).join("")}</div>` : ""}
    <details class="rk-tr"><summary>${T("rkTr")}</summary><p class="${urTr ? "ur" : ""}">${tr}</p></details>
    ${sum ? `<p class="draft">${T("rkDraft")}</p>` : ""}</div>`;
  openSheet();
}
$("#main").addEventListener("pointerdown", e => { if (e.target.closest(".rk")) e.stopPropagation(); }, true);
$("#main").addEventListener("click", e => {
  const r = e.target.closest(".rk[data-rk]"); if (!r) return; e.stopPropagation(); e.preventDefault();
  const [s, a1, a2, rs] = r.dataset.rk.split(":").map(Number); openRuku(s, a1, a2, rs);
}, true);
$("#sheetBody").addEventListener("click", e => {
  const t = e.target.closest("[data-rkt]"), p = e.target.closest("[data-rkp]"), o = e.target.closest("[data-rko]"); if (!t && !p && !o) return;
  const [s, a] = (t || p || o).dataset[t ? "rkt" : p ? "rkp" : "rko"].split(":").map(Number); closeAll();
  if (t) playTafsir(s, a); else if (p) playFrom(s, a); else { showView("read"); openSurah(s, a); }
});
/* ===== 5. Settings: a short menu; each part opens on its own page. Display is grouped, with the preview kept in view ===== */
const ST_ICO = { disp: ["#2F6FD0", `<path d="M4 5h16v11H4zM9 20h6M12 16v4"/>`], tr: ["#7A4FC4", `<path d="M4 6h9M8.5 4v2M6 6c0 3 2 6 5 7M11 6c-.5 3-2.5 6-6 8M13 20l4-9 4 9M14.5 17h5"/>`],
  rec: ["#1E8E5A", `<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>`], taf: ["#B03A48", `<path d="M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5zM12 6.5v13"/>`],
  learn: ["#3D6CC0", `<path d="M12 4 2.5 9 12 14l9.5-5zM6 11v4.5c1.5 1.5 3.7 2.5 6 2.5s4.5-1 6-2.5V11"/>`], pr: ["#1F8FA8", `<path d="M12 3c-2 2.2-3 3.6-3 5h6c0-1.4-1-2.8-3-5zM6 21V12l6-4 6 4v9M4 21h16"/>`],
  app: ["#5D6E7E", `<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.2 6.2l2.1 2.1M17.7 15.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 17.8l2.1-2.1M17.7 8.3l2.1-2.1"/>`] };
const STV = { open: null };
const _renderSettingsV = renderSettings;
renderSettings = function(...args){
  if (SET_GO) STV.open = SET_GO;
  const r = _renderSettingsV(...args), el = $("#setv"); if (!el) return r;
  const secs = [...el.querySelectorAll(".st-sec")], sub = T("stMenuSub");
  const chips = el.querySelector(".st-chips"); if (chips) chips.remove();
  el.querySelector(".st-top").insertAdjacentHTML("afterend", `<nav class="st-menu">${secs.map(sc => { const k = sc.id.slice(3), ic = ST_ICO[k] || ST_ICO.app;
    return `<button data-stopen="${k}"><span class="st-ic" style="--c:${ic[0]}"><svg viewBox="0 0 24 24">${ic[1]}</svg></span><span class="st-mt"><b>${esc(sc.querySelector("h3").firstChild.textContent)}</b><small>${esc(sub[k] || "")}</small></span><span class="st-go">‹</span></button>`; }).join("")}</nav>`);
  secs.forEach(sc => sc.querySelector("h3").insertAdjacentHTML("afterbegin", `<button class="st-back" data-stback="1">› ${T("stBack")}</button>`));
  stShow();
  return r;
};
VIEWS.settings.render = renderSettings;
function stShow(){
  const el = $("#setv"); if (!el) return;
  el.classList.toggle("st-one", !!STV.open);
  el.querySelectorAll(".st-sec").forEach(sc => sc.classList.toggle("st-cur", sc.id === "st-" + STV.open));
  if (STV.open === "disp") dsGroup();
}
$("#setv").addEventListener("click", e => {
  const o = e.target.closest("[data-stopen]"); if (o) { e.stopPropagation(); STV.open = o.dataset.stopen; stShow(); scrollTo(0, 0); return; }
  if (e.target.closest("[data-stback]")) { e.stopPropagation(); STV.open = null; stShow(); scrollTo(0, 0); }
}, true);
$("#setv").addEventListener("input", e => { if (e.target.id === "stq") $("#setv").classList.toggle("st-search", !!e.target.value.trim()); });
const _showViewST = showView;
showView = function(v){ if (v !== "settings") STV.open = null; return _showViewST(v); };
/* Display page: the same controls, put into five clear groups */
function dsGroup(){
  const host = $("#setDisp"); if (!host || host.querySelector(".ds-grp")) return;
  const all = [...host.children], has = (n, q) => n.matches(q) || !!n.querySelector(q);
  const G = [["gText", n => has(n, "[data-font],[data-ds],[data-arc],[data-num]")], ["gShow", n => has(n, "[data-vm],[data-trsel],#dsTl")],
    ["gPage", n => has(n, "[data-pst],#dsLines,.ds-card")], ["gColor", n => has(n, "[data-th],[data-paper],[data-acc],[data-tbc]")], ["gRead", n => true]];
  const box = G.map(([k]) => { const g = document.createElement("div"); g.className = "ds-grp"; g.innerHTML = `<h4>${T(k)}</h4>`; return g; });
  all.forEach(n => { const i = G.findIndex(([, f]) => f(n)); box[i].appendChild(n); });
  box.forEach(g => { if (g.children.length > 1) host.appendChild(g); });
  /* translation list folds away behind the current choice */
  const trl = host.querySelector(".trl"); if (trl && !trl.closest("details")) {
    const cur = trl.querySelector('[aria-pressed="true"] span'), d = document.createElement("details"); d.className = "trl-fold";
    d.innerHTML = `<summary><span>${cur ? esc(cur.textContent) : ""}</span><i>▾</i></summary>`; trl.before(d); d.appendChild(trl);
  }
}
const _displaySheetV = displaySheet;
displaySheet = function(){ const r = _displaySheetV(); if (LV.view === "settings" && STV.open === "disp") dsGroup(); return r; };
/* ===== 6. pinch to resize: the text itself gets bigger or smaller and re-flows to the screen (no sideways scrolling) ===== */
const PZ = { on: false, d0: 0, f: 1, anchor: null, ay: 0, raf: 0 };
const tDist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
function pzApply(){
  PZ.raf = 0; const r = document.documentElement.style, f = PZ.f;
  if (LV.view === "read" || LV.view === "page") {
    r.setProperty("--arsize", Math.round(Math.min(80, Math.max(16, settings.size * f))) + "px");
    const uz = settings.uiz && settings.uiz !== "auto" ? +settings.uiz : phoneScale(); r.setProperty("--ts", Math.min(2.2, Math.max(.7, (settings.ts || 1) * f)) * uz);
  } else r.setProperty("--uiz", Math.min(1.9, Math.max(.8, PZ.u0 * f)));
  if (PZ.anchor && PZ.anchor.isConnected) { const dy = PZ.anchor.getBoundingClientRect().top - PZ.ay; if (Math.abs(dy) > 1) scrollBy(0, dy); }
  const tip = $("#pzTip"); if (tip) tip.textContent = Math.round(f * 100) + "%";
}
document.addEventListener("touchstart", e => {
  if (e.touches.length !== 2 || document.querySelector(".sheet.on")) return;
  PZ.on = true; PZ.d0 = tDist(e.touches); PZ.f = 1; PZ.u0 = settings.uiz && settings.uiz !== "auto" ? +settings.uiz : phoneScale();
  const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2, cy = (e.touches[0].clientY + e.touches[1].clientY) / 2, el = document.elementFromPoint(cx, cy);
  PZ.anchor = el && (el.closest(".ayah .w") || el.closest(".ayah") || el); PZ.ay = PZ.anchor ? PZ.anchor.getBoundingClientRect().top : 0;
  if (!$("#pzTip")) document.body.insertAdjacentHTML("beforeend", `<div id="pzTip" class="pz-tip">100%</div>`);
}, { passive: true });
document.addEventListener("touchmove", e => {
  if (!PZ.on || e.touches.length !== 2) return;
  e.preventDefault(); PZ.f = Math.min(2.4, Math.max(.5, tDist(e.touches) / PZ.d0)); if (!PZ.raf) PZ.raf = requestAnimationFrame(pzApply);
}, { passive: false });
function pzEnd(){
  if (!PZ.on) return; PZ.on = false; const t = $("#pzTip"); if (t) t.remove();
  if (Math.abs(PZ.f - 1) < .03) { applySettings(); return; }
  if (LV.view === "read" || LV.view === "page") { settings.size = Math.round(Math.min(80, Math.max(16, settings.size * PZ.f))); settings.ts = Math.round(Math.min(2.2, Math.max(.7, (settings.ts || 1) * PZ.f)) * 20) / 20; }
  else settings.uiz = Math.round(Math.min(1.9, Math.max(.8, PZ.u0 * PZ.f)) * 20) / 20;
  saveSettings();
}
document.addEventListener("touchend", e => { if (e.touches.length < 2) pzEnd(); }, { passive: true });
document.addEventListener("touchcancel", pzEnd, { passive: true });
["gesturestart", "gesturechange"].forEach(ev => document.addEventListener(ev, e => e.preventDefault(), { passive: false }));   // iPhone: no page zoom, our resize instead
/* computer: Ctrl + mouse wheel does the same */
addEventListener("wheel", e => {
  if (!e.ctrlKey) return; e.preventDefault();
  const f = e.deltaY < 0 ? 1.06 : 1 / 1.06;
  if (LV.view === "read" || LV.view === "page") { settings.size = Math.round(Math.min(80, Math.max(16, settings.size * f))); settings.ts = Math.round(Math.min(2.2, Math.max(.7, (settings.ts || 1) * f)) * 100) / 100; }
  else { const u = settings.uiz && settings.uiz !== "auto" ? +settings.uiz : phoneScale(); settings.uiz = Math.round(Math.min(1.9, Math.max(.8, u * f)) * 100) / 100; }
  saveSettings();
}, { passive: false });
