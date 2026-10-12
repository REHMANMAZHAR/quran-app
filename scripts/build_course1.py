"""Build data/learn/course1.json — Quranic Arabic course, Level 1 "Understand without grammar" (Urdu first).
Our own lesson plan and explanations (draft, pending scholar review). Quranic words are taken from the app's own
word-by-word data by location, so every word has its Arabic, Urdu/English meaning and recitation audio."""
import json, os, re, unicodedata
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = {n: json.load(open(f"{ROOT}/data/s/{n:03d}.json")) for n in range(1, 115)}
RO = json.load(open(f"{ROOT}/data-raw/ur-roman.json"))
def bare(t):
    t = unicodedata.normalize("NFC", t)
    t = re.sub(r"[ً-ٰٟۖ-ۭـ]", "", t)
    for a, b in [("ٱ", "ا"), ("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ى", "ي"), ("ة", "ه")]: t = t.replace(a, b)
    return t
def roman(t):
    toks = re.findall(r"[^\s/،۔()\-–—,:؛\"'“”؟]+", t)
    if not toks or any(x not in RO for x in toks): return ""
    out = re.sub(r"[^\s/،۔()\-–—,:؛\"'“”؟]+", lambda m: RO[m.group(0)], t)
    return out.replace("،", ",").replace("۔", ".")
def word(s, a, form=None, idx=None, ur=None, en=None):
    W = S[s]["ayahs"][a - 1]["w"]
    if idx is None:
        b = bare(form); idx = next((i for i, w in enumerate(W) if bare(w[0]) == b), None)
        if idx is None: idx = next(i for i, w in enumerate(W) if b in bare(w[0]))
    w = W[idx]; u = ur or w[3] or ""
    return {"ref": f"{s}:{a}:{idx + 1}", "ar": w[0], "ur": u, "en": en or w[1], "ro": roman(u)}
def ayah_words(s, a1, a2):
    return [word(s, a, idx=i) for a in range(a1, a2 + 1) for i in range(len(S[s]["ayahs"][a - 1]["w"]))]
def phrase(s, a, ur, en):
    return {"ref": f"{s}:{a}", "ar": " ".join(w[0] for w in S[s]["ayahs"][a - 1]["w"]), "ur": ur, "en": en, "ro": roman(ur)}
def t(ar, ur, en):
    return {"ar": ar, "ur": ur, "en": en, "ro": roman(ur)}
def lesson(id, ur, en, iur, ien, words, phrases=(), tip_ur="", tip_en=""):
    return {"id": id, "t": {"ur": ur, "en": en}, "i": {"ur": iur, "en": ien}, "tip": {"ur": tip_ur, "en": tip_en}, "w": words, "p": list(phrases)}
L = []
L.append(lesson(1, "سورۃ الفاتحہ (۱): بسم اللہ اور الحمد", "Al-Fatiha (1): Bismillah and Al-Hamd",
  "ہر نماز کی ہر رکعت میں ہم یہ الفاظ پڑھتے ہیں۔ آج ان کا مطلب سیکھیں تاکہ نماز میں دل بھی ساتھ ہو۔",
  "We say these words in every rak'ah of every prayer. Learn what they mean so the heart joins the tongue.",
  ayah_words(1, 1, 2), [phrase(1, 1, "اللہ کے نام سے جو بڑا مہربان، نہایت رحم والا ہے", "In the name of Allah, the Most Gracious, the Most Merciful"),
  phrase(1, 2, "سب تعریف اللہ کے لیے ہے جو تمام جہانوں کا رب ہے", "All praise is for Allah, Lord of all the worlds")],
  "رَبّ صرف 'مالک' نہیں — پالنے، سنبھالنے اور سنوارنے والا۔", "Rabb is not only 'owner' — He raises, sustains and perfects."))
L.append(lesson(2, "سورۃ الفاتحہ (۲): ہم تیری ہی عبادت کرتے ہیں", "Al-Fatiha (2): You alone we worship",
  "یہاں بندہ اللہ سے براہِ راست بات کرتا ہے: 'تُو' — ایَّاكَ۔", "Here the servant speaks to Allah directly: 'You' — iyyāka.",
  ayah_words(1, 3, 5), [phrase(1, 4, "روزِ جزا کا مالک", "Master of the Day of Judgement"), phrase(1, 5, "ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں", "You alone we worship and You alone we ask for help")],
  "نَـ سے شروع ہونے والا فعل = 'ہم' کرتے ہیں: نَعْبُدُ ہم عبادت کرتے ہیں، نَسْتَعِينُ ہم مدد مانگتے ہیں۔", "A verb starting with na- means 'we do': na'budu we worship, nasta'īnu we ask for help."))
