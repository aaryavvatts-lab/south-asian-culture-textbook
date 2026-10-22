// Region Explorer: South Asia (Roots & Rivers, Chapter 1)
// CANVAS_HEIGHT = 700 (drawHeight 620 + controlHeight 80); iframe height 702px
// A schematic tile map of the eight countries of South Asia, with mountain
// ranges, rivers, seas and an animated southwest monsoon front.
// Click (or tap) a country tile, or use the menu, to see its capital,
// population (2025, World Bank) and main languages.
// Press Start to watch the normal southwest monsoon spread from late May to
// about 8 July (IMD normal dates). The map is schematic: no borders are drawn.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 620;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let startButton, resetButton, countrySelect, labelCheckbox;
let isRunning = false; // MicroSims always start paused

// monsoon clock: day 0 = 1 June. Runs from 20 May (-12) to 8 July (37)
const DAY_START = -12;
const DAY_END = 37;
let day = DAY_START;
let raindrops = [];

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const SEA = '#D6ECF0';

// Country tiles: centre (cx, cy), size (w, h) in map units 0..1.
// Positions are only roughly geographic. Not to scale.
// Populations: World Bank SP.POP.TOTL, 2025 (dataset updated October 2026).
const countries = [
  { name: 'Afghanistan', cx: 0.13, cy: 0.24, w: 0.22, h: 0.13, color: '#C9B48A',
    capital: 'Kabul', pop: '43,844,111 (about 44 million)',
    langs: 'Pashto and Dari',
    note: 'The Hindu Kush crosses the country. Most of it lies outside the monsoon zone.' },
  { name: 'Pakistan', cx: 0.25, cy: 0.42, w: 0.19, h: 0.15, color: '#9CC5A1',
    capital: 'Islamabad', pop: '255,219,554 (about 255 million)',
    langs: 'Urdu (national) and English; also Punjabi, Pashto, Sindhi and more',
    note: 'The Indus River runs the length of the country to the Arabian Sea.' },
  { name: 'India', cx: 0.50, cy: 0.60, w: 0.28, h: 0.34, color: '#F6C98B',
    capital: 'New Delhi', pop: '1,463,865,525 (about 1.46 billion)',
    langs: 'Hindi and English (official); 22 languages in the Eighth Schedule',
    note: 'Himalaya, Indo-Gangetic Plain, Thar Desert, Deccan Plateau and both Ghats.' },
  { name: 'Nepal', cx: 0.52, cy: 0.335, w: 0.16, h: 0.07, color: '#E8A7A0',
    capital: 'Kathmandu', pop: '29,618,118 (about 30 million)',
    langs: 'Nepali; many other languages too',
    note: 'Mount Everest (8,848.86 m) stands on its border with China.' },
  { name: 'Bhutan', cx: 0.71, cy: 0.335, w: 0.11, h: 0.07, color: '#F2B880',
    capital: 'Thimphu', pop: '796,682 (about 800,000)',
    langs: 'Dzongkha (national); English in schools',
    note: 'A Himalayan kingdom of steep valleys and high peaks.' },
  { name: 'Bangladesh', cx: 0.76, cy: 0.47, w: 0.14, h: 0.10, color: '#A8D5BA',
    capital: 'Dhaka', pop: '175,686,899 (about 176 million)',
    langs: 'Bangla (Bengali)',
    note: 'Mostly low delta land where the Ganga (Padma) meets the Brahmaputra (Jamuna).' },
  { name: 'Sri Lanka', cx: 0.58, cy: 0.875, w: 0.13, h: 0.07, color: '#B9D88F',
    capital: 'Sri Jayawardenepura Kotte (legislative); Colombo (executive)',
    pop: '21,756,000 (about 22 million)',
    langs: 'Sinhala and Tamil',
    note: 'An island in the Indian Ocean, south of India.' },
  { name: 'Maldives', cx: 0.33, cy: 0.875, w: 0.13, h: 0.07, color: '#9ED3DD',
    capital: 'Malé', pop: '529,676 (about 530,000)',
    langs: 'Dhivehi',
    note: '1,192 coral islands in 26 atolls. Most sit less than 1 m above sea level.' }
];
let selected = 5; // start with Bangladesh selected

// Mountain ranges (polylines in map units)
const ranges = [
  { name: 'Hindu Kush', pts: [[0.04, 0.19], [0.13, 0.135], [0.26, 0.10]], lx: 0.10, ly: 0.105 },
  { name: 'Himalaya', pts: [[0.31, 0.12], [0.40, 0.20], [0.50, 0.265], [0.64, 0.285], [0.78, 0.285], [0.87, 0.26]], lx: 0.64, ly: 0.225 },
  { name: 'W. Ghats', pts: [[0.385, 0.52], [0.40, 0.62], [0.43, 0.74]], lx: 0.29, ly: 0.64, dashed: false },
  { name: 'E. Ghats', pts: [[0.61, 0.52], [0.575, 0.63], [0.52, 0.74]], lx: 0.70, ly: 0.63, dashed: true }
];

