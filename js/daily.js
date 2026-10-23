"use strict";
/* ---------- Daily worship: prayer tracker (gentle, no red marks), tasbih counter, Jumu'ah card, transliteration, lock-screen player ---------- */
Object.assign(L.ur, { ptH:"نماز کا ریکارڈ", ptSub:"جو نماز پڑھ لی اس پر نشان لگائیں — صرف آپ کے فون پر محفوظ", ptWeek:"یہ ہفتہ", ptMonth:"اس مہینے", ptOf:(a,b)=>`${ud(a)} / ${ud(b)} نمازیں`, ptFull:n=>`${ud(n)} دن پانچوں نمازیں`, ptTap:"پڑھ لی؟ دبائیں",
  tsH:"تسبیح", tsSub:"دبائیں اور گنیں — ہدف پورا ہونے پر فون ہلکا سا ہلے گا", tsAfter:"نماز کے بعد ۳۳ / ۳۳ / ۳۴", tsGoal:"ہدف", tsToday:n=>`آج کل ${ud(n)}`, tsReset:"صفر", tsCustom:"اپنا ہدف",
  jmH:"جمعہ مبارک", jmKahf:"سورۃ الکہف پڑھیں", jmKahfSub:(a)=>`آج ${ud(a)} / ۱۱۰ آیات`, jmDurood:"درود شریف", jmDuroodSub:"جمعہ کے دن کثرت سے درود", jmHour:"قبولیت کی گھڑی", jmHourSub:"عصر سے مغرب تک دعا کا وقت", jmRem:"ہر جمعہ سورۃ الکہف کی یاد دہانی (کیلنڈر)",
  tlH:"تلفظ (رومن) دکھائیں", tlSub:"ہر لفظ کے نیچے انگریزی حروف میں تلفظ" });
Object.assign(L.en, { ptH:"Prayer tracker", ptSub:"Tick the prayers you have prayed — kept only on your phone", ptWeek:"This week", ptMonth:"This month", ptOf:(a,b)=>`${a} / ${b} prayers`, ptFull:n=>`${n} days with all five`, ptTap:"Prayed? Tap",
  tsH:"Tasbih", tsSub:"Tap to count — the phone gives a small buzz at the goal", tsAfter:"After salah 33 / 33 / 34", tsGoal:"Goal", tsToday:n=>`${n} today`, tsReset:"Reset", tsCustom:"Your goal",
  jmH:"Jumu'ah Mubarak", jmKahf:"Read Surah Al-Kahf", jmKahfSub:(a)=>`${a} / 110 ayahs today`, jmDurood:"Durood", jmDuroodSub:"Send plenty of blessings on Friday", jmHour:"The hour of acceptance", jmHourSub:"Make dua between Asr and Maghrib", jmRem:"Remind me to read Al-Kahf every Friday (calendar)",
  tlH:"Show transliteration", tlSub:"Pronunciation in English letters under each word" });
/* ===== 1. prayer tracker: how each prayer was prayed (mosque jamaat / jamaat / alone / qaza), any past day can be ticked ===== */
Object.assign(L.ur, { ptHow:"نماز کیسے پڑھی؟", ptM:"مسجد میں جماعت", ptJ:"جماعت سے (گھر یا دفتر)", ptA:"اکیلے", ptQ:"قضا (وقت کے بعد)", ptX:"نشان ہٹائیں", ptPrev:"پچھلا ہفتہ", ptNext:"اگلا ہفتہ", ptTapCell:"کسی بھی خانے کو دبا کر پچھلی نماز بھی درج کریں",
  ptBy:(m,j,a,q)=>`مسجد ${ud(m)} · جماعت ${ud(j)} · اکیلے ${ud(a)} · قضا ${ud(q)}` });
Object.assign(L.en, { ptHow:"How did you pray?", ptM:"In the mosque, with jamaat", ptJ:"With jamaat (home or work)", ptA:"Alone", ptQ:"Qaza (after its time)", ptX:"Remove tick", ptPrev:"Previous week", ptNext:"Next week", ptTapCell:"Tap any box to log an earlier prayer too",
  ptBy:(m,j,a,q)=>`Mosque ${m} · Jamaat ${j} · Alone ${a} · Qaza ${q}` });
