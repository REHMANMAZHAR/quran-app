"""Build data/extras.json (Mushaf pages, part-meaning tags, Quranic duas) and data/similar.json (mutashabihat).
Run after build.py:  python scripts/build_extras.py
"""
import csv, json, os, re
from collections import defaultdict
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = lambda p: os.path.join(ROOT, p)
words = defaultdict(lambda: defaultdict(str)); counts = {}
for line in open(R("data-raw/quran-morphology.txt"), encoding="utf8"):
    loc, t = line.split("\t")[:2]
    s, v, w, g = map(int, loc.split(":")); words[(s, v)][w] += t
ayahs = sorted(words)
# --- part tags: template id -> corpus tags, only for prefixes/suffixes and verb stems (aspect) ---
tags = {}
for r in csv.DictReader(open(R("data/grammar-templates-for-review.csv"), encoding="utf-8-sig")):
    t = r["corpus_tags"]
    tags[r["id"]] = t
# --- Quranic duas (selection; ayah text comes from the app's own data) ---
DUAS = [
 ("1:6-7","Guide us to the straight path","ہمیں سیدھا راستہ دکھا","Al-Fatiha"),
 ("2:127-128","Accept from us; make us Muslims to You","ہم سے قبول فرما؛ ہمیں اپنا فرمانبردار بنا","Ibrahim & Ismail"),
 ("2:129","Send them a messenger from among them","ان میں انہی میں سے ایک رسول بھیج","Ibrahim & Ismail"),
 ("2:201","Good in this world and the Hereafter","دنیا اور آخرت کی بھلائی","Believers"),
 ("2:250","Pour patience on us; make our feet firm","ہم پر صبر انڈیل دے؛ ہمارے قدم جما دے","Talut's army"),
 ("2:285-286","Do not burden us beyond what we can bear","ہم پر طاقت سے زیادہ بوجھ نہ ڈال","Believers"),
 ("3:8-9","Do not let our hearts deviate","ہمارے دلوں کو ٹیڑھا نہ کر","People of knowledge"),
 ("3:16","Forgive our sins; save us from the Fire","ہمارے گناہ بخش دے؛ آگ سے بچا","Believers"),
 ("3:38","Grant me good offspring","مجھے نیک اولاد عطا فرما","Zakariya"),
 ("3:53","Write us among the witnesses","ہمیں گواہی دینے والوں میں لکھ لے","Disciples of Isa"),
 ("3:147","Forgive our excesses; make our feet firm","ہماری زیادتیاں معاف کر؛ قدم جما دے","Believers with the prophets"),
 ("3:191-194","You did not create this in vain","تو نے یہ بے مقصد نہیں بنایا","People of understanding"),
 ("4:75","Take us out of this town of oppressors","ہمیں اس ظالم بستی سے نکال","The oppressed"),
 ("5:83","We believe; write us with the witnesses","ہم ایمان لائے؛ ہمیں گواہوں کے ساتھ لکھ لے","Believers who wept"),
 ("5:114","Send down a table from heaven","آسمان سے دسترخوان اتار","Isa"),
 ("7:23","We have wronged ourselves","ہم نے اپنے اوپر ظلم کیا","Adam & Hawwa"),
 ("7:47","Do not place us with the wrongdoers","ہمیں ظالموں کے ساتھ نہ کر","People of the Heights"),
 ("7:89","Judge between us and our people in truth","ہمارے اور ہماری قوم کے درمیان حق کے ساتھ فیصلہ کر","Shu'ayb"),
 ("7:126","Pour patience on us; let us die as Muslims","ہم پر صبر انڈیل دے؛ ہمیں مسلمان موت دے","Pharaoh's magicians"),
 ("7:151","Forgive me and my brother","مجھے اور میرے بھائی کو بخش دے","Musa"),
 ("7:155-156","You are our protector; forgive us","تو ہمارا کارساز ہے؛ ہمیں بخش دے","Musa"),
 ("10:85-86","Do not make us a trial for the wrongdoers","ہمیں ظالموں کے لیے آزمائش نہ بنا","People of Musa"),
 ("11:47","I seek refuge in You from asking what I do not know","میں تیری پناہ چاہتا ہوں کہ وہ مانگوں جس کا مجھے علم نہیں","Nuh"),
 ("12:101","Let me die a Muslim; join me with the righteous","مجھے مسلمان موت دے اور نیکوں سے ملا","Yusuf"),
 ("14:35","Make this city safe; keep me from idols","اس شہر کو امن والا بنا؛ مجھے بتوں سے بچا","Ibrahim"),
 ("14:40-41","Make me establish prayer; forgive me and my parents","مجھے نماز قائم کرنے والا بنا؛ مجھے اور میرے والدین کو بخش","Ibrahim"),
 ("17:24","Have mercy on my parents","میرے والدین پر رحم فرما","For parents"),
 ("17:80","Let me enter and leave with truth","مجھے سچائی کے ساتھ داخل کر اور نکال","Prophet Muhammad ﷺ"),
 ("18:10","Grant us mercy; guide our affair","ہمیں رحمت عطا کر؛ ہمارے کام میں رہنمائی","Companions of the Cave"),
 ("20:25-28","Expand my chest; ease my task","میرا سینہ کھول دے؛ میرا کام آسان کر","Musa"),
 ("20:114","Increase me in knowledge","میرے علم میں اضافہ فرما","Prophet Muhammad ﷺ"),
 ("21:83","Harm has touched me; You are most merciful","مجھے تکلیف پہنچی؛ تو سب سے بڑھ کر رحم کرنے والا ہے","Ayyub"),
 ("21:87","There is no god but You; I was a wrongdoer","تیرے سوا کوئی معبود نہیں؛ میں ظالموں میں سے تھا","Yunus"),
 ("21:89","Do not leave me alone","مجھے اکیلا نہ چھوڑ","Zakariya"),
 ("23:29","Land me in a blessed place","مجھے برکت والی جگہ اتار","Nuh"),
 ("23:97-98","Refuge from the whispers of devils","شیطانوں کے وسوسوں سے پناہ","Prophet Muhammad ﷺ"),
 ("23:109","We believe; forgive us and have mercy","ہم ایمان لائے؛ ہمیں بخش اور رحم کر","Believers"),
 ("23:118","Forgive and have mercy","بخش دے اور رحم فرما","Prophet Muhammad ﷺ"),
 ("25:65-66","Turn away from us the punishment of Hell","ہم سے جہنم کا عذاب پھیر دے","Servants of the Most Merciful"),
 ("25:74","Coolness of eyes in spouses and children","بیویوں اور اولاد سے آنکھوں کی ٹھنڈک","Servants of the Most Merciful"),
 ("26:83-85","Grant me wisdom; join me with the righteous","مجھے حکمت دے؛ نیکوں سے ملا","Ibrahim"),
 ("27:19","Inspire me to be grateful","مجھے شکر کرنے کی توفیق دے","Sulayman"),
 ("28:16","I have wronged myself, so forgive me","میں نے اپنے اوپر ظلم کیا، مجھے بخش دے","Musa"),
 ("28:21","Save me from the wrongdoing people","مجھے ظالم قوم سے نجات دے","Musa"),
 ("28:24","I am in need of whatever good You send me","جو بھلائی تو مجھ پر اتارے میں اس کا محتاج ہوں","Musa"),
 ("29:30","Help me against the corrupting people","فساد کرنے والی قوم کے خلاف میری مدد کر","Lut"),
 ("37:100","Grant me a righteous child","مجھے نیک اولاد عطا کر","Ibrahim"),
 ("40:7-9","Forgive those who repent; protect them","توبہ کرنے والوں کو بخش؛ انہیں بچا","Angels bearing the Throne"),
 ("44:12","Remove the punishment from us","ہم سے عذاب دور کر","Disbelievers in distress"),
 ("46:15","Inspire me to be grateful; make my children righteous","مجھے شکر کی توفیق دے؛ میری اولاد کو نیک بنا","At forty years"),
 ("59:10","Forgive us and our brothers who came before","ہمیں اور ہم سے پہلے کے بھائیوں کو بخش","Later believers"),
 ("60:4-5","On You we rely","ہم نے تجھ پر بھروسہ کیا","Ibrahim and his followers"),
 ("66:8","Perfect our light for us","ہمارے لیے ہمارا نور مکمل کر","Believers"),
 ("66:11","Build me a house near You in Paradise","میرے لیے جنت میں اپنے پاس گھر بنا","Wife of Pharaoh"),
 ("71:28","Forgive me, my parents and the believers","مجھے، میرے والدین اور مومنوں کو بخش","Nuh"),
 ("113:1-5","Refuge with the Lord of daybreak","صبح کے رب کی پناہ","Al-Falaq"),
 ("114:1-6","Refuge with the Lord of mankind","انسانوں کے رب کی پناہ","An-Nas"),
]
duas = []
for ref, en, ur, who in DUAS:
    s, rng = ref.split(":"); a, b = (rng.split("-") + [rng])[:2]
    assert (int(s), int(a)) in words and (int(s), int(b)) in words, ref
    duas.append([int(s), int(a), int(b), en, ur, who])
