"""
Bundle the app's scripts into ONE file (faster first open: 1 request instead of 40).
Edit the files in js/ as usual, then run:   python3 scripts/build.py
- the load order is scripts/js-order.txt (add new files there)
- output: js/app.min.js, and index.html is pointed at it with a content hash (?v=…) so phones fetch the new copy
Needs esbuild (npx esbuild …) for the light minification; without it the bundle is written unminified.
"""
import hashlib, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
order = [l.strip() for l in open(os.path.join(ROOT, "scripts/js-order.txt")) if l.strip() and not l.startswith("#")]
src = "".join(f"\n/* ---- {f} ---- */\n" + open(os.path.join(ROOT, f), encoding="utf8").read().rstrip() + "\n;\n" for f in order)
tmp = os.path.join(ROOT, "js/app.js"); open(tmp, "w", encoding="utf8").write(src)
out = os.path.join(ROOT, "js/app.min.js")
esb = os.environ.get("ESBUILD") or "esbuild"
try:
    subprocess.run([esb, tmp, "--minify-whitespace", "--minify-syntax", "--charset=utf8", f"--outfile={out}", "--log-level=warning"], check=True)
except Exception as e:
    print("esbuild not available, writing unminified bundle:", e); open(out, "w", encoding="utf8").write(src)
os.remove(tmp)
h = hashlib.sha1(open(out, "rb").read()).hexdigest()[:10]
idx = os.path.join(ROOT, "index.html"); html = open(idx, encoding="utf8").read()
html = re.sub(r'(?:<script src="js/[a-z0-9]+\.js(?:\?v=[^"]*)?"></script>\n?)+', f'<script src="js/app.min.js?v={h}"></script>\n', html, count=1)
open(idx, "w", encoding="utf8").write(html)
print("js/app.min.js", round(os.path.getsize(out) / 1024), "KB  (", len(order), "files )  v=" + h)
