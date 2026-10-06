"use strict";
/* ---------- Tajweed colours (Hafs) ----------
   Rule positions: quran-tajweed by cpfair (CC BY 4.0), regenerated on this app's Uthmani text with the same
   rule trees (6,234 of 6,236 ayahs identical to the published data). Shown for the Uthmani script only. */
const TJ_RULES = ["hamzat_wasl", "silent", "lam_shamsiyyah", "madd_2", "madd_246", "madd_munfasil", "madd_muttasil", "madd_6", "qalqalah", "ghunnah", "ikhfa", "ikhfa_shafawi", "idghaam_ghunnah", "idghaam_no_ghunnah", "idghaam_shafawi", "idghaam_mutajanisayn", "idghaam_mutaqaribayn", "iqlab"];
const TJ_NAMES = {
  en:{ hamzat_wasl:"Hamzat al-waṣl — not pronounced when joined", silent:"Silent letter", lam_shamsiyyah:"Silent lām (sun letter)", madd_2:"Madd ṭabīʿī — 2 counts", madd_246:"Madd ʿāriḍ / līn — 2, 4 or 6 counts (at a stop)",
    madd_munfasil:"Madd munfaṣil — 4 or 5 counts", madd_muttasil:"Madd muttaṣil — 4 or 5 counts", madd_6:"Madd lāzim — 6 counts", qalqalah:"Qalqalah — echoing bounce", ghunnah:"Ghunnah — nasal sound (2 counts)",
    ikhfa:"Ikhfāʾ — hidden nūn with ghunnah", ikhfa_shafawi:"Ikhfāʾ shafawī — hidden mīm", idghaam_ghunnah:"Idghām with ghunnah", idghaam_no_ghunnah:"Idghām without ghunnah", idghaam_shafawi:"Idghām shafawī (mīm into mīm)",
    idghaam_mutajanisayn:"Idghām mutajānisayn", idghaam_mutaqaribayn:"Idghām mutaqāribayn", iqlab:"Iqlāb — nūn becomes mīm" },
  ur:{ hamzat_wasl:"ہمزۂ وصل — ملا کر پڑھیں تو نہیں پڑھا جاتا", silent:"خاموش حرف", lam_shamsiyyah:"لامِ شمسی (نہیں پڑھا جاتا)", madd_2:"مدِّ طبعی — ۲ حرکات", madd_246:"مدِّ عارض / لین — ۲، ۴ یا ۶ (وقف پر)",
    madd_munfasil:"مدِّ منفصل — ۴ یا ۵ حرکات", madd_muttasil:"مدِّ متصل — ۴ یا ۵ حرکات", madd_6:"مدِّ لازم — ۶ حرکات", qalqalah:"قلقلہ", ghunnah:"غنہ — ناک کی آواز (۲ حرکات)",
    ikhfa:"اخفاء — نون غنہ کے ساتھ چھپا", ikhfa_shafawi:"اخفاءِ شفوی — میم چھپا", idghaam_ghunnah:"ادغام مع الغنہ", idghaam_no_ghunnah:"ادغام بلا غنہ", idghaam_shafawi:"ادغامِ شفوی (میم میں میم)",
    idghaam_mutajanisayn:"ادغامِ متجانسین", idghaam_mutaqaribayn:"ادغامِ متقاربین", iqlab:"اقلاب — نون میم بن جاتا ہے" }
};
Object.assign(L.ur, { tjSet:"تجوید کے رنگ", tjKey:"رنگوں کا مطلب", tjOnlyU:"تجوید کے رنگ عثمانی رسم الخط میں دکھائے جاتے ہیں", tjSrc:"تجوید کے مقامات: quran-tajweed (CC BY 4.0) — عالم کی نظرِ ثانی باقی" });
Object.assign(L.en, { tjSet:"Tajweed colours", tjKey:"What the colours mean", tjOnlyU:"Tajweed colours are shown in the Uthmani script", tjSrc:"Tajweed positions: quran-tajweed (CC BY 4.0) — scholar review pending" });
const TJ = {};
function tajWord(n, a, i, text, uth){
  const A = settings.tajweed && settings.script !== "ip" && text === uth && TJ[n] && TJ[n][a];
  if (!A) return esc(text);
  const marks = A.filter(x => x[0] === i); if (!marks.length) return esc(text);
  const cls = new Array(text.length).fill(-1);
  marks.forEach(([, s, e, r]) => { for (let k = s; k < e && k < text.length; k++) cls[k] = r; });
  let out = "", k = 0;
  while (k < text.length) { const c = cls[k]; let j = k; while (j < text.length && cls[j] === c) j++;
    const seg = esc(text.slice(k, j)); out += c < 0 ? seg : `<span class="tj tj-${TJ_RULES[c]}">${seg}</span>`; k = j; }
  return out;
}
/* load the surah's tajweed data on demand, then redraw */
const _renderTJ = render;
render = function(){
  _renderTJ();
  const n = CUR && CUR.n;
  if (n && settings.tajweed && settings.script !== "ip" && !TJ[n])
    load("tj" + n, `data/tajweed/${p3(n)}.json?v=${DV}`).then(d => { TJ[n] = d; if (CUR && CUR.n === n) rerender(); }).catch(() => {});
};
function tajLegendHTML(){
  const lang = settings.lang === "en" ? "en" : "ur", seen = new Set();
  return `<ul class="tjkey">${TJ_RULES.filter(r => { const k = getComputedStyle(document.documentElement).getPropertyValue("--tj-" + r) || r; if (seen.has(TJ_NAMES[lang][r])) return false; seen.add(TJ_NAMES[lang][r]); return true; })
    .map(r => `<li><span class="tj tj-${r}">ـبـ</span> ${esc(TJ_NAMES[lang][r])}</li>`).join("")}</ul><p class="muted" style="font-size:12px">${T("tjSrc")}</p>`;
}
function tajSettingsHTML(){
  return `<span class="lbl">${T("tjSet")}</span>
    <div class="seg3"><button data-tj="1" aria-pressed="${!!settings.tajweed}">${T("show")}</button><button data-tj="0" aria-pressed="${!settings.tajweed}">${T("hide")}</button></div>
    ${settings.script === "ip" ? `<div style="font-size:12px;color:var(--muted)">${T("tjOnlyU")}</div>` : ""}
    <details class="tjd"><summary>${T("tjKey")}</summary>${tajLegendHTML()}</details>`;
}
$("#drBody").addEventListener("click", e => {
  const b = e.target.closest("[data-tj]"); if (!b) return;
  settings.tajweed = b.dataset.tj === "1"; saveSettings(); drawDrawer();
  if (settings.tajweed && settings.script === "ip") { settings.script = "uth"; saveSettings(); document.documentElement.classList.remove("ipk"); }
  if (CUR) rerender();
});
$("#main").addEventListener("click", e => {
  const b = e.target.closest("[data-tool=tj],[data-tool=tjkey]"); if (!b) return;
  if (b.dataset.tool === "tj") { settings.tajweed = !settings.tajweed; if (settings.tajweed && settings.script === "ip") { settings.script = "uth"; document.documentElement.classList.remove("ipk"); } saveSettings(); rerender(); }
  else { $("#sheetBody").innerHTML = `<h3 style="margin-top:0">${T("tjKey")}</h3>${tajLegendHTML()}`; openSheet(); }
});
