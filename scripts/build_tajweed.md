# Tajweed data (data/tajweed/NNN.json)
Rule positions come from quran-tajweed by Collin Fair (https://github.com/cpfair/quran-tajweed, data CC BY 4.0).
We ran its tajweed_classifier.py (with its rule_trees) over this app's own Uthmani text (data/s/*.json words joined by spaces;
basmala prepended to ayah 1 of every surah except 1 and 9, as the classifier expects, then removed).
Result: 6,234 of 6,236 ayahs identical to the published file. Format per surah: {ayah: [[wordIndex, start, end, ruleIndex], ...]}
with rule order as TJ_RULES in js/tajweed.js.
