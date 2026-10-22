// Migration Waves (Roots & Rivers, Chapter 21)
// CANVAS_HEIGHT = 760 (drawHeight 670 + controlHeight 90); iframe height 762px
// A schematic "world" of labeled region tiles (NOT a real map) with South
// Asia in the center. A timeline (1830-2020) lights up arcs for the major
// waves of South Asian migration while they are active; finished waves stay
// faintly visible. Click a tile or choose a wave to read its card.
// Dates and figures are sourced in logs/21-factcheck.md.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 670;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

let playButton, resetButton, yearSlider, waveSelect;
let isRunning = false; // MicroSims always start paused
let year = 1975;
const YEAR_MIN = 1830, YEAR_MAX = 2020;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

// Region tiles: centre in map fractions. Placement is schematic only.
const tiles = {
  USA: { label: 'United States', x: 0.13, y: 0.17, color: '#CFE3F2' },
  CAR: { label: 'Caribbean', x: 0.13, y: 0.60, color: '#CDEBD3' },
  BRI: { label: 'Britain', x: 0.42, y: 0.12, color: '#E3DDF2' },
  GULF: { label: 'The Gulf', x: 0.50, y: 0.62, color: '#F6E3B8' },
  EAF: { label: 'East Africa', x: 0.34, y: 0.80, color: '#F2D3C2' },
  MAU: { label: 'Mauritius', x: 0.61, y: 0.88, color: '#D7EEF0' },
  SA: { label: 'South Asia', x: 0.75, y: 0.45, color: '#FBD38D' },
  FIJ: { label: 'Fiji', x: 0.92, y: 0.84, color: '#D7EEF0' }
};

// Waves of migration
const waves = [
  { name: 'Indenture: Mauritius', from: 'SA', to: 'MAU', start: 1834, end: 1920, bend: 0.15, color: SAFFRON,
    years: '1834 to about 1920',
    cause: 'After Britain abolished slavery (1833 act), sugar planters recruited contract workers from British India.',
    fact: 'Mauritius was among the first and largest indenture destinations.' },
  { name: 'Indenture: Caribbean', from: 'SA', to: 'CAR', start: 1838, end: 1917, bend: 0.22, color: SAFFRON,
    years: '1838 to 1917',
    cause: 'Sugar plantations needed labor after slavery ended. Workers signed five-year contracts (girmit).',
    fact: 'The Hesperus reached British Guiana on 5 May 1838. Indo-Guyanese were about 40% of Guyana in 2012.' },
  { name: 'Indenture: Fiji', from: 'SA', to: 'FIJ', start: 1879, end: 1916, bend: -0.2, color: SAFFRON,
    years: '1879 to 1916',
    cause: 'Fiji\'s colonial rulers brought workers for sugar-cane plantations.',
    fact: 'The Leonidas landed on 14 May 1879. All contracts ended on 1 January 1920.' },
  { name: 'East Africa', from: 'SA', to: 'EAF', start: 1896, end: 1972, bend: -0.15, color: TEAL,
    years: '1896 (Uganda Railway) to 1972',
    cause: 'British rule: more than 30,000 workers built the Uganda Railway (1896-1901); traders and clerks followed.',
    fact: 'Many stayed and built communities in Kenya, Uganda and Tanzania.' },
  { name: 'Uganda 1972: to Britain', from: 'EAF', to: 'BRI', start: 1972, end: 1973, bend: 0.25, color: '#B03A2E',
    years: '1972',
    cause: 'Idi Amin gave about 80,000 South Asians 90 days to leave Uganda (4 August 1972).',
    fact: 'Around 28,000 went to Britain; thousands more to Canada, India and elsewhere.' },
  { name: 'Early North America', from: 'SA', to: 'USA', start: 1900, end: 1917, bend: 0.12, color: LEAF,
    years: 'about 1900 to 1917',
    cause: 'Jobs in mills, railways and farms on the West Coast, mostly for Punjabi Sikh men.',
    fact: 'Stockton gurdwara founded 1912. The 1917 Asiatic Barred Zone stopped new arrivals.' },
  { name: 'Britain', from: 'SA', to: 'BRI', start: 1948, end: 1985, bend: 0.1, color: '#6A4C93',
    years: 'after 1947, peaking 1950s to 1970s',
    cause: 'Labor shortages after World War II; Commonwealth citizens could come. Many from Punjab, Mirpur, Sylhet.',
    fact: '2021 Census (England and Wales): Indian 1.86 million, Pakistani 1.59 million, Bangladeshi 645,000.' },
  { name: 'The Gulf', from: 'SA', to: 'GULF', start: 1972, end: 2020, bend: -0.12, color: MARIGOLD,
    years: '1970s to today',
    cause: 'The oil boom: Gulf states needed builders, drivers, nurses, engineers and domestic workers.',
    fact: 'Remittances to India were about US$150.7 billion in 2025, the most of any country (World Bank).' },
  { name: 'United States after 1965', from: 'SA', to: 'USA', start: 1965, end: 2020, bend: -0.12, color: NAVY,
    years: '1965 to today',
    cause: 'The Immigration Act of 1965 ended national-origin quotas and favored skills and family reunification.',
    fact: 'In 2023 about 5.2 million Indian, 680,000 Pakistani and 300,000 Bangladeshi Americans (Pew).' }
];
let selected = 7;

