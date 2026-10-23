"use strict";
/* ---------- v46: Zakat calculator · Hadith (40 Hadith of Imam Nawawi, Hadith in Tafsir from Sahih al-Bukhari) ---------- */
Object.assign(L.ur, { tlZakat:"زکوٰۃ", tlHadith:"حدیث",
  zkT:"زکوٰۃ کیلکولیٹر", zkSub:"حنفی طریقہ · پاکستان", zkPrices:"آج کے نرخ (فی تولہ)", zkGoldP:"سونا ۲۴ قیراط", zkSilverP:"چاندی", zkPriceHint:"اپنے شہر کی صرافہ مارکیٹ کا آج کا نرخ لکھیں",
  zkGold:"سونا", zkSilver:"چاندی", zkWeight:"وزن", zkTola:"تولہ", zkGram:"گرام", zkKarat:"قیراط",
  zkMoney:"نقدی اور مال", zkCash:"گھر میں نقدی", zkBank:"بینک اکاؤنٹس", zkRecv:"دیا ہوا قرض (جو واپس ملنے کی امید ہو)", zkStock:"کاروباری مال (فروخت کی قیمت پر)", zkInv:"شیئرز، میوچل فنڈ، پرائز بانڈ (موجودہ قیمت)", zkOther:"دیگر قابلِ زکوٰۃ مال",
  zkLess:"منہا کریں", zkDebt:"فوری واجب الادا قرض اور بل", zkBankDed:"بینک نے اس سال جو زکوٰۃ کاٹی",
  zkBasis:"نصاب کس سے؟", zkAuto:"خودکار (حنفی)", zkBySilver:"چاندی (۵۲.۵ تولہ)", zkByGold:"سونا (۷.۵ تولہ)",
  zkAssets:"کل قابلِ زکوٰۃ مال", zkNet:"قرض منہا کرنے کے بعد", zkNisab:"نصاب", zkDue:"واجب زکوٰۃ (۲.۵٪)", zkPay:"ادا کرنی ہے", zkBelow:"آپ کا مال نصاب سے کم ہے — زکوٰۃ واجب نہیں", zkNeedP:"نصاب معلوم کرنے کے لیے چاندی (یا سونے) کا نرخ لکھیں",
  zkOnlyGold:"صرف سونا ہے، کوئی اور قابلِ زکوٰۃ مال نہیں — اس لیے سونے کا نصاب لگا", zkMixed:"مختلف قسم کا مال ہے — اس لیے چاندی کا نصاب لگا",
  zkDate:"میری زکوٰۃ کی تاریخ", zkDateHint:"جس دن آپ پہلی بار صاحبِ نصاب ہوئے؛ ہر قمری سال اسی دن حساب کریں", zkNext:(d, n)=>`اگلی تاریخ: ${d} (${n})`,
  zkWho:"زکوٰۃ کن کو دی جائے (التوبہ ۹:۶۰)", zkWhoL:["فقراء — جن کے پاس ضرورت سے کم ہو","مساکین — جن کے پاس کچھ نہ ہو","زکوٰۃ جمع کرنے والے کارکن","جن کے دل جوڑنے ہوں","غلاموں کی آزادی","قرض دار","اللہ کی راہ میں","مسافر جو سفر میں محتاج ہو"], zkOpenAyah:"آیت کھولیں",
  zkClear:"سب صاف کریں", zkNote:"یہ کیلکولیٹر پاکستان میں عام حنفی طریقے پر ہے: سونا، چاندی، نقدی، کاروباری مال اور سرمایہ کاری ملا کر، فوری قرض منہا کر کے، نصاب پورا ہو تو ۲.۵٪۔ استعمال کا زیور بھی شامل ہے (حنفی)۔ فصل (عشر)، مویشی یا پیچیدہ کاروباری صورت ہو تو کسی عالم سے پوچھ لیں۔ آپ کے اعداد صرف اسی فون پر محفوظ رہتے ہیں۔",
  hdT:"حدیث", hdSub:"اربعین نووی · صحیح بخاری (کتاب التفسیر)", hdTabN:"چالیس حدیثیں", hdTabB:"تفسیر میں حدیث", hdLearned:a=>`${ud(a)} / ۴۲ یاد`, hdMark:"یاد ہو گئی", hdUnmark:"یاد ہے ✓", hdDay:"آج کی حدیث",
  hdNoteN:"عربی متن: امام نوویؒ کی الاربعین۔ ترجمہ ہمارے آسان الفاظ میں؛ ماخذ اور درجہ ہر حدیث کے ساتھ۔", hdPick:"سورت چنیں", hdCount:n=>`${ud(n)} احادیث`, hdAyahOnly:k=>`صرف آیت ${k} کی احادیث`, hdAll:"سورت کی سب احادیث", hdMore:"پورا متن", hdLess:"کم",
  hdNoteB:"صحیح بخاری، کتاب التفسیر کا عربی متن (۴۹۹ احادیث)۔ آیت کا ربط ان الفاظ سے خود بنایا گیا ہے جو حدیث میں قرآن سے نقل ہیں — جہاں آیت واضح نہیں وہاں صرف سورت دی ہے۔ ترجمہ sunnah.com پر پڑھیں۔", hdSunnah:"ترجمہ sunnah.com پر", hdAyahBtn:n=>`حدیث (${ud(n)})`, hdSurahOnly:"سورت" });
