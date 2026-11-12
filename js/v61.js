"use strict";
/* ---------- v61: the standard rub' al-hizb marks ----------
   The app marked three points per para (ربع / نصف / ثلاثة of the para): 90 marks.
   A printed mushaf divides each para into two hizbs and each hizb into four quarters - eight
   points per para, 240 in all - and the three words mark the quarters WITHIN a hizb, with the
   hizb itself starting at the half-para point. data/marks.json now carries that division
   (from Tanzil's metadata: 240 quarters, verified against our own 30 juz starts and 556 rukus).
   The positions were always real boundaries; the names sat on the wrong ones. In para 14, 16:90
   is نصف (half of the second hizb), not ثلاثة; 16:1 is نصف, not ربع. This adds the fourth mark
   type - الحزب - and the labels for it. */
Object.assign(L.ur, {
  qLbl: ["", "الربع", "النصف", "الثلاثة", "الحزب"],
  qName: ["", "حزب کا ربع", "حزب کا نصف", "حزب کے تین چوتھائی", "نیا حزب شروع"]
});
Object.assign(L.en, {
  qLbl: ["", "الربع", "النصف", "الثلاثة", "الحزب"],
  qName: ["", "Quarter of the hizb", "Half of the hizb", "Three quarters of the hizb", "A new hizb starts"],
  qtH: (q, j) => `Para ${j} — ${["", "Quarter of the hizb", "Half of the hizb", "Three quarters of the hizb", "New hizb"][q]}`
});
