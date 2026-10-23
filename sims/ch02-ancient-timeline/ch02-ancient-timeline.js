// Ancient Timeline: South Asia, about 7000 BCE to 550 CE (Roots & Rivers, Chapter 2)
// CANVAS_HEIGHT = 760 (drawHeight 670 + controlHeight 90); iframe height 762px
// Drag the year slider (or press Play) to move through time. Places on a
// schematic map light up while they were important, and an event card
// explains what was happening. Click or tap a dot to read about that place.
// The map is schematic: no borders are drawn. Dates are approximate.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 670;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let yearSlider, playButton, eraSelect;
let isRunning = false; // MicroSims always start paused

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const SEA = '#D6ECF0';
const LAND = '#F3E3C3';

// Years: negative = BCE, positive = CE. There is no year 0 in this sim.
const YEAR_MIN = -7000;
const YEAR_MAX = 550;

// The slider runs 0..1000 and maps to years with a piecewise scale,
// so the crowded later centuries get more room than the long early ones.
const SCALE = [
  [0, -7000],
  [180, -3300],
  [380, -1500],
  [560, -600],
  [1000, 550]
];

function sliderToYear(s) {
  for (let i = 0; i < SCALE.length - 1; i++) {
    const a = SCALE[i], b = SCALE[i + 1];
    if (s <= b[0]) return Math.round(a[1] + (s - a[0]) * (b[1] - a[1]) / (b[0] - a[0]));
  }
  return YEAR_MAX;
}

function yearToSlider(y) {
  for (let i = 0; i < SCALE.length - 1; i++) {
    const a = SCALE[i], b = SCALE[i + 1];
    if (y <= b[1]) return a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]);
  }
  return 1000;
}

// Period bands on the timeline (approximate; sources in the chapter fact log)
const periods = [
  { name: 'Mehrgarh farming', short: 'Mehrgarh', start: -7000, end: -2600, color: '#C9B48A' },
  { name: 'Indus Valley Civilization', short: 'Indus', start: -3300, end: -1300, color: '#9CC5A1' },
  { name: 'Vedic Period', short: 'Vedic', start: -1500, end: -500, color: '#E8A7A0' },
  { name: 'Mahajanapadas', short: 'Kingdoms', start: -600, end: -321, color: '#F6C98B' },
  { name: 'Maurya Empire', short: 'Maurya', start: -321, end: -185, color: MARIGOLD },
  { name: 'Sangam Age (south)', short: 'Sangam', start: -300, end: 300, color: '#B9D88F' },
  { name: 'Kushan Empire', short: 'Kushan', start: 30, end: 375, color: '#9ED3DD' },
  { name: 'Gupta Empire', short: 'Gupta', start: 320, end: 550, color: GOLD }
];

