// Delta and Island: Bangladesh and Sri Lanka (Roots & Rivers, Chapter 19)
// CANVAS_HEIGHT = 930 (drawHeight 830 + controlHeight 100); iframe height 932px
// Left panel: a schematic Bengal Delta where the Padma (Ganges), Jamuna
// (Brahmaputra) and Meghna rivers meet. A "monsoon river level" slider floods
// the lowest land first. The flooded share is ILLUSTRATIVE, not data; the two
// preset buttons match the documented averages: about 21% of Bangladesh floods
// in an average year, and more than two-thirds flooded in 1998.
// Right panel: a stylized island (not a traced outline) with schematic central
// highlands and labeled places. Tap a dot for a card.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 830;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let levelSlider, typicalButton, extremeButton, resetButton;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const WATER = '#5B9BD5';
const LAND = '#C9DDA0';

// delta grid
const GC = 34, GR = 30;
let elev = [];          // elevation index 0..1 for each land cell (or -1 = sea)
let typicalLevel = 0, extremeLevel = 0;

// rivers in delta units (u, v from 0 to 1)
const rivers = [
  { name: 'Jamuna', pts: [[0.36, 0.00], [0.38, 0.18], [0.40, 0.36], [0.44, 0.54]] },
  { name: 'Padma', pts: [[0.00, 0.40], [0.18, 0.46], [0.32, 0.51], [0.44, 0.54], [0.58, 0.63]] },
  { name: 'Meghna', pts: [[0.90, 0.10], [0.78, 0.26], [0.68, 0.44], [0.58, 0.63], [0.60, 0.78], [0.62, 0.90]] }
];

const deltaPlaces = [
  { name: 'Dhaka', u: 0.52, v: 0.47, info: 'Capital of Bangladesh, on the Buriganga River near the meeting of the great rivers. A Mughal provincial capital in the 1600s.' },
  { name: 'Chattogram', u: 0.86, v: 0.80, info: 'Bangladesh\'s main seaport, on the Bay of Bengal. Zara\'s family comes from here.' },
  { name: 'Sundarbans', u: 0.30, v: 0.86, info: 'The world\'s largest mangrove forest, shared with India; about 60% lies in Bangladesh. UNESCO World Heritage site (Bangladesh part, 1997).' }
];

const islandPlaces = [
  { name: 'Jaffna', u: 0.44, v: 0.07, info: 'Main city of the Tamil-majority north, a center of Sri Lankan Tamil culture and of the Hindu faith.' },
  { name: 'Anuradhapura', u: 0.45, v: 0.32, info: 'Ancient royal capital and Buddhist center. Its sacred Bodhi tree is said to grow from a cutting of the tree in Bodh Gaya. UNESCO site (1982).' },
  { name: 'Kandy', u: 0.58, v: 0.58, info: 'Hill capital of the last independent Sinhala kingdom, which fell to the British in 1815. Home of the Temple of the Tooth Relic (UNESCO, 1988).' },
  { name: 'Sri Pada', u: 0.50, v: 0.71, info: 'Adam\'s Peak, 2,243 m. Buddhists, Hindus, Muslims and Christians each honor the footprint-shaped mark at the top.' },
  { name: 'Colombo', u: 0.27, v: 0.68, info: 'Largest city and commercial capital, a major port. The official legislative capital, Sri Jayawardenepura Kotte, is next door.' },
  { name: 'Galle', u: 0.40, v: 0.88, info: 'Southern port with a fort built by the Portuguese and Dutch. UNESCO World Heritage site (1988).' }
];
let selected = null; // {side: 'D'|'S', i}

// layout
let dx, dy, dw, dh, sx, sy, sw, sh, wide, infoY;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  buildDelta();

  levelSlider = createSlider(0, 100, 0, 1);
  levelSlider.position(10, drawHeight + 12);

  typicalButton = createButton('Average year');
  typicalButton.position(10, drawHeight + 55);
  typicalButton.mousePressed(() => { levelSlider.value(typicalLevel); });

  extremeButton = createButton('Extreme year (1998)');
  extremeButton.position(115, drawHeight + 55);
  extremeButton.mousePressed(() => { levelSlider.value(extremeLevel); });

  resetButton = createButton('Dry season');
  resetButton.position(300, drawHeight + 55);
  resetButton.mousePressed(() => { levelSlider.value(0); });

  describe('Two schematic panels. Left: the Bengal Delta, where the Padma, Jamuna and Meghna rivers meet and flow into the Bay of Bengal, with dots for Dhaka, Chattogram and the Sundarbans. A monsoon slider raises the river level and turns the lowest land blue, showing an illustrative share of land flooded. Right: a stylized island of Sri Lanka with brown central highlands and dots for Jaffna, Anuradhapura, Kandy, Sri Pada, Colombo and Galle. Tapping a dot shows a short description.');
}

