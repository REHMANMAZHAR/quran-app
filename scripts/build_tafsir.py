"""Build data/tafsir/<id>/NNN.json from classical Arabic tafsir texts (public domain).
Source files: spa5k/tafsir_api (GitHub) -> data-raw/ext/tafsir/<slug>/<surah>.json (not committed; re-download with --fetch)
Output per surah: {"t": [unique texts], "a": [index into t for each ayah, -1 = none]}
"""
import json, os, re, sys, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOKS = {"jalalayn": "ar-tafsir-al-jalalayn", "ibnkathir": "ar-tafsir-ibn-kathir"}
for bid, slug in BOOKS.items():
    src = os.path.join(ROOT, "data-raw/ext/tafsir", slug); out = os.path.join(ROOT, "data/tafsir", bid)
    os.makedirs(src, exist_ok=True); os.makedirs(out, exist_ok=True); total = 0
    for s in range(1, 115):
        f = os.path.join(src, f"{s}.json")
        if not os.path.exists(f) and "--fetch" in sys.argv:
            urllib.request.urlretrieve(f"https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/{slug}/{s}.json", f)
        rows = sorted(json.load(open(f, encoding="utf8")), key=lambda x: x["ayah"])
        T, A, seen = [], [], {}
        for r in rows:
            t = re.sub(r"<[^>]+>", " ", r["text"] or ""); t = re.sub(r"[ \t]+", " ", t).strip()
            if not t: A.append(-1); continue
            if t not in seen: seen[t] = len(T); T.append(t)
            A.append(seen[t])
        json.dump({"t": T, "a": A}, open(os.path.join(out, f"{s:03d}.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
        total += os.path.getsize(os.path.join(out, f"{s:03d}.json"))
    print(f"{bid}: {total/1e6:.1f} MB")
