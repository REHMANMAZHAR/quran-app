"""
Urdu grammar notes generated from Quranic Arabic Corpus tags.

Every segment of every word carries a tag string (e.g. "V|PERF|VF:4|3MP").
There are only a few hundred unique tag combinations in the whole Quran, so
we write ONE Urdu explanation per combination. An aalim reviews the
combinations once (see data/grammar-templates-for-review.csv) and every word
in the Quran inherits a reviewed note.

STATUS: DRAFT - pending scholar review. Edit the tables below, rerun build.py.
"""

PERSON = {
    "1S": ("واحد متکلم", "میں"),
    "1P": ("جمع متکلم", "ہم"),
    "2MS": ("واحد مذکر حاضر", "تُو (ایک مرد)"),
    "2FS": ("واحد مؤنث حاضر", "تُو (ایک عورت)"),
    "2MD": ("تثنیہ مذکر حاضر", "تم دونوں"),
    "2FD": ("تثنیہ مؤنث حاضر", "تم دونوں (عورتیں)"),
    "2D": ("تثنیہ حاضر", "تم دونوں"),
    "2MP": ("جمع مذکر حاضر", "تم سب"),
    "2FP": ("جمع مؤنث حاضر", "تم سب (عورتیں)"),
    "3MS": ("واحد مذکر غائب", "وہ (ایک مرد)"),
    "3FS": ("واحد مؤنث غائب", "وہ (ایک عورت)"),
    "3MD": ("تثنیہ مذکر غائب", "وہ دونوں"),
    "3FD": ("تثنیہ مؤنث غائب", "وہ دونوں (عورتیں)"),
    "3D": ("تثنیہ غائب", "وہ دونوں"),
    "3MP": ("جمع مذکر غائب", "وہ سب"),
    "3FP": ("جمع مؤنث غائب", "وہ سب (عورتیں)"),
}

GENNUM = {
    "M": "مذکر", "F": "مؤنث",
    "MS": "مذکر، واحد", "FS": "مؤنث، واحد",
    "MD": "مذکر، تثنیہ (دو)", "FD": "مؤنث، تثنیہ (دو)", "D": "تثنیہ (دو)",
    "MP": "مذکر، جمع", "FP": "مؤنث، جمع",
}

CASE = {
    "NOM": "مرفوع — عموماً فاعل، مبتدا یا خبر",
    "ACC": "منصوب — عموماً مفعول، حال، یا إنّ کا اسم",
    "GEN": "مجرور — حرفِ جر کے بعد یا مضاف الیہ",
}

MOOD = {
    "MOOD:IND": "مرفوع (عام حالت)",
    "MOOD:SUBJ": "منصوب — أَنْ، لَنْ، کَيْ وغیرہ کی وجہ سے",
    "MOOD:JUS": "مجزوم — لَمْ، لائے نہی، لامِ امر یا شرط کی وجہ سے",
}

VERB_FORM = {
    "VF:1": "ثلاثی مجرد (فَعَلَ)",
    "VF:2": "بابِ تفعیل (فَعَّلَ) — اکثر شدت یا کسی سے کام کروانا",
    "VF:3": "بابِ مفاعلہ (فاعَلَ) — اکثر دوسرے کے ساتھ مل کر کام",
    "VF:4": "بابِ افعال (أَفْعَلَ) — اکثر کسی کو کچھ کروانا",
    "VF:5": "بابِ تفعّل (تَفَعَّلَ) — اکثر خود پر اثر لینا",
    "VF:6": "بابِ تفاعل (تَفاعَلَ) — اکثر باہم ایک دوسرے سے",
    "VF:7": "بابِ انفعال (انْفَعَلَ) — اکثر خود بخود ہو جانا",
    "VF:8": "بابِ افتعال (افْتَعَلَ)",
    "VF:9": "بابِ افعلال (افْعَلَّ) — رنگ یا عیب",
    "VF:10": "بابِ استفعال (اسْتَفْعَلَ) — اکثر طلب کرنا",
    "VF:11": "بابِ افعیلال (افْعالَّ)",
}

TENSE = {
    "PERF": "فعلِ ماضی — گزرا ہوا کام",
    "IMPF": "فعلِ مضارع — حال یا مستقبل کا کام",
    "IMPV": "فعلِ امر — حکم",
}

NOUN_TYPE = {
    "PN": "عَلَم (خاص نام)",
    "PRON": "ضمیر",
    "DEM": "اسمِ اشارہ (یہ / وہ)",
    "REL": "اسمِ موصول (جو / جس نے)",
    "T": "ظرفِ زمان (وقت بتاتا ہے)",
    "LOC": "ظرفِ مکان (جگہ بتاتا ہے)",
    "COND": "اسمِ شرط",
    "INTG": "اسمِ استفہام (سوالیہ)",
    "NV": "اسمِ فعل",
}

NOUN_FORM = {
    "ACT_PCPL": "اسمِ فاعل — کام کرنے والا",
    "PASS_PCPL": "اسمِ مفعول — جس پر کام ہوا",
    "VN": "مصدر — کام کا نام",
}

