import math, os
OUT = os.path.join(os.path.dirname(__file__), "..", "mascot-svg")
NAVY="#1B2356"; BLUE="#1E4FB8"; BLUE2="#2F6BE0"; TEAL="#0E8C8C"; GREEN="#2E9E5B"; GOLD="#F4B429"; MARI="#F28C12"; CREAM="#FBF1E1"

def tail(cx, cy, spread, n, r_len):
    s = []
    for i in range(n):
        a = math.radians(-90 - spread/2 + spread*i/(n-1))
        x2, y2 = cx + r_len*math.cos(a), cy + r_len*math.sin(a)
        s.append(f'<line x1="{cx}" y1="{cy}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{GREEN}" stroke-width="5" stroke-linecap="round"/>')
        # feather vane
        s.append(f'<ellipse cx="{(cx+x2)/2+ (x2-cx)*0.15:.1f}" cy="{(cy+y2)/2+(y2-cy)*0.15:.1f}" rx="16" ry="{r_len*0.36:.1f}" fill="{GREEN}" opacity="0.55" transform="rotate({math.degrees(a)+90:.1f} {(cx+x2)/2+(x2-cx)*0.15:.1f} {(cy+y2)/2+(y2-cy)*0.15:.1f})"/>')
    for i in range(n):
        a = math.radians(-90 - spread/2 + spread*i/(n-1))
        x2, y2 = cx + r_len*math.cos(a), cy + r_len*math.sin(a)
        s.append(f'<ellipse cx="{x2:.1f}" cy="{y2:.1f}" rx="21" ry="25" fill="{GOLD}" transform="rotate({math.degrees(a)+90:.1f} {x2:.1f} {y2:.1f})"/>')
        s.append(f'<ellipse cx="{x2:.1f}" cy="{y2:.1f}" rx="14" ry="17" fill="{TEAL}" transform="rotate({math.degrees(a)+90:.1f} {x2:.1f} {y2:.1f})"/>')
        s.append(f'<circle cx="{x2:.1f}" cy="{y2:.1f}" r="8" fill="{NAVY}"/>')
    return "\n".join(s)

def body(eyes="open", mouth="smile", blush=True):
    s = []
    # body
    s.append(f'<path d="M256 250 C 200 270, 178 350, 196 400 C 210 440, 302 440, 316 400 C 334 350, 312 270, 256 250 Z" fill="{BLUE}"/>')
    s.append(f'<path d="M256 290 C 228 305, 220 360, 232 395 C 244 420, 268 420, 280 395 C 292 360, 284 305, 256 290 Z" fill="{BLUE2}" opacity="0.6"/>')
    # neck + head
    s.append(f'<path d="M236 262 C 232 225, 236 200, 246 180 L 268 180 C 278 205, 280 230, 276 262 Z" fill="{BLUE}"/>')
    s.append(f'<circle cx="256" cy="160" r="46" fill="{BLUE}"/>')
    # crest
    for dx, h in [(-14, 46), (0, 54), (14, 46)]:
        s.append(f'<line x1="{256+dx*0.4}" y1="118" x2="{256+dx}" y2="{118-h+20}" stroke="{NAVY}" stroke-width="3" stroke-linecap="round"/>')
        s.append(f'<circle cx="{256+dx}" cy="{118-h+18}" r="7" fill="{TEAL}" stroke="{NAVY}" stroke-width="2"/>')
    # face patch
    s.append(f'<ellipse cx="240" cy="150" rx="16" ry="11" fill="{CREAM}"/><ellipse cx="272" cy="150" rx="16" ry="11" fill="{CREAM}"/>')
    if eyes == "open":
        s.append(f'<circle cx="241" cy="151" r="7" fill="{NAVY}"/><circle cx="273" cy="151" r="7" fill="{NAVY}"/><circle cx="243.5" cy="148.5" r="2.4" fill="#fff"/><circle cx="275.5" cy="148.5" r="2.4" fill="#fff"/>')
    elif eyes == "happy":
        s.append(f'<path d="M233 153 Q241 143 249 153" stroke="{NAVY}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M265 153 Q273 143 281 153" stroke="{NAVY}" stroke-width="4" fill="none" stroke-linecap="round"/>')
    elif eyes == "up":
        s.append(f'<circle cx="244" cy="147" r="7" fill="{NAVY}"/><circle cx="276" cy="147" r="7" fill="{NAVY}"/><circle cx="246" cy="144" r="2.4" fill="#fff"/><circle cx="278" cy="144" r="2.4" fill="#fff"/>')
    elif eyes == "wide":
        s.append(f'<circle cx="241" cy="151" r="8.5" fill="{NAVY}"/><circle cx="273" cy="151" r="8.5" fill="{NAVY}"/><circle cx="244" cy="148" r="3" fill="#fff"/><circle cx="276" cy="148" r="3" fill="#fff"/>')
    # beak
    s.append(f'<path d="M248 166 L264 166 L256 180 Z" fill="{MARI}" stroke="#C25E0A" stroke-width="1.5" stroke-linejoin="round"/>')
    if blush:
        s.append(f'<ellipse cx="226" cy="170" rx="8" ry="5" fill="{MARI}" opacity="0.55"/><ellipse cx="286" cy="170" rx="8" ry="5" fill="{MARI}" opacity="0.55"/>')
    # feet
    for fx in (236, 276):
        s.append(f'<path d="M{fx} 432 L{fx} 452 M{fx} 452 L{fx-10} 462 M{fx} 452 L{fx} 464 M{fx} 452 L{fx+10} 462" stroke="{MARI}" stroke-width="5" stroke-linecap="round" fill="none"/>')
    return "\n".join(s)