let mx, my, mw, mh;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  playButton = createButton('Play');
  playButton.position(10, drawHeight + 10);
  playButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(70, drawHeight + 10);
  resetButton.mousePressed(resetSimulation);

  yearSlider = createSlider(YEAR_MIN, YEAR_MAX, year, 1);
  yearSlider.position(sliderLeftMargin, drawHeight + 12);
  yearSlider.size(canvasWidth - sliderLeftMargin - margin * 2);
  yearSlider.input(() => { year = yearSlider.value(); });

  waveSelect = createSelect();
  for (let w of waves) waveSelect.option(w.name);
  waveSelect.selected(waves[selected].name);
  waveSelect.position(10, drawHeight + 52);
  waveSelect.changed(() => {
    selected = waves.findIndex(w => w.name === waveSelect.value());
  });

  describe('A schematic diagram of labeled region tiles, not a real map, with South Asia in the center and tiles for the United States, the Caribbean, Britain, the Gulf, East Africa, Mauritius and Fiji. A year slider from 1830 to 2020 lights up arcs for waves of South Asian migration while they are active: indenture to Mauritius, the Caribbean and Fiji, East Africa, the early United States, Britain, the 1972 Uganda expulsion to Britain, the Gulf, and the United States after 1965. A card describes the selected wave, its years, its cause and one fact.');
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) {
    year += 0.25;
    if (year >= YEAR_MAX) {
      year = YEAR_MAX;
      isRunning = false;
      playButton.html('Play');
    }
    yearSlider.value(Math.floor(year));
  }

  mx = margin; my = 66; mw = canvasWidth - 2 * margin;
  mh = canvasWidth < 560 ? 330 : 350;

  drawTitle();
  drawWorld();
  drawCard();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Migration Waves';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Press Play or drag the year. Tap a region to read about its wave.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Press Play or drag the year. Tap a region.';
  text(instr, canvasWidth / 2, 40);
}

function tileW(k) { const tw = Math.max(76, mw * 0.17); return k === 'SA' ? tw + 14 : tw; }
// keep every tile fully inside the panel, even on narrow screens
function TX(k) {
  const half = tileW(k) / 2 + 4;
  return constrain(mx + tiles[k].x * mw, mx + half, mx + mw - half);
}
function TY(k) { return my + tiles[k].y * mh; }

function drawWorld() {
  // background panel (ocean-colored, but this is not a map)
  stroke('silver');
  fill('#EAF4F7');
  rect(mx, my, mw, mh, 8);

  // arcs
  for (let i = 0; i < waves.length; i++) {
    const w = waves[i];
    if (year < w.start) continue;
    const active = year <= w.end;
    drawArc(w, active, i === selected);
  }

  // tiles
  const tw = Math.max(76, mw * 0.17), th = 40;
  textSize(14);
  for (let k in tiles) {
    const t = tiles[k];
    const x = TX(k), y = TY(k);
    const isSA = k === 'SA';
    const isSel = waves[selected].to === k || waves[selected].from === k && !isSA;
    stroke(isSel ? SAFFRON : 'white');
    strokeWeight(isSel ? 3 : 2);
    fill(t.color);
    const w = tileW(k);
    rect(x - w / 2, y - th / 2, w, th, 8);
    noStroke();
    fill(NAVY);
    textStyle(isSA ? BOLD : NORMAL);
    textAlign(CENTER, CENTER);
    let lab = t.label;
    if (textWidth(lab) > w - 6) lab = lab.replace(' ', '\n');
    text(lab, x, y);
  }
  textStyle(NORMAL);

  // year banner
  noStroke();
  fill(255, 255, 255, 220);
  rect(mx + 6, my + mh - 34, 120, 28, 6);
  fill(SAFFRON);
  textStyle(BOLD);
  textSize(20);
  textAlign(LEFT, CENTER);
  text('Year: ' + Math.floor(year), mx + 12, my + mh - 20);
  textStyle(NORMAL);

  // caption
  fill('#555555');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Schematic map, not to scale. Not an official depiction of borders.', mx, my + mh + 6, mw, 40);
}