// Build a schematic elevation field: low near the coast and rivers,
// higher to the north and in the eastern hills. Values are ranks 0..1.
function buildDelta() {
  const raw = [];
  for (let r = 0; r < GR; r++) {
    for (let c = 0; c < GC; c++) {
      const u = (c + 0.5) / GC, v = (r + 0.5) / GR;
      if (v > 0.93 || (v > 0.88 && u > 0.45 && u < 0.75)) { raw.push(-1); continue; }
      let e = (1 - v) * 0.9;                               // higher in the north
      if (u > 0.78 && v < 0.75) e += (u - 0.78) * 3.2;     // eastern hills
      let dmin = 9;
      for (let rv of rivers) dmin = Math.min(dmin, distToPolyline(u, v, rv.pts));
      e += Math.min(dmin, 0.25) * 2.2;                    // land rises away from rivers
      e += 0.05 * Math.sin(u * 23 + v * 7) + 0.04 * Math.cos(v * 31 - u * 11); // texture
      raw.push(e);
    }
  }
  const land = raw.filter(x => x >= 0).slice().sort((a, b) => a - b);
  for (let x of raw) {
    if (x < 0) { elev.push(-1); continue; }
    // rank (0..1) so that "level" maps directly onto share of land below it
    let lo = 0, hi = land.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (land[m] < x) lo = m + 1; else hi = m; }
    elev.push(lo / land.length);
  }
  typicalLevel = 21;  // about 21% of the country floods in an average year
  extremeLevel = 68;  // more than two-thirds flooded in 1998
}

function distToPolyline(u, v, pts) {
  let best = 9;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const dxp = x2 - x1, dyp = y2 - y1;
    const t = Math.max(0, Math.min(1, ((u - x1) * dxp + (v - y1) * dyp) / (dxp * dxp + dyp * dyp)));
    const d = Math.hypot(u - (x1 + t * dxp), v - (y1 + t * dyp));
    if (d < best) best = d;
  }
  return best;
}

function computeLayout() {
  wide = canvasWidth >= 720;
  const top = 66;
  if (wide) {
    const pw = Math.floor((canvasWidth - 3 * margin) / 2);
    const ph = 560;
    dx = margin; dy = top + 22; dw = pw; dh = ph;
    sx = margin * 2 + pw; sy = top + 22; sw = pw; sh = ph;
    infoY = dy + dh + 72;
  } else {
    const pw = canvasWidth - 2 * margin;
    dx = margin; dy = top + 22; dw = pw; dh = 245;
    sx = margin; sy = dy + dh + 70; sw = pw; sh = 225;
    infoY = sy + sh + 32;
  }
}

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
  const flooded = drawDelta();
  drawIsland();
  drawInfo(flooded);
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Delta and Island: Bangladesh and Sri Lanka';
  while (textWidth(title) > canvasWidth - 20 && ts > 15) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Raise the monsoon slider to flood the delta. Tap any dot for a card.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Move the slider. Tap a dot.';
  text(instr, canvasWidth / 2, 38);
}

function panelHeader(x, y, label) {
  noStroke();
  fill(SAFFRON);
  textStyle(BOLD);
  textSize(16);
  textAlign(LEFT, BOTTOM);
  text(label, x + 2, y - 3);
  textStyle(NORMAL);
}

