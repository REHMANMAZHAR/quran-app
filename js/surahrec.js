"use strict";
/* ---------- Surah-file recitation (mp3quran.net): one MP3 per surah + ayah timings.
   1) Full-surah reciters that have no ayah-by-ayah files (Al-Ossi, Badr Al-Turki, Idris Abkar, Raad Al-Kurdi).
   2) "Continuous" mode for the app's own reciters: the same Qari's surah file plays with no gap between ayahs;
      the ayah is followed from mp3quran's timings and the word from quran-align's timings, scaled to the ayah. ---------- */
const MQ = [   // [id, Urdu name, English name, mp3quran folder, timing read id (0 = none)]
  ["mq:225", "عبدالرحمن العوسی", "Abdulrahman Al-Ossi", "abdulrahman-oosi/r1", 225],
  ["mq:254", "بدر الترکی", "Badr Al-Turki", "badr-turki/r1", 0],
  ["mq:12", "ادریس ابکر", "Idris Abkar", "idrees-abkar/r1", 12],
  ["mq:221", "رعد محمد الکردی", "Raad Al-Kurdi", "raad-kurdi/r1", 221]
];
/* the same Qari on mp3quran.net, for gap-free play: everyayah id → [folder, timing read id] */
const CONT = {
  Alafasy_128kbps: ["mishary-alafasy/r1", 123], Abdul_Basit_Murattal_64kbps: ["abdulbasit-abdulsamad/r3", 53], Abdul_Basit_Mujawwad_128kbps: ["abdulbasit-abdulsamad/r1", 51],
  Husary_64kbps: ["mahmoud-husary/r1", 118], Minshawy_Murattal_128kbps: ["muhammad-minshawi/r1", 112], "Saood_ash-Shuraym_128kbps": ["saud-shuraim/r1", 31],
  "Abu_Bakr_Ash-Shaatree_128kbps": ["abubakr-shatri/r1", 4], Hani_Rifai_192kbps: ["hani-rifai/r1", 89], Mohammad_al_Tablaway_128kbps: ["muhammad-tablawi/r1", 106]
};
if (settings.cont == null) settings.cont = true;
const _metaMQ = DATA.meta;
DATA.meta = () => _metaMQ().then(m => {
  if (!m._mq) { m._mq = 1; MQ.forEach(r => m.reciters.push([r[0], r[1] + " (مکمل سورت)", r[2] + " (full surah)"])); }
  return m;
});
const isMQ = () => /^mq:/.test(settings.rec || "");
/* which surah file plays now, or null for ayah-by-ayah */
function surMode(){
  if (isMQ()) { const r = MQ.find(x => x[0] === settings.rec); return r ? { folder: r[3], read: r[4], words: false } : null; }
  const c = CONT[settings.rec];
  if (c && settings.cont !== false && !settings.gap && !(P.loop && P.loop.b != null)) return { folder: c[0], read: c[1], words: true };
  return null;
}
const MQT = {};
let SM = null;                                  // the mode in use for the current surah file
const mqT = () => SM && SM.read && MQT[SM.read] ? MQT[SM.read][P.s - 1] : null;
async function mqLoad(read){ if (read && !MQT[read]) { try { MQT[read] = await load("mq" + read, `data/mq/t${read}.json?v=${DV}`); } catch(e){} } }
function mqSeek(sec){ try { P.audio.currentTime = Math.max(0, sec); } catch(e){} }
const _startAudioMQ = startAudio;
startAudio = function(){
  const m = surMode();
  if (!m) { SM = null; return _startAudioMQ(); }
  SM = m;
  const url = `https://cdn.mp3quran.net/audio/${m.folder}/${p3(P.s)}.mp3`;
  P.taud = false; P.bism = false; P.liveKey = null;
  if (P.pre && !P.pre.paused) P.pre.pause();
  if (m.words) DATA.timing(settings.rec).then(T => { P.Tq = T; }).catch(() => {});
  mqLoad(m.read).then(() => {
    const tt = m.read && MQT[m.read] && MQT[m.read][P.s - 1];
    if (m.read && (!tt || tt.length !== META.surahs[P.s - 1].ayahs)) { if (isMQ()) { SM = Object.assign({}, m, { read: 0 }); } else { SM = null; return _startAudioMQ(); } }   // timings missing or not matching this surah: ayah by ayah (or plain play for full-surah-only reciters)
    const go = () => { const t = mqT(); mqSeek(t && P.a > 1 ? t[P.a - 1][0] / 1000 : 0); P.audio.playbackRate = settings.speed; P.audio.play().catch(() => {}); };
    if (P.audio.getAttribute("src") !== url) { P.audio.src = url; P.audio.addEventListener("loadedmetadata", go, { once: true }); P.audio.play().catch(() => {}); }
    else go();
  });
  updateBar(); markAyah();
};
/* follow the ayah (and word) being recited inside the surah file */
function mqTick(){
  if (!SM || !P.s || P.audio.paused) return;
  const T0 = mqT(); if (!T0) return;
  const t = P.audio.currentTime * 1000, cur = P.a, seg = T0[cur - 1]; if (!seg) return;
  if (t >= seg[1] - 40) {                       // this ayah has finished
    P.count++;
    if (P.rep === 0 || P.count < P.rep) { mqSeek(seg[0] / 1000); return; }
    P.count = 0;
    if (typeof sleepAtEnd === "function" && cur >= T0.length && sleepAtEnd()) return;
    if (cur < T0.length) { P.a = cur + 1; P.liveKey = null; markAyah(); updateBar(); }
    return;
  }
  if (t < seg[0] - 400) { const k = T0.findIndex(x => t >= x[0] && t < x[1]); if (k >= 0 && k + 1 !== cur) { P.a = k + 1; markAyah(); updateBar(); } return; }
  /* word: quran-align times are for the ayah-by-ayah file; scale them onto this ayah's length */
  const W = SM.words && P.Tq && P.Tq[P.s - 1] && P.Tq[P.s - 1][cur - 1];
  if (W && W.length) {
    const eDur = W[W.length - 1] || 1, mDur = Math.max(1, seg[1] - seg[0]), x = (t - seg[0]) * eDur / mDur;
    let hit = -1; for (let k = 0; k < W.length; k += 4) { if (x >= W[k + 2]) hit = k; else break; }
    if (hit >= 0) setLive(W[hit], W[hit + 1]);
  }
}
const _tickMQ = tick;
tick = function(){ if (SM) { P.raf = 0; return; } earlyNext(); _tickMQ(); };
/* ayah-by-ayah files end with a little silence: move on as soon as the last word has been recited */
function earlyNext(){
  if (P.bism || P.taud || settings.gap || !P.T || P.audio.paused) return;
  const seg = P.T[P.s - 1] && P.T[P.s - 1][P.a - 1]; if (!seg || seg.length < 4) return;
  const key = P.s + ":" + P.a + ":" + P.count, end = seg[seg.length - 1], t = P.audio.currentTime * 1000, d = P.audio.duration * 1000;
  if (P.earlyKey !== key && t > end + 120 && d - t > 250) { P.earlyKey = key; P.audio.pause(); P.audio.dispatchEvent(new Event("ended")); }
}   // the core word-follower is for ayah files only
let mqRaf = 0;
const mqLoop = () => { mqRaf = 0; if (!SM || P.audio.paused) return; mqTick(); mqRaf = requestAnimationFrame(mqLoop); };
onA("play", () => { if (SM && !mqRaf) mqRaf = requestAnimationFrame(mqLoop); });
onA("timeupdate", () => { if (SM && !mqRaf) mqTick(); });
/* Settings → Recitation: the gap-free switch */
Object.assign(L.ur, { contRecH:"مسلسل تلاوت (آیات کے درمیان وقفہ نہیں)", contRecSub:"پوری سورت کی ایک فائل چلتی ہے؛ آیت اور لفظ ساتھ ساتھ نمایاں ہوتے ہیں۔ آیات کے درمیان وقفہ چنیں تو آیت بہ آیت چلے گی۔" });
Object.assign(L.en, { contRecH:"Continuous recitation (no gap between ayahs)", contRecSub:"Plays the surah as one file; the ayah and word are still highlighted. Choosing a pause between ayahs switches to ayah by ayah." });
const _renderSettingsMQ = renderSettings;
renderSettings = function(){
  _renderSettingsMQ();
  const sp = document.querySelector("#st-rec .st-row");
  if (sp) sp.insertAdjacentHTML("afterend", `<label class="ds-row ds-sw cu-sw"><span><b>${T("contRecH")}</b><small>${T("contRecSub")}</small></span><input type="checkbox" role="switch" id="stCont"${settings.cont !== false ? " checked" : ""}><i aria-hidden="true"></i></label>`);
};
VIEWS.settings.render = renderSettings;
document.addEventListener("change", e => { if (e.target.id === "stCont") { settings.cont = e.target.checked; saveSettings(); if (P.s) playFrom(P.s, P.a, true); } });
