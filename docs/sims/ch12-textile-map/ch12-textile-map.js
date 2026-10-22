// Textile Map (Roots & Rivers, Chapter 12: Clothing and Textiles)
// CANVAS_HEIGHT = 840 (drawHeight 740 + controlHeight 100); iframe height 842px
// A schematic tile map of the eight countries of South Asia with ten dots for
// textiles and garments. Click (or tap) a dot, or use the menu, to see where the
// cloth is made, its fiber and technique, a simple drawing of a garment and a
// procedurally drawn pattern swatch. "Quiz me" hides the name: find the dot.
// The map is schematic: no borders are drawn.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 740;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let textileSelect, prevButton, nextButton, quizButton, labelCheckbox;

// quiz state
let quizMode = false;
let quizTarget = 0;
let quizMsg = '';
let quizMsgColor = '#222222';
let score = 0;
let tries = 0;
let lastPress = 0;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const SEA = '#DCEFF2';

// Country tiles (same schematic layout as the Chapter 1 Region Explorer).
const countries = [
  { name: 'Afghanistan', cx: 0.13, cy: 0.24, w: 0.22, h: 0.13, color: '#E3D5B5' },
  { name: 'Pakistan', cx: 0.25, cy: 0.42, w: 0.19, h: 0.15, color: '#C9E0CB' },
  { name: 'India', cx: 0.50, cy: 0.60, w: 0.28, h: 0.34, color: '#F9DDB4' },
  { name: 'Nepal', cx: 0.52, cy: 0.335, w: 0.16, h: 0.07, color: '#F1C9C4' },
  { name: 'Bhutan', cx: 0.71, cy: 0.335, w: 0.11, h: 0.07, color: '#F6D2AE' },
  { name: 'Bangladesh', cx: 0.76, cy: 0.47, w: 0.14, h: 0.10, color: '#CBE6D6' },
  { name: 'Sri Lanka', cx: 0.58, cy: 0.875, w: 0.13, h: 0.07, color: '#D8EABD' },
  { name: 'Maldives', cx: 0.33, cy: 0.875, w: 0.13, h: 0.07, color: '#C4E5EB' }
];

