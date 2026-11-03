"use strict";
/* ---------- v52: marks in the page margin · pinned surah/para header · para starts a new page · quiet auto-scroll · richer word details ---------- */

/* ===== 1. ع ruku and الربع / النصف / الثلاثة in the side margins (rows are never broken by them) ===== */
const GM = { dirty: new Set(), raf: 0 };
function gmPlace(ck){
  const cr = ck.getBoundingClientRect(); if (!cr.height) return;
  ck.querySelectorAll(":scope > .g-mk").forEach(el => {
    const a = el._anc; if (!a || !a.isConnected) return;
    const r = a.getBoundingClientRect(); if (!r.height) return;
    el.style.top = Math.max(0, Math.round(r.top - cr.top + (r.height - el.offsetHeight) / 2)) + "px";
  });
}
function gmFlush(){ GM.raf = 0; GM.dirty.forEach(ck => { if (ck.isConnected) gmPlace(ck); }); GM.dirty.clear(); }
function gmCollect(){
  document.querySelectorAll("#main .rk:not(.g-mk), #main .qm:not(.g-mk)").forEach(el => {
    const ck = el.closest(".ck"); if (!ck) return;
    el._anc = el.closest(".last") || el.closest(".w") || (el.parentElement && el.parentElement.querySelector(".w")) || el.parentElement;
    el.classList.add("g-mk"); ck.appendChild(el); GM.dirty.add(ck);
  });
  if (GM.dirty.size && !GM.raf) GM.raf = requestAnimationFrame(gmFlush);
}
let gmT = 0;
new MutationObserver(() => { if (!gmT) gmT = requestAnimationFrame(() => { gmT = 0; gmCollect(); }); }).observe($("#main"), { childList: true, subtree: true });
const gmRO = "ResizeObserver" in window ? new ResizeObserver(ents => { ents.forEach(e => GM.dirty.add(e.target)); if (!GM.raf) GM.raf = requestAnimationFrame(gmFlush); }) : null;
new MutationObserver(() => { if (gmRO) document.querySelectorAll("#main .ck:not([data-gro])").forEach(c => { c.dataset.gro = 1; gmRO.observe(c); }); }).observe($("#main"), { childList: true });
document.fonts && document.fonts.ready.then(() => document.querySelectorAll("#main .ck").forEach(c => GM.dirty.add(c)) || gmFlush());

/* ===== 2. Pinned header: surah and para (with its name) always on top, updated as you scroll; auto-scroll dot ===== */
Object.assign(L.ur, { rhAS:"خودکار اسکرول", rhAsk:"خودکار؟", rhPara:n=>`پارہ ${ud(n)}` });
Object.assign(L.en, { rhAS:"Auto-scroll", rhAsk:"Auto?", rhPara:n=>`Para ${n}` });
document.body.insertAdjacentHTML("beforeend", `<div id="rdHead" role="navigation">
  <button class="rh-s" data-rh="s"><b></b><small></small></button>
  <span class="rh-as" id="rhAS"><button data-ras="slow" aria-label="−">−</button><button class="rh-dot" data-ras="toggle" aria-label=""></button><button data-ras="fast" aria-label="+">+</button><i class="rh-lv"></i><em class="rh-ask"></em></span>
  <button class="rh-p" data-rh="p"><small></small><b></b></button></div>`);
