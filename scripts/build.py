"""
Build the app data from data-raw/ into data/.

    python scripts/build.py

Inputs (data-raw/):
  quran-morphology.txt     Quranic Arabic Corpus v0.4, corrected fork (GPL)
  wbw-en.json              English word-by-word (Quran.com data)
  wbw-ur.json              OPTIONAL Urdu word-by-word, made by fetch_urdu_wbw.py
  ur-jalandhry.json        Urdu, Fateh Muhammad Jalandhry (public domain)
  ur-mahmoodulhassan.json  Urdu, Shaykh-ul-Hind Mahmood ul Hassan (public domain)
  en-pickthall.json        English, Pickthall (public domain)
  surahs.json, juz.json    metadata

Outputs (data/):
  meta.json                surahs, juz, grammar notes, roots, lemmas
  occ.json                 every occurrence of every lemma (for "all occurrences")
  s/001.json ... 114.json  one file per surah
  grammar-templates-for-review.csv   the sheet the aalim reviews
"""
import csv
import json
import os
import re
from collections import Counter, defaultdict

from grammar_ur import note, split_tags

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data-raw")
OUT = os.path.join(ROOT, "data")


def load(name):
    with open(os.path.join(RAW, name), encoding="utf8") as f:
        return json.load(f)


def ayah_map(name, clean=False):
    m = {}
    for r in load(name)["quran"]:
        t = r["text"].strip()
        if clean:
            t = re.sub(r"\s*\[[^\]]*\]", "", t).strip()
        m[(r["chapter"], r["verse"])] = t
    return m