Object.assign(L.en, { tlZakat:"Zakat", tlHadith:"Hadith",
  zkT:"Zakat calculator", zkSub:"Hanafi method", zkPrices:"Today's rates (per tola)", zkGoldP:"Gold 24k", zkSilverP:"Silver", zkPriceHint:"Enter today's local market rate",
  zkGold:"Gold", zkSilver:"Silver", zkWeight:"Weight", zkTola:"tola", zkGram:"gram", zkKarat:"Karat",
  zkMoney:"Cash and assets", zkCash:"Cash at home", zkBank:"Bank accounts", zkRecv:"Money lent (expected back)", zkStock:"Business stock (at sale value)", zkInv:"Shares, mutual funds, prize bonds (current value)", zkOther:"Other zakatable assets",
  zkLess:"Deduct", zkDebt:"Debts and bills due now", zkBankDed:"Zakat already deducted by your bank this year",
  zkBasis:"Nisab by", zkAuto:"Auto (Hanafi)", zkBySilver:"Silver (52.5 tola)", zkByGold:"Gold (7.5 tola)",
  zkAssets:"Total zakatable assets", zkNet:"After deducting debts", zkNisab:"Nisab", zkDue:"Zakat due (2.5%)", zkPay:"To pay", zkBelow:"Your wealth is below the nisab — zakat is not due", zkNeedP:"Enter the silver (or gold) rate to work out the nisab",
  zkOnlyGold:"You own only gold and no other zakatable assets, so the gold nisab applies", zkMixed:"You own mixed assets, so the silver nisab applies",
  zkDate:"My zakat date", zkDateHint:"The day you first owned the nisab; calculate on this day every lunar year", zkNext:(d, n)=>`Next: ${d} (${n})`,
  zkWho:"Who receives zakat (at-Tawbah 9:60)", zkWhoL:["The poor — who have less than they need","The needy — who have nothing","Those who collect zakat","Those whose hearts are to be won over","Freeing slaves","People in debt","In the way of Allah","The stranded traveller"], zkOpenAyah:"Open the ayah",
  zkClear:"Clear all", zkNote:"This calculator follows the common Hanafi method: gold, silver, cash, business stock and investments are added together, debts due now are deducted, and 2.5% is due if the nisab is reached. Jewellery in use is included (Hanafi). For crops (ushr), livestock or complex business cases, ask a scholar. Your figures stay only on this phone.",
  hdT:"Hadith", hdSub:"40 Hadith of Nawawi · Sahih al-Bukhari (Tafsir)", hdTabN:"40 Hadith", hdTabB:"Hadith in Tafsir", hdLearned:a=>`${a} / 42 learned`, hdMark:"Mark as learned", hdUnmark:"Learned ✓", hdDay:"Hadith of the day",
  hdNoteN:"Arabic text: Imam Nawawi's al-Arba'in. Translation in our own simple words; source and grading with each hadith.", hdPick:"Choose a surah", hdCount:n=>`${n} hadith`, hdAyahOnly:k=>`Only hadith on ayah ${k}`, hdAll:"All hadith of the surah", hdMore:"Full text", hdLess:"Less",
  hdNoteB:"Arabic text of Sahih al-Bukhari, Book of Tafsir (499 hadith). Ayahs are linked automatically from the Quran words each hadith quotes — where the ayah is not clear, only the surah is given. Read a translation on sunnah.com.", hdSunnah:"Translation on sunnah.com", hdAyahBtn:n=>`Hadith (${n})`, hdSurahOnly:"Surah" });