// Textiles. Facts are logged in logs/12-factcheck.md.
// side: label position (1 = right, -1 = left, 0 = below, 2 = above); nside overrides on narrow screens
const textiles = [
  { name: 'Jamdani', short: 'Jamdani', x: 0.75, y: 0.47, side: 0,
    place: 'Around Dhaka, Bangladesh', fiber: 'Fine cotton',
    tech: 'Pattern woven in by hand, motif by motif (discontinuous weft)',
    worn: 'Saree', garment: 'saree', motif: 'jamdani',
    fact: 'UNESCO intangible cultural heritage since 2013.',
    body: '#EEEAE0', accent: '#5C6E80' },
  { name: 'Ajrak', short: 'Ajrak', x: 0.21, y: 0.47, side: -1,
    place: 'Sindh, Pakistan (also Kutch, India)', fiber: 'Cotton',
    tech: 'Printed by hand with carved wooden blocks and natural dyes',
    worn: 'Shawl, scarf or wrap', garment: 'shawl', motif: 'ajrak',
    fact: 'Deep indigo and crimson; a symbol of Sindhi identity.',
    body: '#9B1B30', accent: '#1F2A6B' },
  { name: 'Perahan tunban', short: 'Perahan tunban', tiny: 'Perahan', x: 0.12, y: 0.25, side: 0,
    place: 'Afghanistan (Kandahar style shown)', fiber: 'Cotton (wool for winter)',
    tech: 'Stitched; fine geometric embroidery on the chest',
    worn: 'Long shirt over full trousers (men)', garment: 'tunic', motif: 'embroidery',
    fact: 'A close cousin of the shalwar kameez.',
    body: '#F2EEE3', accent: '#2E6B8A' },
  { name: 'Pashmina (Kashmir shawl)', short: 'Pashmina', x: 0.37, y: 0.26, side: 0, nside: 2,
    place: 'Kashmir and Ladakh (a disputed region)', fiber: 'Wool combed from Changthangi goats',
    tech: 'Hand-spun and woven; buta (teardrop) motifs',
    worn: 'Shawl', garment: 'shawl', motif: 'buta',
    fact: 'Copies made in Paisley, Scotland, gave us the word "paisley".',
    body: '#F3E6C8', accent: '#8C2B2B' },
  { name: 'Chyangra Pashmina', short: 'Chyangra', x: 0.49, y: 0.335, side: -1,
    place: 'Nepal', fiber: 'Wool combed from chyangra (Himalayan) goats',
    tech: 'Hand-combed undercoat, spun and woven',
    worn: 'Shawl', garment: 'shawl', motif: 'twill',
    fact: '"Chyangra" is the Nepali name for the mountain goat.',
    body: '#C9B9A3', accent: '#7A6650' },
  { name: 'Kira weaving', short: 'Kira', x: 0.71, y: 0.335, side: 1,
    place: 'Bhutan', fiber: 'Cotton, wool or silk',
    tech: 'Hand-woven stripes and bands of small patterns',
    worn: 'Kira (women); men wear the gho', garment: 'kira', motif: 'kira',
    fact: 'Gho and kira are Bhutan\'s national dress.',
    body: '#B23A48', accent: '#F4B429' },
  { name: 'Banarasi silk', short: 'Banarasi', x: 0.55, y: 0.47, side: -1,
    place: 'Varanasi (Banaras), India', fiber: 'Silk with zari (gold-colored thread)',
    tech: 'Brocade: zari flowers and vines woven in',
    worn: 'Wedding saree', garment: 'saree', motif: 'banarasi',
    fact: 'Geographical Indication (GI) status in 2009.',
    body: '#7B1E3A', accent: '#E8B931' },
  { name: 'Ikat', short: 'Ikat', x: 0.49, y: 0.60, side: 1,
    place: 'Pochampally (Telangana), Sambalpur (Odisha), Patan (Gujarat)', fiber: 'Cotton or silk',
    tech: 'Threads tied and dyed BEFORE weaving, so edges look feathery',
    worn: 'Saree', garment: 'saree', motif: 'ikat',
    fact: 'Double ikat dyes both warp and weft threads.',
    body: '#F4EAD5', accent: '#B4372B' },
  { name: 'Kanjivaram silk', short: 'Kanjivaram', x: 0.53, y: 0.72, side: 1,
    place: 'Kanchipuram, Tamil Nadu, India', fiber: 'Mulberry silk with zari',
    tech: 'Woven; wide contrast border interlocked with the body',
    worn: 'Wedding and festival saree', garment: 'saree', motif: 'kanjivaram',
    fact: 'GI status 2005-06; "temple" borders are a classic design.',
    body: '#B0186A', accent: '#1E7B4A' },
  { name: 'Osariya (Kandyan saree)', short: 'Osariya', x: 0.58, y: 0.875, side: 0,
    place: 'Kandy and the hill country, Sri Lanka', fiber: 'Cotton or silk',
    tech: 'Draped saree with a frill at the waist and a full blouse',
    worn: 'Saree (Kandyan style)', garment: 'osariya', motif: 'osariya',
    fact: 'Widely treated as national dress for women in Sri Lanka.',
    body: '#FFFDF7', accent: '#C9962B' }
];
let selected = 0;

// layout, recalculated each frame
let mx, my, mw, mh, px, py, pw, ph, wide;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: textile menu, Previous, Next
  textileSelect = createSelect();
  for (let t of textiles) textileSelect.option(t.name);
  textileSelect.selected(textiles[selected].name);
  textileSelect.position(10, drawHeight + 10);
  textileSelect.style('font-size', '15px');
  textileSelect.changed(() => {
    const v = textileSelect.value();
    if (!quizMode) selected = textiles.findIndex(t => t.name === v);
  });

  prevButton = createButton('Previous');
  prevButton.mousePressed(() => step(-1));
  nextButton = createButton('Next');
  nextButton.mousePressed(() => step(1));

  // Row 2: quiz button and labels checkbox
  quizButton = createButton('Quiz me');
  quizButton.position(10, drawHeight + 46);
  quizButton.mousePressed(toggleQuiz);

  labelCheckbox = createCheckbox(' Show place names', true);

  positionControls();

  describe('Schematic tile map of the eight countries of South Asia with ten dots for textiles and garments: Jamdani (Bangladesh), ajrak (Sindh, Pakistan), perahan tunban (Afghanistan), Kashmir pashmina, Nepali chyangra pashmina, Bhutanese kira weaving, Banarasi silk, ikat and Kanjivaram silk (India), and the Kandyan osariya (Sri Lanka). Selecting a dot shows the place, fiber, technique, a drawing of the garment and a pattern swatch. A quiz mode hides the name and asks the learner to find the matching dot.');
}

