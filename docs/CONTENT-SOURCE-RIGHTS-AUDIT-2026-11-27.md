# QuranToSoul Content & Source Rights Audit

**Audit date:** 27 November 2026  
**Repository:** `REHMANMAZHAR/quran-app`  
**Audited ref:** default branch snapshot `93f299a21ab1292f6917e5237a28f8f136c7bb10`  
**Purpose:** Identify which existing content can remain, which needs a documented licence/provenance check, which should be replaced, and which should be linked externally. This is a technical source audit, not a legal opinion.

## Executive decision

Do not discard the application or delete historical datasets. Preserve the current data and Git history, but do not treat all existing content as cleared for public redistribution.

The recommended product model is:

1. **Ship only content with a documented, applicable reuse licence or verified public-domain status.**
2. **Use licensed online services only within their current display, caching, attribution and refresh terms.**
3. **Link to restricted books, translations, tafseer and audio at their official source instead of copying them.**
4. **Keep unverified or app-authored religious explanations out of the public experience until provenance and qualified review are recorded.**
5. **Maintain a source-and-rights record per content field/edition, not merely one row per website or book.**

No content files are deleted or rewritten by this audit.

## Status legend

- **GREEN — candidate to retain:** an identifiable licence or public-domain basis exists, subject to checking the exact version, attribution and licence obligations.
- **BLUE — link out:** display bibliographic/reference information and open the legitimate source; do not host the underlying text/audio.
- **YELLOW — hold:** source, edition, rights, derivation or scholarly review is incomplete.
- **RED — release blocker:** current implementation appears inconsistent with the source terms or public-facing claims.

## Inventory and recommended treatment

