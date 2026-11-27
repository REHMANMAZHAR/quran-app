/* QuranToSoul — reversible reference-only publication gate.
   Keep Quran reading/navigation tools. Do not display unverified meanings,
   translations, tafseer, ruku summaries, authored lessons or hadith paraphrases. */
(function enableReferenceOnlyMode(){
  const POLICY = Object.freeze({mode:"reference-only",version:"2026-11-27"});
  window.QTS_CONTENT_POLICY = POLICY;
  document.body.classList.add("qts-reference-only");

  // Turn off all bundled word-by-word glosses and translation editions in this mode.
  settings.showTr = false;
  settings.tr = "none";
  settings.wbw = false;
  if (typeof applySettings === "function") applySettings();

  const style = document.createElement("style");
  style.id = "qtsReferenceOnlyCSS";
  style.textContent = `
    body.qts-reference-only #main .g,
    body.qts-reference-only #main .tr {display:none!important}
    body.qts-reference-only #home .hd-day {display:none!important}
    body.qts-reference-only .qts-ref-card {margin:12px 0;padding:14px;border:1px solid var(--line);border-radius:14px;background:var(--surface)}
    body.qts-reference-only .qts-ref-card p {margin:6px 0;color:var(--muted);line-height:1.6}
    body.qts-reference-only .qts-ref-card a {display:inline-block;margin:6px 8px 0 0;text-decoration:underline;color:var(--teal)}
  `;
  document.head.appendChild(style);

  const hub = (heading,intro,links) => `
    <div class="qts-ref-card"><h3>${heading}</h3><p>${intro}</p>
    ${links.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join("")}</div>`;
  const common = [
    ["Tanzil — Quran text and text licence","https://tanzil.ca/docs/text_license"],
    ["Quran.com — read and explore","https://quran.com/"],
    ["Quranic Arabic Corpus — source and downloads","https://corpus.quran.com/download/"]
  ];

  // Word sheet: exact Arabic token and exact location only, plus external references.
  openWord = function(a,i){
    const n=CUR&&CUR.n,A=CUR&&CUR.ayahs[a-1],w=A&&A.w[i];
    if(!w||!n)return;
    const surah=META.surahs[n-1];
    $("#sheetBody").innerHTML=`
      <div class="wd-head">
        <div class="wd-word" dir="rtl"><span class="seg-">${esc(w[0])}</span></div>
        <div class="wd-sub">${esc(surah.ar)} · ${esc(surah.tr)} · ${nf(n)}:${nf(a)} · ${T("wordDetail")}</div>
      </div>
      <div class="qts-ref-card"><b>Source references</b>
        <p>Only the Quranic text and its location are shown here. Word meanings and explanations are withheld until their source editions and reuse status are established.</p>
        <a href="https://quran.com/${n}/${a}" target="_blank" rel="noopener noreferrer">Open this ayah on Quran.com ↗</a>
        <a href="https://corpus.quran.com/wordbyword.jsp?chapter=${n}&verse=${a}" target="_blank" rel="noopener noreferrer">Open morphology reference ↗</a>
      </div>`;
    openSheet();
  };

  // Ruku and quarter cards retain navigation references but not project-authored summaries.
  openRuku = function(s,a1,a2){
    const S=META.surahs[s-1];
    $("#sheetBody").innerHTML=hub("Ruku reference",
      `${S?S.tr:"Surah"} · ${nf(s)}:${nf(a1)}–${nf(a2)}. In-app explanatory summaries are withheld pending source and review clearance.`,
      [["Official Bayan-ul-Quran source","https://www.tanzeem.org/services/bayan-ul-quran-2/"],["Open ayah reference",`https://quran.com/${s}/${a1}`]]);
    openSheet();
  };
  openQuarter = function(s,a,q){
    const S=META.surahs[s-1];
    $("#sheetBody").innerHTML=hub("Quarter reference",
      `${S?S.tr:"Surah"} · ${nf(s)}:${nf(a)}. Ruku summaries and explanatory notes are not displayed in reference-only mode.`,
      [["Official Bayan-ul-Quran source","https://www.tanzeem.org/services/bayan-ul-quran-2/"],["Open ayah reference",`https://quran.com/${s}/${a}`]]);
    openSheet();
  };

  // Prevent the project-authored root reflections and paraphrased hadith from being injected.
  DATA.insights = () => Promise.resolve(null);

  // Study tab becomes a directory of external sources, not the bundled lesson/meaning course.
  VIEWS.learn.render = () => {
    $("#learn").innerHTML=hub("Quran study sources",
      "QuranToSoul links to existing sources. It does not create or paraphrase word meanings, lessons or tafseer.",
      common.concat([
        ["Bayan-ul-Quran — official Tanzeem page","https://www.tanzeem.org/services/bayan-ul-quran-2/"],
        ["Bayan-ul-Quran — official PDF collection","https://www.tanzeem.org/book_categories/bayan-ul-quran/"]
      ]));
  };

  VIEWS.tafsir.render = () => {
    $("#tafsirv").innerHTML=hub("Tafseer references",
      "Open the original publisher's material. QuranToSoul does not reproduce tafseer text or audio in this section.",
      [["Bayan-ul-Quran — official Tanzeem page","https://www.tanzeem.org/services/bayan-ul-quran-2/"],["Bayan-ul-Quran — official PDF collection","https://www.tanzeem.org/book_categories/bayan-ul-quran/"]]);
  };

  VIEWS.hadith.render = () => {
    $("#hadithv").innerHTML=hub("Hadith references",
      "Hadith text, grading and translations are not reproduced here while source editions and reuse status are being verified.",
      [["Sunnah.com — source catalogue","https://sunnah.com/"],["Tanzeem-e-Islami — official publications","https://www.tanzeem.org/"]]);
  };

  VIEWS.duas.render = () => {
    $("#duas").innerHTML=hub("Dua references",
      "In-app supplication translations and explanatory labels are temporarily withheld pending source and rights review.",
      [["Quran.com — Quran text and references","https://quran.com/"],["Tanzeem-e-Islami — official source library","https://www.tanzeem.org/"]]);
  };

  // Search and games currently depend on uncleared translation/gloss indexes.
  // Keep the navigation destinations but show the source directory until an
  // Arabic-only, licence-cleared search index and quiz corpus are available.
  VIEWS.search.render = () => {
    $("#searchv").innerHTML=hub("Quran search references",
      "In-app search will be restored when its index contains only cleared Quran text and reference metadata.",
      common);
  };
  VIEWS.games.render = () => {
    $("#learn").innerHTML=hub("Study tools",
      "Word-meaning quizzes and vocabulary games are temporarily withheld until their source data is cleared.",
      common);
  };

  // Remove the asynchronously-added hadith-of-the-day card while preserving other dashboard tools.
  const oldHome=VIEWS.home.render;
  if(typeof oldHome==="function") VIEWS.home.render=async function(...args){
    const r=await oldHome.apply(this,args);
    document.querySelectorAll("#home .hd-day").forEach(x=>x.remove());
    return r;
  };

  Object.assign(L.ur,{tabLearn:"حوالہ جات"});
  Object.assign(L.en,{tabLearn:"Sources"});
})();