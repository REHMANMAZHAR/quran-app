"use strict";
/* ---------- views: Search, My Quran (bookmarks, notes, progress, goals), Duas, Mushaf page view (sections A, F, H) ---------- */
Object.assign(L.ur, {
  tabDuas:"دعائیں", tabMe:"میرا قرآن", searchT:"تلاش", searchSub:"عربی لفظ، مادہ، یا ترجمہ", searchPh:"مثلاً رحمة، ق و ل، صبر، patience",
  results:n=>`${ud(n)} نتائج`, roots:"مادے", noRes:"کچھ نہیں ملا", typeMore:"کم از کم دو حروف لکھیں",
  meT:"میرا قرآن", meSub:"بُک مارکس، نوٹس، پیش رفت", today:"آج", goal:"روزانہ ہدف (آیات)", goalTxt:(r,g)=>`آج ${ud(r)} / ${ud(g)} آیات`, readTot:(n)=>`کل ${ud(n)} آیات پڑھیں`,
  khatam:"ختم کا منصوبہ", khDays:"کتنے دن میں؟", khStart:"شروع کریں", khPace:(d,p)=>`روزانہ ${ud(p)} آیات · ${ud(d)} دن باقی`, khStop:"منصوبہ ختم کریں", khDone:"ماشاءاللہ! ختم مکمل",
  progH:"سورتوں کی پیش رفت", juzH:"پاروں کی پیش رفت", bmH:"بُک مارکس", notesH:"نوٹس اور تدبر", hlH:"ہائی لائٹس", nothing:"ابھی کچھ نہیں",
  exportN:"نوٹس PDF / پرنٹ", backup:"بیک اپ فائل", restore:"بیک اپ بحال کریں", restored:"بحال ہو گیا",
  duasT:"دعائیں", duasSub:"قرآنی اور مسنون", qDuas:"قرآنی دعائیں", mDuas:"مسنون دعائیں", fav:"پسندیدہ", openR:"لفظ بہ لفظ کھولیں", count:"گنتی", reset:"صفر",
  draftDua:"مسودہ — ترجمہ ہمارا اپنا ہے؛ عالم کی نظرِ ثانی باقی", src:"حوالہ:",
  pageT:n=>`صفحہ ${ud(n)}`, pageSub:"مدنی مصحف (۶۰۴ صفحات)", prevP:"پچھلا صفحہ", nextP:"اگلا صفحہ", toList:"آیات کی فہرست"
});
Object.assign(L.en, {
  tabDuas:"Duas", tabMe:"My Quran", searchT:"Search", searchSub:"Arabic word, root, or translation", searchPh:"e.g. رحمة, ق و ل, patience",
  results:n=>`${n} results`, roots:"Roots", noRes:"Nothing found", typeMore:"Type at least two letters",
  meT:"My Quran", meSub:"Bookmarks, notes, progress", today:"Today", goal:"Daily goal (ayahs)", goalTxt:(r,g)=>`Today ${r} / ${g} ayahs`, readTot:n=>`${n} ayahs read in total`,
  khatam:"Khatam planner", khDays:"Finish in how many days?", khStart:"Start", khPace:(d,p)=>`${p} ayahs a day · ${d} days left`, khStop:"Stop plan", khDone:"MashaAllah! Khatam complete",
  progH:"Progress by surah", juzH:"Progress by juz", bmH:"Bookmarks", notesH:"Notes & reflections", hlH:"Highlights", nothing:"Nothing yet",
  exportN:"Notes as PDF / print", backup:"Backup file", restore:"Restore backup", restored:"Restored",
  duasT:"Duas", duasSub:"From the Quran and the Sunnah", qDuas:"Quranic duas", mDuas:"Masnoon duas", fav:"Favourites", openR:"Open word by word", count:"Count", reset:"Reset",
  draftDua:"Draft — translations are our own; scholar review pending", src:"Source:",
  pageT:n=>`Page ${n}`, pageSub:"Madinah Mushaf (604 pages)", prevP:"Previous page", nextP:"Next page", toList:"Ayah list"
});
/* ===== Search ===== */
VIEWS.search = { el:"#searchv", title:() => [T("searchT"), T("searchSub")], render: renderSearch };
let SQ = "";
function renderSearch(){
  const el = $("#searchv");
  if (!el.querySelector("#sq")) {
    el.innerHTML = `<div class="sv-top"><input id="sq" class="search" type="search" placeholder="${esc(T("searchPh"))}" aria-label="${esc(T("searchT"))}" value="${esc(SQ)}"></div><div id="sres"></div>`;
    let t; $("#sq").addEventListener("input", e => { clearTimeout(t); t = setTimeout(() => runSearch(e.target.value), 250); });
  }
  setTimeout(() => $("#sq").focus(), 50);
  if (SQ) runSearch(SQ);
}
const AR = /[؀-ۿ]/;
async function runSearch(q){
  SQ = q; q = q.trim(); const out = $("#sres");
  if (q.replace(/\s/g, "").length < 2) { out.innerHTML = `<p class="muted">${T("typeMore")}</p>`; return; }
  out.innerHTML = `<div class="loading" style="padding:30px">${T("loading")}</div>`;
  let idx; try { idx = await DATA.search(); } catch(e) { out.innerHTML = `<p class="muted">${T("loadFail")}</p>`; return; }
  let h = "";
  if (AR.test(q)) {
    const letters = bareAr(q).replace(/\s/g, "");
    const roots = META.roots.map((R, i) => [R, i]).filter(([R]) => letters.length <= 4 && bareAr(R[0]) === letters);
    const lems = META.lemmas.map((Lm, i) => [Lm, i]).filter(([Lm]) => bareAr(Lm[0]) === letters).slice(0, 8);
    if (roots.length || lems.length) h += `<h3>${T("roots")}</h3><ul class="lemlist">${roots.map(([R, i]) => `<li><button data-root="${i}"><span class="la">${esc(spaced(R[0]))}</span><span class="lg">${T("rootCnt", R[2].length, R[1])}</span><span class="lc"></span></button></li>`).join("")}
      ${lems.map(([Lm, i]) => `<li><button data-root="${Lm[2]}"><span class="la">${esc(Lm[0])}</span><span class="lg">${esc(Lm[4])}</span><span class="lc">${T("times", Lm[3])}</span></button></li>`).join("")}</ul>`;
    const needle = bareAr(q);
    const hits = idx.filter(r => r[2].includes(needle));
    h += `<h3>${T("results", nf(hits.length))}</h3>` + listHits(hits.slice(0, 80), r => esc(r[2]).replace(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), m => `<mark>${m}</mark>`), true);
  } else {
    const ql = q.toLowerCase(), hits = idx.filter(r => r[3].toLowerCase().includes(ql) || r[4].includes(q));
    const mark = s => esc(s).replace(new RegExp(ql.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), m => `<mark>${m}</mark>`);
    h += `<h3>${T("results", nf(hits.length))}</h3>` + listHits(hits.slice(0, 80), r => mark(r[3].toLowerCase().includes(ql) ? r[3] : r[4]), false);
  }
  out.innerHTML = h || `<p class="muted">${T("noRes")}</p>`;
}
function listHits(hits, txt, ar){
  return `<ul class="occ">${hits.map(r => `<li><button data-go2="${r[0]}:${r[1]}"><div class="${ar ? "oa" : "otr"}">${txt(r)}</div><div class="or">${esc(surahName(r[0]))} ${nf(r[0])}:${nf(r[1])}</div></button></li>`).join("")}</ul>`;
}
$("#searchv").addEventListener("click", e => {
  const g = e.target.closest("[data-go2]"); if (g) { const [s, a] = g.dataset.go2.split(":").map(Number); openSurah(s, a); return; }
  const r = e.target.closest("[data-root]"); if (r && +r.dataset.root >= 0) openRoot(+r.dataset.root);
});
$("#btnSearch").onclick = () => showView("search");
/* ===== My Quran ===== */
VIEWS.me = { el:"#me", title:() => [T("meT"), T("meSub")], render: renderMe };
const TOTAL_AYAHS = 6236;
function renderMe(){
  const today = U.days[dayKey()] || 0, totalRead = Object.keys(U.read).length, g = U.goal || 10;
  let kh = "";
  if (U.khatam) {
    const left = Math.max(1, U.khatam.days - Math.floor((Date.now() - U.khatam.start) / 864e5)), rem = TOTAL_AYAHS - totalRead;
    kh = rem <= 0 ? `<p><b>${T("khDone")}</b></p>` : `<p>${T("khPace", nf(left), nf(Math.ceil(rem / left)))}</p>`;
    kh += `<button class="btn ghost" data-me="khStop">${T("khStop")}</button>`;
  } else kh = `<label class="rng">${T("khDays")} <select id="khD">${[7, 15, 30, 40, 60, 90, 180, 365].map(d => `<option${d === 30 ? " selected" : ""}>${d}</option>`).join("")}</select></label> <button class="btn" data-me="khStart">${T("khStart")}</button>`;
  const surahP = META.surahs.map(S => { let r = 0; for (let a = 1; a <= S.ayahs; a++) if (U.read[S.n + ":" + a]) r++; return [S, r]; });
  const started = surahP.filter(([, r]) => r > 0);
  const juzP = META.juz.map((j, k) => { const next = META.juz[k + 1], start = gid(j[0], j[1]), end = next ? gid(next[0], next[1]) : TOTAL_AYAHS + 1; let r = 0;
    for (const key in U.read) { const [s, a] = key.split(":").map(Number), x = gid(s, a); if (x >= start && x < end) r++; } return [k + 1, Math.round(r / (end - start) * 100)]; });
  const ref = k => { const [s, a] = k.split(":").map(Number); return `${esc(surahName(s))} ${nf(s)}:${nf(a)}`; };
  const bms = Object.keys(U.bm).sort((x, y) => U.bm[y] - U.bm[x]), notes = Object.keys(U.notes).sort((x, y) => U.notes[y].ts - U.notes[x].ts), hls = Object.keys(U.hl);
  $("#me").innerHTML = `${progressCards()}
    <div class="lh"><h3>${T("bmH")}</h3></div>${bms.length ? `<ul class="occ">${bms.map(k => `<li><button data-go2="${k}"><div class="or">★ ${ref(k)}</div></button></li>`).join("")}</ul>` : `<p class="muted">${T("nothing")}</p>`}
    <div class="lh"><h3>${T("notesH")}</h3>${notes.length ? `<button class="btn ghost" data-me="export">${T("exportN")}</button>` : ""}</div>
    ${notes.length ? `<ul class="occ">${notes.map(k => `<li><button data-go2="${k}"><div class="otr">${esc(U.notes[k].t)}</div><div class="or">✎ ${ref(k)}</div></button></li>`).join("")}</ul>` : `<p class="muted">${T("nothing")}</p>`}
    <div class="lh"><h3>${T("hlH")}</h3></div>${hls.length ? `<div class="chips wrap">${hls.map(k => `<button class="chip hl-${U.hl[k]}" data-go2="${k}"><b>${ref(k)}</b></button>`).join("")}</div>` : `<p class="muted">${T("nothing")}</p>`}
    <div class="lh"><h3>${T("juzH")}</h3></div><div class="juzp">${juzP.map(([k, p]) => `<div><b>${nf(k)}</b><i style="height:${p}%"></i></div>`).join("")}</div>
    <div class="lh"><h3>${T("progH")}</h3></div>${started.length ? `<ul class="sprog">${started.map(([S, r]) => `<li><button data-go2="${S.n}:1"><span>${nf(S.n)}. ${esc(settings.lang === "en" ? S.tr : S.ar)}</span><span class="pb2"><i style="width:${Math.round(r / S.ayahs * 100)}%"></i></span><small>${nf(r)}/${nf(S.ayahs)}</small></button></li>`).join("")}</ul>` : `<p class="muted">${T("nothing")}</p>`}
    <div class="wd-actions" style="margin:22px 0"><button data-me="backup">${T("backup")}</button><label class="filebtn">${T("restore")}<input type="file" id="restoreF" accept="application/json" hidden></label></div>
    <div class="wd-actions" style="margin:0 0 28px"><button data-reset="1" class="danger">↺ ${T("resetP")}</button></div>`;
  bindProgress();
  $("#restoreF").onchange = async e => { try { const d = JSON.parse(await e.target.files[0].text()); if (d.user) { Object.assign(U, d.user); saveU(); } if (d.learn) { Object.assign(LS, d.learn); saveL(); } toast(esc(T("restored"))); renderMe(); } catch(err) { toast(esc(T("loadFail"))); } };
}
let GID = null;
function gid(s, a){ if (!GID) { GID = [0]; let c = 0; META.surahs.forEach(S => { GID.push(c); c += S.ayahs; }); } return GID[s] + a; }
$("#me").addEventListener("click", e => {
  const g = e.target.closest("[data-go2]"); if (g) { const [s, a] = g.dataset.go2.split(":").map(Number); openSurah(s, a); return; }
  const b = e.target.closest("[data-me]"); if (!b) return;
  const act = b.dataset.me;
  if (act === "khStart") { U.khatam = { start: Date.now(), days: +$("#khD").value }; saveU(); renderMe(); }
  else if (act === "khStop") { U.khatam = null; saveU(); renderMe(); }
  else if (act === "backup") { const blob = new Blob([JSON.stringify({ app:"QuranToSoul", at:new Date().toISOString(), user:U, learn:LS, vid:VS })], { type:"application/json" });
    const u = URL.createObjectURL(blob), l = document.createElement("a"); l.href = u; l.download = "qurantosoul-backup.json"; l.click(); setTimeout(() => URL.revokeObjectURL(u), 4000); }
  else if (act === "export") exportNotes();
});
async function exportNotes(){
  const keys = Object.keys(U.notes).sort((x, y) => gid(...x.split(":").map(Number)) - gid(...y.split(":").map(Number)));
  const rows = await Promise.all(keys.map(async k => { const [s, a] = k.split(":").map(Number), t = await ayahText(s, a);
    return `<section><h2>${esc(META.surahs[s - 1].tr)} ${s}:${a}</h2><p class="ar">${esc(t.ar)}</p><p class="tr">${esc(t.tr)}</p><p class="note">${esc(U.notes[k].t).replace(/\n/g, "<br>")}</p></section>`; }));
  const w = open("", "_blank"); if (!w) return;
  w.document.write(`<!doctype html><meta charset="utf-8"><title>QuranToSoul — ${esc(T("notesH"))}</title><link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Noto+Nastaliq+Urdu&family=Crimson+Pro&display=swap" rel="stylesheet">
    <style>body{font-family:'Crimson Pro',serif;max-width:720px;margin:30px auto;padding:0 20px;color:#16262B}h1{font-size:24px}h2{font-size:16px;color:#1F5C66;margin:22px 0 4px}.ar{font-family:'Amiri Quran',serif;font-size:24px;direction:rtl;text-align:right;line-height:2}.tr{direction:auto;font-family:'Noto Nastaliq Urdu','Crimson Pro',serif;line-height:2}.note{border-left:3px solid #B8913A;padding-left:10px;white-space:normal;direction:auto}section{break-inside:avoid;border-bottom:1px solid #ddd;padding-bottom:10px}</style>
    <h1>QuranToSoul — ${esc(T("notesH"))}</h1>${rows.join("")}<script>document.fonts.ready.then(()=>setTimeout(()=>print(),300))<\/script>`);
  w.document.close();
}
/* ===== Duas ===== */
VIEWS.duas = { el:"#duas", title:() => [T("duasT"), T("duasSub")], render: renderDuas };
/* Masnoon duas: Arabic text from the hadith sources named; translations written for this app (draft, pending review) */
const MASNOON = [
 ["wake","On waking up","نیند سے اٹھ کر","الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ","Praise be to Allah who gave us life after He caused us to die, and to Him is the return.","تمام تعریف اللہ کے لیے ہے جس نے ہمیں موت (نیند) کے بعد زندگی دی، اور اسی کی طرف لوٹنا ہے۔","Sahih al-Bukhari 6312",1],
 ["sleep","Before sleeping","سونے سے پہلے","بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا","In Your name, O Allah, I die and I live.","اے اللہ! تیرے نام کے ساتھ میں مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔","Sahih al-Bukhari 6324",1],
 ["eat","Before eating","کھانے سے پہلے","بِسْمِ اللَّهِ","In the name of Allah.","اللہ کے نام سے۔","Sahih al-Bukhari 5376",1],
 ["ate","After eating","کھانے کے بعد","الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ","Praise be to Allah who fed me this and provided it for me without any power or strength of my own.","تمام تعریف اللہ کے لیے ہے جس نے مجھے یہ کھلایا اور میری کسی طاقت و قوت کے بغیر مجھے یہ رزق دیا۔","Sunan Abi Dawud 4023; Jami' at-Tirmidhi 3458 (grading: reviewer to confirm)",1],
 ["wc_in","Entering the toilet","بیت الخلاء میں داخل ہوتے وقت","اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ","O Allah, I seek refuge in You from the male and female evil ones.","اے اللہ! میں ناپاک جنوں (مردوں اور عورتوں) سے تیری پناہ چاہتا ہوں۔","Sahih al-Bukhari 142; Sahih Muslim 375",1],
 ["wc_out","Leaving the toilet","بیت الخلاء سے نکل کر","غُفْرَانَكَ","I ask Your forgiveness.","(اے اللہ) میں تیری بخشش چاہتا ہوں۔","Sunan Abi Dawud 30; Jami' at-Tirmidhi 7 (grading: reviewer to confirm)",1],
 ["home_out","Leaving home","گھر سے نکلتے وقت","بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ","In the name of Allah; I rely on Allah; there is no power and no strength except with Allah.","اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، اللہ کے بغیر نہ کوئی طاقت ہے نہ قوت۔","Sunan Abi Dawud 5095; Jami' at-Tirmidhi 3426 (grading: reviewer to confirm)",1],
 ["masjid_in","Entering the mosque","مسجد میں داخل ہوتے وقت","اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ","O Allah, open for me the doors of Your mercy.","اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔","Sahih Muslim 713",1],
 ["masjid_out","Leaving the mosque","مسجد سے نکلتے وقت","اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ","O Allah, I ask You of Your bounty.","اے اللہ! میں تجھ سے تیرا فضل مانگتا ہوں۔","Sahih Muslim 713",1],
 ["travel","Setting out on a journey","سفر کے وقت","سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ","Glory be to Him who has subjected this to us, and we could not have done it ourselves; and to our Lord we will surely return.","پاک ہے وہ ذات جس نے اسے ہمارے قابو میں کر دیا، ہم اسے قابو میں لانے والے نہ تھے، اور بے شک ہم اپنے رب کی طرف لوٹنے والے ہیں۔","Sahih Muslim 1342 (also Quran 43:13-14)",1],
 ["salah1","After salah: seeking forgiveness","نماز کے بعد: استغفار","أَسْتَغْفِرُ اللَّهَ","I seek Allah's forgiveness.","میں اللہ سے بخشش مانگتا ہوں۔","Sahih Muslim 591",3],
 ["salah2","After salah: peace","نماز کے بعد: سلامتی","اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ","O Allah, You are Peace and from You is peace. Blessed are You, Owner of majesty and honour.","اے اللہ! تو سلامتی والا ہے اور تجھ ہی سے سلامتی ہے، تو بابرکت ہے اے جلال اور عزت والے۔","Sahih Muslim 591",1],
 ["tasbih","After salah: tasbih","نماز کے بعد: تسبیح","سُبْحَانَ اللَّهِ · الْحَمْدُ لِلَّهِ · اللَّهُ أَكْبَرُ","Glory be to Allah (33) · Praise be to Allah (33) · Allah is the Greatest (34).","اللہ پاک ہے (۳۳) · تمام تعریف اللہ کے لیے (۳۳) · اللہ سب سے بڑا ہے (۳۴)۔","Sahih Muslim 596",100],
 ["istighfar","Master of seeking forgiveness (morning & evening)","سید الاستغفار (صبح و شام)","اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ","O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I keep Your covenant and promise as far as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins except You.","اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی طاقت بھر تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ چاہتا ہوں، تیری نعمتوں کا جو مجھ پر ہیں اقرار کرتا ہوں اور اپنے گناہ کا اقرار کرتا ہوں، پس مجھے بخش دے، تیرے سوا کوئی گناہ نہیں بخشتا۔","Sahih al-Bukhari 6306",1],
 ["protect","Protection (morning & evening, 3 times)","حفاظت (صبح و شام، ۳ بار)","بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ","In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.","اللہ کے نام سے جس کے نام کے ساتھ زمین و آسمان کی کوئی چیز نقصان نہیں پہنچا سکتی، اور وہ سب کچھ سننے والا، جاننے والا ہے۔","Sunan Abi Dawud 5088; Jami' at-Tirmidhi 3388 (grading: reviewer to confirm)",3],
 ["subhan","Glorification (100 times a day)","تسبیح (روزانہ ۱۰۰ بار)","سُبْحَانَ اللَّهِ وَبِحَمْدِهِ","Glory be to Allah and praise be to Him.","اللہ پاک ہے اپنی تعریف کے ساتھ۔","Sahih al-Bukhari 6405; Sahih Muslim 2691",100],
 ["tahlil","Declaration of oneness (100 times a day)","توحید (روزانہ ۱۰۰ بار)","لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ","There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He has power over all things.","اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف ہے، اور وہ ہر چیز پر قادر ہے۔","Sahih al-Bukhari 3293; Sahih Muslim 2691",100],
 ["distress","In distress","پریشانی کے وقت","لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ","There is no god but Allah, the Mighty, the Forbearing. There is no god but Allah, Lord of the mighty Throne. There is no god but Allah, Lord of the heavens, Lord of the earth and Lord of the noble Throne.","اللہ کے سوا کوئی معبود نہیں جو عظمت والا، بردبار ہے۔ اللہ کے سوا کوئی معبود نہیں جو عرشِ عظیم کا رب ہے۔ اللہ کے سوا کوئی معبود نہیں جو آسمانوں کا رب، زمین کا رب اور عرشِ کریم کا رب ہے۔","Sahih al-Bukhari 6346; Sahih Muslim 2730",1],
 ["sneeze","After sneezing","چھینک کے بعد","الْحَمْدُ لِلَّهِ","Praise be to Allah. (Reply: يَرْحَمُكَ اللَّهُ — may Allah have mercy on you; then: يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ — may Allah guide you and set your affairs right.)","تمام تعریف اللہ کے لیے ہے۔ (سننے والا کہے: يَرْحَمُكَ اللَّهُ — اللہ تم پر رحم کرے؛ پھر چھینکنے والا: يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ — اللہ تمہیں ہدایت دے اور تمہارا حال درست کرے۔)","Sahih al-Bukhari 6224",1]
];
/* Quranic duas: start at the words of the dua itself (رَبَّنَا، رَبِّ، اللَّهُمَّ), not at the narration before it */
function duaStart(W){
  const k = W.findIndex((w, i) => i > 0 && /^(و|ف)?(ربنا|رب|اللهم)$/.test(hzNorm(w[0])));
  return k > 0 ? k : 0;
}
function duaTrim(t){
  const m = t.search(/(اے ہمارے (رب|پروردگار)|اے میرے (رب|پروردگار)|پروردگار[ا]?|اے (ہمارے )?رب|اے اللہ|O our Lord|O my Lord|Our Lord|My Lord|O Lord)/);
  return m > 0 ? "… " + t.slice(m) : t;
}
/* second translation: Urdu when the main one is English, English when it is Urdu */
function otherTr(A){ const main = settings.tr || "ur"; return /^ur/.test(main) ? (A.en2 || A.en) : (A.ur || A.ur2); }
const DS = Object.assign({ fav:{}, cnt:{}, tab:"q" }, store.get("duas", {}));
const saveD = () => store.set("duas", DS);
async function renderDuas(){
  if (!EX) { $("#duas").innerHTML = `<div class="loading">${T("loading")}</div>`; try { EX = await DATA.extras(); } catch(e) { $("#duas").innerHTML = `<div class="loading">${T("loadFail")}</div>`; return; } }
  const en = settings.lang === "en", tab = DS.tab, star = id => `<button class="star" data-fav="${id}" aria-pressed="${!!DS.fav[id]}" aria-label="${T("fav")}">${DS.fav[id] ? "★" : "☆"}</button>`;
  let body = "";
  if (tab === "q" || tab === "f") {
    const list = EX.duas.filter(d => tab === "q" || DS.fav["q" + d[0] + ":" + d[1]]);
    const cards = await Promise.all(list.map(async d => {
      const [s, a, b, ten, tur, who] = d, id = "q" + s + ":" + a, sd = await DATA.surah(s); let ar = "", tr = "";
      let tr2 = "";
      for (let x = a; x <= b; x++) { const A = sd.ayahs[x - 1], st = x === a ? duaStart(A.w) : 0;
        ar += (st ? "… " : "") + A.w.slice(st).map(w => w[0]).join(" ") + ` ﴿${nf(x)}﴾ `;
        tr += (x === a && st ? duaTrim(trOf(A)) : trOf(A)) + " ";
        const o = otherTr(A); if (o) tr2 += (x === a && st ? duaTrim(o) : o) + " "; }
      return `<article class="dua"><div class="dh"><b>${esc(en ? ten : tur)}</b>${star(id)}</div><div class="who">${esc(who)} · ${esc(surahName(s))} ${nf(s)}:${nf(a)}${b !== a ? "–" + nf(b) : ""}</div>
        <p class="dar" dir="rtl" lang="ar">${esc(ar)}</p><p class="dtr ${/[؀-ۿ]/.test(tr) ? "ur" : ""}">${esc(tr.trim())}</p>${tr2.trim() ? `<p class="dtr dtr2 ${/[؀-ۿ]/.test(tr2) ? "ur" : ""}">${esc(tr2.trim())}</p>` : ""}
        <div class="wd-actions"><button data-go2="${s}:${a}">${T("openR")}</button><button data-dplay="${s}:${a}">▶</button></div></article>`;
    }));
    body = cards.join("");
  }
  if (tab === "m" || tab === "f") {
    body += MASNOON.filter(m => tab === "m" || DS.fav["m" + m[0]]).map(m => {
      const [id, ten, tur, ar, men, mur, src, n] = m, c = DS.cnt[id] || 0;
      return `<article class="dua"><div class="dh"><b>${esc(en ? ten : tur)}</b>${star("m" + id)}</div><p class="dar" dir="rtl" lang="ar">${esc(ar)}</p>
        <p class="dtr ${en ? "" : "ur"}">${esc(en ? men : mur)}</p><p class="dtr dtr2 ${en ? "ur" : ""}">${esc(en ? mur : men)}</p><div class="who">${T("src")} ${esc(src)}</div>
        <div class="ctr"><button class="btn" data-cnt="${id}">${T("count")} · <b>${nf(c)}</b>${n > 1 ? " / " + nf(n) : ""}</button><button class="btn ghost" data-cnt0="${id}">${T("reset")}</button></div></article>`;
    }).join("") + (tab === "m" ? `<p class="draft">${T("draftDua")}</p>` : "");
  }
  $("#duas").innerHTML = `<div class="seg3 dtabs"><button data-dt="q" aria-pressed="${tab === "q"}">${T("qDuas")}</button><button data-dt="m" aria-pressed="${tab === "m"}">${T("mDuas")}</button><button data-dt="f" aria-pressed="${tab === "f"}">★ ${T("fav")}</button></div>${body || `<p class="muted">${T("nothing")}</p>`}`;
}
$("#duas").addEventListener("click", e => {
  const t = e.target.closest("[data-dt]"); if (t) { DS.tab = t.dataset.dt; saveD(); renderDuas(); return; }
  const f = e.target.closest("[data-fav]"); if (f) { const id = f.dataset.fav; if (DS.fav[id]) delete DS.fav[id]; else DS.fav[id] = 1; saveD(); f.textContent = DS.fav[id] ? "★" : "☆"; f.setAttribute("aria-pressed", !!DS.fav[id]); return; }
  const c = e.target.closest("[data-cnt]"); if (c) { const id = c.dataset.cnt; DS.cnt[id] = (DS.cnt[id] || 0) + 1; saveD(); c.querySelector("b").textContent = nf(DS.cnt[id]); if (navigator.vibrate) navigator.vibrate(15);
    const m = MASNOON.find(x => x[0] === id); if (m && m[7] > 1 && DS.cnt[id] === m[7]) { toast("✓ " + nf(m[7])); if (navigator.vibrate) navigator.vibrate([60, 60, 60]); } return; }
  const c0 = e.target.closest("[data-cnt0]"); if (c0) { DS.cnt[c0.dataset.cnt0] = 0; saveD(); renderDuas(); return; }
  const g = e.target.closest("[data-go2]"); if (g) { const [s, a] = g.dataset.go2.split(":").map(Number); openSurah(s, a); return; }
  const p = e.target.closest("[data-dplay]"); if (p) { const [s, a] = p.dataset.dplay.split(":").map(Number); playFrom(s, a); }
});
/* ===== Mushaf page view (604 Madinah pages) ===== */
VIEWS.page = { el:"#mushaf", title:() => [T("pageT", nf(PG.n)), T("pageSub")], render: renderPage };
const PG = { n: 1 };
function pageOf(s, a){ const x = gid(s, a), P2 = EX.pages; let n = 1; while (n < 604 && P2[n + 1] <= x) n++; return n; }
function idToSA(x){ let s = 1; while (s < 114 && gid(s + 1, 1) <= x) s++; return [s, x - gid(s, 1) + 1]; }
async function openPageView(){
  if (!EX) EX = await DATA.extras();
  const last = store.get("last", { s: CUR ? CUR.n : 1, a: 1 }); PG.n = pageOf(last.s, last.a); showView("page");
}
async function renderPage(){
  const el = $("#mushaf"), P2 = EX.pages, from = P2[PG.n], to = P2[PG.n + 1] - 1;
  el.innerHTML = `<div class="loading">${T("loading")}</div>`;
  if (settings.script === "ip" && !IPK) { try { IPK = await DATA.indopak(); } catch(e){} }
  let h = "", curS = 0;
  for (let x = from; x <= to; x++) {
    const [s, a] = idToSA(x), d = await DATA.surah(s), A = d.ayahs[a - 1];
    if (s !== curS) { if (a === 1) h += `<div class="pg-sh">${esc(META.surahs[s - 1].ar)}</div>${s !== 1 && s !== 9 ? '<div class="bism">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>' : ""}`; curS = s; }
    h += `<span class="pg-a" data-go2="${s}:${a}">${A.w.map((w, i) => esc(wordText(s, a, i, w[0]))).join(" ")} <span class="end">${ud(a)}</span></span> `;
  }
  $("#tAr").textContent = T("pageT", nf(PG.n));
  el.innerHTML = `<div class="pg-text" dir="rtl" lang="ar">${h}</div>
    <div class="nav"><button data-pg="${PG.n + 1}"${PG.n >= 604 ? " disabled" : ""}>${T("nextP")}</button><button data-pg="list">${T("toList")}</button><button data-pg="${PG.n - 1}"${PG.n <= 1 ? " disabled" : ""}>${T("prevP")}</button></div>`;
}
$("#mushaf").addEventListener("click", e => {
  const p = e.target.closest("[data-pg]"); if (p) { if (p.dataset.pg === "list") { const [s, a] = idToSA(EX.pages[PG.n]); openSurah(s, a); } else { PG.n = +p.dataset.pg; renderPage(); scrollTo(0, 0); } return; }
  const g = e.target.closest("[data-go2]"); if (g) { const [s, a] = g.dataset.go2.split(":").map(Number); openSurah(s, a); }
});
let px0 = null;
$("#mushaf").addEventListener("touchstart", e => { px0 = e.touches[0].clientX; }, { passive: true });
$("#mushaf").addEventListener("touchend", e => { if (px0 == null) return; const dx = e.changedTouches[0].clientX - px0; px0 = null;
  if (Math.abs(dx) > 70) { const n = PG.n + (dx > 0 ? 1 : -1); if (n >= 1 && n <= 604) { PG.n = n; renderPage(); scrollTo(0, 0); } } });
