"""
Make ONE self-contained HTML file (all data embedded, gzip-compressed) for
previewing or sharing without a server:  python scripts/bundle_single.py
Output: dist/quran-app-single.html
"""
import base64, gzip, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def b64(path):
    with open(os.path.join(ROOT, path), "rb") as f:
        return base64.b64encode(gzip.compress(f.read(), 9)).decode()
html = open(os.path.join(ROOT, "index.html"), encoding="utf8").read()
parts = ['window.EMBED={meta:"%s",occ:"%s",vocab:"%s",s:{' % (b64("data/meta.json"), b64("data/occ.json"), b64("data/learn/vocab.json"))]
parts.append(",".join('%d:"%s"' % (n, b64(f"data/s/{n:03d}.json")) for n in range(1, 115)))
parts.append("},t:{")
tdir = os.path.join(ROOT, "data", "timing")
parts.append(",".join('"%s":"%s"' % (f[:-5], b64(f"data/timing/{f}")) for f in sorted(os.listdir(tdir)) if f.endswith(".json")))
parts.append("}};")
import re as _re
html = _re.sub(r'<link rel="stylesheet" href="(css/[^"?]+)[^"]*">', lambda m: "<style>" + open(os.path.join(ROOT, m.group(1)), encoding="utf8").read() + "</style>", html)
html = _re.sub(r'<script src="(js/[^"?]+)[^"]*"></script>', lambda m: "<script>" + open(os.path.join(ROOT, m.group(1)), encoding="utf8").read() + "</script>", html)
html = html.replace("<!--EMBED-->", "<script>" + "".join(parts) + "</script>")
html = html.replace('<link rel="manifest" href="manifest.webmanifest">\n', "").replace('<link rel="icon" href="icon.svg" type="image/svg+xml">\n', "")
os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
out = os.path.join(ROOT, "dist", "quran-app-single.html")
open(out, "w", encoding="utf8").write(html)
print(out, round(os.path.getsize(out) / 1e6, 2), "MB")