PARTICLE = {
    "P": "حرفِ جر — اس کے بعد والا اسم مجرور ہوتا ہے",
    "DET": "ال — حرفِ تعریف (اسم کو معرفہ بناتا ہے)",
    "CONJ": "حرفِ عطف — جوڑتا ہے (اور / پھر / یا)",
    "REM": "حرفِ استئناف — نئی بات شروع کرتا ہے",
    "NEG": "حرفِ نفی — نہیں",
    "EMPH": "لامِ تاکید — یقیناً، ضرور",
    "IMPV": "لامِ امر — چاہیے کہ",
    "PRP": "لامِ تعلیل — تاکہ / کی خاطر",
    "SUB": "حرفِ مصدری — بعد والے فعل کو مصدر کے معنی دیتا ہے (کہ)",
    "ACC": "حرفِ نصب — بعد والے اسم یا فعل کو منصوب کرتا ہے",
    "AMD": "حرفِ استدراک — لیکن",
    "ANS": "حرفِ جواب — ہاں / ضرور",
    "AVR": "حرفِ ردع — ہرگز نہیں",
    "CAUS": "حرفِ سببیت — تو، اس لیے",
    "CERT": "حرفِ تحقیق (قَدْ) — یقیناً / تحقیق",
    "CIRC": "واوِ حالیہ — اس حال میں کہ",
    "COM": "واوِ معیت — کے ساتھ",
    "EQ": "ہمزۂ تسویہ — برابر ہے کہ",
    "EXH": "حرفِ تحضیض — کیوں نہیں (ترغیب)",
    "EXL": "حرفِ تفصیل (أَمَّا) — رہا / جہاں تک",
    "EXP": "حرفِ استثناء — سوائے / مگر",
    "FUT": "حرفِ استقبال — عنقریب",
    "INC": "حرفِ ابتداء",
    "INT": "حرفِ تفسیر — یعنی",
    "PREV": "حرفِ کافّہ — پچھلے حرف کا عمل روک دیتا ہے",
    "PRO": "حرفِ نہی — نہ کرو",
    "RES": "حرفِ حصر — صرف / ہی",
    "RET": "حرفِ اضراب — بلکہ",
    "RSLT": "جوابِ شرط کا حرف — تو",
    "SUP": "حرفِ زائد — تاکید کے لیے",
    "SUR": "حرفِ مفاجات — اچانک",
    "VOC": "حرفِ ندا — اے",
    "ATT": "حرفِ تنبیہ — سنو / خبردار",
    "DIST": "لامِ بُعد — دوری کا اشارہ",
    "ADDR": "حرفِ خطاب — مخاطب کی طرف اشارہ",
    "INL": "حروفِ مقطعات — ان کا صحیح مطلب اللہ ہی جانتا ہے",
    "INTG": "حرفِ استفہام — کیا؟",
    "COND": "حرفِ شرط — اگر",
    "T": "ظرفِ زمان",
    "LOC": "ظرفِ مکان",
}

FAM = {
    "FAM:إِنّ": "إنّ اور اس کے اخوات — اسم کو منصوب اور خبر کو مرفوع کرتے ہیں",
    "FAM:كَان": "کانَ اور اس کے اخوات (افعالِ ناقصہ) — اسم مرفوع، خبر منصوب",
    "FAM:كَاد": "افعالِ مقاربہ — قریب ہونا",
}


def split_tags(tagstr):
    """'N|ROOT:رحم|LEM:رَحِيم|MS|GEN|ADJ' -> (pos, [tags without ROOT/LEM])."""
    parts = tagstr.split("|")
    pos = parts[0]
    rest = [t for t in parts[1:] if t and not t.startswith(("ROOT:", "LEM:"))]
    return pos, rest


def note(pos, tags):
    """Return (Urdu title, Urdu detail lines) for one segment's tag combination."""
    t = set(tags)
    lines = []
    if pos == "V":
        title = next((TENSE[x] for x in ("PERF", "IMPF", "IMPV") if x in t), "فعل")
        if "PASS" in t:
            lines.append("مجہول — کام کرنے والے کا ذکر نہیں")
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
        title = kind or (form.split(" — ")[0] if form else "اسم")
        if form and kind:
            lines.append(form)
        elif form:
            lines.append(form.split(" — ")[1])
        if "ADJ" in t:
            if title == "اسم":
                title = "اسمِ صفت"
            lines.append("صفت (نعت) — پہلے اسم کی خوبی بیان کرتا ہے")
        if "PRON" in t:
            lines.append("ضمیرِ متصل — لفظ کے آخر میں جڑی ہوئی" if "SUFF" in t else "ضمیرِ منفصل — الگ لکھی ہوئی")
        for x in tags:
            if x in PERSON:
                lines.append(f"{PERSON[x][0]} — {PERSON[x][1]}")
            elif x in GENNUM:
                lines.append(GENNUM[x])
        for x in tags:
            if x in CASE:
                lines.append(CASE[x])
        if "INDEF" in t:
            lines.append("نکرہ — غیر معین")
        return title, lines

    # particles
    ptype = next((x for x in tags if x in PARTICLE and x not in ("PREF", "SUFF")), None)
    if ptype is None:
        return "حرف", lines
    head = PARTICLE[ptype]
    title, _, meaning = head.partition(" — ")
    if meaning:
        lines.append(meaning)
    for x in tags:
        if x in FAM:
            lines.append(FAM[x])
    return title, lines


if __name__ == "__main__":
    for s in ["V|PERF|VF:4|3MP", "N|ROOT:رحم|LEM:رَحِيم|MS|GEN|ADJ",
              "P|P|PREF|LEM:ب", "N|PRON|SUFF|3MP", "P|ACC|FAM:إِنّ|LEM:إِنّ",
              "V|IMPF|VF:1|1P|MOOD:IND", "N|ACT_PCPL|VF:1|ROOT:ملك|LEM:مالِك|M|GEN"]:
        p, tg = split_tags(s)
        print(s, "=>", note(p, tg))
