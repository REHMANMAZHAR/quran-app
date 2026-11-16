/* QuranToSoul — "Report a mistake" (Cloudflare Pages Function).
   POST /api/report  → saves one report in the D1 database bound as DB.
   GET  /api/report?key=…[&format=csv]  → lists the latest reports (key = the REPORT_KEY secret set in Cloudflare).
   Until the database is bound, POST answers 503 and the app falls back to opening an email. */
const H = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: H });
const clip = (s, n) => String(s == null ? "" : s).slice(0, n);
const TABLE = `CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, ref TEXT, word TEXT, kind TEXT, text TEXT,
  email TEXT, lang TEXT, ver TEXT, country TEXT, status TEXT DEFAULT 'new')`;

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "no-db" }, 503);
  let b; try { b = await request.json(); } catch { return json({ ok: false, error: "bad-json" }, 400); }
  if (b.website) return json({ ok: true });                       // honeypot: bots fill every field
  const row = { ref: clip(b.ref, 40), word: clip(b.word, 160), kind: clip(b.kind, 20), text: clip(b.text, 3000).trim(),
    email: clip(b.email, 160), lang: clip(b.lang, 5), ver: clip(b.ver, 30) };
  if (!row.ref || row.text.length < 3) return json({ ok: false, error: "empty" }, 400);
  const country = (request.cf && request.cf.country) || "";
  await env.DB.prepare(TABLE).run();
  const r = await env.DB.prepare("INSERT INTO reports (at, ref, word, kind, text, email, lang, ver, country) VALUES (?,?,?,?,?,?,?,?,?)")
    .bind(new Date().toISOString(), row.ref, row.word, row.kind, row.text, row.email, row.lang, row.ver, country).run();
  return json({ ok: true, id: r.meta && r.meta.last_row_id });
}

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  if (!env.REPORT_KEY || u.searchParams.get("key") !== env.REPORT_KEY) return json({ ok: false, error: "forbidden" }, 403);
  if (!env.DB) return json({ ok: false, error: "no-db" }, 503);
  await env.DB.prepare(TABLE).run();
  const { results } = await env.DB.prepare("SELECT * FROM reports ORDER BY id DESC LIMIT 500").all();
  if (u.searchParams.get("format") === "csv") {
    const cols = ["id", "at", "ref", "word", "kind", "text", "email", "lang", "ver", "country", "status"];
    const q = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = "﻿" + [cols.join(","), ...results.map(r => cols.map(c => q(r[c])).join(","))].join("\n");
    return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=reports.csv", "cache-control": "no-store" } });
  }
  return json({ ok: true, count: results.length, reports: results });
}