| Existing area / file | What the repository contains | Audit status | Recommended treatment |
|---|---|---|---|
| Quran Arabic text in `data/s/*.json` | Uthmani Arabic ayah/word text | GREEN candidate | Prefer the exact Tanzil text under Tanzil's stated conditions: verbatim, unchanged, attribution and source link. Verify that the actual committed text is the licensed Tanzil release and record its version/checksum. Do not silently normalize or alter Quran text. |
| Morphology and word segmentation: `data-raw/quran-morphology.txt`, derived fields in `data/s/*.json`, `data/extras.json` | Quranic Arabic Corpus v0.4 data, including tags, roots, lemmas and segmentation; README identifies corrected fork `mustafa0x/quran-morphology` | YELLOW | The repository says GPL, but no root `LICENSE` file is present and the scope of the upstream licence versus corrected fork/derived data is not documented. Verify exact upstream/fork licence and notices, preserve required notices/source, and obtain legal review of GPL obligations before redistribution. Do not claim that the Corpus licence automatically licenses all app code or other content. |
| English WBW: `data-raw/wbw-en.json`, `data/s/*.json`, derived vocab/senses/course | Quran.com word-by-word data plus project corrections (README/about) | RED | Do not redistribute the raw API export or derivatives in the public repo/app without a specific permitted basis. The Quran Foundation Developer Terms updated 20 Nov 2026 restrict redistribution of raw API content as datasets/downloadable files and public source repositories containing that content. Assess migration to a compliant live Content Sync integration, or link out. |
| Urdu WBW fetch: `scripts/fetch_urdu_wbw.py` and generated `data-raw/wbw-ur.json` | Script fetches Urdu word translations from Quran.com API v4 and writes a local JSON dataset | RED | Script's comment says credit is sufficient; that is not an adequate rights analysis. Disable public data generation/commit until a compliant integration is implemented. Do not store the returned content indefinitely. |
| Service-worker data cache: `sw.js` | Persistent `quran-data` Cache API for same-origin non-HTML/JS/CSS GET responses; retained across app updates | RED for Quran Foundation content | The cache can retain API-derived JSON indefinitely and does not implement a seven-day refresh policy. Separate content classes and cache only what the relevant licence permits. For any Quran Foundation Content Sync use, implement the current refresh/expiry requirements and do not use a public static dataset as a substitute. |
| Multi-edition ayah translations: `data/s/*.json` (fields include `ur`, `ur2`, `ur3`, `en`, `en2`) | Multiple Urdu and English translations, e.g. the sample Surah 1 file | YELLOW | Identify each translator, edition, source file and rights separately. Candidate older translations may be public domain in some jurisdictions, but author death date, applicable term, edition typography/notes and target markets must be checked. A claim in README that a translation is public domain is not sufficient evidence. Replace unverified editions with licensed sources or official links. |
| Ruku summaries: `data/ruku.json` | About 733 KB of Urdu and English explanatory summaries across ruku ranges | YELLOW | These are interpretive study summaries authored for the project, not neutral reference metadata. Keep out of public display pending author/ownership documentation and qualified scholarly review. Do not present them as tafseer or authoritative explanation. Safer replacement: ruku boundaries, ayah ranges and links to named source commentaries. |
| Learning course: `data/learn/course1.json` | 20 lessons with introductions, teaching tips, word meanings and ayah translations | YELLOW | Contains mixed material: project-authored instructional prose plus copied/derived word glosses and translations. Freeze public use. Split by field, establish authorship/source for each item, review religious/linguistic claims, and replace source-derived glosses with properly licensed content. |
| Vocabulary: `data/learn/vocab.json` | 1,000 ranked lemmas/roots/types and meanings in English, Urdu and Roman Urdu; builder reads Quran.com WBW data and morphology | RED/YELLOW | This is a derivative aggregation of Quran.com glosses plus morphology and project curation. Do not redistribute until rights for every input and transformation are established. Rebuild only from cleared sources. |
| Word senses: `data/learn/senses.json`, `data/learn/senses-ur.json` | Grouped senses/glosses and Quran references; Urdu values include multiple contextual renderings | RED/YELLOW | These are derived from word-by-word glosses and should not be assumed independent merely because they are regrouped. Keep private/disabled until underlying data is cleared; then regenerate only from licensed inputs. |
| Grammar notes: `scripts/grammar_ur.py`, `scripts/grammar_en.py`, generated grammar data | Project-authored explanations generated from Corpus tags | YELLOW | The scripts explicitly say draft/pending scholar review. Keep only with accurate draft labels and source attribution; record qualified reviewer, scope, date and exact version before calling them reviewed. Corpus tag data remains subject to its own licence. |
| Word-part glosses: `js/parts.js` | Hard-coded English/Urdu gloss tables for prefixes, particles and pronouns | YELLOW | Project-authored text, but it is linguistic/religious instructional content and has no item-level reviewer record. Retain as draft only after separating it from unlicensed base meanings; obtain review and versioned approval. |
| Root insights and hadith: `data/insights.json` | Root reflections and paraphrased hadith with collection/number references | YELLOW / RED for current presentation | The file itself says seeded for review and that hadith is paraphrased. Do not present paraphrases as direct hadith quotations or as verified scholarly commentary. Remove/disable from public display until exact hadith text, edition, grading source, translation rights and scholarly review are recorded. Safer interim replacement: reference-only links to the named hadith record. |
| Duas and labels: `scripts/build_extras.py`, `data/extras.json` | Selected ayah references with English/Urdu descriptions and contextual labels | YELLOW | Ayah references can be used as navigation metadata; the descriptions/labels are authored explanatory text and require provenance and review. Show the ayah reference and source text from a cleared translation instead of unverified paraphrases. |
| Classical tafseer: `scripts/build_tafsir.py`, `data/tafsir/**` when built | Downloads Jalalayn and Ibn Kathir JSON from `spa5k/tafsir_api`, strips HTML and stores text locally | RED/YELLOW | The builder's “public domain” comment is not sufficient evidence for the exact editions or upstream files. Do not fetch, bundle or publish until each edition's provenance, copyright term and upstream licence are established. Interim: link to official/legitimate editions and record surah/ayah/page references. |
| Dr Israr Ahmed / Bayan-ul-Quran | Official Tanzeem-e-Islami PDFs/audio and online listings | BLUE | Keep bibliographic record and official links. Do not download/rehost or extract and publish tafseer text without an applicable licence or written permission. |
| Maani-ul-Quran PDF | Uploaded 2013/1434 edition by Hafiz Salahuddin Yusuf, Darussalam branding | BLUE / YELLOW | Retain book metadata and link to the source. No clear reproduction permission was identified in the inspected pages; absence of a notice is not a public-domain licence. Do not publish extracted word meanings until rights holder/edition rights are established. |
| Recitation audio | Streams from EveryAyah, mp3quran.net and Quran.com; word audio from Quran.com CDN | YELLOW | Streaming rather than hosting does not itself establish permission. Verify provider/reciter terms for embedding, deep-linking, offline storage and commercial use. Until then use only official player/embed or links where provider terms permit. |
| Word timing: `data-raw/timing/**` | Quran-align timings; README identifies CC BY 4.0 | GREEN candidate | Retain with required attribution, licence link, source/version and modification notice where applicable. Verify the exact downloaded release and include attribution in app and repository. |
| Fonts / Mushaf assets | KFGQPC font, Noto fonts, Gulzar, DigitalKhatt/IndoPak assets | YELLOW | Keep only after recording the exact file/version and its own licence/terms. Do not infer that all assets share one licence. Preserve OFL/Waqf licence notices and any reserved-name/embedding requirements. |
| About/source claims: `about.html`, `README.md` | Claims including “free, non-commercial app”, GPL applies to app code, public-domain translations and scholar-review language | RED | Rewrite only after source register is complete. Avoid blanket claims that attribution or non-commercial status alone clears Quran.com content, that Corpus GPL covers the entire app, or that an edition is public domain without evidence. |
| Privacy: `privacy.html`, `functions/api/report.js` | Privacy page says everything stays on phone, but report endpoint stores submitted report text and optional email in Cloudflare D1 | RED release blocker (not copyright) | Correct the privacy statement and audit Cloudflare bindings, retention, access, deletion and analytics. GET admin access uses a query-string key; replace with a protected authenticated workflow before production. |