const RH = { s: 0, j: 0 };
function rhSet(){
  const bar = $(".bar"); if (bar) document.documentElement.style.setProperty("--barh", bar.offsetHeight + "px");
}
addEventListener("resize", rhSet); setTimeout(rhSet, 500);
function rhUpdate(force){
  if (LV.view !== "read" || !CUR || typeof META === "undefined" || !META) return;
  const ay = topAyah(), blk = ay && ay.closest(".sblk"), s = blk ? +blk.dataset.s : CUR.n, a = ay ? +ay.dataset.a : 1, j = paraOf(s, a);
  if (!force && s === RH.s && j === RH.j) return; RH.s = s; RH.j = j;
  const S = META.surahs[s - 1];
  $("#rdHead .rh-s b").textContent = S.ar; $("#rdHead .rh-s small").textContent = nf(s);
  $("#rdHead .rh-p small").textContent = T("rhPara", nf(j)); $("#rdHead .rh-p b").textContent = JZN[j - 1];
}
function rhAS(){
  const box = $("#rhAS"); if (!box) return;
  const on = typeof AS !== "undefined" && AS.on && AS.run;
  box.classList.toggle("run", on);
  box.querySelector(".rh-dot").innerHTML = on ? `<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" style="fill:currentColor;stroke:none"/></svg>`;
  box.querySelector(".rh-dot").setAttribute("aria-label", T("rhAS"));
  box.querySelector(".rh-lv").textContent = typeof AS !== "undefined" && AS.on ? nf(AS.lv + 1) : "";
}
let rhOpenT = 0;
function rhOpen(){ const b = $("#rhAS"); b.classList.add("open"); clearTimeout(rhOpenT); rhOpenT = setTimeout(() => b.classList.remove("open"), 3500); }
/* the old floating speed bar is replaced by the dot in the header */
asBar = function(){ const b = document.getElementById("asBar"); if (b) b.remove(); rhAS(); };
$("#rdHead").addEventListener("click", e => {
  const h = e.target.closest("[data-rh]"); if (h) { openPicker(h.dataset.rh); return; }
  const b = e.target.closest("[data-ras]"); if (!b) return; e.stopPropagation();
  const v = b.dataset.ras;
  if (v === "toggle") { if (!AS.on) asStart(); else { AS.run = !AS.run; AS.last = 0; } rhOpen(); $("#rhAS").classList.remove("hint"); }
  else { AS.lv = Math.max(0, Math.min(AS_SPEEDS.length - 1, AS.lv + (v === "fast" ? 1 : -1))); settings.asLv = AS.lv; saveSettings(); rhOpen(); }
  rhAS();
});
addEventListener("scroll", () => { if (LV.view === "read") requestAnimationFrame(() => rhUpdate()); }, { passive: true });
const _showView52 = showView;
showView = function(v){ _showView52(v); if (v === "read") { rhSet(); requestAnimationFrame(() => rhUpdate(true)); rhAS(); } else if (typeof AS !== "undefined" && AS.on) asStop(); };
const _openSurah52 = openSurah;
openSurah = async function(...x){ const r = await _openSurah52(...x); requestAnimationFrame(() => rhUpdate(true)); return r; };
/* offer auto-scroll after a few manual scrolls (once per session) */
const ASK = { n: 0, t0: 0, y: 0, done: false };
addEventListener("touchstart", () => { ASK.y = scrollY; }, { passive: true });
addEventListener("touchend", () => {
  if (LV.view !== "read" || ASK.done || (typeof AS !== "undefined" && AS.on) || Math.abs(scrollY - ASK.y) < 120) return;
  const now = Date.now(); if (now - ASK.t0 > 40000) { ASK.t0 = now; ASK.n = 0; }
  if (++ASK.n >= 4) { ASK.done = true; const b = $("#rhAS"); b.querySelector(".rh-ask").textContent = T("rhAsk"); b.classList.add("hint"); setTimeout(() => b.classList.remove("hint"), 6000); }
}, { passive: true });

