"use strict";
/* ---------- v42: shareable dua cards · 99 Names of Allah · Islamic (Hijri) calendar ---------- */
Object.assign(L.ur, { tlNames:"اسماء الحسنیٰ", tlCal:"اسلامی کیلنڈر", nmT:"اسماء الحسنیٰ", nmSub:"اللہ کے ۹۹ نام", nmLearned:(a)=>`${ud(a)} / ۹۹ یاد`, nmMark:"یاد ہو گیا", nmUnmark:"یاد ہے ✓", nmDay:"آج کا نام",
  nmNote:"ترتیب: ترمذی کی روایت کے مطابق مشہور فہرست۔ معانی مختصر ہیں — عالم کی نظرِ ثانی باقی", share:"شیئر", shareCard:"کارڈ شیئر کریں",
  calT:"اسلامی کیلنڈر", calSub:"ہجری مہینے · اہم دن", calUp:"آنے والے اہم دن", calIn:n=>n === 0 ? "آج" : n === 1 ? "کل" : `${ud(n)} دن میں`, calThis:"اس مہینے",
  calNote:"تاریخیں ام القریٰ حساب سے ہیں؛ پاکستان میں چاند دیکھنے پر ایک دن کا فرق ہو سکتا ہے۔ درستگی: نماز کے اوقات › ہجری تاریخ کی درستگی",
  wk:["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"],
  ev:{ ny:"اسلامی نیا سال (یکم محرم)", ash9:"عاشورہ کا روزہ (۹ محرم)", ash:"عاشورہ (۱۰ محرم) — روزہ", ram:"رمضان کا آغاز", last10:"آخری عشرہ — طاق راتوں میں لیلۃ القدر تلاش کریں", qadr:"آج کی رات طاق رات ہے — لیلۃ القدر تلاش کریں", fitr:"عید الفطر", shw:"شوال کے چھ روزے (عید کے بعد)", dh10:"ذوالحجہ کے پہلے دس دن", tarw:"حج کا آغاز (یوم الترویہ)", arafah:"یوم عرفہ — روزہ (حاجیوں کے علاوہ)", adha:"عید الاضحیٰ", tash:"ایامِ تشریق", bid:"ایامِ بیض — ۱۳، ۱۴، ۱۵ کے روزے" } });
Object.assign(L.en, { tlNames:"99 Names", tlCal:"Islamic calendar", nmT:"Asma ul Husna", nmSub:"The 99 Names of Allah", nmLearned:(a)=>`${a} / 99 learned`, nmMark:"Mark as learned", nmUnmark:"Learned ✓", nmDay:"Name of the day",
  nmNote:"Order: the well-known list narrated by at-Tirmidhi. Meanings are brief — scholar review pending", share:"Share", shareCard:"Share as card",
  calT:"Islamic calendar", calSub:"Hijri months · key days", calUp:"Coming up", calIn:n=>n === 0 ? "Today" : n === 1 ? "Tomorrow" : `in ${n} days`, calThis:"This month",
  calNote:"Dates follow the Umm al-Qura calculation; local moon sighting can differ by a day. Adjust in Prayer times › Hijri date adjustment",
  wk:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ev:{ ny:"Islamic New Year (1 Muharram)", ash9:"Ashura fast (9 Muharram)", ash:"Ashura (10 Muharram) — fast", ram:"Ramadan begins", last10:"Last ten nights — seek Laylat al-Qadr in the odd nights", qadr:"Tonight is an odd night — seek Laylat al-Qadr", fitr:"Eid al-Fitr", shw:"Six fasts of Shawwal (after Eid)", dh10:"First ten days of Dhul Hijjah", tarw:"Hajj begins (Day of Tarwiyah)", arafah:"Day of Arafah — fast (if not on Hajj)", adha:"Eid al-Adha", tash:"Days of Tashreeq", bid:"White days — fast on the 13th, 14th, 15th" } });
