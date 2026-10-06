"""Find where Dr. Israr starts explaining each ayah inside a Bayan-ul-Quran audio part.
Input: Whisper transcript (align/out/NNN.json, segments with times). He recites each ayah (in Arabic)
before explaining it, so we fuzzy-match each ayah's letters against the transcript and pick a
monotonic sequence of matches. Output: {"s:a": [part, seconds]} for confident matches only."""
import json, re, sys, os
DIAC = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭـ࣓-ࣿ]")
MAP = str.maketrans({"ٱ":"ا","أ":"ا","إ":"ا","آ":"ا","ى":"ي","ی":"ي","ے":"ي","ئ":"ي","ؤ":"و","ة":"ه","ۃ":"ه","ہ":"ه","ھ":"ه","ک":"ك","گ":"ك","ء":"","ٓ":""})
def norm(t): return re.sub(r"[^ء-ي]", "", DIAC.sub("", t).translate(MAP))
def grams(t, k=3): return {t[i:i+k] for i in range(len(t) - k + 1)}
def ayah_text(s, a, cache={}):
    if s not in cache: cache[s] = json.load(open(f"data/s/{s:03d}.json"))["ayahs"]
    return "".join(w[0] for w in cache[s][a - 1]["w"])
def align(tr, ranges):
    segs = tr["segs"]
    W = [norm(" ".join(x[2] for x in segs[i:i+3])) for i in range(len(segs))]   # 3-segment windows
    WG = [grams(w) for w in W]
    ayahs = []
    for (s, a1, a2) in ranges:
        for a in range(a1, a2 + 1): ayahs.append((s, a))
    # score[k][i]: share of the ayah's opening letters (first ~60 letters) found in window i
    sc = []
    for (s, a) in ayahs:
        g = grams(norm(ayah_text(s, a))[:60])
        sc.append([len(g & wg) / max(1, len(g)) for wg in WG])
    # DP: monotonic times; gap under 25s between consecutive picks is penalised (that is the
    # opening recitation of the whole passage, not the explanation)
    K, N, NEG = len(ayahs), len(segs), -1e9
    best = [[NEG] * N for _ in range(K)]; back = [[-1] * N for _ in range(K)]
    for i in range(N): best[0][i] = sc[0][i]
    for k in range(1, K):
        run, arg = NEG, -1
        for i in range(N):
            # candidates j < i ; keep a running max with gap penalty computed exactly over a short tail
            if i > 0 and best[k-1][i-1] > run: run, arg = best[k-1][i-1], i - 1
            v, b = run, arg
            if b >= 0 and segs[i][0] - segs[b][0] < 25: v -= 0.35
            best[k][i], back[k][i] = v + sc[k][i], b
    i = max(range(N), key=lambda x: best[K-1][x]); pick = [0] * K
    for k in range(K - 1, -1, -1): pick[k] = i; i = back[k][i]
    return [(ayahs[k], segs[pick[k]][0], round(sc[k][pick[k]], 2)) for k in range(K)]
if __name__ == "__main__":
    tr = json.load(open(sys.argv[1])); ranges = json.loads(sys.argv[2])
    for (sa, t, q) in align(tr, ranges): print(sa, f"{int(t//60)}:{int(t%60):02d}", q)
