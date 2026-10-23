// Mountains to Atolls (Roots & Rivers, Chapter 20)
// CANVAS_HEIGHT = 790 (drawHeight 700 + controlHeight 90); iframe height 792px
// A schematic elevation "staircase" from a Maldives atoll to Mount Everest,
// with Kathmandu (Nepal) and Thimphu (Bhutan) marked, plus a close-up of a
// sample low atoll island. The sea-level slider raises the ocean: the rise
// is invisible at mountain scale but floods much of the low island.
// Elevations: Everest 8,848.86 m (2020 China-Nepal survey); Kathmandu about
// 1,400 m; Thimphu about 2,250-2,650 m; Terai about 59-300 m; Maldives
// average ground about 1.5 m, highest natural point about 2.4 m.
// IPCC AR6 WGI SPM (2021) likely global sea-level rise by 2100 vs 1995-2014:
// 0.28-0.55 m (SSP1-1.9, very low emissions); 0.63-1.01 m (SSP5-8.5, very high).
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 700;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let sliderLeftMargin = 175;
let defaultTextSize = 16;

// controls
let riseSlider, placeSelect, ipccCheckbox;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const SEA = '#9FD3DC';
const LAND = '#C8B98A';

// Schematic profile: x is a 0..1 fraction of the panel width, e is elevation (m).
// Horizontal distances are NOT to scale; this is a staircase, not a transect.
const profile = [
  [0.00, -400], [0.035, -400], [0.045, 0], [0.050, 2.4], [0.055, 0], [0.065, -400],
  [0.20, -400], [0.225, 0], [0.24, 70], [0.30, 150], [0.35, 300], [0.40, 1200],
  [0.43, 1900], [0.46, 1400], [0.52, 1400], [0.55, 2100], [0.58, 1800],
  [0.62, 2300], [0.66, 2500], [0.71, 4200], [0.76, 5600], [0.80, 7000],
  [0.84, 7600], [0.88, 8848.86], [0.92, 7400], [0.96, 6200], [1.00, 5200]
];

const places = [
  { name: 'Maldives atoll', short: 'Maldives', x: 0.05, e: 2.4, elev: 'about 1.5 m on average; highest natural point about 2.4 m',
    country: 'Maldives', note: 'Low coral islands in 26 atolls. Fishing, tourism and life on the water. Biggest worry: sea-level rise.' },
  { name: 'Indian Ocean', short: 'Ocean', x: 0.13, e: 0, elev: 'sea level (0 m)',
    country: 'Between the Maldives and the mainland', note: 'Global average sea level rose about 0.20 m from 1901 to 2018 (IPCC).' },
  { name: 'Terai plains', short: 'Terai', x: 0.30, e: 150, elev: 'about 59 to 300 m',
    country: 'Nepal', note: 'Flat, hot farmland at the northern edge of the great river plain. Rice, wheat and sugarcane.' },
  { name: 'Kathmandu', short: 'Kathmandu', x: 0.49, e: 1400, elev: 'about 1,400 m',
    country: 'Nepal (capital)', note: 'A valley of temples and stupas in the hills, with seven UNESCO monument zones.' },
  { name: 'Thimphu', short: 'Thimphu', x: 0.62, e: 2300, elev: 'about 2,250 to 2,650 m',
    country: 'Bhutan (capital)', note: 'One of the highest capitals on Earth, in a steep Himalayan valley. Dzongs and prayer flags.' },
  { name: 'Mount Everest', short: 'Everest', x: 0.88, e: 8848.86, elev: '8,848.86 m (2020 China-Nepal survey)',
    country: 'Nepal-China border', note: 'Sagarmatha in Nepali. About 3,700 times higher than the Maldives\' highest natural ground.' }
];
let selected = 0;

// Sample atoll island cross-section (schematic). u = 0..1 across the panel.
const island = [
  [0.10, 0.0], [0.17, 0.7], [0.25, 1.1], [0.35, 1.45], [0.46, 1.7], [0.56, 1.8], [0.64, 1.9], [0.72, 2.4], [0.78, 1.9], [0.84, 1.25], [0.90, 0.0]
];
const ZMIN = -0.3, ZMAX = 2.7; // close-up vertical range (m)

// layout
let pTop = 66, pBot = 286, plotL, plotR;
let zTop, zBot;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  riseSlider = createSlider(0, 2.0, 0, 0.05);
  riseSlider.position(sliderLeftMargin, drawHeight + 12);
  riseSlider.size(canvasWidth - sliderLeftMargin - margin * 2);

  placeSelect = createSelect();
  for (let p of places) placeSelect.option(p.name);
  placeSelect.selected(places[selected].name);
  placeSelect.position(10, drawHeight + 52);
  placeSelect.changed(() => {
    selected = places.findIndex(p => p.name === placeSelect.value());
  });

  ipccCheckbox = createCheckbox(' Show IPCC 2100 ranges', true);
  ipccCheckbox.position(175, drawHeight + 54);

  describe('A schematic elevation profile climbs from a low Maldives coral atoll across the Indian Ocean, through the Terai plains of Nepal, Kathmandu at about 1,400 m and Thimphu in Bhutan at about 2,300 m, up to Mount Everest at 8,848.86 m. Below it, a close-up of a sample atoll island shows the sea rising as the slider moves from 0 to 2 m, with the IPCC likely ranges for 2100 shaded, and reports what share of the island lies below the new sea level.');
}

