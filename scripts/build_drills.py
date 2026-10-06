"""Build data/learn/drills.json: practice items for the Learning Path and grammar lessons.
Every answer comes from the Quranic Arabic Corpus tags already in data/s/*.json + meta.json
(never hand-typed), so the exercises are as accurate as the corpus.
Item: [surah, ayah, word, class, before, word_text, after, gloss, lemma_rank]."""
import json, random, re, os, collections
random.seed(7)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = json.load(open(f"{ROOT}/data/meta.json"))
G = M["grammar_en"]; LEM = M["lemmas"]; ROOTS = M["roots"]
rank = {}
for i, l in enumerate(sorted(range(len(LEM)), key=lambda k: -LEM[k][3])): rank[l] = i + 1
lem_root = {}
for ri, r in enumerate(ROOTS):
    for li in r[2]: lem_root[li] = ri

def feats(g): return G[g][1]
def has(g, s): return any(s in f for f in feats(g))
def pos(g): return G[g][0]
PERSON = [("3rd person masculine singular", "he"), ("3rd person feminine singular", "she"), ("3rd person masculine plural", "they"),
          ("3rd person feminine plural", "they_f"), ("1st person plural", "we"), ("1st person singular", "I"),
          ("2nd person masculine singular", "you1"), ("2nd person masculine plural", "youpl")]
def person(g):
    for k, v in PERSON:
        if has(g, k): return v
FORMS = ["Form I ", "Form II ", "Form III ", "Form IV ", "Form V ", "Form VI ", "Form VII ", "Form VIII ", "Form IX ", "Form X "]
def form(g):
    for i, f in enumerate(FORMS):
        if has(g, f.strip() + " (") or any(x.startswith(f.strip() + " (") or x == f.strip() + " (iftaʿala)" for x in feats(g)): return ["I","II","III","IV","V","VI","VII","VIII","IX","X"][i]
PREFIX = {"وَ": "wa", "فَ": "fa", "بِ": "bi", "لِ": "li", "كَ": "ka", "سَ": "sa", "لَ": "la"}
DIAC = re.compile(r"[ً-ٰٟۖ-ۭ]")
def bare(t): return DIAC.sub("", t)

S = {k: collections.defaultdict(list) for k in ["kind3", "tense", "person", "case", "number", "defin", "prefix", "suffix", "ptc", "form", "mood", "voice", "root"]}
for s in range(1, 115):
    d = json.load(open(f"{ROOT}/data/s/{s:03d}.json"))
    for a, A in enumerate(d["ayahs"], 1):
        W = A["w"]
        for i, w in enumerate(W):
            segs = w[4]; stem = next((x for x in segs if x[3] == ""), None)
            if not stem: continue
            g = stem[1]; p = pos(g); lr = rank.get(w[5], 99999)
            ctx = [" ".join(x[0] for x in W[max(0, i - 3):i]), w[0], " ".join(x[0] for x in W[i + 1:i + 4]), w[1], lr]
            add = lambda k, c: S[k][c].append([s, a, i + 1] + [c] + ctx)
            isV = "verb" in p.lower() and "Verbal noun" not in p
            isN = not isV and any(x in p for x in ["Noun (ism)", "Adjective", "participle", "Verbal noun (maṣdar)", "Proper noun"])
            isP = not isV and not isN and "Pronoun" not in p and "Demonstrative" not in p and "Relative" not in p and "adverb" not in p and "noun" not in p.lower() and len(segs) == 1
            if isV: add("kind3", "fil")
            elif isN: add("kind3", "ism")
            elif isP: add("kind3", "harf")
            if isV:
                t = "past" if p.startswith("Perfect") else "present" if p.startswith("Imperfect") else "command" if p.startswith("Imperative") else None
                if t: add("tense", t)
                pr = person(g)
                if pr and not has(g, "Passive"): add("person", pr)
                f = form(g)
                if f: add("form", f)
                if p.startswith("Imperfect"):
                    m = "jussive" if has(g, "Jussive") else "subj" if has(g, "Subjunctive") else "ind" if has(g, "Indicative") else None
                    if m: add("mood", m)
                if p.startswith("Perfect") or p.startswith("Imperfect"): add("voice", "passive" if has(g, "Passive") else "active")
            if isN and "Proper" not in p:
                c = "nom" if has(g, "Nominative") else "acc" if has(g, "Accusative") else "gen" if has(g, "Genitive") else None
                if c: add("case", c)
                n = "dual" if has(g, "dual") else "plural" if has(g, "plural") else "singular" if has(g, "singular") else None
                if n: add("number", n)
                if any(x[3] == "p" and pos(x[1]).startswith("Definite") for x in segs): add("defin", "def")
                elif has(g, "Indefinite"): add("defin", "indef")
                if "Active participle" in p: add("ptc", "doer")
                elif "Passive participle" in p: add("ptc", "done")
                elif "Verbal noun" in p: add("ptc", "action")
            npre = sum(1 for x in segs if x[3] == "p" and PREFIX.get(x[0][:2]) and len(bare(x[0])) == 1)
            nsuf = sum(1 for x in segs if x[3] == "s" and pos(x[1]).startswith("Pronoun"))
            for x in segs:
                if x[3] == "p" and npre == 1:
                    b = PREFIX.get(x[0][:2]); sp = pos(x[1])
                    ok = {"wa": "Conjunction" in sp or "Resumption" in sp, "fa": "Conjunction" in sp or "Resumption" in sp or "cause" in sp or "Result" in sp,
                          "bi": "Preposition" in sp, "li": "Preposition" in sp, "ka": "Preposition" in sp, "sa": "Future" in sp, "la": "Emphatic" in sp}
                    if b and len(bare(x[0])) == 1 and ok.get(b): add("prefix", b)
                if x[3] == "s" and pos(x[1]).startswith("Pronoun") and nsuf == 1:
                    pr = person(x[1])
                    if pr: add("suffix", pr)
            if (isN or isV) and w[5] in lem_root and lr < 3000: add("root", lem_root[w[5]])

out = {}
for k, D in S.items():
    items = []
    keys = list(D.keys())
    if k == "root":   # one item per common lemma, answer = root index
        seen = set(); allit = [x for v in D.values() for x in v]; allit.sort(key=lambda x: x[8])
        for x in allit:
            lem = x[8]
            if lem in seen: continue
            seen.add(lem); items.append(x)
            if len(items) >= 450: break
        out[k] = {"classes": [], "items": items}
        continue
    for c in keys:
        L = D[c]; L.sort(key=lambda x: x[8])           # most frequent words first
        easy = L[: min(len(L), 35)]; rest = L[35:]
        pick = easy + random.sample(rest, min(len(rest), 35))
        items += pick
    out[k] = {"classes": keys, "items": items}
out["roots"] = [r[0] for r in ROOTS]
json.dump(out, open(f"{ROOT}/data/learn/drills.json", "w"), ensure_ascii=False, separators=(",", ":"))
print({k: (len(v["items"]), {c: len(S[k][c]) for c in v["classes"]}) for k, v in out.items() if k != "roots"})
print(os.path.getsize(f"{ROOT}/data/learn/drills.json") // 1024, "KB")
