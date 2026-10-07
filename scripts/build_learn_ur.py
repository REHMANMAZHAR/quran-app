"""Add Urdu to the learning data: vocab meanings (from the most common word-by-word Urdu meaning of the lemma),
Urdu word types, and the Urdu word-by-word meaning for every drill item. Run after build_words.py."""
import json, os, re, unicodedata
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
meta = json.load(open(f"{ROOT}/data/meta.json")); W = json.load(open(f"{ROOT}/data/words.json"))
S = {n: json.load(open(f"{ROOT}/data/s/{n:03d}.json")) for n in range(1, 115)}
def wur(s, a, w):
    try: x = S[s]["ayahs"][a - 1]["w"][w - 1]; return x[3] or ""
    except Exception: return ""
strip = lambda t: re.sub(r"[ً-ٰٟۖ-ۭـ]", "", unicodedata.normalize("NFC", t)).replace("ٱ", "ا").replace("أ","ا").replace("إ","ا").replace("آ","ا")
lem, exact = {}, {}
for i, L in enumerate(meta["lemmas"]):
    root = (meta["roots"][L[2]][0] if L[2] >= 0 else "").replace(" ", "")
    lem.setdefault((strip(L[0]), root), i); exact.setdefault((unicodedata.normalize("NFC", L[0]), root), i)
TYPE = {"Noun":"اسم","Proper noun":"اسمِ علم (نام)","Adjective":"صفت","Active participle":"اسمِ فاعل","Passive participle":"اسمِ مفعول","Verbal noun":"مصدر","Pronoun":"ضمیر",
  "Relative pronoun":"اسمِ موصول","Demonstrative":"اسمِ اشارہ","Preposition":"حرفِ جر","Conjunction":"حرفِ عطف","Time adverb":"ظرفِ زمان","Place adverb":"ظرفِ مکان",
  "Question word":"سوالیہ لفظ","Question particle":"حرفِ استفہام","Negative particle":"حرفِ نفی","Conditional particle":"حرفِ شرط","Subordinating particle":"حرفِ مصدری",
  "Particle (inna & sisters)":"اِنَّ اور اس کے اخوات","Explanation particle":"حرفِ تفسیر","Answer particle":"حرفِ جواب","Restriction particle":"حرفِ حصر",
  "Particle of certainty (qad)":"قَدْ (تحقیق)","Retraction particle":"حرفِ اضراب","Exhortation particle":"حرفِ تحضیض","Amendment particle":"حرفِ استدراک","Future particle":"حرفِ استقبال",
  "Attention particle":"حرفِ تنبیہ","Aversion particle":"حرفِ ردع","Particle / noun (relative, question, negative, maṣdariyya)":"حرف / اسم (موصولہ، سوالیہ، نافیہ، مصدریہ)"}
v = json.load(open(f"{ROOT}/data/learn/vocab.json"))
v["fields"] = v["fields"][:12] + ["meaning_ur", "type_ur", "gloss_ur"]
miss = 0
for w in v["words"]:
    w[:] = w[:12]
    r = w[2].replace(" ", ""); i = exact.get((unicodedata.normalize("NFC", w[1]), r))
    if i is None: i = lem.get((strip(w[1]), r))
    ur = W["lemUr"][i] if i is not None else ""
    if not ur: ur = wur(w[7], w[8], w[9]); miss += 1
    t = w[3]; m = re.match(r"Verb \(Form ([IVX]+)\)", t)
    tu = f"فعل (باب {m.group(1)})" if m else TYPE.get(t, t)
    w += [ur, tu, wur(w[7], w[8], w[9])]
json.dump(v, open(f"{ROOT}/data/learn/vocab.json", "w"), ensure_ascii=False, separators=(",", ":"))
d = json.load(open(f"{ROOT}/data/learn/drills.json"))
for k, x in d.items():
    if isinstance(x, dict) and "items" in x:
        for it in x["items"]: it[:] = it[:9] + [wur(it[0], it[1], it[2])]
json.dump(d, open(f"{ROOT}/data/learn/drills.json", "w"), ensure_ascii=False, separators=(",", ":"))
print("vocab without lemma match:", miss, "| sample:", [(w[1], w[5], w[12], w[13]) for w in v["words"][:8]])

# ---- Roman Urdu: the same meanings in Latin letters (token dictionary data-raw/ur-roman.json, reviewed by hand) ----
RO = json.load(open(f"{ROOT}/data-raw/ur-roman.json"))
PUN = {"،": ",", "۔": ".", "؛": ";", "؟": "?"}
def roman(t):
    if not t: return ""
    out = re.sub(r"[^\s/،۔()\-–—,:؛\"'“”؟]+", lambda m: RO.get(m.group(0), m.group(0)), t)
    for a, b in PUN.items(): out = out.replace(a, b)
    return out
v = json.load(open(f"{ROOT}/data/learn/vocab.json"))
v["fields"] = v["fields"][:15] + ["meaning_ro", "type_ro", "gloss_ro"]
for w in v["words"]: w[:] = w[:15] + [roman(w[12]), roman(w[13]), roman(w[14])]
json.dump(v, open(f"{ROOT}/data/learn/vocab.json", "w"), ensure_ascii=False, separators=(",", ":"))
d = json.load(open(f"{ROOT}/data/learn/drills.json"))
for k, x in d.items():
    if isinstance(x, dict) and "items" in x:
        for it in x["items"]: it[:] = it[:10] + [roman(it[9])]
json.dump(d, open(f"{ROOT}/data/learn/drills.json", "w"), ensure_ascii=False, separators=(",", ":"))
Wd = json.load(open(f"{ROOT}/data/words.json")); Wd["lemRo"] = [roman(m) for m in Wd["lemUr"]]
json.dump(Wd, open(f"{ROOT}/data/words.json", "w"), ensure_ascii=False, separators=(",", ":"))
left = sorted({t for w in v["words"] for t in re.findall(r"[؀-ۿ]+", w[15])})
print("roman sample:", [(w[1], w[15], w[16]) for w in v["words"][:10]], "| Urdu letters left:", left[:20])
