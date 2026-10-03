"""
English grammar notes generated from Quranic Arabic Corpus tags.
Mirrors grammar_ur.py: one explanation per unique tag combination.
Arabic grammar terms are given in transliteration so learners meet them early.

STATUS: DRAFT - pending scholar review.
"""

PERSON = {
    "1S": ("1st person singular", "I"),
    "1P": ("1st person plural", "we"),
    "2MS": ("2nd person masculine singular", "you (one man)"),
    "2FS": ("2nd person feminine singular", "you (one woman)"),
    "2MD": ("2nd person masculine dual", "you two"),
    "2FD": ("2nd person feminine dual", "you two (women)"),
    "2D": ("2nd person dual", "you two"),
    "2MP": ("2nd person masculine plural", "you all"),
    "2FP": ("2nd person feminine plural", "you all (women)"),
    "3MS": ("3rd person masculine singular", "he"),
    "3FS": ("3rd person feminine singular", "she"),
    "3MD": ("3rd person masculine dual", "they two"),
    "3FD": ("3rd person feminine dual", "they two (women)"),
    "3D": ("3rd person dual", "they two"),
    "3MP": ("3rd person masculine plural", "they"),
    "3FP": ("3rd person feminine plural", "they (women)"),
}

GENNUM = {
    "M": "masculine", "F": "feminine",
    "MS": "masculine, singular", "FS": "feminine, singular",
    "MD": "masculine, dual (two)", "FD": "feminine, dual (two)", "D": "dual (two)",
    "MP": "masculine, plural", "FP": "feminine, plural",
}

CASE = {
    "NOM": "Nominative (marfūʿ) — usually subject, topic or predicate",
    "ACC": "Accusative (manṣūb) — usually object, circumstance, or noun of inna",
    "GEN": "Genitive (majrūr) — after a preposition, or second part of a possessive",
}

MOOD = {
    "MOOD:IND": "Indicative (marfūʿ) — the normal form",
    "MOOD:SUBJ": "Subjunctive (manṣūb) — because of an, lan, kay, etc.",
    "MOOD:JUS": "Jussive (majzūm) — because of lam, prohibitive lā, imperative lām, or a condition",
}

VERB_FORM = {
    "VF:1": "Form I (faʿala) — the basic verb",
    "VF:2": "Form II (faʿʿala) — often intensive or causing something",
    "VF:3": "Form III (fāʿala) — often doing with or to someone",
    "VF:4": "Form IV (afʿala) — often making someone do something",
    "VF:5": "Form V (tafaʿʿala) — often reflexive of Form II",
    "VF:6": "Form VI (tafāʿala) — often mutual, with each other",
    "VF:7": "Form VII (infaʿala) — often passive or happening by itself",
    "VF:8": "Form VIII (iftaʿala)",
    "VF:9": "Form IX (ifʿalla) — colours and defects",
    "VF:10": "Form X (istafʿala) — often seeking or considering",
    "VF:11": "Form XI (ifʿālla)",
}

TENSE = {
    "PERF": "Perfect verb (fiʿl māḍī) — completed action",
    "IMPF": "Imperfect verb (fiʿl muḍāriʿ) — present or future action",
    "IMPV": "Imperative verb (fiʿl amr) — a command",
}

NOUN_TYPE = {
    "PN": "Proper noun (ʿalam)",
    "PRON": "Pronoun (ḍamīr)",
    "DEM": "Demonstrative (ism ishāra) — this / that",
    "REL": "Relative pronoun (ism mawṣūl) — who / which",
    "T": "Time adverb (ẓarf zamān)",
    "LOC": "Place adverb (ẓarf makān)",
    "COND": "Conditional noun (ism sharṭ)",
    "INTG": "Interrogative noun (ism istifhām)",
    "NV": "Verbal noun of command (ism fiʿl)",
}

NOUN_FORM = {
    "ACT_PCPL": "Active participle (ism fāʿil) — the one who does",
    "PASS_PCPL": "Passive participle (ism mafʿūl) — the one it is done to",
    "VN": "Verbal noun (maṣdar) — the name of the action",
}

