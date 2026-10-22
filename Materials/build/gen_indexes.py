import json, re, os
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
chs = json.load(open(os.path.join(root, "Materials/build/chapters.json")))
def fm(path, key):
    t = open(path, encoding="utf-8").read()
    m = re.search(r'^%s:\s*"?(.*?)"?\s*$' % key, t.split("---")[1] if t.startswith("---") else "", re.M)
    return m.group(1) if m else ""
parts = {1: "Part 1: Foundations", 7: "Part 2: Living Culture", 17: "Part 3: The Eight Countries", 21: "Part 4: Here and Now"}
out = ['---', 'title: "List of Chapters"', 'description: "All 22 chapters of Roots & Rivers with a one-line summary of each."', '---', '', '# List of Chapters', '',
       'Each chapter has the chapter itself, a 10-question quiz and a list of references. Start anywhere: each chapter lists what you should read first.', '']
for c in chs:
    if c["num"] in parts: out += ["## " + parts[c["num"]], ""]
    d = fm(os.path.join(root, "docs/chapters", c["slug"], "index.md"), "description")
    s = c["slug"]
    out.append(f'{c["num"]}. **[{c["title"]}]({s}/index.md)**: {d} ([Quiz]({s}/quiz.md) · [References]({s}/references.md))')
    if c["num"] in (6, 16, 20, 22): out.append("")
open(os.path.join(root, "docs/chapters/index.md"), "w").write("\n".join(out) + "\n")
g = ['---', 'title: "MicroSims"', 'description: "All 22 interactive MicroSims in Roots & Rivers."', '---', '', '# MicroSims', '',
     'Every chapter has one interactive simulation. They work on phones and computers, need no login, and save nothing about you. Click a picture to open the sim.', '',
     '<div class="grid cards" markdown>', '']
for c in chs:
    sim = c["sim"]; ip = os.path.join(root, "docs/sims", sim, "index.md")
    title = fm(ip, "title") or sim; d = fm(ip, "description")
    g += [f'-   [![{title}]({sim}/{sim}.png)]({sim}/index.md)', '', f'    **[{title}]({sim}/index.md)**', '', f'    {d}', '', f'    *Chapter {c["num"]}: [{c["title"]}](../chapters/{c["slug"]}/index.md)*', '']
g += ['</div>', '', 'You can also explore the [Learning Graph Viewer](graph-viewer/main.html), a map of all 368 concepts in the book.']
open(os.path.join(root, "docs/sims/index.md"), "w").write("\n".join(g) + "\n")
print("ok")
