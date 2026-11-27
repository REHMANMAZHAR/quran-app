"use strict";
/* ---------- v66: "Report a mistake" inside the app; links to About and Privacy ----------
   The report goes to our own database (Cloudflare D1, functions/api/report.js). If that is not reachable,
   it falls back to the email it used before, already filled in. */
Object.assign(L.ur, { lnAbout:"ہمارے بارے میں اور ماخذ", lnPriv:"رازداری کی پالیسی",
  rpH:"غلطی کی اطلاع دیں", rpWord:"یہ لفظ غلط ہے؟ اطلاع دیں", rpKind:"کس چیز میں غلطی ہے؟",
  rpKinds:[["meaning","لفظ کا معنی"],["grammar","گرامر"],["translation","ترجمہ"],["arabic","عربی متن"],["audio","آڈیو"],["other","کچھ اور"]],
  rpText:"کیا غلط ہے، اور درست کیا ہونا چاہیے؟ حوالہ ہو تو لکھ دیں۔", rpEmail:"ای میل (اختیاری، جواب چاہیں تو)",
  rpSend:"بھیجیں", rpSending:"بھیجا جا رہا ہے…", rpThanks:"شکریہ! آپ کی اطلاع مل گئی، ان شاء اللہ درست کر دی جائے گی۔", rpShort:"براہِ کرم تھوڑی وضاحت لکھیں۔",
  rpMail:"ابھی براہِ راست نہیں بھیجی جا سکی — ای میل کھل رہی ہے، بس بھیج دیں۔" });
Object.assign(L.en, { lnAbout:"About & sources", lnPriv:"Privacy policy",
  rpH:"Report a mistake", rpWord:"Something wrong with this word? Report it", rpKind:"What is wrong?",
  rpKinds:[["meaning","Word meaning"],["grammar","Grammar"],["translation","Translation"],["arabic","Arabic text"],["audio","Audio"],["other","Something else"]],
  rpText:"What is wrong, and what should it be? Add a reference if you have one.", rpEmail:"Email (optional, if you want a reply)",
  rpSend:"Send", rpSending:"Sending…", rpThanks:"Thank you! Your report has arrived and will be checked, in sha Allah.", rpShort:"Please write a little more.",
  rpMail:"Couldn't send it directly just now — your email app is opening with it filled in; just press send." });

