"use strict";
/* ---------- Azkar: morning, evening, sleep, waking, after salah, daily — word by word, counters, reminders ----------
   Quranic azkar take their word meanings from the app's word-by-word data. Hadith azkar: Arabic from the sources named;
   word meanings and translations written for this app — draft, pending scholar review. */
Object.assign(L.ur, { azT:"اذکار", azSub:"صبح، شام، سونے سے پہلے اور مزید", azCats:{ m:"صبح", e:"شام", s:"سونے سے پہلے", w:"جاگنے پر", p:"نماز کے بعد", d:"روزانہ" },
  azWbw:"لفظ بہ لفظ", azFull:"مکمل ترجمہ", azTimes:n=>`${ud(n)} بار`, azDone:"مکمل ✓", azTap:"گنتی", azRead:"قرآن میں پڑھیں", azProg:(a,b)=>`${ud(a)} / ${ud(b)} مکمل`, azDraft:"حدیث کے اذکار کے لفظی معانی اور ترجمے اس ایپ کے لیے لکھے گئے ہیں — عالم کی نظرِ ثانی باقی ہے۔", azRemind:"یاد دہانی مقرر کریں" });
Object.assign(L.en, { azT:"Azkar", azSub:"Morning, evening, before sleep and more", azCats:{ m:"Morning", e:"Evening", s:"Before sleep", w:"On waking", p:"After salah", d:"Daily" },
  azWbw:"Word by word", azFull:"Full translation", azTimes:n=>`${n} times`, azDone:"Done ✓", azTap:"Count", azRead:"Read in the Quran", azProg:(a,b)=>`${a} / ${b} done`, azDraft:"Word meanings and translations of the hadith azkar were written for this app — scholar review pending.", azRemind:"Set reminders" });