L.append(lesson(3, "سورۃ الفاتحہ (۳): سیدھا راستہ", "Al-Fatiha (3): The straight path",
  "سورۃ کا آخری حصہ ایک دعا ہے — ہمیں سیدھے راستے پر چلا۔", "The surah ends with a dua — guide us on the straight path.",
  ayah_words(1, 6, 7), [phrase(1, 6, "ہمیں سیدھا راستہ دکھا", "Guide us to the straight path")],
  "عَلَيْهِمْ = عَلَىٰ (پر) + هِمْ (ان)۔ آخر میں جڑی ـهُمْ / ـهِمْ کا مطلب 'ان' ہے۔", "'alayhim = 'alā (on) + him (them). The ending -hum / -him means 'them'."))
L.append(lesson(4, "ضمیریں: وہ، وہ سب، تُو، تم، ہم، میں", "Pronouns: he, they, you, we, I",
  "یہ چھوٹے الفاظ قرآن میں ہزاروں بار آتے ہیں۔ انہیں پہچان لیں تو آدھی بات سمجھ آ جاتی ہے۔",
  "These little words come thousands of times in the Quran. Recognise them and half the sentence opens up.",
  [word(112, 1, "هُوَ", ur="وہ (ایک مرد / اللہ)", en="he / He"), word(2, 5, "هُمُ", ur="وہ سب", en="they"), word(2, 32, "أَنتَ", ur="تُو", en="you (one)"),
   word(2, 11, "نَحْنُ", ur="ہم", en="we"), word(20, 14, "أَنَا", ur="میں", en="I"), word(2, 22, "أَنتُمْ", ur="اور تم سب", en="and you (all)")],
  [phrase(112, 1, "کہہ دو: وہ اللہ ایک ہے", "Say: He is Allah, the One"), phrase(20, 14, "بیشک میں ہی اللہ ہوں، میرے سوا کوئی معبود نہیں، پس میری عبادت کرو", "Indeed, I am Allah; there is no god but Me, so worship Me")],
  "یاد رکھنے کا طریقہ: هُ = وہ، هُمْ = وہ سب، أَنْتَ = تُو، أَنْتُمْ = تم سب، نَحْنُ = ہم، أَنَا = میں۔", "Memory trick: hu = he, hum = they, anta = you, antum = you all, nahnu = we, ana = I."))
L.append(lesson(5, "ساتھ جڑی ضمیریں: میرا، تمہارا، ہمارا، ان کا", "Joined pronouns: my, your, our, their",
  "یہی ضمیریں لفظ کے آخر میں جڑ کر 'میرا، تیرا، ہمارا' بن جاتی ہیں۔", "The same pronouns join the end of a word to mean 'my, your, our, their'.",
  [word(2, 21, "رَبَّكُمُ", ur="تمہارا رب", en="your Lord"), word(1, 2, "رَبِّ", ur="رب", en="Lord"), word(2, 201, "رَبَّنَا", ur="اے ہمارے رب", en="our Lord"),
   word(20, 25, "رَبِّ", ur="اے میرے رب", en="my Lord"), word(109, 6, "دِينُكُمْ", ur="تمہارا دین", en="your religion"), word(109, 6, "دِينِ", ur="میرا دین", en="my religion"), word(2, 3, "رَزَقْنَٰهُمْ", ur="ہم نے انہیں دیا", en="We provided them")],
  [phrase(109, 6, "تمہارے لیے تمہارا دین اور میرے لیے میرا دین", "For you is your religion, and for me is mine"), phrase(2, 201, "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی", "Our Lord, give us good in this world and good in the Hereafter")],
  "ـي = میرا · ـكَ = تیرا · ـكُمْ = تمہارا · ـنَا = ہمارا · ـهُ = اس کا · ـهُمْ = ان کا", "-ī = my · -ka = your · -kum = your (all) · -nā = our · -hu = his · -hum = their"))
