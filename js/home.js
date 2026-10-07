"use strict";
/* ---------- Dashboard (home) and the Prayer Times page ---------- */
Object.assign(L.ur, { tabHome:"ڈیش بورڈ", homeT:"السلام علیکم", contH:"پڑھنا جاری رکھیں", contB:"جاری رکھیں", ayahN:n=>`آیت ${ud(n)}`, todayH:"آج", ofGoal:(r,g)=>`${ud(r)} / ${ud(g)} آیات`, minsToday:m=>`${ud(m)} منٹ قرآن کے ساتھ`, hearW:"▶ سنیں",
  startsIn:(n,h,m,s)=>`${n} شروع ہونے میں ${h ? ud(h) + " گھنٹے، " : ""}${ud(m)} منٹ، ${ud(s)} سیکنڈ`, sunrise:"طلوعِ آفتاب", prPageT:"نماز کے اوقات", alarmsH:"الارم", alarmOn:"الارم", monthH:"اگلے ۳۰ دن", hijriAdj:"ہجری تاریخ کی درستگی", adjD:n=>n ? `${n > 0 ? "+" : ""}${ud(n)} دن` : "کوئی نہیں",
  ayahDay:"آج کی آیت", openAyah:"پڑھیں", tlTafsir:"تفسیر", tlAzkar:"اذکار", tlHifz:"حفظ جانچیں", tlQibla:"قبلہ", tlPdf:"قرآن PDF", tlRem:"یاد دہانیاں", settingsH:"ترتیبات" });
Object.assign(L.en, { tabHome:"Dashboard", homeT:"Assalamu alaikum", contH:"Continue reading", contB:"Continue", ayahN:n=>`Ayah ${n}`, todayH:"Today", ofGoal:(r,g)=>`${r} / ${g} ayahs`, minsToday:m=>`${m} min with the Quran`, hearW:"▶ Listen",
  startsIn:(n,h,m,s)=>`${n} starts in ${h ? h + " h, " : ""}${m} min, ${s} sec`, sunrise:"Sunrise", prPageT:"Prayer times", alarmsH:"Alarms", alarmOn:"Alarm", monthH:"Next 30 days", hijriAdj:"Hijri date adjustment", adjD:n=>n ? `${n > 0 ? "+" : ""}${n} day${Math.abs(n) > 1 ? "s" : ""}` : "None",
  ayahDay:"Ayah of the day", openAyah:"Read", tlTafsir:"Tafsir", tlAzkar:"Azkar", tlHifz:"Check hifz", tlQibla:"Qibla", tlPdf:"Quran PDF", tlRem:"Reminders", settingsH:"Settings" });