function positionControls() {
  const selW = Math.min(230, canvasWidth - 190);
  textileSelect.style('width', selW + 'px');
  prevButton.position(20 + selW, drawHeight + 10);
  nextButton.position(20 + selW + 82, drawHeight + 10);
  labelCheckbox.position(110, drawHeight + 50);
}

function step(d) {
  if (quizMode) return;
  selected = (selected + d + textiles.length) % textiles.length;
  textileSelect.selected(textiles[selected].name);
}

function toggleQuiz() {
  quizMode = !quizMode;
  if (quizMode) {
    score = 0;
    tries = 0;
    newQuestion();
    quizButton.html('Stop quiz');
  } else {
    quizMsg = '';
    quizButton.html('Quiz me');
  }
}

function newQuestion() {
  let n = quizTarget;
  while (n === quizTarget) n = Math.floor(random(textiles.length));
  quizTarget = n;
  selected = n;
  quizMsg = 'Which dot makes this cloth? Click it.';
  quizMsgColor = NAVY;
}

function computeLayout() {
  wide = canvasWidth >= 700;
  const top = 64;
  if (wide) {
    mx = margin; my = top;
    mw = Math.floor(canvasWidth * 0.56) - margin * 1.5;
    mh = drawHeight - top - margin - 40;
    px = mx + mw + margin; py = top;
    pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    mx = margin; my = top;
    mw = canvasWidth - 2 * margin;
    mh = Math.min(Math.floor(mw * 0.95), 340);
    px = margin; py = my + mh + 42;
    pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin;
  }
}

function X(u) { return mx + u * mw; }
function Y(v) { return my + v * mh; }

function draw() {
  updateCanvasSize();
  computeLayout();

  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawMap();
  drawPanel();
  drawStatus();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Textile Map: Cloth of South Asia';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Click a dot to see where a cloth is made, its fiber and its pattern.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Tap a dot to see a cloth and its pattern.';
  text(instr, canvasWidth / 2, 40);
}

function drawMap() {
  stroke('silver');
  strokeWeight(1);
  fill(SEA);
  rect(mx, my, mw, mh, 6);

  // tiles
  textAlign(CENTER, CENTER);
  for (let c of countries) {
    stroke('white');
    strokeWeight(2);
    fill(c.color);
    rect(X(c.cx - c.w / 2), Y(c.cy - c.h / 2), c.w * mw, c.h * mh, 8);
  }
  // country names (small, in the tile corners so dots stay clear)
  noStroke();
  textSize(14);
  textStyle(BOLD);
  const nameSpots = {
    'Afghanistan': [0.13, 0.16], 'Pakistan': [0.25, 0.53], 'India': [0.45, 0.535],
    'Nepal': [0.52, 0.40], 'Bhutan': [0.71, 0.28], 'Bangladesh': [0.76, 0.40],
    'Sri Lanka': [0.58, 0.81], 'Maldives': [0.33, 0.875]
  };
  for (let c of countries) {
    const s = nameSpots[c.name];
    fill('#4A4A4A');
    text(c.name, X(s[0]), Y(s[1]));
  }
  textStyle(NORMAL);

  // dots
  for (let i = 0; i < textiles.length; i++) {
    const t = textiles[i];
    const hx = X(t.x), hy = Y(t.y);
    const isSel = (i === selected) && !quizMode;
    if (isSel) {
      noFill();
      stroke(SAFFRON);
      strokeWeight(3);
      circle(hx, hy, 30);
    }
    stroke(NAVY);
    strokeWeight(2);
    fill(isSel ? SAFFRON : MARIGOLD);
    circle(hx, hy, 18);
  }

  // dot labels
  if (labelCheckbox.checked()) {
    textSize(14);
    for (let i = 0; i < textiles.length; i++) {
      const t = textiles[i];
      const lbl = (!wide && t.tiny) ? t.tiny : t.short;
      const w = textWidth(lbl) + 8;
      let lx, ly;
      const sd = (!wide && t.nside !== undefined) ? t.nside : t.side;
      if (sd === 2) { lx = X(t.x) - w / 2; ly = Y(t.y) - 33; }
      else if (sd === 1) { lx = X(t.x) + 14; ly = Y(t.y) - 10; }
      else if (sd === -1) { lx = X(t.x) - 14 - w; ly = Y(t.y) - 10; }
      else { lx = X(t.x) - w / 2; ly = Y(t.y) + 12; }
      lx = constrain(lx, mx + 2, mx + mw - w - 2);
      noStroke();
      fill(255, 255, 255, 215);
      rect(lx, ly, w, 20, 4);
      fill(NAVY);
      textAlign(LEFT, CENTER);
      text(lbl, lx + 4, ly + 10);
    }
  }

  // caption under the map, inside the drawing area
  noStroke();
  fill('#333333');
  textSize(14);
  textAlign(CENTER, TOP);
  const cap = 'Schematic map, not to scale. Not an official depiction of borders.';
  if (textWidth(cap) < mw - 10) {
    text(cap, mx + mw / 2, my + mh + 6);
  } else {
    text('Schematic map, not to scale.', mx + mw / 2, my + mh + 4);
    text('Not an official depiction of borders.', mx + mw / 2, my + mh + 21);
  }
}

