"use strict";
/* ---------- labels under every icon, "How it works" for every screen, "How to play" for every game ---------- */
Object.assign(L.ur, {
  capMenu:"سورتیں", capSearch:"تلاش", capPlay:"تلاوت", capTaf:"تفسیر", capHelp:"مدد", capSet:"ترتیبات", capPrev:"پچھلی", capPP:"چلائیں/روکیں", capNext:"اگلی", capRep:"دہرائیں", capSleep:"ٹائمر", capClose:"بند",
  tabGames:"کھیل", gamesT:"کھیل", gamesSub:"کھیل کر الفاظ سیکھیں", howPlay:"کیسے کھیلیں", start:"شروع کریں", helpT:"یہ کیسے کام کرتا ہے", gotIt:"سمجھ گیا"
});
Object.assign(L.en, {
  capMenu:"Surahs", capSearch:"Search", capPlay:"Recitation", capTaf:"Tafsir", capHelp:"Help", capSet:"Settings", capPrev:"Previous", capPP:"Play/Pause", capNext:"Next", capRep:"Repeat", capSleep:"Timer", capClose:"Close",
  tabGames:"Games", gamesT:"Games", gamesSub:"Learn words by playing", howPlay:"How to play", start:"Start", helpT:"How it works", gotIt:"Got it"
});
function fillCaps(){ document.querySelectorAll("[data-cap]").forEach(el => el.textContent = T(el.dataset.cap)); }
const _applyLang = applyLang;
applyLang = function(){ _applyLang(); fillCaps(); if (typeof updateBar === "function" && P.s) updateBar(); if (typeof labelSleep === "function") labelSleep(); };
/* help text per screen: [title, [lines]] in English and Urdu */
const VIEW_HELP = {
  read: { en:["Reading", ["Tap a word: its meaning appears at the bottom.", "Press and hold a word: full details — meaning of each part, grammar, root, every place it appears.", "Tap the round ayah number: menu to play from here, bookmark, highlight, note, share, tafseer, similar ayahs, loop, report a mistake.", "Buttons at the top of a surah: Uthmani / Indo-Pak script, Hifz (hide words to test yourself), Page (Mushaf page view).", "A thin gold line “Tafsir · Part N” (book icon) marks where each part of Dr. Israr's tafsir begins — tap it to listen. Choose Urdu audio, Urdu video, English audio or written tafsir in Settings. A− / A+ makes all text smaller or bigger.", "▶ Recitation at the top plays the recitation: it starts with the ta'awwudh, then the basmalah (not before At-Tawbah), and highlights each word as it is recited.", "☰ Surahs opens the surah and juz list; ⚙ Settings changes language, translation, reciter, text size and theme."]],
          ur:["پڑھنا", ["کسی لفظ کو دبائیں: اس کا معنی نیچے آ جائے گا۔", "لفظ کو دبائے رکھیں: پوری تفصیل — ہر حصے کا معنی، گرامر، مادہ، اور قرآن میں ہر جگہ جہاں یہ آیا۔", "آیت کے گول نمبر کو دبائیں: یہاں سے تلاوت، بُک مارک، ہائی لائٹ، نوٹ، شیئر، تفسیر، ملتی جلتی آیات، دہرائی، غلطی کی اطلاع۔", "سورت کے اوپر بٹن: عثمانی / انڈو پاک رسم الخط، حفظ (الفاظ چھپا کر خود کو جانچیں)، صفحہ (مصحف کا صفحہ)۔", "سنہری باریک لکیر «تفسیر · حصہ» (کتاب کا نشان) بتاتی ہے کہ ڈاکٹر اسرار کی تفسیر کا نیا حصہ یہاں سے شروع ہوتا ہے — سننے کے لیے دبائیں۔ اردو آڈیو، اردو ویڈیو، انگریزی آڈیو یا تحریری تفسیر سیٹنگز میں منتخب کریں۔ A− / A+ سے متن چھوٹا یا بڑا کریں۔", "اوپر ▶ تلاوت: پہلے تعوذ، پھر بسم اللہ (سورۃ التوبہ کے سوا)، اور ہر لفظ پڑھتے وقت نمایاں ہوتا ہے۔", "☰ سورتیں: سورتوں اور پاروں کی فہرست؛ ⚙ ترتیبات: زبان، ترجمہ، قاری، متن کا سائز، رنگ۔"]] },
  learn: { en:["Learn", ["The circle shows how much of the Quran's words you now recognise.", "Learn new words: cards with the most frequent words first. Tap a card to see the meaning, then tell us how well you knew it — words you didn't know come back today, easy ones come back later.", "Quran Arabic Quest: a step-by-step path. Learn a unit's words, then pass its quiz (80%) to open the next unit.", "Study tools: Salah mode, Grammar course, I'rab Lab, Root explorer.", "Lectures: continue Dr. Israr's Bayan-ul-Quran or Lisaan-ul-Quran where you stopped."]],
           ur:["سیکھیں", ["دائرہ بتاتا ہے کہ آپ قرآن کے کتنے فیصد الفاظ پہچانتے ہیں۔", "نئے الفاظ سیکھیں: سب سے زیادہ آنے والے الفاظ کے کارڈ۔ کارڈ دبا کر معنی دیکھیں، پھر بتائیں کتنا یاد تھا — جو یاد نہ تھا وہ آج ہی، اور آسان والا بعد میں دوبارہ آئے گا۔", "قرآن عربی کویسٹ: مرحلہ وار راستہ۔ یونٹ کے الفاظ سیکھیں، پھر اس کا کوئز (۸۰٪) پاس کریں تو اگلا یونٹ کھلے گا۔", "سیکھنے کے اوزار: نماز موڈ، گرامر کورس، اعراب لیب، مادوں کا خزانہ۔", "لیکچرز: ڈاکٹر اسرار کا بیان القرآن یا لسان القرآن وہیں سے جاری رکھیں جہاں چھوڑا تھا۔"]] },
  games: { en:["Games", ["Every game uses the words you are learning. Correct answers earn XP; XP raises your level and unlocks badges.", "Tap a game to play. Tap \"? How to play\" under it for its rules."]],
           ur:["کھیل", ["ہر کھیل انہی الفاظ سے ہے جو آپ سیکھ رہے ہیں۔ درست جواب پر XP ملتے ہیں؛ XP سے لیول بڑھتا ہے اور اعزازات ملتے ہیں۔", "کھیلنے کے لیے کھیل پر دبائیں۔ قواعد کے لیے اس کے نیچے \"؟ کیسے کھیلیں\" دبائیں۔"]] },
  duas: { en:["Duas", ["Quranic duas: supplications from the Quran with translation. \"Open word by word\" opens them in the reader; ▶ plays the recitation.", "Masnoon duas: from the hadith, with the source. Tap Count each time you recite it; Reset sets it back to zero.", "☆ adds a dua to Favourites."]],
          ur:["دعائیں", ["قرآنی دعائیں: قرآن کی دعائیں ترجمے کے ساتھ۔ \"لفظ بہ لفظ کھولیں\" انہیں پڑھنے والے صفحے پر کھولتا ہے؛ ▶ تلاوت سناتا ہے۔", "مسنون دعائیں: حدیث سے، حوالے کے ساتھ۔ ہر بار پڑھنے پر \"گنتی\" دبائیں؛ \"صفر\" سے دوبارہ شروع کریں۔", "☆ سے دعا پسندیدہ میں شامل ہو جاتی ہے۔"]] },
  me: { en:["My Quran", ["Daily goal: ayahs you read today (an ayah counts after it stays on screen for a moment).", "Khatam planner: choose in how many days to finish; it shows how many ayahs a day you need.", "Bookmarks, notes and highlights you added from the ayah menu — tap one to go there.", "Progress by juz and surah.", "Backup file saves everything to your phone; Restore brings it back on a new phone."]],
        ur:["میرا قرآن", ["روزانہ ہدف: آج کتنی آیات پڑھیں (آیت کچھ دیر اسکرین پر رہے تو گنی جاتی ہے)۔", "ختم کا منصوبہ: کتنے دن میں ختم کرنا ہے چنیں؛ روزانہ کتنی آیات پڑھنی ہیں یہ دکھائے گا۔", "آیت کے مینو سے لگائے گئے بُک مارکس، نوٹس اور ہائی لائٹس — دبا کر وہاں جائیں۔", "پاروں اور سورتوں کی پیش رفت۔", "بیک اپ فائل سب کچھ فون میں محفوظ کرتی ہے؛ بحال کریں سے نئے فون پر واپس لائیں۔"]] },
  search: { en:["Search", ["Type an Arabic word (e.g. رحمة) to find every ayah with it, plus its root.", "Type root letters with spaces (e.g. ق و ل) to see the root and its words.", "Type an English or Urdu word to search the translations. Tap a result to open the ayah."]],
            ur:["تلاش", ["عربی لفظ لکھیں (مثلاً رحمة) — ہر وہ آیت ملے گی جس میں یہ ہے، اور اس کا مادہ۔", "مادے کے حروف وقفے سے لکھیں (مثلاً ق و ل) — مادہ اور اس کے الفاظ۔", "انگریزی یا اردو لفظ لکھیں تو ترجمے میں تلاش ہوگی۔ نتیجہ دبا کر آیت کھولیں۔"]] },
  page: { en:["Mushaf page", ["The Quran laid out by page, like the 604-page Madinah Mushaf.", "Swipe or use the buttons for the next and previous page. Tap an ayah to open it word by word.", "\"Ayah list\" returns to the normal reading view."]],
          ur:["مصحف کا صفحہ", ["قرآن صفحہ بہ صفحہ، مدینہ مصحف (۶۰۴ صفحات) کی طرح۔", "اگلے/پچھلے صفحے کے لیے سوائپ کریں یا بٹن دبائیں۔ کسی آیت کو دبائیں تو وہ لفظ بہ لفظ کھلے گی۔", "\"آیات کی فہرست\" سے عام پڑھنے والے صفحے پر واپس جائیں۔"]] }
};
const GAME_HELP = {
  match:{ en:"Six Arabic words and six meanings. Tap a word, then tap its meaning. Clear all pairs as fast as you can — each wrong pair adds 3 seconds.", ur:"چھ عربی الفاظ اور چھ معانی۔ پہلے لفظ دبائیں، پھر اس کا معنی۔ جتنی جلدی ہو سکے سب جوڑے ملائیں — ہر غلط جوڑے پر ۳ سیکنڈ بڑھ جاتے ہیں۔" },
  quiz:{ en:"10 questions. Some show an Arabic word (pick its meaning), some show a meaning (pick the word), some play the word (listen, then pick the meaning).", ur:"۱۰ سوال۔ کچھ میں عربی لفظ (اس کا معنی چنیں)، کچھ میں معنی (لفظ چنیں)، کچھ میں لفظ سنایا جاتا ہے (سن کر معنی چنیں)۔" },
  listen:{ en:"A short ayah is shown and one of its words is played. Tap the word you heard. Tap ▶ Listen to hear it again.", ur:"ایک چھوٹی آیت دکھائی جاتی ہے اور اس کا ایک لفظ سنایا جاتا ہے۔ جو لفظ سنا اسے دبائیں۔ دوبارہ سننے کے لیے ▶ سنیں دبائیں۔" },
  builder:{ en:"The words of a short ayah are shuffled. Tap them in the right order, from the first word to the last. Small text under each word gives its meaning.", ur:"ایک چھوٹی آیت کے الفاظ بکھرے ہوئے ہیں۔ انہیں پہلے لفظ سے آخری تک صحیح ترتیب میں دبائیں۔ ہر لفظ کے نیچے اس کا معنی لکھا ہے۔" },
  roothunt:{ en:"A root (three letters) is shown. Tap every word that comes from that root, then tap Check. Words from the root share the same letters in the same order.", ur:"ایک مادہ (تین حروف) دکھایا جاتا ہے۔ اس مادے سے بننے والے ہر لفظ کو دبائیں، پھر \"چیک کریں\"۔ ایک مادے کے الفاظ میں وہی حروف اسی ترتیب سے ہوتے ہیں۔" },
  speed:{ en:"60 seconds. Pick the meaning of each Arabic word — as many as you can before time runs out.", ur:"۶۰ سیکنڈ۔ ہر عربی لفظ کا معنی چنیں — وقت ختم ہونے سے پہلے جتنے زیادہ ہو سکیں۔" },
  fix:{ en:"An ayah is shown with the last vowel of one word missing. Pick the form with the correct ending (ُ  َ  ِ). The ending shows the word's role: subject, object, or after a preposition.", ur:"آیت میں ایک لفظ کی آخری حرکت غائب ہے۔ صحیح اعراب (ُ  َ  ِ) والی شکل چنیں۔ آخری حرکت لفظ کا کردار بتاتی ہے: فاعل، مفعول، یا حرفِ جر کے بعد۔" },
  pass:{ en:"2 to 4 players on one phone. Choose the number of players. Each player answers one question, then passes the phone to the next. Highest score wins.", ur:"ایک فون پر ۲ سے ۴ کھلاڑی۔ کھلاڑیوں کی تعداد چنیں۔ ہر کھلاڑی ایک سوال کا جواب دے کر فون اگلے کو دیتا ہے۔ سب سے زیادہ اسکور والا جیتتا ہے۔" },
  week:{ en:"Ten questions, the same for everyone this week. Play as often as you like — your best score is kept. Share your score card and challenge family and friends.", ur:"دس سوال، اس ہفتے سب کے لیے ایک جیسے۔ جتنی بار چاہیں کھیلیں — بہترین اسکور محفوظ رہتا ہے۔ اسکور کارڈ شیئر کر کے گھر والوں اور دوستوں کو چیلنج کریں۔" }
};
function gameIntro(k){
  const nameKey = (GAME_LIST.find(g => g[0] === k) || [k, k])[1], h = GAME_HELP[k];
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg><span class="cap">${T("back")}</span></button><b>${T(nameKey)}</b></div>
    <div class="lc intro"><h2>${T("howPlay")}</h2><p>${esc(settings.lang === "en" ? h.en : h.ur)}</p><button class="btn wide" data-start="${k}">${T("start")}</button></div>`;
}
$("#learn").addEventListener("click", e => {
  const st = e.target.closest("[data-start]"); if (st) { const k = st.dataset.start; LS.intro = LS.intro || {}; LS.intro[k] = 1; saveL(); G = null; GAMES[k](); return; }
  const it = e.target.closest("[data-intro]"); if (it) gameIntro(it.dataset.intro);
});
/* "How it works" sheet for the current screen; shown automatically on the first visit to each screen */
function openHelp(v){
  v = v || LV.view; const H = VIEW_HELP[v] || VIEW_HELP.read, x = settings.lang === "en" ? H.en : H.ur;
  delete $("#sheetBody").dataset.ayah;
  $("#sheetBody").innerHTML = `<div class="help"><small>${T("helpT")}</small><h2>${esc(x[0])}</h2><ol>${x[1].map(l => `<li>${esc(l)}</li>`).join("")}</ol><button class="btn wide" data-help="ok">${T("gotIt")}</button></div>`;
  openSheet();
}
$("#sheetBody").addEventListener("click", e => { if (e.target.closest("[data-help]")) closeAll(); });
$("#btnHelp").onclick = () => openHelp();
const _showView = showView;
showView = function(v){
  _showView(v);
  const seen = store.get("helpSeen", {});
  if (VIEW_HELP[v] && !seen[v]) { seen[v] = 1; store.set("helpSeen", seen); setTimeout(() => openHelp(v), 400); }
};
function firstReadHelp(){ const seen = store.get("helpSeen", {}); if (!seen.read) { seen.read = 1; store.set("helpSeen", seen); setTimeout(() => openHelp("read"), 900); } }