// Event cards: shown while the year is inside [from, to)
const events = [
  { from: -7000, to: -5500, title: 'About 7000 BCE: the first farmers',
    text: 'At Mehrgarh, near the Bolan Pass in Balochistan (Pakistan), people grow wheat and barley and herd sheep, goats and cattle. It is one of the oldest farming villages in South Asia. (A 2025 study of teeth suggests a later start, about 5200 to 4900 BCE.)' },
  { from: -5500, to: -3300, title: 'Farming villages spread',
    text: 'Villages grow across the Indus region. People make pottery, beads and tools, and trade with neighbors. These villages are the roots of the later cities.' },
  { from: -3300, to: -2600, title: 'About 3300 BCE: early Indus towns',
    text: 'Towns such as Harappa grow along the Indus and its tributaries. Archaeologists call this the Early Harappan phase.' },
  { from: -2600, to: -1900, title: 'About 2600 to 1900 BCE: the Indus cities',
    text: 'Harappa, Mohenjo-daro and other cities have grid streets, baked-brick houses and covered drains. Traders use stamp seals carved with animals and short lines of a script no one can read today.' },
  { from: -1900, to: -1500, title: 'After about 1900 BCE: the cities fade',
    text: 'The big cities shrink and are left behind, slowly, over generations. People move to smaller villages. Changing rivers and climate are likely causes. Speakers of early Indo-Aryan languages begin arriving from the northwest after about 2000 BCE.' },
  { from: -1500, to: -1000, title: 'About 1500 to 1000 BCE: the Rigveda',
    text: 'In the Punjab region, poets compose the hymns of the Rigveda in an early form of Sanskrit. Families of priests memorize them exactly and pass them on by voice for many centuries.' },
  { from: -1000, to: -600, title: 'Later Vedic period',
    text: 'Vedic culture spreads east into the Ganga plain. More Vedic texts are composed, and later the first Upanishads.' },
  { from: -600, to: -321, title: 'About 600 BCE: sixteen great kingdoms',
    text: 'The Mahajanapadas, sixteen kingdoms and republics, rise in the north. New cities appear. The Buddha and Mahavira teach in the Ganga plain in the 6th or 5th century BCE. Taxila grows as a center of learning. Magadha grows strongest.' },
  { from: -321, to: -268, title: 'About 321 BCE: the Maurya Empire',
    text: 'Chandragupta Maurya founds an empire with its capital at Pataliputra (now Patna). It becomes the first empire to cover most of the subcontinent.' },
  { from: -268, to: -232, title: 'Ashoka rules (about 268 to 232 BCE)',
    text: 'After a bloody war in Kalinga (about 260 BCE), Ashoka has edicts about dhamma, right conduct, carved on rocks and pillars across his empire, as far west as Kandahar in Afghanistan. Buddhist missions reach Sri Lanka.' },
  { from: -232, to: -30, title: 'After the Mauryas',
    text: 'The Maurya Empire weakens and ends about 185 BCE. Many smaller kingdoms rule. In the Tamil south, the Sangam Age begins: Chera, Chola and Pandya kings, Tamil poetry, and sea trade.' },
  { from: -30, to: 320, title: 'Kushans in the north, Sangam poets in the south',
    text: 'The Kushan Empire rules from Bactria to the Ganga plain. Kanishka (2nd century CE) has capitals at Peshawar and Mathura. Silk Road trade and Gandhara art flourish. In the south, ports like Muziris trade pepper with Rome.' },
  { from: 320, to: 427, title: 'About 320 CE: the Gupta Empire',
    text: 'Chandragupta I starts Gupta rule from Magadha. Under later Gupta kings, poets such as Kalidasa write in Sanskrit, and temple art grows.' },
  { from: 427, to: 551, title: 'Nalanda and the end of the Guptas',
    text: 'Kumaragupta I founds the Buddhist monastery of Nalanda (about 427 CE). In 499 CE Aryabhata, age 23, writes his book on mathematics and astronomy. Huna invasions weaken the empire, which ends by the mid-500s.' }
];