function drawDelta() {
  panelHeader(dx, dy, 'Bangladesh: the Bengal Delta');
  stroke('silver');
  strokeWeight(1);
  fill('#DCEBF5');
  rect(dx, dy, dw, dh, 6);

  const level = levelSlider.value() / 100;
  const cw = dw / GC, ch = dh / GR;
  let landN = 0, floodN = 0;
  noStroke();
  for (let r = 0; r < GR; r++) {
    for (let c = 0; c < GC; c++) {
      const e = elev[r * GC + c];
      if (e < 0) continue;
      landN++;
      const wet = e < level;
      if (wet) floodN++;
      if (wet) fill(WATER);
      else {
        const u = (c + 0.5) / GC, v = (r + 0.5) / GR;
        if (u > 0.12 + 0.04 * Math.sin(v * 40) && u < 0.46 + 0.03 * Math.cos(v * 37) && v > 0.79 + 0.02 * Math.sin(u * 30)) fill('#2F7A4F'); // Sundarbans
        else if (u > 0.78 && v < 0.75 && e > 0.80) fill('#B9A577');      // eastern hills
        else fill(LAND);
      }
      rect(dx + c * cw, dy + r * ch, cw + 0.6, ch + 0.6);
    }
  }
  // rivers
  noFill();
  stroke('#1F5FA0');
  for (let rv of rivers) {
    strokeWeight(rv.name === 'Meghna' ? 4 : 5);
    beginShape();
    for (let p of rv.pts) vertex(dx + p[0] * dw, dy + p[1] * dh);
    endShape();
  }
  // labels
  textSize(14);
  textStyle(ITALIC);
  label('Jamuna', dx + 0.30 * dw, dy + 0.12 * dh, '#1F4F86');
  label('Padma', dx + 0.17 * dw, dy + 0.36 * dh, '#1F4F86');
  label('Meghna', dx + 0.82 * dw, dy + 0.30 * dh, '#1F4F86');
  label('Bay of Bengal', dx + 0.55 * dw, dy + 0.965 * dh, '#1F4F86');
  textStyle(NORMAL);
  for (let i = 0; i < deltaPlaces.length; i++) {
    const p = deltaPlaces[i];
    const isSel = selected && selected.side === 'D' && selected.i === i;
    dot(dx + p.u * dw, dy + p.v * dh, isSel, '#8A1C1C');
    const off = p.name === 'Sundarbans' ? -16 : 16;
    label(p.name, dx + p.u * dw + (p.name === 'Chattogram' ? -14 : 0), dy + p.v * dh + off, NAVY);
  }

  const pct = landN ? Math.round(100 * floodN / landN) : 0;
  // caption and readout under the panel
  noStroke();
  fill(NAVY);
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Land under water: ' + pct + '% (illustrative)', dx + 2, dy + dh + 6);
  textStyle(NORMAL);
  fill('#444444');
  const note = 'Average year: about 21%. 1998: more than two-thirds.';
  if (textWidth(note) < dw) text(note, dx + 2, dy + dh + 25);
  else text('Avg year ~21%. 1998: over 2/3.', dx + 2, dy + dh + 25);
  return pct;
}

function drawIsland() {
  panelHeader(sx, sy, 'Sri Lanka: an island');
  stroke('silver');
  strokeWeight(1);
  fill('#CFE6EC');
  rect(sx, sy, sw, sh, 6);

  // stylized island: a rounded teardrop, scaled to the panel (not a traced outline)
  const ih = sh * 0.9, iw = Math.min(sw * 0.62, ih * 0.62);
  const cx = sx + sw / 2, top = sy + sh * 0.05;
  noStroke();
  fill(LAND);
  beginShape();
  vertex(cx - iw * 0.12, top);
  bezierVertex(cx + iw * 0.05, top + ih * 0.05, cx + iw * 0.55, top + ih * 0.35, cx + iw * 0.50, top + ih * 0.70);
  bezierVertex(cx + iw * 0.45, top + ih * 0.95, cx - iw * 0.30, top + ih * 1.02, cx - iw * 0.45, top + ih * 0.75);
  bezierVertex(cx - iw * 0.55, top + ih * 0.50, cx - iw * 0.35, top + ih * 0.15, cx - iw * 0.12, top);
  endShape(CLOSE);
  // central highlands (schematic)
  fill('#B9A577');
  ellipse(cx + iw * 0.05, top + ih * 0.66, iw * 0.42, ih * 0.26);
  fill('#9C8656');
  ellipse(cx + iw * 0.02, top + ih * 0.67, iw * 0.20, ih * 0.12);
  textSize(14);
  textStyle(ITALIC);
  if (wide) label('Highlands', cx + iw * 0.05, top + ih * 0.80, '#5A3E1B');
  label('Indian Ocean', sx + sw * 0.83, sy + sh * 0.94, '#1F4F86');
  textStyle(NORMAL);

  for (let i = 0; i < islandPlaces.length; i++) {
    const p = islandPlaces[i];
    const px = cx + (p.u - 0.5) * iw * 1.6, py = top + p.v * ih;
    const isSel = selected && selected.side === 'S' && selected.i === i;
    dot(px, py, isSel, '#8A1C1C');
    let lx = px, ly = py - 15;
    if (p.name === 'Colombo') { lx = px - 34; ly = py; }
    if (p.name === 'Kandy') { lx = px + 28; ly = py; }
    if (p.name === 'Sri Pada') { lx = px - 6; ly = py + 16; }
    if (p.name === 'Anuradhapura') { lx = px; ly = py - 15; }
    if (p.name === 'Galle') { lx = px - 28; ly = py; }
    label(p.name, lx, ly, NAVY);
  }
}

function islandXY(i) {
  const ih = sh * 0.9, iw = Math.min(sw * 0.62, ih * 0.62);
  const cx = sx + sw / 2, top = sy + sh * 0.05;
  const p = islandPlaces[i];
  return [cx + (p.u - 0.5) * iw * 1.6, top + p.v * ih];
}