function drawPanel() {
  const t = textiles[selected];
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  noStroke();

  const pad = 10;
  let y = py + pad;
  const tw = pw - 2 * pad;

  // name
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(wide ? 22 : 18);
  fill(SAFFRON);
  const nm = quizMode ? 'Mystery cloth' : t.name;
  text(nm, px + pad, y);
  textStyle(NORMAL);
  y += wide ? 32 : 26;

  // swatch and garment, side by side
  const boxH = wide ? 230 : 96;
  const gap = 10;
  const boxW = (tw - gap) / 2;
  drawSwatch(t, px + pad, y, boxW, boxH);
  drawGarment(t, px + pad + boxW + gap, y, boxW, boxH);
  textSize(14);
  fill('#555555');
  textAlign(CENTER, TOP);
  text('Pattern', px + pad + boxW / 2, y + boxH + 3);
  text('Garment', px + pad + boxW + gap + boxW / 2, y + boxH + 3);
  y += boxH + 24;

  // facts
  textAlign(LEFT, TOP);
  const bodySize = wide ? 16 : 14;
  const lead = wide ? 21 : 17;
  textSize(bodySize);
  let rows;
  if (quizMode) {
    rows = [['Fiber: ', t.fiber], ['Technique: ', t.tech], ['Worn as: ', t.worn]];
  } else {
    rows = [['Place: ', t.place], ['Fiber: ', t.fiber], ['Technique: ', t.tech], ['Worn as: ', t.worn], ['', t.fact]];
  }
  for (let r of rows) {
    const lines = wrapLines(r[0] + r[1], tw);
    for (let k = 0; k < lines.length; k++) {
      if (y + lead > py + ph - 4) return;
      if (k === 0 && r[0] !== '') {
        textStyle(BOLD);
        fill(NAVY);
        text(r[0], px + pad, y);
        const lw = textWidth(r[0]);
        textStyle(NORMAL);
        fill('#222222');
        text(lines[0].substring(r[0].length), px + pad + lw, y);
      } else {
        fill(r[0] === '' ? TEAL : '#222222');
        if (r[0] === '') textStyle(BOLD);
        text(lines[k], px + pad, y);
        textStyle(NORMAL);
      }
      y += lead;
    }
    y += wide ? 5 : 1;
  }
}

function drawStatus() {
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  if (quizMode) {
    fill(quizMsgColor);
    let msg = quizMsg + '   Score: ' + score + ' / ' + tries;
    if (textWidth(msg) > canvasWidth - 20) msg = quizMsg;
    text(msg, 10, drawHeight + 78);
  } else {
    fill('#444444');
    let m = 'Press Quiz me to test yourself.';
    text(m, 10, drawHeight + 78);
  }
}

// ---------- pattern swatches (procedural) ----------