// Places: position in map units (0..1), years when lit, country today, note.
// Positions are only roughly geographic. Not to scale.
const places = [
  { name: 'Mehrgarh', side: 'R', u: 0.20, v: 0.32, from: -7000, to: -2500, country: 'Pakistan',
    note: 'One of the oldest farming villages in South Asia, about 7000 BCE (some say later).' },
  { name: 'Harappa', side: 'L', u: 0.33, v: 0.21, from: -3300, to: -1700, country: 'Pakistan',
    note: 'The first Indus city excavated (1921). It gave the civilization its other name, Harappan.' },
  { name: 'Mohenjo-daro', side: 'R', u: 0.24, v: 0.42, from: -2500, to: -1700, country: 'Pakistan',
    note: 'A planned Indus city with grid streets, drains and the Great Bath. A UNESCO site since 1980.' },
  { name: 'Taxila', side: 'R', u: 0.30, v: 0.13, from: -600, to: 550, country: 'Pakistan',
    note: 'A city on trade routes to Central Asia and an important Buddhist center of learning.' },
  { name: 'Kandahar', side: 'R', u: 0.07, v: 0.20, from: -260, to: -185, country: 'Afghanistan',
    note: 'Ashoka had an edict carved here in two languages, Greek and Aramaic.' },
  { name: 'Lumbini', side: 'A', u: 0.55, v: 0.28, from: -500, to: 550, country: 'Nepal',
    note: 'Birthplace of the Buddha in Buddhist tradition. Ashoka put up a pillar here.' },
  { name: 'Pataliputra', side: 'L', u: 0.62, v: 0.37, from: -490, to: 550, country: 'India (Patna)',
    note: 'Capital of Magadha, then of the Maurya and Gupta empires.' },
  { name: 'Nalanda', side: 'R', u: 0.66, v: 0.45, from: 427, to: 550, country: 'India (Bihar)',
    note: 'A great Buddhist monastery and place of study, founded about 427 CE.' },
  { name: 'Mahasthangarh', side: 'A', u: 0.84, v: 0.34, from: -300, to: 550, country: 'Bangladesh',
    note: 'The oldest city site found in Bangladesh. A Maurya-era stone inscription was found here.' },
  { name: 'Madurai', side: 'R', u: 0.50, v: 0.80, from: -300, to: 300, country: 'India (Tamil Nadu)',
    note: 'Pandya capital linked by Tamil tradition to the Sangam poets.' },
  { name: 'Anuradhapura', side: 'R', u: 0.60, v: 0.91, from: -377, to: 550, country: 'Sri Lanka',
    note: 'Capital of Sri Lanka for over a thousand years. Its Bodhi tree grew from a cutting brought in the 3rd century BCE.' }
];

let year = -7000;
let selected = -1; // index of a clicked place, -1 = none

// layout values, recalculated each frame
let tlx, tly, tlw, tlh, mx, my, mw, mh, px, py, pw, ph, wide;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: Play/Pause and the era menu
  playButton = createButton('Play');
  playButton.position(10, drawHeight + 8);
  playButton.mousePressed(toggleSimulation);

  eraSelect = createSelect();
  eraSelect.option('Jump to an era...');
  for (let p of periods) eraSelect.option(p.name);
  eraSelect.position(80, drawHeight + 8);
  eraSelect.changed(jumpToEra);

  // Row 2: the year slider, full width
  yearSlider = createSlider(0, 1000, 0, 1);
  yearSlider.position(10, drawHeight + 52);
  yearSlider.size(canvasWidth - 20);
  yearSlider.input(() => {
    year = sliderToYear(yearSlider.value());
    selected = -1;
  });

  describe('A timeline of South Asian history from about 7000 BCE to 550 CE above a schematic map with eleven labeled dots: Mehrgarh, Harappa, Mohenjo-daro, Taxila, Kandahar, Lumbini, Pataliputra, Nalanda, Mahasthangarh, Madurai and Anuradhapura. Moving the year slider lights up the places that were important at that time and shows a card describing the period, from the first farming villages through the Indus cities, the Vedic period, the Maurya Empire and Ashoka, the Kushans, the Sangam Age and the Gupta Empire.');
}

function computeLayout() {
  wide = canvasWidth >= 700;
  tlx = margin; tly = 92; tlw = canvasWidth - 2 * margin; tlh = 64;
  const top = tly + tlh + 30;
  if (wide) {
    mx = margin; my = top;
    mw = Math.floor(canvasWidth * 0.52);
    mh = drawHeight - top - 34;
    px = mx + mw + margin; py = top;
    pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    mx = margin; my = top;
    mw = canvasWidth - 2 * margin;
    mh = 220;
    px = margin; py = my + mh + 40;
    pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin;
  }
}

function X(u) { return mx + u * mw; }
function Y(v) { return my + v * mh; }
function TX(y) { return tlx + yearToSlider(y) / 1000 * tlw; }

