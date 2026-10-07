"use strict";
/* ---------- Quran PDF: build a clean printable page from the app's own text, then "Save as PDF" ---------- */
Object.assign(L.ur, { pdfT:"قرآن PDF", pdfSub:"اپنی پسند کا حصہ، انداز کے ساتھ PDF بنائیں — پرنٹ ونڈو میں \"Save as PDF\" چنیں", pdfWhat:"کیا", pdfSurah:"سورت", pdfPara:"پارہ", pdfAll:"پورا قرآن",
  pdfStyle:"انداز", pdfAr:"صرف عربی", pdfArTr:"عربی + ترجمہ", pdfWbw:"لفظ بہ لفظ (جدول)", pdfMake:"PDF بنائیں", pdfWait:"تیار ہو رہا ہے…", pdfBig:"پورا قرآن بڑی فائل ہے — بننے میں ایک منٹ لگ سکتا ہے", pdfBlocked:"نئی ونڈو نہیں کھلی — براؤزر میں پاپ اپ کی اجازت دیں" });
Object.assign(L.en, { pdfT:"Quran PDF", pdfSub:"Make a PDF of any part in the style you like — choose \"Save as PDF\" in the print window", pdfWhat:"What", pdfSurah:"Surah", pdfPara:"Para", pdfAll:"Whole Quran",
  pdfStyle:"Style", pdfAr:"Arabic only", pdfArTr:"Arabic + translation", pdfWbw:"Word by word (table)", pdfMake:"Make PDF", pdfWait:"Preparing…", pdfBig:"The whole Quran is a big file — it can take a minute", pdfBlocked:"The new window was blocked — allow pop-ups for this site" });