function clipRect(x, y, w, h) {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x, y, w, h);
  drawingContext.clip();
}
function unclip() { drawingContext.restore(); }

function drawSwatch(t, x, y, w, h) {
  clipRect(x, y, w, h);
  noStroke();
  fill(t.body);
  rect(x, y, w, h);
  const m = t.motif;
  if (m === 'jamdani') motifJamdani(t, x, y, w, h);
  else if (m === 'ajrak') motifAjrak(t, x, y, w, h);
  else if (m === 'embroidery') motifEmbroidery(t, x, y, w, h);
  else if (m === 'buta') motifButa(t, x, y, w, h);
  else if (m === 'twill') motifTwill(t, x, y, w, h);
  else if (m === 'kira') motifKira(t, x, y, w, h);
  else if (m === 'banarasi') motifBanarasi(t, x, y, w, h);
  else if (m === 'ikat') motifIkat(t, x, y, w, h);
  else if (m === 'kanjivaram') motifKanjivaram(t, x, y, w, h);
  else if (m === 'osariya') motifOsariya(t, x, y, w, h);
  unclip();
  noFill();
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 4);
  noStroke();
}

function flower(cx, cy, r, col) {
  fill(col);
  for (let k = 0; k < 4; k++) {
    const a = k * HALF_PI;
    ellipse(cx + cos(a) * r, cy + sin(a) * r, r * 1.3, r * 1.3);
  }
  fill('white');
  circle(cx, cy, r * 0.9);
}

function motifJamdani(t, x, y, w, h) {
  // sheer cloth: faint threads, scattered small woven flowers and diamonds
  stroke(200, 195, 185, 120);
  strokeWeight(1);
  for (let i = x; i < x + w; i += 4) line(i, y, i, y + h);
  noStroke();
  const s = 26;
  let row = 0;
  for (let j = y + 12; j < y + h; j += s, row++) {
    for (let i = x + 10 + (row % 2) * s / 2; i < x + w; i += s) {
      if ((row + Math.floor(i / s)) % 2 === 0) flower(i, j, 4, t.accent);
      else {
        fill(t.accent);
        quad(i, j - 5, i + 4, j, i, j + 5, i - 4, j);
      }
    }
  }
  // border band
  fill(t.accent);
  rect(x, y + h - 12, w, 12);
  fill(t.body);
  for (let i = x; i < x + w; i += 10) triangle(i, y + h - 12, i + 10, y + h - 12, i + 5, y + h - 5);
}

function star8(cx, cy, r, col) {
  fill(col);
  rectMode(CENTER);
  push();
  translate(cx, cy);
  rect(0, 0, r * 1.4, r * 1.4);
  rotate(QUARTER_PI);
  rect(0, 0, r * 1.4, r * 1.4);
  pop();
  rectMode(CORNER);
}

function motifAjrak(t, x, y, w, h) {
  const s = 32;
  for (let j = y; j < y + h; j += s) {
    for (let i = x; i < x + w; i += s) {
      fill(t.accent);
      rect(i + 3, j + 3, s - 6, s - 6, 3);
      star8(i + s / 2, j + s / 2, 9, 'white');
      star8(i + s / 2, j + s / 2, 5, t.body);
      fill('black');
      circle(i + s / 2, j + s / 2, 4);
      fill('white');
      circle(i + 3, j + 3, 4);
    }
  }
}

function motifEmbroidery(t, x, y, w, h) {
  // plain cloth with a panel of geometric embroidery
  const cx = x + w / 2;
  fill(t.accent);
  rect(cx - w * 0.28, y, w * 0.56, h);
  fill(t.body);
  rect(cx - w * 0.24, y, w * 0.48, h);
  const cols = ['#2E6B8A', '#B4372B', '#3E8E5E', '#E8B931'];
  let k = 0;
  for (let j = y + 10; j < y + h - 6; j += 16, k++) {
    fill(cols[k % 4]);
    for (let i = cx - w * 0.2; i < cx + w * 0.2 - 6; i += 12) {
      triangle(i, j + 8, i + 6, j, i + 12, j + 8);
    }
  }
}