// Rivers (polylines in map units)
const rivers = [
  { name: 'Indus', pts: [[0.30, 0.09], [0.27, 0.20], [0.25, 0.33], [0.22, 0.45], [0.16, 0.56]], lx: 0.10, ly: 0.465 },
  { name: 'Ganga', pts: [[0.46, 0.27], [0.50, 0.41], [0.58, 0.45], [0.66, 0.47], [0.72, 0.51], [0.75, 0.57]], lx: 0.58, ly: 0.405 },
  { name: 'Brahmaputra', pts: [[0.60, 0.20], [0.74, 0.20], [0.88, 0.25], [0.88, 0.36], [0.80, 0.42], [0.77, 0.52]], lx: 0.77, ly: 0.165 }
];

// Seas
const seas = [
  { name: 'Arabian Sea', x: 0.17, y: 0.70 },
  { name: 'Bay of Bengal', x: 0.82, y: 0.68 },
  { name: 'Indian Ocean', x: 0.80, y: 0.84 }
];

// map geometry, recalculated each frame
let mx, my, mw, mh, px, py, pw, ph, wide;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: Start/Pause, Reset, country menu
  startButton = createButton('Start monsoon');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(130, drawHeight + 8);
  resetButton.mousePressed(resetSimulation);

  countrySelect = createSelect();
  for (let c of countries) countrySelect.option(c.name);
  countrySelect.selected(countries[selected].name);
  countrySelect.position(195, drawHeight + 8);
  countrySelect.changed(() => {
    const v = countrySelect.value();
    selected = countries.findIndex(c => c.name === v);
  });

  // Row 2: labels checkbox
  labelCheckbox = createCheckbox(' Show mountains, rivers and seas', true);
  labelCheckbox.position(10, drawHeight + 46);

  for (let i = 0; i < 160; i++) raindrops.push({ x: random(), y: random(), s: random(0.004, 0.009) });

  describe('Schematic tile map of the eight countries of South Asia with the Hindu Kush, Himalaya, Western and Eastern Ghats, the Indus, Ganga and Brahmaputra rivers, and the Arabian Sea, Bay of Bengal and Indian Ocean. Selecting a country shows its capital, 2025 population and main languages. Pressing Start animates the southwest monsoon spreading from the southwest sea across the region from late May to early July, without reaching most of Afghanistan.');
}

function computeLayout() {
  wide = canvasWidth >= 700;
  const top = 66;
  if (wide) {
    mx = margin; my = top;
    mw = Math.floor(canvasWidth * 0.62) - margin * 1.5;
    mh = drawHeight - top - margin - 24;
    px = mx + mw + margin; py = top;
    pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    mx = margin; my = top;
    mw = canvasWidth - 2 * margin;
    mh = 360;
    px = margin; py = my + mh + 44;
    pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin;
  }
}

// convert map units to pixels
function X(u) { return mx + u * mw; }
function Y(v) { return my + v * mh; }

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

  drawTitle();

  if (isRunning) {
    day += 0.09;
    if (day >= DAY_END) {
      day = DAY_END;
      isRunning = false;
      startButton.html('Start monsoon');
    }
  }

  drawMap();
  drawPanel();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Region Explorer: South Asia';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Click a country to learn about it. Press Start to watch the monsoon arrive.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Tap a country. Press Start for the monsoon.';
  text(instr, canvasWidth / 2, 40);
}