L.append(lesson(6, "سورۃ الاخلاص", "Surah Al-Ikhlas", "چار آیات میں توحید کا مکمل بیان — جو ایک تہائی قرآن کے برابر ہے۔", "Four ayahs that state Tawhid completely — equal to a third of the Quran.",
  ayah_words(112, 1, 4), [phrase(112, 3, "نہ اس نے کسی کو جنا اور نہ وہ جنا گیا", "He neither begets nor is born"), phrase(112, 4, "اور کوئی اس کا ہمسر نہیں", "And there is none comparable to Him")],
  "لَمْ + فعل = ماضی کی نفی: لَمْ يَلِدْ = اس نے نہیں جنا۔", "lam + verb = 'did not': lam yalid = He did not beget."))
L.append(lesson(7, "سورۃ الفلق", "Surah Al-Falaq", "صبح کے رب کی پناہ — ہر شر سے حفاظت کی دعا۔", "Refuge in the Lord of daybreak — protection from every evil.",
  ayah_words(113, 1, 5), [phrase(113, 1, "کہہ دو: میں صبح کے رب کی پناہ مانگتا ہوں", "Say: I seek refuge in the Lord of daybreak")],
  "أَعُوذُ = میں پناہ مانگتا ہوں (أَ = میں)۔", "a'ūdhu = I seek refuge (a- = I)."))
L.append(lesson(8, "سورۃ الناس", "Surah An-Nas", "اللہ کی تین صفات — رب، بادشاہ، معبود — وسوسہ ڈالنے والے کے مقابلے میں۔", "Three names of Allah — Lord, King, God — against the whisperer.",
  ayah_words(114, 1, 6), [phrase(114, 1, "کہہ دو: میں لوگوں کے رب کی پناہ مانگتا ہوں", "Say: I seek refuge in the Lord of mankind")]))
L.append(lesson(9, "سورۃ العصر", "Surah Al-Asr", "کامیابی کے چار اصول: ایمان، نیک عمل، حق کی تلقین، صبر کی تلقین۔", "Four rules of success: faith, good deeds, urging truth, urging patience.",
  ayah_words(103, 1, 3), [phrase(103, 2, "بیشک انسان نقصان میں ہے", "Indeed, mankind is in loss")],
  "ـُوا آخر میں = 'انہوں نے' (جمع): ءَامَنُوا انہوں نے ایمان لایا۔", "-ū at the end = 'they did': āmanū they believed."))
L.append(lesson(10, "سورۃ الکوثر اور الکافرون", "Al-Kawthar and Al-Kafirun", "دو چھوٹی سورتیں جو نماز میں بہت پڑھی جاتی ہیں۔", "Two short surahs often recited in prayer.",
  ayah_words(108, 1, 3) + ayah_words(109, 1, 3), [phrase(108, 1, "بیشک ہم نے تمہیں کوثر عطا کی", "Indeed, We have given you Al-Kawthar")],
  "لَا أَعْبُدُ = میں عبادت نہیں کرتا (لَا = نہیں)۔", "lā a'budu = I do not worship (lā = not)."))
L.append(lesson(11, "نماز کے اذکار", "The words of Salah", "رکوع، سجدہ اور تشہد کے الفاظ — جو ہم دن میں درجنوں بار کہتے ہیں۔", "The words of ruku', sujud and tashahhud — said dozens of times a day.",
  [t("اللّٰهُ أَكْبَرُ", "اللہ سب سے بڑا ہے", "Allah is the Greatest"), t("سُبْحَانَ", "پاک ہے", "glory be to"), t("رَبِّيَ", "میرا رب", "my Lord"), t("الْعَظِيمِ", "عظمت والا", "the Magnificent"),
   t("الْأَعْلَىٰ", "سب سے بلند", "the Most High"), t("سَمِعَ اللّٰهُ", "اللہ نے سن لیا", "Allah has heard"), t("لِمَنْ حَمِدَهُ", "اس کی جس نے اس کی تعریف کی", "the one who praised Him"),
   t("رَبَّنَا وَلَكَ الْحَمْدُ", "اے ہمارے رب، اور تیرے ہی لیے سب تعریف ہے", "Our Lord, and to You is all praise"), t("التَّحِيَّاتُ", "تمام زبانی عبادتیں / آداب", "all greetings"),
   t("الصَّلَوَاتُ", "تمام بدنی عبادتیں / دعائیں", "all prayers"), t("الطَّيِّبَاتُ", "تمام پاکیزہ چیزیں", "all good things"), t("السَّلَامُ عَلَيْكَ", "تم پر سلامتی ہو", "peace be upon you"),
   t("أَشْهَدُ", "میں گواہی دیتا ہوں", "I bear witness"), t("أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ", "کہ اللہ کے سوا کوئی معبود نہیں", "that there is no god but Allah")],
  [], "رکوع میں 'عظیم' اور سجدے میں 'اعلیٰ' — جھکتے وقت عظمت، سب سے نیچے ہوتے وقت بلندی۔", "In ruku' we say 'Magnificent', in sujud 'Most High' — at our lowest we praise His highness."))
