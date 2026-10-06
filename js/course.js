"use strict";
/* ---------- Grammar course (section D/J) and I'rab Lab (section K) — our own explanations, examples from the Quran data. Draft, pending scholar review ---------- */
Object.assign(L.ur, { lessonN:n=>`سبق ${ud(n)}`, examples:"قرآن سے مثالیں", checkH:"خود کو جانچیں", lessonDone:"سبق مکمل", courseDraft:"مسودہ — یہ وضاحتیں ہماری اپنی ہیں؛ عالم کی نظرِ ثانی باقی",
  irabIntro:"عربی میں لفظ کی آخری حرکت (اعراب) بتاتی ہے کہ جملے میں اس کا کردار کیا ہے۔ حرکت بدلے تو معنی بدل جاتا ہے۔", showcase:"مشہور مثالیں", fixT:"آخری حرکت درست کریں", fixS:"صحیح اعراب والا لفظ چنیں",
  byCase:"اس لفظ کی قرآن میں حالتیں", irabWord:w=>`«${w}» قرآن میں`, loadingOcc:"مقامات لوڈ ہو رہے ہیں…", fixQ:"اس آیت میں صحیح شکل کون سی ہے؟", shown:n=>`پہلے ${ud(n)} مقامات سے` });
Object.assign(L.en, { lessonN:n=>`Lesson ${n}`, examples:"Examples from the Quran", checkH:"Check yourself", lessonDone:"Lesson complete", courseDraft:"Draft — these explanations are our own; scholar review pending",
  irabIntro:"In Arabic the last vowel of a word (its i'rab) shows its role in the sentence. Change the vowel and the meaning changes.", showcase:"Famous examples", fixT:"Fix the ending", fixS:"Pick the word with the right ending",
  byCase:"This word's cases in the Quran", irabWord:w=>`«${w}» in the Quran`, loadingOcc:"Loading places…", fixQ:"Which form is correct in this ayah?", shown:n=>`from the first ${n} places` });