/* ===================== ZAKAT ===================== */
const TOLA = 11.664;
const ZK0 = { gp:"", sp:"", gw:"", gu:"tola", gk:"24", sw:"", su:"tola", cash:"", bank:"", recv:"", stock:"", inv:"", other:"", debt:"", bankded:"", basis:"auto", date:"" };
let ZK = Object.assign({}, ZK0, store.get("zakat", {}));
const zkSave = () => store.set("zakat", ZK);
const zn = v => { const x = parseFloat(String(v || "").replace(/[^\d.]/g, "")); return isFinite(x) ? x : 0; };
const zMoney = v => { const s = Math.round(v).toLocaleString("en-PK"); return (settings.lang === "en" ? "Rs " : "روپے ") + (settings.lang === "en" ? s : ud(s)); };
function zkCalc(){
  const g = zn(ZK.gw) * (ZK.gu === "gram" ? 1 : TOLA), s = zn(ZK.sw) * (ZK.su === "gram" ? 1 : TOLA);
  const gv = g * (zn(ZK.gk) / 24) * zn(ZK.gp) / TOLA, sv = s * zn(ZK.sp) / TOLA;
  const other = ["cash", "bank", "recv", "stock", "inv", "other"].reduce((a, k) => a + zn(ZK[k]), 0);
  const assets = gv + sv + other, net = Math.max(0, assets - zn(ZK.debt));
  let basis = ZK.basis, why = "";
  if (basis === "auto") { const onlyGold = g > 0 && sv === 0 && other === 0; basis = onlyGold ? "gold" : "silver"; why = onlyGold ? T("zkOnlyGold") : (assets > 0 ? T("zkMixed") : ""); }
  const nisab = basis === "gold" ? 7.5 * zn(ZK.gp) : 52.5 * zn(ZK.sp);
  const due = nisab > 0 && net >= nisab ? net * 0.025 : 0;
  return { gv, sv, assets, net, nisab, basis, why, due, pay: Math.max(0, due - zn(ZK.bankded)), noPrice: nisab === 0 };
}
function zkResult(){
  const r = zkCalc(), row = (k, v, cls = "") => `<div class="zk-r ${cls}"><span>${T(k)}</span><b>${v}</b></div>`;
  let body = row("zkAssets", zMoney(r.assets)) + row("zkNet", zMoney(r.net)) + row("zkNisab", r.noPrice ? "—" : zMoney(r.nisab));
  if (r.noPrice) body += `<p class="zk-msg">${T("zkNeedP")}</p>`;
  else if (r.due > 0) { body += row("zkDue", zMoney(r.due), "big"); if (zn(ZK.bankded) > 0) body += row("zkPay", zMoney(r.pay), "big"); }
  else if (r.assets > 0) body += `<p class="zk-msg">${T("zkBelow")}</p>`;
  if (r.why && !r.noPrice) body += `<p class="zk-why">${esc(r.why)}</p>`;
  return body;
}
function zkNextDate(){
  if (!ZK.date || typeof hOf !== "function") return "";
  const d0 = new Date(ZK.date + "T12:00:00"); if (isNaN(d0)) return "";
  const h = hOf(d0); let x = new Date(); x.setHours(12, 0, 0, 0);
  for (let i = 0; i < 400; i++) { const k = hOf(x); if (k.d === h.d && k.m === h.m) {
      const f = new Intl.DateTimeFormat(settings.lang === "en" ? "en-GB" : "ur-PK", { day: "numeric", month: "long", year: "numeric" }).format(x);
      return T("zkNext", `${nf(h.d)} ${hMonth(h.m)} · ${f}`, T("calIn", i)); }
    x = new Date(x.getTime() + 864e5); }
  return "";
}
function renderZakat(){
  const inp = (k, lab, ph = "0") => `<label class="zk-f"><span>${T(lab)}</span><input inputmode="decimal" data-zk="${k}" value="${esc(ZK[k])}" placeholder="${ph}"></label>`;
  const unit = k => `<select data-zk="${k}"><option value="tola"${ZK[k] === "tola" ? " selected" : ""}>${T("zkTola")}</option><option value="gram"${ZK[k] === "gram" ? " selected" : ""}>${T("zkGram")}</option></select>`;
  $("#zakatv").innerHTML = `
    <div class="zk-res" id="zkRes" aria-live="polite">${zkResult()}</div>
    <h3 class="zk-h">${T("zkPrices")}</h3><p class="zk-hint">${T("zkPriceHint")}</p>
    <div class="zk-2">${inp("gp", "zkGoldP")}${inp("sp", "zkSilverP")}</div>
    <h3 class="zk-h">${T("zkGold")}</h3>
    <div class="zk-3"><label class="zk-f"><span>${T("zkWeight")}</span><input inputmode="decimal" data-zk="gw" value="${esc(ZK.gw)}" placeholder="0"></label>
      <label class="zk-f"><span>&nbsp;</span>${unit("gu")}</label>
      <label class="zk-f"><span>${T("zkKarat")}</span><select data-zk="gk">${["24", "22", "21", "18"].map(k => `<option${ZK.gk === k ? " selected" : ""}>${k}</option>`).join("")}</select></label></div>
    <h3 class="zk-h">${T("zkSilver")}</h3>
    <div class="zk-2"><label class="zk-f"><span>${T("zkWeight")}</span><input inputmode="decimal" data-zk="sw" value="${esc(ZK.sw)}" placeholder="0"></label><label class="zk-f"><span>&nbsp;</span>${unit("su")}</label></div>
    <h3 class="zk-h">${T("zkMoney")}</h3>
    ${inp("cash", "zkCash")}${inp("bank", "zkBank")}${inp("recv", "zkRecv")}${inp("stock", "zkStock")}${inp("inv", "zkInv")}${inp("other", "zkOther")}
    <h3 class="zk-h">${T("zkLess")}</h3>
    ${inp("debt", "zkDebt")}${inp("bankded", "zkBankDed")}
    <h3 class="zk-h">${T("zkBasis")}</h3>
    <div class="zk-seg" role="radiogroup">${[["auto", "zkAuto"], ["silver", "zkBySilver"], ["gold", "zkByGold"]].map(([v, k]) => `<button role="radio" aria-checked="${ZK.basis === v}" data-zkb="${v}">${T(k)}</button>`).join("")}</div>
    <h3 class="zk-h">${T("zkDate")}</h3><p class="zk-hint">${T("zkDateHint")}</p>
    <input type="date" class="zk-date" data-zk="date" value="${esc(ZK.date)}"><p class="zk-next" id="zkNext">${esc(zkNextDate())}</p>
    <h3 class="zk-h">${T("zkWho")}</h3>
    <ol class="zk-who">${T("zkWhoL").map(x => `<li>${esc(x)}</li>`).join("")}</ol>
    <div class="wd-actions"><button class="btn ghost" data-zkayah="1">${T("zkOpenAyah")} 9:60</button><button class="btn ghost" data-zkclear="1">${T("zkClear")}</button></div>
    <p class="draft">${T("zkNote")}</p>`;
}
$("#zakatv").addEventListener("input", e => {
  const f = e.target.closest("[data-zk]"); if (!f) return;
  ZK[f.dataset.zk] = f.value; zkSave(); $("#zkRes").innerHTML = zkResult();
  if (f.dataset.zk === "date") $("#zkNext").textContent = zkNextDate();
});
$("#zakatv").addEventListener("change", e => { const f = e.target.closest("select[data-zk]"); if (f) { ZK[f.dataset.zk] = f.value; zkSave(); $("#zkRes").innerHTML = zkResult(); } });
$("#zakatv").addEventListener("click", e => {
  const b = e.target.closest("[data-zkb]"); if (b) { ZK.basis = b.dataset.zkb; zkSave(); renderZakat(); return; }
  if (e.target.closest("[data-zkayah]")) { showView("read"); openSurah(9, 60); return; }
  if (e.target.closest("[data-zkclear]")) { const keep = { gp: ZK.gp, sp: ZK.sp, date: ZK.date }; ZK = Object.assign({}, ZK0, keep); zkSave(); renderZakat(); }
});