L.append(lesson(12, "کام: اس نے کیا، انہوں نے کیا، ہم نے کیا", "Past action: he did, they did, we did",
  "فعل کا آخری حصہ بتاتا ہے کہ کام کس نے کیا۔ قرآن کی مثالیں دیکھیں:", "The end of the verb tells who did it. See the Quranic examples:",
  [word(96, 2, "خَلَقَ", ur="اس نے پیدا کیا", en="He created"), word(103, 3, "ءَامَنُوا", ur="وہ ایمان لائے", en="they believed"), word(1, 7, "أَنْعَمْتَ", ur="تُو نے انعام کیا", en="You favoured"),
   word(97, 1, "أَنزَلْنَٰهُ", ur="ہم نے اسے نازل کیا", en="We sent it down"), word(2, 11, "قَالُوٓا", ur="انہوں نے کہا", en="they said")],
  [phrase(97, 1, "بیشک ہم نے اسے شبِ قدر میں نازل کیا", "Indeed, We sent it down on the Night of Decree")],
  "فَعَلَ = اس نے کیا · فَعَلُوا = انہوں نے کیا · فَعَلْتَ = تُو نے کیا · فَعَلْنَا = ہم نے کیا", "fa'ala he did · fa'alū they did · fa'alta you did · fa'alnā we did"))
L.append(lesson(13, "کام: کرتا ہے، کرتے ہیں، ہم کرتے ہیں", "Present action: does, they do, we do",
  "شروع کا حرف بتاتا ہے کہ کون کرتا ہے: يَـ = وہ، تَـ = تم، نَـ = ہم، أَ = میں۔", "The first letter tells who: ya- he, ta- you, na- we, a- I.",
  [word(2, 77, "يَعْلَمُ", ur="وہ جانتا ہے", en="He knows"), word(2, 3, "يُؤْمِنُونَ", ur="وہ ایمان لاتے ہیں", en="they believe"), word(1, 5, "نَعْبُدُ", ur="ہم عبادت کرتے ہیں", en="we worship"),
   word(2, 216, "تَعْلَمُونَ", ur="تم جانتے ہو", en="you know"), word(109, 2, "أَعْبُدُ", ur="میں عبادت کرتا ہوں", en="I worship")],
  [phrase(2, 3, "جو غیب پر ایمان لاتے ہیں اور نماز قائم کرتے ہیں", "who believe in the unseen and establish prayer")]))
L.append(lesson(14, "حکم: کرو!", "Commands: do!", "حکم والا فعل اکثر ٱ یا قُ سے شروع ہوتا ہے۔ اللہ سے دعا بھی اسی انداز میں ہوتی ہے۔", "Commands often start with u- / i-. Duas to Allah use the same form.",
  [word(112, 1, "قُلْ", ur="کہہ دو", en="say!"), word(1, 6, "ٱهْدِنَا", ur="ہمیں ہدایت دے", en="guide us!"), word(2, 21, "ٱعْبُدُوا", ur="عبادت کرو", en="worship!"),
   word(2, 43, "أَقِيمُوا", ur="اور قائم کرو", en="and establish!"), word(96, 1, "ٱقْرَأْ", ur="پڑھو", en="read!")],
  [phrase(96, 1, "پڑھو اپنے رب کے نام سے جس نے پیدا کیا", "Read in the name of your Lord who created")]))