## Specific source replacement plan

### 1. Quran Arabic text
- Use a pinned Tanzil release under its published text licence.
- Keep text verbatim and unchanged.
- Store source URL, release/version, checksum, retrieval date and required attribution.
- Test all 114 surahs and ayah counts against the pinned release.

### 2. Word-by-word meanings
Preferred order:
1. Use Quran Foundation's supported API/Content Sync only if the exact endpoint and translation edition are covered and the integration obeys current display, attribution, refresh and caching conditions.
2. If no compliant Urdu edition is available, show a source/reference link rather than copying a book.
3. Add Maani-ul-Quran only after a documented licence, public-domain determination or written permission covers digital in-app reproduction.

Do not bundle Quran Foundation raw exports, derived gloss tables or API content in a public Git repository. Do not use the persistent generic JSON cache for content that requires a shorter refresh window.

### 3. Translations
- Create a separate record for every translator and edition.
- Verify author death date and applicable copyright term in each target jurisdiction.
- Check whether a modern publisher's typography, annotations, introductions or editorial changes are included.
- Prefer a translation whose publisher explicitly licenses digital redistribution; otherwise link out.
- Do not infer that the Tanzil Arabic text licence also licenses translation files.

### 4. Tafseer
- Interim product treatment: official source link plus bibliographic metadata and reference mapping.
- For Dr Israr Ahmed, link to Tanzeem-e-Islami's official Bayan-ul-Quran page/PDF/audio.
- For Jalalayn and Ibn Kathir, identify the exact Arabic edition/translator/editor and upstream data licence before local inclusion.
- No AI paraphrase or generated replacement tafseer.

### 5. Learning, summaries and hadith
- Keep the app's navigation, bookmarks, progress, search and study tools.
- Disable unverified summaries, course prose, root reflections and paraphrased hadith from public display pending source and scholar review.
- A review record must identify reviewer, qualifications/role, exact content IDs/version, decision, date and corrections. Never use “reviewed” as a blanket label without that evidence.
- For hadith, provide collection/book/chapter/number and link to a reliable source; do not imply that a paraphrase is the original matn.

## Release gates (must pass before publication)

- [ ] Source register entry exists for every dataset, edition, font, audio file and content field.
- [ ] Licence/permission evidence is archived and covers the actual intended use: public app, web, Android, offline cache, modifications, commercial use and target territories.
- [ ] Required attribution and notices appear in the app and repository.
- [ ] No restricted raw API dataset or derivative remains in public Git history/releases.
- [ ] Service-worker caching obeys each source's terms and refresh interval.
- [ ] Translation/tafseer edition and text provenance are exact and traceable.
- [ ] No unsupported “public domain”, “free to use”, “scholar-reviewed” or “verified” claims remain.
- [ ] Religious/linguistic review is recorded per content item/version where the UI makes interpretive claims.
- [ ] Privacy policy matches actual data flows; report endpoint has secure authentication and retention controls.
- [ ] Clean build and data-integrity tests pass; deployment is smoke-tested.

## Safe implementation sequence

**Phase 0 — Preserve and contain**
- Do not delete files or rewrite historical data.
- Do not run fetch/build scripts that download or regenerate restricted content.
- Keep this audit on a review branch; no production changes are made here.

**Phase 1 — Source register**
- Map every committed file and every field to a named source, edition, licence, retrieval date and checksum.
- Resolve the Quran Foundation content path and Corpus licence obligations.
- Correct the About page and README only after the evidence is assembled.

**Phase 2 — Compliant foundation**
- Pin and test Tanzil Arabic text.
- Implement compliant live Content Sync only for supported translations/content.
- Split service-worker caching by content licence and refresh rules.
- Keep external-source cards/links for restricted books and tafseer.

**Phase 3 — Content review and rebuild**
- Rebuild only from cleared sources.
- Remove unsupported review labels from the UI.
- Reintroduce project-authored learning material only after authorship, rights and scholar review are recorded.

**Phase 4 — Release verification**
- Fix reproducible build pipeline.
- Run dataset integrity checks, privacy/security review and browser/device smoke tests.
- Publish only after all release gates pass.

## Important limits of this audit

This audit inspects the default-branch source and selected data files. It does not establish ownership, prove public-domain status, inspect every binary/font/audio asset or every item in the Git history, verify live Cloudflare configuration, or replace legal advice. A file being publicly accessible, attributed, non-commercial, or missing a copyright notice does not by itself grant redistribution rights.

## Primary references to verify during implementation

- Tanzil text licence: https://tanzil.ca/docs/text_license
- Quran Foundation Developer Terms: https://api-docs.quran.com/legal/developer-terms/
- Quranic Arabic Corpus download/licence: https://corpus.quran.com/download/
- Tanzeem-e-Islami Bayan-ul-Quran: https://www.tanzeem.org/services/bayan-ul-quran-2/
- Pakistan Copyright Ordinance, 1962: https://pakistancode.gov.pk/
