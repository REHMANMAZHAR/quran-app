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
URDU = {"ہے","کے","کی","میں","اور","کہ","نہیں","سے","تو","یہ","وہ","کا","ہیں","گا","گے","ہو","تھا","تھے","جو","پر","لیے","لئے","بھی","ہم","آپ","اس","ان"}
def is_urdu(t): return sum(1 for x in t.split() if x in URDU) >= 2
def align(tr, ranges, PEN=0.35):
    """Each ayah: the window whose letters best match the ayah's opening. Picks are in order; two picks with
    no Urdu speech between them are penalised (that is the passage recited in one go, not the explanation)."""
    segs = tr["segs"]; N = len(segs)
    W = [norm(" ".join(x[2] for x in segs[i:i+2])) for i in range(N)]   # 2-segment windows
    WG = [grams(w) for w in W]
    UR = [is_urdu(x[2]) for x in segs]
    ayahs = [(s, a) for (s, a1, a2) in ranges for a in range(a1, a2 + 1)]
    sc = []
    for (s, a) in ayahs:
        txt = norm(ayah_text(s, a)); g = grams(txt[:45])
        sc.append([len(g & wg) / max(1, len(g)) for wg in WG])
    K, NEG = len(ayahs), -1e9
    best = [[NEG] * N for _ in range(K)]; back = [[-1] * N for _ in range(K)]
    for i in range(N): best[0][i] = sc[0][i]
    for k in range(1, K):
        pm, pa = NEG, -1          # max of best[k-1][0..lastU-1]  (an Urdu segment lies between: no penalty)
        rm, ra = NEG, -1          # max of best[k-1][lastU..i-1]   (no Urdu between: penalty)
        for i in range(N):
            if i > 0:
                j = i - 1; v = best[k-1][j]
                if UR[j]:          # segment j is Urdu: everything before j now has Urdu between it and i
                    if rm > pm: pm, pa = rm, ra
                    rm, ra = NEG, -1
                    if v > pm: pm, pa = v, j   # j itself is Urdu speech, then i: treat as separated
                elif v > rm: rm, ra = v, j
            c1, c2 = pm, rm - PEN
            if c1 >= c2: best[k][i], back[k][i] = c1 + sc[k][i], pa
            else: best[k][i], back[k][i] = c2 + sc[k][i], ra
    i = max(range(N), key=lambda x: best[K-1][x]); pick = [0] * K
    for k in range(K - 1, -1, -1): pick[k] = i; i = back[k][i]
    out = []
    for k in range(K):
        i = pick[k]; out.append((ayahs[k], segs[i][0], round(sc[k][i], 2)))
    return out
def build(parts_json="data/tafsir/ur-parts.json", src="align/out", dst="data/tafsir/ur-times.json", MIN=0.2):
    MIN = float(MIN)
    """parts: [[n,s1,a1,s2,a2,file],...]. Writes {"s:a":[part, seconds, exact(1)/approx(0)]}."""
    parts, res, stats = json.load(open(parts_json)), {}, [0, 0]
    meta = json.load(open("data/meta.json"))
    for P in parts:
        n, s1, a1, s2, a2 = P[:5]; f = f"{src}/{n:03d}.json"
        if not s1 or not os.path.exists(f): continue
        ranges = []
        for s in range(s1, s2 + 1):
            cnt = meta["surahs"][s - 1]["ayahs"]
            ranges.append((s, a1 if s == s1 else 1, min(a2, cnt) if s == s2 else cnt))
        prev = 0.0
        for (s, a), t, q in align(json.load(open(f)), ranges):
            ok = q >= MIN and t >= prev
            if ok: prev = t
            stats[0 if ok else 1] += 1
            res[f"{s}:{a}"] = [n, max(0, round((t if ok else prev) - 2, 1)), 1 if ok else 0]
    json.dump(res, open(dst, "w"), separators=(",", ":"))
    print("ayahs matched", stats[0], "approx", stats[1])
if __name__ == "__main__" and sys.argv[1:2] == ["build"]: build(*sys.argv[2:]); sys.exit()
if __name__ == "__main__":
    tr = json.load(open(sys.argv[1])); ranges = json.loads(sys.argv[2])
    for (sa, t, q) in align(tr, ranges): print(sa, f"{int(t//60)}:{int(t%60):02d}", q)
