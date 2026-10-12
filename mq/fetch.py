import json, re, requests
S = requests.Session(); S.headers["User-Agent"] = "QuranToSoul/1.0 (qurantosoul.com)"
# 1) ayah timings for full-surah reciters (mp3quran read ids)
for rid in [225, 221, 12]:
    sur = []
    for s in range(1, 115):
        j = S.get(f"https://mp3quran.net/api/v3/ayat_timing?surah={s}&read={rid}", timeout=60).json()
        sur.append([[x["start_time"], x["end_time"]] for x in sorted(j, key=lambda x: x["ayah"]) if x["ayah"] >= 1])
    json.dump(sur, open(f"mq/t{rid}.json", "w"), separators=(",", ":"))
# 2) search the full reciter lists for the Qaris RMK asked for
pats = ["oosi", "ossi", "awsi", "turki", "kurdi", "shorb", "shurb", "far", "muqit", "moqit", "muqeet", "mazen", "mazin", "mosad", "mossad", "masad", "abkar", "abkr",
        "العوسي", "التركي", "الكردي", "الشوربجي", "الفار", "المقيط", "المازن", "مسعد", "أبكر"]
found = []
for lang in ["eng", "ar"]:
    for r in S.get(f"https://mp3quran.net/api/v3/reciters?language={lang}", timeout=60).json()["reciters"]:
        if any(p in r["name"].lower() for p in pats):
            found.append({"id": r["id"], "lang": lang, "name": r["name"], "moshaf": [{"id": m["id"], "name": m["name"], "server": m["server"], "total": m["surah_total"]} for m in r["moshaf"]]})
json.dump(found, open("mq/found.json", "w"), ensure_ascii=False, indent=1)
print(len(found))
