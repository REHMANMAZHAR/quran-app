"use strict";
/* ---------- Full-surah reciters from mp3quran.net (one MP3 per surah). With mp3quran's ayah timings the current ayah is
   still marked and followed, repeat and A–B loops still work; without timings the surah simply plays through. ---------- */
const MQ = [   // [id, Urdu name, English name, mp3quran folder, timing read id (0 = none)]
  ["mq:225", "عبدالرحمن العوسی", "Abdulrahman Al-Ossi", "abdulrahman-oosi", 225],
  ["mq:254", "بدر الترکی", "Badr Al-Turki", "badr-turki", 0],
  ["mq:12", "ادریس ابکر", "Idris Abkar", "idrees-abkar", 12],
  ["mq:221", "رعد محمد الکردی", "Raad Al-Kurdi", "raad-kurdi", 221]
];
const _metaMQ = DATA.meta;
DATA.meta = () => _metaMQ().then(m => {
  if (!m._mq) { m._mq = 1; MQ.forEach(r => m.reciters.push([r[0], r[1] + " (مکمل سورت)", r[2] + " (full surah)"])); }
  return m;
});
const isMQ = () => /^mq:/.test(settings.rec || "");
const mqInfo = () => MQ.find(x => x[0] === settings.rec);
const MQT = {};
const mqT = () => { const r = mqInfo(); return r && r[4] && MQT[r[4]] ? MQT[r[4]][P.s - 1] : null; };
async function mqLoad(r){ if (r && r[4] && !MQT[r[4]]) { try { MQT[r[4]] = await load("mq" + r[4], `data/mq/t${r[4]}.json?v=${DV}`); } catch(e){} } }
function mqSeek(sec){ try { P.audio.currentTime = Math.max(0, sec); } catch(e){} }
const _startAudioMQ = startAudio;
startAudio = function(){
  if (!isMQ()) return _startAudioMQ();
  const r = mqInfo(), url = `https://cdn.mp3quran.net/audio/${r[3]}/r1/${p3(P.s)}.mp3`;
  P.taud = false; P.bism = false; P.T = null; P.liveKey = null;
  if (P.pre && !P.pre.paused) P.pre.pause();
  mqLoad(r).then(() => {
    const go = () => { const t = mqT(); mqSeek(t && P.a > 1 ? t[P.a - 1][0] / 1000 : 0); P.audio.playbackRate = settings.speed; P.audio.play().catch(() => {}); };
    if (P.audio.getAttribute("src") !== url) { P.audio.src = url; P.audio.addEventListener("loadedmetadata", go, { once: true }); P.audio.play().catch(() => {}); }
    else go();
  });
  updateBar(); markAyah();
};
/* follow the ayah being recited inside the surah file */
const mqTick = () => {
  if (!isMQ() || !P.s || P.audio.paused) return;
  const T0 = mqT(); if (!T0) return;
  const t = P.audio.currentTime * 1000, cur = P.a, seg = T0[cur - 1]; if (!seg) return;
  if (t >= seg[1] - 60) {                       // this ayah has finished
    P.count++;
    if (P.rep === 0 || P.count < P.rep) { mqSeek(seg[0] / 1000); return; }
    P.count = 0;
    if (P.loop && P.loop.s === P.s && P.loop.b != null && cur >= P.loop.b) { P.a = P.loop.a; mqSeek(T0[P.a - 1][0] / 1000); markAyah(); updateBar(); return; }
    if (cur < T0.length) { P.a = cur + 1; markAyah(); updateBar(); }
  } else if (t < seg[0] - 400) {                // the listener moved back with the seek bar
    const k = T0.findIndex(x => t >= x[0] && t < x[1]); if (k >= 0 && k + 1 !== cur) { P.a = k + 1; markAyah(); updateBar(); }
  }
};
onA("timeupdate", mqTick);