function draw() {
  updateCanvasSize();
  computeLayout();

  // drawing area
  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  // control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) {
    let s = yearToSlider(year) + 1.2;
    if (s >= 1000) {
      s = 1000;
      isRunning = false;
      playButton.html('Play');
    }
    year = sliderToYear(s);
    yearSlider.value(s);
  }

  drawTitle();
  drawTimeline();
  drawMap();
  drawCard();
}

function yearLabel(y) {
  if (y < 0) return 'about ' + (-y) + ' BCE';
  if (y === 0) return 'about 1 CE';
  return 'about ' + y + ' CE';
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Ancient Timeline: South Asia to 550 CE';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Drag the year slider or press Play. Click a lit dot to learn about a place.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Drag the slider or press Play. Tap a lit dot.';
  text(instr, canvasWidth / 2, 38);

  // current year, large
  textStyle(BOLD);
  textSize(18);
  fill(SAFFRON);
  text('Year: ' + yearLabel(year), canvasWidth / 2, 62);
  textStyle(NORMAL);
}

function drawTimeline() {
  // background strip
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(tlx, tly, tlw, tlh, 4);

  // period bands in two rows so overlapping periods stay visible
  const rowOf = { 'Mehrgarh farming': 0, 'Indus Valley Civilization': 1, 'Vedic Period': 0,
    'Mahajanapadas': 1, 'Maurya Empire': 0, 'Sangam Age (south)': 1, 'Kushan Empire': 0, 'Gupta Empire': 1 };
  const rowH = 22;
  textSize(14);
  textAlign(CENTER, CENTER);
  for (let p of periods) {
    const x1 = TX(p.start), x2 = TX(p.end);
    const ry = tly + 6 + rowOf[p.name] * (rowH + 4);
    const active = year >= p.start && year < p.end;
    noStroke();
    fill(p.color + (active ? 'FF' : '88'));
    rect(x1, ry, Math.max(2, x2 - x1), rowH, 3);
    if (active) {
      stroke(NAVY);
      strokeWeight(2);
      noFill();
      rect(x1, ry, Math.max(2, x2 - x1), rowH, 3);
    }
    noStroke();
    fill(NAVY);
    const label = textWidth(p.name) < x2 - x1 - 6 ? p.name : (textWidth(p.short) < x2 - x1 - 4 ? p.short : '');
    if (label) text(label, (x1 + x2) / 2, ry + rowH / 2);
  }

  // tick labels under the strip
  const ticks = [-7000, -3300, -1500, -600, 1, 550];
  textSize(14);
  noStroke();
  fill('#444444');
  for (let i = 0; i < ticks.length; i++) {
    const t = ticks[i];
    const x = TX(t);
    let lbl = t < 0 ? (-t) + ' BCE' : (t === 1 ? '1 CE' : t + ' CE');
    if (!wide && t === -3300) lbl = '';
    if (!wide && t === -600) lbl = '600';
    textAlign(i === 0 ? LEFT : (i === ticks.length - 1 ? RIGHT : CENTER), TOP);
    text(lbl, x, tly + tlh + 4);
    stroke('#999999');
    strokeWeight(1);
    line(x, tly + tlh - 4, x, tly + tlh);
    noStroke();
  }

  // year cursor
  const cx = TX(year);
  stroke(SAFFRON);
  strokeWeight(3);
  line(cx, tly - 4, cx, tly + tlh + 2);
  noStroke();
  fill(SAFFRON);
  triangle(cx - 6, tly - 8, cx + 6, tly - 8, cx, tly);
}

function isLit(p) {
  return year >= p.from && year < p.to;
}