def main():
    os.makedirs(os.path.join(OUT, "s"), exist_ok=True)

    # ---- English word-by-word + transliteration
    wbw_en, translit = {}, {}
    for key, (en, tl) in load("wbw-en.json").items():  # {"s:a:w": [english, transliteration]}
        k = tuple(map(int, key.split(":")))
        wbw_en[k] = en.strip()
        translit[k] = tl.strip()

    wbw_ur = {}
    if os.path.exists(os.path.join(RAW, "wbw-ur.json")):
        for key, txt in load("wbw-ur.json").items():
            s, v, w = map(int, key.split(":"))
            wbw_ur[(s, v, w)] = txt.strip()
        print(f"Urdu word-by-word loaded: {len(wbw_ur)} words")
    else:
        print("No data-raw/wbw-ur.json yet - run scripts/fetch_urdu_wbw.py on your PC")

    ur_j = ayah_map("ur-jalandhry.json")
    ur_m = ayah_map("ur-mahmoodulhassan.json", clean=True)
    en_p = ayah_map("en-pickthall.json")

    # ---- Morphology: words -> segments
    combos, combo_idx = [], {}
    roots, root_idx = [], {}
    lemmas, lemma_idx = [], {}
    lemma_root = {}
    combo_count = Counter()
    combo_example = {}
    words = defaultdict(list)  # (s,v,w) -> [(text, tagstr)]

    with open(os.path.join(RAW, "quran-morphology.txt"), encoding="utf8") as f:
        for line in f:
            loc, text, pos, tags = line.rstrip("\n").split("\t")
            s, v, w, _seg = map(int, loc.split(":"))
            words[(s, v, w)].append((text, pos, tags))

    def get_combo(pos, tags):
        p, rest = split_tags(f"{pos}|{tags}")
        key = p + "|" + "|".join(rest)
        if key not in combo_idx:
            title, lines = note(p, rest)
            combo_idx[key] = len(combos)
            combos.append([title, lines, key])
        return combo_idx[key]

    surah_words = defaultdict(lambda: defaultdict(list))
    lemma_gloss = defaultdict(Counter)
    occ = defaultdict(list)

    for (s, v, w), segs in sorted(words.items()):
        out_segs, stem_lemma = [], -1
        for text, pos, tags in segs:
            parts = tags.split("|")
            root = next((t[5:] for t in parts if t.startswith("ROOT:")), None)
            lem = next((t[4:] for t in parts if t.startswith("LEM:")), None)
            ci = get_combo(pos, tags)
            combo_count[ci] += 1
            combo_example.setdefault(ci, f"{s}:{v}:{w}")
            li = -1
            if lem:
                lk = (lem, pos)
                if lk not in lemma_idx:
                    lemma_idx[lk] = len(lemmas)
                    lemmas.append([lem, pos])
                li = lemma_idx[lk]
                if root:
                    if root not in root_idx:
                        root_idx[root] = len(roots)
                        roots.append(root)
                    lemma_root[li] = root_idx[root]
                if "PREF" not in parts and "SUFF" not in parts:
                    stem_lemma = li
            role = "p" if "PREF" in parts else ("s" if "SUFF" in parts else "")
            out_segs.append([text, ci, li, role])
        k = (s, v, w)
        ar = "".join(x[0] for x in out_segs)
        en = wbw_en.get(k, "")
        if stem_lemma >= 0:
            bare = all(x[3] == "" for x in out_segs)  # no prefix/suffix -> cleaner gloss
            lemma_gloss[stem_lemma][en] += 10 if bare else 1
            occ[stem_lemma].append(f"{s}:{v}:{w}")
        surah_words[s][v].append([ar, en, translit.get(k, ""), wbw_ur.get(k, ""), out_segs, stem_lemma])

    # ---- lemma table: [lemma, pos, rootIdx, count, common gloss]
    lemma_rows = []
    for i, (lem, pos) in enumerate(lemmas):
        g = lemma_gloss[i].most_common(1)
        lemma_rows.append([lem, pos, lemma_root.get(i, -1), len(occ[i]), g[0][0] if g else ""])

    root_lemmas = defaultdict(list)
    for i, r in lemma_root.items():
        root_lemmas[r].append(i)
    root_rows = [[r, sum(len(occ[i]) for i in root_lemmas[ri]), sorted(root_lemmas[ri], key=lambda i: -len(occ[i]))]
                 for ri, r in enumerate(roots)]

    surahs = load("surahs.json")
    juz = [[s, a] for s, a, j in load("juz.json") if j <= 30]

    meta = {
        "surahs": surahs,
        "juz": juz,
        "grammar": [[c[0], c[1]] for c in combos],
        "roots": root_rows,
        "lemmas": lemma_rows,
        "sources": {
            "morphology": "Quranic Arabic Corpus v0.4 (University of Leeds, GPL) - corrected fork by mustafa0x",
            "wbw_en": "Quran.com word-by-word English",
            "wbw_ur": "Quran.com word-by-word Urdu" if wbw_ur else "",
            "ur1": "Fateh Muhammad Jalandhry",
            "ur2": "Shaykh-ul-Hind Mahmood ul Hassan",
            "en": "Marmaduke Pickthall",
            "grammar": "Urdu grammar notes: DRAFT pending scholar review",
        },
    }
    dump(meta, "meta.json")
    dump({str(k): v for k, v in occ.items()}, "occ.json")

    for s in range(1, 115):
        ayahs = []
        for v in sorted(surah_words[s]):
            ayahs.append({
                "w": surah_words[s][v],
                "ur": ur_j.get((s, v), ""),
                "ur2": ur_m.get((s, v), ""),
                "en": en_p.get((s, v), ""),
            })
        dump({"n": s, "ayahs": ayahs}, f"s/{s:03d}.json")

    # ---- review sheet for the aalim
    with open(os.path.join(OUT, "grammar-templates-for-review.csv"), "w", newline="", encoding="utf-8-sig") as f:
        wr = csv.writer(f)
        wr.writerow(["id", "corpus_tags", "occurrences", "example_word", "urdu_title", "urdu_explanation", "approved (Y/N)", "correction"])
        for i, (title, lines, key) in sorted(enumerate(combos), key=lambda x: -combo_count[x[0]]):
            wr.writerow([i, key, combo_count[i], combo_example[i], title, " | ".join(lines), "", ""])

    print(f"words={len(words)} grammar_templates={len(combos)} roots={len(roots)} lemmas={len(lemmas)}")


def dump(obj, name):
    with open(os.path.join(OUT, name), "w", encoding="utf8") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    main()
