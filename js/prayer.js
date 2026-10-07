"use strict";
/* ---------- Prayer times (calculated on the phone, works offline) and reminders ----------
   Standard astronomical method (sun declination + equation of time). Methods: Karachi (default for Pakistan),
   Muslim World League, ISNA, Umm al-Qura, Egypt. Asr: Hanafi (default) or Shafi'i/Maliki/Hanbali. */
Object.assign(L.ur, {
  prT:"نماز کے اوقات", prNames:["فجر", "طلوعِ آفتاب", "ظہر", "عصر", "مغرب", "عشاء"], prNext:(n,t)=>`اگلی نماز: ${n} — ${t} میں`, prIn:(h,m)=>h ? `${ud(h)} گھنٹے ${ud(m)} منٹ` : `${ud(m)} منٹ`,
  prLoc:"مقام", prMine:"میرا موجودہ مقام", prMethod:"طریقۂ حساب", prAsr:"عصر", prHanafi:"حنفی", prShafi:"شافعی / مالکی / حنبلی", prNoLoc:"مقام نہیں ملا — فہرست سے شہر چنیں",
  prRemind:"یاد دہانی", prRemSub:"نماز کا وقت ہونے پر یاد دہانی", prCal:"اگلے ۳۰ دن کیلنڈر میں شامل کریں", prCalSub:"فون کا کیلنڈر ہر نماز پر الارم دے گا — ایپ بند ہو تب بھی",
  prNotif:"ایپ کھلی ہو تو نوٹیفکیشن", prNotifOn:"نوٹیفکیشن آن", prBefore:m=>m ? `${ud(m)} منٹ پہلے` : "عین وقت پر", prTime:n=>`${n} کا وقت ہو گیا`, prHow:"اوقات فون پر حساب ہوتے ہیں (انٹرنیٹ کی ضرورت نہیں)۔ مقامی مسجد کے اوقات میں چند منٹ کا فرق ہو سکتا ہے۔",
  prM_karachi:"کراچی (جامعہ علوم اسلامیہ) — پاکستان", prM_mwl:"مسلم ورلڈ لیگ", prM_isna:"ISNA — شمالی امریکہ", prM_makkah:"ام القریٰ — مکہ", prM_egypt:"مصر"
});
Object.assign(L.en, {
  prT:"Prayer times", prNames:["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"], prNext:(n,t)=>`Next: ${n} in ${t}`, prIn:(h,m)=>h ? `${h} h ${m} min` : `${m} min`,
  prLoc:"Location", prMine:"My current location", prMethod:"Calculation method", prAsr:"Asr", prHanafi:"Hanafi", prShafi:"Shafi'i / Maliki / Hanbali", prNoLoc:"Couldn't get your location — choose a city from the list",
  prRemind:"Reminders", prRemSub:"A reminder when each prayer time begins", prCal:"Add the next 30 days to my calendar", prCalSub:"Your phone's calendar will alert you at each prayer — even when the app is closed",
  prNotif:"Notifications while the app is open", prNotifOn:"Notifications on", prBefore:m=>m ? `${m} min before` : "At prayer time", prTime:n=>`It's time for ${n}`, prHow:"Times are calculated on your phone (no internet needed). They can differ by a few minutes from your local mosque.",
  prM_karachi:"Karachi (Univ. of Islamic Sciences) — Pakistan", prM_mwl:"Muslim World League", prM_isna:"ISNA — North America", prM_makkah:"Umm al-Qura — Makkah", prM_egypt:"Egypt"
});
const PR_METHODS = { karachi:{ f:18, i:18 }, mwl:{ f:18, i:17 }, isna:{ f:15, i:15 }, makkah:{ f:18.5, im:90 }, egypt:{ f:19.5, i:17.5 } };
const PR_CITIES = [
  ["Lahore", "لاہور", 31.5204, 74.3587, 5], ["Karachi", "کراچی", 24.8607, 67.0011, 5], ["Islamabad", "اسلام آباد", 33.6844, 73.0479, 5], ["Rawalpindi", "راولپنڈی", 33.5651, 73.0169, 5],
  ["Faisalabad", "فیصل آباد", 31.4504, 73.1350, 5], ["Multan", "ملتان", 30.1575, 71.5249, 5], ["Peshawar", "پشاور", 34.0151, 71.5249, 5], ["Quetta", "کوئٹہ", 30.1798, 66.9750, 5],
  ["Gujranwala", "گوجرانوالہ", 32.1877, 74.1945, 5], ["Sialkot", "سیالکوٹ", 32.4945, 74.5229, 5], ["Hyderabad", "حیدرآباد", 25.3960, 68.3578, 5], ["Bahawalpur", "بہاولپور", 29.3956, 71.6836, 5],
  ["Sargodha", "سرگودھا", 32.0836, 72.6711, 5], ["Abbottabad", "ایبٹ آباد", 34.1688, 73.2215, 5], ["Muzaffarabad", "مظفرآباد", 34.3700, 73.4711, 5],
  ["Makkah", "مکہ مکرمہ", 21.4225, 39.8262, 3], ["Madinah", "مدینہ منورہ", 24.4672, 39.6111, 3], ["Riyadh", "ریاض", 24.7136, 46.6753, 3], ["Jeddah", "جدہ", 21.4858, 39.1925, 3],
  ["Dubai", "دبئی", 25.2048, 55.2708, 4], ["Abu Dhabi", "ابوظہبی", 24.4539, 54.3773, 4], ["Doha", "دوحہ", 25.2854, 51.5310, 3]
];
const PS = Object.assign({ city: 0, mine: null, method: "karachi", asr: 2, notif: false, before: 0 }, store.get("prayer", {}));
const saveP = () => store.set("prayer", PS);
const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI, fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };
function sunPos(jd){
  const D = jd - 2451545.0, g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * Math.sin(rad(g)) + 0.020 * Math.sin(rad(2 * g)), 360), e = 23.439 - 0.00000036 * D;
  const RA = fix(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15, 24);
  return { decl: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L)))), eqt: q / 15 - RA };
}
/* returns minutes after local midnight for [fajr, sunrise, dhuhr, asr, maghrib, isha] */
function prayerTimes(date, lat, lng, tz){
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  const A = Math.floor((14 - m) / 12), Y = y + 4800 - A, M = m + 12 * A - 3;
  const jd0 = d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045 - 0.5 - lng / 360;
  const meth = PR_METHODS[PS.method] || PR_METHODS.karachi;
  const mid = t => { const s = sunPos(jd0 + t / 24); return fix(12 - s.eqt, 24); };
  const angT = (angle, t, ccw) => { const s = sunPos(jd0 + t / 24), noon = mid(t);
    const v = (-Math.sin(rad(angle)) - Math.sin(rad(s.decl)) * Math.sin(rad(lat))) / (Math.cos(rad(s.decl)) * Math.cos(rad(lat)));
    const T = deg(Math.acos(Math.max(-1, Math.min(1, v)))) / 15; return noon + (ccw ? -T : T); };
  const asrT = (factor, t) => { const s = sunPos(jd0 + t / 24); const a = -deg(Math.atan(1 / (factor + Math.tan(rad(Math.abs(lat - s.decl)))))); return angT(a, t, false); };
  let t = [5, 6, 12, 13, 18, 18];                          // first guesses, then refine twice
  for (let k = 0; k < 2; k++) t = [angT(meth.f, t[0], true), angT(0.833, t[1], true), mid(t[2]), asrT(PS.asr, t[3]), angT(0.833, t[4], false), meth.im ? 0 : angT(meth.i, t[5], false)];
  if (meth.im) t[5] = t[4] + meth.im / 60;
  const adj = tz - lng / 15;
  return t.map((h, i) => Math.round((h + adj) * 60 + (i === 2 ? 1 : 0)));   // +1 min after zawal for Dhuhr
}
function prLoc(){
  if (PS.mine) return { name: T("prMine"), lat: PS.mine[0], lng: PS.mine[1], tz: -new Date().getTimezoneOffset() / 60 };
  const c = PR_CITIES[PS.city] || PR_CITIES[0]; return { name: settings.lang === "en" ? c[0] : c[1], lat: c[2], lng: c[3], tz: c[4] };
}
const hm = mins => { const h = Math.floor(mins / 60) % 24, m = ((mins % 60) + 60) % 60, en = settings.lang === "en";
  const h12 = ((h + 11) % 12) + 1; return `${nf(h12)}:${nf(String(m).padStart(2, "0"))} ${h < 12 ? (en ? "am" : "صبح") : (en ? "pm" : "شام")}`; };