/* ===== 1. share any dua or zikr as a designed image ===== */
async function shareCard(o){   // { ar, tr, title, ref, file }
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const g = c.getContext("2d");
  try { await document.fonts.load('60px "Amiri Quran"'); await document.fonts.load('40px "Crimson Pro"'); await document.fonts.load('34px "Noto Nastaliq Urdu"'); } catch(e) {}
  const bg = g.createRadialGradient(540, 520, 60, 540, 600, 900); bg.addColorStop(0, "#1F3B40"); bg.addColorStop(1, "#0D1A1F"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1350);
  g.strokeStyle = "#D4AF5A"; g.lineWidth = 3; g.strokeRect(48, 48, 984, 1254); g.globalAlpha = .4; g.strokeRect(62, 62, 956, 1226); g.globalAlpha = 1;
  const wrap = (text, font, maxW, rtl) => { g.font = font; g.direction = rtl ? "rtl" : "ltr"; const words = text.split(/\s+/), lines = []; let cur = "";
    for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; };
  const urT = /[؀-ۿ]/.test(o.tr || ""), trF = s => `${s}px ${urT ? '"Noto Nastaliq Urdu"' : '"Crimson Pro"'}, serif`, trLH = urT ? 2.1 : 1.45;
  let size = o.size || 64, arL; do { arL = wrap(o.ar, `${size}px "Amiri Quran", serif`, 900, true); if (arL.length * size * 1.9 < 600) break; size -= 3; } while (size > 26);
  let ts = urT ? 34 : 36, trL = []; if (o.tr) do { trL = wrap(o.tr, trF(ts), 880, urT); if (trL.length * ts * trLH < 360) break; ts -= 2; } while (ts > 18);
  const arH = arL.length * size * 1.9, trH = trL.length * ts * trLH, top = Math.max(150, (1350 - arH - trH - 300) / 2);
  g.textAlign = "center";
  if (o.title) { g.direction = /[؀-ۿ]/.test(o.title) ? "rtl" : "ltr"; g.fillStyle = "#D4AF5A"; g.font = /[؀-ۿ]/.test(o.title) ? '30px "Noto Nastaliq Urdu", serif' : '600 32px "Crimson Pro", serif'; g.fillText(o.title, 540, 128); }
  g.fillStyle = "#F3EDE0"; g.direction = "rtl"; g.font = `${size}px "Amiri Quran", serif`; arL.forEach((l, i) => g.fillText(l, 540, top + size * 1.3 + i * size * 1.9));
  let y = top + arH + 40;
  if (trL.length) { g.fillStyle = "#D4AF5A"; g.fillRect(470, y, 140, 2); y += 60; g.fillStyle = "#C9D6D2"; g.direction = urT ? "rtl" : "ltr"; g.font = trF(ts); trL.forEach((l, i) => g.fillText(l, 540, y + i * ts * trLH)); }
  g.direction = /[؀-ۿ]/.test(o.ref || "") ? "rtl" : "ltr"; g.fillStyle = "#D4AF5A"; g.font = /[؀-ۿ]/.test(o.ref || "") ? '28px "Noto Nastaliq Urdu", serif' : '600 30px "Crimson Pro", serif'; if (o.ref) g.fillText(o.ref, 540, 1180);
  g.direction = "ltr"; g.fillStyle = "#9DB0AE"; g.font = '30px "Crimson Pro", serif'; g.fillText("qurantosoul.com", 540, 1240);
  const blob = await new Promise(r => c.toBlob(r, "image/png")), file = new File([blob], (o.file || "qurantosoul") + ".png", { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text: "https://qurantosoul.com" }); return; } catch(e) { if (e.name === "AbortError") return; } }
  const u = URL.createObjectURL(blob), l = document.createElement("a"); l.href = u; l.download = file.name; l.click(); setTimeout(() => URL.revokeObjectURL(u), 4000);
}
const SHARE_ICO = `<svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>`;
const shareBtn = attr => `<button class="btn ghost sh-btn" ${attr}>${SHARE_ICO} ${T("share")}</button>`;
/* Duas page: Quranic and masnoon duas */
new MutationObserver(() => {
  document.querySelectorAll("#duas article.dua:not([data-shb])").forEach(d => {
    d.dataset.shb = 1; const at = d.querySelector(".wd-actions") || d.querySelector(".ctr");
    if (at) at.insertAdjacentHTML("beforeend", shareBtn('data-dshare="1"')); else d.insertAdjacentHTML("beforeend", `<div class="wd-actions">${shareBtn('data-dshare="1"')}</div>`);
  });
}).observe($("#duas"), { childList: true, subtree: true });
$("#duas").addEventListener("click", e => {
  const b = e.target.closest("[data-dshare]"); if (!b) return; e.stopPropagation();
  const d = b.closest("article.dua"), tx = s => (d.querySelector(s) || {}).textContent || "";
  shareCard({ ar: tx(".dar").trim(), tr: tx(".dtr").trim(), title: tx(".dh b").trim(), ref: tx(".who").trim(), file: "dua" });
}, true);
/* Azkar cards */
new MutationObserver(() => {
  document.querySelectorAll("#azkar .az-card:not([data-shb])").forEach(c => {
    c.dataset.shb = 1; const k = c.querySelector("[data-azc]"); if (!k) return;
    const f = c.querySelector(".az-foot"); if (f) f.insertAdjacentHTML("beforeend", shareBtn(`data-azshare="${k.dataset.azc}"`));
  });
}).observe($("#azkar"), { childList: true, subtree: true });
$("#azkar").addEventListener("click", async e => {
  const b = e.target.closest("[data-azshare]"); if (!b) return; e.stopPropagation();
  const id = b.dataset.azshare.slice(1), it = AZ.find(x => String(x[0]) === id); if (!it) return;
  const [, , src, n, ref, fur, fen] = it, en = AZS.trl === "en", ws = await azWords(it);
  let tr = en ? fen : fur;
  if (typeof src !== "string") { const d = await DATA.surah(src[0]); tr = d.ayahs.slice(src[1] - 1, src[2]).map(A => en ? (A.en2 || A.en) : A.ur).join(" "); }
  const refT = typeof src !== "string" ? `${surahName(src[0])} ${src[0]}:${src[1]}${src[2] !== src[1] ? "–" + src[2] : ""}` : ref;
  shareCard({ ar: ws.map(w => w[0]).join(" "), tr, title: n > 1 ? (en ? `${n} times` : `${ud(n)} بار`) : "", ref: refT, file: "zikr" });
}, true);
/* ===== 2. the 99 Names ===== */
const NAMES = [
["الرَّحْمٰنُ","Ar-Rahman","The Most Gracious","بے حد مہربان"],["الرَّحِيمُ","Ar-Rahim","The Most Merciful","نہایت رحم کرنے والا"],["الْمَلِكُ","Al-Malik","The King","بادشاہ"],["الْقُدُّوسُ","Al-Quddus","The Most Holy","نہایت پاک"],
["السَّلَامُ","As-Salam","The Source of Peace","سلامتی دینے والا"],["الْمُؤْمِنُ","Al-Mu'min","The Giver of Security","امن دینے والا"],["الْمُهَيْمِنُ","Al-Muhaymin","The Guardian","نگہبان"],["الْعَزِيزُ","Al-Aziz","The Almighty","غالب"],
["الْجَبَّارُ","Al-Jabbar","The Compeller","زبردست"],["الْمُتَكَبِّرُ","Al-Mutakabbir","The Supreme in Greatness","بڑائی والا"],["الْخَالِقُ","Al-Khaliq","The Creator","پیدا کرنے والا"],["الْبَارِئُ","Al-Bari'","The Maker","ٹھیک ٹھیک بنانے والا"],
["الْمُصَوِّرُ","Al-Musawwir","The Fashioner","صورت بنانے والا"],["الْغَفَّارُ","Al-Ghaffar","The Ever-Forgiving","بہت بخشنے والا"],["الْقَهَّارُ","Al-Qahhar","The Subduer","سب پر غالب"],["الْوَهَّابُ","Al-Wahhab","The Bestower","بہت عطا کرنے والا"],
["الرَّزَّاقُ","Ar-Razzaq","The Provider","رزق دینے والا"],["الْفَتَّاحُ","Al-Fattah","The Opener, the Judge","کھولنے والا، فیصلہ کرنے والا"],["الْعَلِيمُ","Al-Alim","The All-Knowing","سب کچھ جاننے والا"],["الْقَابِضُ","Al-Qabid","The Withholder","تنگی کرنے والا"],
["الْبَاسِطُ","Al-Basit","The Extender","کشادگی دینے والا"],["الْخَافِضُ","Al-Khafid","The Abaser","پست کرنے والا"],["الرَّافِعُ","Ar-Rafi'","The Exalter","بلند کرنے والا"],["الْمُعِزُّ","Al-Mu'izz","The Giver of Honour","عزت دینے والا"],
["الْمُذِلُّ","Al-Mudhill","The Giver of Dishonour","ذلت دینے والا"],["السَّمِيعُ","As-Sami'","The All-Hearing","سب کچھ سننے والا"],["الْبَصِيرُ","Al-Basir","The All-Seeing","سب کچھ دیکھنے والا"],["الْحَكَمُ","Al-Hakam","The Judge","فیصلہ کرنے والا"],
["الْعَدْلُ","Al-Adl","The Utterly Just","سراپا عدل"],["اللَّطِيفُ","Al-Latif","The Subtle, the Kind","باریک بین، مہربان"],["الْخَبِيرُ","Al-Khabir","The All-Aware","پوری خبر رکھنے والا"],["الْحَلِيمُ","Al-Halim","The Forbearing","بردبار"],
["الْعَظِيمُ","Al-Azim","The Magnificent","عظمت والا"],["الْغَفُورُ","Al-Ghafur","The All-Forgiving","بخشنے والا"],["الشَّكُورُ","Ash-Shakur","The Appreciative","قدر دان"],["الْعَلِيُّ","Al-Aliyy","The Most High","بلند و برتر"],
["الْكَبِيرُ","Al-Kabir","The Most Great","سب سے بڑا"],["الْحَفِيظُ","Al-Hafiz","The Preserver","حفاظت کرنے والا"],["الْمُقِيتُ","Al-Muqit","The Sustainer","روزی پہنچانے والا"],["الْحَسِيبُ","Al-Hasib","The Reckoner","حساب لینے والا"],
["الْجَلِيلُ","Al-Jalil","The Majestic","جلال والا"],["الْكَرِيمُ","Al-Karim","The Most Generous","کرم والا"],["الرَّقِيبُ","Ar-Raqib","The Watchful","نگرانی کرنے والا"],["الْمُجِيبُ","Al-Mujib","The Responsive","دعا قبول کرنے والا"],
["الْوَاسِعُ","Al-Wasi'","The All-Encompassing","وسعت والا"],["الْحَكِيمُ","Al-Hakim","The All-Wise","حکمت والا"],["الْوَدُودُ","Al-Wadud","The Loving","محبت کرنے والا"],["الْمَجِيدُ","Al-Majid","The Glorious","بزرگی والا"],
["الْبَاعِثُ","Al-Ba'ith","The Resurrector","مردوں کو اٹھانے والا"],["الشَّهِيدُ","Ash-Shahid","The Witness","گواہ"],["الْحَقُّ","Al-Haqq","The Truth","حق"],["الْوَكِيلُ","Al-Wakil","The Trustee","کارساز"],
["الْقَوِيُّ","Al-Qawiyy","The All-Strong","قوت والا"],["الْمَتِينُ","Al-Matin","The Firm","مضبوط"],["الْوَلِيُّ","Al-Waliyy","The Protecting Friend","دوست اور مددگار"],["الْحَمِيدُ","Al-Hamid","The Praiseworthy","تعریف کے لائق"],
["الْمُحْصِي","Al-Muhsi","The Accounter","ہر چیز کا شمار رکھنے والا"],["الْمُبْدِئُ","Al-Mubdi'","The Originator","پہلی بار پیدا کرنے والا"],["الْمُعِيدُ","Al-Mu'id","The Restorer","دوبارہ پیدا کرنے والا"],["الْمُحْيِي","Al-Muhyi","The Giver of Life","زندگی دینے والا"],
["الْمُمِيتُ","Al-Mumit","The Bringer of Death","موت دینے والا"],["الْحَيُّ","Al-Hayy","The Ever-Living","ہمیشہ زندہ"],["الْقَيُّومُ","Al-Qayyum","The Self-Subsisting","سب کو قائم رکھنے والا"],["الْوَاجِدُ","Al-Wajid","The Finder","پانے والا"],
["الْمَاجِدُ","Al-Majid","The Noble","بزرگ"],["الْوَاحِدُ","Al-Wahid","The One","ایک"],["الْأَحَدُ","Al-Ahad","The Unique","یکتا"],["الصَّمَدُ","As-Samad","The Eternal Refuge","بے نیاز"],
["الْقَادِرُ","Al-Qadir","The Able","قدرت والا"],["الْمُقْتَدِرُ","Al-Muqtadir","The All-Powerful","پوری قدرت والا"],["الْمُقَدِّمُ","Al-Muqaddim","The Expediter","آگے کرنے والا"],["الْمُؤَخِّرُ","Al-Mu'akhkhir","The Delayer","پیچھے کرنے والا"],
["الْأَوَّلُ","Al-Awwal","The First","سب سے پہلا"],["الْآخِرُ","Al-Akhir","The Last","سب سے آخری"],["الظَّاهِرُ","Az-Zahir","The Manifest","ظاہر"],["الْبَاطِنُ","Al-Batin","The Hidden","پوشیدہ"],
["الْوَالِي","Al-Wali","The Governor","کارساز حاکم"],["الْمُتَعَالِي","Al-Muta'ali","The Most Exalted","بہت بلند"],["الْبَرُّ","Al-Barr","The Source of Goodness","بھلائی کرنے والا"],["التَّوَّابُ","At-Tawwab","The Accepter of Repentance","توبہ قبول کرنے والا"],
["الْمُنْتَقِمُ","Al-Muntaqim","The Avenger","بدلہ لینے والا"],["الْعَفُوُّ","Al-Afuww","The Pardoner","معاف کرنے والا"],["الرَّءُوفُ","Ar-Ra'uf","The Most Kind","نہایت شفیق"],["مَالِكُ الْمُلْكِ","Malik-ul-Mulk","Owner of All Sovereignty","بادشاہی کا مالک"],
["ذُو الْجَلَالِ وَالْإِكْرَامِ","Dhul-Jalali wal-Ikram","Lord of Majesty and Honour","جلال اور عزت والا"],["الْمُقْسِطُ","Al-Muqsit","The Equitable","انصاف کرنے والا"],["الْجَامِعُ","Al-Jami'","The Gatherer","جمع کرنے والا"],["الْغَنِيُّ","Al-Ghaniyy","The Self-Sufficient","بے پروا، غنی"],
["الْمُغْنِي","Al-Mughni","The Enricher","غنی کرنے والا"],["الْمَانِعُ","Al-Mani'","The Preventer","روکنے والا"],["الضَّارُّ","Ad-Darr","The Bringer of Harm (by His wisdom)","نقصان پہنچانے والا (اپنی حکمت سے)"],["النَّافِعُ","An-Nafi'","The Bringer of Benefit","نفع پہنچانے والا"],
["النُّورُ","An-Nur","The Light","نور"],["الْهَادِي","Al-Hadi","The Guide","ہدایت دینے والا"],["الْبَدِيعُ","Al-Badi'","The Incomparable Originator","بے مثال پیدا کرنے والا"],["الْبَاقِي","Al-Baqi","The Everlasting","ہمیشہ باقی رہنے والا"],
["الْوَارِثُ","Al-Warith","The Inheritor","سب کا وارث"],["الرَّشِيدُ","Ar-Rashid","The Guide to the Right Path","سیدھی راہ دکھانے والا"],["الصَّبُورُ","As-Sabur","The Most Patient","بڑا صبر والا"]];
const NMS = Object.assign({ k: {}, open: null }, store.get("names", {}));
const nmSave = () => store.set("names", NMS);
const nmMean = x => settings.lang === "en" ? x[2] : x[3];
function nameCard(x, i, big){
  const on = NMS.k[i + 1];
  return `<button class="nm${on ? " ok" : ""}${big ? " big" : ""}" data-nm="${i + 1}"><i>${nf(i + 1)}</i><b>${esc(x[0])}</b><span class="nm-t" dir="ltr">${esc(x[1])}</span><span class="nm-m${settings.lang === "en" ? "" : " ur"}">${esc(nmMean(x))}</span>${on ? `<em>✓</em>` : ""}</button>`;
}
function renderNames(){
  const n = Object.keys(NMS.k).length, op = NMS.open;
  $("#namesv").innerHTML = `<div class="nm-head"><b>${T("nmLearned", nf(n))}</b><i class="c1-bar"><em style="width:${n / 99 * 100}%"></em></i></div>
    ${op ? `<div class="nm-detail">${nameCard(NAMES[op - 1], op - 1, true)}<p class="nm-en" dir="ltr">${esc(NAMES[op - 1][1])} — ${esc(NAMES[op - 1][2])}</p><p class="nm-ur ur">${esc(NAMES[op - 1][3])}</p>
      <div class="wd-actions" style="justify-content:center"><button class="btn${NMS.k[op] ? " ghost" : ""}" data-nmk="${op}">${NMS.k[op] ? T("nmUnmark") : T("nmMark")}</button>${shareBtn(`data-nmshare="${op}"`)}</div></div>` : ""}
    <div class="nm-grid">${NAMES.map((x, i) => nameCard(x, i)).join("")}</div><p class="draft">${T("nmNote")}</p>`;
}
$("#namesv").addEventListener("click", e => {
  const k = e.target.closest("[data-nmk]"); if (k) { const i = +k.dataset.nmk; if (NMS.k[i]) delete NMS.k[i]; else NMS.k[i] = 1; nmSave(); renderNames(); return; }
  const s = e.target.closest("[data-nmshare]"); if (s) { const x = NAMES[+s.dataset.nmshare - 1]; shareCard({ ar: x[0], tr: settings.lang === "en" ? `${x[1]} — ${x[2]}` : `${x[3]}  ·  ${x[1]}`, size: 130, title: T("nmT"), ref: `${nf(+s.dataset.nmshare)} / ${nf(99)}`, file: "asma-ul-husna-" + s.dataset.nmshare }); return; }
  const c = e.target.closest("[data-nm]"); if (c) { const i = +c.dataset.nm; NMS.open = NMS.open === i ? null : i; nmSave(); renderNames(); if (NMS.open) $("#namesv").scrollIntoView({ block: "start" }); }
});
/* ===== 3. Islamic calendar ===== */
const HF = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { day: "numeric", month: "numeric", year: "numeric" });
function hOf(dt){ const d = new Date(dt.getTime() + (PS.hadj || 0) * 864e5), p = HF.formatToParts(d), g = k => +((p.find(x => x.type === k) || {}).value || "0").replace(/\D/g, ""); return { d: g("day"), m: g("month"), y: g("year") }; }
const H_UR = ["محرم", "صفر", "ربیع الاول", "ربیع الثانی", "جمادی الاول", "جمادی الثانی", "رجب", "شعبان", "رمضان", "شوال", "ذوالقعدہ", "ذوالحجہ"];
const H_EN = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Akhirah", "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhul Qadah", "Dhul Hijjah"];
const hMonth = m => (settings.lang === "en" ? H_EN : H_UR)[m - 1];
function hEvents(h){
  const E = T("ev"), out = [], m = h.m, d = h.d;
  if (m === 1 && d === 1) out.push(["ny", 1]); if (m === 1 && d === 9) out.push(["ash9", 1]); if (m === 1 && d === 10) out.push(["ash", 1]);
  if (m === 9 && d === 1) out.push(["ram", 1]); if (m === 9 && d === 20) out.push(["last10", 1]); if (m === 9 && d >= 20 && d <= 28 && d % 2 === 0) out.push(["qadr", 0]);
  if (m === 10 && d === 1) out.push(["fitr", 1]); if (m === 10 && d === 2) out.push(["shw", 0]);
  if (m === 12 && d === 1) out.push(["dh10", 1]); if (m === 12 && d === 8) out.push(["tarw", 0]); if (m === 12 && d === 9) out.push(["arafah", 1]); if (m === 12 && d === 10) out.push(["adha", 1]); if (m === 12 && d === 11) out.push(["tash", 0]);
  if (d === 13 && m !== 12 && m !== 9) out.push(["bid", 0]);
  return out.map(([k, big]) => ({ k, big, t: E[k] }));   // 20 Ramadan evening begins the 21st night; even dates' evenings are the odd nights
}
const CALS = { off: 0 };
const dayAdd = (dt, n) => { const x = new Date(dt); x.setDate(x.getDate() + n); return x; };
function monthStart(off){
  let dt = new Date(); dt.setHours(12, 0, 0, 0);
  while (hOf(dt).d !== 1) dt = dayAdd(dt, -1);
  for (let k = 0; k < Math.abs(off); k++) { if (off > 0) { dt = dayAdd(dt, 29); while (hOf(dt).d !== 1) dt = dayAdd(dt, 1); } else { dt = dayAdd(dt, -1); while (hOf(dt).d !== 1) dt = dayAdd(dt, -1); } }
  return dt;
}
function renderCal(){
  const st = monthStart(CALS.off), h0 = hOf(st), days = []; let dt = st;
  while (hOf(dt).m === h0.m) { days.push(dt); dt = dayAdd(dt, 1); }
  const today = new Date().toDateString(), gf = new Intl.DateTimeFormat(settings.lang === "en" ? "en-GB" : "ur-PK", { month: "short" });
  const lead = st.getDay(), wk = T("wk"), list = [];
  const cells = Array(lead).fill(`<span class="cd pad"></span>`).concat(days.map(x => { const h = hOf(x), ev = hEvents(h); ev.forEach(e => list.push([x, h, e]));
    return `<span class="cd${x.toDateString() === today ? " now" : ""}${ev.some(e => e.big) ? " ev" : ev.length ? " ev2" : ""}${x.getDay() === 5 ? " fri" : ""}"><b>${nf(h.d)}</b><small>${nf(x.getDate())}${x.getDate() === 1 || x === st ? " " + esc(gf.format(x)) : ""}</small></span>`; }));
  /* coming up: next 8 key days in the next year */
  const up = []; let x = new Date(); x.setHours(12, 0, 0, 0);
  for (let i = 0; i < 380 && up.length < 8; i++) { const h = hOf(x); hEvents(h).filter(e => e.big).forEach(e => up.push([new Date(x), h, e, i])); x = dayAdd(x, 1); }
  const gFull = new Intl.DateTimeFormat(settings.lang === "en" ? "en-GB" : "ur-PK", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  $("#calv").innerHTML = `<div class="cal-nav"><button class="iconbtn" data-cal="-1" aria-label="‹">‹</button><div><b>${esc(hMonth(h0.m))} ${nf(h0.y)} ${settings.lang === "en" ? "AH" : "ھ"}</b><small>${esc(new Intl.DateTimeFormat(settings.lang === "en" ? "en-GB" : "ur-PK", { month: "long", year: "numeric" }).format(st))} – ${esc(new Intl.DateTimeFormat(settings.lang === "en" ? "en-GB" : "ur-PK", { month: "long" }).format(days[days.length - 1]))}</small></div><button class="iconbtn" data-cal="1" aria-label="›">›</button></div>
    ${CALS.off ? `<p style="text-align:center;margin:0 0 8px"><button class="linkbtn" data-cal="0">${settings.lang === "en" ? "Today" : "آج"}</button></p>` : ""}
    <div class="cal-grid">${wk.map(w => `<span class="wh">${esc(w)}</span>`).join("")}${cells.join("")}</div>
    ${list.length ? `<h3 class="cal-h">${T("calThis")}</h3><ul class="cal-list">${list.map(([g, h, e]) => `<li class="${e.big ? "big" : ""}"><b>${nf(h.d)} ${esc(hMonth(h.m))}</b><span>${esc(e.t)}</span><small>${esc(gFull.format(g))}</small></li>`).join("")}</ul>` : ""}
    <h3 class="cal-h">${T("calUp")}</h3><ul class="cal-list">${up.map(([g, h, e, n]) => `<li class="big"><b>${esc(e.t)}</b><span>${nf(h.d)} ${esc(hMonth(h.m))} ${nf(h.y)} · ${esc(gFull.format(g))}</span><small>${T("calIn", n)}</small></li>`).join("")}</ul>
    <p class="draft">${T("calNote")}</p>`;
}
$("#calv").addEventListener("click", e => { const b = e.target.closest("[data-cal]"); if (!b) return; const v = +b.dataset.cal; CALS.off = v === 0 ? 0 : CALS.off + v; renderCal(); });
/* ===== views, dashboard tiles, name of the day ===== */
VIEWS.names = { el: "#namesv", title: () => [T("nmT"), T("nmSub")], render: renderNames };
VIEWS.calendar = { el: "#calv", title: () => [T("calT"), T("calSub")], render: renderCal };
SUBPAGES.names = 1; SUBPAGES.calendar = 1;
NAV.names = ["tlNames", "#6A4C9C", `<path d="M12 3l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 15.1l-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z"/>`];
NAV.calendar = ["tlCal", "#2E7D8C", `<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M14.5 12.6a2.8 2.8 0 1 0 0 5 3.3 3.3 0 1 1 0-5z"/>`];
const _renderHomeN = renderHome;
renderHome = async function(){
  const r = await _renderHomeN();
  if (!$("#home .nm-day")) {
    const i = Math.floor(Date.now() / 864e5) % 99, x = NAMES[i], grid = $("#home .qa-grid");
    const html = `<button class="hm-card nm-day" data-open="names" data-nmday="${i + 1}"><small>${T("nmDay")}</small><b>${esc(x[0])}</b><span dir="ltr">${esc(x[1])}</span><span class="${settings.lang === "en" ? "" : "ur"}">${esc(nmMean(x))}</span></button>`;
    if (grid) grid.insertAdjacentHTML("afterend", html); else $("#home").insertAdjacentHTML("beforeend", html);
  }
  return r;
};
VIEWS.home.render = renderHome;
document.addEventListener("click", e => { const d = e.target.closest("[data-nmday]"); if (d) { NMS.open = +d.dataset.nmday; nmSave(); } }, true);
