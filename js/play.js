"use strict";
/* ---------- recitation extras: sleep timer, offline surah audio, offline data pack (sections E, G) ---------- */
Object.assign(L.ur, {
  sleep:"سلیپ ٹائمر", sleepOff:"ٹائمر بند", sleepEnd:"سورت کے آخر پر", sleepSet:t=>`تلاوت ${t} بعد رک جائے گی`, min:n=>`${ud(n)} منٹ`,
  dlAudio:"اس سورت کی تلاوت آف لائن محفوظ کریں", dlProg:(a,b)=>`محفوظ ہو رہی ہے ${ud(a)}/${ud(b)}`, dlDone:"آف لائن محفوظ — انٹرنیٹ کے بغیر سن سکتے ہیں", dlFail:"کچھ آیات محفوظ نہیں ہوئیں",
  offPack:"پورا متن آف لائن محفوظ کریں (۱۲ MB)", offProg:(a,b)=>`محفوظ ہو رہا ہے ${ud(a)}/${ud(b)}`, offDone:"تمام متن آف لائن دستیاب ہے",
  offH:"آف لائن", scholarH:"علمی نظرِ ثانی", scholarTxt:"الفاظ کے بنیادی معانی: عالم نے نظرِ ثانی کی (اکتوبر ۲۰۲۶)۔ گرامر نوٹس، دعاؤں کے ترجمے اور کورس: مسودہ — نظرِ ثانی جاری۔ کوئی غلطی نظر آئے تو بتائیں۔",
  feedback:"رائے / تجویز بھیجیں", fbSubj:"QuranToSoul — رائے"
});
Object.assign(L.en, {
  sleep:"Sleep timer", sleepOff:"Timer off", sleepEnd:"At end of surah", sleepSet:t=>`Recitation will stop in ${t}`, min:n=>`${n} min`,
  dlAudio:"Save this surah's recitation offline", dlProg:(a,b)=>`Saving ${a}/${b}`, dlDone:"Saved offline — you can listen without internet", dlFail:"Some ayahs could not be saved",
  offPack:"Save all text offline (12 MB)", offProg:(a,b)=>`Saving ${a}/${b}`, offDone:"All text is available offline",
  offH:"Offline", scholarH:"Scholar review", scholarTxt:"Base meanings of words: reviewed by a scholar (Oct 2026). Grammar notes, dua translations and the course: draft — review in progress. Please report anything that looks wrong.",
  feedback:"Send feedback / suggestion", fbSubj:"QuranToSoul — feedback"
});
/* sleep timer: cycles off → 15 → 30 → 60 min → end of surah */
const SLEEP = { mode: 0, t: 0, timer: 0 }, SLEEP_OPTS = [0, 15, 30, 60, "end"];
function sleepAtEnd(){ if (SLEEP.mode === "end" && P.a >= CUR.ayahs.length) { P.audio.pause(); SLEEP.mode = 0; labelSleep(); return true; } return false; }
function labelSleep(){ const b = $("#pSleep"); if (!b) return; b.innerHTML = `<b>${SLEEP.mode === 0 ? "☾" : SLEEP.mode === "end" ? "☾∎" : "☾" + nf(SLEEP.mode)}</b><span class="cap">${T("capSleep")}</span>`; b.setAttribute("aria-pressed", SLEEP.mode !== 0); }
(function addSleepBtn(){
  const b = document.createElement("button"); b.className = "rep"; b.id = "pSleep"; b.setAttribute("aria-label", "Sleep timer"); b.setAttribute("aria-pressed", "false");
  $("#pRep").after(b); setTimeout(labelSleep);
  b.onclick = () => {
    const i = SLEEP_OPTS.indexOf(SLEEP.mode); SLEEP.mode = SLEEP_OPTS[(i + 1) % SLEEP_OPTS.length]; clearTimeout(SLEEP.timer);
    if (typeof SLEEP.mode === "number" && SLEEP.mode) { SLEEP.timer = setTimeout(() => { P.audio.pause(); SLEEP.mode = 0; labelSleep(); }, SLEEP.mode * 6e4); toast(esc(T("sleepSet", T("min", nf(SLEEP.mode))))); }
    else if (SLEEP.mode === "end") toast(esc(T("sleepEnd"))); else toast(esc(T("sleepOff")));
    labelSleep();
  };
})();
/* offline recitation for one surah (stored in the browser's cache; the service worker serves it) */
async function saveSurahAudio(n){
  const c = await caches.open("quran-audio"), total = META.surahs[n - 1].ayahs, urls = [];
  for (let a = 1; a <= total; a++) urls.push(`${AUDIO}${settings.rec}/${p3(n)}${p3(a)}.mp3`);
  if (n !== 1 && n !== 9) urls.push(`${AUDIO}${settings.rec}/001001.mp3`);
  let done = 0, fail = 0;
  for (const u of urls) {
    try { if (!(await c.match(u))) { const r = await fetch(u, { mode: "no-cors" }); await c.put(u, r); } } catch(e) { fail++; }
    done++; if (done % 5 === 0 || done === urls.length) toast(esc(T("dlProg", nf(done), nf(urls.length))), 1500);
  }
  toast(esc(fail ? T("dlFail") : T("dlDone")), 3500);
}
/* offline data pack: every text file the app uses (served from cache afterwards) */
async function saveOfflinePack(){
  const files = [`data/meta.json?v=${DV}`, `data/occ.json?v=${DV}`, `data/extras.json?v=${DV}`, `data/learn/vocab.json?v=${DV}`, `data/learn/senses.json?v=${DV}`, `data/similar.json?v=${DV}`, `data/search.json?v=${DV}`, `data/timing/${settings.rec}.json?v=${DV}`];
  for (let n = 1; n <= 114; n++) files.push(`data/s/${p3(n)}.json?v=${DV}`);
  if (settings.script === "ip") files.push(`data/indopak.json?v=${DV}`);
  let i = 0;
  for (const f of files) { try { await fetch(f); } catch(e) {} i++; if (i % 10 === 0) toast(esc(T("offProg", nf(i), nf(files.length))), 1500); }
  toast(esc(T("offDone")), 3500);
}
/* settings additions: offline, feedback, scholar panel */
const _drawDrawer = drawDrawer;
drawDrawer = function(){
  _drawDrawer();
  if (tab !== "settings") return;
  const set = document.querySelector("#drBody .set"); if (!set) return;
  set.insertAdjacentHTML("beforeend", `${typeof tafSettingsHTML === "function" ? tafSettingsHTML() : ""}<span class="lbl">${T("offH")}</span>
    <div class="wd-actions" style="flex-direction:column;align-items:stretch"><button data-x="pack">${T("offPack")}</button>${CUR ? `<button data-x="audio">${T("dlAudio")} · ${esc(surahName(CUR.n))}</button>` : ""}</div>
    <span class="lbl">${T("scholarH")}</span><div style="font-size:13px;line-height:1.8">${T("scholarTxt")}</div>
    <div class="wd-actions" style="margin-top:10px"><button data-x="fb">✉ ${T("feedback")}</button></div>`);
};
$("#drBody").addEventListener("click", e => {
  const b = e.target.closest("[data-x]"); if (!b) return;
  if (b.dataset.x === "pack") saveOfflinePack();
  else if (b.dataset.x === "audio" && CUR) saveSurahAudio(CUR.n);
  else if (b.dataset.x === "fb") location.href = `mailto:qurantosoulapp@gmail.com?subject=${encodeURIComponent(T("fbSubj"))}`;
});