/* Hijri date: Umm al-Qura calendar shifted by the local adjustment (Pakistan is usually 1–2 days behind Saudi Arabia) */
if (PS.hadj == null) PS.hadj = (PR_CITIES[PS.city] || [])[4] === 5 && !PS.mine ? -2 : 0;
if (!PS.alarm) PS.alarm = { 0: 1, 2: 1, 3: 1, 4: 1, 5: 1 };
function hijriParts(){
  const d = new Date(Date.now() + (PS.hadj || 0) * 864e5);
  try { const f = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).formatToParts(d);
    const g = k => (f.find(x => x.type === k) || {}).value || "";
    const urM = ["محرم", "صفر", "ربیع الاول", "ربیع الثانی", "جمادی الاول", "جمادی الثانی", "رجب", "شعبان", "رمضان", "شوال", "ذوالقعدہ", "ذوالحجہ"];
    const mi = +new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { month: "numeric" }).format(d) - 1;
    return { day: g("day"), month: settings.lang === "en" ? g("month") : urM[mi], year: g("year").replace(/\D/g, "") };
  } catch(e) { return { day: "", month: "", year: "" }; }
}
function hijriToday(){ const h = hijriParts(); return h.day ? `${nf(h.day)} ${h.month} ${nf(h.year)} ${settings.lang === "en" ? "AH" : "ھ"}` : ""; }
function gregToday(){ return new Intl.DateTimeFormat(settings.lang === "en" ? "en-GB" : "ur-PK", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()); }
/* the prayer widget — same clean card on the dashboard and on the Prayer Times page */
function nextPrayer(){
  const { t } = todayTimes(), now = ((nowMin() % 1440) + 1440) % 1440;
  const ni = [0, 2, 3, 4, 5].find(i => t[i] > now), next = ni == null ? 0 : ni, left = (ni == null ? t[0] + 1440 : t[ni]) - now;
  return { t, next, left };
}
function countdownText(){
  const { next, left } = nextPrayer(), s = Math.max(0, Math.floor(left * 60));
  return T("startsIn", T("prNames")[next], Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60);
}
function prayerWidget(link){
  const { t, next } = nextPrayer(), names = T("prNames"), h = hijriParts(), sh = mins => { const x = hm(mins); return x.replace(/\s.*$/, ""); };
  return `<section class="pw"${link ? ' data-open="prayer" role="button" tabindex="0"' : ""}>
    <div class="pw-top"><div class="pw-date"><b>${nf(h.day)}</b><span>${esc(h.month)} ${nf(h.year)} ${settings.lang === "en" ? "AH" : "ھ"}</span><small>${esc(prLoc().name)}</small></div>
      <div class="pw-sun"><svg viewBox="0 0 48 30" aria-hidden="true"><path d="M8 26h32M14 26a10 10 0 0 1 20 0" fill="#F5C842" stroke="#F5C842" stroke-width="2.5" stroke-linecap="round"/><path d="M24 4v5M10 10l3.5 3.5M38 10l-3.5 3.5" stroke="#F5C842" stroke-width="2.5" stroke-linecap="round"/></svg><div><small>${T("sunrise")}</small><b>${sh(t[1])}</b></div></div></div>
    <ul class="pw-row">${[0, 2, 3, 4, 5].map(i => `<li class="${i === next ? "on" : ""}"><span>${names[i]}</span><b>${sh(t[i])}</b></li>`).join("")}</ul>
    <p class="pw-cd" data-cd="1">${esc(countdownText())}</p></section>`;
}
setInterval(() => { document.querySelectorAll("[data-cd]").forEach(el => { el.textContent = countdownText(); }); }, 1000);
/* ---------- Dashboard ---------- */
const TILES = [
  ["tafsir", "tlTafsir", "#8E2F3C", `<path d="M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5z"/><path d="M12 6.5v13M6.5 9.5h3M6.5 12.5h3M14.5 9.5h3M14.5 12.5h3"/>`],
  ["azkar", "tlAzkar", "#1E7A5A", `<path d="M12 3.5c-2.2 2.8-2.2 5.2 0 8 2.2-2.8 2.2-5.2 0-8z"/><path d="M5 20.5h14M7 20.5c0-4 2.2-6.5 5-6.5s5 2.5 5 6.5"/><circle cx="12" cy="17.5" r="1"/>`],
  ["hifz", "tlHifz", "#C0562F", `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>`],
  ["qibla", "tlQibla", "#333F48", `<circle cx="12" cy="12" r="9"/><path d="m12 5 3 8h-6z"/><rect x="10" y="14.5" width="4" height="3.5" rx=".5"/>`],
  ["pdf", "tlPdf", "#2A5C9A", `<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 16.5h6M12 9.5v4"/>`],
  ["reminders", "tlRem", "#B8913A", `<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>`]
];
function ayahOfDay(){
  const k = Math.floor((Date.now() / 864e5)) % 6236; let s = 1, n = k; while (n >= META.surahs[s - 1].ayahs) { n -= META.surahs[s - 1].ayahs; s++; } return [s, n + 1];
}
async function renderHome(){
  const el = $("#home"), last = store.get("last", { s: 1, a: 1 }), S = META.surahs[last.s - 1];
  const d = dayKey(), read = (U.rd && U.rd[d] ? U.rd[d].length : 0) || U.days[d] || 0, goal = typeof dailyReadTarget === "function" ? dailyReadTarget().pace : (U.goal || 10);
  const mins = Math.round(((U.secs || {})[d] || 0) / 60), pct = Math.min(100, Math.round(read / Math.max(1, goal) * 100));
  el.innerHTML = `<header class="hm-top"><h2>${T("homeT")}</h2><p>${esc(gregToday())}</p></header>
    ${prayerWidget(true)}
    <section class="hm-card hm-cont" data-hcont="1" role="button" tabindex="0">
      <div class="hm-ring">${ringSVG(pct)}</div>
      <div class="hm-c-txt"><small>${T("contH")}</small><b>${esc(settings.lang === "en" ? S.tr : S.ar)} · ${T("ayahN", nf(last.a))}</b><span>${T("ofGoal", nf(read), nf(goal))} · ${T("minsToday", nf(mins))}</span></div>
      <span class="hm-go">${T("contB")}</span></section>
    <nav class="qa-grid qa3" aria-label="QuranToSoul">${TILES.map(([id, k, c, svg]) => `<button class="qa" data-open="${id}"><span class="qa-ic" style="--c:${c}"><svg viewBox="0 0 24 24">${svg}</svg></span><span class="qa-t">${T(k)}</span></button>`).join("")}</nav>
    <section class="hm-card hm-ayah" id="hmAyah"></section>`;
  const [s, a] = ayahOfDay();
  try { const sd = await DATA.surah(s), A = sd.ayahs[a - 1], tr = settings.lang === "en" ? (A.en2 || A.en) : A.ur;
    const box = $("#hmAyah"); if (box) box.innerHTML = `<small>${T("ayahDay")} · ${esc(surahName(s))} ${nf(s)}:${nf(a)}</small><p class="hm-ar" dir="rtl">${esc(A.w.map(w => w[0]).join(" "))}</p><p class="hm-tr ${settings.lang === "en" ? "" : "ur"}">${esc(tr)}</p><button class="btn ghost" data-oa="${s}:${a}">${T("openAyah")}</button>`;
  } catch(e) {}
}
VIEWS.home = { el: "#home", title: () => ["QuranToSoul", hijriToday()], render: renderHome };
/* ---------- Prayer Times page ---------- */
function renderPrayer(){
  const names = T("prNames"), L2 = prLoc(), meth = Object.keys(PR_METHODS).map(k => `<option value="${k}"${PS.method === k ? " selected" : ""}>${esc(T("prM_" + k))}</option>`).join("");
  const city = PR_CITIES.map((c, i) => `<option value="${i}"${!PS.mine && PS.city === i ? " selected" : ""}>${esc(settings.lang === "en" ? c[0] : c[1])}</option>`).join("");
  const rows = []; for (let k = 0; k < 30; k++) { const day = new Date(); day.setDate(day.getDate() + k); const t = prayerTimes(day, L2.lat, L2.lng, L2.tz);
    rows.push(`<tr${k === 0 ? ' class="on"' : ""}><th>${esc(new Intl.DateTimeFormat(settings.lang === "en" ? "en-GB" : "ur-PK", { day: "numeric", month: "short" }).format(day))}</th>${[0, 1, 2, 3, 4, 5].map(i => `<td>${hm(t[i]).replace(/\s.*$/, "")}</td>`).join("")}</tr>`); }
  const { t } = nextPrayer();
  $("#prayerv").innerHTML = `${prayerWidget(false)}
    <section class="ps"><h4>${T("alarmsH")}</h4>
      <ul class="pa">${[0, 2, 3, 4, 5].map(i => `<li><span><b>${names[i]}</b><small>${hm(t[i])}</small></span><label class="ds-sw"><input type="checkbox" role="switch" data-alarm="${i}"${PS.alarm[i] ? " checked" : ""}><i aria-hidden="true"></i></label></li>`).join("")}</ul>
      <label class="rng">⏰ <select id="prBefore">${[0, 5, 10, 15, 30].map(m => `<option value="${m}"${PS.before === m ? " selected" : ""}>${T("prBefore", nf(m))}</option>`).join("")}</select></label>
      <button class="ds ds-card" data-prcal="1"><span class="ds-mic">📅</span><span><b>${T("prCal")}</b><small>${T("prCalSub")}</small></span></button>
      <label class="ds ds-row ds-sw"><span><b>${T("prNotif")}</b><small>${T("prRemSub")}</small></span><input type="checkbox" role="switch" id="prNotif"${PS.notif ? " checked" : ""}><i aria-hidden="true"></i></label>
    </section>
    <section class="ps"><h4>${T("settingsH")}</h4>
      <label class="rng">${T("prLoc")} <select id="prCity"><option value="me"${PS.mine ? " selected" : ""}>📍 ${T("prMine")}</option>${city}</select></label>
      <label class="rng">${T("prMethod")} <select id="prMethod">${meth}</select></label>
      <div class="rtb-seg wide"><button data-asr="2" aria-pressed="${PS.asr === 2}">${T("prAsr")}: ${T("prHanafi")}</button><button data-asr="1" aria-pressed="${PS.asr === 1}">${T("prShafi")}</button></div>
      <label class="rng">${T("hijriAdj")} <select id="prHadj">${[-2, -1, 0, 1, 2].map(n => `<option value="${n}"${(PS.hadj || 0) === n ? " selected" : ""}>${T("adjD", n)}</option>`).join("")}</select></label>
      <p class="ds-note">${T("prHow")}</p></section>
    <section class="ps"><h4>${T("monthH")}</h4><div class="pm-wrap"><table class="pm"><thead><tr><th></th>${[0, 1, 2, 3, 4, 5].map(i => `<th>${names[i]}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div></section>`;
}
VIEWS.prayer = { el: "#prayerv", title: () => [T("prPageT"), prLoc().name], render: renderPrayer };
prRefresh = function(){ if (LV.view === "prayer") renderPrayer(); else if (LV.view === "home") renderHome(); };
document.addEventListener("change", e => {
  const a = e.target.closest("[data-alarm]"); if (a) { PS.alarm[a.dataset.alarm] = a.checked ? 1 : 0; saveP(); return; }
  if (e.target.id === "prHadj") { PS.hadj = +e.target.value; saveP(); renderPrayer(); }
});
/* sub-pages open from the dashboard and close back to it */
const SUBPAGES = { prayer: 1, tafsir: 1, azkar: 1, reminders: 1 };
document.addEventListener("click", e => {
  const o = e.target.closest("[data-open]"); if (!o) return;
  const v = o.dataset.open;
  if (v === "hifz") { const l = store.get("last", { s: 1, a: 1 }); showView("read"); openSurah(l.s, l.a).then(() => hzSetup()); }
  else if (v === "qibla") qiblaSheet();
  else if (v === "pdf") pdfSheet();
  else showView(v);
});
$("#home").addEventListener("click", e => {
  if (e.target.closest("[data-hcont]")) { const last = store.get("last", { s: 1, a: 1 }); showView("read"); openSurah(last.s, last.a); return; }
  const oa = e.target.closest("[data-oa]"); if (oa) { const [s, a] = oa.dataset.oa.split(":").map(Number); showView("read"); openSurah(s, a); }
});
setInterval(() => { if (LV.view === "home") { const w = document.querySelector("#home .pw"); if (w) w.outerHTML = prayerWidget(true); } }, 60000);