const PDFS = Object.assign({ kind: "s", s: 1, p: 1, style: "ar" }, store.get("pdf", {}));
function pdfSheet(){
  const seg = (k, v, l) => `<button data-pdf-${k}="${v}" aria-pressed="${PDFS[k] === v}">${T(l)}</button>`;
  $("#sheetBody").innerHTML = `<h3 class="ds-h">${T("pdfT")}</h3><p class="ds-note" style="margin-top:0">${T("pdfSub")}</p>
    <section class="ds"><b>${T("pdfWhat")}</b><div class="rtb-seg wide">${seg("kind", "s", "pdfSurah")}${seg("kind", "p", "pdfPara")}${seg("kind", "all", "pdfAll")}</div>
      ${PDFS.kind === "s" ? `<select id="pdfS" class="wide-sel">${META.surahs.map(S => `<option value="${S.n}"${PDFS.s === S.n ? " selected" : ""}>${S.n}. ${esc(S.tr)} — ${esc(S.ar)}</option>`).join("")}</select>`
        : PDFS.kind === "p" ? `<select id="pdfP" class="wide-sel">${META.juz.map((j, i) => `<option value="${i + 1}"${PDFS.p === i + 1 ? " selected" : ""}>${T("paraN", nf(i + 1))} — ${esc(PARA_NAMES[i])}</option>`).join("")}</select>`
        : `<p class="ds-note">${T("pdfBig")}</p>`}</section>
    <section class="ds"><b>${T("pdfStyle")}</b><div class="rtb-seg wide">${seg("style", "ar", "pdfAr")}${seg("style", "tr", "pdfArTr")}${seg("style", "wbw", "pdfWbw")}</div></section>
    <button class="btn wide" data-pdfgo="1" style="margin-top:12px">${T("pdfMake")}</button>`;
  openSheet();
}
document.addEventListener("click", async e => {
  const k = e.target.closest("[data-pdf-kind]"), st = e.target.closest("[data-pdf-style]");
  if (k) { PDFS.kind = k.dataset.pdfKind; store.set("pdf", PDFS); pdfSheet(); return; }
  if (st) { PDFS.style = st.dataset.pdfStyle; store.set("pdf", PDFS); pdfSheet(); return; }
  if (!e.target.closest("[data-pdfgo]")) return;
  closeAll(); const ov = pdfOverlay(); ov.querySelector(".pv-body").innerHTML = `<div class="loading" style="padding:40px">${T("pdfWait")}</div>`;
  if (settings.script === "ip" && !IPK) { try { IPK = await DATA.indopak(); } catch(err){} }
  // ranges: [surah, fromAyah, toAyah]
  let R = [];
  if (PDFS.kind === "s") R = [[PDFS.s, 1, META.surahs[PDFS.s - 1].ayahs]];
  else if (PDFS.kind === "p") { const a = META.juz[PDFS.p - 1], b = META.juz[PDFS.p];
    for (let s = a[0]; s <= (b ? b[0] : 114); s++) { const from = s === a[0] ? a[1] : 1, to = b && s === b[0] ? b[1] - 1 : META.surahs[s - 1].ayahs; if (to >= from) R.push([s, from, to]); } }
  else for (let s = 1; s <= 114; s++) R.push([s, 1, META.surahs[s - 1].ayahs]);
  const ur = !/^en/.test(settings.tr || "ur"), parts = [];
  for (const [s, a1, a2] of R) {
    const d = await DATA.surah(s), S = META.surahs[s - 1];
    let h = `<section class="sura"><h2><span>${esc(S.ar)}</span><small>${S.n}. ${esc(S.tr)} · ${esc(S.en)}</small></h2>${a1 === 1 && s !== 1 && s !== 9 ? `<p class="bism">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>` : ""}`;
    if (PDFS.style === "ar") h += `<p class="flow">${d.ayahs.slice(a1 - 1, a2).map((A, k) => A.w.map((w, i) => esc(wordText(s, a1 + k, i, w[0]))).join(" ") + ` <span class="n">${ud(a1 + k)}</span>`).join(" ")}</p>`;
    else if (PDFS.style === "tr") h += d.ayahs.slice(a1 - 1, a2).map((A, k) => `<div class="ay"><p class="ar">${A.w.map((w, i) => esc(wordText(s, a1 + k, i, w[0]))).join(" ")} <span class="n">${ud(a1 + k)}</span></p><p class="tr${ur ? " ur" : ""}">${esc(A[settings.tr] || A.ur || A.en)}</p></div>`).join("");
    else h += `<div class="grid">${d.ayahs.slice(a1 - 1, a2).map((A, k) => A.w.map((w, i) => `<div class="c"><b>${esc(wordText(s, a1 + k, i, w[0]))}${i === A.w.length - 1 ? ` <span class="n">${ud(a1 + k)}</span>` : ""}</b><small${ur ? ' class="ur"' : ""}>${esc(ur ? (w[3] || w[1]) : w[1])}</small></div>`).join("")).join("")}<div class="fill"></div></div>`;
    parts.push(h + "</section>");
  }
  const title = PDFS.kind === "s" ? `${META.surahs[PDFS.s - 1].tr}` : PDFS.kind === "p" ? `Para ${PDFS.p}` : "The Holy Quran";
  const doc = (`<!doctype html><html lang="ar"><head><meta charset="utf-8"><title>QuranToSoul — ${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Noto+Nastaliq+Urdu&family=Crimson+Pro:wght@400;600&display=swap" rel="stylesheet">
<style>@page{size:A4;margin:14mm 12mm}body{margin:0;color:#111;font-family:'Crimson Pro',Georgia,serif}
.head{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1E5486;padding-bottom:6px;margin-bottom:10px;font-size:12px;color:#1E5486}
.sura{break-inside:auto}.sura h2{text-align:center;margin:14px 0 6px;padding:8px;border:1.5px solid #1E5486;border-radius:10px;background:#EEF4FA;break-after:avoid}
.sura h2 span{display:block;font-family:'Amiri Quran',serif;font-weight:400;font-size:26px}.sura h2 small{font-size:12px;color:#444}
.bism{text-align:center;font-family:'Amiri Quran',serif;font-size:24px;margin:6px 0}
.flow{direction:rtl;text-align:justify;text-align-last:right;font-family:'Amiri Quran',serif;font-size:23px;line-height:2.4;margin:0}
.n{display:inline-block;min-width:1.6em;padding:0 3px;border:1.2px solid #1E5486;border-radius:50%;font-size:.6em;text-align:center;color:#1E5486;line-height:1.6;vertical-align:middle}
.ay{break-inside:avoid;border-bottom:1px solid #ddd;padding:6px 0}.ay .ar{direction:rtl;font-family:'Amiri Quran',serif;font-size:22px;line-height:2.2;margin:0}
.tr{margin:2px 0 0;font-size:13.5px;line-height:1.55}.tr.ur,.ur{font-family:'Noto Nastaliq Urdu',serif;direction:rtl;line-height:2.2;font-size:13px}
.grid{direction:rtl;display:flex;flex-wrap:wrap;border:1.5px solid #2F5F8F;border-bottom:0;border-left:0}
.c{flex:1 0 auto;display:flex;flex-direction:column;border-left:1px solid #8DB3D6;border-bottom:1.5px solid #2F5F8F;text-align:center;break-inside:avoid}
.c b{display:block;flex:1;background:#DCEBF7;border-bottom:1px solid #8DB3D6;padding:2px 8px;font-family:'Amiri Quran',serif;font-weight:400;font-size:21px;line-height:1.9}
.c small{display:block;padding:1px 6px;font-size:10.5px;line-height:1.5}.c small.ur{font-size:10.5px;line-height:2}.fill{flex:100 0 0}
.foot{margin-top:14px;font-size:10px;color:#666;text-align:center}</style></head><body>
<div class="head"><b>QuranToSoul · qurantosoul.com</b><span>${esc(title)}</span></div>${parts.join("")}
<p class="foot">Arabic text: Tanzil / Quranic Arabic Corpus (Uthmani)${settings.script === "ip" ? ", Indo-Pak script" : ""}. ${PDFS.style !== "ar" ? "Translation: " + esc((META.sources || {})[settings.tr === "ur" ? "ur1" : settings.tr] || "") + ". " : ""}Made with QuranToSoul — free, no ads.</p>
</body></html>`);
  PDF_DOC = { html: doc, title };
  ov.querySelector(".pv-t").textContent = title;
  ov.querySelector(".pv-body").innerHTML = `<iframe id="pvFrame" title="${esc(title)}"></iframe>`;
  $("#pvFrame").srcdoc = doc;
});

