"""
Fetch Urdu word-by-word meanings from the Quran.com API (v4) and save them to
data-raw/wbw-ur.json as {"surah:ayah:word": "urdu meaning"}.

Run on your own PC (needs internet), then rebuild:

    pip install requests
    python scripts/fetch_urdu_wbw.py
    python scripts/build.py

Takes ~5 minutes (114 surahs, polite 0.3 s pause between calls).
Licence: Quran.com content - credit Quran.com in the app (build.py already does).
"""
import json
import os
import sys
import time

import requests

API = "https://api.quran.com/api/v4/verses/by_chapter/{s}"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data-raw", "wbw-ur.json")
EXPECTED_WORDS = 77429


def fetch_surah(s):
    out, page = {}, 1
    while True:
        r = requests.get(API.format(s=s), params={
            "language": "ur",
            "word_translation_language": "ur",
            "words": "true",
            "word_fields": "text_uthmani",
            "per_page": 50,
            "page": page,
        }, timeout=30)
        r.raise_for_status()
        d = r.json()
        for v in d["verses"]:
            for w in v["words"]:
                if w.get("char_type_name") != "word":
                    continue
                tr = (w.get("translation") or {})
                if tr.get("language_name", "").lower() != "urdu":
                    sys.exit(f"Got '{tr.get('language_name')}' instead of Urdu at {v['verse_key']} - API changed, check params.")
                out[f"{v['verse_key']}:{w['position']}"] = tr.get("text", "")
        nxt = d.get("pagination", {}).get("next_page")
        if not nxt:
            return out
        page = nxt
        time.sleep(0.3)


def main():
    allw = {}
    for s in range(1, 115):
        for attempt in range(3):
            try:
                allw.update(fetch_surah(s))
                break
            except requests.RequestException as e:
                print(f"surah {s} attempt {attempt + 1} failed: {e}")
                time.sleep(3)
        else:
            sys.exit(f"Stopped at surah {s}. Rerun the script.")
        print(f"surah {s:3d} done - {len(allw)} words")
        time.sleep(0.3)

    if len(allw) != EXPECTED_WORDS:
        print(f"WARNING: got {len(allw)} words, expected {EXPECTED_WORDS}. build.py will still use what it has.")
    with open(OUT, "w", encoding="utf8") as f:
        json.dump(allw, f, ensure_ascii=False)
    print(f"Saved {OUT}. Now run: python scripts/build.py")


if __name__ == "__main__":
    main()