function todayTimes(){ const L2 = prLoc(); return { L: L2, t: prayerTimes(new Date(), L2.lat, L2.lng, L2.tz) }; }
function nowMin(){ const L2 = prLoc(), d = new Date(); return (d.getUTCHours() + L2.tz) * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60; }
function prayerHTML(){
  const { L: L2, t } = todayTimes(), now = ((nowMin() % 1440) + 1440) % 1440, names = T("prNames");
  let ni = [0, 2, 3, 4, 5].find(i => t[i] > now); const nextIdx = ni == null ? 0 : ni, left = ni == null ? t[0] + 1440 - now : t[ni] - now;
  const meth = Object.keys(PR_METHODS).map(k => `<option value="${k}"${PS.method === k ? " selected" : ""}>${esc(T("prM_" + k))}</option>`).join("");
  const city = PR_CITIES.map((c, i) => `<option value="${i}"${!PS.mine && PS.city === i ? " selected" : ""}>${esc(settings.lang === "en" ? c[0] : c[1])}</option>`).join("");
  return `<section class="pr">
    <div class="pr-next"><small>${esc(L2.name)}</small><b>${T("prNext", names[nextIdx], T("prIn", nf(Math.floor(left / 60)), nf(Math.floor(left % 60))))}</b></div>
    <ul class="pr-list">${t.map((m, i) => `<li class="${i === nextIdx ? "next" : ""}${i === 1 ? " sun" : ""}"><span>${names[i]}</span><time>${hm(m)}</time></li>`).join("")}</ul>
    <details class="pr-set"><summary>${T("prLoc")} · ${T("prMethod")}</summary>
      <label class="rng">${T("prLoc")} <select id="prCity"><option value="me"${PS.mine ? " selected" : ""}>📍 ${T("prMine")}</option>${city}</select></label>
      <label class="rng">${T("prMethod")} <select id="prMethod">${meth}</select></label>
      <div class="rtb-seg wide"><button data-asr="2" aria-pressed="${PS.asr === 2}">${T("prAsr")}: ${T("prHanafi")}</button><button data-asr="1" aria-pressed="${PS.asr === 1}">${T("prShafi")}</button></div>
      <p class="ds-note">${T("prHow")}</p></details>
    <h4 class="pr-h">${T("prRemind")}</h4>
    <button class="ds ds-card" data-prcal="1"><span class="ds-mic">📅</span><span><b>${T("prCal")}</b><small>${T("prCalSub")}</small></span></button>
    <label class="ds ds-row ds-sw"><span><b>${T("prNotif")}</b><small>${T("prRemSub")}</small></span><input type="checkbox" role="switch" id="prNotif"${PS.notif ? " checked" : ""}><i aria-hidden="true"></i></label>
    <label class="rng">⏰ <select id="prBefore">${[0, 5, 10, 15, 30].map(m => `<option value="${m}"${PS.before === m ? " selected" : ""}>${T("prBefore", nf(m))}</option>`).join("")}</select></label>
  </section>`;
}
/* calendar file: 30 days, five prayers, each with an alarm */
function prayerICS(){
  const L2 = prLoc(), names = L.en.prNames, pad = n => String(n).padStart(2, "0"), lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//QuranToSoul//Prayer times//EN", "CALSCALE:GREGORIAN"];
  for (let k = 0; k < 30; k++) {
    const day = new Date(); day.setDate(day.getDate() + k); const t = prayerTimes(day, L2.lat, L2.lng, L2.tz);
    [0, 2, 3, 4, 5].filter(i => !PS.alarm || PS.alarm[i]).forEach(i => {
      const utc = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), 0, t[i] - Math.round(L2.tz * 60)));
      const st = `${utc.getUTCFullYear()}${pad(utc.getUTCMonth() + 1)}${pad(utc.getUTCDate())}T${pad(utc.getUTCHours())}${pad(utc.getUTCMinutes())}00Z`;
      const en = new Date(utc.getTime() + 15 * 6e4), et = `${en.getUTCFullYear()}${pad(en.getUTCMonth() + 1)}${pad(en.getUTCDate())}T${pad(en.getUTCHours())}${pad(en.getUTCMinutes())}00Z`;
      lines.push("BEGIN:VEVENT", `UID:qts-${st}-${i}@qurantosoul.com`, `DTSTAMP:${st}`, `DTSTART:${st}`, `DTEND:${et}`, `SUMMARY:${names[i]} — ${T("prNames")[i]}`, `DESCRIPTION:QuranToSoul · ${L2.name}`,
        "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${names[i]}`, `TRIGGER:-PT${PS.before || 0}M`, "END:VALARM", "END:VEVENT");
    });
  }
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" }), u = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = u; a.download = "qurantosoul-prayer-times.ics"; a.click(); setTimeout(() => URL.revokeObjectURL(u), 5000);
}
/* in-app notifications: checked every 30 s while the app is open */
let prLast = "";
setInterval(() => {
  if (!PS.notif || !("Notification" in window) || Notification.permission !== "granted") return;
  const { t } = todayTimes(), now = Math.floor(((nowMin() % 1440) + 1440) % 1440), names = T("prNames");
  [0, 2, 3, 4, 5].filter(i => !PS.alarm || PS.alarm[i]).forEach(i => { const at = t[i] - (PS.before || 0), key = dayKey() + i;
    if (now >= at && now < at + 2 && prLast !== key) { prLast = key;
      try { navigator.serviceWorker && navigator.serviceWorker.ready.then(r => r.showNotification("QuranToSoul", { body: T("prTime", names[i]), icon: "icon.svg", tag: "prayer" })); } catch(e) { new Notification("QuranToSoul", { body: T("prTime", names[i]) }); }
      toast(esc(T("prTime", names[i])), 6000); } });
}, 30000);
function prRefresh(){ const el = document.querySelector("#duas .pr"); if (el) el.outerHTML = prayerHTML(); }
document.addEventListener("change", e => {
  if (e.target.id === "prCity") {
    if (e.target.value === "me") {
      if (!navigator.geolocation) { toast(esc(T("prNoLoc")), 3500); return; }
      navigator.geolocation.getCurrentPosition(p => { PS.mine = [p.coords.latitude, p.coords.longitude]; saveP(); prRefresh(); }, () => { toast(esc(T("prNoLoc")), 3500); prRefresh(); }, { timeout: 10000, maximumAge: 864e5 });
    } else { PS.mine = null; PS.city = +e.target.value; saveP(); prRefresh(); }
  } else if (e.target.id === "prMethod") { PS.method = e.target.value; saveP(); prRefresh(); }
  else if (e.target.id === "prBefore") { PS.before = +e.target.value; saveP(); }
  else if (e.target.id === "prNotif") {
    PS.notif = e.target.checked; saveP();
    if (PS.notif && "Notification" in window && Notification.permission !== "granted") Notification.requestPermission().then(p => { if (p !== "granted") { PS.notif = false; saveP(); prRefresh(); } else toast(esc(T("prNotifOn"))); });
  }
});
document.addEventListener("click", e => {
  const a = e.target.closest("[data-asr]"); if (a) { PS.asr = +a.dataset.asr; saveP(); prRefresh(); return; }
  if (e.target.closest("[data-prcal]")) prayerICS();
});
setInterval(() => { if (LV.view === "duas" && DS.tab === "p") prRefresh(); }, 60000);
if (DS.tab === "p") DS.tab = "q";