def wing(side, pose):
    # side -1 left, 1 right; pose: down, up, chin, point, palm, thumbs
    x0 = 256 + side*52
    if pose == "down":
        return f'<path d="M{256+side*40} 300 C {256+side*78} 320, {256+side*80} 380, {256+side*56} 405 C {256+side*50} 370, {256+side*44} 340, {256+side*40} 300 Z" fill="{NAVY}" opacity="0.85"/>'
    if pose == "up":
        return f'<path d="M{256+side*44} 300 C {256+side*90} 280, {256+side*112} 230, {256+side*118} 190 C {256+side*96} 214, {256+side*72} 250, {256+side*40} 320 Z" fill="{NAVY}" opacity="0.9"/>'
    if pose == "chin":
        return f'<path d="M{256+side*42} 300 C {256+side*70} 270, {256+side*60} 210, {256+side*26} 188 C {256+side*40} 220, {256+side*44} 250, {256+side*30} 320 Z" fill="{NAVY}" opacity="0.9"/>'
    if pose == "point":
        return f'<path d="M{256+side*44} 300 C {256+side*90} 300, {256+side*120} 280, {256+side*150} 262 C {256+side*120} 292, {256+side*90} 318, {256+side*44} 330 Z" fill="{NAVY}" opacity="0.9"/>'
    if pose == "palm":
        return (f'<path d="M{256+side*44} 300 C {256+side*86} 290, {256+side*104} 250, {256+side*108} 220 C {256+side*86} 246, {256+side*70} 276, {256+side*40} 322 Z" fill="{NAVY}" opacity="0.9"/>'
                f'<ellipse cx="{256+side*110}" cy="212" rx="16" ry="20" fill="{NAVY}"/>')
    return ""

def svg(name, inner):
    open(os.path.join(OUT, name + ".svg"), "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">\n{inner}\n</svg>\n')

def diya(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})"><path d="M-34 0 Q0 30 34 0 Q24 -6 0 -6 Q-24 -6 -34 0 Z" fill="{MARI}" stroke="#B4470F" stroke-width="2"/>'
            f'<path d="M0 -8 C -10 -24, -4 -40, 0 -50 C 4 -40, 10 -24, 0 -8 Z" fill="{GOLD}"/><path d="M0 -12 C -4 -22, -2 -30, 0 -36 C 2 -30, 4 -22, 0 -12 Z" fill="#fff" opacity="0.8"/></g>')

def marigold(x, y, r):
    s = [f'<g transform="translate({x} {y})">']
    for k in range(10):
        a = k*36
        s.append(f'<ellipse cx="0" cy="{-r*0.55:.1f}" rx="{r*0.38:.1f}" ry="{r*0.55:.1f}" fill="{MARI}" transform="rotate({a})"/>')
    for k in range(8):
        s.append(f'<ellipse cx="0" cy="{-r*0.3:.1f}" rx="{r*0.28:.1f}" ry="{r*0.36:.1f}" fill="{GOLD}" transform="rotate({k*45+20})"/>')
    s.append(f'<circle r="{r*0.18:.1f}" fill="#C25E0A"/></g>')
    return "".join(s)

fan_small = tail(256, 330, 150, 9, 175)
fan_big = tail(256, 330, 200, 13, 200)
svg("neutral", fan_small + body() + wing(-1, "down") + wing(1, "down"))
svg("welcome", fan_small + body(eyes="happy") + wing(-1, "down") + wing(1, "up"))
svg("thinking", fan_small + body(eyes="up", blush=False) + wing(-1, "down") + wing(1, "chin") +
    f'<circle cx="352" cy="96" r="9" fill="{NAVY}" opacity="0.5"/><circle cx="380" cy="70" r="13" fill="{NAVY}" opacity="0.6"/><circle cx="418" cy="40" r="19" fill="{NAVY}" opacity="0.7"/>')
svg("tip", fan_small + body() + wing(-1, "down") + wing(1, "point") + diya(420, 262, 1.1))
svg("warning", fan_small + body(eyes="wide", blush=False) + wing(-1, "down") + wing(1, "palm") +
    f'<g transform="translate(108 120)"><path d="M0 -44 L40 26 L-40 26 Z" fill="{GOLD}" stroke="{NAVY}" stroke-width="5" stroke-linejoin="round"/><rect x="-4" y="-18" width="8" height="26" rx="3" fill="{NAVY}"/><circle cx="0" cy="16" r="5" fill="{NAVY}"/></g>')
svg("encouraging", fan_small + body(eyes="happy") + wing(-1, "up") + wing(1, "up") +
    f'<path d="M418 120 l8 18 20 2 -15 13 5 20 -18 -11 -18 11 5 -20 -15 -13 20 -2 Z" fill="{GOLD}"/><path d="M94 150 l6 13 15 2 -11 10 3 15 -13 -8 -13 8 3 -15 -11 -10 15 -2 Z" fill="{MARI}"/>')
svg("celebration", fan_big + body(eyes="happy") + wing(-1, "up") + wing(1, "up") +
    marigold(70, 70, 26) + marigold(442, 66, 22) + marigold(440, 440, 20) + marigold(72, 440, 20) +
    "".join(f'<rect x="{x}" y="{y}" width="10" height="5" rx="2" fill="{c}" transform="rotate({r} {x} {y})"/>' for x, y, c, r in [(140,40,MARI,20),(370,30,TEAL,-30),(110,210,GOLD,45),(400,200,MARI,-15),(170,470,TEAL,10),(350,480,GOLD,-40)]))
print("ok")
