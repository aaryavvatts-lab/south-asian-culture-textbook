// Country Compare: Pakistan and Afghanistan (Roots & Rivers, Chapter 18)
// CANVAS_HEIGHT = 800 (drawHeight 700 + controlHeight 100); iframe height 802px
// A schematic map of labeled dots (no borders) plus a comparison card.
// The menu switches the card between two countries (Pakistan, Afghanistan)
// and two cultural regions that cross today's border (the Punjab region and
// the Pashtun belt). Start animates a traveler along the old road from Kabul
// through the Khyber Pass to Peshawar, Islamabad and Lahore.
// Populations: World Bank SP.POP.TOTL, 2025. Languages: Pakistan 2023 census.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 700;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let viewSelect, startButton, resetButton;
let isRunning = false; // MicroSims always start paused

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

// Places: u, v in map units (0..1), placed by approximate longitude and
// latitude. Not to scale. country is used only for dot color.
const places = [
  { name: 'Kabul', u: 0.58, v: 0.24, c: 'A', dx: -34, dy: 2,
    info: 'Capital of Afghanistan, about 1,800 m up in a mountain valley. Babur ruled Kabul before founding the Mughal Empire in 1526, and he is buried in a garden here.' },
  { name: 'Bamiyan', u: 0.47, v: 0.21, c: 'A', dx: -10, dy: -16,
    info: 'Cliffs where two giant Buddhas (55 m and 38 m) stood until March 2001. UNESCO World Heritage site since 2003.' },
  { name: 'Jam', u: 0.27, v: 0.25, c: 'A', dx: 0, dy: -16,
    info: 'The Minaret of Jam, a 65 m brick tower built in 1194. UNESCO World Heritage site since 2002.' },
  { name: 'Jalalabad', u: 0.66, v: 0.27, c: 'A', dx: 0, dy: -18,
    info: 'A city on the road east from Kabul and a center of Pashtun culture.' },
  { name: 'Kandahar', u: 0.35, v: 0.44, c: 'A', dx: 0, dy: 17,
    info: 'A major city of southern Afghanistan and an important center of Pashtun culture.' },
  { name: 'Khyber Pass', u: 0.71, v: 0.30, c: 'P', dx: -12, dy: 17,
    info: 'A mountain pass about 53 km long, ending at the border town of Torkham. Traders, pilgrims and armies used it for more than 2,000 years.' },
  { name: 'Peshawar', u: 0.76, v: 0.27, c: 'P', dx: 34, dy: -17,
    info: 'Capital of Khyber Pakhtunkhwa province, at the Pakistan end of the Khyber road. A center of Pashtun culture.' },
  { name: 'Islamabad', u: 0.85, v: 0.30, c: 'P', dx: 22, dy: 17,
    info: 'Capital of Pakistan, a planned city built from 1961. The ruins of Taxila (UNESCO, 1980) are nearby.' },
  { name: 'Lahore', u: 0.92, v: 0.45, c: 'P', dx: -10, dy: 17,
    info: 'Capital of Punjab province and Pakistan\'s second-largest city. Its Mughal Fort and Shalamar Gardens are a UNESCO site (1981).' },
  { name: 'Quetta', u: 0.43, v: 0.54, c: 'P', dx: 0, dy: 17,
    info: 'Capital of Balochistan, Pakistan\'s largest and most thinly populated province.' },
  { name: 'Mohenjo-daro', u: 0.54, v: 0.74, c: 'P', dx: 0, dy: -16,
    info: 'A great city of the Indus Valley Civilization in Sindh. UNESCO World Heritage site since 1980.' },
  { name: 'Karachi', u: 0.45, v: 0.90, c: 'P', dx: 0, dy: -16,
    info: 'Capital of Sindh and Pakistan\'s largest city, a port on the Arabian Sea.' }
];
let selectedPlace = -1;

// The old road: Kabul -> Jalalabad -> Khyber Pass -> Peshawar -> Islamabad -> Lahore
const routeNames = ['Kabul', 'Jalalabad', 'Khyber Pass', 'Peshawar', 'Islamabad', 'Lahore'];
let route = [];
let routeT = 0; // 0 .. route.length - 1