function arcPoint(w, f) {
  const x1 = TX(w.from), y1 = TY(w.from), x2 = TX(w.to), y2 = TY(w.to);
  const dx = x2 - x1, dy = y2 - y1;
  const cx = (x1 + x2) / 2 - dy * w.bend * 2, cy = (y1 + y2) / 2 + dx * w.bend * 2;
  const a = 1 - f;
  return { x: a * a * x1 + 2 * a * f * cx + f * f * x2, y: a * a * y1 + 2 * a * f * cy + f * f * y2 };
}

function drawArc(w, active, isSel) {
  const c = color(w.color);
  noFill();
  if (active) {
    c.setAlpha(230);
    strokeWeight(isSel ? 6 : 4);
  } else {
    c.setAlpha(isSel ? 160 : 70);
    strokeWeight(isSel ? 4 : 2);
  }
  stroke(c);
  beginShape();
  for (let k = 0; k <= 30; k++) {
    const p = arcPoint(w, k / 30);
    vertex(p.x, p.y);
  }
  endShape();
  // arrowhead near the destination
  const p1 = arcPoint(w, 0.86), p2 = arcPoint(w, 0.93);
  const ang = atan2(p2.y - p1.y, p2.x - p1.x);
  push();
  translate(p2.x, p2.y);
  rotate(ang);
  noStroke();
  fill(c);
  triangle(8, 0, -6, -6, -6, 6);
  pop();
  // moving dots while active (tied to the year, so they stop when paused)
  if (active) {
    noStroke();
    fill(255);
    for (let d = 0; d < 3; d++) {
      const f = ((year - w.start) * 0.15 + d / 3) % 1;
      const p = arcPoint(w, 0.08 + f * 0.8);
      circle(p.x, p.y, 6);
    }
  }
}

function drawCard() {
  const w = waves[selected];
  const y0 = my + mh + 46;
  const h = drawHeight - y0 - margin;
  const tw = canvasWidth - 2 * margin - 16;
  stroke('silver');
  fill('white');
  rect(margin, y0, canvasWidth - 2 * margin, h, 6);
  noStroke();
  textAlign(LEFT, TOP);
  let ty = y0 + 8;
  textStyle(BOLD);
  textSize(16);
  fill(w.color === NAVY ? NAVY : SAFFRON);
  text(w.name + '  (' + w.years + ')', margin + 8, ty, tw, 44);
  ty += textLines(w.name + '  (' + w.years + ')', tw) * 20 + 4;
  textSize(14);
  textStyle(NORMAL);
  fill('#333333');
  text('Why: ' + w.cause, margin + 8, ty, tw, 80);
  ty += textLines('Why: ' + w.cause, tw) * 18 + 6;
  text('Fact: ' + w.fact, margin + 8, ty, tw, 80);
  ty += textLines('Fact: ' + w.fact, tw) * 18 + 8;

  // which waves are active this year
  const act = waves.filter(v => year >= v.start && year <= v.end).map(v => v.name);
  textStyle(BOLD);
  fill(TEAL);
  const line = 'Active in ' + Math.floor(year) + ': ' + (act.length ? act.join(', ') : 'none yet');
  text(line, margin + 8, ty, tw, y0 + h - ty - 4);
  textStyle(NORMAL);
}

// rough count of wrapped lines for the current text size
function textLines(s, w) {
  const words = s.split(' ');
  let lines = 1, cur = '';
  for (let wd of words) {
    const test = cur ? cur + ' ' + wd : wd;
    if (textWidth(test) > w) { lines++; cur = wd; } else cur = test;
  }
  return lines;
}

function mousePressed() {
  if (mouseY < my || mouseY > my + mh || mouseX < mx || mouseX > mx + mw) return;
  const tw = Math.max(76, mw * 0.17);
  for (let k in tiles) {
    if (k === 'SA') continue;
    if (Math.abs(mouseX - TX(k)) < tw / 2 && Math.abs(mouseY - TY(k)) < 22) {
      // choose the wave to this region that is active now, or the latest one started
      let best = -1;
      for (let i = 0; i < waves.length; i++) {
        if (waves[i].to !== k) continue;
        if (best < 0) best = i;
        if (year >= waves[i].start) best = i;
      }
      if (best >= 0) {
        selected = best;
        waveSelect.selected(waves[best].name);
      }
      return;
    }
  }
}

function toggleSimulation() {
  isRunning = !isRunning;
  if (isRunning && year >= YEAR_MAX) year = YEAR_MIN;
  playButton.html(isRunning ? 'Pause' : 'Play');
}

function resetSimulation() {
  isRunning = false;
  playButton.html('Play');
  year = YEAR_MIN;
  yearSlider.value(year);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  yearSlider.size(canvasWidth - sliderLeftMargin - margin * 2);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