const LESSONS = [
 { en:["Three kinds of words", ["Every Arabic word is one of three kinds.", "Ism (noun): names a person, thing, place or quality — Allah, book, merciful.", "Fiʿl (verb): an action tied to time — he worshipped, we worship, worship!", "Ḥarf (particle): a small linking word that has meaning only with others — in, not, and."]],
   ur:["الفاظ کی تین قسمیں", ["عربی کا ہر لفظ تین میں سے ایک قسم کا ہوتا ہے۔", "اسم: کسی شخص، چیز، جگہ یا صفت کا نام — اللہ، کتاب، رحیم۔", "فعل: کام جس کے ساتھ زمانہ ہو — اس نے عبادت کی، ہم عبادت کرتے ہیں، عبادت کرو!", "حرف: چھوٹا جوڑنے والا لفظ جو دوسرے لفظ کے ساتھ ہی معنی دیتا ہے — میں، نہیں، اور۔"]],
   ex:["1:1:2", "1:5:2", "112:3:1"], q:[[["Which word is a verb (fiʿl)?", "کون سا لفظ فعل ہے؟"], ["1:1:2", "1:5:2", "112:3:1"], 1], [["Which word is a particle (ḥarf)?", "کون سا لفظ حرف ہے؟"], ["2:2:2", "112:3:1", "1:5:4"], 1]] },
 { en:["Al- = \"the\"", ["ٱلْ at the start of a noun makes it definite: kitāb = a book, al-kitāb = the book.", "Before some letters (sun letters like ر ص د) the ل is not pronounced and the next letter is doubled: ar-raḥmān, aṣ-ṣirāṭ.", "Before the others (moon letters) the ل is pronounced: al-ḥamd, al-kitāb."]],
   ur:["ال = \"وہ\" (معرفہ)", ["اسم کے شروع میں ٱلْ اسے معرفہ (خاص) بنا دیتا ہے: کتاب = کوئی کتاب، الکتاب = وہ (خاص) کتاب۔", "کچھ حروف (شمسی حروف جیسے ر ص د) سے پہلے لام نہیں پڑھا جاتا اور اگلے حرف پر شد آتی ہے: الرَّحمٰن، الصِّراط۔", "باقی (قمری حروف) سے پہلے لام پڑھا جاتا ہے: الحَمد، الکِتاب۔"]],
   ex:["1:2:1", "2:2:2", "1:1:3", "1:6:2"], q:[[["In which word is the ل of al- silent?", "کس لفظ میں ال کا لام نہیں پڑھا جاتا؟"], ["1:2:1", "1:1:3", "2:2:2"], 1]] },
 { en:["Small joined words: wa, fa, bi, li, la", ["Some particles are written joined to the next word.", "وَ = and · فَ = so / then · بِ = with / by / in · لِ = for / to · لَ = surely (emphasis).", "Tap any word in the reader and the coloured part shows the prefix with its meaning."]],
   ur:["جڑے ہوئے چھوٹے الفاظ: وَ، فَ، بِ، لِ، لَ", ["کچھ حروف اگلے لفظ کے ساتھ ملا کر لکھے جاتے ہیں۔", "وَ = اور · فَ = پس / پھر · بِ = سے / کے ساتھ / میں · لِ = کے لیے / کو · لَ = یقیناً (تاکید)۔", "پڑھتے وقت کسی بھی لفظ کو دبائیں — رنگین حصہ سابقہ اور اس کا معنی دکھاتا ہے۔"]],
   ex:["1:5:3", "1:1:1", "1:2:2", "103:2:3"], q:[[["Which word starts with \"and\"?", "کون سا لفظ \"اور\" سے شروع ہوتا ہے؟"], ["1:1:1", "1:5:3", "1:2:2"], 1]] },
 { en:["Attached pronouns", ["Pronouns are often joined to the end of a word.", "ـنَا = us / our · ـهُمْ = them / their · ـكَ = you / your · ـهُ = him / his · ـي = me / my.", "On a verb the first ending can be the doer: رَزَقْنَاهُمْ = razaq-nā-hum = We provided them."]],
   ur:["ملی ہوئی ضمیریں", ["ضمیریں اکثر لفظ کے آخر میں جڑی ہوتی ہیں۔", "ـنَا = ہمیں / ہمارا · ـهُمْ = انہیں / ان کا · ـكَ = تمہیں / تمہارا · ـهُ = اسے / اس کا · ـي = مجھے / میرا۔", "فعل پر پہلی ضمیر کام کرنے والا بھی ہو سکتی ہے: رَزَقْنَاهُمْ = رَزَق + نا + ہم = ہم نے انہیں رزق دیا۔"]],
   ex:["1:6:1", "1:7:4", "2:3:7", "1:5:1"], q:[[["In عَلَيْهِمْ, what does ـهِمْ mean?", "عَلَيْهِمْ میں ـهِمْ کا معنی؟"], ["them", "us", "you"], 0, true]] },
 { en:["The past tense (māḍī)", ["A completed action. The ending shows who did it.", "ـتَ = you (one man) · ـنَا = we · ـُوا = they (men) · no ending = he.", "أَنْعَمْتَ = You favoured · ءَامَنُوا = they believed."]],
   ur:["فعلِ ماضی", ["مکمل ہو چکا کام۔ آخری حصہ بتاتا ہے کہ کس نے کیا۔", "ـتَ = تُو نے · ـنَا = ہم نے · ـُوا = انہوں نے · کچھ نہیں = اس نے۔", "أَنْعَمْتَ = تُو نے انعام کیا · ءَامَنُوا = وہ ایمان لائے۔"]],
   ex:["1:7:3", "103:3:3", "2:3:7"], q:[[["ءَامَنُوا means:", "ءَامَنُوا کا معنی:"], ["they believed", "we believed", "he believes"], 0, true]] },
 { en:["The present tense (muḍāriʿ)", ["An action happening now or habitually. A letter at the start shows who does it:", "نَـ = we · يَـ = he / they · تَـ = you / she · أَ = I.", "نَعْبُدُ = we worship · يُؤْمِنُونَ = they believe (ـونَ = they)."]],
   ur:["فعلِ مضارع", ["جو کام اب ہو رہا ہو یا عادتاً ہو۔ شروع کا حرف بتاتا ہے کون کر رہا ہے:", "نَـ = ہم · يَـ = وہ · تَـ = تم / وہ (مؤنث) · أَ = میں۔", "نَعْبُدُ = ہم عبادت کرتے ہیں · يُؤْمِنُونَ = وہ ایمان لاتے ہیں (ـونَ = وہ سب)۔"]],
   ex:["1:5:2", "1:5:4", "2:3:2", "112:3:2"], q:[[["Who does the action in نَسْتَعِينُ?", "نَسْتَعِينُ میں کام کون کر رہا ہے؟"], ["we", "he", "you"], 0, true]] },
 { en:["Commands (amr)", ["A command tells someone to do something now.", "ٱهْدِنَا = guide us! · قُلْ = say!", "Many duas in the Quran are commands addressed to Allah as requests."]],
   ur:["امر (حکم)", ["امر کسی کو ابھی کوئی کام کرنے کا کہتا ہے۔", "ٱهْدِنَا = ہمیں ہدایت دے! · قُلْ = کہہ دو!", "قرآن کی بہت سی دعائیں اللہ سے درخواست کے طور پر امر کے صیغے میں ہیں۔"]],
   ex:["1:6:1", "112:1:1"], q:[[["Which word is a command?", "کون سا لفظ امر ہے؟"], ["1:5:2", "112:1:1", "1:7:3"], 1]] },
 { en:["The three cases (iʿrāb)", ["Nouns change their last vowel by role:", "Rafʿ — ending ـُ (or ـٌ): the subject or the main topic. ٱلْحَمْدُ.", "Naṣb — ending ـَ (or ـً): the object of a verb, or after إِنَّ. ٱلصِّرَاطَ.", "Jarr — ending ـِ (or ـٍ): after a preposition, or the second noun in \"X of Y\". بِسْمِ ٱللَّهِ."]],
   ur:["تین حالتیں (اعراب)", ["اسم کی آخری حرکت اس کے کردار سے بدلتی ہے:", "رفع — آخر میں ـُ (یا ـٌ): فاعل یا مبتدا۔ ٱلْحَمْدُ۔", "نصب — آخر میں ـَ (یا ـً): مفعول، یا إِنَّ کے بعد۔ ٱلصِّرَاطَ۔", "جر — آخر میں ـِ (یا ـٍ): حرفِ جر کے بعد، یا \"فلاں کا\" میں دوسرا اسم۔ بِسْمِ ٱللَّهِ۔"]],
   ex:["1:2:1", "1:6:2", "1:1:2"], q:[[["Which word is in naṣb (object)?", "کون سا لفظ منصوب (مفعول) ہے؟"], ["1:2:1", "1:6:2", "1:1:2"], 1]] },
 { en:["Iḍāfa: \"X of Y\"", ["Two nouns side by side often mean \"X of Y\". The first has no al- and no tanwīn; the second is in jarr.", "رَبِّ ٱلْعَالَمِينَ = Lord of the worlds.", "مَالِكِ يَوْمِ ٱلدِّينِ = Master of the Day of Judgment (a chain of three)."]],
   ur:["اضافت: \"فلاں کا فلاں\"", ["دو اسم ساتھ ساتھ اکثر \"کا / کی / کے\" کا معنی دیتے ہیں۔ پہلے پر ال اور تنوین نہیں ہوتی؛ دوسرا مجرور ہوتا ہے۔", "رَبِّ ٱلْعَالَمِينَ = جہانوں کا رب۔", "مَالِكِ يَوْمِ ٱلدِّينِ = بدلے کے دن کا مالک (تین الفاظ کی زنجیر)۔"]],
   ex:["1:2:3", "1:2:4", "1:4:1", "1:4:2", "1:4:3"], q:[[["رَبِّ ٱلْعَالَمِينَ means:", "رَبِّ ٱلْعَالَمِينَ کا معنی:"], ["Lord of the worlds", "the Lord and the worlds", "a Lord for worlds"], 0, true]] },
 { en:["Plurals and negatives", ["Sound plural (men): ـُونَ / ـِينَ — ٱلْعَالَمِينَ, ٱلْمُتَّقِينَ. Sound plural (women): ـَاتٌ — ٱلصَّالِحَاتِ.", "Negatives: لَا = no / not · لَمْ + present verb = did not (لَمْ يَلِدْ = He did not beget) · مَا = not (also: what)."]],
   ur:["جمع اور نفی", ["جمع مذکر سالم: ـُونَ / ـِينَ — ٱلْعَالَمِينَ، ٱلْمُتَّقِينَ۔ جمع مؤنث سالم: ـَاتٌ — ٱلصَّالِحَاتِ۔", "نفی: لَا = نہیں · لَمْ + مضارع = (ماضی میں) نہیں کیا (لَمْ يَلِدْ = اس نے نہیں جنا) · مَا = نہیں (اور: کیا / جو)۔"]],
   ex:["1:2:4", "2:2:7", "103:3:5", "2:2:3", "112:3:1"], q:[[["لَمْ يَلِدْ means:", "لَمْ يَلِدْ کا معنی:"], ["He did not beget", "He will not beget", "Do not beget"], 0, true]] }
];
LS.lessons = LS.lessons || {};
async function wordAt(ref){ const [s, a, w] = ref.split(":").map(Number), d = await DATA.surah(s); return d.ayahs[a - 1].w[w - 1]; }
function openCourse(){
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><b>${T("courseT")}</b></div>
    <div class="path">${LESSONS.map((L2, i) => `<button class="node ${LS.lessons[i] ? "done" : "cur"}" data-lesson="${i}"><b>${T("lessonN", nf(i + 1))}: ${esc((settings.lang === "en" ? L2.en : L2.ur)[0])}</b><small>${LS.lessons[i] ? T("passed") : ""}</small></button>`).join("")}</div>
    <p class="draft">${T("courseDraft")}</p>`;
}
const CL = { i: 0, picks: {} };
async function openLesson(i){
  CL.i = i; CL.picks = {}; const Ls = LESSONS[i], tx = settings.lang === "en" ? Ls.en : Ls.ur, G2 = (settings.lang === "en" && META.grammar_en) || META.grammar;
  const exs = await Promise.all(Ls.ex.map(async r => { const w = await wordAt(r), st = w[4].find(s => s[3] === "") || w[4][0];
    return `<li><button data-go3="${r}"><span class="la">${segHTML(w[4])}</span><span class="lg">${esc(w[1])}<small>${esc(G2[st[1]][0])}</small></span><span class="lc">${r}</span></button></li>`; }));
  const qs = await Promise.all(Ls.q.map(async ([q, opts, ans, plain], qi) => { const os = plain ? opts.map(esc) : await Promise.all(opts.map(async r => `<span class="oar">${esc((await wordAt(r))[0])}</span>`));
    return `<div class="lq"><b>${esc(settings.lang === "en" ? q[0] : q[1])}</b><div class="opts">${os.map((o, k) => `<button data-lq="${qi}:${k}">${o}</button>`).join("")}</div></div>`; }));
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-q="course" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg></button><b>${T("lessonN", nf(i + 1))}</b></div>
    <div class="lc lesson"><h2>${esc(tx[0])}</h2>${tx[1].map(p => `<p>${esc(p)}</p>`).join("")}</div>
    <div class="lh"><h3>${T("examples")}</h3></div><ul class="lemlist">${exs.join("")}</ul>
    <div class="lh"><h3>${T("checkH")}</h3></div>${qs.join("")}
    <p class="draft">${T("courseDraft")}</p>`;
}
/* ---- I'rab Lab ---- */
const SHOW = [
 { ref:"9:3", w:[4, 15], en:"In 9:3 the same word appears twice. وَرَسُولِهِۦ (word 4, genitive) belongs to \"from Allah and His Messenger\" — the announcement comes from both. وَرَسُولُهُۥ (word 15, nominative) starts a new statement: \"and His Messenger (is free of them too)\". Reading word 15 with ـِ would make it \"Allah is free of the polytheists and of His Messenger\" — a terrible change of meaning. A famous report says this misreading moved early Muslims to write down Arabic grammar.",
   ur:"۹:۳ میں ایک ہی لفظ دو بار آیا ہے۔ وَرَسُولِهِۦ (لفظ ۴، مجرور) \"اللہ اور اس کے رسول کی طرف سے\" کا حصہ ہے۔ وَرَسُولُهُۥ (لفظ ۱۵، مرفوع) نیا جملہ ہے: \"اور اس کا رسول بھی (ان سے بری ہے)\"۔ اگر لفظ ۱۵ کو زیر سے پڑھا جائے تو معنی بنتا ہے \"اللہ مشرکوں سے اور اپنے رسول سے بری ہے\" — معنی بالکل الٹ جاتا ہے۔ ایک مشہور روایت کے مطابق اسی غلطی نے عربی گرامر لکھنے کی ابتدا کی۔" },
 { ref:"35:28", w:[10, 13], en:"إِنَّمَا يَخْشَى ٱللَّهَ مِنْ عِبَادِهِ ٱلْعُلَمَٰٓؤُا۟ — ٱللَّهَ ends in ـَ (object) and ٱلْعُلَمَاءُ ends in ـُ (subject): \"Only those of His servants who have knowledge fear Allah.\" The order of the words does not decide who fears whom — the endings do.",
   ur:"إِنَّمَا يَخْشَى ٱللَّهَ مِنْ عِبَادِهِ ٱلْعُلَمَٰٓؤُا۟ — ٱللَّهَ پر زبر (مفعول) اور ٱلْعُلَمَاءُ پر پیش (فاعل): \"اللہ سے اس کے بندوں میں سے صرف علم والے ڈرتے ہیں۔\" کون کس سے ڈرتا ہے، یہ الفاظ کی ترتیب نہیں بلکہ اعراب طے کرتا ہے۔" },
 { ref:"2:124", w:[3, 4], en:"وَإِذِ ٱبْتَلَىٰٓ إِبْرَٰهِۦمَ رَبُّهُۥ — Ibrahim comes first but ends in ـَ (object); رَبُّهُۥ comes after but ends in ـُ (subject): \"when his Lord tested Ibrahim\".",
   ur:"وَإِذِ ٱبْتَلَىٰٓ إِبْرَٰهِۦمَ رَبُّهُۥ — ابراہیم پہلے آیا مگر زبر کے ساتھ (مفعول)؛ رَبُّهُۥ بعد میں مگر پیش کے ساتھ (فاعل): \"جب ابراہیم کو اس کے رب نے آزمایا\"۔" }
];
async function openIrabHome(){
  if (LV.view !== "learn") showView("learn");
  const items = await Promise.all(SHOW.map(async X => { const [s, a] = X.ref.split(":").map(Number), d = await DATA.surah(s), A = d.ayahs[a - 1];
    return `<div class="lc"><div class="oa" dir="rtl">${A.w.map((w, k) => X.w.includes(k + 1) ? `<mark>${esc(w[0])}</mark>` : esc(w[0])).join(" ")}</div><div class="or">${esc(surahName(s))} ${nf(s)}:${nf(a)}</div>
      <p>${esc(settings.lang === "en" ? X.en : X.ur)}</p></div>`; }));
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-act="home" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><b>${T("irabT")}</b></div>
    <p>${T("irabIntro")}</p><button class="btn wide" data-irq="fix">${T("fixT")} — ${T("fixS")}</button>
    <div class="lh"><h3>${T("showcase")}</h3></div>${items.join("")}<p class="draft">${T("courseDraft")}</p>`;
}
async function openIrab(li){
  if (LV.view !== "learn") showView("learn");
  const Lm = META.lemmas[li], occ = ((await DATA.occ())[li] || []).slice(0, 80);
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-q="irab" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg></button><b>${T("irabWord", esc(Lm[0]))}</b></div><div class="loading">${T("loadingOcc")}</div>`;
  const groups = { N: [], A: [], G: [] };
  for (const loc of occ) { const [s, a, w] = loc.split(":").map(Number), d = await DATA.surah(s), W = d.ayahs[a - 1].w[w - 1], st = W[4].find(x => x[3] === "");
    const c = st ? caseOf(st[1]) : ""; if (c) groups[c].push([loc, W[0], W[1]]); }
  $("#learn").innerHTML = `<div class="fc-top"><button class="iconbtn" data-q="irab" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg></button><b>${T("irabWord", esc(Lm[0]))}</b></div>
    <p>${T("byCase")} <small class="muted">(${T("shown", nf(occ.length))})</small></p>
    ${["N", "A", "G"].map(c => `<div class="lc"><h3 style="margin-top:0">${T("case" + c)} · ${nf(groups[c].length)}</h3><div class="chips wrap">${groups[c].slice(0, 24).map(([loc, ar, g]) =>
      `<button class="chip" data-go3="${loc}"><b class="oar">${esc(ar)}</b><span>${esc(g)} · ${loc.split(":").slice(0, 2).join(":")}</span></button>`).join("") || `<span class="muted">—</span>`}</div></div>`).join("")}
    <p>${T("irabIntro")}</p>`;
}
/* "Fix the ending": real Quran nouns whose last letter carries the case vowel; the options swap only that vowel */
const VSET = { "ُ":"u", "َ":"a", "ِ":"i", "ٌ":"U", "ً":"A", "ٍ":"I" }, VOF = { u:"ُ", a:"َ", i:"ِ", U:"ٌ", A:"ً", I:"ٍ" };
async function fixQs(){
  const qs = [], surahs = shuf([1, 2, ...Array.from({ length: 37 }, (_, k) => 78 + k)]).slice(0, 8);
  for (const s of surahs) { const d = await DATA.surah(s);
    d.ayahs.forEach((A, ai) => A.w.forEach((W, wi) => { const segs = W[4], last = W[0].slice(-1);
      if (!VSET[last] || segs[segs.length - 1][3] !== "" || W[0].length < 3) return; const st = segs[segs.length - 1]; if (tagsOf(st[1]).startsWith("V") || !caseOf(st[1])) return;
      const tan = /[UAI]/.test(VSET[last]), set = tan ? ["U", "A", "I"] : ["u", "a", "i"], base = W[0].slice(0, -1), opts = set.map(v => base + VOF[v]);
      qs.push({ prompt:`<div class="oa" dir="rtl">${A.w.map((x, k) => k === wi ? `<mark>${esc(base)}ـ؟</mark>` : esc(x[0])).join(" ")}</div><div class="qh">${T("fixQ")}</div><div class="qref">${esc(surahName(s))} ${nf(s)}:${nf(ai + 1)}</div>`,
        opts: opts.map(o => `<span class="oar">${esc(o)}</span>`), ans: opts.indexOf(W[0]), w: null, note: T("case" + caseOf(st[1])) }); })); }
  return shuf(qs).slice(0, 10);
}
$("#learn").addEventListener("click", async e => {
  const ls = e.target.closest("[data-lesson]"); if (ls) return openLesson(+ls.dataset.lesson);
  const lq = e.target.closest("[data-lq]"); if (lq) { const [qi, k] = lq.dataset.lq.split(":").map(Number), Q = LESSONS[CL.i].q[qi];
    lq.parentNode.querySelectorAll("button").forEach((b, j) => b.className = j === Q[2] ? "ok" : (j === k ? "no" : ""));
    CL.picks[qi] = k === Q[2]; if (Object.keys(CL.picks).length === LESSONS[CL.i].q.length && Object.values(CL.picks).every(Boolean) && !LS.lessons[CL.i]) { LS.lessons[CL.i] = 1; addXP(30); badge("course"); toast(esc(T("lessonDone"))); } return; }
  const iq = e.target.closest("[data-irq]"); if (iq) { const qs = await fixQs(); runQuiz(qs, { kind:"fix" }); }
});
GAMES.fix = async () => runQuiz(await fixQs(), { kind:"fix" });