// Views for the comparison card
const views = {
  'Pakistan': {
    color: LEAF,
    rows: [
      ['Capital', 'Islamabad'],
      ['Population (2025)', '255,219,554 (about 255 million), World Bank'],
      ['Languages', 'Urdu is the national language; English is official. Most common first language: Punjabi (about 37%, 2023 census)'],
      ['Main faith', 'Islam (about 96%); Hindu and Christian minorities'],
      ['UNESCO site', 'Fort and Shalamar Gardens in Lahore (1981)'],
      ['Food', 'Biryani, nihari and karahi; chapli kebab in Khyber Pakhtunkhwa'],
      ['Festivals', 'Eid al-Fitr, Eid al-Adha; Independence Day, 14 August']
    ]
  },
  'Afghanistan': {
    color: MARIGOLD,
    rows: [
      ['Capital', 'Kabul'],
      ['Population (2025)', '43,844,111 (about 44 million), World Bank'],
      ['Languages', 'Dari and Pashto (both official); Dari is the most widely shared language'],
      ['Main faith', 'Islam: mostly Sunni, with a Shia minority (many are Hazara)'],
      ['UNESCO site', 'Minaret of Jam (2002); Bamiyan Valley (2003)'],
      ['Food', 'Kabuli palaw: rice with carrots, raisins and meat'],
      ['Festivals', 'Eid al-Fitr, Eid al-Adha; Nowruz (new year, 21 March), no longer a public holiday']
    ]
  },
  'Punjab region': {
    color: GOLD,
    rows: [
      ['What it is', 'A cultural region whose name means "five waters": land watered by five Indus tributaries'],
      ['Where', 'Split in 1947: Punjab province (Pakistan) and Punjab state (India)'],
      ['People', 'Punjab province alone: about 128 million (2023 census)'],
      ['Language', 'Punjabi, written in Shahmukhi (Perso-Arabic) in Pakistan and Gurmukhi in India'],
      ['Faiths', 'Muslim majority in Pakistani Punjab; Sikh majority in Indian Punjab'],
      ['Shared', 'Language, music, food and family ties that cross the border']
    ]
  },
  'Pashtun belt': {
    color: TEAL,
    rows: [
      ['What it is', 'Homeland of the Pashtun people, between the Hindu Kush and the Indus'],
      ['Where', 'Southern and eastern Afghanistan; Khyber Pakhtunkhwa and northern Balochistan in Pakistan'],
      ['Language', 'Pashto'],
      ['Faith', 'Mostly Sunni Islam'],
      ['Shared code', 'Pashtunwali: hospitality, protection of guests, honor and settling disputes in a jirga (council)'],
      ['Key cities', 'Kandahar, Jalalabad, Peshawar, Quetta']
    ]
  }
};
const viewNames = ['Pakistan', 'Afghanistan', 'Punjab region', 'Pashtun belt'];
let currentView = 'Pakistan';

// layout
let mx, my, mw, mh, px, py, pw, ph, wide;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  viewSelect = createSelect();
  for (let v of viewNames) viewSelect.option(v);
  viewSelect.selected(currentView);
  viewSelect.position(10, drawHeight + 10);
  viewSelect.changed(() => { currentView = viewSelect.value(); });

  startButton = createButton('Start the Khyber road');
  startButton.position(10, drawHeight + 50);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(180, drawHeight + 50);
  resetButton.mousePressed(resetSimulation);

  for (let n of routeNames) route.push(places.findIndex(p => p.name === n));

  describe('Schematic map with labeled dots for cities and sites in Afghanistan and Pakistan, including Kabul, Bamiyan, the Minaret of Jam, the Khyber Pass, Peshawar, Islamabad, Lahore, Quetta, Mohenjo-daro and Karachi, with the Hindu Kush and the Indus and Kabul rivers. Soft shaded areas show the Pashtun belt and the Punjab region crossing the border. A comparison card shows the capital, 2025 population, languages, faiths, a UNESCO site, foods and festivals for each country or region. Pressing Start moves a traveler along the old road from Kabul through the Khyber Pass to Lahore.');
}