function buta(cx, cy, s, col, flip) {
  push();
  translate(cx, cy);
  if (flip) scale(-1, 1);
  fill(col);
  beginShape();
  vertex(0, s);
  bezierVertex(-s * 0.9, s * 0.8, -s * 0.9, -s * 0.4, 0, -s * 0.5);
  bezierVertex(s * 0.6, -s * 0.6, s * 0.9, -s * 1.1, s * 0.4, -s * 1.3);
  bezierVertex(s * 1.2, -s * 0.9, s * 0.9, s * 0.6, 0, s);
  endShape(CLOSE);
  fill(PAPER);
  ellipse(0, s * 0.2, s * 0.6, s * 0.7);
  fill(col);
  circle(0, s * 0.2, s * 0.25);
  pop();
}

function motifButa(t, x, y, w, h) {
  const s = 40;
  let row = 0;
  for (let j = y + 24; j < y + h + 20; j += s, row++) {
    for (let i = x + 16 + (row % 2) * s / 2; i < x + w + 20; i += s) {
      buta(i, j, 11, t.accent, row % 2 === 1);
    }
  }
  fill(t.accent);
  rect(x, y + h - 10, w, 10);
}

function motifTwill(t, x, y, w, h) {
  // soft wool with fine diagonal twill lines and a fringe
  stroke(t.accent);
  strokeWeight(1);
  for (let i = x - h; i < x + w; i += 6) line(i, y + h, i + h, y);
  noStroke();
  fill(t.body);
  rect(x, y + h - 22, w, 22);
  stroke(t.accent);
  strokeWeight(1.5);
  for (let i = x + 3; i < x + w; i += 5) line(i, y + h - 22, i + 1, y + h);
  noStroke();
}

function motifKira(t, x, y, w, h) {
  const bands = [t.body, '#1B2356', t.accent, t.body, '#3E8E5E', '#FFFFFF', t.body, '#1B2356'];
  const bh = h / bands.length;
  for (let k = 0; k < bands.length; k++) {
    fill(bands[k]);
    rect(x, y + k * bh, w, bh + 1);
    if (k % 3 === 1) {
      fill(k === 1 ? GOLD : t.body);
      for (let i = x + 4; i < x + w; i += 12) {
        quad(i, y + k * bh + bh / 2, i + 4, y + k * bh + 3, i + 8, y + k * bh + bh / 2, i + 4, y + (k + 1) * bh - 3);
      }
    }
  }
}

function motifBanarasi(t, x, y, w, h) {
  const s = 30;
  let row = 0;
  for (let j = y + 14; j < y + h - 20; j += s, row++) {
    for (let i = x + 14 + (row % 2) * s / 2; i < x + w; i += s) {
      flower(i, j, 5, t.accent);
      fill(t.accent);
      ellipse(i - 8, j + 9, 8, 4);
      ellipse(i + 8, j + 9, 8, 4);
    }
  }
  // zari border
  fill(t.accent);
  rect(x, y + h - 22, w, 22);
  fill(t.body);
  for (let i = x; i < x + w; i += 12) {
    triangle(i, y + h - 20, i + 12, y + h - 20, i + 6, y + h - 10);
  }
}

function motifIkat(t, x, y, w, h) {
  // diamonds built from short thread segments with jittered ends (feathery edges)
  const s = 36;
  stroke(t.accent);
  strokeWeight(2);
  let row = 0;
  for (let cy = y + 18; cy < y + h + 18; cy += s, row++) {
    for (let cx = x + 18 + (row % 2) * s / 2; cx < x + w + 18; cx += s) {
      for (let dy = -14; dy <= 14; dy += 3) {
        const half = 14 - Math.abs(dy);
        const j1 = 3 * sin(cx * 0.7 + dy * 1.9);
        const j2 = 3 * cos(cy * 0.5 + dy * 2.3);
        line(cx - half + j1, cy + dy, cx + half + j2, cy + dy);
      }
    }
  }
  stroke('#1B2356');
  strokeWeight(2);
  for (let cx = x; cx < x + w; cx += 4) {
    const j = 2 * sin(cx * 1.3);
    line(cx, y + h - 10 + j, cx + 3, y + h - 10 + j);
  }
  noStroke();
}