/* compact word lists: "arabic|urdu|english" separated by ";" */
const AZW = s => s.split(";").map(x => x.trim().split("|"));
const AZ_WORDS = {
  asbahna: AZW(`أَصْبَحْنَا|ہم نے صبح کی|We have reached the morning;وَأَصْبَحَ|اور صبح کی|and has reached the morning;الْمُلْكُ|بادشاہی نے|the dominion;لِلَّهِ|اللہ کے لیے|for Allah;وَالْحَمْدُ|اور تمام تعریف|and all praise;لِلَّهِ|اللہ کے لیے ہے|is for Allah;لَا|نہیں|there is no;إِلَٰهَ|کوئی معبود|god;إِلَّا|سوائے|except;اللَّهُ|اللہ کے|Allah;وَحْدَهُ|وہ اکیلا ہے|alone;لَا|نہیں|there is no;شَرِيكَ|کوئی شریک|partner;لَهُ|اس کا|for Him;لَهُ|اسی کی ہے|His is;الْمُلْكُ|بادشاہی|the dominion;وَلَهُ|اور اسی کے لیے|and His is;الْحَمْدُ|تعریف ہے|the praise;وَهُوَ|اور وہ|and He;عَلَىٰ|پر|over;كُلِّ|ہر|every;شَيْءٍ|چیز|thing;قَدِيرٌ|قادر ہے|is All-Powerful;رَبِّ|اے میرے رب|My Lord;أَسْأَلُكَ|میں تجھ سے مانگتا ہوں|I ask You for;خَيْرَ|بھلائی|the good;مَا|جو|of what;فِي|میں ہے|is in;هَٰذَا|اس|this;الْيَوْمِ|دن|day;وَخَيْرَ|اور بھلائی|and the good;مَا|جو|of what;بَعْدَهُ|اس کے بعد ہے|comes after it;وَأَعُوذُ|اور میں پناہ مانگتا ہوں|and I seek refuge;بِكَ|تیری|in You;مِنْ|سے|from;شَرِّ|برائی|the evil;مَا|جو|of what;فِي|میں ہے|is in;هَٰذَا|اس|this;الْيَوْمِ|دن|day;وَشَرِّ|اور برائی|and the evil;مَا|جو|of what;بَعْدَهُ|اس کے بعد ہے|comes after it;رَبِّ|اے میرے رب|My Lord;أَعُوذُ|میں پناہ مانگتا ہوں|I seek refuge;بِكَ|تیری|in You;مِنَ|سے|from;الْكَسَلِ|سستی|laziness;وَسُوءِ|اور برائی|and the misery;الْكِبَرِ|بڑھاپے کی|of old age;رَبِّ|اے میرے رب|My Lord;أَعُوذُ|میں پناہ مانگتا ہوں|I seek refuge;بِكَ|تیری|in You;مِنْ|سے|from;عَذَابٍ|عذاب|a punishment;فِي|میں|in;النَّارِ|آگ|the Fire;وَعَذَابٍ|اور عذاب|and a punishment;فِي|میں|in;الْقَبْرِ|قبر|the grave`),
  bika_m: AZW(`اللَّهُمَّ|اے اللہ|O Allah;بِكَ|تیرے ہی (حکم) سے|by You;أَصْبَحْنَا|ہم نے صبح کی|we reach the morning;وَبِكَ|اور تیرے ہی سے|and by You;أَمْسَيْنَا|ہم نے شام کی|we reach the evening;وَبِكَ|اور تیرے ہی سے|and by You;نَحْيَا|ہم جیتے ہیں|we live;وَبِكَ|اور تیرے ہی سے|and by You;نَمُوتُ|ہم مرتے ہیں|we die;وَإِلَيْكَ|اور تیری ہی طرف|and to You;النُّشُورُ|اٹھ کر جانا ہے|is the resurrection`),
  bika_e: AZW(`اللَّهُمَّ|اے اللہ|O Allah;بِكَ|تیرے ہی (حکم) سے|by You;أَمْسَيْنَا|ہم نے شام کی|we reach the evening;وَبِكَ|اور تیرے ہی سے|and by You;أَصْبَحْنَا|ہم نے صبح کی|we reach the morning;وَبِكَ|اور تیرے ہی سے|and by You;نَحْيَا|ہم جیتے ہیں|we live;وَبِكَ|اور تیرے ہی سے|and by You;نَمُوتُ|ہم مرتے ہیں|we die;وَإِلَيْكَ|اور تیری ہی طرف|and to You;الْمَصِيرُ|لوٹنا ہے|is the final return`),
  sayyid: AZW(`اللَّهُمَّ|اے اللہ|O Allah;أَنْتَ|تو|You are;رَبِّي|میرا رب ہے|my Lord;لَا|نہیں|there is no;إِلَٰهَ|کوئی معبود|god;إِلَّا|سوائے|except;أَنْتَ|تیرے|You;خَلَقْتَنِي|تو نے مجھے پیدا کیا|You created me;وَأَنَا|اور میں|and I am;عَبْدُكَ|تیرا بندہ ہوں|Your servant;وَأَنَا|اور میں|and I am;عَلَىٰ|پر قائم ہوں|upon;عَهْدِكَ|تیرے عہد|Your covenant;وَوَعْدِكَ|اور تیرے وعدے|and Your promise;مَا|جتنا|as far as;اسْتَطَعْتُ|مجھ سے ہو سکا|I am able;أَعُوذُ|میں پناہ مانگتا ہوں|I seek refuge;بِكَ|تیری|in You;مِنْ|سے|from;شَرِّ|برائی|the evil;مَا|جو|of what;صَنَعْتُ|میں نے کیا|I have done;أَبُوءُ|میں اقرار کرتا ہوں|I acknowledge;لَكَ|تیرے سامنے|before You;بِنِعْمَتِكَ|تیری نعمت کا|Your favour;عَلَيَّ|جو مجھ پر ہے|upon me;وَأَبُوءُ|اور میں اقرار کرتا ہوں|and I acknowledge;بِذَنْبِي|اپنے گناہ کا|my sin;فَاغْفِرْ|پس بخش دے|so forgive;لِي|مجھے|me;فَإِنَّهُ|کیونکہ یقیناً|for indeed;لَا|نہیں|none;يَغْفِرُ|بخشتا|forgives;الذُّنُوبَ|گناہوں کو|sins;إِلَّا|سوائے|except;أَنْتَ|تیرے|You`),
  bism: AZW(`بِسْمِ|نام سے|In the name;اللَّهِ|اللہ کے|of Allah;الَّذِي|وہ جس کے|with whose name;لَا|نہیں|nothing;يَضُرُّ|نقصان دے سکتی|can harm;مَعَ|ساتھ|along with;اسْمِهِ|اس کے نام کے|His name;شَيْءٌ|کوئی چیز|anything;فِي|میں|in;الْأَرْضِ|زمین|the earth;وَلَا|اور نہ|nor;فِي|میں|in;السَّمَاءِ|آسمان|the heaven;وَهُوَ|اور وہ|and He is;السَّمِيعُ|سب کچھ سننے والا|the All-Hearing;الْعَلِيمُ|سب کچھ جاننے والا ہے|the All-Knowing`),
  radi: AZW(`رَضِيتُ|میں راضی ہوں|I am pleased;بِاللَّهِ|اللہ کے|with Allah;رَبًّا|رب ہونے پر|as my Lord;وَبِالْإِسْلَامِ|اور اسلام کے|and with Islam;دِينًا|دین ہونے پر|as my religion;وَبِمُحَمَّدٍ|اور محمد کے|and with Muhammad;صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ|ﷺ|ﷺ;نَبِيًّا|نبی ہونے پر|as my Prophet`),
  subhan: AZW(`سُبْحَانَ|پاک ہے|Glory be to;اللَّهِ|اللہ|Allah;وَبِحَمْدِهِ|اپنی تعریف کے ساتھ|and praise be to Him`),
  kalimat: AZW(`أَعُوذُ|میں پناہ مانگتا ہوں|I seek refuge;بِكَلِمَاتِ|کلمات کی|in the words;اللَّهِ|اللہ کے|of Allah;التَّامَّاتِ|کامل|that are perfect;مِنْ|سے|from;شَرِّ|برائی|the evil;مَا|جو|of what;خَلَقَ|اس نے پیدا کیا|He has created`),
  tahlil: AZW(`لَا|نہیں|there is no;إِلَٰهَ|کوئی معبود|god;إِلَّا|سوائے|except;اللَّهُ|اللہ کے|Allah;وَحْدَهُ|وہ اکیلا ہے|alone;لَا|نہیں|there is no;شَرِيكَ|کوئی شریک|partner;لَهُ|اس کا|for Him;لَهُ|اسی کی ہے|His is;الْمُلْكُ|بادشاہی|the dominion;وَلَهُ|اور اسی کے لیے|and His is;الْحَمْدُ|تعریف ہے|the praise;وَهُوَ|اور وہ|and He;عَلَىٰ|پر|over;كُلِّ|ہر|every;شَيْءٍ|چیز|thing;قَدِيرٌ|قادر ہے|is All-Powerful`),
  istighfar100: AZW(`أَسْتَغْفِرُ|میں بخشش مانگتا ہوں|I seek forgiveness of;اللَّهَ|اللہ سے|Allah;وَأَتُوبُ|اور میں توبہ کرتا ہوں|and I repent;إِلَيْهِ|اس کی طرف|to Him`),
  bismika: AZW(`بِاسْمِكَ|تیرے نام کے ساتھ|In Your name;اللَّهُمَّ|اے اللہ|O Allah;أَمُوتُ|میں مرتا (سوتا) ہوں|I die;وَأَحْيَا|اور جیتا (جاگتا) ہوں|and I live`),
  qini: AZW(`اللَّهُمَّ|اے اللہ|O Allah;قِنِي|مجھے بچا|protect me from;عَذَابَكَ|اپنے عذاب سے|Your punishment;يَوْمَ|جس دن|on the day;تَبْعَثُ|تو اٹھائے گا|You raise up;عِبَادَكَ|اپنے بندوں کو|Your servants`),
  sub33: AZW(`سُبْحَانَ|پاک ہے|Glory be to;اللَّهِ|اللہ|Allah`), ham33: AZW(`الْحَمْدُ|تمام تعریف|All praise;لِلَّهِ|اللہ کے لیے ہے|is for Allah`), akb34: AZW(`اللَّهُ|اللہ|Allah;أَكْبَرُ|سب سے بڑا ہے|is the Greatest`),
  wake: AZW(`الْحَمْدُ|تمام تعریف|All praise;لِلَّهِ|اللہ کے لیے ہے|is for Allah;الَّذِي|جس نے|who;أَحْيَانَا|ہمیں زندگی دی|gave us life;بَعْدَ|بعد|after;مَا|اس کے کہ|-;أَمَاتَنَا|اس نے ہمیں موت دی|He had caused us to die;وَإِلَيْهِ|اور اسی کی طرف|and to Him;النُّشُورُ|اٹھ کر جانا ہے|is the resurrection`),
  astaghfir: AZW(`أَسْتَغْفِرُ|میں بخشش مانگتا ہوں|I seek forgiveness of;اللَّهَ|اللہ سے|Allah`),
  salam: AZW(`اللَّهُمَّ|اے اللہ|O Allah;أَنْتَ|تو|You are;السَّلَامُ|سلامتی والا ہے|Peace (As-Salam);وَمِنْكَ|اور تجھ ہی سے|and from You;السَّلَامُ|سلامتی ہے|is peace;تَبَارَكْتَ|تو بابرکت ہے|blessed are You;يَا|اے|O;ذَا|والے|Possessor of;الْجَلَالِ|جلال|majesty;وَالْإِكْرَامِ|اور عزت|and honour`)
};
/* evening form of "asbahna": same hadith (Sahih Muslim 2723) with evening words */
AZ_WORDS.amsayna = AZ_WORDS.asbahna.map(([a, u, e]) => a === "أَصْبَحْنَا" ? ["أَمْسَيْنَا", "ہم نے شام کی", "We have reached the evening"] : a === "وَأَصْبَحَ" ? ["وَأَمْسَى", "اور شام کی", "and has reached the evening"]
  : a === "هَٰذَا" ? ["هَٰذِهِ", "اس", "this"] : a === "الْيَوْمِ" ? ["اللَّيْلَةِ", "رات", "night"] : a === "بَعْدَهُ" ? ["بَعْدَهَا", "اس کے بعد ہے", "comes after it"] : [a, u, e]);