function drawMap() {
  // sea background
  stroke('silver');
  strokeWeight(1);
  fill(SEA);
  rect(mx, my, mw, mh, 6);

  // country tiles
  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    const x = X(c.cx - c.w / 2), y = Y(c.cy - c.h / 2);
    if (i === selected) {
      stroke(SAFFRON);
      strokeWeight(4);
    } else {
      stroke('white');
      strokeWeight(2);
    }
    fill(c.color);
    if (c.name === 'Maldives') {
      // a chain of small atoll dots inside a soft tile
      fill(c.color + '88');
      rect(x, y, c.w * mw, c.h * mh, 10);
      noStroke();
      fill(c.color);
      for (let k = 0; k < 6; k++) {
        circle(X(c.cx - c.w / 2 + 0.012 + k * (c.w - 0.024) / 5), Y(c.cy + 0.022 * sin(k * 1.3)), 7);
      }
    } else {
      rect(x, y, c.w * mw, c.h * mh, 8);
    }
  }

  // Thar Desert and plains, drawn on top of tiles as soft shapes
  noStroke();
  fill(GOLD + '99');
  ellipse(X(0.355), Y(0.475), 0.09 * mw, 0.07 * mh);
  fill(LEAF + '33');
  rect(X(0.40), Y(0.435), 0.24 * mw, 0.055 * mh, 6);

  // monsoon rain overlay
  drawMonsoon();

  // mountain ranges
  for (let r of ranges) drawRange(r);

  // rivers
  for (let rv of rivers) {
    stroke('#2F6FB0');
    strokeWeight(3);
    noFill();
    beginShape();
    curveVertex(X(rv.pts[0][0]), Y(rv.pts[0][1]));
    for (let p of rv.pts) curveVertex(X(p[0]), Y(p[1]));
    const last = rv.pts[rv.pts.length - 1];
    curveVertex(X(last[0]), Y(last[1]));
    endShape();
  }

  // country names
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    let ly = c.cy;
    if (c.name === 'India') ly = 0.555;
    if (c.name === 'Maldives') ly = c.cy - 0.055;
    if (c.name === 'Sri Lanka') ly = c.cy + 0.055;
    labelText(c.name, X(c.cx), Y(ly), NAVY, i === selected);
  }
  textStyle(NORMAL);

  // feature labels
  if (labelCheckbox.checked()) {
    textSize(14);
    for (let r of ranges) labelText(r.name, X(r.lx), Y(r.ly), '#5A3E1B', false);
    for (let rv of rivers) labelText(rv.name, X(rv.lx), Y(rv.ly), '#1F4F86', false);
    textStyle(ITALIC);
    for (let s of seas) labelText(s.name, X(s.x), Y(s.y), TEAL, false);
    textStyle(NORMAL);
    labelText('Thar Desert', X(0.26), Y(0.535), '#7A5A10', false);
    labelText('Deccan Plateau', X(0.50), Y(0.66), '#5A3E1B', false);
  }

  // monsoon date banner and caption
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  fill(NAVY);
  const d = monsoonDateText();
  fill(255, 255, 255, 220);
  rect(X(0.02), Y(0.005) + 4, Math.min(textWidth(d) + 12, mw - 12), 22, 4);
  fill(NAVY);
  text(d, X(0.02) + 6, Y(0.005) + 8);

  // caption sits just under the map box, still inside the drawing area
  fill('#333333');
  textAlign(CENTER, TOP);
  const cap = 'Schematic map, not to scale. Not an official depiction of borders.';
  if (textWidth(cap) < mw - 10) {
    text(cap, mx + mw / 2, my + mh + 5);
  } else {
    text('Schematic map, not to scale.', mx + mw / 2, my + mh + 4);
    text('Not an official depiction of borders.', mx + mw / 2, my + mh + 21);
  }
}

// text with a soft white backing so it stays readable over shapes
function labelText(s, x, y, col, emphasize) {
  const w = textWidth(s) + 6;
  noStroke();
  fill(255, 255, 255, emphasize ? 235 : 170);
  rect(x - w / 2, y - 10, w, 20, 4);
  fill(col);
  text(s, x, y);
}

function drawRange(r) {
  // small triangles along the polyline
  const pts = r.pts;
  noStroke();
  for (let i = 0; i < pts.length - 1; i++) {
    const x1 = X(pts[i][0]), y1 = Y(pts[i][1]);
    const x2 = X(pts[i + 1][0]), y2 = Y(pts[i + 1][1]);
    const len = dist(x1, y1, x2, y2);
    const n = Math.max(1, Math.floor(len / 13));
    for (let k = 0; k < n; k++) {
      if (r.dashed && k % 2 === 1) continue;
      const t = (k + 0.5) / n;
      const x = lerp(x1, x2, t), y = lerp(y1, y2, t);
      fill(r.name === 'Himalaya' || r.name === 'Hindu Kush' ? '#8B5E3C' : '#6E8B3D');
      triangle(x - 6, y + 5, x + 6, y + 5, x, y - 7);
      if (r.name === 'Himalaya' || r.name === 'Hindu Kush') {
        fill('white');
        triangle(x - 2.5, y - 2, x + 2.5, y - 2, x, y - 7);
      }
    }
  }
}

// Schematic onset day for a point (day 0 = 1 June).
// Two branches: the Arabian Sea branch from the southwest and the
// Bay of Bengal branch. Most of Afghanistan and the far northwest stay dry.
function onsetDay(u, v) {
  if (u < 0.21 && v < 0.36) return 999;      // Afghanistan: mostly outside the monsoon zone
  if (v < 0.15) return 999;                  // high mountains in the far north
  const a = -12 + 55 * dist(u, v, 0.40, 1.02) + 60 * Math.max(0, 0.38 - u);
  const b = -2 + 42 * dist(u, v, 0.80, 0.66);
  return Math.min(a, b);
}