/* ===== 4. Word details: Urdu meanings for related words, every meaning of the word with the one used here, and how the ending (i'rab) changes it ===== */
Object.assign(L.ur, { mnH:"اس لفظ کے معانی (پورے قرآن میں)", mnHere:"یہاں", mnWhy:"یہ معنی کیوں؟", mnWhyT:(m, c)=>`عربی کا ایک لفظ کئی معنی رکھ سکتا ہے۔ مترجم آیت کا سیاق (آگے پیچھے کے الفاظ اور موضوع) دیکھ کر معنی چنتا ہے۔ یہاں «${m}» لیا گیا ہے${c ? ` — سیاق: ${c}` : ""}۔`, mnTimes:n=>`${ud(n)} بار`,
  irH:"آخری حرکت (اعراب) بدلنے سے کیا فرق پڑتا ہے", irHere:"یہاں یہی ہے", irNom:"مرفوع (ُ  ٌ)", irAcc:"منصوب (َ  ً)", irGen:"مجرور (ِ  ٍ)", irNomT:m=>`عموماً فاعل، مبتدا یا خبر: «${m}» (کام کرنے والا / جس کی بات ہو رہی ہے)`, irAccT:m=>`عموماً مفعول، حال یا تمییز: «${m} کو» (جس پر کام ہو)`, irGenT:m=>`حرفِ جر کے بعد یا مضاف الیہ: «${m} کا / کی / میں»`,
  irInd:"مرفوع (ُ) — عام حالت", irSub:"منصوب (َ) — أَنْ / لَنْ کے بعد", irJus:"مجزوم (ْ) — لَمْ / لَا (نہی) / لِ (امر) کے بعد", irIndT:"کرتا ہے / کرے گا", irSubT:"«کہ وہ کرے» — لَنْ کے ساتھ «ہرگز نہیں کرے گا»", irJusT:"لَمْ: «نہیں کیا» · لَا: «نہ کرو» · لِ: «چاہیے کہ کرے»",
  irMabni:"یہ لفظ مبنی ہے: اس کا آخر کبھی نہیں بدلتا (جیسے ضمیر، اسمِ اشارہ، اسمِ موصول، حرف، ماضی کا فعل)۔", irMaqsur:"اس لفظ کے آخر میں (ا / ى / ي) ہے، اس لیے حرکت لکھائی میں ظاہر نہیں ہوتی؛ تینوں حالتیں ایک جیسی لکھی جاتی ہیں۔", irPlural:"جمع مذکر سالم / تثنیہ میں حالت حرف سے پہچانی جاتی ہے:", irPl1:"ـُونَ / ـَانِ = مرفوع", irPl2:"ـِينَ / ـَيْنِ = منصوب اور مجرور", irWaqf:"آیت کے آخر میں رکنے (وقف) پر آخری حرکت ساکن (ْ) پڑھی جاتی ہے؛ اس سے معنی نہیں بدلتا۔",
  irWhyP:p=>`یہاں مجرور ہے کیونکہ اس سے پہلے حرفِ جر «${p}» ہے۔`, irWhyGen:"یہاں مجرور ہے کیونکہ یہ مضاف الیہ ہے (کسی کا / کی)۔", irWhyInna:p=>`یہاں منصوب ہے کیونکہ پہلے «${p}» ہے (اس کے بعد اسم منصوب ہوتا ہے)۔`, irWhyLa:"یہاں منصوب ہے: «لَا» نفیِ جنس کے بعد اسم منصوب ہوتا ہے («کوئی … نہیں»)۔", irWhyAcc:"یہاں منصوب ہے — جملے میں مفعول یا حال کی جگہ پر۔", irWhyNom:"یہاں مرفوع ہے — جملے میں فاعل، مبتدا یا خبر کی جگہ پر۔", irWhyMood:(p, m)=>`یہاں ${m} ہے کیونکہ پہلے «${p}» ہے۔`, irWhyInd:"یہاں مرفوع ہے — کوئی ناصب یا جازم لفظ پہلے نہیں۔", irNote:"یہ حصہ گرامر کے عام قاعدوں سے بنایا گیا ہے؛ تفصیل کے لیے کسی استاد سے رہنمائی لیں۔" });
Object.assign(L.en, { mnH:"Meanings of this word (across the Quran)", mnHere:"here", mnWhy:"Why this meaning?", mnWhyT:(m, c)=>`One Arabic word can carry several meanings. The translator picks one from the context (the words around it and the subject of the passage). Here it is taken as “${m}”${c ? ` — context: ${c}` : ""}.`, mnTimes:n=>`${n}×`,
  irH:"What changes with the ending (i'rab)", irHere:"used here", irNom:"Nominative (ُ ٌ)", irAcc:"Accusative (َ ً)", irGen:"Genitive (ِ ٍ)", irNomT:m=>`usually the subject or the predicate: “${m}” (the doer / what is spoken about)`, irAccT:m=>`usually the object or a circumstance: “${m}” as the one acted upon`, irGenT:m=>`after a preposition or as the second part of a possessive: “of / in ${m}”`,
  irInd:"Indicative (ُ) — normal", irSub:"Subjunctive (َ) — after an / lan", irJus:"Jussive (ْ) — after lam / lā (do not) / li (let)", irIndT:"does / will do", irSubT:"“that he does” — with lan: “will never do”", irJusT:"lam: “did not” · lā: “do not” · li: “let him do”",
  irMabni:"This word is fixed (mabnī): its ending never changes (pronouns, demonstratives, relative nouns, particles, past-tense verbs).", irMaqsur:"This word ends in ا / ى / ي, so the case vowel is not written; all three cases look the same.", irPlural:"In sound masculine plurals and duals the case is shown by letters:", irPl1:"-ūna / -āni = nominative", irPl2:"-īna / -ayni = accusative and genitive", irWaqf:"When pausing at the end of an ayah the last vowel is read as a sukun (ْ); the meaning does not change.",
  irWhyP:p=>`Genitive here because the preposition “${p}” comes before it.`, irWhyGen:"Genitive here because it is the second part of a possessive (“of …”).", irWhyInna:p=>`Accusative here because “${p}” comes before it.`, irWhyLa:"Accusative here: after “lā” of total negation the noun is accusative (“no … at all”).", irWhyAcc:"Accusative here — it stands as an object or circumstance in the sentence.", irWhyNom:"Nominative here — it stands as the subject or predicate in the sentence.", irWhyMood:(p, m)=>`${m} here because “${p}” comes before it.`, irWhyInd:"Indicative here — no particle before it changes the mood.", irNote:"Built from general grammar rules; ask a teacher for the finer points." });
