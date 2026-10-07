"""Build data/words.json: Urdu gloss per lemma (most common word-by-word meaning)
and a Roman-letter index (consonant skeleton of each word's transliteration -> lemma ids),
so search works for Roman Urdu / English spellings like "rehmat", "sabar", "zikr"."""
import json, re, unicodedata, collections, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def skel(s):
    s = s.lower()
    for a, b in [("th", "s"), ("dh", "z"), ("ḍ", "z"), ("ẓ", "z"), ("ḥ", "h"), ("ṣ", "s"), ("ṭ", "t"), ("q", "k"), ("v", "w"), ("ph", "f"), ("ee", "i"), ("oo", "u")]:
        s = s.replace(a, b)
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if c.isascii() and c.isalpha())
    out, prev = [], ""
    for c in s:
        if c in "aeiou": prev = c; continue
        if c in "wy" and prev in ("a", "e", "o", "u", "i") and prev: prev = c; continue
        if out and out[-1] == c: prev = c; continue
        out.append(c); prev = c
    return "".join(out)
if __name__ == "__main__":
    meta = json.load(open(f"{ROOT}/data/meta.json"))
    nl = len(meta["lemmas"])
    ur = [collections.Counter() for _ in range(nl)]
    sk = collections.defaultdict(collections.Counter)
    for n in range(1, 115):
        d = json.load(open(f"{ROOT}/data/s/{n:03d}.json"))
        for A in d["ayahs"]:
            for w in A["w"]:
                st = w[5]
                if st is None or st < 0: continue
                if w[3]: ur[st][w[3].strip()] += 1
                tl = w[2] or ""
                dash = tl.split("-")
                parts = {tl} | set(dash) | set(re.split(r"[-']", tl))
                for p in parts:
                    k = skel(p)
                    if len(k) >= 2: sk[k][st] += 1
    lemUr = [(c.most_common(1)[0][0] if c else "") for c in ur]
    index = {k: [li for li, _ in v.most_common(6)] for k, v in sk.items()}
    json.dump({"lemUr": lemUr, "sk": index}, open(f"{ROOT}/data/words.json", "w"), ensure_ascii=False, separators=(",", ":"))
    print(len(index), "skeletons;", sum(1 for x in lemUr if x), "lemmas with Urdu")
    for q in ["rehmat", "sabar", "zikr", "jannat", "taqwa", "yaum", "ilm", "rahman", "khair", "dunya", "ramazan"]:
        print(q, skel(q), [meta["lemmas"][i][0] for i in index.get(skel(q), [])][:4])
