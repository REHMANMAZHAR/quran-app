"""Transcribe Dr. Israr Bayan-ul-Quran parts (official tanzeem.org audio) with timestamps, for ayah alignment."""
import json, os, re, urllib.request, urllib.parse
from faster_whisper import WhisperModel
os.makedirs("align/out", exist_ok=True)
model = WhisperModel(os.environ.get("WMODEL", "small"), device="cpu", compute_type="int8")
for line in open("align/parts.txt"):
    line = line.strip()
    if not line or line.startswith("#"): continue
    n, fname = line.split(" ", 1)
    out = f"align/out/{int(n):03d}.json"
    if os.path.exists(out): continue
    url = "http://media.tanzeem.org/audios/004/04-198/" + urllib.parse.quote(fname)
    urllib.request.urlretrieve(url, "a.mp3")
    segs, info = model.transcribe("a.mp3", language="ur", beam_size=1, vad_filter=True, condition_on_previous_text=False)
    rows = [[round(s.start, 1), round(s.end, 1), s.text.strip()] for s in segs]
    json.dump({"n": int(n), "file": fname, "dur": info.duration, "segs": rows}, open(out, "w"), ensure_ascii=False)
    print(n, len(rows), info.duration, flush=True)