let LUR = null, SUR = null;
const loadLUR = () => LUR && SUR ? Promise.resolve(LUR) : Promise.all([load("lemur", `data/lemma-ur.json?v=${DV}`), load("senur", `data/learn/senses-ur.json?v=${DV}`).catch(() => ({}))]).then(([x, y]) => { LUR = x; SUR = y; return x; });
const urFirst = () => settings.lang !== "en" || settings.gl === "ur";
const SMALL_UR = new Set("اور کے کی کا کو نے میں سے پر ہے ہیں تھا تھے تھی ہو گا گی گے بھی تو".split(" "));
const urCore = u => { let t = (u || "").replace(/[—۔]/g, " ").trim().split(/\s+/).filter(Boolean); while (t.length && SMALL_UR.has(t[0])) t.shift(); while (t.length && SMALL_UR.has(t[t.length - 1])) t.pop(); return t.join(" "); };
const HARAKA = /[ً-ْۡ]+$/;
function irabForms(segs, i, A, n, a){
  const sj = segs.findIndex(s => s[3] === ""), st = segs[sj]; if (!st) return "";
  const tg = tagsOf(st[1]).split("|"), isV = tg[0] === "V", lang = settings.lang === "en";
  const Lm = st[2] >= 0 ? META.lemmas[st[2]] : null, mean = (LUR && st[2] >= 0 && LUR[st[2]] && !lang ? LUR[st[2]][0][0] : (Lm && Lm[4])) || "";
  const prev = A.w[i - 1], prevTxt = prev ? prev[0].replace(/[ً-ْٰۡ۟ٓٔ]/g, "").replace(/[أإآٱ]/g, "ا") : "", pfx = segs.slice(0, sj).filter(s => tagsOf(s[1]).includes("P|P")).map(s => s[0]).pop();
  const row = (lab, form, txt, here) => `<li class="${here ? "here" : ""}"><span class="ir-f">${esc(form)}</span><span><b>${lab}</b><small>${txt}</small>${here ? ` <i>${T("irHere")}</i>` : ""}</span></li>`;
  const tail = segs.slice(sj + 1).map(s => s[0]).join(""), head = segs.slice(0, sj).map(s => s[0]).join("");
  let h = "";
  const last = A.w.length - 1 === i ? `<p class="ir-n">${T("irWaqf")}</p>` : "";
  if (isV) {
    if (!tg.includes("IMPF")) return `<h3>${T("irH")}</h3><p class="ir-n">${T("irMabni")}</p>`;
    const mood = tg.find(x => x.startsWith("MOOD:")) || "MOOD:IND", base = st[0].replace(HARAKA, "");
    const five = /^(ونَ|ينَ|انِ|وا|ي|ا)$/.test(tail.replace(/[^ء-يَ-ِْ]/g, "").slice(0, 3)) && tail;
    const F = five ? [head + base + (tail.startsWith("و") ? "ونَ" : tail.startsWith("ا") ? "انِ" : "ينَ"), head + base + (tail.startsWith("و") ? "وا" : tail.startsWith("ا") ? "ا" : "ي"), head + base + (tail.startsWith("و") ? "وا" : tail.startsWith("ا") ? "ا" : "ي")]
                   : [head + base + "ُ" + tail, head + base + "َ" + tail, head + base + "ْ" + tail];
    h += row(T("irInd"), F[0], T("irIndT"), mood === "MOOD:IND") + row(T("irSub"), F[1], T("irSubT"), mood === "MOOD:SUBJ") + row(T("irJus"), F[2], T("irJusT"), mood === "MOOD:JUS");
    const trig = /^(ان|لن|كي|لم|لما|لا|ل|حتى)$/.test(prevTxt) ? prev[0] : "";
    const why = mood === "MOOD:IND" ? T("irWhyInd") : trig ? T("irWhyMood", trig, T(mood === "MOOD:SUBJ" ? "irSub" : "irJus").split(" — ")[0]) : "";
    return `<h3>${T("irH")}</h3><ul class="ir">${h}</ul>${why ? `<p class="ir-why">${esc(why)}</p>` : ""}${last}<p class="draft">${T("irNote")}</p>`;
  }
  if (tg[0] !== "N" || tg.some(x => ["PRON", "DEM", "REL"].includes(x))) return `<h3>${T("irH")}</h3><p class="ir-n">${T("irMabni")}</p>`;
  const cs = tg.includes("NOM") ? "N" : tg.includes("ACC") ? "A" : tg.includes("GEN") ? "G" : "";
  let base = st[0].replace(/ًا$|اً$/, "").replace(HARAKA, ""), indef = tg.includes("INDEF") && !segs.some(s => tagsOf(s[1]).includes("DET"));
  if (/(ونَ|ينَ|انِ|يْنِ)$/.test(st[0]) && (tg.includes("MP") || tg.includes("MD") || tg.includes("FD"))) {
    h = `<p class="ir-n">${T("irPlural")}</p><ul class="ir">${row(T("irNom"), T("irPl1"), "", cs === "N")}${row(T("irAcc") + " / " + T("irGen"), T("irPl2"), "", cs !== "N")}</ul>`;
  } else if (/[اىي]$/.test(base) && !/[ً-ِ]/.test(st[0].slice(-1))) {
    h = `<p class="ir-n">${T("irMaqsur")}</p>`;
  } else {
    const end = base.endsWith("ة") || base.endsWith("ء") ? ["ٌ", "ً", "ٍ"] : ["ٌ", "ًا", "ٍ"];
    const v = indef ? end : ["ُ", "َ", "ِ"], F = v.map(x => head + base + x + tail);
    h = `<ul class="ir">${row(T("irNom"), F[0], esc(T("irNomT", mean)), cs === "N")}${row(T("irAcc"), F[1], esc(T("irAccT", mean)), cs === "A")}${row(T("irGen"), F[2], esc(T("irGenT", mean)), cs === "G")}</ul>`;
  }
  let why = "";
  if (cs === "G") why = pfx ? T("irWhyP", pfx) : /^(في|من|على|الى|إلى|عن|ب|ل|ك|حتى|مع|عند|بين|لدى)$/.test(prevTxt) ? T("irWhyP", prev[0]) : T("irWhyGen");
  else if (cs === "A") why = /^(ان|إن|أن|لكن|لعل|كأن|ليت)$/.test(prevTxt.replace(/[إأ]/g, "ا").replace(/^ا/, "ا")) || /^(إن|أن|ان)$/.test(prevTxt) ? T("irWhyInna", prev[0]) : prevTxt === "لا" ? T("irWhyLa") : T("irWhyAcc");
  else if (cs === "N") why = T("irWhyNom");
  return `<h3>${T("irH")}</h3>${h}${why ? `<p class="ir-why">${esc(why)}</p>` : ""}${last}<p class="draft">${T("irNote")}</p>`;
}
/* the "meanings in the Quran" groups get an Urdu heading (from the Urdu translation of their own examples) */
senseHTML = function(stem, w){
  if (stem < 0 || !SENSES) return "";
  const Lm = META.lemmas[stem], key = Lm[0] + "|" + (Lm[2] >= 0 ? META.roots[Lm[2]][0] : ""), S = SENSES[key];
  if (!S) return "";
  const U = (SUR && SUR[key]) || [], here = (w[1] || "").toLowerCase(), ur = urFirst();
  const rows = S.slice(0, 8).map(([g, c, locs, clue], k) => {
    const isHere = here.includes(g.toLowerCase().replace(/s$/, "")), u = U[k];
    const head = ur && u ? `<b class="ur">${esc(u)}</b> <small class="en-g">${esc(g)}</small>` : `<b>${esc(g)}</b>${u ? ` <small class="ur">${esc(u)}</small>` : ""}`;
    return `<li class="${isHere ? "here" : ""}">${head} <span class="c">${T("times", c)}</span>${isHere ? ` <i>${T("here")}</i>` : ""}
      ${clue ? `<small>${esc(T("followed", clue))}</small>` : ""}<span class="locs">${locs.map(l => `<button data-sloc="${l}">${l.split(":").slice(0, 2).join(":")}</button>`).join("")}</span></li>`;
  }).join("");
  return `<h3>${T("sensesH")}</h3><ul class="senses">${rows}</ul><div class="draft" style="margin-top:4px">${T("sensesNote")}</div>`;
};
function meaningsHTML(w, A, i){
  const li = w[5]; if (li == null || li < 0 || !LUR || !LUR[li]) return "";
  const here = urCore(w[3]), list = LUR[li];
  const ctx = [A.w[i - 1], A.w[i + 1]].filter(Boolean).map(x => `${x[0]} (${settings.lang === "en" ? x[1] : x[3] || x[1]})`).join(" … ");
  const Lm = META.lemmas[li], hasS = SENSES && SENSES[Lm[0] + "|" + (Lm[2] >= 0 ? META.roots[Lm[2]][0] : "")];
  if (hasS) return `<p class="ir-why mn"><b>${T("mnWhy")}</b> ${esc(T("mnWhyT", w[3] || w[1], ctx))}</p>`;
  const rows = list.map(([u, c, loc]) => `<li class="${u === here ? "here" : ""}"><b>${esc(u)}</b> <span class="c">${T("mnTimes", nf(c))}</span>${u === here ? ` <i>${T("mnHere")}</i>` : ""} <button class="mn-loc" data-sloc="${loc}">${loc.split(":").slice(0, 2).join(":")}</button></li>`).join("");
  return `<h3>${T("mnH")}</h3><ul class="senses mn">${rows}</ul>${list.length > 1 ? `<p class="ir-why"><b>${T("mnWhy")}</b> ${esc(T("mnWhyT", w[3] || w[1], ctx))}</p>` : ""}`;
}
const _openWord52 = openWord;
openWord = function(a, i){
  _openWord52(a, i);
  const n = CUR.n, A = CUR.ayahs[a - 1], w = A.w[i];
  const done = () => {
    const body = $("#sheetBody"); if (!body || !body.querySelector(".wd-head")) return;
    if (urFirst() && LUR) body.querySelectorAll(".lemlist [data-lem]").forEach(b => { const x = LUR[+b.dataset.lem], g = b.querySelector(".lg"); if (x && g && !g.dataset.ur) { g.dataset.ur = 1; g.innerHTML = `${esc(x[0][0])}<small>${esc(g.textContent)}</small>`; g.classList.add("ur"); } });
    const old = body.querySelector("ul.senses:not(.mn)");
    if (old && SUR && !old.dataset.ur) { const tmp = document.createElement("div"); tmp.innerHTML = senseHTML(w[5], w); const nu = tmp.querySelector("ul.senses"); if (nu) { nu.dataset.ur = 1; old.replaceWith(nu); } }
    if (!body.querySelector(".mn")) {
      const html = meaningsHTML(w, A, i) + irabForms(w[4], i, A, n, a), sn = body.querySelector("ul.senses:not(.mn)"), at = body.querySelector("#occH");
      if (sn) (sn.nextElementSibling && sn.nextElementSibling.classList.contains("draft") ? sn.nextElementSibling : sn).insertAdjacentHTML("afterend", html);
      else if (at) at.insertAdjacentHTML("beforebegin", html); else body.insertAdjacentHTML("beforeend", html);
    }
  };
  let tries = 0; const go = () => { if ($("#sheetBody .wd-head")) done(); else if (++tries < 20) setTimeout(go, 150); };
  (LUR ? Promise.resolve() : loadLUR()).then(go).catch(() => {});
};