function dot(x, y, isSel, col) {
  stroke(isSel ? SAFFRON : 'white');
  strokeWeight(isSel ? 3 : 2);
  fill(col);
  circle(x, y, isSel ? 15 : 11);
}

function label(s, x, y, col) {
  const w = textWidth(s) + 6;
  noStroke();
  fill(255, 255, 255, 190);
  rect(x - w / 2, y - 10, w, 20, 4);
  fill(col);
  textAlign(CENTER, CENTER);
  text(s, x, y);
}

function drawInfo(pct) {
  // caption inside the drawing area
  noStroke();
  fill('#333333');
  textSize(14);
  textAlign(LEFT, TOP);
  const cap = 'Schematic map, not to scale. Not an official depiction of borders.';
  let y = infoY - 22;
  if (!wide) y = sy + sh + 6;
  if (textWidth(cap) < canvasWidth - 20) {
    text(cap, margin, y);
  } else {
    text('Schematic map, not to scale.', margin, y);
    text('Not an official depiction of borders.', margin, y + 17);
    if (!wide) infoY = y + 40;
  }

  // card
  const bx = margin, bw = canvasWidth - 2 * margin, by = infoY, bh = drawHeight - infoY - margin;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(bx, by, bw, bh, 6);
  noStroke();
  let title, body;
  if (selected) {
    const p = selected.side === 'D' ? deltaPlaces[selected.i] : islandPlaces[selected.i];
    title = p.name + (selected.side === 'D' ? ' (Bangladesh)' : ' (Sri Lanka)');
    body = p.info;
  } else if (pct > 0) {
    title = 'Monsoon floods';
    body = 'The rivers rise as rain falls on the Himalaya and the delta. Most of the water comes from outside Bangladesh. Low land near rivers floods first; the hills in the east stay dry. Floods also bring the fresh silt that makes the soil fertile.';
  } else {
    title = 'Compare the two';
    body = 'Bangladesh: 175,686,899 people (2025, World Bank), most living on a flat, low river delta. Sri Lanka: 21,756,000 people (2025, World Bank) on an island whose central highlands catch the monsoon rains.';
  }
  fill(SAFFRON);
  textStyle(BOLD);
  textSize(16);
  text(title, bx + 10, by + 8);
  textStyle(NORMAL);
  fill('#222222');
  textSize(14);
  const lines = wrapLines(body, bw - 20);
  for (let k = 0; k < lines.length; k++) {
    if (by + 32 + (k + 1) * 18 > by + bh) break;
    text(lines[k], bx + 10, by + 32 + k * 18);
  }
}

function drawControlLabels() {
  noStroke();
  fill(NAVY);
  textSize(14);
  textAlign(LEFT, CENTER);
  const sxp = 10 + levelSlider.elt.offsetWidth + 12;
  text('Monsoon river level: ' + levelSlider.value() + '%', sxp, drawHeight + 22);
  extremeButton.position(10 + typicalButton.elt.offsetWidth + 8, drawHeight + 55);
  resetButton.position(10 + typicalButton.elt.offsetWidth + 8 + extremeButton.elt.offsetWidth + 8, drawHeight + 55);
}

function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (let w of words) {
    const test = cur === '' ? w : cur + ' ' + w;
    if (textWidth(test) > maxW && cur !== '') { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function pick(mx, my) {
  if (my > drawHeight || my < 0 || mx < 0 || mx > canvasWidth) return;
  let best = null, bestD = 22;
  for (let i = 0; i < deltaPlaces.length; i++) {
    const d = dist(mx, my, dx + deltaPlaces[i].u * dw, dy + deltaPlaces[i].v * dh);
    if (d < bestD) { bestD = d; best = { side: 'D', i }; }
  }
  for (let i = 0; i < islandPlaces.length; i++) {
    const [px, py] = islandXY(i);
    const d = dist(mx, my, px, py);
    if (d < bestD) { bestD = d; best = { side: 'S', i }; }
  }
  if (best) selected = best;
  else if ((mx > dx && mx < dx + dw && my > dy && my < dy + dh) || (mx > sx && mx < sx + sw && my > sy && my < sy + sh)) selected = null;
}

function mousePressed() { pick(mouseX, mouseY); }

function touchStarted() {
  if (touches.length > 0) pick(touches[0].x, touches[0].y);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  levelSlider.size(Math.min(240, canvasWidth - 210));
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
  if (typeof levelSlider !== 'undefined' && levelSlider) levelSlider.size(Math.min(240, canvasWidth - 210));
}