PARTICLE = {
    "P": "Preposition (ḥarf jarr) — the noun after it is genitive",
    "DET": "Definite article al- — makes the noun definite (the)",
    "CONJ": "Conjunction (ḥarf ʿaṭf) — joins (and / then / or)",
    "REM": "Resumption particle (istiʾnāf) — starts a new statement",
    "NEG": "Negative particle (nafy) — not",
    "EMPH": "Emphatic lām (lām al-tawkīd) — surely",
    "IMPV": "Imperative lām (lām al-amr) — let ...",
    "PRP": "Purpose lām (lām al-taʿlīl) — so that / for",
    "SUB": "Subordinating particle (ḥarf maṣdarī) — that",
    "ACC": "Accusative particle (ḥarf naṣb) — makes the next word accusative",
    "AMD": "Amendment particle (istidrāk) — but",
    "ANS": "Answer particle (jawāb) — yes / indeed",
    "AVR": "Aversion particle (radʿ) — by no means",
    "CAUS": "Particle of cause (sababiyya) — so / therefore",
    "CERT": "Particle of certainty (qad) — certainly / indeed",
    "CIRC": "Circumstantial wāw (wāw al-ḥāl) — while",
    "COM": "Comitative wāw (wāw al-maʿiyya) — along with",
    "EQ": "Equalisation particle (taswiya) — it is the same whether",
    "EXH": "Exhortation particle (taḥḍīḍ) — why not",
    "EXL": "Explanation particle (ammā) — as for",
    "EXP": "Exceptive particle (istithnāʾ) — except",
    "FUT": "Future particle (istiqbāl) — will / soon",
    "INC": "Inceptive particle (ibtidāʾ)",
    "INT": "Interpretation particle (tafsīr) — that is",
    "PREV": "Preventive particle (kāffa) — cancels the effect of the previous particle",
    "PRO": "Prohibition particle (nahy) — do not",
    "RES": "Restriction particle (ḥaṣr) — only",
    "RET": "Retraction particle (iḍrāb) — rather / nay",
    "RSLT": "Result particle (jawāb al-sharṭ) — then",
    "SUP": "Supplemental particle (zāʾid) — for emphasis",
    "SUR": "Surprise particle (mufājaʾa) — suddenly",
    "VOC": "Vocative particle (nidāʾ) — O",
    "ATT": "Attention particle (tanbīh) — behold / listen",
    "DIST": "Distance lām (lām al-buʿd) — points to something far",
    "ADDR": "Address particle (khiṭāb) — points to the one addressed",
    "INL": "Disconnected letters (ḥurūf muqaṭṭaʿāt) — their true meaning is known only to Allah",
    "INTG": "Interrogative particle (istifhām) — is? / do?",
    "COND": "Conditional particle (sharṭ) — if",
    "T": "Time adverb (ẓarf zamān)",
    "LOC": "Place adverb (ẓarf makān)",
}

FAM = {
    "FAM:إِنّ": "Inna and its sisters — make the subject accusative and the predicate nominative",
    "FAM:كَان": "Kāna and its sisters (incomplete verbs) — subject nominative, predicate accusative",
    "FAM:كَاد": "Verbs of approximation (kāda) — to be about to",
}


def note(pos, tags):
    """Return (English title, detail lines) for one segment's tag combination."""
    t = set(tags)
    lines = []
    if pos == "V":
        title = next((TENSE[x] for x in ("PERF", "IMPF", "IMPV") if x in t), "Verb")
        if "PASS" in t:
            lines.append("Passive — the doer is not mentioned")
        for x in tags:
            if x in VERB_FORM:
                lines.append(VERB_FORM[x])
            elif x in PERSON:
                lines.append(f"{PERSON[x][0]} — {PERSON[x][1]}")
            elif x in MOOD:
                lines.append(MOOD[x])
            elif x in FAM:
                lines.append(FAM[x])
        return title, lines

    if pos == "N":
        kind = next((NOUN_TYPE[x] for x in tags if x in NOUN_TYPE), None)
        form = next((NOUN_FORM[x] for x in tags if x in NOUN_FORM), None)
        title = kind or (form.split(" — ")[0] if form else "Noun (ism)")
        if form and kind:
            lines.append(form)
        elif form:
            lines.append(form.split(" — ")[1])
        if "ADJ" in t:
            if title == "Noun (ism)":
                title = "Adjective (ṣifa)"
            lines.append("Adjective (naʿt) — describes the noun before it")
        if "PRON" in t:
            lines.append("Attached pronoun — joined to the end of the word" if "SUFF" in t else "Separate pronoun")
        for x in tags:
            if x in PERSON:
                lines.append(f"{PERSON[x][0]} — {PERSON[x][1]}")
            elif x in GENNUM:
                lines.append(GENNUM[x])
        for x in tags:
            if x in CASE:
                lines.append(CASE[x])
        if "INDEF" in t:
            lines.append("Indefinite (nakira)")
        return title, lines

    ptype = next((x for x in tags if x in PARTICLE and x not in ("PREF", "SUFF")), None)
    if ptype is None:
        return "Particle (ḥarf)", lines
    title, _, meaning = PARTICLE[ptype].partition(" — ")
    if meaning:
        lines.append(meaning)
    for x in tags:
        if x in FAM:
            lines.append(FAM[x])
    return title, lines
