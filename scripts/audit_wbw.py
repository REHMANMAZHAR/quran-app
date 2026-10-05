"""
Audit the word-by-word data and write a report to data/audit-report.csv.

    python scripts/audit_wbw.py            # after build.py

Checks (all automatic, every one of the 77,429 words):
  1. merged-phrase   two or more adjacent words in one ayah carry the SAME meaning
                     (Quran.com gives some phrases one gloss on every word,
                     e.g. 40:3 ذِى / ٱلطَّوْلِ "Owner (of) the abundance").
                     Runs for English AND Urdu (once wbw-ur.json exists).
  2. case-ending     corpus case tag (NOM/ACC/GEN) contradicts the written
                     ending of the word (ُ / َ / ِ, ذُو/ذَا/ذِى, ـاتُ ...).
                     Known grammatical exceptions are skipped (manqūṣ nouns,
                     diptotes, muqaddar before ـِى, sound plurals, duals, mabnī).
  3. empty           a word with no meaning in a language.

Anything flagged here goes to data-raw/wbw-en-fixes.json, wbw-ur-fixes.json
or morphology-fixes.json after checking, then build.py again.
"""
import csv
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
RAW = os.path.join(ROOT, "data-raw")

VOWEL = {"\u064F": "u", "\u064C": "u", "\u08F1": "u", "\u064E": "a", "\u064B": "a", "\u08F0": "a",
         "\u0650": "i", "\u064D": "i", "\u08F2": "i", "\u0652": "0"}
FIXED = {"قَبْل", "بَعْد", "حَيْث", "لَدُن", "أَيّ", "كَم", "اللَّه", "الْآن", "أَمْس", "هُنَا"}
# Flagged by the ending check but grammatically correct (checked 2026-10-05):
# manqūṣ nouns (قَاضٍ، ٱلدَّاعِ …), ذَوِى/أُو۟لِى (ـِى = ACC or GEN), duals ذَوَا/ذَوَاتَا/سَٰحِرَٰنِ (NOM),
# يَٰجِبَالُ (vocative, mabnī on ḍamma in place of naṣb), رُبَّ (particle).
REVIEWED_OK = set("""2:177:23 2:179:5 2:197:28 4:59:8 5:95:21 5:100:12 5:106:13 7:41:7 7:195:7 9:113:11 10:83:17 13:9:5 15:2:1 17:5:9 17:97:5 18:17:27 20:63:4 20:72:14 22:54:16 24:22:9 34:10:6 35:1:9 38:45:6 54:6:5 55:24:2 55:48:1 59:2:39 65:10:8 69:20:4 73:11:3 75:27:3""".split())
EXPECT = {"u": {"NOM"}, "a": {"ACC", "GEN"}, "i": {"GEN"}}


def last_vowel(t):
    for ch in reversed(t):
        if ch in VOWEL:
            return VOWEL[ch]
    return None


def letters(t):
    return re.sub(r"[^\u0621-\u064A\u0671]", "", t)


def main():
    meta = json.load(open(os.path.join(DATA, "meta.json"), encoding="utf8"))
    tags = [g[2] if len(g) > 2 else "" for g in meta["grammar"]]
    with open(os.path.join(DATA, "grammar-templates-for-review.csv"), encoding="utf-8-sig") as f:
        key_of = {int(r["id"]): r["corpus_tags"] for r in csv.DictReader(f)}
    rows = []
    for s in range(1, 115):
        sj = json.load(open(os.path.join(DATA, "s", f"{s:03d}.json"), encoding="utf8"))
        for v, ay in enumerate(sj["ayahs"], 1):
            ws = ay["w"]
            for lang, col in (("en", 1), ("ur", 3)):
                if lang == "ur" and not any(w[col] for w in ws):
                    continue
                for i, w in enumerate(ws):
                    if not w[col].strip():
                        rows.append([f"{s}:{v}:{i+1}", w[0], "empty", lang, "", ""])
                    if i and w[col].strip() and w[col].strip() == ws[i - 1][col].strip():
                        rows.append([f"{s}:{v}:{i+1}", ws[i - 1][0] + " " + w[0], "merged-phrase", lang, w[col], ""])
            for i, w in enumerate(ws):
                segs = w[4]
                for j, (text, ci, li, role) in enumerate(segs):
                    parts = key_of.get(ci, "").split("|")
                    if role or not parts or parts[0] != "N" or "PRON" in parts or "PN" in parts or "DEM" in parts or "REL" in parts:
                        continue
                    case = next((c for c in ("NOM", "ACC", "GEN") if c in parts), None)
                    lem = meta["lemmas"][li][0] if li >= 0 else ""
                    if not case or lem in FIXED:
                        continue
                    nxt = segs[j + 1] if j + 1 < len(segs) else None
                    if nxt and "1S" in key_of.get(nxt[1], ""):
                        continue
                    bl, lv = letters(text), last_vowel(text)
                    if lem != "ذُو" and re.search(r"(ي|ى|ا|ون|ين|ان)$", bl):
                        continue
                    if lv in (None, "0"):
                        continue
                    if re.search("[\u0670ا]ت[^\u0621-\u064A]*$", text) and lv == "i":
                        continue
                    if case not in EXPECT[lv] and f"{s}:{v}:{i+1}" not in REVIEWED_OK:
                        rows.append([f"{s}:{v}:{i+1}", w[0], "case-ending", "", case, f"ends in {lv}-vowel"])
    out = os.path.join(DATA, "audit-report.csv")
    with open(out, "w", newline="", encoding="utf-8-sig") as f:
        wr = csv.writer(f)
        wr.writerow(["location", "arabic", "check", "lang", "value", "note"])
        wr.writerows(rows)
    from collections import Counter
    print(Counter((r[2], r[3]) for r in rows))
    print("report:", out)


if __name__ == "__main__":
    main()
