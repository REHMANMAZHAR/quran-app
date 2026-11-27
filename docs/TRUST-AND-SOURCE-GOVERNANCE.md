# QuranToSoul Trust and Source Governance

**Status:** Adopted project policy  
**Scope:** Application content, datasets, links, media, metadata, documentation and release decisions.

## 1. Product boundary

QuranToSoul is a reference-first Quran access, navigation and learning-support platform. It is not an author or publisher of new Quranic meanings, translations, tafseer, hadith explanations, grammar explanations, religious rulings or other original religious content.

**No new religious content is to be authored or generated for the application.** QuranToSoul may organise source references, bibliographic metadata, stable identifiers, citations, links and navigation to original sources. It may display source material only when its provenance, attribution, integrity and applicable publication/reuse rights are documented and approved.

This applies equally to human-written and AI-generated material.

## 2. Prohibited content work

Do not:
- Write, invent, paraphrase, translate, summarise or expand Quranic word meanings.
- Author new Quranic translations, tafseer, asbab al-nuzul explanations, grammar/i'rab explanations, root explanations, hadith explanations, dua translations, ruku summaries or religious lessons.
- Generate religious content with AI and present it as source material or scholarly authority.
- Silently edit source text. Preserve the source version and record any normalisation separately; perform technical transformations only when permitted and documented.
- Label an item “reviewed”, “verified” or “scholar approved” unless a named, qualified reviewer reviewed that exact item/version and the record is retained.
- Treat public availability, a downloadable file or API access as permission to republish.
- Add new word meanings or translations as part of feature development.

## 3. Permitted product work

The application may build:
- Quran navigation by surah, ayah, juz, ruku, page and other verified location references.
- Search and indexes that identify source records without reproducing protected explanatory content.
- Bibliographic metadata: author, title, publisher, edition, volume, page, ayah range, hadith collection/number, source URL, language, publication date and licence/permission status.
- Links, deep links, embeds and referrals to original publishers or authorised hosts, subject to their terms.
- User-owned bookmarks, notes and reading progress stored locally.
- Reader controls and audio navigation, provided underlying assets are lawfully sourced.
- Source discrepancy reports that point to editions/pages without inventing a religious conclusion.

## 4. Source and rights register

Every source/dataset must have a register entry containing:
1. Source ID and content category.
2. Exact title, author/compiler/translator and publisher/rights holder.
3. Edition, publication date and version where known.
4. Original canonical URL or official publisher URL.
5. Specific content used and exact location identifiers.
6. Licence name/version and full terms URL, or written permission evidence.
7. Whether hosting, redistribution, modification, caching, offline use, commercial use and derivative indexing are permitted.
8. Required attribution and notices.
9. Integrity method: checksum/version, unchanged-source confirmation or documented permitted transformation.
10. Status: `unverified`, `reference-only`, `permission-pending`, `approved-for-display`, `restricted` or `retired`.
11. Reviewer, review date and next review date.
12. Public behaviour: display, link-out, embed or disabled.

An attribution line alone does not establish reuse rights. A licence for one dataset does not grant rights to other datasets bundled alongside it.

## 5. Existing repository inventory

The current repository contains or references:
- Quran text and Mushaf/page assets.
- English and Urdu word-by-word datasets and translations.
- Morphology, grammar tags, root/lemma data and corrections.
- Hadith datasets and tafseer datasets.
- Learning/course material, vocabulary, root insights and ruku summaries.
- Recitation audio, word-level audio and timing data.
- Fonts, icons and other third-party assets.
- External video/audio services and source links.

Each category must be assessed independently. Particular attention is required for Quran.com API-derived word-by-word data; existing translations and corrections; Quranic Arabic Corpus morphology and its corrected fork; hadith text/translations/grades; tafseer and derived segmentation; grammar templates, “why this meaning” notes, root insights and summaries; audio, fonts and Mushaf assets.

## 6. Publication gates

A content item may be published only when:
- Source identity and exact edition are known.
- The source is authoritative for the type of material being cited.
- Rights permit the exact proposed display, or an official link/embed is used instead.
- Content integrity is checked against the identified source.
- Citation is visible and resolves to the exact source/edition/location where possible.
- No original religious explanation has been added by QuranToSoul.
- Review status is truthful and supported by a retained record.
- Privacy, security and accessibility requirements are met.

If a gate fails, default to **reference-only or disabled**, not “publish and fix later”.

## 7. Existing content: freeze, assess, then decide

Do not delete existing content automatically. Freeze additions, inventory current material, assess provenance and rights, and disable or remove public copies only through a reviewed, reversible change. Preserve source snapshots and change logs. Existing repository presence does not prove that content is approved for public redistribution.

## 8. Trust and technical controls

- Correct the privacy policy to match actual reports, analytics, hosting logs, external audio/video/font services and speech-recognition behaviour.
- Protect report administration; do not put secrets in URL query strings.
- Apply least-privilege access, rate limits, retention limits and deletion procedures to reports.
- Add automated build, data-integrity, link, offline and browser tests.
- Keep source snapshots and change logs so content updates are traceable.
- Separate application-code licensing from third-party content and asset licensing.
- Do not claim the entire repository is open source under one licence unless every included asset permits that statement.

## 9. Immediate work order

1. Freeze new authored religious-content work and new word-meaning/translation additions.
2. Inventory every dataset and external source in the repository.
3. Establish the source/rights register and classify each item.
4. Audit the published privacy and About/source pages.
5. Correct misleading review badges and unsubstantiated claims.
6. Audit existing datasets for provenance, integrity and permitted use.
7. Secure the report API and verify operational Cloudflare configuration.
8. Add automated checks and a release approval gate.
9. Decide which existing content can remain displayed, must link out or must be disabled.

## 10. Release acceptance criteria

A release is not trust-ready until:
- Every displayed religious dataset has a documented source and permission/licence basis for its exact use.
- Reference-only material links to the original source and is not copied into the app.
- No new religious explanations, translations or word meanings have been introduced.
- Review labels accurately reflect the actual review process.
- Privacy statements match real application/backend behaviour.
- Administrative endpoints are protected.
- Build and data-integrity checks pass.
- The release has a documented change log and rollback path.

## 11. Important limitation

This policy does not establish that any current dataset is licensed or approved. All existing content remains subject to the inventory and rights review. Creating this policy does not delete or alter production data.