function computeLayout() {
  wide = canvasWidth >= 700;
  const top = 64;
  if (wide) {
    mx = margin; my = top;
    mw = Math.floor(canvasWidth * 0.55) - margin;
    mh = drawHeight - top - margin - 86;
    px = mx + mw + margin; py = top;
    pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    mx = margin; my = top;
    mw = canvasWidth - 2 * margin;
    mh = 230;
    px = margin; py = my + mh + 76;
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

  if (isRunning) {
    routeT += 0.006;
    if (routeT >= route.length - 1) {
      routeT = route.length - 1;
      isRunning = false;
      startButton.html('Start the Khyber road');
    }
  }

  drawMap();
  drawPanel();
  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Country Compare: Pakistan and Afghanistan';
  while (textWidth(title) > canvasWidth - 20 && ts > 15) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Pick a country or region in the menu. Tap a dot. Press Start to travel the Khyber road.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Use the menu, tap a dot, or press Start.';
  text(instr, canvasWidth / 2, 38);
}

function drawMap() {
  // background
  stroke('silver');
  strokeWeight(1);
  fill('#F3EBDD');
  rect(mx, my, mw, mh, 6);

  // Arabian Sea (bottom left corner)
  noStroke();
  fill('#CFE6EC');
  rect(mx + 1, Y(0.95), mw * 0.40, mh * 0.05 - 1, 0, 0, 0, 6);

  // stylized country areas (soft, no borders)
  noStroke();
  fill(MARIGOLD + '33');
  ellipse(X(0.40), Y(0.32), mw * 0.70, mh * 0.48);
  fill(LEAF + '30');
  ellipse(X(0.72), Y(0.62), mw * 0.62, mh * 0.66);

  // cultural regions that cross the border
  const hiPash = currentView === 'Pashtun belt';
  const hiPunj = currentView === 'Punjab region';
  push();
  translate(X(0.56), Y(0.37));
  rotate(-0.55);
  fill(hiPash ? color(14, 124, 134, 90) : color(14, 124, 134, 35));
  stroke(hiPash ? TEAL : color(14, 124, 134, 60));
  strokeWeight(hiPash ? 2 : 1);
  drawingContext.setLineDash([6, 5]);
  ellipse(0, 0, mw * 0.56, mh * 0.20);
  pop();
  push();
  fill(hiPunj ? color(244, 180, 41, 110) : color(244, 180, 41, 45));
  stroke(hiPunj ? '#B07F10' : color(176, 127, 16, 70));
  strokeWeight(hiPunj ? 2 : 1);
  drawingContext.setLineDash([6, 5]);
  ellipse(X(0.95), Y(0.45), mw * 0.30, mh * 0.30);
  pop();
  drawingContext.setLineDash([]);

  // Hindu Kush
  drawRange([[0.22, 0.13], [0.40, 0.11], [0.56, 0.12], [0.70, 0.08]]);

  // rivers: Indus and Kabul River
  noFill();
  stroke('#2F6FB0');
  strokeWeight(3);
  beginShape();
  const indus = [[0.97, 0.06], [0.88, 0.18], [0.82, 0.30], [0.74, 0.46], [0.62, 0.62], [0.53, 0.80], [0.47, 0.95]];
  curveVertex(X(indus[0][0]), Y(indus[0][1]));
  for (let p of indus) curveVertex(X(p[0]), Y(p[1]));
  curveVertex(X(0.47), Y(0.95));
  endShape();
  strokeWeight(2);
  beginShape();
  const kabulR = [[0.55, 0.22], [0.58, 0.24], [0.66, 0.255], [0.76, 0.255], [0.825, 0.29]];
  curveVertex(X(kabulR[0][0]), Y(kabulR[0][1]));
  for (let p of kabulR) curveVertex(X(p[0]), Y(p[1]));
  curveVertex(X(0.825), Y(0.29));
  endShape();

  // the old road (dashed path)
  stroke(SAFFRON);
  strokeWeight(3);
  drawingContext.setLineDash([8, 6]);
  noFill();
  beginShape();
  for (let i of route) vertex(X(places[i].u), Y(places[i].v));
  endShape();
  drawingContext.setLineDash([]);

  // area labels
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  labelText('AFGHANISTAN', X(0.30), Y(0.33), '#8A4B05', false);
  labelText('PAKISTAN', X(0.76), Y(0.80), '#2B6A45', false);
  textStyle(ITALIC);
  labelText('Hindu Kush', X(0.38), Y(0.055), '#5A3E1B', false);
  labelText('Indus', X(0.66), Y(0.585), '#1F4F86', false);
  labelText('Arabian Sea', X(0.20), Y(0.975), TEAL, false);
  if (hiPash) labelText('Pashtun belt', X(0.52), Y(0.41), TEAL, true);
  if (hiPunj) labelText('Punjab', X(0.92), Y(0.58), '#8A6208', true);
  if (hiPunj && wide) labelText('continues into India', X(0.84), Y(0.65), '#8A6208', false);
  textStyle(NORMAL);

  // dots
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    const isSel = i === selectedPlace;
    stroke(isSel ? SAFFRON : 'white');
    strokeWeight(isSel ? 3 : 2);
    fill(p.c === 'A' ? '#B8640A' : '#2B6A45');
    circle(X(p.u), Y(p.v), isSel ? 15 : 11);
  }
  // dot labels (skip some on narrow screens to avoid crowding)
  textSize(14);
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    // Jalalabad is labeled only when selected or when the traveler is there
    const atJ = p.name === 'Jalalabad' && Math.round(routeT) === 1 && routeT > 0;
    if (p.name === 'Jalalabad' && i !== selectedPlace && !atJ) continue;
    if (!wide && ['Khyber Pass', 'Jam'].includes(p.name) && i !== selectedPlace) continue;
    labelText(p.name, X(p.u) + p.dx, Y(p.v) + p.dy, NAVY, i === selectedPlace);
  }

  // traveler on the road
  const seg = Math.min(Math.floor(routeT), route.length - 2);
  const t = routeT - seg;
  const a = places[route[seg]], b = places[route[seg + 1]];
  const tx = lerp(X(a.u), X(b.u), t), ty = lerp(Y(a.v), Y(b.v), t);
  stroke(NAVY);
  strokeWeight(2);
  fill(GOLD);
  circle(tx, ty, 16);
  noStroke();
  fill(NAVY);
  circle(tx, ty, 5);

  // caption under the map (still inside drawing area)
  noStroke();
  fill('#333333');
  textSize(14);
  textAlign(CENTER, TOP);
  const cap = 'Schematic map, not to scale. Not an official depiction of borders.';
  if (textWidth(cap) < mw - 10) {
    text(cap, mx + mw / 2, my + mh + 4);
  } else {
    text('Schematic map, not to scale.', mx + mw / 2, my + mh + 3);
    text('Not an official depiction of borders.', mx + mw / 2, my + mh + 20);
  }

  // info line: selected place, or the traveler's stage
  const iy = wide ? my + mh + 26 : my + mh + 40;
  let msg;
  if (selectedPlace >= 0) {
    msg = places[selectedPlace].name + ': ' + places[selectedPlace].info;
  } else {
    msg = roadMessage();
  }
  textAlign(LEFT, TOP);
  fill(NAVY);
  const lines = wrapLines(msg, mw - 8);
  const maxLines = wide ? 3 : 2;
  for (let k = 0; k < Math.min(lines.length, maxLines); k++) {
    text(lines[k], mx + 4, iy + k * 17);
  }
}

