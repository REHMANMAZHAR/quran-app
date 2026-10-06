"use strict";
/* ---------- Lectures: Dr. Israr Ahmad (Urdu video, English audio, written tafsir link) + Lisan-ul-Quran ---------- */
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
const BQ_OK = ["3598482016904", "3598482082440", "3598509542024", "3598515112584", "3598518520456", "3598544734856", "3599382743688", "3599382809224", "3599411645064", "3599420033672", "3599427570312", null, null, "3599470561928", "3599477312136", "3599616903816", null, "3599689386632", "3599689321096", "3606209235592", "3606209366664", "3606209628808", null, "3606209497736", "3606209563272", "3606269856392", "3606364162696", "3606364228232", "3606364293768", "3606364359304", "3608076356232", "3608076290696", "3608076421768", "3608076225160", "3608076159624", "3608136845960", "3608136977032", "3608137108104", "3608137042568", "3608136911496", "3608420944520", "3608421010056", "3608421141128", "3608421075592", "3608421206664", "3610380601992", "3610380470920", "3610380405384", "3610380536456", null, "3599771044488", "3599793785480", "3599804795528", "3599824325256", "3602944101000", "3602944035464", "3602943838856", "3602943904392", "3602943969928", "3602944166536", null, "3604103891592", "3604213271176", null, "3604103629448", "3604103826056", "3604103563912", "3604213402248", "3604213205640", null, null, "3605150239368", "3605149977224", "3605149649544", "3605149715080", "3605150108296", "3605149846152", "3605150042760", "3605150173832", "3605150304904", "3605457013384", "3605457078920", "3605457144456", "3605457209992", "3605457275528", "3611362593416", "3611362855560", "3611362724488", "3611362658952", "3611362790024", "3611440974472", "3611441367688", "3611440843400", "3611441302152", "3611441564296", "3611441498760", "3611441236616", null, "3611441040008", "3611441433224", "3611702594184", "3611702463112", "3611702332040", "3611702266504", "3611702397576", null, "3611702659720", "3611702528648"];
/* Dr. Israr Ahmad, English "Dora-e-Tarjuma-e-Quran" (official Tanzeem-e-Islami audio, 112 parts): [n, s1,a1, s2,a2] */
const EN = [[1,1,1,1,999],[2,2,1,2,20],[3,2,21,2,46],[4,2,47,2,82],[5,2,83,2,103],[6,2,104,2,141],[7,2,142,2,167],[8,2,168,2,188],[9,2,189,2,220],[10,2,221,2,248],[11,2,249,2,266],[12,2,267,2,999],[13,3,1,3,32],[14,3,33,3,80],[15,3,81,3,120],[16,3,121,3,155],[17,3,156,3,171],[18,3,172,3,999],[19,4,1,4,14],[20,4,15,4,28],[21,4,29,4,57],[22,4,58,4,64],[23,4,65,4,87],[24,4,88,4,110],[25,4,111,4,134],[26,4,135,4,158],[27,4,159,4,999],[28,5,1,5,18],[29,5,19,5,50],[30,5,51,5,77],[31,5,78,5,100],[32,5,101,6,7],[33,6,8,6,41],[34,6,42,6,72],[35,6,73,6,96],[36,6,97,6,129],[37,6,130,6,999],[38,7,1,7,37],[39,7,37,7,84],[40,7,85,7,131],[41,7,132,7,160],[42,7,161,7,999],[43,8,1,8,28],[44,8,29,8,51],[45,8,52,8,999],[46,9,1,9,22],[47,9,23,9,72],[48,9,73,9,100],[49,9,101,9,999],[50,10,1,10,36],[51,10,37,10,74],[52,10,75,10,999],[53,11,1,11,49],[54,11,50,11,115],[55,11,116,12,40],[56,12,41,12,999],[57,13,1,13,32],[58,13,33,14,999],[59,15,1,15,999],[60,16,1,16,60],[61,16,61,16,110],[62,16,111,17,40],[63,17,41,17,100],[64,17,101,18,29],[65,18,30,18,102],[66,18,102,19,87],[67,19,88,20,90],[68,20,90,21,50],[69,21,51,22,9],[70,22,10,22,72],[71,22,73,23,77],[72,23,78,24,38],[73,24,39,25,44],[74,25,45,26,68],[75,26,69,27,42],[76,27,43,28,13],[77,28,14,28,999],[78,29,1,29,999],[79,30,1,30,999],[80,31,1,32,999],[81,33,1,33,52],[82,33,53,34,999],[83,35,1,36,22],[84,36,22,37,98],[85,37,99,38,999],[86,39,1,39,51],[87,39,52,40,46],[88,40,47,41,35],[89,41,35,42,13],[90,42,13,42,999],[91,43,1,44,999],[92,45,1,46,26],[93,46,27,47,999],[94,48,1,49,13],[95,49,14,50,999],[96,51,1,53,999],[97,54,1,56,999],[98,57,1,57,25],[99,57,26,58,999],[100,59,1,60,999],[101,61,1,62,999],[102,63,1,65,999],[103,66,1,69,999],[104,70,1,72,999],[105,73,1,75,25],[106,75,26,78,999],[107,79,1,83,14],[108,83,15,87,999],[109,88,1,91,10],[110,91,11,93,999],[111,94,1,100,999],[112,101,1,114,999]];
const EN_URL = n => `https://media.tanzeem.org/audios/017/DTQE-17-19/AE-17-019-${p3(n)}.mp3`;
const RANGES = { bq:BQ, en:EN };
const SERIES = {
  bq: { total:108, credit:"Dr. Israr Ahmad · Bayan-ul-Quran (1998)", src:"https://www.drisrar.com/", srcName:"drisrar.com (official)" },
  en: { total:112, credit:"Dr. Israr Ahmad · Dora-e-Tarjuma-e-Quran (English)", src:"https://www.tanzeem.org/", srcName:"Tanzeem-e-Islami (official)" },
  lq: { list:"UUZcujrtvcTaAiV9MzKBJJPQ", total:0, credit:"Lisan ul Quran · Ustad Amir Sohail", src:"https://play.google.com/store/apps/details?id=com.lisanulquran.amirsohail", srcName:"Lisan ul Quran app" }
};
const TAFSIR_TXT = (s, a) => `https://quran.com/${s}:${a}/tafsirs/tafsir-bayan-ul-quran`, TAFSIR_PDF = "https://tanzeem.org/book_categories/bayan-ul-quran/";
Object.assign(L.ur, {
  bqName:"بیان القرآن — ڈاکٹر اسرار احمد (اردو ویڈیو)", enName:"ڈاکٹر اسرار احمد — انگریزی آڈیو لیکچرز", lqName:"لسان القرآن — استاد عامر سہیل", lecH:"لیکچرز", lec:n=>`لیکچر ${ud(n)}`, part:n=>`حصہ ${ud(n)}`, lesson:n=>`سبق ${ud(n)}`,
  lecAyahs:(a,b)=>`آیات ${ud(a)}–${ud(b)}`, intro:"تعارف", closing:"اختتامی خطاب", tafseerBtn:"▶ ڈاکٹر اسرار — اردو ویڈیو", enBtn:"🎧 ڈاکٹر اسرار — انگریزی آڈیو", txtBtn:"📖 ڈاکٹر اسرار — تحریری تفسیر (اردو)", startAt:t=>`${t} سے جاری رکھیں`,
  cont:"جاری رکھیں", startS:"شروع کریں", openYT:"یوٹیوب پر دیکھیں", prevL:"پچھلا", nextL:"اگلا", via:s=>`آفیشل · ${s}`,
  lqNote:"آفیشل چینل کی ویڈیوز (نئی پہلے)", getApp:"ان کی آفیشل ایپ", noLec:"اس آیت کا لیکچر نہیں ملا",
  closeV:"بند", openDrBig:n=>`لیکچر ${ud(n)} drisrar.com پر کھولیں`, drHint:"اگر ویڈیو یہاں نہ چلے تو اوپر والا بٹن دبائیں — آفیشل ویب سائٹ پر کھل جائے گی۔", lastWatched:"آخری",
  enHint:"آڈیو آفیشل tanzeem.org سے چلتی ہے۔ ایپ آپ کا منٹ یاد رکھتی ہے۔", audioFail:"آڈیو نہیں چلی — یہاں سے براہِ راست کھولیں:", openFile:"آڈیو فائل کھولیں",
  txtNote:"تحریری تفسیر Quran.com پر (بیان القرآن، اردو)۔ مکمل کتاب PDF: tanzeem.org", pdf:"PDF کتاب"
});
Object.assign(L.en, {
  bqName:"Bayan-ul-Quran — Dr. Israr Ahmad (Urdu video)", enName:"Dr. Israr Ahmad — English audio lectures", lqName:"Lisan ul Quran — Ustad Amir Sohail", lecH:"Lectures", lec:n=>`Lecture ${n}`, part:n=>`Part ${n}`, lesson:n=>`Lesson ${n}`,
  lecAyahs:(a,b)=>`Ayahs ${a}–${b}`, intro:"Introduction", closing:"Closing speech", tafseerBtn:"▶ Dr. Israr — Urdu video", enBtn:"🎧 Dr. Israr — English audio", txtBtn:"📖 Dr. Israr — written tafsir (Urdu)", startAt:t=>`Continue at ${t}`,
  cont:"Continue", startS:"Start", openYT:"Watch on YouTube", prevL:"Previous", nextL:"Next", via:s=>`Official · ${s}`,
  lqNote:"Videos from the official channel (newest first)", getApp:"Their official app", noLec:"No lecture found for this ayah",
  closeV:"Close", openDrBig:n=>`Open Lecture ${n} on drisrar.com`, drHint:"If the video doesn't play here, tap the button above — it opens on the official website.", lastWatched:"last",
  enHint:"Audio streams from the official tanzeem.org. The app remembers your minute.", audioFail:"The audio didn't load — open it directly:", openFile:"Open audio file",
  txtNote:"Written tafsir on Quran.com (Bayan-ul-Quran, Urdu). Full book PDF: tanzeem.org", pdf:"PDF book"
});
const VS = Object.assign({ bq:{ n:0, t:{}, off:null }, en:{ n:0, t:{} }, lq:{ i:0, t:{} } }, store.get("vid", {}));
if (!VS.en) VS.en = { n:0, t:{} };
const saveV = () => store.set("vid", VS);
const mmss = s => { s = Math.floor(s || 0); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const key = (s, a) => s * 1000 + a;
const lecFor = (s, a, ser = "bq") => (RANGES[ser].find(L => L[1] && key(L[1], L[2]) <= key(s, a) && key(s, a) <= key(L[3], L[4])) || [0])[0];
const lecsInSurah = (s, ser = "bq") => RANGES[ser].filter(L => L[1] && key(L[1], L[2]) <= key(s, 999) && key(L[3], L[4]) >= key(s, 1));
function lecLabel(n, s, ser = "bq"){
  const L = RANGES[ser][n - 1];
  if (!L[1]) return n <= 4 ? T("intro") : T("closing");
  if (s) { const cnt = META.surahs[s - 1].ayahs || 999; const a = L[1] === s ? L[2] : 1, b = L[3] === s ? Math.min(L[4], cnt) : cnt; return T("lecAyahs", nf(a), nf(b)); }
  const nm = x => settings.lang === "en" ? META.surahs[x - 1].tr : META.surahs[x - 1].ar;
  const end = (x, a) => a === 999 ? nm(x) : `${nm(x)} ${nf(a)}`;
  return L[1] === L[3] ? `${nm(L[1])} ${L[4] === 999 && L[2] === 1 ? "" : nf(L[2]) + "–" + (L[4] === 999 ? "" : nf(L[4]))}`.trim() : `${end(L[1], L[2]) } – ${end(L[3], L[4])}`;
}
/* buttons for one ayah: Urdu video, English audio, written tafsir (used in the ayah menu and the word sheet) */
function israrButtons(s, a){
  const v = lecFor(s, a), e = lecFor(s, a, "en");
  return `${v ? `<button data-lec="${v}">${T("tafseerBtn")}</button>` : ""}${e ? `<button data-lecen="${e}">${T("enBtn")}</button>` : ""}<a class="btnlink" href="${TAFSIR_TXT(s, a)}" target="_blank" rel="noopener">${T("txtBtn")}</a>`;
}
/* surah header: lectures covering this surah */
function lecStrip(s){
  const row = (ser, attr, lbl, nameK) => { const ls = lecsInSurah(s, ser); if (!ls.length) return "";
    return `<div class="lh2">${esc(T(nameK))}</div><div class="chips">${ls.map(L =>
      `<button class="chip" ${attr}="${L[0]}"><b>${lbl(nf(L[0]))}</b><span>${esc(lecLabel(L[0], s, ser))}</span>${VS[ser].n === L[0] ? `<i>${T("lastWatched")}</i>` : ""}</button>`).join("")}</div>`; };
  const h = row("bq", "data-lec", x => T("lec", x), "bqName") + row("en", "data-lecen", x => T("part", x), "enName");
  return h ? `<div class="lecstrip">${h}<a class="txtlink" href="${TAFSIR_TXT(s, 1)}" target="_blank" rel="noopener">${T("txtBtn")} ↗</a></div>` : "";
}
/* player panel */
let YTP = null, ytReady = null, vCur = null, vTimer = 0;
function loadYT(){
  if (!ytReady) ytReady = new Promise(res => { window.onYouTubeIframeAPIReady = res; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); });
  return ytReady;
}
function openLecture(series, n){
  if (vCur) stopMedia();
  vCur = { series, n };
  const S = SERIES[series], start = series === "lq" ? (VS.lq.t[n] || 0) : series === "en" ? (VS.en.t[n] || 0) : 0;
  const title = series === "bq" ? `${T("lec", nf(n))} · ${esc(lecLabel(n))}` : series === "en" ? `${T("part", nf(n))} · ${esc(lecLabel(n, 0, "en"))}` : T("lesson", nf(n + 1));
  const drWatch = `https://www.drisrar.com/watch/${BQ_SLUG[n - 1]}_${BQ_CODE[n - 1]}.html`;
  let body;
  if (series === "bq") {
    const src = BQ_OK[n - 1] ? `https://ok.ru/videoembed/${BQ_OK[n - 1]}` : `https://www.drisrar.com/embed/${BQ_CODE[n - 1]}`;
    body = `<div class="vp-frame okframe"><iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen title="${esc(title)}"></iframe></div>
      <a class="vp-big" href="${drWatch}" target="_blank" rel="noopener">▶ ${T("openDrBig", nf(n))}</a>
      <p class="vp-credit">${T("drHint")}</p>`;
  } else if (series === "en") {
    body = `<div class="vp-audio"><audio id="vpAudio" controls preload="metadata" src="${EN_URL(n)}"></audio>
      <p class="vp-credit" id="vpAErr" hidden>${T("audioFail")} <a href="${EN_URL(n).replace("https:", "http:")}" target="_blank" rel="noopener"><b>${T("openFile")}</b></a></p>
      <p class="vp-credit">${T("enHint")}</p></div>`;
  } else body = `<div class="vp-frame"><div id="ytp"></div></div>`;
  $("#vpanel").innerHTML = `<div class="vp-top"><button class="iconbtn" data-v="close" aria-label="${T("back")}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg><span class="cap">${T("closeV")}</span></button>
      <div class="vp-t"><b>${esc(T(series === "bq" ? "bqName" : series === "en" ? "enName" : "lqName"))}</b><small id="vpTitle">${title}</small></div></div>
    ${body}
    <div class="vp-nav"><button class="btn ghost" data-v="prev">${T("prevL")}</button><button class="btn ghost" data-v="next">${T("nextL")}</button></div>
    <p class="vp-credit">${esc(T("via", S.credit))} · <a href="${S.src}" target="_blank" rel="noopener">${esc(series === "lq" ? T("getApp") : S.srcName)}</a>
      ${series === "lq" ? `<br>${T("lqNote")} · <a href="https://www.youtube.com/playlist?list=${S.list}" target="_blank" rel="noopener">${T("openYT")}</a>` : ""}</p>`;
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
  if (series === "en") {
    const au = $("#vpAudio");
    au.addEventListener("loadedmetadata", () => { if (start > 5 && start < au.duration - 5) au.currentTime = start; }, { once:true });
    au.addEventListener("error", () => { $("#vpAErr").hidden = false; });
    au.addEventListener("play", () => { if (P.s && !P.audio.paused) P.audio.pause(); });
    au.addEventListener("ended", () => { delete VS.en.t[n]; saveV(); if (n < 112) openLecture("en", n + 1); });
    if ("mediaSession" in navigator) try { navigator.mediaSession.metadata = new MediaMetadata({ title:`${T("part", nf(n))} · ${lecLabel(n, 0, "en")}`, artist:"Dr. Israr Ahmad", album:"Dora-e-Tarjuma-e-Quran (English)" }); } catch(e){}
    clearInterval(vTimer); vTimer = setInterval(saveVid, 4000);
  }
  if (series === "lq") VS.lq.i = n; else VS[series].n = n;
  saveV();
}
function onYTState(e){
  if (e.data !== 1 || !vCur || vCur.series !== "lq") return;
  const idx = YTP.getPlaylistIndex();
  if (idx !== vCur.n) { vCur.n = idx; VS.lq.i = idx; $("#vpTitle").textContent = T("lesson", nf(idx + 1)); saveV(); }
}
function saveVid(){
  if (!vCur) return;
  if (vCur.series === "en") { const au = $("#vpAudio"); if (au && au.currentTime > 5) { VS.en.t[vCur.n] = Math.floor(au.currentTime); saveV(); } return; }
  if (!YTP || !YTP.getCurrentTime) return;
  const t = YTP.getCurrentTime(); if (!(t > 5)) return;
  VS.lq.t[vCur.n] = Math.floor(t); saveV();
}
function stopMedia(){
  saveVid(); clearInterval(vTimer);
  const au = $("#vpAudio"); if (au) { au.pause(); au.removeAttribute("src"); au.load(); }
  if (YTP) { try { YTP.pauseVideo(); YTP.destroy(); } catch(e){} YTP = null; }
}
function closeVideo(){
  stopMedia();
  $("#vpanel").classList.remove("on"); $("#vpanel").innerHTML = ""; $("#scrim").classList.remove("on"); vCur = null;
  if (LV.view === "learn") learnHome(); else if (CUR) { const st = document.querySelector(".lecstrip"); if (st) st.outerHTML = lecStrip(CUR.n); }
}
$("#vpanel").addEventListener("click", e => {
  const b = e.target.closest("[data-v]"); if (!b || !vCur) return;
  const v = b.dataset.v;
  if (v === "close") return closeVideo();
  const max = vCur.series === "lq" ? 999 : SERIES[vCur.series].total, min = vCur.series === "lq" ? 0 : 1;
  const n = Math.min(max, Math.max(min, vCur.n + (v === "next" ? 1 : -1)));
  if (n !== vCur.n) openLecture(vCur.series, n);
});
$("#scrim").addEventListener("click", () => { if (vCur) closeVideo(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && vCur) closeVideo(); });
const lecClick = e => { const c = e.target.closest("[data-lec],[data-lecen]"); if (!c) return false;
  c.dataset.lec ? openLecture("bq", +c.dataset.lec) : openLecture("en", +c.dataset.lecen); return true; };
