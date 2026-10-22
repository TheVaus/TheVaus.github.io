"""Turn [[key]] / [[key|label]] in the site's HTML into wikilinks and write wiki-data.js."""
import json, re, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from glossary import G
root = pathlib.Path(__file__).resolve().parent.parent
pat = re.compile(r"\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]")
missing = set()
for f in sorted(root.glob("*.html")):
    s = f.read_text()
    def rep(m):
        key, label = m.group(1), m.group(2)
        if key not in G:
            missing.add(key); return m.group(0)
        title, href, _ = G[key]
        page, _, frag = href.partition("#")
        if page == f.name and frag: href = "#" + frag
        return f'<a class="wl" href="{href}" data-wl="{key}">{label or title}</a>'
    new = pat.sub(rep, s)
    if new != s:
        f.write_text(new); print("linked", f.name, len(pat.findall(s)))
data = {k: {"t": t, "h": h, "d": d} for k, (t, h, d) in G.items()}
(root / "wiki-data.js").write_text("window.WIKI = " + json.dumps(data, ensure_ascii=False, indent=0) + ";\n")
if missing: print("UNKNOWN KEYS:", sorted(missing)); sys.exit(1)