function roadMessage() {
  if (routeT <= 0 && !isRunning) return 'The dashed orange line is the old road from Kabul to Lahore. Press Start to travel it.';
  const stop = Math.round(routeT);
  const msgs = [
    'Kabul: the journey starts in a high valley ringed by mountains.',
    'Jalalabad: the road drops east along the Kabul River.',
    'Khyber Pass: about 53 km of mountain pass, from the Torkham border post toward Peshawar.',
    'Peshawar: the first big city on the plains side of the pass.',
    'Islamabad: near ancient Taxila, an old stop on the same routes.',
    'Lahore: the Mughal city of the Punjab plain. Journey complete!'
  ];
  return msgs[stop];
}

function labelText(s, x, y, col, emphasize) {
  const w = textWidth(s) + 6;
  noStroke();
  fill(255, 255, 255, emphasize ? 235 : 185);
  rect(x - w / 2, y - 10, w, 20, 4);
  fill(col);
  textAlign(CENTER, CENTER);
  text(s, x, y);
}

function drawRange(pts) {
  noStroke();
  for (let i = 0; i < pts.length - 1; i++) {
    const x1 = X(pts[i][0]), y1 = Y(pts[i][1]);
    const x2 = X(pts[i + 1][0]), y2 = Y(pts[i + 1][1]);
    const n = Math.max(1, Math.floor(dist(x1, y1, x2, y2) / 13));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const x = lerp(x1, x2, t), y = lerp(y1, y2, t);
      fill('#8B5E3C');
      triangle(x - 6, y + 5, x + 6, y + 5, x, y - 7);
      fill('white');
      triangle(x - 2.5, y - 2, x + 2.5, y - 2, x, y - 7);
    }
  }
}