L.append(lesson(15, "چھوٹے حروف: میں، سے، پر، کی طرف", "Small words: in, from, on, to",
  "یہ حروف سب سے زیادہ آنے والے الفاظ ہیں — ان سے جملے جڑتے ہیں۔", "These are the most frequent words — they join the sentence together.",
  [word(2, 2, "فِيهِ", ur="اس میں", en="in it"), word(2, 3, "وَمِمَّا", ur="اور اس میں سے جو", en="and from what"), word(1, 7, "عَلَيْهِمْ", ur="ان پر", en="on them"),
   word(2, 4, "إِلَيْكَ", ur="تیری طرف", en="to you"), word(1, 1, "بِسْمِ", ur="نام سے / ساتھ", en="with the name"), word(1, 2, "لِلَّهِ", ur="اللہ کے لیے", en="for Allah")],
  [], "فِي میں · مِنْ سے · عَلَىٰ پر · إِلَىٰ طرف · بِـ ساتھ / سے · لِـ کے لیے · وَ اور · فَـ پس", "fī in · min from · 'alā on · ilā to · bi- with · li- for · wa and · fa so"))
L.append(lesson(16, "نفی: نہیں، ہرگز نہیں", "Negation: not, never", "عربی میں 'نہیں' کے کئی الفاظ ہیں اور ہر ایک کا الگ رنگ ہے۔", "Arabic has several words for 'not', each with its own shade.",
  [word(2, 2, "لَا", ur="نہیں", en="no / not"), word(112, 3, "لَمْ", ur="نہیں (ماضی)", en="did not"), word(2, 24, "لَن", ur="اور ہرگز نہیں (مستقبل)", en="and will never"), word(2, 8, "وَمَا", ur="اور نہیں", en="and not")],
  [phrase(2, 2, "یہ وہ کتاب ہے جس میں کوئی شک نہیں", "This is the Book in which there is no doubt")]))
L.append(lesson(17, "کون، کیا، جو", "Who, what, which", "سوال اور 'جو / جس' والے الفاظ — قرآن کی کہانیوں میں بار بار۔", "Question and 'who / which' words — again and again in the Quran's stories.",
  [word(2, 255, "مَن", ur="کون", en="who"), word(2, 26, "مَاذَآ", ur="کیا", en="what"), word(1, 7, "ٱلَّذِينَ", ur="وہ لوگ جو", en="those who"), word(67, 2, "ٱلَّذِى", ur="وہ جو", en="the One who"), word(88, 1, "هَلْ", ur="کیا (سوال)", en="has / did (question)")],
  [phrase(67, 2, "جس نے موت اور زندگی کو پیدا کیا تاکہ تمہیں آزمائے", "Who created death and life to test you")]))
L.append(lesson(18, "آیت الکرسی (۱)", "Ayat al-Kursi (1)", "قرآن کی سب سے عظیم آیت — پہلا حصہ۔", "The greatest ayah of the Quran — part one.",
  [word(2, 255, idx=i) for i in range(0, 13)], [phrase(2, 255, "اللہ، اس کے سوا کوئی معبود نہیں، وہ زندہ اور سب کو قائم رکھنے والا ہے…", "Allah — there is no god but He, the Ever-Living, the Sustainer of all…")]))
L.append(lesson(19, "آیت الکرسی (۲)", "Ayat al-Kursi (2)", "آیت الکرسی کا باقی حصہ۔", "The rest of Ayat al-Kursi.", [word(2, 255, idx=i) for i in range(13, len(S[2]["ayahs"][254]["w"]))]))
L.append(lesson(20, "لیول ۱ کا امتحان", "Level 1 test", "تمام اسباق کے الفاظ سے ملا جلا امتحان۔ ۸۰٪ پر لیول مکمل۔", "A mixed test from all lessons. 80% completes the level.", []))
json.dump({"level": 1, "title": {"ur": "قرآنی عربی — لیول ۱: گرامر کے بغیر سمجھیں", "en": "Quranic Arabic — Level 1: Understand without grammar"}, "lessons": L},
          open(f"{ROOT}/data/learn/course1.json", "w"), ensure_ascii=False, separators=(",", ":"))
print(len(L), "lessons;", sum(len(x["w"]) for x in L), "words;", sum(1 for x in L for w in x["w"] if not w["ro"]), "without Roman")
for x in L[3:5] + L[11:17]: print(x["id"], [(w["ref"] if "ref" in w else "", w["ar"]) for w in x["w"]])
