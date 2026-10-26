"""Weekly: fetch the cube list from TheVaus/OPTCG-Cube and, if the set of cards changed, save it as a new version.

Writes cube/vN-YYYY-MM.txt and adds a row to cube/versions.json (newest first). The cube repo is private, so a weekly
scheduled Claude task clones it and runs: CUBE_SRC=file:///path/to/OPTCG-Cube/cube.txt python3 tools/sync_cube.py
Lines like "1xOP17-039" or "1 OP01-006 Otama" are accepted; the saved file keeps the source's text as is.
"""
import datetime, json, os, pathlib, re, sys, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = os.environ.get("CUBE_SRC", "https://raw.githubusercontent.com/TheVaus/OPTCG-Cube/main/cube.txt")
LINE = re.compile(r"^(\d+)\s*x?\s*([A-Z]+\d*-\d+)")

def cards(text):
    out = {}
    for l in text.splitlines():
        m = LINE.match(l.strip())
        if m: out[m.group(2)] = out.get(m.group(2), 0) + int(m.group(1))
    return out

def main():
    try:
        text = urllib.request.urlopen(SRC, timeout=30).read().decode("utf-8").replace("\r", "")
    except Exception as e:
        print(f"Couldn't fetch {SRC}: {e}"); return 0
    new = cards(text)
    if not new:
        print("The cube list is empty or unreadable; nothing changed."); return 0
    meta_path = ROOT / "cube/versions.json"
    meta = json.loads(meta_path.read_text())
    latest = meta["versions"][0]
    old = cards((ROOT / latest["file"]).read_text())
    if new == old:
        print(f"No change since version {latest['version']}."); return 0
    n = latest["version"] + 1
    month = datetime.date.today().strftime("%Y-%m")
    rel = f"cube/v{n}-{month}.txt"
    (ROOT / rel).write_text(text.strip() + "\n")
    meta["versions"].insert(0, {
        "version": n, "date": month, "file": rel, "cards": sum(new.values()),
        "added": len(set(new) - set(old)), "removed": len(set(old) - set(new)),
    })
    meta_path.write_text(json.dumps(meta, indent=2) + "\n")
    print(f"Saved version {n}: {sum(new.values())} cards.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
