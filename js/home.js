"use strict";
/* ---------- Home: next prayer, continue reading, today's progress, word of the day ---------- */
Object.assign(L.ur, { tabHome:"ہوم", homeT:"السلام علیکم", contH:"پڑھنا جاری رکھیں", contB:"جاری رکھیں", ayahN:n=>`آیت ${ud(n)}`, todayH:"آج", ofGoal:(r,g)=>`${ud(r)} / ${ud(g)} آیات`, minsToday:m=>`${ud(m)} منٹ قرآن کے ساتھ`, prAll:"نماز کے تمام اوقات اور یاد دہانی", tafH:"تفسیر جاری رکھیں", hearW:"▶ سنیں" });
Object.assign(L.en, { tabHome:"Home", homeT:"Assalamu alaikum", contH:"Continue reading", contB:"Continue", ayahN:n=>`Ayah ${n}`, todayH:"Today", ofGoal:(r,g)=>`${r} / ${g} ayahs`, minsToday:m=>`${m} min with the Quran`, prAll:"All prayer times and reminders", tafH:"Continue tafsir", hearW:"▶ Listen" });
function hijriToday(){
  try { return new Intl.DateTimeFormat((settings.lang === "en" ? "en" : "ur") + "-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(new Date()); } catch(e) { return ""; }
}
function renderHome(){
  const el = $("#home"), last = store.get("last", { s: 1, a: 1 }), S = META.surahs[last.s - 1];
  const { t } = todayTimes(), now = ((nowMin() % 1440) + 1440) % 1440, names = T("prNames");
  const ni = [0, 2, 3, 4, 5].find(i => t[i] > now), next = ni == null ? 0 : ni, left = ni == null ? t[0] + 1440 - now : t[ni] - now;
  const d = dayKey(), read = (U.rd && U.rd[d] ? U.rd[d].length : 0) || U.days[d] || 0, goal = typeof dailyReadTarget === "function" ? dailyReadTarget().pace : (U.goal || 10);
  const mins = Math.round(((U.secs || {})[d] || 0) / 60);
  let wotd = "";
  if (LV.V) { const r = rng(today() * 7919)(), w = LV.V.words[Math.floor(r * 1000)];
    wotd = `<section class="hm-card hm-wotd"><small>${T("wotd")}</small><div class="hm-ar">${esc(w[1])}</div><p>${esc(w[5])}</p><button class="btn ghost" data-hword="${w[7]}:${w[8]}:${w[9]}">${T("hearW")}</button></section>`; }
  el.innerHTML = `<header class="hm-top"><h2>${T("homeT")}</h2><p>${esc(hijriToday())}</p></header>
    <section class="hm-pr" data-goto-pr="1">
      <div><small>${esc(prLoc().name)}</small><b>${names[next]} · ${hm(t[next])}</b><span>${T("prIn", nf(Math.floor(left / 60)), nf(Math.floor(left % 60)))}</span></div>
      <ul>${[0, 2, 3, 4, 5].map(i => `<li class="${i === next ? "on" : ""}"><span>${names[i]}</span><time>${hm(t[i])}</time></li>`).join("")}</ul>
    </section>
    <section class="hm-card hm-cont"><div><small>${T("contH")}</small><b>${esc(settings.lang === "en" ? S.tr : S.ar)}</b><span>${T("ayahN", nf(last.a))}</span></div><button class="btn" data-hcont="1">${T("contB")}</button></section>
    <section class="hm-card hm-today"><div class="hm-ring">${ringSVG(Math.min(100, Math.round(read / Math.max(1, goal) * 100)))}</div><div><small>${T("todayH")}</small><b>${T("ofGoal", nf(read), nf(goal))}</b><span>${T("minsToday", nf(mins))}</span></div></section>
    ${wotd}
    <div id="hmPrayer">${prayerHTML()}</div>`;
}
VIEWS.home = { el: "#home", title: () => ["QuranToSoul", hijriToday()], render: renderHome };
$("#home").addEventListener("click", e => {
  if (e.target.closest("[data-hcont]")) { const last = store.get("last", { s: 1, a: 1 }); showView("read"); openSurah(last.s, last.a); return; }
  const w = e.target.closest("[data-hword]"); if (w) { const [s, a, i] = w.dataset.hword.split(":").map(Number); playWord(s, a, i); return; }
  if (e.target.closest("[data-goto-pr]")) { const p = document.getElementById("hmPrayer"); if (p) p.scrollIntoView({ behavior: "smooth" }); }
});
/* prayer section lives on Home now */
prRefresh = function(){ const el = document.querySelector("#hmPrayer"); if (el) el.innerHTML = prayerHTML(); };
setInterval(() => { if (LV.view === "home") renderHome(); }, 60000);