/* ===================== HADITH ===================== */
const HS = Object.assign({ tab: "n", open: null, k: {}, s: null, ay: null, more: {} }, store.get("hadith", {}));
const hsSave = () => store.set("hadith", { tab: HS.tab, open: HS.open, k: HS.k, s: HS.s });
let NAW = null, BKT = null, BKIX = null;
const loadNaw = () => NAW ? Promise.resolve(NAW) : load("nawawi", `data/hadith/nawawi40.json?v=${DV}`).then(d => NAW = d);
const loadBkt = () => BKT ? Promise.resolve(BKT) : load("bktafsir", `data/hadith/bukhari-tafsir.json?v=${DV}`).then(d => {
  BKT = d; BKIX = {}; d.forEach((h, i) => (h.a || []).forEach(a => (BKIX[h.s + ":" + a] = BKIX[h.s + ":" + a] || []).push(i))); return d; });
const hTr = h => settings.lang === "en" ? h.en : h.ur, hT = h => h.t[settings.lang === "en" ? 1 : 0], hSrc = h => h.src[settings.lang === "en" ? 1 : 0];
const SUNNAH = "https://sunnah.com/bukhari/65";
function nawCard(h){
  const op = HS.open === h.n;
  return `<article class="hd-card${op ? " open" : ""}${HS.k[h.n] ? " done" : ""}" id="hdn${h.n}">
    <button class="hd-head" data-hdo="${h.n}" aria-expanded="${op}"><span class="hd-num">${nf(h.n)}</span><b>${esc(hT(h))}</b>${HS.k[h.n] ? `<span class="hd-ok">✓</span>` : ""}</button>
    ${op ? `<div class="hd-body"><p class="hd-ar" dir="rtl" lang="ar">${esc(h.ar)}</p><p class="hd-tr${settings.lang === "en" ? "" : " ur"}">${esc(hTr(h))}</p><p class="hd-src">${esc(hSrc(h))}</p>
      <div class="wd-actions"><button class="btn${HS.k[h.n] ? " ghost" : ""}" data-hdk="${h.n}">${HS.k[h.n] ? T("hdUnmark") : T("hdMark")}</button>${shareBtn(`data-hdshare="${h.n}"`)}</div></div>` : ""}
  </article>`;
}
async function renderHadith(){
  const el = $("#hadithv"), tabs = `<div class="zk-seg hd-tabs" role="tablist">${[["n", "hdTabN"], ["b", "hdTabB"]].map(([v, k]) => `<button role="tab" aria-selected="${HS.tab === v}" data-hdt="${v}">${T(k)}</button>`).join("")}</div>`;
  if (HS.tab === "n") {
    const d = await loadNaw(), n = Object.keys(HS.k).length;
    el.innerHTML = `${tabs}<div class="nm-head"><b>${T("hdLearned", nf(n))}</b><i class="c1-bar"><em style="width:${n / 42 * 100}%"></em></i></div>${d.map(nawCard).join("")}<p class="draft">${T("hdNoteN")}</p>`;
    if (HS.open) { const c = $("#hdn" + HS.open); if (c && HS.jump) { c.scrollIntoView({ block: "start" }); HS.jump = 0; } }
    return;
  }
  const d = await loadBkt(), cnt = {}; d.forEach(h => cnt[h.s] = (cnt[h.s] || 0) + 1);
  const ss = Object.keys(cnt).map(Number).sort((a, b) => a - b); if (!HS.s || !cnt[HS.s]) HS.s = ss[0];
  let list = d.map((h, i) => [h, i]).filter(([h]) => h.s === HS.s);
  if (HS.ay) { const [s, a] = HS.ay.split(":").map(Number); if (s === HS.s) list = list.filter(([h]) => (h.a || []).includes(a)); else HS.ay = null; }
  el.innerHTML = `${tabs}<label class="zk-f"><span>${T("hdPick")}</span><select id="hdSurah">${ss.map(s => `<option value="${s}"${s === HS.s ? " selected" : ""}>${nf(s)}. ${esc(surahName(s))} — ${T("hdCount", nf(cnt[s]))}</option>`).join("")}</select></label>
    ${HS.ay ? `<p class="hd-filter">${T("hdAyahOnly", nf(HS.ay.split(":")[1]))} · <button class="linkbtn" data-hdall="1">${T("hdAll")}</button></p>` : ""}
    ${list.map(([h, i]) => { const long = h.ar.length > 420, show = HS.more[i] || !long;
      return `<article class="hd-card open"><div class="hd-body"><div class="hd-chips">${(h.a || []).length ? h.a.map(a => `<button class="hd-chip" data-hdgo="${h.s}:${a}">${nf(h.s)}:${nf(a)}</button>`).join("") : `<span class="hd-chip muted">${T("hdSurahOnly")} ${nf(h.s)}</span>`}</div>
        <p class="hd-ar" dir="rtl" lang="ar">${esc(show ? h.ar : h.ar.slice(0, 380) + "…")}</p>${long ? `<button class="linkbtn" data-hdmore="${i}">${show ? T("hdLess") : T("hdMore")}</button>` : ""}</div></article>`; }).join("")}
    <p class="draft">${T("hdNoteB")} <a href="${SUNNAH}" target="_blank" rel="noopener">${T("hdSunnah")} ↗</a></p>`;
}
$("#hadithv").addEventListener("click", async e => {
  const t = e.target.closest("[data-hdt]"); if (t) { HS.tab = t.dataset.hdt; hsSave(); renderHadith(); return; }
  const o = e.target.closest("[data-hdo]"); if (o) { const n = +o.dataset.hdo; HS.open = HS.open === n ? null : n; HS.jump = 1; hsSave(); renderHadith(); return; }
  const k = e.target.closest("[data-hdk]"); if (k) { const n = +k.dataset.hdk; if (HS.k[n]) delete HS.k[n]; else HS.k[n] = 1; hsSave(); renderHadith(); return; }
  const s = e.target.closest("[data-hdshare]"); if (s) { const h = NAW[+s.dataset.hdshare - 1], tr = hTr(h);
    shareCard({ ar: h.ar.length <= 380 ? h.ar : "", tr: tr.length <= 520 ? tr : tr.slice(0, 500) + "…", title: `${T("hdTabN")} · ${nf(h.n)}`, ref: hSrc(h), file: "hadith-" + h.n, size: 46 }); return; }
  const g = e.target.closest("[data-hdgo]"); if (g) { const [a, b] = g.dataset.hdgo.split(":").map(Number); showView("read"); openSurah(a, b); return; }
  const m = e.target.closest("[data-hdmore]"); if (m) { const i = +m.dataset.hdmore; HS.more[i] = !HS.more[i]; renderHadith(); return; }
  if (e.target.closest("[data-hdall]")) { HS.ay = null; renderHadith(); }
});
$("#hadithv").addEventListener("change", e => { if (e.target.id === "hdSurah") { HS.s = +e.target.value; HS.ay = null; hsSave(); renderHadith(); } });