const RP_VER = "v66";
function reportSheet(ref, word, kind){
  $("#sheetBody").dataset.ayah = "";
  $("#sheetBody").innerHTML = `<div class="rp">
    <h3>⚑ ${T("rpH")}</h3>
    <p class="rp-ref"><b dir="ltr">${esc(ref)}</b>${word ? ` · <span class="rp-w">${esc(word)}</span>` : ""}</p>
    <p class="rp-l">${T("rpKind")}</p>
    <div class="rp-kinds">${T("rpKinds").map(([k, l]) => `<button type="button" data-rpk="${k}" aria-pressed="${k === (kind || (word ? "meaning" : "translation"))}">${l}</button>`).join("")}</div>
    <textarea id="rpText" rows="5" placeholder="${esc(T("rpText"))}"></textarea>
    <input id="rpEmail" type="email" inputmode="email" autocomplete="email" placeholder="${esc(T("rpEmail"))}">
    <input id="rpWeb" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="rp-hp">
    <div class="wd-actions"><button class="btn" id="rpSend" data-ref="${esc(ref)}" data-word="${esc(word || "")}">${T("rpSend")}</button></div>
    <p class="rp-msg" id="rpMsg" role="status"></p></div>`;
  openSheet();
  setTimeout(() => { const t = $("#rpText"); if (t) t.focus(); }, 250);
}
function rpMailto(ref, word, kind, text){
  const body = `${text}\n\n—\nLocation: ${ref}${word ? `\nWord: ${word}` : ""}\nType: ${kind}\nApp: ${RP_VER} ${location.href}\nLanguage: ${settings.lang}`;
  location.href = `mailto:qurantosoulapp@gmail.com?subject=${encodeURIComponent(T("reportSubj", ref))}&body=${encodeURIComponent(body)}`;
}
$("#sheetBody").addEventListener("click", async e => {
  const k = e.target.closest("[data-rpk]");
  if (k) { document.querySelectorAll("#sheetBody [data-rpk]").forEach(b => b.setAttribute("aria-pressed", b === k)); return; }
  const go = e.target.closest("[data-rpopen]");
  if (go) { const [ref, word] = go.dataset.rpopen.split("|"); reportSheet(ref, word, "meaning"); return; }
  const s = e.target.closest("#rpSend"); if (!s) return;
  const text = $("#rpText").value.trim(), msg = $("#rpMsg");
  if (text.length < 3) { msg.textContent = T("rpShort"); $("#rpText").focus(); return; }
  const kb = document.querySelector("#sheetBody [data-rpk][aria-pressed=true]"), kind = kb ? kb.dataset.rpk : "other";
  const payload = { ref: s.dataset.ref, word: s.dataset.word, kind, text, email: $("#rpEmail").value.trim(), lang: settings.lang, ver: RP_VER, website: $("#rpWeb").value };
  s.disabled = true; s.textContent = T("rpSending");
  try {
    const r = await fetch("/api/report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error(r.status);
    closeAll(); toast(esc(T("rpThanks")), 4200);
  } catch (err) {
    msg.textContent = T("rpMail"); s.disabled = false; s.textContent = T("rpSend");
    setTimeout(() => rpMailto(payload.ref, payload.word, kind, text), 900);
  }
});
/* the ayah menu's existing ⚑ button now opens the form instead of going straight to email */
reportMistake = function(ref){ reportSheet(ref, "", "translation"); };
/* and every word sheet ends with a small "report this word" link */
const _openWord66 = openWord;
openWord = function(a, i){
  const r = _openWord66.apply(this, arguments);
  const add = () => {
    const sb = $("#sheetBody"); if (!sb || sb.querySelector(".rp-open") || !CUR || !CUR.ayahs[a - 1]) return;
    const w = CUR.ayahs[a - 1].w[i]; if (!w) return;
    sb.insertAdjacentHTML("beforeend", `<p class="rp-open"><button type="button" data-rpopen="${CUR.n}:${a}:${i + 1}|${esc(w[0])}">⚑ ${T("rpWord")}</button></p>`);
  };
  Promise.resolve(r).then(() => setTimeout(add, 60));
  return r;
};


/* ---------- QuranToSoul reference-only publication gate (reversible) ----------
   Existing religious datasets remain in the repository/history, but unverified
   meanings, translations, tafseer, summaries and hadith explanations are not
   displayed. Navigation and study tools remain available where they do not
   reproduce uncleared explanatory content. */
(function enableReferenceOnlyMode(){
  const POLICY = Object.freeze({ mode:"reference-only", version:"2026-11-27" });
  window.QTS_CONTENT_POLICY = POLICY;
  document.body.classList.add("qts-reference-only");

  // Do not render bundled word glosses or translation editions while their rights
  // and edition-level provenance are unresolved.
  settings.showTr = false;
  settings.tr = "none";
  settings.wbw = false;
  if (typeof applySettings === "function") applySettings();

  const style = document.createElement("style");
  style.id = "qtsReferenceOnlyCSS";
  style.textContent = `
    body.qts-reference-only #main .g,
    body.qts-reference-only #main .tr { display:none!important; }
    body.qts-reference-only #home .hd-day { display:none!important; }
    body.qts-reference-only .qts-ref-card { margin:12px 0;padding:14px;border:1px solid var(--line);border-radius:14px;background:var(--surface); }
    body.qts-reference-only .qts-ref-card p { margin:6px 0;color:var(--muted);line-height:1.6; }
    body.qts-reference-only .qts-ref-card a { display:inline-block;margin:6px 8px 0 0;text-decoration:underline;color:var(--teal); }
  `;
  document.head.appendChild(style);

  const hub = (heading, intro, links) => `
    <div class="qts-ref-card">
      <h3>${heading}</h3><p>${intro}</p>
      ${links.map(([label,url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join("")}
    </div>`;

  const common = [
    ["Tanzil — Quran text and text licence","https://tanzil.ca/docs/text_license"],
    ["Quran.com — read and explore","https://quran.com/"],
    ["Quranic Arabic Corpus — source and downloads","https://corpus.quran.com/download/"]
  ];

  // Replace the unverified word-detail panel with a reference card: Arabic token,
  // exact location and external source links only. No in-app meaning is generated.
  openWord = function(a, i){
    const n = CUR && CUR.n, A = CUR && CUR.ayahs[a - 1], w = A && A.w[i];
    if (!w || !n) return;
    const surah = META.surahs[n - 1];
    $("#sheetBody").innerHTML = `
      <div class="wd-head">
        <div class="wd-word" dir="rtl"><span class="seg-">${esc(w[0])}</span></div>
        <div class="wd-sub">${esc(surah.ar)} · ${esc(surah.tr)} · ${nf(n)}:${nf(a)} · ${T("wordDetail")}</div>
      </div>
      <div class="qts-ref-card">
        <b>Source references</b>
        <p>This app is currently showing the Quranic text and its location only. Word meanings and explanations are withheld until the relevant edition and reuse rights are established.</p>
        <a href="https://quran.com/${n}/${a}" target="_blank" rel="noopener noreferrer">Open this ayah on Quran.com ↗</a>
        <a href="https://corpus.quran.com/wordbyword.jsp?chapter=${n}&verse=${a}" target="_blank" rel="noopener noreferrer">Open morphology reference ↗</a>
      </div>`;
    openSheet();
  };

  // Ruku / quarter summaries are interpretive content, so retain only the range
  // and official source references.
  openRuku = function(s, a1, a2){
    const S = META.surahs[s - 1];
    $("#sheetBody").innerHTML = `
      <div class="qts-ref-card"><h3>Ruku reference</h3>
      <p>${esc(S ? S.tr : "Surah")} · ${nf(s)}:${nf(a1)}–${nf(a2)}</p>
      <p>In-app explanatory summaries are withheld pending source and review clearance.</p>
      <a href="https://www.tanzeem.org/services/bayan-ul-quran-2/" target="_blank" rel="noopener noreferrer">Official Bayan-ul-Quran source ↗</a>
      <a href="https://quran.com/${s}/${a1}" target="_blank" rel="noopener noreferrer">Open ayah range reference ↗</a></div>`;
    openSheet();
  };
  openQuarter = function(s, a, q){
    const S = META.surahs[s - 1];
    $("#sheetBody").innerHTML = `
      <div class="qts-ref-card"><h3>Quarter reference</h3>
      <p>${esc(S ? S.tr : "Surah")} · ${nf(s)}:${nf(a)}</p>
      <p>Ruku summaries and explanatory notes are not displayed in reference-only mode.</p>
      <a href="https://www.tanzeem.org/services/bayan-ul-quran-2/" target="_blank" rel="noopener noreferrer">Official Bayan-ul-Quran source ↗</a>
      <a href="https://quran.com/${s}/${a}" target="_blank" rel="noopener noreferrer">Open ayah on Quran.com ↗</a></div>`;
    openSheet();
  };

  // Do not load project-authored root reflections or paraphrased hadith into word sheets.
  DATA.insights = () => Promise.resolve(null);

  // Replace in-app lessons / word decks with a source directory.
  VIEWS.learn.render = () => {
    $("#learn").innerHTML = hub("Quran study sources",
      "QuranToSoul provides references to existing sources. It does not create or paraphrase word meanings, lessons or tafseer.",
      common.concat([
        ["Tanzeem-e-Islami — Bayan-ul-Quran","https://www.tanzeem.org/services/bayan-ul-quran-2/"],
        ["Tanzeem-e-Islami — PDF book collection","https://www.tanzeem.org/book_categories/bayan-ul-quran/"]
      ]));
  };

  // Tafseer is link-out only; no bundled/streamed commentary is presented here.
  VIEWS.tafsir.render = () => {
    $("#tafsirv").innerHTML = hub("Tafseer references",
      "Select the original publisher or organisation to read or listen to its own material. QuranToSoul does not reproduce tafseer text.",
      [
        ["Bayan-ul-Quran — official Tanzeem page","https://www.tanzeem.org/services/bayan-ul-quran-2/"],
        ["Bayan-ul-Quran — official PDF collection","https://www.tanzeem.org/book_categories/bayan-ul-quran/"]
      ]);
  };

  VIEWS.hadith.render = () => {
    $("#hadithv").innerHTML = hub("Hadith references",
      "Hadith text, grading and translations are not reproduced in this section while source editions and reuse status are being verified.",
      [
        ["Sunnah.com — source catalogue","https://sunnah.com/"],
        ["Tanzeem-e-Islami — official publications","https://www.tanzeem.org/"]
      ]);
  };

  VIEWS.duas.render = () => {
    $("#duas").innerHTML = hub("Dua references",
      "In-app supplication translations and explanatory labels are temporarily withheld pending source and rights review.",
      [
        ["Quran.com — Quran text and references","https://quran.com/"],
        ["Tanzeem-e-Islami — official source library","https://www.tanzeem.org/"]
      ]);
  };

  // The home renderer may add a hadith-of-the-day card asynchronously; remove it
  // after each dashboard render without disturbing other dashboard tools.
  const oldHome = VIEWS.home.render;
  if (typeof oldHome === "function") VIEWS.home.render = async function(...args){
    const r = await oldHome.apply(this,args);
    document.querySelectorAll("#home .hd-day").forEach(x => x.remove());
    return r;
  };

  // Keep the Learn tab, but label it honestly as a source directory.
  Object.assign(L.ur, { tabLearn:"حوالہ جات" });
  Object.assign(L.en, { tabLearn:"Sources" });
})();