function drawMap() {
  // sea
  stroke('silver');
  strokeWeight(1);
  fill(SEA);
  rect(mx, my, mw, mh, 6);

  // a stylized land shape (not a traced outline): northern block,
  // a peninsula wedge and an island blob
  noStroke();
  fill(LAND);
  beginShape();
  vertex(X(0.02), Y(0.05));
  vertex(X(0.98), Y(0.05));
  vertex(X(0.98), Y(0.42));
  vertex(X(0.80), Y(0.50));
  vertex(X(0.66), Y(0.56));
  vertex(X(0.54), Y(0.86));
  vertex(X(0.48), Y(0.86));
  vertex(X(0.36), Y(0.56));
  vertex(X(0.28), Y(0.50));
  vertex(X(0.02), Y(0.50));
  endShape(CLOSE);
  ellipse(X(0.60), Y(0.91), 0.08 * mw, 0.08 * mh);

  // mountains along the top
  for (let k = 0; k < 14; k++) {
    const x = X(0.18 + k * 0.055), y = Y(0.07 + 0.01 * sin(k));
    fill('#B58B62');
    triangle(x - 7, y + 6, x + 7, y + 6, x, y - 7);
  }

  // rivers: Indus and Ganga (schematic)
  stroke('#2F6FB0');
  strokeWeight(3);
  noFill();
  beginShape();
  curveVertex(X(0.34), Y(0.06));
  curveVertex(X(0.34), Y(0.06));
  curveVertex(X(0.31), Y(0.18));
  curveVertex(X(0.26), Y(0.35));
  curveVertex(X(0.22), Y(0.50));
  curveVertex(X(0.22), Y(0.50));
  endShape();
  beginShape();
  curveVertex(X(0.45), Y(0.12));
  curveVertex(X(0.45), Y(0.12));
  curveVertex(X(0.52), Y(0.30));
  curveVertex(X(0.64), Y(0.38));
  curveVertex(X(0.76), Y(0.44));
  curveVertex(X(0.78), Y(0.49));
  curveVertex(X(0.78), Y(0.49));
  endShape();

  noStroke();
  textSize(14);
  textStyle(ITALIC);
  fill('#1F4F86');
  textAlign(CENTER, CENTER);
  text('Indus', X(0.12), Y(0.46));
  text('Ganga', X(0.40), Y(0.25));
  fill(TEAL);
  text('Arabian Sea', X(0.20), Y(0.68));
  text('Bay of Bengal', X(0.80), Y(0.68));
  textStyle(NORMAL);

  // dots
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    const lit = isLit(p);
    const x = X(p.u), y = Y(p.v);
    if (lit) {
      noStroke();
      fill(242, 140, 18, 70);
      circle(x, y, 26 + 4 * sin(frameCount * 0.1));
      fill(SAFFRON);
      stroke('white');
      strokeWeight(2);
      circle(x, y, 14);
    } else {
      stroke('#999999');
      strokeWeight(1);
      fill('#DDDDDD');
      circle(x, y, 10);
    }
    if (i === selected) {
      noFill();
      stroke(NAVY);
      strokeWeight(3);
      circle(x, y, 24);
    }
  }

  // labels for lit places (and the selected one)
  textSize(14);
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    if (!isLit(p) && i !== selected) continue;
    const x = X(p.u), y = Y(p.v);
    const w = textWidth(p.name) + 6;
    let lx = x + 10, ly = y, bx = lx - 3;
    if (p.side === 'L') { lx = x - 10 - (w - 6); bx = lx - 3; }
    if (p.side === 'A') { lx = x - (w - 6) / 2; bx = lx - 3; ly = y - 20; }
    // keep the label inside the map box
    if (bx + w > mx + mw - 2) { bx = mx + mw - 2 - w; lx = bx + 3; }
    if (bx < mx + 2) { bx = mx + 2; lx = bx + 3; }
    textAlign(LEFT, CENTER);
    noStroke();
    fill(255, 255, 255, 215);
    rect(bx, ly - 10, w, 20, 4);
    fill(isLit(p) ? NAVY : '#777777');
    text(p.name, lx, ly);
  }

  // caption under the map, still inside the drawing area
  noStroke();
  fill('#333333');
  textSize(14);
  textAlign(CENTER, TOP);
  const cap = 'Schematic map, not to scale. Not an official depiction of borders.';
  if (textWidth(cap) < mw - 10) {
    text(cap, mx + mw / 2, my + mh + 5);
  } else {
    text('Schematic map, not to scale.', mx + mw / 2, my + mh + 3);
    text('Not an official depiction of borders.', mx + mw / 2, my + mh + 19);
  }
}

