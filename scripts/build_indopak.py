"""Build data/indopak.json: Indo-Pak script text split to match the app's word-by-word words.
Source: fawazahmed0/quran-api edition ara-quranindopak (Unlicense) -> data-raw/ext/indopak.json
Output: {"s:a": [word1, word2, ...]} only for ayahs whose words align exactly; others fall back to Uthmani in the app.
"""
import json, os, re, unicodedata
from collections import defaultdict
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ip = json.load(open(os.path.join(ROOT, "data-raw/ext/indopak.json"), encoding="utf8"))["quran"]
words = defaultdict(lambda: defaultdict(str))
for line in open(os.path.join(ROOT, "data-raw/quran-morphology.txt"), encoding="utf8"):
    loc, t = line.split("\t")[:2]
    s, v, w, g = map(int, loc.split(":"))
    words[(s, v)][w] += t
LET = re.compile("[\u0621-\u063F\u0641-\u064A\u0671-\u06D3]")  # Arabic letters, no tatweel
NORM = str.maketrans({"ٱ": "ا", "أ": "ا", "إ": "ا", "آ": "ا", "ى": "ي", "ی": "ي", "ۍ": "ي", "ے": "ي", "ئ": "ي", "ؤ": "و", "ة": "ه", "ۀ": "ه", "ہ": "ه", "ھ": "ه", "ک": "ك", "ء": "", "ٰ": ""})
def sk(t):
    t = "".join(c for c in t if LET.match(c)).translate(NORM)
    return t.replace("ا", "").replace("و", "").replace("ي", "")   # skeleton without long vowels/carriers (spelling differs between scripts)
out, bad = {}, []
for x in ip:
    k = (x["chapter"], x["verse"])
    toks = [t for t in x["text"].replace("‏", " ").split() if LET.search(t)]
    ours = [words[k][i] for i in sorted(words[k])]
    res, j, ok = [], 0, True
    for w in ours:
        target = sk(w)
        if j >= len(toks): ok = False; break
        cur = toks[j]; j += 1
        while sk(cur) != target and j < len(toks) and len(sk(cur)) < len(target):
            cur += toks[j]; j += 1
        if sk(cur) != target and not (len(target) > 2 and (sk(cur).startswith(target[:2]) and abs(len(sk(cur)) - len(target)) <= 1)):
            ok = False; break
        res.append(cur)
    if ok and j == len(toks): out[f"{k[0]}:{k[1]}"] = res
    else: bad.append(f"{k[0]}:{k[1]}")
json.dump(out, open(os.path.join(ROOT, "data/indopak.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
print(f"Indo-Pak aligned: {len(out)} of {len(ip)} ayahs; fallback to Uthmani for {len(bad)}: {bad[:15]}")