function drawPanel() {
  const v = views[currentView];
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  noStroke();
  fill(v.color);
  rect(px, py, pw, 8, 6, 6, 0, 0);

  const pad = 10;
  let y = py + 16;
  const tw = pw - 2 * pad;
  textAlign(LEFT, TOP);
  fill(SAFFRON);
  textStyle(BOLD);
  textSize(wide ? 22 : 18);
  text(currentView, px + pad, y);
  y += wide ? 32 : 26;

  const isRegion = currentView === 'Punjab region' || currentView === 'Pashtun belt';
  if (wide) {
    textSize(14);
    textStyle(ITALIC);
    fill('#555555');
    text(isRegion ? 'A cultural region that crosses today\'s border' : 'A country', px + pad, y);
    textStyle(NORMAL);
    y += 22;
  }

  const body = wide ? 15 : 14;
  const lead = wide ? 19 : 17;
  for (let r of v.rows) {
    textSize(body);
    if (y + lead > py + ph - 4) break;
    if (wide) {
      // label on its own line, value below
      textStyle(BOLD);
      fill(NAVY);
      text(r[0], px + pad, y);
      y += lead;
      textStyle(NORMAL);
      fill('#222222');
      const lines = wrapLines(r[1], tw);
      for (let k = 0; k < lines.length; k++) {
        if (y + lead > py + ph - 4) break;
        text(lines[k], px + pad, y);
        y += lead;
      }
      y += 6;
    } else {
      // compact: "Label: value" with the label in bold
      textStyle(BOLD);
      const lab = r[0] + ': ';
      const lw = textWidth(lab);
      textStyle(NORMAL);
      const lines = wrapLines(lab + r[1], tw);
      for (let k = 0; k < lines.length; k++) {
        if (y + lead > py + ph - 4) break;
        if (k === 0) {
          textStyle(BOLD);
          fill(NAVY);
          text(lab, px + pad, y);
          textStyle(NORMAL);
          fill('#222222');
          text(lines[0].substring(lab.length), px + pad + lw, y);
        } else {
          text(lines[k], px + pad, y);
        }
        y += lead;
      }
      y += 3;
    }
  }
}

function drawControlLabels() {
  noStroke();
  fill(NAVY);
  textSize(14);
  textAlign(LEFT, CENTER);
  const sx = viewSelect.elt.offsetWidth + 18;
  if (sx + textWidth('Compare card: country or region') < canvasWidth - 10) {
    text('Compare card: country or region', sx, drawHeight + 21);
  } else {
    text('Card view', sx, drawHeight + 21);
  }
}

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
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;
  let best = -1, bestD = 22;
  for (let i = 0; i < places.length; i++) {
    const d = dist(mouseX, mouseY, X(places[i].u), Y(places[i].v));
    if (d < bestD) { bestD = d; best = i; }
  }
  if (best >= 0) {
    selectedPlace = best;
    const p = places[best];
    if (['Peshawar', 'Islamabad', 'Lahore', 'Quetta', 'Karachi', 'Mohenjo-daro', 'Khyber Pass'].includes(p.name)) {
      currentView = 'Pakistan';
    } else {
      currentView = 'Afghanistan';
    }
    viewSelect.selected(currentView);
  } else if (mouseX >= mx && mouseX <= mx + mw && mouseY >= my && mouseY <= my + mh) {
    selectedPlace = -1;
  }
}

function toggleSimulation() {
  if (!isRunning && routeT >= route.length - 1) routeT = 0;
  selectedPlace = -1;
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start the Khyber road');
}

function resetSimulation() {
  isRunning = false;
  routeT = 0;
  selectedPlace = -1;
  startButton.html('Start the Khyber road');
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