function drawMonsoon() {
  if (day <= DAY_START) return;
  // shaded cells where the monsoon has arrived
  const cols = 40, rows = 34;
  const cw = mw / cols, chh = mh / rows;
  noStroke();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const u = (i + 0.5) / cols, v = (j + 0.5) / rows;
      if (onsetDay(u, v) <= day) {
        fill(14, 124, 134, 55);
        const x0 = Math.round(mx + i * cw), x1 = Math.round(mx + (i + 1) * cw);
        const y0 = Math.round(my + j * chh), y1 = Math.round(my + (j + 1) * chh);
        rect(x0, y0, x1 - x0, y1 - y0);
      }
    }
  }
  // falling rain
  stroke('#1E5FA0');
  strokeWeight(1.5);
  for (let d of raindrops) {
    if (isRunning) {
      d.y += d.s;
      if (d.y > 1) { d.y = 0; d.x = random(); }
    }
    if (onsetDay(d.x, d.y) <= day) {
      line(X(d.x), Y(d.y), X(d.x) - 2, Y(d.y) + 7);
    }
  }
  // wind arrows from the southwest
  if (day < DAY_END) {
    stroke(NAVY);
    strokeWeight(2);
    for (let k = 0; k < 3; k++) {
      const bx = X(0.06 + k * 0.08), by = Y(0.95 - k * 0.04);
      const ex = bx + 0.07 * mw, ey = by - 0.06 * mh;
      line(bx, by, ex, ey);
      const ang = atan2(ey - by, ex - bx);
      line(ex, ey, ex - 8 * cos(ang - 0.5), ey - 8 * sin(ang - 0.5));
      line(ex, ey, ex - 8 * cos(ang + 0.5), ey - 8 * sin(ang + 0.5));
    }
  }
}

function monsoonDateText() {
  if (day <= DAY_START) return 'Monsoon: not started (press Start)';
  const d = Math.floor(day);
  let dateStr;
  if (d < 0) dateStr = (31 + d) + ' May';
  else if (d < 30) dateStr = (d + 1) + ' June';
  else dateStr = (d - 29) + ' July';
  let msg = 'Normal monsoon progress: ' + dateStr;
  if (d >= 0 && d < 6) msg += ' (reaches Kerala)';
  if (d >= DAY_END) msg = 'About 8 July: monsoon covers all of India';
  return msg;
}

function drawPanel() {
  const c = countries[selected];
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  noStroke();

  const pad = 10;
  let y = py + pad;
  const tw = pw - 2 * pad;
  textAlign(LEFT, TOP);

  fill(SAFFRON);
  textStyle(BOLD);
  textSize(wide ? 22 : 18);
  text(c.name, px + pad, y);
  y += wide ? 32 : 24;

  const bodySize = wide ? 16 : 14;
  const lead = wide ? 21 : 18;
  textSize(bodySize);
  const rowsData = [
    ['Capital: ', c.capital],
    ['Population (2025): ', c.pop],
    ['Main languages: ', c.langs],
    ['', c.note]
  ];
  for (let r of rowsData) {
    textStyle(BOLD);
    fill(NAVY);
    const full = r[0] + r[1];
    textStyle(NORMAL);
    fill(r[0] === '' ? '#444444' : '#222222');
    const lines = wrapLines(full, tw);
    for (let k = 0; k < lines.length; k++) {
      if (k === 0 && r[0] !== '') {
        textStyle(BOLD);
        fill(NAVY);
        text(r[0], px + pad, y);
        const lw = textWidth(r[0]);
        textStyle(NORMAL);
        fill('#222222');
        text(lines[0].substring(r[0].length), px + pad + lw, y);
      } else {
        text(lines[k], px + pad, y);
      }
      y += lead;
    }
    y += wide ? 6 : 2;
  }

  // total line at the bottom of the panel
  textStyle(BOLD);
  fill(TEAL);
  textSize(14);
  const tot = 'All eight countries: about 1.99 billion people (2025, World Bank)';
  const tl = wrapLines(tot, tw);
  let ty = py + ph - pad - tl.length * 18;
  if (ty > y) {
    for (let k = 0; k < tl.length; k++) text(tl[k], px + pad, ty + k * 18);
  }
  textStyle(NORMAL);
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

function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0) return;
  for (let i = countries.length - 1; i >= 0; i--) {
    const c = countries[i];
    const x = X(c.cx - c.w / 2), y = Y(c.cy - c.h / 2);
    if (mouseX >= x && mouseX <= x + c.w * mw && mouseY >= y && mouseY <= y + c.h * mh) {
      selected = i;
      countrySelect.selected(c.name);
      return;
    }
  }
}

function toggleSimulation() {
  if (!isRunning && day >= DAY_END) day = DAY_START;
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start monsoon');
}

function resetSimulation() {
  isRunning = false;
  day = DAY_START;
  startButton.html('Start monsoon');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
