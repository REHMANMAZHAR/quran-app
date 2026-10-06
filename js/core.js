"use strict";
const $ = s => document.querySelector(s);
const UD = "۰۱۲۳۴۵۶۷۸۹";
const ud = n => String(n).replace(/\d/g, d => UD[d]);
const L = {
  ur: {
    title:"QuranToSoul — قرآن لفظ بہ لفظ", menu:"سورتوں کی فہرست", change:"سورت بدلیں", play:"تلاوت سنیں", settings:"ترتیبات",
    loading:"لوڈ ہو رہا ہے…", loadFail:"ڈیٹا لوڈ نہیں ہوا۔ انٹرنیٹ چیک کر کے دوبارہ کھولیں۔",
    wordDetail:"لفظ کی تفصیل", panel:"فہرست اور ترتیبات", tabS:"سورتیں", tabJ:"پارے", tabSet:"ترتیبات",
    search:"سورت تلاش کریں: نام یا نمبر", recitation:"تلاوت", prev:"پچھلی آیت", playPause:"چلائیں / روکیں", next:"اگلی آیت",
    repeat:"آیت دہرائیں", closeP:"تلاوت بند کریں", surahPre:"سورۃ ", trLabel:"ترجمہ:", prevS:"پچھلی سورت", nextS:"اگلی سورت",
    hold:"مکمل تفصیل کے لیے لفظ کو دبائے رکھیں", hearWord:"لفظ سنیں", hearAyah:"یہ آیت سنیں",
    pre:"سابقہ", stem:"اصل لفظ", suf:"لاحقہ", gramH:"گرامر — یہ لفظ کیسے بنا ہے", base:"بنیادی شکل:",
    rootH:"مادہ (جڑ) اور اس کے الفاظ", rootCnt:(w,c)=>`اس مادے سے ${ud(w)} الفاظ، قرآن میں کل ${ud(c)} بار`,
    times:n=>`${ud(n)} بار`, moreW:n=>`+ ${ud(n)} مزید الفاظ`, inQuran:n=>`قرآن میں ${ud(n)} بار`,
    draft:"گرامر نوٹس ابھی مسودہ ہیں — عالم کی نظرِ ثانی باقی ہے۔ مورفالوجی: Quranic Arabic Corpus.",
    thisAyah:" (یہی آیت)", more:n=>`مزید دکھائیں (${ud(n)} باقی)`,
    lang:"زبان", trSel:"آیت کا ترجمہ", trNone:"ترجمہ نہ دکھائیں", wbw:"ہر لفظ کے نیچے معنی", show:"دکھائیں", hide:"چھپائیں",
    glLang:"لفظی معنی کی زبان", urMissing:"اردو لفظی معنی ابھی شامل نہیں — فی الحال انگریزی دکھائی جا رہی ہے۔",
    reciter:"قاری", speed:"تلاوت کی رفتار", slow:"آہستہ", normal:"عام", fast:"تیز", size:"عربی متن کا سائز", tsize:"ترجمہ اور معانی کا سائز",
    theme:"رنگ", auto:"خودکار", light:"روشن", dark:"گہرا", sources:"ذرائع:",
    draftAbout:"گرامر نوٹس مسودہ ہیں — عالم کی نظرِ ثانی کے بعد حتمی ہوں گے۔",
    bism:"بسم اللہ", taud:"تعوذ — أعوذ بالله", ayah:n=>`آیت ${ud(n)}`, done:"سورت مکمل ہوئی", audioFail:"تلاوت لوڈ نہیں ہوئی — انٹرنیٹ چیک کریں",
    rep1:"ہر آیت ایک بار", repN:n=>`ہر آیت ${ud(n)} بار`, repInf:"یہ آیت مسلسل دہرائی جائے گی",
    wordNA:"اس لفظ کی آواز دستیاب نہیں", resume:(n,a)=>`آپ نے یہاں چھوڑا تھا: سورۃ ${n}، آیت ${ud(a)}`,
    listen:a=>`آیت ${ud(a)} سنیں`, ayahs:n=>`${ud(n)} آیات`, num:ud
  },
  en: {
    title:"QuranToSoul — Quran word by word", menu:"Surah list", change:"Change surah", play:"Play recitation", settings:"Settings",
    loading:"Loading…", loadFail:"Couldn't load the data. Check your internet connection and reopen.",
    wordDetail:"Word details", panel:"List and settings", tabS:"Surahs", tabJ:"Juz", tabSet:"Settings",
    search:"Find a surah: name or number", recitation:"Recitation", prev:"Previous ayah", playPause:"Play / pause", next:"Next ayah",
    repeat:"Repeat ayah", closeP:"Close player", surahPre:"", trLabel:"Translation:", prevS:"Previous surah", nextS:"Next surah",
    hold:"Press and hold a word for full details", hearWord:"Hear word", hearAyah:"Hear this ayah",
    pre:"prefix", stem:"stem", suf:"suffix", gramH:"Grammar — how this word is built", base:"Base form:",
    rootH:"Root and its words", rootCnt:(w,c)=>`${w} words from this root, ${c} times in the Quran`,
    times:n=>`${n}×`, moreW:n=>`+ ${n} more words`, inQuran:n=>`appears ${n} times in the Quran`,
    draft:"Grammar notes are a draft pending scholar review. Morphology: Quranic Arabic Corpus.",
    thisAyah:" (this ayah)", more:n=>`Show more (${n} left)`,
    lang:"Language", trSel:"Ayah translation", trNone:"No translation", wbw:"Meaning under each word", show:"Show", hide:"Hide",
    glLang:"Word meaning language", urMissing:"Urdu word meanings aren't added yet — showing English for now.",
    reciter:"Reciter", speed:"Recitation speed", slow:"Slow", normal:"Normal", fast:"Fast", size:"Arabic text size", tsize:"Translation & meaning text size",
    theme:"Theme", auto:"Auto", light:"Light", dark:"Dark", sources:"Sources:",
    draftAbout:"Grammar notes are a draft and will be final after scholar review.",
    bism:"Bismillah", taud:"Ta'awwudh — A'udhu billah", ayah:n=>`Ayah ${n}`, done:"Surah complete", audioFail:"Recitation didn't load — check your internet",
    rep1:"Each ayah once", repN:n=>`Each ayah ${n} times`, repInf:"This ayah will repeat continuously",
    wordNA:"Audio for this word isn't available", resume:(n,a)=>`You stopped here: ${n}, ayah ${a}`,
    listen:a=>`Play ayah ${a}`, ayahs:n=>`${n} ayahs`, num:n=>String(n)
  }
};
const T = (k, ...a) => { const v = (L[settings.lang] || L.ur)[k]; return typeof v === "function" ? v(...a) : v; };
const TRS = [
  ["ur",  "مولانا فتح محمد جالندھری", "Fateh Muhammad Jalandhry (Urdu)"],
  ["ur2", "شیخ الہند محمود الحسن", "Shaykh-ul-Hind Mahmood ul Hassan (Urdu)"],
  ["en2", "Abdullah Yusuf Ali (English)", "Abdullah Yusuf Ali"],
  ["en",  "Marmaduke Pickthall (English)", "Marmaduke Pickthall"]
];
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const store = {
  get(k, d){ try{ const v = localStorage.getItem("q_"+k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem("q_"+k, JSON.stringify(v)); }catch(e){} }
};

/* ---------- data layer: embedded (single file) or fetched (GitHub Pages) ---------- */
const cache = {};
async function gunzip(b64){
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const stream = new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip"));
  return JSON.parse(await new Response(stream).text());
}
function load(key, path){
  if (!cache[key]) {
    cache[key] = (window.EMBED
      ? (key.startsWith("t_") ? gunzip(EMBED.t[key.slice(2)]) : /^s\d+$/.test(key) ? gunzip(EMBED.s[+key.slice(1)]) : EMBED[key] ? gunzip(EMBED[key]) : Promise.reject(new Error(key)))
      : fetch(path).then(r => { if(!r.ok) throw new Error(path); return r.json(); })
    ).catch(e => { delete cache[key]; throw e; });
  }
  return cache[key];
}
const DV = "5";  // bump whenever data/ changes, so phones fetch fresh files instead of old cached ones
const DATA = {
  meta: () => load("meta", `data/meta.json?v=${DV}`),
  occ:  () => load("occ", `data/occ.json?v=${DV}`),
  surah: n => load("s"+n, `data/s/${String(n).padStart(3,"0")}.json?v=${DV}`),
  timing: rec => load("t_"+rec, `data/timing/${rec}.json?v=${DV}`)
};

/* ---------- state ---------- */
let META, CUR = null;
const settings = Object.assign({ script:"uth", lang:null, tr:null, wbw:true, gl:null, size:30, ts:1, theme:"auto", rec:"Alafasy_128kbps", speed:1, taf:"ur", tafMark:true }, store.get("settings", {}));
if (settings.gl === "auto") settings.gl = "ur";
function saveSettings(){ store.set("settings", settings); applySettings(); }
function applyLang(){
  const ur = settings.lang !== "en";
  document.documentElement.lang = ur ? "ur" : "en";
  document.documentElement.dir = ur ? "rtl" : "ltr";
  document.title = T("title");
  const lab = { btnMenu:"menu", btnTitle:"change", btnPlay:"play", btnSettings:"settings", sheet:"wordDetail", drawer:"panel",
                player:"recitation", pPrev:"prev", pPlay:"playPause", pNext:"next", pRep:"repeat", pClose:"closeP" };
  for (const id in lab) document.getElementById(id).setAttribute("aria-label", T(lab[id]));
  document.querySelector('[data-tab="surahs"]').textContent = T("tabS");
  document.querySelector('[data-tab="juz"]').textContent = T("tabJ");
  document.querySelector('[data-tab="settings"]').textContent = T("tabSet");
  $("#search").placeholder = T("search"); $("#search").setAttribute("aria-label", T("search"));
  const A = "M6 6v12l8.5-6zM16 6h2v12h-2z", B = "M18 6v12l-8.5-6zM6 6h2v12H6z";
  $("#pPrev").innerHTML = `<svg viewBox="0 0 24 24"><path d="${ur ? A : B}"/></svg><span class="cap" data-cap="capPrev"></span>`;
  $("#pNext").innerHTML = `<svg viewBox="0 0 24 24"><path d="${ur ? B : A}"/></svg><span class="cap" data-cap="capNext"></span>`;
  if (typeof fillCaps === "function") fillCaps();
  labelTabs();
  if (typeof LV !== "undefined" && LV.view !== "read") showView(LV.view);
}
function applySettings(){
  document.documentElement.style.setProperty("--arsize", settings.size + "px");
  document.documentElement.style.setProperty("--ts", settings.ts || 1);
  document.body.classList.toggle("nowbw", !settings.wbw);
  if (settings.theme === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", settings.theme);
}
const hasUrWbw = () => !!(META && META.sources.wbw_ur);
const glossOf = w => (settings.gl === "ur" && w[3]) ? {t:w[3], ur:true} : {t:w[1], ur:false};

/* ---------- reader ---------- */
async function openSurah(n, ayah = 1, word = null){
  closeAll();
  if (LV.view !== "read") showView("read");
  if (P.s && P.s !== n) stopPlayer();
  const S = META.surahs[n-1];
  $("#tAr").textContent = T("surahPre") + S.ar;
  $("#tEn").textContent = `${S.n}. ${S.tr} · ${S.en}`;
  if (!CUR || CUR.n !== n) $("#main").innerHTML = `<div class="loading">${T("loading")}</div>`;
  let d;
  try { d = await DATA.surah(n); }
  catch(e){ $("#main").innerHTML = `<div class="loading">${T("loadFail")}</div>`; return; }
  if (settings.script === "ip" && !IPK) { try { IPK = await DATA.indopak(); } catch(e){} }
  if (!CUR || CUR.n !== n) { CUR = d; render(); }
  const el = document.getElementById("a" + ayah);
  document.querySelectorAll(".w.hit").forEach(x => x.classList.remove("hit"));
  if (el) {
    let target = el;
    if (word != null) {
      const w = el.querySelector(`.w[data-i="${word-1}"]`);
      if (w) { w.classList.add("hit"); target = w; }
    }
    requestAnimationFrame(() => target.scrollIntoView({block: word != null ? "center" : "start"}));
  }
  store.set("last", {s:n, a:ayah});
}

function render(){
  const n = CUR.n, S = META.surahs[n-1];
  const trKey = settings.tr;
  let h = "";
  h += surahTools(n) + lecStrip(n);
  if (n !== 1 && n !== 9) h += '<div class="bism">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
  CUR.ayahs.forEach((A, ai) => {
    const a = ai + 1;
    if (typeof tafMark === "function") h += tafMark(n, a);
    h += `<article class="ayah${ayahCls(n, a)}" id="a${a}" data-a="${a}"><div class="words">`;
    A.w.forEach((w, i) => {
      const g = glossOf(w), last = i === A.w.length - 1;
      const wh = `<span class="w" data-a="${a}" data-i="${i}" tabindex="0"><span class="ar">${esc(wordText(n, a, i, w[0]))}</span><span class="g${g.ur?" ur":""}" dir="${g.ur?"rtl":"ltr"}">${esc(g.t)}</span></span>`;
      h += last ? `<span class="last">${wh}<span class="end" data-play="${a}" role="button" tabindex="0" aria-label="${T("listen", a)}">${ud(a)}</span>${typeof tafIcon === "function" ? tafIcon(n, a) : ""}</span>` : wh;
    });
    h += `</div>`;
    const tx = A[trKey] || (trKey === "en2" ? A.en : "");
    if (trKey !== "none" && tx) h += `<p class="tr ${trKey.startsWith("en")?"en":"ur"}">${esc(tx)}</p>`;
    h += `</article>`;
  });
  const src = META.sources;
  const trName = {ur:src.ur1, ur2:src.ur2, en:src.en, en2:src.en2}[trKey] || "—";
  h += `<div class="surah-foot">${T("trLabel")} ${esc(trName)}
        <div class="nav">${n>1?`<button data-go="${n-1}">${T("prevS")}</button>`:"<span></span>"}${n<114?`<button data-go="${n+1}">${T("nextS")}</button>`:""}</div></div>`;
  $("#main").innerHTML = h;
  P.liveKey = null;
  if (P.s === n) markAyah();
  observeAyahs();
}

/* resume: remember the ayah at the top of the screen */
let io, saveT;
function observeAyahs(){
  if (io) io.disconnect();
  io = new IntersectionObserver(entries => {
    const vis = entries.filter(e => e.isIntersecting).map(e => +e.target.dataset.a);
    if (!vis.length || !CUR) return;
    clearTimeout(saveT);
    const n = CUR.n, a = Math.min(...vis);
    saveT = setTimeout(() => store.set("last", {s:n, a}), 400);
  }, {rootMargin:"-70px 0px -60% 0px"});
  document.querySelectorAll(".ayah").forEach(el => io.observe(el));
}

/* ---------- press & hold ---------- */
let pressT = null, pressEl = null, sx = 0, sy = 0, longFired = false;
const main = $("#main");
main.addEventListener("pointerdown", e => {
  const w = e.target.closest(".w"); if (!w) return;
  pressEl = w; sx = e.clientX; sy = e.clientY; longFired = false;
  w.classList.add("press");
  pressT = setTimeout(() => { longFired = true; w.classList.remove("press"); if (navigator.vibrate) navigator.vibrate(12); openWord(+w.dataset.a, +w.dataset.i); }, 450);
});
const cancelPress = () => { clearTimeout(pressT); if (pressEl) pressEl.classList.remove("press"); pressEl = null; };
main.addEventListener("pointermove", e => { if (pressEl && Math.hypot(e.clientX-sx, e.clientY-sy) > 10) cancelPress(); });
main.addEventListener("pointercancel", cancelPress);
main.addEventListener("pointerup", e => {
  const w = pressEl; cancelPress();
  if (w && !longFired) quickMeaning(+w.dataset.a, +w.dataset.i);
});
main.addEventListener("contextmenu", e => { if (e.target.closest(".w")) e.preventDefault(); });
main.addEventListener("keydown", e => { const w = e.target.closest(".w"); if (w && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openWord(+w.dataset.a, +w.dataset.i); } });
main.addEventListener("click", e => {
  const b = e.target.closest("[data-go]"); if (b) { openSurah(+b.dataset.go); return; }
  const pl = e.target.closest("[data-play]"); if (pl) openAyahMenu(CUR.n, +pl.dataset.play);
});

let toastT;
function toast(html, ms = 2600){ const t = $("#toast"); t.innerHTML = html; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), ms); }
function quickMeaning(a, i){
  if (document.body.classList.contains("hifz")) { const el = document.querySelector(`#a${a} .w[data-i="${i}"]`); if (el) el.classList.toggle("shown"); return; }
  const w = CUR.ayahs[a-1].w[i], g = glossOf(w);
  toast(`<span class="tar">${esc(w[0])}</span><span dir="${g.ur?"rtl":"ltr"}">${esc(g.t)}</span><br><small>${T("hold")}</small>`);
}