/* reader: "Hadith (n)" in the ayah menu when Bukhari's Book of Tafsir quotes that ayah */
const _openAyahMenuH = openAyahMenu;
openAyahMenu = async function(n, a){
  const r = await _openAyahMenuH(n, a);
  loadBkt().then(() => { const ix = BKIX[n + ":" + a]; const g = $("#sheetBody .am-grid");
    if (ix && g && $("#sheetBody").dataset.ayah === n + ":" + a && !g.querySelector("[data-amhd]")) g.insertAdjacentHTML("beforeend", `<button data-amhd="${n}:${a}">📜 ${T("hdAyahBtn", nf(ix.length))}</button>`); }).catch(() => {});
  return r;
};
$("#sheetBody").addEventListener("click", e => {
  const b = e.target.closest("[data-amhd]"); if (!b) return; e.stopPropagation();
  const [s] = b.dataset.amhd.split(":").map(Number); closeAll(); HS.tab = "b"; HS.s = s; HS.ay = b.dataset.amhd; hsSave(); showView("hadith");
}, true);

/* ===== views, dashboard tiles, hadith of the day ===== */
VIEWS.zakat = { el: "#zakatv", title: () => [T("zkT"), T("zkSub")], render: renderZakat };
VIEWS.hadith = { el: "#hadithv", title: () => [T("hdT"), T("hdSub")], render: renderHadith };
SUBPAGES.zakat = 1; SUBPAGES.hadith = 1;
NAV.hadith = ["tlHadith", "#8A5A2B", `<path d="M5 4h11l3 3v13H5z"/><path d="M16 4v3h3M8 10h8M8 13.5h8M8 17h5"/>`];
NAV.zakat = ["tlZakat", "#2F8F5B", `<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.5-1-1.6-1.6-2.8-1.6-1.6 0-2.8.9-2.8 2.1 0 2.8 5.6 1.5 5.6 4.4 0 1.2-1.2 2.2-2.8 2.2-1.3 0-2.4-.6-2.9-1.6M12 6v1.6M12 16.3V18"/>`];
const _renderHomeH = renderHome;
renderHome = async function(){
  const r = await _renderHomeH();
  try {
    const d = await loadNaw();
    if (!$("#home .hd-day")) {
      const i = Math.floor(Date.now() / 864e5) % d.length, h = d[i], tr = hTr(h);
      const html = `<button class="hm-card hd-day" data-open="hadith" data-hdday="${h.n}"><small>${T("hdDay")} · ${nf(h.n)}</small><b>${esc(hT(h))}</b><span class="${settings.lang === "en" ? "" : "ur"}">${esc(tr.length > 170 ? tr.slice(0, 165) + "…" : tr)}</span></button>`;
      const after = $("#home .nm-day") || $("#home .qa-grid");
      if (after) after.insertAdjacentHTML("afterend", html); else $("#home").insertAdjacentHTML("beforeend", html);
    }
  } catch(e) {}
  return r;
};
VIEWS.home.render = renderHome;
document.addEventListener("click", e => { const d = e.target.closest("[data-hdday]"); if (d) { HS.tab = "n"; HS.open = +d.dataset.hdday; HS.jump = 1; hsSave(); } }, true);