function draw() {
  updateCanvasSize();
  plotL = margin + 54;
  plotR = canvasWidth - margin - 6;

  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawProfile();
  drawCard();
  drawCloseUp();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Mountains to Atolls';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Tap a place to read about it. Raise the sea and compare the two panels.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Tap a place. Raise the sea. Compare panels.';
  text(instr, canvasWidth / 2, 40);
}

// ---------- top panel: the staircase ----------
function ey(e) { // elevation (m) to y on the top panel
  const top = pTop + 22, base = pBot - 26;
  return base - (e / 9000) * (base - top);
}
function px(f) { return plotL + f * (plotR - plotL); }

function drawProfile() {
  const rise = riseSlider.value();
  // panel
  stroke('silver');
  fill('#EEF6FA');
  rect(margin, pTop, canvasWidth - 2 * margin, pBot - pTop, 6);

  // grid and axis labels
  textSize(14);
  textAlign(RIGHT, CENTER);
  for (let e = 0; e <= 8000; e += 2000) {
    stroke('#D8DEE6');
    strokeWeight(1);
    line(plotL, ey(e), plotR, ey(e));
    noStroke();
    fill('#444444');
    text(e === 0 ? '0 m' : nfc(e) + ' m', plotL - 4, ey(e));
  }

  // land
  noStroke();
  fill(LAND);
  beginShape();
  vertex(px(0), pBot - 4);
  for (let p of profile) vertex(px(p[0]), ey(Math.max(p[1], -400)));
  vertex(px(1), pBot - 4);
  endShape(CLOSE);
  // snow on the high peaks
  fill('white');
  beginShape();
  for (let p of profile) if (p[1] >= 5600) vertex(px(p[0]), ey(p[1]));
  endShape(CLOSE);

  // ocean (only where land is below sea level, x 0 to 0.225)
  const seaY = ey(rise);
  fill(SEA + 'CC');
  rect(px(0), seaY, px(0.225) - px(0), pBot - 4 - seaY);
  // atoll dot drawn on top, so it can be seen
  fill(LEAF);
  circle(px(0.05), seaY - 1, 7);
  stroke(TEAL);
  strokeWeight(2);
  line(px(0), seaY, px(0.225), seaY);

  // markers and labels
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    const x = px(p.x), y = ey(p.e);
    stroke(i === selected ? SAFFRON : NAVY);
    strokeWeight(i === selected ? 4 : 2);
    fill(i === selected ? MARIGOLD : 'white');
    circle(x, y, i === selected ? 14 : 11);
    noStroke();
    textSize(14);
    textStyle(i === selected ? BOLD : NORMAL);
    const lw = textWidth(p.short) + 6;
    let lx = constrain(x, plotL + lw / 2, plotR - lw / 2);
    let ly = y - 20;
    if (p.short === 'Ocean') ly = ey(0) + 13;
    if (p.short === 'Kathmandu' && canvasWidth < 560) ly = y + 20;
    if (p.short === 'Everest') ly = y + 2, lx = constrain(x - lw / 2 - 10, plotL + lw / 2, plotR - lw / 2);
    fill(255, 255, 255, 210);
    rect(lx - lw / 2, ly - 9, lw, 18, 4);
    fill(i === selected ? SAFFRON : NAVY);
    textAlign(CENTER, CENTER);
    text(p.short, lx, ly);
  }
  textStyle(NORMAL);

  // footnote inside the panel (top left, where the sky is empty)
  noStroke();
  fill('#333333');
  textSize(14);
  textAlign(LEFT, TOP);
  const note = (plotR - plotL) < 420 ? '1 m of sea rise is too thin to see here. See the close-up.' : 'At this scale, 1 m of sea-level rise is thinner than a line. See the close-up below.';
  text(note, plotL + 4, pTop + 4, plotR - plotL - 120);
}

// ---------- info card ----------
function drawCard() {
  const p = places[selected];
  const y0 = 294, h = 92;
  stroke('silver');
  fill('white');
  rect(margin, y0, canvasWidth - 2 * margin, h, 6);
  noStroke();
  textAlign(LEFT, TOP);
  fill(SAFFRON);
  textStyle(BOLD);
  textSize(16);
  text(p.name + '  ·  ' + p.country, margin + 8, y0 + 6, canvasWidth - 2 * margin - 16, 20);
  textStyle(NORMAL);
  textSize(14);
  fill(NAVY);
  if (canvasWidth < 560) {
    // Narrow screens: one wrapped block so nothing is clipped
    textSize(13);
    text('Elevation: ' + p.elev + '. ' + p.note, margin + 8, y0 + 26, canvasWidth - 2 * margin - 16, 64);
    return;
  }
  text('Elevation: ' + p.elev, margin + 8, y0 + 26, canvasWidth - 2 * margin - 16, 20);
  fill('#333333');
  text(p.note, margin + 8, y0 + 46, canvasWidth - 2 * margin - 16, 44);
}