function motifKanjivaram(t, x, y, w, h) {
  // body with small gold checks, wide green border with temple triangles
  stroke(GOLD);
  strokeWeight(1);
  for (let i = x + 8; i < x + w; i += 16) line(i, y, i, y + h * 0.55);
  for (let j = y + 8; j < y + h * 0.55; j += 16) line(x, j, x + w, j);
  noStroke();
  const by = y + h * 0.55;
  fill(t.accent);
  rect(x, by, w, h - (by - y));
  fill(GOLD);
  rect(x, by, w, 5);
  for (let i = x; i < x + w; i += 18) triangle(i, by + 5, i + 18, by + 5, i + 9, by + 26);
  rect(x, y + h - 14, w, 4);
}

function motifOsariya(t, x, y, w, h) {
  fill(t.accent);
  rect(x, y + h - 20, w, 20);
  rect(x, y + h - 26, w, 3);
  fill(t.body);
  for (let i = x + 8; i < x + w; i += 16) ellipse(i, y + h - 10, 9, 5);
  // small leaf scrolls on the body
  fill(t.accent);
  let row = 0;
  for (let j = y + 16; j < y + h - 34; j += 26, row++) {
    for (let i = x + 12 + (row % 2) * 13; i < x + w; i += 26) {
      ellipse(i, j, 10, 5);
      ellipse(i + 4, j - 4, 5, 9);
    }
  }
}

// ---------- garments (simple shapes) ----------