function currentEvent() {
  for (let e of events) {
    if (year >= e.from && year < e.to) return e;
  }
  return events[events.length - 1];
}

function drawCard() {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  noStroke();

  const pad = 10;
  const tw = pw - 2 * pad;
  let y = py + pad;
  textAlign(LEFT, TOP);

  const e = currentEvent();
  textStyle(BOLD);
  fill(SAFFRON);
  textSize(wide ? 18 : 16);
  for (let ln of wrapLines(e.title, tw)) {
    text(ln, px + pad, y);
    y += wide ? 23 : 20;
  }
  y += 4;
  textStyle(NORMAL);
  fill('#222222');
  textSize(wide ? 16 : 14);
  const lead = wide ? 21 : 18;
  for (let ln of wrapLines(e.text, tw)) {
    text(ln, px + pad, y);
    y += lead;
  }

  // selected place, or the list of lit places
  y += 8;
  if (y > py + ph - 40) return;
  stroke('#E5D7BE');
  line(px + pad, y, px + pw - pad, y);
  noStroke();
  y += 8;
  textSize(14);
  if (selected >= 0) {
    const p = places[selected];
    textStyle(BOLD);
    fill(TEAL);
    text(p.name + ' (' + p.country + ')', px + pad, y);
    y += 20;
    textStyle(NORMAL);
    fill('#222222');
    const extra = isLit(p) ? p.note : p.note + ' Not lit at this date.';
    for (let ln of wrapLines(extra, tw)) {
      if (y > py + ph - 18) break;
      text(ln, px + pad, y);
      y += 18;
    }
  } else {
    const lit = places.filter(isLit).map(p => wide ? p.name + ' (' + p.country + ')' : p.name);
    textStyle(BOLD);
    fill(TEAL);
    text('Lit on the map now:', px + pad, y);
    y += 20;
    textStyle(NORMAL);
    fill('#222222');
    for (let ln of wrapLines(lit.length ? lit.join(', ') : 'none', tw)) {
      if (y > py + ph - 18) break;
      text(ln, px + pad, y);
      y += 18;
    }
  }
}

// simple word wrap using the current text size and style
function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (let w of words) {
    const test = cur === '' ? w : cur + ' ' + w;
    if (textWidth(test) > maxW && cur !== '') {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function pickPlace(x0, y0) {
  if (y0 > drawHeight || y0 < 0) return;
  let best = -1, bestD = 22;
  for (let i = 0; i < places.length; i++) {
    const d = dist(x0, y0, X(places[i].u), Y(places[i].v));
    if (d < bestD) { bestD = d; best = i; }
  }
  if (best >= 0) selected = best;
}

function mousePressed() {
  pickPlace(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) pickPlace(touches[0].x, touches[0].y);
}

function jumpToEra() {
  const v = eraSelect.value();
  const p = periods.find(q => q.name === v);
  if (!p) return;
  // land a little after the start so the matching card shows
  let target = p.start + Math.max(1, Math.round((p.end - p.start) * 0.15));
  if (p.name === 'Maurya Empire') target = -250;
  year = target;
  yearSlider.value(yearToSlider(year));
  selected = -1;
  isRunning = false;
  playButton.html('Play');
}

function toggleSimulation() {
  if (!isRunning && year >= YEAR_MAX) {
    year = YEAR_MIN;
    yearSlider.value(0);
  }
  isRunning = !isRunning;
  playButton.html(isRunning ? 'Pause' : 'Play');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  if (yearSlider) yearSlider.size(canvasWidth - 20);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
