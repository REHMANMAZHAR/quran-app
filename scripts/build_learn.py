"""Build data/learn/vocab.json: the top 1,000 Quran base words (aalim-reviewed) for Learn (flashcards, games).
Run after build.py:  python scripts/build_learn.py
"""
import json, re, sys
from collections import Counter, defaultdict
sys.path.insert(0,__import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from build import clean_gloss
ROOTDIR=__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.abspath(__file__)))
R=ROOTDIR+'/data-raw/'
en=json.load(open(R+'wbw-en.json',encoding='utf8'))
fix=json.load(open(R+'wbw-en-fixes.json',encoding='utf8'))
gloss={k:(fix[k]['to'] if k in fix else v[0]).strip() for k,v in en.items()}
tl={k:v[1] for k,v in en.items()}
words=defaultdict(list)
for line in open(R+'quran-morphology.txt',encoding='utf8'):
    loc,t,p,tg=line.rstrip('\n').split('\t'); s,v,w,g=map(int,loc.split(':'))
    words[(s,v,w)].append((t,p,tg.split('|')))
ayahs=defaultdict(list)
for (s,v,w),segs in sorted(words.items()):
    ayahs[(s,v)].append(''.join(x[0] for x in segs))
assert len(words)==77429, len(words)
CONJ_LEAD=re.compile(r"^(?:and|so|then|but|or|nor|indeed|surely|verily|certainly)\s+",re.I)
N_LEAD=re.compile(r"^(?:and|so|then|but|or|nor|indeed|surely|verily|certainly|by|for|with|in|on|to|from|of|the|a|an|your|their|his|her|our|my|its|is|are|was|were|be)\s+",re.I)
V_LEAD=re.compile(r"^(?:and|so|then|but|or|nor|indeed|surely|verily|certainly|he|she|they|we|i|you|it|will|would|did|do|does|not)\s+",re.I)
def lemma_gloss(g,p):
    g=re.sub(r"\[[^\]]*\]|\([^)]*\)"," ",g); g=re.sub(r"\s+"," ",g).strip(" ,.;:'\"")
    rx={'N':N_LEAD,'V':V_LEAD}.get(p,CONJ_LEAD)
    prev=None
    while prev!=g and g:
        prev=g; ng=rx.sub("",g); g=ng if ng else g
    g=g.strip()
    if p=='V':
        g2=re.sub(r"\s+(?:you|them|him|her|it|us|me|you all|them all)$","",g,flags=re.I)
        g=g2 or g
    if p=='N':
        g2=re.sub(r"^(?:any|every)\s+(?=\w)","",g,flags=re.I) if g.lower() not in ('every','any') else g
        g=g2 or g
    return g
def stem_of(segs):
    for i,(t,p,tg) in enumerate(segs):
        if 'PREF' not in tg and 'SUFF' not in tg: return i
    return None
