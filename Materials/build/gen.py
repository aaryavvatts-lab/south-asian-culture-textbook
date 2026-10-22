import json, os, sys
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(os.path.dirname(here))
chapters, concepts = [], []
cur = None
for line in open(os.path.join(here, "concepts.txt"), encoding="utf-8"):
    line = line.rstrip("\n")
    if not line or line.startswith("#"): continue
    p = line.split("|")
    if p[0] == "CH":
        cur = {"num": int(p[1]), "title": p[2], "slug": p[3], "sim": p[4], "code": p[5]}
        chapters.append(cur); continue
    concepts.append({"label": p[0], "code": p[1], "deps": [d for d in p[2].split(";") if d], "ch": cur["num"]})
ids = {}
for i, c in enumerate(concepts, 1):
    c["id"] = i
    assert c["label"] not in ids, "dup " + c["label"]
    assert len(c["label"]) <= 32, c["label"]
    ids[c["label"]] = c
errs = []
for c in concepts:
    for d in c["deps"]:
        if d not in ids: errs.append(f"{c['label']}: unknown dep {d}"); continue
        dc = ids[d]
        if c["ch"] != 0 and (dc["ch"] > c["ch"] or dc["ch"] == 0): errs.append(f"{c['label']} (ch{c['ch']}) -> {d} (ch{dc['ch']})")
        if dc["id"] >= c["id"] and dc["ch"] == c["ch"]: errs.append(f"order: {c['label']} before dep {d}")
if errs: print("\n".join(errs)); sys.exit(1)
# concept-list.md
out = ["# Concept List", "", "Each concept is introduced in exactly one chapter. Labels are exact: use them verbatim.", ""]
for ch in chapters:
    out.append(f"## Chapter {ch['num']}: {ch['title']}" if ch["num"] else "## Appendices")
    for c in concepts:
        if c["ch"] == ch["num"]: out.append(f"{c['id']}. {c['label']} [{c['code']}]")
    out.append("")
open(os.path.join(root, "Materials", "concept-list.md"), "w").write("\n".join(out))
os.makedirs(os.path.join(root, "docs", "learning-graph"), exist_ok=True)
import csv
with open(os.path.join(root, "docs", "learning-graph", "learning-graph.csv"), "w", newline="") as f:
    w = csv.writer(f); w.writerow(["ConceptID", "ConceptLabel", "Dependencies", "TaxonomyID"])
    for c in concepts: w.writerow([c["id"], c["label"], "|".join(str(ids[d]["id"]) for d in c["deps"]), c["code"]])
json.dump([{k: ch[k] for k in ("num", "slug", "sim", "title")} for ch in chapters if ch["num"]], open(os.path.join(here, "chapters.json"), "w"), indent=1)
print(len(concepts), "concepts;", len(chapters) - 1, "chapters; per chapter:", [sum(1 for c in concepts if c["ch"] == ch["num"]) for ch in chapters])
