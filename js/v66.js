"use strict";
/* ---------- v66: "Report a mistake" inside the app; links to About and Privacy ----------
   The report goes to our own database (Cloudflare D1, functions/api/report.js). If that is not reachable,
   it falls back to the email it used before, already filled in. */
Object.assign(L.ur, { lnAbout:"ہمارے بارے میں اور ماخذ", lnPriv:"رازداری کی پالیسی",
  rpH:"غلطی کی اطلاع دیں", rpWord:"یہ لفظ غلط ہے؟ اطلاع دیں", rpKind:"کس چیز میں غلطی ہے؟",
  rpKinds:[["meaning","لفظ کا معنی"],["grammar","گرامر"],["translation","ترجمہ"],["arabic","عربی متن"],["audio","آڈیو"],["other","کچھ اور"]],
  rpText:"کیا غلط ہے، اور درست کیا ہونا چاہیے؟ حوالہ ہو تو لکھ دیں۔", rpEmail:"ای میل (اختیاری، جواب چاہیں تو)",
  rpSend:"بھیجیں", rpSending:"بھیجا جا رہا ہے…", rpThanks:"شکریہ! آپ کی اطلاع مل گئی، ان شاء اللہ درست کر دی جائے گی۔", rpShort:"براہِ کرم تھوڑی وضاحت لکھیں۔",
  rpMail:"ابھی براہِ راست نہیں بھیجی جا سکی — ای میل کھل رہی ہے، بس بھیج دیں۔" });
Object.assign(L.en, { lnAbout:"About & sources", lnPriv:"Privacy policy",
  rpH:"Report a mistake", rpWord:"Something wrong with this word? Report it", rpKind:"What is wrong?",
  rpKinds:[["meaning","Word meaning"],["grammar","Grammar"],["translation","Translation"],["arabic","Arabic text"],["audio","Audio"],["other","Something else"]],
  rpText:"What is wrong, and what should it be? Add a reference if you have one.", rpEmail:"Email (optional, if you want a reply)",
  rpSend:"Send", rpSending:"Sending…", rpThanks:"Thank you! Your report has arrived and will be checked, in sha Allah.", rpShort:"Please write a little more.",
  rpMail:"Couldn't send it directly just now — your email app is opening with it filled in; just press send." });

const RP_VER = "v66";
function reportSheet(ref, word, kind){
  $("#sheetBody").dataset.ayah = "";
  $("#sheetBody").innerHTML = `<div class="rp">
    <h3>⚑ ${T("rpH")}</h3>
    <p class="rp-ref"><b dir="ltr">${esc(ref)}</b>${word ? ` · <span class="rp-w">${esc(word)}</span>` : ""}</p>
    <p class="rp-l">${T("rpKind")}</p>
    <div class="rp-kinds">${T("rpKinds").map(([k, l]) => `<button type="button" data-rpk="${k}" aria-pressed="${k === (kind || (word ? "meaning" : "translation"))}">${l}</button>`).join("")}</div>
    <textarea id="rpText" rows="5" placeholder="${esc(T("rpText"))}"></textarea>
    <input id="rpEmail" type="email" inputmode="email" autocomplete="email" placeholder="${esc(T("rpEmail"))}">
    <input id="rpWeb" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="rp-hp">
    <div class="wd-actions"><button class="btn" id="rpSend" data-ref="${esc(ref)}" data-word="${esc(word || "")}">${T("rpSend")}</button></div>
    <p class="rp-msg" id="rpMsg" role="status"></p></div>`;
  openSheet();
  setTimeout(() => { const t = $("#rpText"); if (t) t.focus(); }, 250);
}
function rpMailto(ref, word, kind, text){
  const body = `${text}\n\n—\nLocation: ${ref}${word ? `\nWord: ${word}` : ""}\nType: ${kind}\nApp: ${RP_VER} ${location.href}\nLanguage: ${settings.lang}`;
  location.href = `mailto:qurantosoulapp@gmail.com?subject=${encodeURIComponent(T("reportSubj", ref))}&body=${encodeURIComponent(body)}`;
}
$("#sheetBody").addEventListener("click", async e => {
  const k = e.target.closest("[data-rpk]");
  if (k) { document.querySelectorAll("#sheetBody [data-rpk]").forEach(b => b.setAttribute("aria-pressed", b === k)); return; }
  const go = e.target.closest("[data-rpopen]");
  if (go) { const [ref, word] = go.dataset.rpopen.split("|"); reportSheet(ref, word, "meaning"); return; }
  const s = e.target.closest("#rpSend"); if (!s) return;
  const text = $("#rpText").value.trim(), msg = $("#rpMsg");
  if (text.length < 3) { msg.textContent = T("rpShort"); $("#rpText").focus(); return; }
  const kb = document.querySelector("#sheetBody [data-rpk][aria-pressed=true]"), kind = kb ? kb.dataset.rpk : "other";
  const payload = { ref: s.dataset.ref, word: s.dataset.word, kind, text, email: $("#rpEmail").value.trim(), lang: settings.lang, ver: RP_VER, website: $("#rpWeb").value };
  s.disabled = true; s.textContent = T("rpSending");
  try {
    const r = await fetch("/api/report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error(r.status);
    closeAll(); toast(esc(T("rpThanks")), 4200);
  } catch (err) {
    msg.textContent = T("rpMail"); s.disabled = false; s.textContent = T("rpSend");
    setTimeout(() => rpMailto(payload.ref, payload.word, kind, text), 900);
  }
});
/* the ayah menu's existing ⚑ button now opens the form instead of going straight to email */
reportMistake = function(ref){ reportSheet(ref, "", "translation"); };
/* and every word sheet ends with a small "report this word" link */
const _openWord66 = openWord;
openWord = function(a, i){
  const r = _openWord66.apply(this, arguments);
  const add = () => {
    const sb = $("#sheetBody"); if (!sb || sb.querySelector(".rp-open") || !CUR || !CUR.ayahs[a - 1]) return;
    const w = CUR.ayahs[a - 1].w[i]; if (!w) return;
    sb.insertAdjacentHTML("beforeend", `<p class="rp-open"><button type="button" data-rpopen="${CUR.n}:${a}:${i + 1}|${esc(w[0])}">⚑ ${T("rpWord")}</button></p>`);
  };
  Promise.resolve(r).then(() => setTimeout(add, 60));
  return r;
};