function drawGarment(t, x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('#FAFAFA');
  rect(x, y, w, h, 4);
  noStroke();
  const cx = x + w / 2;
  const s = h / 170;            // scale: 170 px tall reference figure
  const skin = '#B97A57';
  const top = y + 10 * s;
  // head and neck
  fill(skin);
  circle(cx, top + 12 * s, 22 * s);
  rect(cx - 4 * s, top + 21 * s, 8 * s, 8 * s);
  fill('#2B2B2B');
  arc(cx, top + 9 * s, 23 * s, 18 * s, PI, TWO_PI);

  const g = t.garment;
  if (g === 'saree' || g === 'osariya') {
    // blouse
    fill(t.accent);
    rect(cx - 17 * s, top + 28 * s, 34 * s, 26 * s, 6 * s);
    // skirt
    fill(t.body);
    quad(cx - 18 * s, top + 54 * s, cx + 18 * s, top + 54 * s, cx + 28 * s, top + 150 * s, cx - 28 * s, top + 150 * s);
    // pleats
    stroke(t.accent);
    strokeWeight(1);
    for (let k = -2; k <= 2; k++) line(cx + k * 4 * s, top + 70 * s, cx + k * 6 * s, top + 150 * s);
    noStroke();
    // border at the hem
    fill(t.accent);
    rect(cx - 28 * s, top + 142 * s, 56 * s, 8 * s);
    if (g === 'osariya') {
      // frill at the waist
      fill(t.body);
      stroke(t.accent);
      strokeWeight(1);
      for (let k = -3; k <= 3; k++) ellipse(cx + k * 6 * s, top + 60 * s, 9 * s, 14 * s);
      noStroke();
    }
    // pallu over the left shoulder
    fill(t.body);
    stroke(t.accent);
    strokeWeight(2);
    quad(cx + 10 * s, top + 28 * s, cx + 20 * s, top + 30 * s, cx - 14 * s, top + 70 * s, cx - 22 * s, top + 60 * s);
    quad(cx + 12 * s, top + 28 * s, cx + 22 * s, top + 30 * s, cx + 30 * s, top + 100 * s, cx + 20 * s, top + 102 * s);
    noStroke();
  } else if (g === 'shawl') {
    // kurta and trousers
    fill('#E8E2D2');
    rect(cx - 17 * s, top + 28 * s, 34 * s, 80 * s, 6 * s);
    fill('#D7CFBB');
    rect(cx - 15 * s, top + 108 * s, 13 * s, 42 * s);
    rect(cx + 2 * s, top + 108 * s, 13 * s, 42 * s);
    // shawl over both shoulders
    fill(t.body);
    stroke(t.accent);
    strokeWeight(2);
    rect(cx - 26 * s, top + 26 * s, 52 * s, 16 * s, 6 * s);
    rect(cx - 26 * s, top + 32 * s, 14 * s, 74 * s, 3 * s);
    rect(cx + 12 * s, top + 32 * s, 14 * s, 74 * s, 3 * s);
    noStroke();
    fill(t.accent);
    rect(cx - 26 * s, top + 100 * s, 14 * s, 6 * s);
    rect(cx + 12 * s, top + 100 * s, 14 * s, 6 * s);
  } else if (g === 'tunic') {
    // full trousers
    fill(t.body);
    stroke('#BBBBBB');
    strokeWeight(1);
    quad(cx - 20 * s, top + 100 * s, cx - 1 * s, top + 100 * s, cx - 4 * s, top + 150 * s, cx - 22 * s, top + 150 * s);
    quad(cx + 1 * s, top + 100 * s, cx + 20 * s, top + 100 * s, cx + 22 * s, top + 150 * s, cx + 4 * s, top + 150 * s);
    // long shirt to the knee
    fill(t.body);
    quad(cx - 18 * s, top + 28 * s, cx + 18 * s, top + 28 * s, cx + 26 * s, top + 118 * s, cx - 26 * s, top + 118 * s);
    // sleeves
    quad(cx - 18 * s, top + 30 * s, cx - 26 * s, top + 34 * s, cx - 32 * s, top + 84 * s, cx - 22 * s, top + 84 * s);
    quad(cx + 18 * s, top + 30 * s, cx + 26 * s, top + 34 * s, cx + 32 * s, top + 84 * s, cx + 22 * s, top + 84 * s);
    noStroke();
    // chest embroidery
    const cols = ['#2E6B8A', '#B4372B', '#3E8E5E'];
    for (let r = 0; r < 4; r++) {
      fill(cols[r % 3]);
      for (let k = -2; k <= 1; k++) {
        const ex = cx + k * 7 * s, ey = top + (36 + r * 8) * s;
        triangle(ex, ey + 6 * s, ex + 3.5 * s, ey, ex + 7 * s, ey + 6 * s);
      }
    }
  } else if (g === 'kira') {
    // jacket (toego)
    fill('#E8B931');
    rect(cx - 20 * s, top + 28 * s, 40 * s, 34 * s, 5 * s);
    // kira: ankle-length striped wrap
    const bands = [t.body, '#1B2356', t.accent, t.body, '#3E8E5E', t.body];
    const kx = cx - 21 * s, ky = top + 60 * s, kw = 42 * s, kh = 90 * s;
    for (let k = 0; k < bands.length; k++) {
      fill(bands[k]);
      rect(kx, ky + k * kh / bands.length, kw, kh / bands.length + 1);
    }
    // belt
    fill('#1B2356');
    rect(kx, ky - 2 * s, kw, 6 * s);
    // sleeves (wonju) cuffs
    fill('white');
    rect(cx - 27 * s, top + 34 * s, 7 * s, 40 * s, 3 * s);
    rect(cx + 20 * s, top + 34 * s, 7 * s, 40 * s, 3 * s);
    // koma brooches
    fill('silver');
    circle(cx - 12 * s, top + 32 * s, 6 * s);
    circle(cx + 12 * s, top + 32 * s, 6 * s);
  }
}

// ---------- helpers and input ----------

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

function handlePress(x, y) {
  const now = millis();
  if (now - lastPress < 300) return;
  if (y > drawHeight || y < 0) return;
  for (let i = 0; i < textiles.length; i++) {
    const t = textiles[i];
    if (dist(x, y, X(t.x), Y(t.y)) < 16) {
      lastPress = now;
      if (quizMode) {
        tries++;
        if (i === quizTarget) {
          score++;
          quizMsg = 'Yes! ' + textiles[quizTarget].name + '. Next one...';
          quizMsgColor = LEAF;
          setTimeout(() => { if (quizMode) newQuestion(); }, 1400);
        } else {
          quizMsg = 'Not quite: that dot is ' + t.short + '. Try again.';
          quizMsgColor = SAFFRON;
        }
      } else {
        selected = i;
        textileSelect.selected(t.name);
      }
      return;
    }
  }
}

function mousePressed() {
  handlePress(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    const r = document.querySelector('main canvas').getBoundingClientRect();
    handlePress(touches[0].x !== undefined ? touches[0].x : touches[0].clientX - r.left,
                touches[0].y !== undefined ? touches[0].y : touches[0].clientY - r.top);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