# --- pages ---
pages = json.load(open(R("data-raw/ext/pages.json")))["pages"]
json.dump({"pages": pages, "parts": tags, "duas": duas}, open(R("data/extras.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
# --- similar ayahs (mutashabihat): long shared word runs ---
NORM = str.maketrans({"ٱ": "ا", "أ": "ا", "إ": "ا", "آ": "ا", "ى": "ي", "ة": "ه"})
def norm(t): return re.sub("[^ء-ؿف-ي]", "", t.translate(NORM))
toks = {k: [norm(words[k][i]) for i in sorted(words[k])] for k in ayahs}
idx = defaultdict(set)
for k, t in toks.items():
    for i in range(len(t) - 2): idx[tuple(t[i:i + 3])].add(k)
def run(a, b):
    best = 0; prev = [0] * (len(b) + 1)
    for x in a:
        cur = [0] * (len(b) + 1)
        for j, y in enumerate(b, 1):
            if x == y: cur[j] = prev[j - 1] + 1; best = max(best, cur[j])
        prev = cur
    return best
sim = {}
for k, t in toks.items():
    if len(t) < 3: continue
    cand = set()
    for i in range(len(t) - 2):
        g = idx[tuple(t[i:i + 3])]
        if len(g) < 60: cand |= g
    cand.discard(k); out = []
    for c in cand:
        r = run(t, toks[c]); mn = min(len(t), len(toks[c]))
        if r >= 4 and (r >= 6 or r / mn >= 0.6): out.append((r, c))
    out.sort(reverse=True)
    if out: sim[f"{k[0]}:{k[1]}"] = [[f"{c[0]}:{c[1]}", r] for r, c in out[:6]]
json.dump(sim, open(R("data/similar.json"), "w", encoding="utf8"), separators=(",", ":"))
# --- search index: one line per ayah: normalized Arabic | Yusuf Ali | Jalandhry ---
def strip_ar(t):
    t = re.sub("[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]", "", t)
    return t.translate(str.maketrans({"\u0671": "ا", "أ": "ا", "إ": "ا", "آ": "ا", "ى": "ي", "ة": "ه"}))
idx_out = []
for n in range(1, 115):
    d = json.load(open(R(f"data/s/{n:03d}.json"), encoding="utf8"))
    for a, A in enumerate(d["ayahs"], 1):
        idx_out.append([n, a, strip_ar(" ".join(w[0] for w in A["w"])), A.get("en2", ""), A.get("ur", "")])
json.dump(idx_out, open(R("data/search.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
print(f"extras: {len(pages)-2} pages, {len(tags)} part tags, {len(duas)} duas; similar: {len(sim)} ayahs have look-alikes")
