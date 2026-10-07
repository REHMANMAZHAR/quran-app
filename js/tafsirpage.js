"use strict";
/* ---------- Tafsir page: choose the kind of tafsir, then the part / surah ---------- */
Object.assign(L.ur, { tfT:"تفسیر", tfSub:"ڈاکٹر اسرار احمد — بیان القرآن", tfKinds:"تفسیر کی قسم", tfUrA:"اردو آڈیو", tfUrV:"اردو ویڈیو", tfEnA:"انگریزی آڈیو", tfTxt:"تحریری (اردو)", tfPdf:"PDF کتاب",
  tfCont:"جہاں چھوڑا تھا وہاں سے", tfHere:"جہاں آپ پڑھ رہے ہیں", tfParts:"تمام حصے", tfSurahs:"سورت منتخب کریں", tfPdfTxt:"بیان القرآن کی مکمل کتاب (۷ جلدیں) تنظیمِ اسلامی کی آفیشل ویب سائٹ پر مفت دستیاب ہے۔", tfPdfBtn:"tanzeem.org پر PDF کھولیں", tfTxtTxt:"ہر سورت کی تحریری تفسیر Quran.com پر (بیان القرآن، اردو) کھلتی ہے۔", tfMin:t=>`${t} سے` });
Object.assign(L.en, { tfT:"Tafsir", tfSub:"Dr. Israr Ahmad — Bayan-ul-Quran", tfKinds:"Kind of tafsir", tfUrA:"Urdu audio", tfUrV:"Urdu video", tfEnA:"English audio", tfTxt:"Written (Urdu)", tfPdf:"PDF book",
  tfCont:"Continue where you left off", tfHere:"From where you are reading", tfParts:"All parts", tfSurahs:"Choose a surah", tfPdfTxt:"The complete Bayan-ul-Quran book (7 volumes) is free on Tanzeem-e-Islami's official website.", tfPdfBtn:"Open the PDF on tanzeem.org", tfTxtTxt:"Each surah's written tafsir opens on Quran.com (Bayan-ul-Quran, Urdu).", tfMin:t=>`from ${t}` });
const TF = { kind: null };
const TF_KINDS = [["ur", "tfUrA", "🎧"], ["bq", "tfUrV", "▶"], ["en", "tfEnA", "🎧"], ["txt", "tfTxt", "📖"], ["pdf", "tfPdf", "📄"]];
function renderTafsir(){
  const k = TF.kind || (settings.taf === "txt" ? "txt" : settings.taf || "ur"), last = store.get("last", { s: 1, a: 1 });
  let body = "";
  if (k === "ur" || k === "bq" || k === "en") {
    const R = RANGES[k], C = TAF_SER[k], cur = VS[k].n, t = cur && VS[k].t ? VS[k].t[cur] : 0, here = lecFor(last.s, last.a, k);
    body = `<div class="tf-quick">${cur ? `<button class="hm-card" data-tfp="${k}:${cur}"><span><small>${T("tfCont")}</small><b>${T(C.num, nf(cur))} · ${esc(lecLabel(cur, 0, k))}</b>${t ? `<span>${T("tfMin", mmss(t))}</span>` : ""}</span><span class="hm-go">▶</span></button>` : ""}
      ${here ? `<button class="hm-card" data-tfhere="1"><span><small>${T("tfHere")}</small><b>${esc(surahName(last.s))} ${nf(last.s)}:${nf(last.a)}</b><span>${T(C.num, nf(here))}</span></span><span class="hm-go">▶</span></button>` : ""}</div>
      <h4 class="tf-h">${T("tfParts")}</h4>
      <ul class="tf-list">${R.map(L2 => `<li><button data-tfp="${k}:${L2[0]}"${L2[0] === cur ? ' class="on"' : ""}><span class="pk-n">${nf(L2[0])}</span><span>${esc(lecLabel(L2[0], 0, k))}</span></button></li>`).join("")}</ul>`;
  } else if (k === "txt") {
    body = `<p class="ds-note">${T("tfTxtTxt")}</p><h4 class="tf-h">${T("tfSurahs")}</h4><div class="pk-grid tf-grid">${META.surahs.map(S => `<a class="pk-c" href="${TAFSIR_TXT(S.n, 1)}" target="_blank" rel="noopener"><span class="pk-n">${nf(S.n)}</span><span class="pk-ar">${esc(S.ar)}</span><small>${esc(S.tr)}</small></a>`).join("")}</div>`;
  } else {
    body = `<section class="hm-card" style="flex-direction:column;align-items:stretch"><p style="margin:0 0 10px">${T("tfPdfTxt")}</p><a class="btn" href="${TAFSIR_PDF}" target="_blank" rel="noopener">${T("tfPdfBtn")}</a></section>`;
  }
  $("#tafsirv").innerHTML = `<p class="tf-sub">${T("tfSub")}</p>
    <div class="tf-kinds" role="tablist" aria-label="${T("tfKinds")}">${TF_KINDS.map(([id, key, ic]) => `<button role="tab" data-tfk="${id}" aria-selected="${k === id}"><span>${ic}</span>${T(key)}</button>`).join("")}</div>${body}`;
}
VIEWS.tafsir = { el: "#tafsirv", title: () => [T("tfT"), T("tfSub")], render: renderTafsir };
$("#tafsirv").addEventListener("click", e => {
  const k = e.target.closest("[data-tfk]"); if (k) { TF.kind = k.dataset.tfk; if (["ur", "bq", "en", "txt"].includes(TF.kind)) { settings.taf = TF.kind; saveSettings(); } renderTafsir(); return; }
  const p = e.target.closest("[data-tfp]"); if (p) { const [s, n] = p.dataset.tfp.split(":"); openLecture(s, +n); return; }
  if (e.target.closest("[data-tfhere]")) { const l = store.get("last", { s: 1, a: 1 }); playTafsir(l.s, l.a); }
});