PMAP=[('P','Preposition'),('CONJ','Conjunction'),('NEG','Negative particle'),('COND','Conditional particle'),('INTG','Question particle'),('EMPH','Emphasis particle'),('REM','Resumption particle'),('SUB','Subordinating particle'),('ACC','Particle (inna & sisters)'),('VOC','Vocative particle'),('RES','Restriction particle'),('CERT','Particle of certainty (qad)'),('FUT','Future particle'),('EXP','Exception particle'),('AMD','Amendment particle'),('ANS','Answer particle'),('RET','Retraction particle'),('INC','Inceptive particle'),('SUR','Surprise particle'),('PRO','Prohibition particle'),('EXL','Explanation particle'),('CAUS','Particle of cause'),('CIRC','Circumstantial particle'),('PREV','Preventive particle'),('RSLT','Result particle'),('SUP','Supplemental particle'),('EXH','Exhortation particle'),('INT','Interpretation particle'),('AVR','Aversion particle'),('INL','Quranic initials'),('ATT','Attention particle'),('EQ','Equalization particle')]
PRON={'1S':('أَنَا / ـِي','I / me / my'),'1P':('نَحْنُ / ـنَا','we / us / our'),'2MS':('أَنتَ / ـكَ','you / your (one man)'),'2FS':('أَنتِ / ـكِ','you / your (one woman)'),
'2MP':('أَنتُمْ / ـكُمْ','you / your (plural)'),'2FP':('أَنتُنَّ / ـكُنَّ','you / your (plural, women)'),'2D':('أَنتُمَا / ـكُمَا','you / your (two)'),
'3MS':('هُوَ / ـهُ','he / him / his / it'),'3FS':('هِيَ / ـهَا','she / her / it'),'3MP':('هُمْ / ـهُمْ','they / them / their'),'3FP':('هُنَّ / ـهُنَّ','they / them / their (women)'),
'3D':('هُمَا / ـهُمَا','they / them / their (two)'),'3MD':('هُمَا / ـهُمَا','they / them / their (two)'),'3FD':('هُمَا / ـهُمَا','they / them / their (two)')}
PRON_MEAN={v[0]:v[1] for v in PRON.values()}
CURATED={'هَل':('is…? / does…? (yes-no question)',''),'لَم':('did not (+ present verb)',''),'لَن':('will never',''),
'قَد':('certainly / already',''),'لَيْسَ':('is not',''),'غَيْر':('other than / not',''),'إِنّ':('indeed / surely',''),
'بَل':('rather / nay',''),'لَعَلّ':('so that / perhaps',''),'الَّذِي':('who / the one who / that which','those who (plural)'),
'لَمّا':('when (+ past) / not yet (+ present)',''),'إِذ':('when (in the past)',''),'إِذا':('when (+ future sense) / suddenly','')}
REVIEW={'أَتَى':'came','دَعا':'called / invoked','عَمِلَ':'did / worked (deeds)','سَأَلَ':'asked','صَبَرَ':'was patient / endured',
'اتَّقَى':'feared (Allah) / was mindful','عَلِمَ':'knew','كانَ':'was / is','شاءَ':'willed','نَظَرَ':'looked','ذَكَرَ':'remembered / mentioned',
'خافَ':'feared','أَرادَ':'intended / wanted','اتَّبَعَ':'followed','اتَّخَذَ':'took (as)','خَيْر':'good / better','عَبْد':'servant / slave',
'زَوْج':'spouse / pair','بَعْض':'some / part','آخِر':'last / the Hereafter','لَدُن':'from / near (with)','قَضَى':'decreed / judged',
'ضَرَبَ':'struck / set forth (an example)','أَقامَ':'established','تَلَى':'recited / followed','مَسَّ':'touched','حَسِبَ':'thought',
'شَكَرَ':'was grateful / thanked','أُدْخِلَ':'admitted / made to enter','شَهِدَ':'witnessed / testified','أَرَيْ':'showed',
'أَشْرَكَ':'associated partners (with Allah)','أَصابَ':'befell / struck','تابَ':'repented / turned (in mercy)','أَحْبَبْ':'loved',
'جَزَى':'rewarded / recompensed','عَلِيم':'All-Knowing','مُشْرِك':'polytheist (one who associates partners)','خالِد':'abiding forever',
'جَنَّة':'garden / Paradise','حَمْد':'praise','تَعالَى':'exalted (is He)','رَقَبَة':'neck (freeing a slave)','مُدْبِر':'turning back / fleeing',
'سارَ':'traveled','جَرَيْ':'flowed','أَنزَلَ':'sent down / revealed'}
ROM={1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII'}
def wtype(p,tg):
    if p=='V':
        vf=next((int(x[3:]) for x in tg if x.startswith('VF:')),None)
        return f"Verb (Form {ROM.get(vf,vf)})" if vf else 'Verb'
    if p=='N':
        for k,lab in [('PN','Proper noun'),('PRON','Pronoun'),('DEM','Demonstrative'),('REL','Relative pronoun'),('ACT_PCPL','Active participle'),('PASS_PCPL','Passive participle'),('VN','Verbal noun'),('ADJ','Adjective'),('T','Time adverb'),('LOC','Place adverb'),('NV','Verbal interjection'),('COND','Conditional noun'),('INTG','Question word')]:
            if k in tg: return lab
        return 'Noun'
    for k,lab in PMAP:
        if k in tg: return lab
    return 'Particle'
occ=defaultdict(list)
FX=json.load(open(R+'lemma-fixes.json',encoding='utf8')); BYL=FX['by_lemma']; SPL=FX['splits']
RST={}
for k,segs in words.items():
    i=stem_of(segs)
    t,p,tg=segs[i]
    lem=next((x[4:] for x in tg if x.startswith('LEM:')),None)
    if lem is None and 'INL' in tg:
        lem=t
    elif lem is None:
        pgn=next((x for x in tg if x in PRON),None)
        assert 'PRON' in tg and pgn, (k,t,tg)
        lem=PRON[pgn][0]
    root=next((x[5:] for x in tg if x.startswith('ROOT:')),'')
    bare = all(j==i or ('PREF' in segs[j][2] and ('DET' in segs[j][2] or 'ATT' in segs[j][2])) or any(x in segs[j][2] for x in ('DIST','ADDR')) for j in range(len(segs)))
    fk=lem+'|'+root
    if fk in SPL:
        parts=SPL[fk]; ay=f"{k[0]}:{k[1]}"
        part=next((x for x in parts if x['ayahs'] and ay in x['ayahs']),parts[-1]); lem=part['key']
    elif fk in BYL and BYL[fk].get('merge_into'):
        lem,root=BYL[fk]['merge_into'].split('|')
    occ[(lem,root)].append((k,p,tg,bare))
total=sum(len(v) for v in occ.values()); assert total==77429
rows=[]
for (lem,root),L in occ.items():
    types=Counter(wtype(p,tg) for _,p,tg,_ in L)
    typ=types.most_common(1)[0][0]
    tiers=[Counter(),Counter(),Counter()]; disp={}
    for k,p,tg,bare in L:
        g=lemma_gloss(gloss[f"{k[0]}:{k[1]}:{k[2]}"],p)
        if not g: continue
        key=g.lower(); disp.setdefault(key,Counter())[g]+=1
        ideal=(p=='V' and 'PERF' in tg and '3MS' in tg and 'PASS' not in tg) or (p!='V' and bare and not any(x in tg for x in ('MP','FP','MD','FD','P','D')))
        if ideal: tiers[0][key]+=1
        if bare or ideal: tiers[1][key]+=1
        tiers[2][key]+=1
    def show(key):
        d=disp[key].most_common(1)[0][0]
        if typ!='Proper noun' and d.split(' ')[0] not in ('Allah','Lord','He','His','Him','Quran') and not d[1:2].isupper(): d=d[:1].lower()+d[1:]
        return d
    src='Quran.com word-by-word, base form'
    if lem in PRON_MEAN:
        main=PRON_MEAN[lem]; others=[]; src='Standard grammar (pronoun)'
    elif lem in REVIEW:
        main=REVIEW[lem]; src='Quran.com glosses, base meaning set in review'
        pool=tiers[1] if tiers[1] else tiers[2]; tot=sum(pool.values()) or 1
        others=[]
    elif lem in CURATED:
        main,o=CURATED[lem]; others=[o] if o else []; src='Standard grammar (function word)'
    else:
        t0=next((t for t in tiers if t),Counter())
        main=show(t0.most_common(1)[0][0]) if t0 else ''
        pool=tiers[1] if tiers[1] else tiers[2]
        tot=sum(pool.values()) or 1
        others=[]
        for key,c in pool.most_common(8):
            if key==main.lower() or c/tot<0.08 or len(key.split())>3 or key.startswith('o ') or key in ('salih','abu','those'): continue
            others.append(show(key))
            if len(others)==2: break
    conf='High' if src!='Quran.com word-by-word, base form' else ('High' if (lambda t0: t0 and sum(t0.values())>=3 and t0.most_common(1)[0][1]/sum(t0.values())>=0.5)(next((t for t in tiers if t),None)) else 'Check')
    # example: earliest bare occurrence in an ayah of <=12 words, else earliest bare, else earliest
    cand=sorted(L,key=lambda x:x[0])
    def gm(c): return lemma_gloss(gloss[f"{c[0][0]}:{c[0][1]}:{c[0][2]}"],c[1]).lower()==main.lower()
    ex=next((c for c in cand if c[3] and gm(c) and len(ayahs[c[0][:2]])<=12),None) or next((c for c in cand if c[3] and len(ayahs[c[0][:2]])<=12),None) or next((c for c in cand if c[3]),None) or cand[0]
    k=ex[0]; key=f"{k[0]}:{k[1]}:{k[2]}"
    fk=lem+'|'+root; head=lem; also=''; rv=RST.get(fk,('',''))
    review,rnote=rv
    if '#' in lem:
        base=lem.split('#')[0]
        sp=next(x for parts in SPL.values() for x in parts if x['key']==lem)
        head=sp['headword']; main=sp['meaning']; also=sp['also']; others=[]; review='Fix'; rnote='Split by aalim review: '+sp['meaning']; src='Aalim review'; conf='Reviewed'
    elif fk in BYL:
        d=BYL[fk]; head=d.get('headword',lem); typ=d.get('type',typ)
        if d.get('meaning'): main=d['meaning']; others=[]; src='Aalim review'
        also=d.get('also',''); review=d.get('review',review) or review; rnote=d.get('review_note',rnote); conf='Reviewed'
    elif review=='OK': conf='Reviewed'
    rows.append(dict(head=head,also=also,review=review,rnote=rnote,conf=conf,src=src,lem=lem,root=' '.join(root),type=typ,count=len(L),main=main,others='; '.join(others),
        ref=f"{k[0]}:{k[1]}",word=''.join(x[0] for x in words[k]),wgloss=gloss[key],tl=tl[key],ayah=' '.join(ayahs[k[:2]]),pos=k[2]))
rows.sort(key=lambda r:(-r['count'],r['lem']))
import os
out=[]
for i,r in enumerate(rows[:1000],1):
    s_,a_=map(int,r['ref'].split(':'))
    out.append([i,r['head'],r['root'],r['type'],r['count'],r['main'],r['also'] or (r['others'] if isinstance(r['others'],str) else '; '.join(r['others'])),s_,a_,r['pos'],r['word'],r['wgloss']])
os.makedirs(ROOTDIR+'/data/learn',exist_ok=True)
json.dump({'total':total,'fields':['rank','head','root','type','count','meaning','also','s','a','w','word','gloss'],'words':out},
          open(ROOTDIR+'/data/learn/vocab.json','w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
print('learn vocab:',len(out),'words; top 125 cover',round(sum(x[4] for x in out[:125])/total*100,1),'%')
