# Quran — word by word (قرآن — لفظ بہ لفظ)

Free, ad-free Quran reader. Press and hold any word to see its meaning, how the
word is built (prefix / stem / suffix), the grammar of each part in Urdu, its
root, every other word from that root, and every place it appears in the Quran.
Reopens exactly where you stopped reading. Works offline once opened.

## Put it online (GitHub Pages, free)
1. Create a new public repo on GitHub, e.g. `quran-app`.
2. Upload everything in this folder (or `git init && git add . && git commit -m "v1" && git push`).
3. Repo → Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)` → Save.
4. In ~2 minutes it is live at `https://<your-username>.github.io/quran-app/`.
5. Open that link on your phone → browser menu → "Add to Home screen". It now behaves like an app.

## Add Urdu word-by-word meanings (do this once, on your PC)
```
pip install requests
python scripts/fetch_urdu_wbw.py     # ~5 min, saves data-raw/wbw-ur.json
python scripts/build.py              # rebuilds data/
python scripts/bundle_single.py      # optional: rebuilds dist/quran-app-single.html
```
Commit and push. The app switches word meanings to Urdu automatically
(English stays available in Settings).

## Get the grammar notes reviewed
`data/grammar-templates-for-review.csv` has 1,067 rows, sorted by how often each
appears. The top ~150 rows cover the large majority of words in the Quran.
Give it to an aalim (opens in Excel; Urdu displays correctly). They mark
`approved` Y/N and write corrections. Apply corrections in
`scripts/grammar_ur.py`, rerun `build.py`, push.

## Folder map
| Path | What it is |
|---|---|
| `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg` | The app |
| `data/` | Built data the app reads (one file per surah + index) |
| `data-raw/` | Original sources, untouched |
| `scripts/build.py` | Merges sources into `data/` |
| `scripts/grammar_ur.py` | Urdu grammar explanations (edit here) |
| `scripts/fetch_urdu_wbw.py` | Downloads Urdu word-by-word from Quran.com |
| `scripts/bundle_single.py` | Makes one self-contained HTML file in `dist/` |

## Recitation
Tap ▶ in the top bar (or any ayah number) to play. Words light up as the qari
recites them. 11 reciters, repeat ×1/×3/×5/∞, three speeds, Bismillah before
each surah (except Al-Fatiha and At-Tawbah). "لفظ سنیں" in the word sheet plays
that single word.

## Sources and licences
- Morphology: Quranic Arabic Corpus v0.4 (University of Leeds), corrected fork
  github.com/mustafa0x/quran-morphology. **GPL** — keep this credit, and keep the
  project open source.
- English word-by-word: Quran.com. Urdu word-by-word (after fetch): Quran.com.
- Urdu translations: Fateh Muhammad Jalandhry; Shaykh-ul-Hind Mahmood ul Hassan
  (both public domain). English: Pickthall (public domain). Via tanzil.net /
  fawazahmed0/quran-api.
- Recitation audio: everyayah.com (streamed, credit reciters + everyayah.com).
  Word timings: quran-align by Collin Fair, CC-BY 4.0 (data-raw/timing/).
  Word pronunciation audio: Quran.com CDN.
- Urdu grammar notes: written for this project, **draft until scholar review**.

## Next phases
Indo-Pak script option · Dr. Israr Ahmed audio (after MAKQ permission) · Mufradat / Lane's Lexicon dictionary entries ·
Pashto & Sindhi · grammar course built on this same data · Play Store wrapper.