$("#main").addEventListener("click", lecClick);
$("#sheetBody").addEventListener("click", e => { const c = e.target.closest("[data-lec],[data-lecen]"); if (c) { closeAll(); lecClick(e); } });
/* Learn tab card */
function lecturesCard(){
  const bn = VS.bq.n || 5, en = VS.en.n || 1, et = VS.en.t[en] || 0, li = VS.lq.i || 0, lt = VS.lq.t[li] || 0;
  return `<div class="lh"><h3>${T("lecH")}</h3></div><div class="games">
    <button class="game" data-lecs="bq"><b>${esc(T("bqName"))}</b><small>${T("lec", nf(bn))} · ${esc(lecLabel(bn))}</small><small>${VS.bq.n ? T("cont") : T("startS")}</small></button>
    <button class="game" data-lecs="en"><b>${esc(T("enName"))}</b><small>${T("part", nf(en))} · ${esc(lecLabel(en, 0, "en"))}</small><small>${et ? T("startAt", mmss(et)) : (VS.en.n ? T("cont") : T("startS"))}</small></button>
    <button class="game" data-lecs="lq"><b>${esc(T("lqName"))}</b><small>${T("lesson", nf(li + 1))}</small><small>${lt ? T("startAt", mmss(lt)) : (VS.lq.i ? T("cont") : T("startS"))}</small></button></div>`;
}
$("#learn").addEventListener("click", e => { const c = e.target.closest("[data-lecs]"); if (!c) return; const s = c.dataset.lecs;
  openLecture(s, s === "bq" ? (VS.bq.n || 5) : s === "en" ? (VS.en.n || 1) : (VS.lq.i || 0)); });