/* items: [id, categories, words key | quran [s,a1,a2], times, source, full Urdu, full English] */
const AZ = [
  ["kursi", "mesp", [2, 255, 255], 1, "Morning/evening: al-Nasa'i (al-Kubra) 9928; before sleep: Sahih al-Bukhari 2311", "", ""],
  ["quls", "mes", [112, 1, 4], 3, "Abu Dawud 5082; Jami' at-Tirmidhi 3575 — recite Al-Ikhlas, Al-Falaq and An-Nas three times; at bedtime blow into the hands and wipe the body (Sahih al-Bukhari 5017)", "", ""],
  ["falaq", "mes", [113, 1, 5], 3, "", "", ""], ["nas", "mes", [114, 1, 6], 3, "", "", ""],
  ["asbahna", "m", "asbahna", 1, "Sahih Muslim 2723", "ہم نے صبح کی اور اللہ کی بادشاہی نے صبح کی، اور سب تعریف اللہ کے لیے ہے۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف ہے اور وہ ہر چیز پر قادر ہے۔ اے میرے رب! میں تجھ سے اس دن کی بھلائی اور اس کے بعد کی بھلائی مانگتا ہوں، اور اس دن کی برائی اور اس کے بعد کی برائی سے تیری پناہ مانگتا ہوں۔ اے میرے رب! میں سستی اور بڑھاپے کی برائی سے تیری پناہ مانگتا ہوں۔ اے میرے رب! میں آگ کے عذاب اور قبر کے عذاب سے تیری پناہ مانگتا ہوں۔", "We have reached the morning and the dominion belongs to Allah, and all praise is for Allah. There is no god but Allah alone, without partner; His is the dominion and His is the praise, and He is over all things powerful. My Lord, I ask You for the good of this day and the good of what follows it, and I seek refuge in You from the evil of this day and the evil of what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave."],
  ["amsayna", "e", "amsayna", 1, "Sahih Muslim 2723", "ہم نے شام کی اور اللہ کی بادشاہی نے شام کی، اور سب تعریف اللہ کے لیے ہے… اے میرے رب! میں تجھ سے اس رات کی بھلائی اور اس کے بعد کی بھلائی مانگتا ہوں، اور اس رات کی برائی اور اس کے بعد کی برائی سے تیری پناہ مانگتا ہوں…", "We have reached the evening and the dominion belongs to Allah… My Lord, I ask You for the good of this night and the good of what follows it, and I seek refuge in You from the evil of this night and the evil of what follows it…"],
  ["bika_m", "m", "bika_m", 1, "Jami' at-Tirmidhi 3391; Abu Dawud 5068", "اے اللہ! تیرے ہی حکم سے ہم نے صبح کی اور تیرے ہی حکم سے شام کی، تیرے ہی حکم سے ہم جیتے ہیں اور تیرے ہی حکم سے مرتے ہیں، اور تیری ہی طرف اٹھ کر جانا ہے۔", "O Allah, by You we reach the morning and by You we reach the evening, by You we live and by You we die, and to You is the resurrection."],
  ["bika_e", "e", "bika_e", 1, "Jami' at-Tirmidhi 3391; Abu Dawud 5068", "اے اللہ! تیرے ہی حکم سے ہم نے شام کی اور تیرے ہی حکم سے صبح کی، تیرے ہی حکم سے ہم جیتے ہیں اور تیرے ہی حکم سے مرتے ہیں، اور تیری ہی طرف لوٹنا ہے۔", "O Allah, by You we reach the evening and by You we reach the morning, by You we live and by You we die, and to You is the final return."],
  ["sayyid", "me", "sayyid", 1, "Sahih al-Bukhari 6306 — whoever says it with certainty in the day and dies before evening, or at night and dies before morning, is of the people of Paradise", "اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں جتنا ہو سکے تیرے عہد اور وعدے پر قائم ہوں۔ میں نے جو کیا اس کی برائی سے تیری پناہ مانگتا ہوں، تیری نعمتوں کا جو مجھ پر ہیں اقرار کرتا ہوں اور اپنے گناہ کا اقرار کرتا ہوں، پس مجھے بخش دے کیونکہ تیرے سوا کوئی گناہوں کو نہیں بخشتا۔", "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I keep Your covenant and promise as far as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You."],
  ["bism", "me", "bism", 3, "Abu Dawud 5088; Jami' at-Tirmidhi 3388", "اللہ کے نام سے جس کے نام کے ساتھ زمین و آسمان میں کوئی چیز نقصان نہیں دے سکتی، اور وہ سب کچھ سننے والا، سب کچھ جاننے والا ہے۔", "In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing."],
  ["radi", "me", "radi", 3, "Abu Dawud 5072; Jami' at-Tirmidhi 3389", "میں اللہ کے رب ہونے پر، اسلام کے دین ہونے پر اور محمد ﷺ کے نبی ہونے پر راضی ہوں۔", "I am pleased with Allah as my Lord, Islam as my religion and Muhammad ﷺ as my Prophet."],
  ["kalimat", "e", "kalimat", 3, "Sahih Muslim 2709", "میں اللہ کے کامل کلمات کے ذریعے اس کی مخلوق کی برائی سے پناہ مانگتا ہوں۔", "I seek refuge in the perfect words of Allah from the evil of what He has created."],
  ["subhan", "med", "subhan", 100, "Sahih Muslim 2692; Sahih al-Bukhari 6405", "اللہ پاک ہے اپنی تعریف کے ساتھ۔", "Glory be to Allah, and praise be to Him."],
  ["tahlil", "d", "tahlil", 100, "Sahih al-Bukhari 6403; Sahih Muslim 2691", "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف ہے اور وہ ہر چیز پر قادر ہے۔", "There is no god but Allah alone, without partner; His is the dominion and His is the praise, and He is over all things powerful."],
  ["istighfar100", "d", "istighfar100", 100, "Sahih al-Bukhari 6307; Sahih Muslim 2702", "میں اللہ سے بخشش مانگتا ہوں اور اس کی طرف توبہ کرتا ہوں۔", "I seek Allah's forgiveness and repent to Him."],
  ["baqarah", "s", [2, 285, 286], 1, "Sahih al-Bukhari 5009 — the last two ayahs of Al-Baqarah at night suffice", "", ""],
  ["mulk", "s", [67, 1, 30], 1, "Jami' at-Tirmidhi 2892 — the Prophet ﷺ would not sleep until he recited Al-Mulk (and As-Sajdah)", "", ""],
  ["bismika", "s", "bismika", 1, "Sahih al-Bukhari 6324", "اے اللہ! تیرے نام کے ساتھ میں مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔", "In Your name, O Allah, I die and I live."],
  ["qini", "s", "qini", 3, "Abu Dawud 5045; Jami' at-Tirmidhi 3398", "اے اللہ! مجھے اس دن اپنے عذاب سے بچا جس دن تو اپنے بندوں کو اٹھائے گا۔", "O Allah, protect me from Your punishment on the day You raise up Your servants."],
  ["sub33", "sp", "sub33", 33, "Before sleep: Sahih al-Bukhari 3705; after salah: Sahih Muslim 597", "اللہ پاک ہے۔", "Glory be to Allah."],
  ["ham33", "sp", "ham33", 33, "", "تمام تعریف اللہ کے لیے ہے۔", "All praise is for Allah."],
  ["akb34", "sp", "akb34", 34, "After salah: 33 times, then complete 100 with the tahlil (Sahih Muslim 597)", "اللہ سب سے بڑا ہے۔", "Allah is the Greatest."],
  ["wake", "w", "wake", 1, "Sahih al-Bukhari 6312", "تمام تعریف اللہ کے لیے ہے جس نے ہمیں موت (نیند) کے بعد زندگی دی اور اسی کی طرف اٹھ کر جانا ہے۔", "All praise is for Allah who gave us life after He had caused us to die, and to Him is the resurrection."],
  ["astaghfir", "p", "astaghfir", 3, "Sahih Muslim 591", "میں اللہ سے بخشش مانگتا ہوں۔", "I seek Allah's forgiveness."],
  ["salam", "p", "salam", 1, "Sahih Muslim 591", "اے اللہ! تو سلامتی والا ہے اور تجھ ہی سے سلامتی ہے، تو بابرکت ہے اے جلال اور عزت والے۔", "O Allah, You are Peace and from You is peace. Blessed are You, Possessor of majesty and honour."]
];
const AZS = Object.assign({ cat: null, trl: "ur", view: "wbw", cnt: {}, day: "" }, store.get("azkar", {}));
const saveAZ = () => store.set("azkar", AZS);
function azCatNow(){ const h = new Date().getHours(); return h >= 4 && h < 12 ? "m" : h >= 15 && h < 21 ? "e" : h >= 21 || h < 4 ? "s" : "m"; }
async function azWords(it){
  if (typeof it[2] === "string") return AZ_WORDS[it[2]];
  const [s, a1, a2] = it[2], d = await DATA.surah(s), out = [];
  for (let a = a1; a <= a2; a++) d.ayahs[a - 1].w.forEach((w, i, arr) => out.push([w[0], w[3] || w[1], w[1], i === arr.length - 1 ? a : 0]));
  return out;
}
async function renderAzkar(){
  if (AZS.day !== dayKey()) { AZS.day = dayKey(); AZS.cnt = {}; saveAZ(); }
  const cat = AZS.cat || azCatNow(), en = AZS.trl === "en", items = AZ.filter(x => x[1].includes(cat));
  const done = items.filter(x => (AZS.cnt[cat + x[0]] || 0) >= x[3]).length;
  const cards = await Promise.all(items.map(async it => {
    const [id, , src, n, ref, fur, fen] = it, k = cat + id, c = AZS.cnt[k] || 0, ws = await azWords(it), isQ = typeof src !== "string";
    const wb = AZS.view === "wbw"
      ? `<div class="az-wbw" dir="rtl">${ws.map(w => `<span class="az-w"><b>${esc(w[0])}</b><small${en ? ' dir="ltr"' : ""}>${esc(en ? w[2] : w[1])}</small></span>${w[3] ? `<span class="end az-end">${ud(w[3])}</span>` : ""}`).join("")}</div>`
      : `<p class="az-ar" dir="rtl">${esc(ws.map(w => w[0]).join(" "))}</p>`;
    let full = en ? fen : fur;
    if (isQ && AZS.view !== "wbw") { const d = await DATA.surah(src[0]); full = d.ayahs.slice(src[1] - 1, src[2]).map(A => en ? (A.en2 || A.en) : A.ur).join(" "); }
    return `<article class="az-card${c >= n ? " done" : ""}">
      ${isQ ? `<div class="az-h">${esc(surahName(src[0]))} ${nf(src[0])}:${nf(src[1])}${src[2] !== src[1] ? "–" + nf(src[2]) : ""}</div>` : ""}${wb}
      ${AZS.view !== "wbw" && full ? `<p class="az-tr${en ? "" : " ur"}">${esc(full)}</p>` : ""}
      <div class="az-foot"><button class="az-cnt" data-azc="${k}" data-n="${n}"><b>${nf(Math.min(c, n))}</b>/${nf(n)}</button>
        ${isQ ? `<button class="btn ghost" data-azq="${src[0]}:${src[1]}">${T("azRead")}</button>` : ""}<small class="az-src">${esc(ref)}</small></div></article>`;
  }));
  $("#azkar").innerHTML = `<div class="az-cats" role="tablist">${Object.entries(T("azCats")).map(([k, l]) => `<button role="tab" data-azcat="${k}" aria-selected="${k === cat}">${l}</button>`).join("")}</div>
    <div class="dtrl"><span>${T("azProg", nf(done), nf(items.length))}</span><div class="rtb-seg"><button data-azv="wbw" aria-pressed="${AZS.view === "wbw"}">${T("azWbw")}</button><button data-azv="full" aria-pressed="${AZS.view !== "wbw"}">${T("azFull")}</button></div></div>
    <div class="dtrl"><span></span><div class="rtb-seg"><button data-aztr="ur" aria-pressed="${!en}">اردو</button><button data-aztr="en" aria-pressed="${en}">English</button></div></div>
    ${cards.join("")}<button class="btn ghost wide" data-open="reminders" style="margin:8px 0">⏰ ${T("azRemind")}</button><p class="draft">${T("azDraft")}</p>`;
}
VIEWS.azkar = { el: "#azkar", title: () => [T("azT"), T("azSub")], render: renderAzkar };
$("#azkar").addEventListener("click", e => {
  const c = e.target.closest("[data-azcat]"); if (c) { AZS.cat = c.dataset.azcat; saveAZ(); renderAzkar(); return; }
  const v = e.target.closest("[data-azv]"); if (v) { AZS.view = v.dataset.azv; saveAZ(); renderAzkar(); return; }
  const t = e.target.closest("[data-aztr]"); if (t) { AZS.trl = t.dataset.aztr; saveAZ(); renderAzkar(); return; }
  const q = e.target.closest("[data-azq]"); if (q) { const [s, a] = q.dataset.azq.split(":").map(Number); showView("read"); openSurah(s, a); return; }
  const b = e.target.closest("[data-azc]"); if (b) { const k = b.dataset.azc, n = +b.dataset.n; AZS.cnt[k] = Math.min(n, (AZS.cnt[k] || 0) + 1); saveAZ();
    b.querySelector("b").textContent = nf(AZS.cnt[k]); if (navigator.vibrate) navigator.vibrate(AZS.cnt[k] === n ? [70, 50, 70] : 12);
    if (AZS.cnt[k] === n) { b.closest(".az-card").classList.add("done"); toast("✓"); } }
});
/* Duas tab keeps situation duas only; time-based azkar now live here */
if (typeof MASNOON !== "undefined") { const moved = new Set(["salah1", "salah2", "tasbih", "istighfar", "protect", "subhan", "tahlil", "wake", "sleep"]); for (let i = MASNOON.length - 1; i >= 0; i--) if (moved.has(MASNOON[i][0])) MASNOON.splice(i, 1); }
/* ---------- Reminders page: prayer alarms + azkar + daily reading, one calendar file ---------- */
Object.assign(L.ur, { rmT:"یاد دہانیاں", rmSub:"نماز، اذکار اور روزانہ تلاوت", rmPrayer:"نماز کے الارم", rmPrayerSub:"ہر نماز کے الارم الگ الگ منتخب کریں", rmAz:"اذکار", rmRead:"روزانہ تلاوت", rmAdd:"سب کو فون کے کیلنڈر میں شامل کریں", rmAddSub:"روزانہ دہرائے جانے والے الارم — ایپ بند ہو تب بھی", rmOpenPr:"نماز کے اوقات کھولیں" });
Object.assign(L.en, { rmT:"Reminders", rmSub:"Prayer, azkar and daily reading", rmPrayer:"Prayer alarms", rmPrayerSub:"Choose alarms for each prayer", rmAz:"Azkar", rmRead:"Daily Quran reading", rmAdd:"Add all to my phone's calendar", rmAddSub:"Daily repeating alarms — even when the app is closed", rmOpenPr:"Open prayer times" });
const RM = Object.assign({ m: ["06:30", 1], e: ["17:00", 1], s: ["22:30", 1], read: ["21:00", 1] }, store.get("reminders", {}));
const saveRM = () => store.set("reminders", RM);
function renderReminders(){
  const row = (k, label) => `<li><span><b>${label}</b></span><input type="time" value="${RM[k][0]}" data-rmt="${k}"><label class="ds-sw"><input type="checkbox" role="switch" data-rmo="${k}"${RM[k][1] ? " checked" : ""}><i aria-hidden="true"></i></label></li>`;
  $("#remv").innerHTML = `<section class="ps"><h4>${T("rmPrayer")}</h4><p class="ds-note">${T("rmPrayerSub")}</p><button class="btn ghost wide" data-open="prayer">${T("rmOpenPr")}</button></section>
    <section class="ps"><h4>${T("rmAz")}</h4><ul class="pa rm">${row("m", T("azCats").m)}${row("e", T("azCats").e)}${row("s", T("azCats").s)}</ul></section>
    <section class="ps"><h4>${T("rmRead")}</h4><ul class="pa rm">${row("read", T("rmRead"))}</ul></section>
    <button class="ds ds-card" data-rmics="1"><span class="ds-mic">📅</span><span><b>${T("rmAdd")}</b><small>${T("rmAddSub")}</small></span></button>`;
}
VIEWS.reminders = { el: "#remv", title: () => [T("rmT"), T("rmSub")], render: renderReminders };
$("#remv").addEventListener("change", e => {
  const t = e.target.closest("[data-rmt]"); if (t) { RM[t.dataset.rmt][0] = t.value; saveRM(); }
  const o = e.target.closest("[data-rmo]"); if (o) { RM[o.dataset.rmo][1] = o.checked ? 1 : 0; saveRM(); }
});
$("#remv").addEventListener("click", e => { if (!e.target.closest("[data-rmics]")) return;
  const pad = n => String(n).padStart(2, "0"), d = new Date(), day = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const L2 = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//QuranToSoul//Reminders//EN"], names = { m: "Morning azkar · صبح کے اذکار", e: "Evening azkar · شام کے اذکار", s: "Bedtime azkar · سونے کے اذکار", read: "Quran reading · تلاوت" };
  Object.keys(names).forEach(k => { if (!RM[k][1]) return; const [h, m] = RM[k][0].split(":");
    L2.push("BEGIN:VEVENT", `UID:qts-rem-${k}@qurantosoul.com`, `DTSTAMP:${day}T000000Z`, `DTSTART:${day}T${h}${m}00`, "DURATION:PT10M", "RRULE:FREQ=DAILY", `SUMMARY:${names[k]}`, "DESCRIPTION:QuranToSoul — https://qurantosoul.com",
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${names[k]}`, "TRIGGER:PT0M", "END:VALARM", "END:VEVENT"); });
  L2.push("END:VCALENDAR");
  const blob = new Blob([L2.join("\r\n")], { type: "text/calendar" }), u = URL.createObjectURL(blob), a = document.createElement("a"); a.href = u; a.download = "qurantosoul-reminders.ics"; a.click(); setTimeout(() => URL.revokeObjectURL(u), 5000);
  setTimeout(() => prayerICS(), 600);   // prayer alarms (30 days) as a second file
});
/* in-app reminder while the app is open */
setInterval(() => { const now = new Date(), hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  ["m", "e", "s", "read"].forEach(k => { if (RM[k][1] && RM[k][0] === hhmm && RM["_" + k] !== dayKey()) { RM["_" + k] = dayKey(); saveRM(); toast(esc(k === "read" ? T("rmRead") : T("azT") + " · " + T("azCats")[k]), 6000); } }); }, 30000);