/* ---------- word sheet ---------- */
const spaced = r => [...r].join(" ");
function segHTML(segs){ return segs.map(s => `<span class="seg-${s[3]}">${esc(s[0])}</span>`).join(""); }

function openWord(a, i){
  const n = CUR.n, w = CUR.ayahs[a-1].w[i];
  const [ar, en, tl, ur, segs, stem] = w;
  const hasP = segs.some(s => s[3]==="p"), hasS = segs.some(s => s[3]==="s");
  let h = `<div class="wd-head"><div class="wd-word">${segHTML(segs)}</div>`;
  if (ur) h += `<div class="wd-mean">${esc(ur)}</div><div class="wd-sub">${esc(en)}</div>`;
  else h += `<div class="wd-mean en">${esc(en)}</div>`;
  h += `<div class="wd-sub">${esc(tl)} · ${n}:${a}:${i+1}</div>`;
  h += `<div class="wd-actions"><button data-wordaudio="${n}:${a}:${i+1}">${T("hearWord")}</button><button data-ayahaudio="${n}:${a}">${T("hearAyah")}</button>${typeof israrButtons === "function" ? israrButtons(n, a) : ""}</div>`;
  if (segs.length > 1) h += `<div class="legend">${hasP?`<span><i style="background:var(--sage)"></i>${T("pre")}</span>`:""}<span><i style="background:var(--ink)"></i>${T("stem")}</span>${hasS?`<span><i style="background:var(--saffron)"></i>${T("suf")}</span>`:""}</div>`;
  h += `</div>`;

  h += `<h3>${T("gramH")}</h3>`;
  const G = (settings.lang === "en" && META.grammar_en) || META.grammar;
  segs.forEach((s, j) => {
    const [title, lines] = G[s[1]];
    const L = s[2] >= 0 ? META.lemmas[s[2]] : null;
    h += `<div class="seg-row"><div class="sar seg-${s[3]}">${esc(s[0])}</div><div><b>${esc(title)}</b>`;
    if (lines.length) h += `<ul>${lines.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    h += partMeaningHTML(segs, j);
    if (L && s[3] === "" && L[2] >= 0) h += `<div class="lem">${T("base")} <span>${esc(L[0])}</span></div>`;
    h += `</div></div>`;
  });

  const L = stem >= 0 ? META.lemmas[stem] : null;
  if (L && L[2] >= 0) {
    const R = META.roots[L[2]];
    h += `<h3>${T("rootH")}</h3>
      <div class="root"><span class="letters">${esc(spaced(R[0]))}</span><span class="cnt">${T("rootCnt", R[2].length, R[1])}</span></div>
      <ul class="lemlist">${R[2].slice(0, 14).map(li => { const X = META.lemmas[li];
        return `<li><button data-lem="${li}" aria-pressed="${li===stem}"><span class="la">${esc(X[0])}</span><span class="lg">${esc(X[4])}</span><span class="lc">${T("times", X[3])}</span></button></li>`; }).join("")}</ul>`;
    if (R[2].length > 14) h += `<div class="cnt" style="color:var(--muted);font-size:13px">${T("moreW", R[2].length-14)}</div>`;
  }
  h += senseHTML(stem, w) + irabHTML(n, a, i, segs);
  if (L) h += `<h3 id="occH">«<span style="font-family:var(--ar);font-size:22px">${esc(L[0])}</span>» ${T("inQuran", L[3])}</h3><ul class="occ" id="occList"></ul><div id="occMore"></div>`;
  h += reviewHTML(n, a, i);

  $("#sheetBody").innerHTML = h;
  openSheet();
  if (L) showOcc(stem, `${n}:${a}:${i+1}`);
}

let occState = null;
async function showOcc(li, current){
  const occ = await DATA.occ();
  occState = { list: occ[li] || [], shown: 0, current, li };
  const L = META.lemmas[li];
  const hh = $("#occH"); if (hh) hh.innerHTML = `«<span style="font-family:var(--ar);font-size:22px">${esc(L[0])}</span>» ${T("inQuran", L[3])}`;
  $("#occList").innerHTML = "";
  await moreOcc();
}
async function moreOcc(){
  const st = occState, batch = st.list.slice(st.shown, st.shown + 12);
  st.shown += batch.length;
  const items = await Promise.all(batch.map(async loc => {
    const [s, a, w] = loc.split(":").map(Number);
    const d = await DATA.surah(s), A = d.ayahs[a-1];
    const text = A.w.map((x, k) => k === w-1 ? `<mark>${esc(x[0])}</mark>` : esc(x[0])).join(" ");
    return `<li><button data-loc="${loc}"><div class="oa">${text}</div><div class="or">${T("surahPre")}${esc(META.surahs[s-1].ar)} — ${T("num", s)}:${T("num", a)}${loc===st.current?T("thisAyah"):""}</div></button></li>`;
  }));
  $("#occList").insertAdjacentHTML("beforeend", items.join(""));
  $("#occMore").innerHTML = st.shown < st.list.length ? `<button class="more" id="btnMore">${T("more", st.list.length - st.shown)}</button>` : "";
}
$("#sheetBody").addEventListener("click", e => {
  const wa = e.target.closest("[data-wordaudio]");
  if (wa) { playWord(...wa.dataset.wordaudio.split(":").map(Number)); return; }
  const aa = e.target.closest("[data-ayahaudio]");
  if (aa) { const [s,a] = aa.dataset.ayahaudio.split(":").map(Number); closeAll(); playFrom(s, a); return; }
  const lb = e.target.closest("[data-lem]");
  if (lb) { document.querySelectorAll("[data-lem]").forEach(b => b.setAttribute("aria-pressed", b===lb)); showOcc(+lb.dataset.lem, occState && occState.current); document.getElementById("occH").scrollIntoView({behavior:"smooth", block:"start"}); return; }
  const ob = e.target.closest("[data-loc]");
  if (ob) { const [s,a,w] = ob.dataset.loc.split(":").map(Number); openSurah(s, a, w); return; }
  if (e.target.closest("#btnMore")) moreOcc();
});

/* ---------- sheet / drawer plumbing ---------- */
function openSheet(){ $("#sheet").scrollTop = 0; $("#sheet").classList.add("on"); $("#scrim").classList.add("on"); }
function closeAll(){ ["#sheet","#drawer","#scrim"].forEach(s => $(s).classList.remove("on")); }
$("#scrim").addEventListener("click", closeAll);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
let sy0 = null;
$("#sheet").addEventListener("touchstart", e => { sy0 = $("#sheet").scrollTop <= 0 ? e.touches[0].clientY : null; }, {passive:true});
$("#sheet").addEventListener("touchend", e => { if (sy0 != null && e.changedTouches[0].clientY - sy0 > 90) closeAll(); sy0 = null; });

let tab = "surahs";
function openDrawer(t){ tab = t; drawDrawer(); $("#drawer").classList.add("on"); $("#scrim").classList.add("on"); }
$("#btnMenu").onclick = () => openDrawer("surahs");
$("#btnTitle").onclick = () => openDrawer("surahs");
$("#btnSettings").onclick = () => openDrawer("settings");
document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => { tab = b.dataset.tab; drawDrawer(); });
$("#search").addEventListener("input", drawDrawer);

function drawDrawer(){
  document.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === tab));
  $("#search").style.display = tab === "surahs" ? "" : "none";
  const body = $("#drBody");
  if (tab === "surahs") {
    const q = $("#search").value.trim().toLowerCase();
    const list = META.surahs.filter(S => !q || String(S.n) === q || S.tr.toLowerCase().replace(/[-']/g,"").includes(q.replace(/[-' ]/g,"")) || S.en.toLowerCase().includes(q) || S.ar.includes(q));
    body.innerHTML = `<ul class="sl">${list.map(S => `<li><button data-s="${S.n}" aria-current="${CUR && CUR.n===S.n}"><span class="num">${T("num", S.n)}</span><span class="nm">${esc(S.tr)}<small>${esc(S.en)} · ${S.ayahs} ayahs</small></span><span class="na">${esc(S.ar)}</span></button></li>`).join("")}</ul>`;
  } else if (tab === "juz") {
    body.innerHTML = `<div class="juz">${META.juz.map((j, k) => `<button data-s="${j[0]}" data-a="${j[1]}">${T("num", k+1)}</button>`).join("")}</div>`;
  } else {
    const opt = (v, l) => `<option value="${v}"${settings.tr===v?" selected":""}>${esc(l)}</option>`;
    const li = settings.lang === "en" ? 2 : 1;
    const pr = (k, v, l) => `<button data-set="${k}" data-v="${v}" aria-pressed="${settings[k]===v}">${l}</button>`;
    body.innerHTML = `<div class="set">
      <span class="lbl">${T("lang")}</span>
      <div class="seg3">${pr("lang","ur","اردو")}${pr("lang","en","English")}</div>
      <label for="selTr">${T("trSel")}</label>
      <select id="selTr">${TRS.map(x => opt(x[0], x[li])).join("")}${opt("none", T("trNone"))}</select>
      <span class="lbl">${T("wbw")}</span>
      <div class="seg3">${pr("wbw", true, T("show"))}${pr("wbw", false, T("hide"))}</div>
      <span class="lbl">${T("glLang")}</span>
      <div class="seg3">${pr("gl","ur","اردو")}${pr("gl","en","English")}</div>
      ${hasUrWbw() || settings.gl !== "ur" ? "" : `<div style="font-size:12px;color:var(--muted)">${T("urMissing")}</div>`}
      <label for="selRec">${T("reciter")}</label>
      <select id="selRec">${META.reciters.map(r => `<option value="${r[0]}"${settings.rec===r[0]?" selected":""}>${esc(settings.lang === "en" ? r[2] : r[1])}</option>`).join("")}</select>
      <span class="lbl">${T("speed")}</span>
      <div class="seg3">${pr("speed",0.75,T("slow"))}${pr("speed",1,T("normal"))}${pr("speed",1.25,T("fast"))}</div>
      <label for="rngSize">${T("size")}</label>
      <input id="rngSize" type="range" min="22" max="44" step="1" value="${settings.size}">
      <label for="rngTs">${T("tsize")} <b id="tsVal">${nf(Math.round((settings.ts || 1) * 100))}%</b></label>
      <input id="rngTs" type="range" min="0.8" max="1.7" step="0.05" value="${settings.ts || 1}">
      <span class="lbl">${T("theme")}</span>
      <div class="seg3">${pr("theme","auto",T("auto"))}${pr("theme","light",T("light"))}${pr("theme","dark",T("dark"))}</div>
      <div class="about">${T("sources")}
        <div class="en">Grammar data: ${esc(META.sources.morphology)}. ${esc(META.sources.audio)}. Word-by-word: ${esc(META.sources.wbw_en)}${META.sources.wbw_ur?"; "+esc(META.sources.wbw_ur):""}. Translations: ${esc(META.sources.ur1)}, ${esc(META.sources.ur2)}, ${esc(META.sources.en2)}, ${esc(META.sources.en)}.</div>
        ${T("draftAbout")}</div>
    </div>`;
    $("#selTr").onchange = e => { settings.tr = e.target.value; saveSettings(); rerender(); };
    $("#rngSize").oninput = e => { settings.size = +e.target.value; saveSettings(); };
    $("#rngTs").oninput = e => { settings.ts = +e.target.value; $("#tsVal").textContent = nf(Math.round(settings.ts * 100)) + "%"; saveSettings(); };
    $("#selRec").onchange = e => { settings.rec = e.target.value; saveSettings(); if (P.s) playFrom(P.s, P.a, true); };
  }
}
$("#drBody").addEventListener("click", e => {
  const s = e.target.closest("[data-s]");
  if (s) { openSurah(+s.dataset.s, +(s.dataset.a || 1)); return; }
  const b = e.target.closest("[data-set]");
  if (b) { let v = b.dataset.v; if (v === "true") v = true; else if (v === "false") v = false; else if (v !== "" && !isNaN(+v)) v = +v; settings[b.dataset.set] = v; P.audio.playbackRate = settings.speed;
    if (b.dataset.set === "lang") { applyLang(); if (P.s) updateBar(); if (CUR) $("#tAr").textContent = T("surahPre") + META.surahs[CUR.n-1].ar; }
    saveSettings(); drawDrawer(); if (b.dataset.set === "gl" || b.dataset.set === "lang") rerender(); }
});
function rerender(){ if (!CUR) return; const last = store.get("last", {s:CUR.n, a:1}); render(); const el = document.getElementById("a"+last.a); if (el) el.scrollIntoView({block:"start"}); }

/* ---------- recitation player ---------- */
// Ayah audio: everyayah.com. Word timings: quran-align (CC-BY 4.0). Word audio: Quran.com CDN.
const AUDIO = "https://everyayah.com/data/";
const WBW_AUDIO = "https://audio.qurancdn.com/wbw/";
const p3 = n => String(n).padStart(3, "0");
const P = { audio: new Audio(), pre: new Audio(), s: 0, a: 0, bism: false, rep: 1, count: 0, T: null, liveKey: null, raf: 0, userScroll: 0 };
P.audio.preload = "auto"; P.pre.preload = "auto";
const REPS = [1, 3, 5, 0];
const recName = () => META.reciters.find(x => x[0] === settings.rec) || META.reciters[0];
const ICON_PLAY = '<path d="M8 5.5v13l11-6.5z"/>', ICON_PAUSE = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';

async function playFrom(s, a, noTaud){
  if (!META.reciters.some(r => r[0] === settings.rec)) settings.rec = META.reciters[0][0];
  if (!CUR || CUR.n !== s) await openSurah(s, a);
  P.s = s; P.a = a; P.count = 0; P.T = null;
  document.body.classList.add("playing");
  $("#player").classList.add("on");
  P.bism = (a === 1 && s !== 1 && s !== 9);
  /* Etiquette of recitation: begin with the ta'awwudh (أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ) whenever recitation starts,
     then the basmalah at the start of every surah except At-Tawbah (Al-Fatiha's first ayah is the basmalah itself). */
  P.taud = !noTaud; P.taudAlt = false;
  startAudio();  // start audio immediately, inside the tap, so phones allow it
  const rec = settings.rec;
  DATA.timing(rec).then(T => { if (settings.rec === rec) P.T = T; }).catch(() => {});
}
function startAudio(){
  const s = P.s, a = P.a;
  P.audio.src = P.taud ? `${AUDIO}${P.taudAlt ? "Alafasy_128kbps" : settings.rec}/audhubillah.mp3` : P.bism ? `${AUDIO}${settings.rec}/001001.mp3` : `${AUDIO}${settings.rec}/${p3(s)}${p3(a)}.mp3`;
  P.audio.playbackRate = settings.speed;
  P.audio.play().catch(() => {});
  if (!P.bism && !P.taud && a < CUR.ayahs.length) P.pre.src = `${AUDIO}${settings.rec}/${p3(s)}${p3(a+1)}.mp3`;
  P.liveKey = null;
  updateBar();
  markAyah();
}
function updateBar(){
  const S = META.surahs[P.s-1], r = recName();
  $("#pTitle").textContent = `${settings.lang === "en" ? S.tr : S.ar} · ${P.taud ? T("taud") : P.bism ? T("bism") : T("ayah", P.a)}`;
  $("#pRec").textContent = settings.lang === "en" ? r[2] : r[1];
  $("#pRep").innerHTML = `<b>${P.rep ? "×" + T("num", P.rep) : "∞"}</b><span class="cap">${T("capRep")}</span>`;
  $("#pRep").setAttribute("aria-pressed", P.rep !== 1);
  if ("mediaSession" in navigator && window.MediaMetadata) {
    navigator.mediaSession.metadata = new MediaMetadata({ title: `${S.tr} ${P.s}:${P.a}`, artist: r[2], album: "Quran" });
  }
}
function markAyah(){
  document.querySelectorAll(".ayah.playing").forEach(x => x.classList.remove("playing"));
  const el = document.getElementById("a" + P.a);
  if (!el || P.bism || P.taud) return;
  el.classList.add("playing");
  if (Date.now() - P.userScroll > 4000) {
    const r = el.getBoundingClientRect();
    if (r.top < 70 || r.top > innerHeight * 0.55) el.scrollIntoView({ block: "start", behavior: "smooth" });
  }
}
function setLive(w0, w1){
  const key = w0 + ":" + w1 + ":" + P.a;
  if (key === P.liveKey) return;
  P.liveKey = key;
  document.querySelectorAll(".w.live").forEach(x => x.classList.remove("live"));
  if (w0 < 0) return;
  const el = document.getElementById("a" + P.a); if (!el) return;
  for (let i = w0; i < w1; i++) { const w = el.querySelector(`.w[data-i="${i}"]`); if (w) w.classList.add("live"); }
  const first = el.querySelector(`.w[data-i="${w0}"]`);
  if (first && Date.now() - P.userScroll > 4000) {
    const r = first.getBoundingClientRect();
    if (r.bottom > innerHeight - 90 || r.top < 70) first.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}
function tick(){
  P.raf = 0;
  if (P.audio.paused) return;
  if (!P.bism && !P.taud && P.T && P.T[P.s-1]) {
    const seg = P.T[P.s-1][P.a-1] || [], t = P.audio.currentTime * 1000;
    let hit = -1;
    for (let k = 0; k < seg.length; k += 4) { if (t >= seg[k+2]) hit = k; else break; }
    if (hit >= 0) setLive(seg[hit], seg[hit+1]); else setLive(-1, -1);
  }
  P.raf = requestAnimationFrame(tick);
}
P.audio.addEventListener("play", () => { $("#pIcon").innerHTML = ICON_PAUSE; if (!P.raf) P.raf = requestAnimationFrame(tick); });
P.audio.addEventListener("pause", () => { $("#pIcon").innerHTML = ICON_PLAY; });
P.audio.addEventListener("ended", () => {
  if (P.taud) { P.taud = false; startAudio(); return; }
  if (P.bism) { P.bism = false; startAudio(); return; }
  P.count++;
  if (P.rep === 0 || P.count < P.rep) { startAudio(); return; }
  P.count = 0;
  if (P.loop && P.loop.s === P.s && P.loop.b != null && P.a >= P.loop.b) { P.a = P.loop.a; startAudio(); return; }
  if (typeof sleepAtEnd === "function" && sleepAtEnd()) return;
  if (P.a < CUR.ayahs.length) { P.a++; startAudio(); }
  else { setLive(-1, -1); $("#pIcon").innerHTML = ICON_PLAY; toast(T("done")); }
});
P.audio.addEventListener("error", () => {
  if (P.taud) { if (!P.taudAlt && settings.rec !== "Alafasy_128kbps") { P.taudAlt = true; } else { P.taud = false; } startAudio(); return; }  // reciter has no ta'awwudh file: use Alafasy's, else go on
  if (P.s && P.audio.getAttribute("src")) toast(T("audioFail"));
});
function stopPlayer(){
  P.audio.pause(); P.audio.removeAttribute("src"); P.s = 0;
  document.body.classList.remove("playing"); $("#player").classList.remove("on");
  document.querySelectorAll(".ayah.playing").forEach(x => x.classList.remove("playing"));
  setLive(-1, -1);
}
function step(d){
  if (!P.s) return;
  P.a = Math.min(Math.max(1, P.a + d), CUR.ayahs.length);
  P.bism = false; P.count = 0; startAudio();
}
$("#pPlay").onclick = () => { if (P.audio.paused) P.audio.play().catch(() => {}); else P.audio.pause(); };
$("#pNext").onclick = () => step(1);
$("#pPrev").onclick = () => step(-1);
$("#pClose").onclick = stopPlayer;
$("#pRep").onclick = () => {
  P.rep = REPS[(REPS.indexOf(P.rep) + 1) % REPS.length]; P.count = 0; updateBar();
  toast(P.rep === 1 ? T("rep1") : P.rep ? T("repN", P.rep) : T("repInf"));
};
$("#btnPlay").onclick = () => {
  if (P.s) { $("#pPlay").click(); return; }
  if (!CUR) return;
  const last = store.get("last", { s: CUR.n, a: 1 });
  playFrom(CUR.n, last.s === CUR.n ? last.a : 1);
};
["wheel", "touchmove"].forEach(ev => addEventListener(ev, () => { P.userScroll = Date.now(); }, { passive: true }));
if ("mediaSession" in navigator) {
  try {
    navigator.mediaSession.setActionHandler("play", () => P.audio.play());
    navigator.mediaSession.setActionHandler("pause", () => P.audio.pause());
    navigator.mediaSession.setActionHandler("nexttrack", () => step(1));
    navigator.mediaSession.setActionHandler("previoustrack", () => step(-1));
  } catch(e) {}
}
function playWord(s, a, w){
  new Audio(`${WBW_AUDIO}${p3(s)}_${p3(a)}_${p3(w)}.mp3`).play().catch(() => toast(T("wordNA")));
}

function pickLanguage(){
  return new Promise(res => {
    const d = document.createElement("div");
    d.className = "langpick";
    d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Choose language / زبان منتخب کریں");
    d.innerHTML = `<div class="box"><svg style="width:96px;height:96px" viewBox="0 0 200 200" aria-hidden="true"><polygon points="100.0,8.0 126.8,35.3 165.1,34.9 164.7,73.2 192.0,100.0 164.7,126.8 165.1,165.1 126.8,164.7 100.0,192.0 73.2,164.7 34.9,165.1 35.3,126.8 8.0,100.0 35.3,73.2 34.9,34.9 73.2,35.3" fill="#1F3B40" stroke="#D4AF5A" stroke-width="5" stroke-linejoin="round"/>
<circle cx="100" cy="100" r="56" fill="none" stroke="#D4AF5A" stroke-width="2" opacity=".7"/>
<path d="M100 66 C106 75 110.5 81 110.5 87.5 A10.5 10.5 0 0 1 89.5 87.5 C89.5 81 94 75 100 66 Z" fill="#F0D79A"/>
<path d="M98 140 Q80 128 60 132 L60 106 Q80 102 98 114 Z" fill="#F3EDE0"/><path d="M102 140 Q120 128 140 132 L140 106 Q120 102 102 114 Z" fill="#F3EDE0"/>
<path d="M100 116 L100 142" stroke="#D4AF5A" stroke-width="3" stroke-linecap="round"/></svg><div class="mark" style="font-family:var(--en);font-size:30px;line-height:1.4;color:var(--ink)">Quran<span style="color:var(--gold)">To</span>Soul</div><p>Choose your language<br><span lang="ur" style="font-family:var(--ur);line-height:2.2">اپنی زبان منتخب کریں</span></p>
      <button class="ur" data-l="ur" lang="ur">اردو</button><button class="en" data-l="en" lang="en">English</button></div>`;
    d.addEventListener("click", e => { const b = e.target.closest("[data-l]"); if (b) { d.remove(); res(b.dataset.l); } });
    document.body.appendChild(d);
    d.querySelector("button").focus();
  });
}