// ---------- lower panel: close-up of a sample atoll island ----------
function zy(m) { return zBot - ((m - ZMIN) / (ZMAX - ZMIN)) * (zBot - zTop); }
function islandH(u) {
  if (u <= island[0][0] || u >= island[island.length - 1][0]) return -1;
  for (let i = 0; i < island.length - 1; i++) {
    const a = island[i], b = island[i + 1];
    if (u >= a[0] && u <= b[0]) return lerp(a[1], b[1], (u - a[0]) / (b[0] - a[0]));
  }
  return -1;
}

function drawCloseUp() {
  const rise = riseSlider.value();
  const showIPCC = ipccCheckbox.checked();
  const y0 = 394;
  noStroke();
  fill(NAVY);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(16);
  text('Close-up: a sample atoll island (schematic)', margin + 2, y0, canvasWidth - 2 * margin, 22);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let legend = showIPCC
    ? 'Green band: IPCC likely rise by 2100 with very low emissions (0.28-0.55 m). Orange band: with very high emissions (0.63-1.01 m).'
    : 'Heights in meters. Average ground about 1.5 m, highest point about 2.4 m.';
  text(legend, margin + 2, y0 + 22, canvasWidth - 2 * margin - 4, 60);

  zTop = y0 + 88; zBot = zTop + 130;
  const L = plotL, R = plotR;
  stroke('silver');
  fill('#EEF6FA');
  rect(margin, zTop - 4, canvasWidth - 2 * margin, zBot - zTop + 8, 6);

  // axis
  textAlign(RIGHT, CENTER);
  for (let m = 0; m <= 2.5; m += 0.5) {
    stroke('#D8DEE6');
    strokeWeight(1);
    line(L, zy(m), R, zy(m));
    noStroke();
    fill('#444444');
    text(nf(m, 1, 1) + ' m', L - 4, zy(m));
  }

  // IPCC bands
  if (showIPCC) {
    noStroke();
    fill(62, 142, 94, 70);
    rect(L, zy(0.55), R - L, zy(0.28) - zy(0.55));
    fill(226, 96, 28, 70);
    rect(L, zy(1.01), R - L, zy(0.63) - zy(1.01));
  }

  // island
  noStroke();
  fill('#E9D9A6');
  beginShape();
  vertex(L, zy(ZMIN));
  for (let k = 0; k <= 200; k++) {
    const u = k / 200;
    const h = islandH(u);
    vertex(L + u * (R - L), zy(h < 0 ? ZMIN : h));
  }
  vertex(R, zy(ZMIN));
  endShape(CLOSE);
  // palms (simple) on high ground
  stroke(LEAF);
  strokeWeight(3);
  for (let u of [0.3, 0.45, 0.62]) {
    const x = L + u * (R - L), y = zy(islandH(u));
    line(x, y, x + 3, y - 22);
    noStroke();
    fill(LEAF);
    ellipse(x + 3, y - 24, 22, 8);
    stroke(LEAF);
  }

  // water up to the new sea level, drawn as one shape over lower ground
  noStroke();
  fill(14, 124, 134, 120);
  const seaY = zy(rise);
  let below = 0, total = 0;
  beginShape();
  for (let k = 0; k <= 200; k++) vertex(L + (k / 200) * (R - L), seaY);
  for (let k = 200; k >= 0; k--) {
    const h = islandH(k / 200);
    const groundY = zy(h < 0 ? ZMIN : h);
    vertex(L + (k / 200) * (R - L), Math.max(groundY, seaY));
  }
  endShape(CLOSE);
  for (let k = 0; k < 400; k++) {
    const h = islandH((k + 0.5) / 400);
    if (h >= 0) { total++; if (h < rise) below++; }
  }
  stroke(TEAL);
  strokeWeight(2);
  line(L, seaY, R, seaY);

  // result line
  const pct = total ? Math.round(100 * below / total) : 0;
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(14);
  fill(rise >= 1 ? SAFFRON : NAVY);
  const res = 'Sea +' + nf(rise, 1, 2) + ' m: about ' + pct + '% of this sample island\'s width is below the new sea level.';
  text(res, margin + 2, zBot + 8, canvasWidth - 2 * margin - 4, 40);
  textStyle(NORMAL);
  fill('#555555');
  text('Schematic map, not to scale. Not an official depiction of borders.', margin + 2, zBot + 46, canvasWidth - 2 * margin - 4, 40);
}

function drawControlLabels() {
  noStroke();
  fill(NAVY);
  textAlign(LEFT, CENTER);
  textSize(16);
  text('Sea-level rise: ' + nf(riseSlider.value(), 1, 2) + ' m', 10, drawHeight + 22);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    if (dist(mouseX, mouseY, px(p.x), ey(p.e)) < 20) {
      selected = i;
      placeSelect.selected(p.name);
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  riseSlider.size(canvasWidth - sliderLeftMargin - margin * 2);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
