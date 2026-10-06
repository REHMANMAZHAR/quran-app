"use strict";
/* ---------- Lectures: Dr. Israr Ahmad (Bayan-ul-Quran) + Lisaan-ul-Quran, official YouTube embeds ---------- */
/* Bayan-ul-Quran 1998, 108 lectures. Ranges from the official list on drisrar.com: [n, s1,a1, s2,a2] (999 = end of surah, 0 = intro/closing). */
const BQ = [[1,0,0,0,0],[2,0,0,0,0],[3,0,0,0,0],[4,0,0,0,0],[5,1,1,1,999],[6,2,1,2,29],[7,2,30,2,46],[8,2,47,2,74],[9,2,75,2,107],[10,2,108,2,141],
[11,2,142,2,176],[12,2,177,2,196],[13,2,197,2,228],[14,2,229,2,253],[15,2,254,2,273],[16,2,274,2,999],[17,3,1,3,48],[18,3,48,3,101],[19,3,102,3,151],[20,3,152,3,999],
[21,4,1,4,30],[22,4,31,4,65],[23,4,66,4,100],[24,4,101,4,142],[25,4,143,5,4],[26,5,5,5,43],[27,5,43,5,86],[28,5,87,5,999],[29,6,1,6,49],[30,6,50,6,90],
[31,6,91,6,129],[32,6,130,7,19],[33,7,20,7,58],[34,7,59,7,129],[35,7,130,7,166],[36,7,166,7,999],[37,8,1,8,40],[38,8,41,8,999],[39,9,1,9,34],[40,9,35,9,85],
[41,9,86,9,999],[42,10,1,10,60],[43,10,61,11,24],[44,11,25,11,88],[45,11,89,12,35],[46,12,36,12,106],[47,12,107,14,9],[48,14,10,15,15],[49,15,16,15,999],[50,16,1,16,66],
[51,16,66,16,999],[52,17,1,17,35],[53,17,36,17,85],[54,17,86,18,28],[55,18,29,18,82],[56,18,83,19,50],[57,19,51,20,46],[58,20,47,21,10],[59,21,11,21,103],[60,21,104,22,38],
[61,22,39,22,999],[62,23,1,23,114],[63,23,115,24,40],[64,24,41,25,20],[65,25,21,26,9],[66,26,10,27,9],[67,27,10,28,6],[68,28,7,28,75],[69,28,76,29,13],[70,29,14,30,19],
[71,30,20,31,19],[72,31,20,33,8],[73,33,9,33,40],[74,33,41,34,21],[75,34,22,35,43],[76,35,44,37,53],[77,37,44,38,10],[78,38,11,39,4],[79,39,5,39,67],[80,39,68,40,66],
[81,40,67,41,46],[82,41,47,42,39],[83,42,40,43,999],[84,44,1,46,5],[85,46,6,47,14],[86,47,15,48,20],[87,48,21,49,999],[88,50,1,51,50],[89,51,51,53,47],[90,53,47,55,32],
[91,55,33,56,999],[92,57,1,57,20],[93,57,21,58,4],[94,58,5,59,10],[95,59,11,60,999],[96,61,1,62,999],[97,63,1,64,999],[98,65,1,67,4],[99,67,5,70,19],[100,70,20,73,999],
[101,74,1,76,999],[102,77,1,81,22],[103,81,23,86,999],[104,87,1,90,999],[105,91,1,95,999],[106,96,1,109,999],[107,110,1,114,999],[108,0,0,0,0]];
/* Official videos on drisrar.com: watch page https://www.drisrar.com/watch/<slug>_<code>.html, player https://www.drisrar.com/embed/<code> */
const BQ_CODE = ["GLcyslS9JOSAtuT", "IT1xzETNxC3HI3z", "RTXiTsJkHwVmnkF", "IqgVR8sBzcAuWtQ", "k2ZSqqCGGpyDVer", "hLObvw5qF6vh2VD", "ID7z5rMkuoYM3uj", "EFQFlPh4SrDWRON", "VuieqOg598jjkpR", "sfqspkezwPzoLgS", "vcUvY6hb7sQmPZ6", "6sM8yohPsZ9ZnTg", "oW6k3Gh22yUhOIM", "8vww54tYQqVI7vm", "EIsdT2kNOBlQkEu", "YSlqr9olaEB7C9y", "NlUfFHvtU1k17L3", "B1pdzzgb7TQ6mVT", "m66cqfF6jsp6cQw", "5vK6IwYMEAPdOd6", "vvsPoyxD4BuNxmQ", "uYVELDAHMKDebYE", "SCrnTI2IxsbMpAy", "FWaYPoNJ5lvCuJj", "INxfORUioJ5TiR7", "YsDPi8Lelf3VLif", "azue5T7j6dShEHH", "6FFy222Cgff72H3", "icCfEtzctkwUY83", "zdIzduotb5dmcYc", "g6yLAN6N2igUA3N", "m2proyxi9wPzlKN", "RM9z1YokatVFFN6", "LDKntasDmrkkeHY", "Tw1c19oGlhwu4YN", "dmiWIB9mWmber7U", "fdT2iMH4m2sZNNb", "fOoVy5x5NK6PrRk", "ShQ4RgtBNfTxoNQ", "Jfr6H5AUfwlUDbX", "wTEekgomR5bXQAv", "ljsh46e3Kphxrpg", "FmFeGqZdhryt4IT", "tKACDlhoXNASvVX", "r6hiPR9Ijwk1Lo4", "CkOXUHBtdLFfS5n", "zcbkrChGJFABHyC", "GmQm7lDXVHBLPLb", "IjUPPaOVRku5Bi7", "jIwOBKy4PfS5kfA", "6OahcNsPeUFE2Y1", "Ow8T9wNqp8T6rhH", "E3VKiTBoSPBJi2B", "So4zwZvC3FaOgOn", "T2aMLDu9iom679J", "g1uM7BX3wIxoh3K", "hDbyomFSId82pNa", "LXQZspoALNTvtXR", "xIowX7sZJF5hwJA", "egl6wSXGLQjsv2H", "MG5uwX8X3qHdOPH", "MP5LMrbhcTOIaOF", "DVJyJGiqZHR4e3D", "vh1Pu6L5yDvTYVi", "mL7rNzTkrNjhk5W", "pxLEWhdM6jcu72g", "9ngBSDnzrDmIHiH", "Ra2dqe3CwVIVdhK", "lqa734AjYaZk4cn", "W15i8NjARSojJ5e", "wHNZoDzNTlW1hi2", "ABH8bBR3vZyWsNw", "wNo2SPIJsyBpqwN", "OhN1ezhHeeSpXL7", "dehEcJldc3WEgkR", "KfiYDrggwYl5bgX", "t8pB6vYy5ZxuePP", "9RmAhztmKQmQosU", "73VedrbQY93YX1M", "9ao44t4uFaQ9lNm", "Hp1TqdNuGtaBHCT", "7Ufs2KfSaAcaaxz", "4DpMGUnLMexZWcG", "jico7gXsKyGtbOW", "HTIud6jSd8k1gYx", "BhPPpSSiv7CVucf", "V1jDi2Zlqeqz3kE", "Sg69WSXxQcmUFyZ", "T8wbdPvrT3hCONr", "UjkRG6l1KdhKUym", "llKPxuEPfzFZkXy", "nZU6sULP4AimUdP", "v5E7tN5csLvhNUO", "yU3UsFYzPL5OTaP", "jv7g5Xqb9Pw1EWT", "J8td3HcgCo4RYrt", "uSksWHahrPfTg1Y", "XoDdtWelVbdyZOk", "P8UyEZPOXrKozvi", "XU5hIVZM3KaLYNv", "EUMxIQ2reJWt1Bf", "D5hqQSZd2zCuxOM", "2NfmXZmaA87yGeO", "3e6ZoZrWauyQXNQ", "DiOivjghbN4sb8f", "1E4eWeFdVAPwAZV", "GBtikBPYfV8lhbo", "C2iJK1V2zu2Tmaa"];
const BQ_SLUG = ["bayan-ul-quran-introduction-by-dr-israr-ahmad-1-108", "bayan-ul-quran-introduction-part-ii-by-dr-israr-ahmad-2-108", "bayan-ul-quran-introduction-part-iii-by-dr-israr-ahmad-3-108", "bayan-ul-quran-introduction-part-iv-by-dr-israr-ahmad-4-108", "bayan-ul-quran-surah-al-fatiha-by-dr-israr-ahmad-5-108", "bayan-ul-quran-surah-al-baqarah-01-to-29-by-dr-israr-ahmad-6-108", "bayan-ul-quran-surah-al-baqarah-30-to-46-by-dr-israr-ahmad-7-108", "bayan-ul-quran-surah-al-baqarah-47-to-74-by-dr-israr-ahmad-8-108", "bayan-ul-quran-surah-al-baqarah-75-to-107-by-dr-israr-ahmad-9-108", "bayan-ul-quran-surah-al-baqarah-108-to-141-by-dr-israr-ahmad-10-108", "bayan-ul-quran-surah-al-baqarah-142-to-176-by-dr-israr-ahmad-11-108", "bayan-ul-quran-surah-al-baqarah-177-to-196-by-dr-israr-ahmad-12-108", "bayan-ul-quran-surah-al-baqarah-197-to-228-by-dr-israr-ahmad-13-108", "bayan-ul-quran-surah-al-baqarah-229-to-253-by-dr-israr-ahmad-14-108", "bayan-ul-quran-surah-al-baqarah-254-to-273-by-dr-israr-ahmad-15-108", "bayan-ul-quran-surah-al-baqarah-274-to-end-by-dr-israr-ahmad-16-108", "bayan-ul-quran-surah-aal-e-imran-01-to-48-by-dr-israr-ahmad-17-108", "bayan-ul-quran-surah-aal-e-imran-48-to-101-by-dr-israr-ahmad-18-108", "bayan-ul-quran-surah-aal-e-imran-102-to-151-by-dr-israr-ahmad-19-108", "bayan-ul-quran-surah-aal-e-imran-152-to-end-by-dr-israr-ahmad-20-108", "bayan-ul-quran-surah-a-nisa-01-to-30-by-dr-israr-ahmad-21-108", "bayan-ul-quran-surah-a-nisa-31-to-65-by-dr-israr-ahmad-22-108", "bayan-ul-quran-surah-a-nisa-66-to-100-by-dr-israr-ahmad-23-108", "bayan-ul-quran-surah-a-nisa-101-to-142-by-dr-israr-ahmad-24-108", "bayan-ul-quran-surah-a-nisa-143-to-surah-al-maidah-04-by-dr-israr-ahmad-25-108", "bayan-ul-quran-surah-al-maidah-05-to-43-by-dr-israr-ahmad-26-108", "bayan-ul-quran-surah-al-maidah-43-to-86-by-dr-israr-ahmad-27-108", "bayan-ul-quran-surah-al-maidah-87-to-end-by-dr-israr-ahmad-28-108", "bayan-ul-quran-surah-al-anaam-01-to-49-by-dr-israr-ahmad-29-108", "bayan-ul-quran-surah-al-anaam-50-to-90-by-dr-israr-ahmad-30-108", "bayan-ul-quran-surah-al-anaam-91-to-129-by-dr-israr-ahmad-31-108", "bayan-ul-quran-surah-al-anaam-130-to-surah-al-araf-19-by-dr-israr-ahmad-32-108", "bayan-ul-quran-surah-al-araf-20-to-58-by-dr-israr-ahmad-33-108", "bayan-ul-quran-surah-al-araf-59-to-129-by-dr-israr-ahmad-34-108", "bayan-ul-quran-surah-al-araaf-130-to-166-by-dr-israr-ahmad-35-108", "bayan-ul-quran-surah-al-araf-166-to-end-by-dr-israr-ahmad-36-108", "bayan-ul-quran-surah-al-anfal-01-to-40-by-dr-israr-ahmad-37-108", "bayan-ul-quran-surah-al-anfal-41-to-end-by-dr-israr-ahmad-38-108", "bayan-ul-quran-surah-at-taubah-01-to-34-by-dr-israr-ahmad-39-108", "bayan-ul-quran-surah-at-taubah-35-to-85-by-dr-israr-ahmad-40-108", "bayan-ul-quran-surah-at-taubah-86-to-end-by-dr-israr-ahmad-41-108", "bayan-ul-quran-surah-yunus-01-to-60-by-dr-israr-ahmad-42-108", "bayan-ul-quran-surah-yunus-61-to-surah-hud-24-by-dr-israr-ahmad-43-108", "bayan-ul-quran-surah-hud-25-to-88-by-dr-israr-ahmad-44-108", "bayan-ul-quran-surah-hud-89-to-surah-yusuf-35-dr-israr-ahmad-45-108", "bayan-ul-quran-surah-yusuf-36-to-106-by-dr-israr-ahmed-46-108", "bayan-ul-quran-surah-yusuf-107-to-surah-ibrahim-09-by-dr-israr-ahmed-47-108", "bayan-ul-quran-surah-ibrahim-10-to-surah-al-hijr-15-by-dr-israr-ahmed-48-108", "bayan-ul-quran-surah-al-hijr-16-to-end-by-dr-israr-ahmed-49-108", "bayan-ul-quran-surah-al-nahl-01-to-66-by-dr-israr-ahmed-50-108", "bayan-ul-quran-surah-al-nahl-66-to-end-by-dr-israr-ahmed-51-108", "bayan-ul-quran-surah-bani-israeel-01-to-35-by-dr-israr-ahmed-52-108", "bayan-ul-quran-surah-bani-israel-36-to-85-by-dr-israr-ahmed-53-108", "bayan-ul-quran-surah-bani-israeel-86-to-surah-kahf-28-by-dr-israr-ahmed-54-108", "bayan-ul-quran-surah-al-kahaf-aayet-29-82-by-dr-israr-ahmed-55-108", "bayan-ul-quran-surah-kahf-83-to-surah-maryam-50-by-dr-israr-ahmed-56-108", "bayan-ul-quran-surah-maryam-51-to-surah-taha-46-by-dr-israr-ahmed-57-108", "bayan-ul-quran-surah-taha-47-to-surah-al-anbiya-10-by-dr-israr-ahmed-58-108", "bayan-ul-quran-surah-al-anbiya-11-to-103-by-dr-israr-ahmed-59-108", "bayan-ul-quran-surah-al-anbiya-104-to-surah-al-hajj-38-by-dr-israr-ahmed-60-108", "bayan-ul-quran-surah-al-hajj-39-to-end-by-dr-israr-ahmed-61-108", "bayan-ul-quran-surah-muminun-01-to-114-by-dr-israr-ahmed-62-108", "bayan-ul-quran-surah-muminun-115-to-al-noor-40-by-dr-israr-ahmed-63-108", "bayan-ul-quran-surah-al-noor-41-01-to-surah-al-furqan-20-by-dr-israr-ahmed-64-108", "bayan-ul-quran-surah-al-furqan-21-01-to-surah-shu-ara-09-by-dr-israr-ahmed-65-108", "bayan-ul-quran-surah-shu-ara-10-to-surah-naml-09-by-dr-israr-ahmed-66-108", "bayan-ul-quran-surah-naml-10-to-surah-al-qasas-06-by-dr-israr-ahmed-67-108", "bayan-ul-quran-surah-qasas-07-to-75-by-dr-israr-ahmed-68-108", "bayan-ul-quran-surah-qasas-76-to-surah-al-ankabut-13-by-dr-israr-ahmed-69-108", "bayan-ul-quran-surah-al-ankabut-14-to-surah-ar-rum-19-by-dr-israr-ahmed-70-108", "bayan-ul-quran-surah-ar-rum-20-to-surah-luqman-19-by-dr-israr-ahmed-71-108", "bayan-ul-quran-surah-luqman-20-to-surah-al-ahzab-08-by-dr-israr-ahmed-72-108", "bayan-ul-quran-surah-al-ahzab-09-to-40-by-dr-israr-ahmed-73-108", "bayan-ul-quran-surah-al-ahzab-41-to-surah-saba-21-by-dr-israr-ahmed-74-108", "bayan-ul-quran-surah-saba-22-to-surah-fatir-43-by-dr-israr-ahmed-75-108", "bayan-ul-quran-surah-fatir-44-to-surah-as-saffat-53-by-dr-israr-ahmed-76-108", "bayan-ul-quran-surah-as-saffat-44-to-surah-sad-10-by-dr-israr-ahmed-77-108", "bayan-ul-quran-surah-saad-11-to-surah-az-zuvar-04-by-dr-israr-ahmed-78-108", "bayan-ul-quran-surah-az-zuvar-05-to-67-by-dr-israr-ahmed-79-108", "bayan-ul-quran-surah-az-zuvar-68-to-surah-al-momin-66-by-dr-israr-ahmed-80-108", "bayan-ul-quran-surah-al-momin-67-to-hameem-as-sajdah-46-by-dr-israr-ahmed-81-108", "bayan-ul-quran-surah-hamim-as-sajdah-47-to-ash-shura-39-by-dr-israr-ahmed-82-108", "bayan-ul-quran-surah-as-shura-40-to-surah-az-zukhruf-end-by-dr-israr-ahmed-83-108", "bayan-ul-quran-surah-ad-dukhan-01-to-surah-al-ahqaf-05-by-dr-israr-ahmed-84-108", "bayan-ul-quran-surah-al-ahqaf-06-to-surah-muhammad-14-by-dr-israr-ahmed-85-108", "bayan-ul-quran-surah-muhammad-15-to-surah-al-fatteh-20-by-dr-israr-ahmed-86-108", "bayan-ul-quran-surah-al-fatah-21-to-surah-al-hujurat-end-by-dr-israr-ahmed-87-108", "bayan-ul-quran-surah-qaf-01-to-surah-az-zariyat-50-by-dr-israr-ahmed-88-108", "bayan-ul-quran-surah-az-zariyat-51-to-surah-a-najm-47-by-dr-israr-ahmed-89-108", "bayan-ul-quran-surah-a-najm-47-to-surah-ar-rehman-32-by-dr-israr-ahmed-90-108", "bayan-ul-quran-surah-ar-rehman-33-to-surah-al-waqiah-end-by-dr-israr-ahmed-91-108", "bayan-ul-quran-surah-al-hadid-01-to-20-by-dr-israr-ahmed-92-108", "bayan-ul-quran-surah-al-hadid-21-to-surah-al-mujadila-04-by-dr-israr-ahmed-93-108", "bayan-ul-quran-surah-al-mujadila-05-to-surah-al-hashr-10-by-dr-israr-ahmed-94-108", "bayan-ul-quran-surah-al-hashr-11-to-al-mumtahinah-end-by-dr-israr-ahmed-95-108", "bayan-ul-quran-surah-as-saff-01-to-surah-jummah-end-by-dr-israr-ahmed-96-108", "bayan-ul-quran-surah-al-munafiqoon-01-to-at-taghabun-end-by-dr-israr-ahmed-97-108", "bayan-ul-quran-surah-at-talaq-01-to-surah-al-mulk-04-by-dr-israr-ahmed-98-108", "bayan-ul-quran-surah-al-mulk-05-to-surah-al-maarij-19-by-dr-israr-ahmed-99-108", "bayan-ul-quran-surah-al-maarij-20-to-surah-al-muzammil-end-by-dr-israr-ahmed-100-108", "bayan-ul-quran-surah-al-mudassir-01-to-surah-ad-dahr-end-by-dr-israr-ahmed-101-108", "bayan-ul-quran-surah-al-mursalat-01-to-surah-at-takwir-22-by-dr-israr-ahmed-102-108", "bayan-ul-quran-surah-at-takwir-23-to-surah-at-tariq-end-by-dr-israr-ahmed-103-108", "bayan-ul-quran-surah-al-aala-01-to-surah-al-balad-end-by-dr-israr-ahmed-104-108", "bayan-ul-quran-surah-ash-shams-01-to-surah-at-teen-end-by-dr-israr-ahmed-105-108", "bayan-ul-quran-surah-al-alaq-01-to-surah-al-kafirun-end-by-dr-israr-ahmed-106-108", "bayan-ul-quran-surah-a-nasr-to-a-naas-ending-speech-by-dr-israr-ahmed-107-108", "bayan-ul-quran-ending-speech-by-dr-israr-ahmed-108-108"];
const SERIES = {
  bq: { total:108, credit:"Dr. Israr Ahmad · Bayan-ul-Quran (1998)", src:"https://www.drisrar.com/", srcName:"drisrar.com (official)" },
  lq: { list:"UUZcujrtvcTaAiV9MzKBJJPQ", total:0, credit:"Lisan ul Quran · Ustad Amir Sohail", src:"https://play.google.com/store/apps/details?id=com.lisanulquran.amirsohail", srcName:"Lisan ul Quran app" }
};
Object.assign(L.ur, {
  bqName:"بیان القرآن — ڈاکٹر اسرار احمد", lqName:"لسان القرآن — استاد عامر سہیل", lecH:"لیکچرز", lec:n=>`لیکچر ${ud(n)}`, lesson:n=>`سبق ${ud(n)}`,
  lecAyahs:(a,b)=>`آیات ${ud(a)}–${ud(b)}`, intro:"تعارف", closing:"اختتامی خطاب", tafseerBtn:"تفسیر (ڈاکٹر اسرار)", startAt:t=>`${t} سے جاری رکھیں`,
  cont:"جاری رکھیں", startS:"شروع کریں", openYT:"یوٹیوب پر دیکھیں", prevL:"پچھلا", nextL:"اگلا", via:s=>`آفیشل یوٹیوب ویڈیو · ${s}`,
  lqNote:"آفیشل چینل کی ویڈیوز (نئی پہلے)", getApp:"ان کی آفیشل ایپ", noLec:"اس آیت کا لیکچر نہیں ملا",
  closeV:"بند", notPlaying:"یہاں نہ چلے تو:", openDr:"drisrar.com پر دیکھیں", bqResume:"ایپ آپ کا آخری لیکچر یاد رکھتی ہے۔ ویڈیو کا منٹ آفیشل پلیئر خود یاد رکھتا ہے (اگر سپورٹ کرے)۔", lastWatched:"آخری دیکھا"
});
Object.assign(L.en, {
  bqName:"Bayan-ul-Quran — Dr. Israr Ahmad", lqName:"Lisan ul Quran — Ustad Amir Sohail", lecH:"Lectures", lec:n=>`Lecture ${n}`, lesson:n=>`Lesson ${n}`,
  lecAyahs:(a,b)=>`Ayahs ${a}–${b}`, intro:"Introduction", closing:"Closing speech", tafseerBtn:"Tafseer (Dr. Israr)", startAt:t=>`Continue at ${t}`,
  cont:"Continue", startS:"Start", openYT:"Watch on YouTube", prevL:"Previous", nextL:"Next", via:s=>`Official YouTube video · ${s}`,
  lqNote:"Videos from the official channel (newest first)", getApp:"Their official app", noLec:"No lecture found for this ayah",
  closeV:"Close", notPlaying:"If it doesn't play here:", openDr:"Watch on drisrar.com", bqResume:"The app remembers your last lecture. The minute is kept by the official player itself, where it supports it.", lastWatched:"last watched"
});
const VS = Object.assign({ bq:{ n:0, t:{}, off:null }, lq:{ i:0, t:{} } }, store.get("vid", {}));
const saveV = () => store.set("vid", VS);
const mmss = s => { s = Math.floor(s || 0); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const key = (s, a) => s * 1000 + a;
const lecFor = (s, a) => (BQ.find(L => L[1] && key(L[1], L[2]) <= key(s, a) && key(s, a) <= key(L[3], L[4])) || [0])[0];
const lecsInSurah = s => BQ.filter(L => L[1] && key(L[1], L[2]) <= key(s, 999) && key(L[3], L[4]) >= key(s, 1));
function lecLabel(n, s){
  const L = BQ[n - 1];
  if (!L[1]) return n <= 4 ? T("intro") : T("closing");
  if (s) { const cnt = META.surahs[s - 1].ayahs || 999; const a = L[1] === s ? L[2] : 1, b = L[3] === s ? Math.min(L[4], cnt) : cnt; return T("lecAyahs", nf(a), nf(b)); }
  const nm = x => settings.lang === "en" ? META.surahs[x - 1].tr : META.surahs[x - 1].ar;
  const end = (x, a) => a === 999 ? nm(x) : `${nm(x)} ${nf(a)}`;
  return L[1] === L[3] ? `${nm(L[1])} ${L[4] === 999 && L[2] === 1 ? "" : nf(L[2]) + "–" + (L[4] === 999 ? "" : nf(L[4]))}`.trim() : `${end(L[1], L[2]) } – ${end(L[3], L[4])}`;
}
/* surah header: lectures covering this surah */
function lecStrip(s){
  const ls = lecsInSurah(s); if (!ls.length) return "";
  return `<div class="lecstrip"><div class="lh2">${esc(T("bqName"))}</div><div class="chips">${ls.map(L =>
    `<button class="chip" data-lec="${L[0]}"><b>${T("lec", nf(L[0]))}</b><span>${esc(lecLabel(L[0], s))}</span>${VS.bq.n === L[0] ? `<i>${T("lastWatched")}</i>` : ""}</button>`).join("")}</div></div>`;
}
/* player panel */
let YTP = null, ytReady = null, vCur = null, vTimer = 0;
function loadYT(){
  if (!ytReady) ytReady = new Promise(res => { window.onYouTubeIframeAPIReady = res; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); });
  return ytReady;
}
const bqIndex = n => { const o = VS.bq.off; return !o ? n - 1 : o.rev ? (VS.bq.total || 108) - n + o.k : n - 1 + o.k; };
function openLecture(series, n){
  vCur = { series, n };
  const S = SERIES[series], start = series === "lq" ? (VS.lq.t[n] || 0) : 0;
  const title = series === "bq" ? `${T("lec", nf(n))} · ${esc(lecLabel(n))}` : T("lesson", nf(n + 1));
  const watch = series === "bq" ? `https://www.drisrar.com/watch/${BQ_SLUG[n - 1]}_${BQ_CODE[n - 1]}.html` : `https://www.youtube.com/playlist?list=${S.list}`;
  $("#vpanel").innerHTML = `<div class="vp-top"><button class="iconbtn" data-v="close" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg><span class="cap">${T("closeV")}</span></button>
      <div class="vp-t"><b>${esc(T(series === "bq" ? "bqName" : "lqName"))}</b><small id="vpTitle">${title}</small></div></div>
    <div class="vp-frame">${series === "bq" ? `<iframe src="https://www.drisrar.com/embed/${BQ_CODE[n - 1]}" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen referrerpolicy="origin" title="${esc(title)}"></iframe>` : `<div id="ytp"></div>`}</div>
    <div class="vp-nav"><button class="btn ghost" data-v="prev">${T("prevL")}</button><button class="btn ghost" data-v="next">${T("nextL")}</button></div>
    <p class="vp-credit">${esc(T("via", S.credit))} · <a href="${S.src}" target="_blank" rel="noopener">${esc(series === "lq" ? T("getApp") : S.srcName)}</a><br>
      ${T("notPlaying")} <a id="vpYT" href="${watch}" target="_blank" rel="noopener"><b>${series === "bq" ? T("openDr") : T("openYT")}</b></a>${series === "lq" ? `<br>${T("lqNote")}` : `<br>${T("bqResume")}`}</p>`;
  $("#vpanel").classList.add("on"); $("#scrim").classList.add("on");
  if (P.s && !P.audio.paused) P.audio.pause();
  if (series === "lq") {
    loadYT().then(() => {
      if (YTP) { try { YTP.destroy(); } catch(e){} }
      YTP = new YT.Player("ytp", { host:"https://www.youtube.com", width:"100%", height:"100%",
        playerVars:{ listType:"playlist", list:S.list, index:n, start:Math.floor(start), rel:0, playsinline:1, modestbranding:1 },
        events:{ onStateChange: onYTState } });
    });
    clearInterval(vTimer); vTimer = setInterval(saveVid, 4000);
  }
  if (series === "bq") { VS.bq.n = n; } else VS.lq.i = n;
  saveV();
}
function onYTState(e){
  if (e.data !== 1 || !vCur) return;
  const d = YTP.getVideoData ? YTP.getVideoData() : {}, idx = YTP.getPlaylistIndex();
  const yt = $("#vpYT"); if (yt && d.video_id) yt.href = `https://www.youtube.com/watch?v=${d.video_id}`;
  if (vCur.series === "lq") { if (idx !== vCur.n) { vCur.n = idx; VS.lq.i = idx; $("#vpTitle").textContent = T("lesson", nf(idx + 1)); saveV(); } return; }
  const m = /(\d{1,3})\s*\/\s*108/.exec(d.title || "");
  if (m && !VS.bq.off) {               // learn how the official playlist is ordered, once
    const num = +m[1], fwd = idx - num + 1;
    VS.bq.off = Math.abs(fwd) <= 6 ? { rev:false, k:fwd } : { rev:true, k:idx - (108 - num) }; saveV();
    if (num !== vCur.n) { openLecture("bq", vCur.n); return; }
  }
  if (m && +m[1] !== vCur.n) { vCur.n = +m[1]; VS.bq.n = vCur.n; $("#vpTitle").textContent = `${T("lec", nf(vCur.n))} · ${lecLabel(vCur.n)}`; saveV(); }
}
function saveVid(){
  if (!YTP || !vCur || !YTP.getCurrentTime) return;
  const t = YTP.getCurrentTime(); if (!(t > 5)) return;
  if (vCur.series === "bq") VS.bq.t[vCur.n] = Math.floor(t); else VS.lq.t[vCur.n] = Math.floor(t);
  saveV();
}
function closeVideo(){
  saveVid(); clearInterval(vTimer);
  if (YTP) { try { YTP.pauseVideo(); YTP.destroy(); } catch(e){} YTP = null; }
  $("#vpanel").classList.remove("on"); $("#vpanel").innerHTML = ""; $("#scrim").classList.remove("on"); vCur = null;
  if (LV.view === "learn") learnHome(); else if (CUR) { const st = document.querySelector(".lecstrip"); if (st) st.outerHTML = lecStrip(CUR.n); }
}
$("#vpanel").addEventListener("click", e => {
  const b = e.target.closest("[data-v]"); if (!b || !vCur) return;
  const v = b.dataset.v;
  if (v === "close") return closeVideo();
  saveVid();
  const max = vCur.series === "bq" ? 108 : 999, min = vCur.series === "bq" ? 1 : 0;
  const n = Math.min(max, Math.max(min, vCur.n + (v === "next" ? 1 : -1)));
  if (n !== vCur.n) openLecture(vCur.series, n);
});
$("#scrim").addEventListener("click", () => { if (vCur) closeVideo(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && vCur) closeVideo(); });
$("#main").addEventListener("click", e => { const c = e.target.closest("[data-lec]"); if (c) openLecture("bq", +c.dataset.lec); });
$("#sheetBody").addEventListener("click", e => { const c = e.target.closest("[data-lec]"); if (c) { closeAll(); openLecture("bq", +c.dataset.lec); } });
/* Learn tab card */
function lecturesCard(){
  const bn = VS.bq.n || 5, bt = VS.bq.t[bn] || 0, li = VS.lq.i || 0, lt = VS.lq.t[li] || 0;
  return `<div class="lh"><h3>${T("lecH")}</h3></div><div class="games">
    <button class="game" data-lecs="bq"><b>${esc(T("bqName"))}</b><small>${T("lec", nf(bn))} · ${esc(lecLabel(bn))}</small><small>${VS.bq.n ? T("cont") : T("startS")}</small></button>
    <button class="game" data-lecs="lq"><b>${esc(T("lqName"))}</b><small>${T("lesson", nf(li + 1))}</small><small>${lt ? T("startAt", mmss(lt)) : (VS.lq.i ? T("cont") : T("startS"))}</small></button></div>`;
}
$("#learn").addEventListener("click", e => { const c = e.target.closest("[data-lecs]"); if (c) openLecture(c.dataset.lecs, c.dataset.lecs === "bq" ? (VS.bq.n || 5) : (VS.lq.i || 0)); });