/* in-app preview with "Save as PDF" (the print window offers Save as PDF on Android, iPhone and computers) */
Object.assign(L.ur, { pdfSave:"PDF محفوظ کریں", pdfTab:"نئے ٹیب میں" });
Object.assign(L.en, { pdfSave:"Save as PDF", pdfTab:"Open in new tab" });
let PDF_DOC = null;
function pdfOverlay(){
  let ov = document.getElementById("pdfv");
  if (!ov) { ov = document.createElement("section"); ov.id = "pdfv"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); document.body.appendChild(ov); }
  ov.innerHTML = `<div class="pv-top"><b class="pv-t"></b><button class="btn" data-pv="print">⤓ ${T("pdfSave")}</button><button class="btn ghost" data-pv="tab">${T("pdfTab")}</button>
    <button class="iconbtn pv-x" data-pv="x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg><span class="cap">${T("capClose")}</span></button></div><div class="pv-body"></div>`;
  ov.classList.add("on"); return ov;
}
document.addEventListener("click", e => {
  const b = e.target.closest("#pdfv [data-pv]"); if (!b) return;
  const k = b.dataset.pv;
  if (k === "x") { document.getElementById("pdfv").classList.remove("on"); return; }
  if (!PDF_DOC) return;
  if (k === "print") { const f = $("#pvFrame"); try { f.contentWindow.focus(); f.contentWindow.print(); } catch(err) { k2tab(); } }
  else k2tab();
});
function k2tab(){
  const url = URL.createObjectURL(new Blob([PDF_DOC.html.replace("</body>", "<script>document.fonts.ready.then(()=>setTimeout(()=>print(),400));<\/script></body>")], { type: "text/html" }));
  const w = window.open(url, "_blank"); if (!w) toast(esc(T("pdfBlocked")), 4000);
}
