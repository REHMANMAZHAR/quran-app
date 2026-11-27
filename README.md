# QuranToSoul — Quran reference and reading application

QuranToSoul is a free, ad-free Quran reading and reference application. The current application includes reader navigation, Arabic display options, recitation controls, word-level navigation and other study utilities.

Live site: https://qurantosoul.com  
Repository: https://github.com/REHMANMAZHAR/quran-app

## Product content policy

QuranToSoul follows a **reference-first** policy.

- Do not author or generate new Quranic words, word meanings, translations, tafseer, hadith explanations, grammar explanations, religious rulings or other original religious content.
- The project may organise source references, bibliographic metadata, citations, stable identifiers and links to original sources.
- Display source material only when its exact provenance, attribution, integrity and applicable reuse rights are documented and approved.
- Where rights are unclear, use an official source link or embed instead of copying the content.
- Public availability, API access or an attribution line does not by itself establish permission to redistribute.
- Do not label content reviewed or verified unless the exact item/version has a retained review record.
- Existing datasets are under source and rights review. Their presence in this repository is not proof that they are approved for public redistribution.

See [Trust and Source Governance](docs/TRUST-AND-SOURCE-GOVERNANCE.md).

## Repository structure

| Path | Purpose |
|---|---|
| `index.html` | Main application |
| `js/` | Application modules |
| `css/` | Stylesheets |
| `data/` | Built application datasets; source and rights status varies and is under review |
| `data-raw/` | Input/source datasets and corrections; source and rights status varies and is under review |
| `scripts/` | Data build, audit and bundling scripts |
| `functions/api/report.js` | Cloudflare Pages Function for mistake reports |
| `privacy.html` | Current privacy statement; pending reconciliation against deployed data flows |
| `about.html` | Current source and attribution statement; pending source/rights audit |

## Build pipeline

The repository's full build sequence is:

```bash
python scripts/build_all.py
```

This runs the repository's data-build scripts, the word-by-word audit and the single-file bundle step. Do not run a data rebuild or fetch additional external content as a routine feature change. Before rebuilding or replacing any dataset:

1. Confirm its exact upstream source and version.
2. Confirm that the licence or written permission allows the intended use and transformation.
3. Preserve the source file and record its checksum/version.
4. Review any generated differences against the upstream source.
5. Run the audit and retain the report.
6. Do not invent, paraphrase or manually add religious content or meanings.

The scripts may regenerate existing outputs from existing inputs. That does not itself establish that the input datasets are licensed for public redistribution.

## Source, licence and permission status

There is no single licence that automatically covers every file in this repository. Application code, Quranic datasets, translations, morphology, tafseer, hadith, audio, timings, fonts and other assets may have different rights holders and terms.

Do not add a repository-wide licence declaration until the scope and compatibility of every included component have been checked. Preserve all upstream licence files and notices. Consult the source/rights register in the QuranToSoul Notion project before publishing or redistributing content.

## Security and privacy

The report endpoint and published privacy statement are undergoing review. Do not expose report administration secrets in URLs, commit secrets, or assume that local-only data statements cover external audio, video, fonts, analytics, speech recognition or mistake reports.

## Contribution and release rule

Changes to application code and navigation may proceed when they do not introduce unverified religious content or unlicensed assets. Content/data changes require source and rights approval first. Production releases must pass reproducible build, data-integrity, privacy/security and browser smoke checks.

No production content has been removed or modified by this documentation update.