if (!U.pr) U.pr = {};           // { "2026-10-20": [fajr, dhuhr, asr, maghrib, isha] } 0 none · 1 alone · 2 jamaat · 3 mosque jamaat · 4 qaza
const PR_IDX = [0, 2, 3, 4, 5];
const prDay = d => U.pr[d] || [0, 0, 0, 0, 0];
const dk = dt => new Date(dt.getTime() - dt.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const PT_ICO = {
  3: `<svg viewBox="0 0 24 24"><path d="M12 3c-.8 1.2-1.2 2-1.2 2.6M5 20V12a7 7 0 0 1 14 0v8M3 20h18M10 20v-4a2 2 0 0 1 4 0v4"/></svg>`,
  2: `<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="2.6"/><circle cx="16" cy="8" r="2.6"/><path d="M3.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5M11.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5"/></svg>`,
  1: `<svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3"/><path d="M6.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6"/></svg>`,
  4: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>` };
const PT_KEY = { 3: "ptM", 2: "ptJ", 1: "ptA", 4: "ptQ" };
const isDue = (d, j) => d < dayKey() || (d === dayKey() && todayTimes().t[PR_IDX[j]] <= ((nowMin() % 1440) + 1440) % 1440);
const _prayerWidgetD = prayerWidget;
prayerWidget = function(link){
  const html = _prayerWidgetD(link), d = dayKey(), got = prDay(d);
  let k = 0;
  return html.replace(/<li class="([^"]*)"><span>([^<]*)<\/span><b>([^<]*)<\/b><\/li>/g, (m, cls, nm, tm) => {
    const j = k++, v = got[j], due = isDue(d, j);
    return `<li class="${cls}"><span>${nm}</span><b>${tm}</b><button class="pt-tick${v ? " on pt" + v : ""}" data-pt="${d}|${j}"${due || v ? "" : " disabled"} aria-label="${esc(v ? T(PT_KEY[v]) : T("ptTap"))}">${v ? PT_ICO[v] : ""}</button></li>`;
  });
};
function ptChooser(d, j){
  const v = prDay(d)[j], names = T("prNames"), dt = new Date(d + "T12:00:00");
  const day = d === dayKey() ? (settings.lang === "en" ? "Today" : "آج") : new Intl.DateTimeFormat(settings.lang === "en" ? "en-GB" : "ur-PK", { weekday: "long", day: "numeric", month: "long" }).format(dt);
  $("#sheetBody").innerHTML = `<div class="pt-ch"><h3>${names[PR_IDX[j]]} · <small>${esc(day)}</small></h3><p class="muted">${T("ptHow")}</p>
    ${[3, 2, 1, 4].map(c => `<button class="pt-opt pt${c}${v === c ? " on" : ""}" data-ptset="${d}|${j}|${c}"><span class="pt-oi">${PT_ICO[c]}</span><b>${T(PT_KEY[c])}</b>${v === c ? "<i>✓</i>" : ""}</button>`).join("")}
    ${v ? `<button class="linkbtn" data-ptset="${d}|${j}|0">${T("ptX")}</button>` : ""}</div>`;
  openSheet();
}
function ptRefresh(){ if (LV.view === "home") renderHome(); else if (LV.view === "prayer") renderPrayer(); }
document.addEventListener("click", e => {
  const b = e.target.closest("[data-pt]"); if (b) { e.stopPropagation(); e.preventDefault(); const [d, j] = b.dataset.pt.split("|"); ptChooser(d, +j); return; }
  const s = e.target.closest("[data-ptset]"); if (!s) return;
  e.stopPropagation(); const [d, j, c] = s.dataset.ptset.split("|"), a = prDay(d).slice(); a[+j] = +c; U.pr[d] = a; saveU();
  if (+c && navigator.vibrate) navigator.vibrate(15);
  closeAll(); ptRefresh();
}, true);
function ptStats(n, end){
  const r = { sum: 0, full: 0, of: n * 5, by: { 1: 0, 2: 0, 3: 0, 4: 0 } };
  for (let i = 0; i < n; i++) { const dt = new Date(end || Date.now()); dt.setDate(dt.getDate() - i); const a = prDay(dk(dt)), c = a.filter(Boolean).length; r.sum += c; if (c === 5) r.full++; a.forEach(x => { if (x) r.by[x]++; }); }
  return r;
}
let PT_OFF = 0;
function ptWeekHTML(){
  const names = T("prNames"), days = [], end = new Date(); end.setDate(end.getDate() - PT_OFF * 7);
  for (let i = 6; i >= 0; i--) { const dt = new Date(end); dt.setDate(dt.getDate() - i); days.push(dt); }
  const w = ptStats(7, end), m = ptStats(new Date().getDate()), today = dayKey(), wd = new Intl.DateTimeFormat(settings.lang === "en" ? "en-GB" : "ur-PK", { weekday: "short" });
  return `<section class="ps pt"><div class="pt-top"><button class="iconbtn" data-ptw="1" aria-label="${T("ptPrev")}">‹</button><h4>${T("ptH")}</h4><button class="iconbtn" data-ptw="-1"${PT_OFF ? "" : " disabled"} aria-label="${T("ptNext")}">›</button></div>
    <p class="ds-note" style="margin-top:0">${T("ptTapCell")}</p>
    <div class="pt-grid"><span></span>${days.map(dt => `<b class="${dk(dt) === today ? "now" : ""}">${esc(wd.format(dt))}<small>${nf(dt.getDate())}</small></b>`).join("")}
    ${PR_IDX.map((pi, j) => `<span class="pt-n">${names[pi]}</span>${days.map(dt => { const d = dk(dt), v = prDay(d)[j], due = isDue(d, j);
      return `<button class="pt-c${v ? " pt" + v : ""}" data-pt="${d}|${j}"${due || v ? "" : " disabled"} aria-label="${esc(names[pi] + " " + d)}">${v ? PT_ICO[v] : ""}</button>`; }).join("")}`).join("")}</div>
    <div class="pt-leg">${[3, 2, 1, 4].map(c => `<span><i class="pt${c}">${PT_ICO[c]}</i>${T(PT_KEY[c])}</span>`).join("")}</div>
    <p class="pt-sum"><b>${PT_OFF ? "" : T("ptWeek") + ":"}</b> ${T("ptOf", nf(w.sum), nf(w.of))} · ${T("ptFull", nf(w.full))}<br><small>${T("ptBy", nf(w.by[3]), nf(w.by[2]), nf(w.by[1]), nf(w.by[4]))}</small>
    ${PT_OFF ? "" : `<br><b>${T("ptMonth")}:</b> ${T("ptOf", nf(m.sum), nf(m.of))}`}</p></section>`;
}
document.addEventListener("click", e => { const b = e.target.closest("[data-ptw]"); if (!b) return; PT_OFF = Math.max(0, PT_OFF + +b.dataset.ptw); const el = $("#prayerv .pt"); if (el) el.outerHTML = ptWeekHTML(); });
const _renderPrayerD = renderPrayer;
renderPrayer = function(){ _renderPrayerD(); const pw = $("#prayerv .pw"); if (pw) pw.insertAdjacentHTML("afterend", ptWeekHTML()); };
VIEWS.prayer.render = renderPrayer;
/* ===== 2. tasbih ===== */
const TS_PH = [["سُبْحَانَ اللّٰهِ", "SubhanAllah"], ["الْحَمْدُ لِلّٰهِ", "Alhamdulillah"], ["اللّٰهُ أَكْبَرُ", "Allahu Akbar"], ["لَا إِلٰهَ إِلَّا اللّٰهُ", "La ilaha illallah"],
  ["أَسْتَغْفِرُ اللّٰهَ", "Astaghfirullah"], ["اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", "Durood"], ["سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ", "SubhanAllahi wa bihamdihi"]];
const TS = Object.assign({ ph: 0, n: 0, goal: 33, after: false, step: 0, day: "", tot: 0 }, store.get("tasbih", {}));
const tsSave = () => store.set("tasbih", TS);
function tsHTML(){
  if (TS.day !== dayKey()) { TS.day = dayKey(); TS.tot = 0; tsSave(); }
  const ph = TS.after ? [0, 1, 2][TS.step] : TS.ph, goal = TS.after ? [33, 33, 34][TS.step] : TS.goal, pct = goal ? Math.min(100, TS.n / goal * 100) : 0;
  return `<section class="ts-card" id="tsCard"><div class="ts-top"><b>${T("tsH")}</b><small>${T("tsToday", nf(TS.tot))}</small></div>
    <div class="chips wrap ts-ph">${TS_PH.map((p, i) => `<button class="chip" data-tsph="${i}" aria-pressed="${!TS.after && TS.ph === i}">${esc(p[1])}</button>`).join("")}<button class="chip" data-tsafter="1" aria-pressed="${TS.after}">${T("tsAfter")}</button></div>
    <button class="ts-tap" data-tstap="1" style="--p:${pct}%"><span class="ts-ar">${esc(TS_PH[ph][0])}</span><span class="ts-n">${nf(TS.n)}</span><span class="ts-g">/ ${nf(goal)}</span></button>
    <div class="ts-ctl">${TS.after ? "" : `<label>${T("tsGoal")} <select id="tsGoal">${[33, 99, 100, 500, 1000].map(g => `<option${TS.goal === g ? " selected" : ""}>${g}</option>`).join("")}</select></label>`}<button class="btn ghost" data-tsreset="1">↺ ${T("tsReset")}</button></div></section>`;
}
function tsRedraw(){ const c = $("#tsCard"); if (c) c.outerHTML = tsHTML(); }
document.addEventListener("click", e => {
  if (e.target.closest("[data-tstap]")) {
    const goal = TS.after ? [33, 33, 34][TS.step] : TS.goal; TS.n++; TS.tot++;
    if (TS.n >= goal) { if (navigator.vibrate) navigator.vibrate([40, 60, 40]); if (TS.after && TS.step < 2) { TS.step++; TS.n = 0; } else if (!TS.after) { /* stay at goal, keep counting */ } }
    else if (navigator.vibrate) navigator.vibrate(8);
    tsSave(); tsRedraw(); return;
  }
  const ph = e.target.closest("[data-tsph]"); if (ph) { TS.ph = +ph.dataset.tsph; TS.after = false; TS.n = 0; tsSave(); tsRedraw(); return; }
  if (e.target.closest("[data-tsafter]")) { TS.after = true; TS.step = 0; TS.n = 0; tsSave(); tsRedraw(); return; }
  if (e.target.closest("[data-tsreset]")) { TS.n = 0; TS.step = 0; tsSave(); tsRedraw(); }
});
document.addEventListener("change", e => { if (e.target.id === "tsGoal") { TS.goal = +e.target.value; tsSave(); tsRedraw(); } });
const _renderAzkarD = renderAzkar;
renderAzkar = async function(){ const r = await _renderAzkarD(); const el = $("#azkar"); if (el && !$("#tsCard")) { const top = el.querySelector(".az-cats, .chips, nav") ; if (top) top.insertAdjacentHTML("afterend", tsHTML()); else el.insertAdjacentHTML("afterbegin", tsHTML()); } return r; };
VIEWS.azkar.render = renderAzkar;
/* ===== 3. Jumu'ah card on Fridays ===== */
function jumuahHTML(){
  const read = (U.rd && U.rd[dayKey()] || []).filter(k => k.startsWith("18:")).length;
  return `<section class="hm-card jm-card"><h3>🕌 ${T("jmH")}</h3>
    <button class="jm-row" data-oa2="18:1"><span class="bm-i">📖</span><span><b>${T("jmKahf")}</b><small>${T("jmKahfSub", nf(read))}</small></span><i class="c1-bar"><em style="width:${Math.min(100, read / 110 * 100)}%"></em></i></button>
    <button class="jm-row" data-jmd="1"><span class="bm-i">﷽</span><span><b>${T("jmDurood")}</b><small>${T("jmDuroodSub")}</small></span></button>
    <div class="jm-row"><span class="bm-i">⏳</span><span><b>${T("jmHour")}</b><small>${T("jmHourSub")}</small></span></div>
    <button class="linkbtn" data-jmrem="1">${T("jmRem")}</button></section>`;
}
const _renderHomeD = renderHome;
renderHome = async function(){ const r = await _renderHomeD(); if (new Date().getDay() === 5 && !$("#home .jm-card")) { const pw = $("#home .pw"); if (pw) pw.insertAdjacentHTML("afterend", jumuahHTML()); else $("#home").insertAdjacentHTML("afterbegin", jumuahHTML()); } return r; };
VIEWS.home.render = renderHome;
$("#home").addEventListener("click", e => {
  const o = e.target.closest("[data-oa2]"); if (o) { const [s, a] = o.dataset.oa2.split(":").map(Number); showView("read"); openSurah(s, a); return; }
  if (e.target.closest("[data-jmd]")) { TS.ph = 5; TS.after = false; TS.n = 0; TS.goal = Math.max(TS.goal, 100); tsSave(); showView("azkar"); return; }
  if (e.target.closest("[data-jmrem]")) {
    const nx = new Date(); nx.setDate(nx.getDate() + ((5 - nx.getDay() + 7) % 7)); const day = `${nx.getFullYear()}${String(nx.getMonth() + 1).padStart(2, "0")}${String(nx.getDate()).padStart(2, "0")}`;
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//QuranToSoul//Jumuah//EN", "BEGIN:VEVENT", "UID:qts-kahf@qurantosoul.com", `DTSTAMP:${day}T000000Z`, `DTSTART:${day}T100000`, "DURATION:PT15M", "RRULE:FREQ=WEEKLY;BYDAY=FR",
      "SUMMARY:Surah Al-Kahf — QuranToSoul", "DESCRIPTION:https://qurantosoul.com/?s=18&a=1", "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Surah Al-Kahf", "TRIGGER:PT0M", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const u = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })), l = document.createElement("a"); l.href = u; l.download = "jumuah-kahf.ics"; l.click(); setTimeout(() => URL.revokeObjectURL(u), 4000);
  }
});
/* ===== 4. transliteration under each word (optional) ===== */
function addTl(root){
  if (!settings.tlit) return;
  root.querySelectorAll(".w:not([data-tl])").forEach(w => {
    w.dataset.tl = 1; const blk = w.closest(".sblk"), s = blk ? +blk.dataset.s : (CUR && CUR.n), d = blk && typeof BLK !== "undefined" ? BLK[s] : CUR;
    const x = d && d.ayahs[+w.dataset.a - 1] && d.ayahs[+w.dataset.a - 1].w[+w.dataset.i]; if (!x || !x[2]) return;
    const g = w.querySelector(".g"), el = document.createElement("span"); el.className = "tl"; el.dir = "ltr"; el.textContent = x[2];
    if (g) g.before(el); else w.appendChild(el);
  });
}
new MutationObserver(() => addTl($("#main"))).observe($("#main"), { childList: true, subtree: true });
function tlInject(){
  const body = (LV.view === "settings" && $("#setDisp")) || $("#sheetBody"); if (!body || body.querySelector("#dsTl")) return;
  const at = [...body.querySelectorAll("section.ds")].find(s => s.querySelector("[data-vm]"));
  const html = `<label class="ds ds-row ds-sw"><span><b>${T("tlH")}</b><small>${T("tlSub")}</small></span><input type="checkbox" role="switch" id="dsTl"${settings.tlit ? " checked" : ""}><i aria-hidden="true"></i></label>`;
  if (at) at.insertAdjacentHTML("afterend", html); else body.insertAdjacentHTML("beforeend", html);
}
const _displaySheetT = displaySheet;
displaySheet = function(){ _displaySheetT(); tlInject(); };
const _renderSettingsT = renderSettings;
renderSettings = function(...a){ const r = _renderSettingsT(...a); tlInject(); return r; };
VIEWS.settings.render = renderSettings;
document.addEventListener("change", e => { if (e.target.id === "dsTl") { settings.tlit = e.target.checked; saveSettings(); if (CUR) rerender(); } });
/* ===== 5. lock screen / headphones: proper title, artwork, seek ===== */
const _updateBarD = updateBar;
updateBar = function(){
  _updateBarD();
  if (!("mediaSession" in navigator) || !window.MediaMetadata || !P.s) return;
  const S = META.surahs[P.s - 1], r = recName();
  try { navigator.mediaSession.metadata = new MediaMetadata({ title: `${S.tr} · ${S.ar} — ${P.s}:${P.a}`, artist: settings.lang === "en" ? r[2] : r[1], album: "QuranToSoul",
    artwork: [{ src: "icon-192.png", sizes: "192x192", type: "image/png" }, { src: "icon-512.png", sizes: "512x512", type: "image/png" }] }); } catch(e){}
};
if ("mediaSession" in navigator) {
  const seek = d => { try { P.audio.currentTime = Math.max(0, P.audio.currentTime + d); } catch(e){} };
  try { navigator.mediaSession.setActionHandler("seekbackward", () => seek(-10)); navigator.mediaSession.setActionHandler("seekforward", () => seek(10)); navigator.mediaSession.setActionHandler("stop", () => stopPlayer()); } catch(e){}
}
