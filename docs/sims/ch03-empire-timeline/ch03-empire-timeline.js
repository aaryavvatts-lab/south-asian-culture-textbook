// Empire Swim Lanes: South Asia, 600 to 1800 CE (Roots & Rivers, Chapter 3)
// CANVAS_HEIGHT = 800 (drawHeight 720 + controlHeight 80); iframe height 802px
// One lane per major power. Drag the year slider (or press Play) to move the
// orange year line and see which powers existed at the same time. Click or
// tap any bar to read its dates, capital and one key fact.
// Dates are approximate; sources are in the Chapter 3 fact log.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 720;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let yearSlider, playButton;
let isRunning = false; // MicroSims always start paused

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

const YEAR_MIN = 600;
const YEAR_MAX = 1800;

// Lanes. Each segment: name, start, end, row (0..2 within the lane),
// capital and one fact. 'more' = the power continued after 1800.
const lanes = [
  { lane: 'Cholas (south India)', color: '#E8A7A0', segs: [
    { name: 'Chola Empire', start: 848, end: 1279, row: 0,
      capital: 'Thanjavur, later Gangaikonda Cholapuram',
      fact: 'Rajaraja I built the great Brihadisvara temple at Thanjavur (1003 to 1010). His son Rajendra I sent a naval expedition to Southeast Asia.' }
  ]},
  { lane: 'Sri Lankan kingdoms', color: '#B9D88F', segs: [
    { name: 'Anuradhapura', start: 600, end: 1017, row: 0,
      capital: 'Anuradhapura',
      fact: 'A Sinhala capital since the 4th century BCE. It was largely abandoned after Chola invasions around 993 to 1017.' },
    { name: 'Polonnaruwa', start: 1070, end: 1232, row: 0,
      capital: 'Polonnaruwa',
      fact: 'Parakramabahu I (ruled 1153 to 1186) built huge irrigation reservoirs and reunited the island.' },
    { name: 'Jaffna kingdom', short: 'Jaffna', start: 1215, end: 1619, row: 1,
      capital: 'Jaffna area (Nallur)',
      fact: 'A Tamil kingdom in the north of the island. The Portuguese took it over in 1619.' },
    { name: 'Kingdom of Kandy', short: 'Kandy', start: 1469, end: 1815, row: 0, more: true, until: 'lasted until 1815',
      capital: 'Kandy (Senkadagalapura)',
      fact: 'The last independent kingdom on the island. It resisted the Portuguese and Dutch and kept the Temple of the Tooth Relic until the British took Kandy in 1815.' }
  ]},
  { lane: 'Delhi Sultanate', color: '#9ED3DD', segs: [
    { name: 'Delhi Sultanate', start: 1206, end: 1526, row: 0,
      capital: 'Delhi',
      fact: 'Five dynasties in turn, from the Mamluks to the Lodis. Razia Sultan ruled from 1236 to 1240. The Qutb Minar rose in Delhi.' }
  ]},
  { lane: 'Bengal Sultanate', color: '#A8D5BA', segs: [
    { name: 'Bengal Sultanate', start: 1352, end: 1576, row: 0,
      capital: 'Pandua, then Gaur',
      fact: 'Ruled the Bengal delta. Khan Jahan Ali built the Sixty Dome Mosque at Bagerhat, now in Bangladesh, in the 15th century.' }
  ]},
  { lane: 'Vijayanagara Empire', color: '#F6C98B', segs: [
    { name: 'Vijayanagara Empire', start: 1336, end: 1646, row: 0,
      capital: 'Vijayanagara (Hampi)',
      fact: 'Founded by the brothers Harihara and Bukka. Strongest under Krishnadevaraya (1509 to 1529). Defeated at Talikota in 1565.' }
  ]},
  { lane: 'Deccan sultanates', color: '#C9B48A', segs: [
    { name: 'Bahmani Sultanate', short: 'Bahmani', start: 1347, end: 1518, row: 0,
      capital: 'Gulbarga, later Bidar',
      fact: 'The first independent sultanate of the Deccan. It split into five Deccan sultanates by 1518.' },
    { name: 'Golconda (Qutb Shahis)', short: 'Golconda', start: 1518, end: 1687, row: 0,
      capital: 'Golconda, then Hyderabad',
      fact: 'Muhammad Quli Qutb Shah founded Hyderabad and built the Charminar (1591). Telugu came to be used at court alongside Persian. Aurangzeb conquered it in 1687.' }
  ]},
  { lane: 'Mughal Empire', color: GOLD, segs: [
    { name: 'Mughal Empire', start: 1526, end: 1857, row: 0, more: true, until: 'formally ended in 1857',
      capital: 'Agra, Fatehpur Sikri, Lahore and Delhi at different times',
      fact: 'Babur won at Panipat in 1526. Akbar ruled 1556 to 1605. Largest under Aurangzeb (1658 to 1707), then shrank. Ended in 1857.' }
  ]},
  { lane: 'Maratha Empire', color: MARIGOLD, segs: [
    { name: 'Maratha Empire', start: 1674, end: 1818, row: 0, more: true, until: 'lasted until 1818',
      capital: 'Raigad under Shivaji',
      fact: 'Shivaji was crowned in 1674. The Marathas spread across much of India, lost to the Durranis at Panipat in 1761, and were defeated by the British by 1818.' }
  ]},
  { lane: 'Durrani Empire', color: '#C7A3D9', segs: [
    { name: 'Durrani Empire', start: 1747, end: 1823, row: 0, more: true, until: 'lasted into the early 1800s',
      capital: 'Kandahar, later Kabul',
      fact: 'Founded in 1747 by Ahmad Shah Durrani, often called the father of modern Afghanistan. It ruled Afghanistan and much of Pakistan.' }
  ]},
  { lane: 'European companies', color: '#B8C4D6', segs: [
    { name: 'Portuguese', start: 1498, end: 1961, row: 0, more: true, until: 'held Goa until 1961',
      capital: 'Goa (from 1510)',
      fact: 'Vasco da Gama reached Kozhikode (Calicut) in 1498. The Portuguese took Goa in 1510 and set up trading posts from Gujarat to Chittagong.' },
    { name: 'English East India Co.', short: 'English EIC', start: 1600, end: 1874, row: 1, more: true, until: 'dissolved in 1874',
      capital: 'Madras (1639), Bombay, Calcutta (1690)',
      fact: 'A private company with a royal charter (31 December 1600) and its own army. It lost a war against the Mughals in 1686 to 1690.' },
    { name: 'Dutch East India Co.', short: 'Dutch VOC', start: 1602, end: 1796, row: 2,
      capital: 'Colombo and Galle in Sri Lanka',
      fact: 'Founded in 1602. It took Sri Lanka\'s coasts from the Portuguese between 1640 and 1658 and held them until 1796.' }
  ]}
];

let year = 1600;
let selLane = -1, selSeg = -1;

// layout values, recalculated each frame
let gx, gw, laneTop, cardY, cardH, wide;
let laneY = [], laneHt = [];
const ROW_H = 17;
function rowsOf(L) { return Math.max(...L.segs.map(s => s.row)) + 1; }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  playButton = createButton('Play');
  playButton.position(10, drawHeight + 8);
  playButton.mousePressed(toggleSimulation);

  yearSlider = createSlider(YEAR_MIN, YEAR_MAX, year, 1);
  yearSlider.position(10, drawHeight + 46);
  yearSlider.size(canvasWidth - 20);
  yearSlider.input(() => { year = yearSlider.value(); });

  describe('Swim-lane timeline of South Asia from 600 to 1800 CE with ten lanes: the Cholas, Sri Lankan kingdoms, the Delhi Sultanate, the Bengal Sultanate, the Vijayanagara Empire, the Deccan sultanates, the Mughal Empire, the Maratha Empire, the Durrani Empire, and European trading companies. A vertical year line moves with a slider and the panel lists which powers existed in that year. Clicking a bar shows its dates, capital and a key fact.');
}

function computeLayout() {
  wide = canvasWidth >= 700;
  gx = margin + 4;
  gw = canvasWidth - 2 * margin - 8;
  laneTop = 100;
  let y = laneTop;
  for (let i = 0; i < lanes.length; i++) {
    laneY[i] = y;
    laneHt[i] = 21 + rowsOf(lanes[i]) * ROW_H;
    y += laneHt[i];
  }
  cardY = y + 8;
  cardH = drawHeight - cardY - margin;
}

function XY(y) { return gx + (y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN) * gw; }

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
    year += 2;
    if (year >= YEAR_MAX) {
      year = YEAR_MAX;
      isRunning = false;
      playButton.html('Play');
    }
    yearSlider.value(year);
  }

  drawTitle();
  drawAxis();
  drawLanes();
  drawCursor();
  drawCard();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Empire Swim Lanes: South Asia, 600 to 1800';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Drag the year slider or press Play. Click a bar to read about it.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Drag the slider or press Play. Tap a bar.';
  text(instr, canvasWidth / 2, 38);
}

function drawAxis() {
  const ticks = wide ? [600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800]
                     : [600, 800, 1000, 1200, 1400, 1600, 1800];
  textSize(14);
  for (let t of ticks) {
    const x = XY(t);
    stroke('#E3D6BD');
    strokeWeight(1);
    line(x, laneTop - 4, x, laneBottom());
    noStroke();
    fill('#555555');
    textAlign(t === 600 ? LEFT : (t === 1800 ? RIGHT : CENTER), BOTTOM);
    text(t, x, laneTop - 4);
  }
}

function drawLanes() {
  for (let i = 0; i < lanes.length; i++) {
    const L = lanes[i];
    const y0 = laneY[i];
    // zebra background
    noStroke();
    fill(i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 244, i % 2 === 0 ? 255 : 230, 150);
    rect(gx - 4, y0, gw + 8, laneHt[i]);

    const anyActive = L.segs.some(s => year >= s.start && year < s.end);
    // lane label
    textAlign(LEFT, TOP);
    textSize(14);
    textStyle(BOLD);
    fill(anyActive ? NAVY : '#8A8A8A');
    text(L.lane, gx, y0 + 2);
    textStyle(NORMAL);

    // bars
    const barTop = y0 + 19;
    const barH = ROW_H;
    for (let j = 0; j < L.segs.length; j++) {
      const s = L.segs[j];
      const x1 = XY(Math.max(s.start, YEAR_MIN));
      const x2 = XY(Math.min(s.end, YEAR_MAX));
      const by = barTop + s.row * barH;
      const active = year >= s.start && year < s.end;
      noStroke();
      fill(L.color + (active ? 'FF' : '77'));
      rect(x1, by, Math.max(3, x2 - x1), barH - 1, 3);
      if (s.more && s.end > YEAR_MAX) {
        // arrow: continues after 1800
        fill(L.color);
        triangle(x2 - 1, by, x2 - 1, by + barH - 1, x2 + 6, by + (barH - 1) / 2);
      }
      if (i === selLane && j === selSeg) {
        noFill();
        stroke(NAVY);
        strokeWeight(2.5);
        rect(x1, by, Math.max(3, x2 - x1), barH - 1, 3);
        noStroke();
      }
      // segment name inside the bar when it fits (only for multi-segment lanes)
      if (L.segs.length > 1) {
        textSize(14);
        let nm = s.name;
        if (textWidth(nm) >= x2 - x1 - 6 && s.short) nm = s.short;
        if (textWidth(nm) < x2 - x1 - 6) {
          fill(NAVY);
          textAlign(LEFT, CENTER);
          text(nm, x1 + 3, by + barH / 2);
        }
      }
    }
  }
}

function drawCursor() {
  const x = XY(year);
  stroke(SAFFRON);
  strokeWeight(3);
  line(x, laneTop - 2, x, laneBottom() + 2);
  // year badge
  noStroke();
  textSize(16);
  textStyle(BOLD);
  const lbl = String(year);
  const w = textWidth(lbl) + 14;
  let bx = constrain(x - w / 2, 4, canvasWidth - w - 4);
  fill(SAFFRON);
  rect(bx, 56, w, 22, 5);
  fill('white');
  textAlign(CENTER, CENTER);
  text(lbl, bx + w / 2, 67);
  textStyle(NORMAL);
}

function activeNames() {
  const out = [];
  for (let L of lanes) {
    for (let s of L.segs) {
      if (year >= s.start && year < s.end) out.push(s.name);
    }
  }
  return out;
}

function drawCard() {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(margin, cardY, canvasWidth - 2 * margin, cardH, 6);
  noStroke();
  const pad = 10;
  const tw = canvasWidth - 2 * margin - 2 * pad;
  let y = cardY + pad;
  const lead = 18;
  textAlign(LEFT, TOP);
  textSize(14);

  if (selLane >= 0) {
    const s = lanes[selLane].segs[selSeg];
    textStyle(BOLD);
    fill(SAFFRON);
    textSize(16);
    const head = s.name + ': about ' + s.start + ' to ' + (s.end > YEAR_MAX ? 'after 1800' : s.end);
    for (let ln of wrapLines(head, tw)) { text(ln, cardX(), y); y += 20; }
    y += 2;
    if (s.until) {
      textSize(14);
      textStyle(ITALIC);
      fill('#555555');
      text('(' + s.until + ')', cardX(), y);
      y += lead;
    }
    textSize(14);
    textStyle(BOLD);
    fill(TEAL);
    const capLines = wrapLines('Capital: ' + s.capital, tw);
    for (let ln of capLines) { text(ln, cardX(), y); y += lead; }
    textStyle(NORMAL);
    fill('#222222');
    for (let ln of wrapLines(s.fact, tw)) {
      if (y > cardY + cardH - lead) break;
      text(ln, cardX(), y);
      y += lead;
    }
  } else {
    const names = activeNames();
    textStyle(BOLD);
    fill(SAFFRON);
    textSize(16);
    text('In ' + year + ', ' + names.length + (names.length === 1 ? ' power was' : ' powers were') + ' active:', cardX(), y);
    y += 22;
    textSize(14);
    textStyle(NORMAL);
    fill('#222222');
    for (let ln of wrapLines(names.length ? names.join(', ') : 'none of the powers shown here', tw)) {
      if (y > cardY + cardH - 2 * lead) break;
      text(ln, cardX(), y);
      y += lead;
    }
    fill('#666666');
    textStyle(ITALIC);
    const note = 'Many other kingdoms existed too; these lanes are a selection. Click a bar for details.';
    for (let ln of wrapLines(note, tw)) {
      if (y > cardY + cardH - lead) break;
      text(ln, cardX(), y);
      y += lead;
    }
    textStyle(NORMAL);
  }
}

function cardX() { return margin + 10; }

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

function laneBottom() { return laneY[lanes.length - 1] + laneHt[lanes.length - 1]; }

function pickBar(px, py) {
  if (py < laneTop || py > laneBottom()) return;
  let i = 0;
  while (i < lanes.length - 1 && py >= laneY[i] + laneHt[i]) i++;
  const L = lanes[i];
  const barTop = laneY[i] + 19;
  const barH = ROW_H;
  let best = -1;
  for (let j = 0; j < L.segs.length; j++) {
    const s = L.segs[j];
    const x1 = XY(Math.max(s.start, YEAR_MIN)) - 4;
    const x2 = XY(Math.min(s.end, YEAR_MAX)) + 6;
    const by = barTop + s.row * barH;
    if (px >= x1 && px <= x2) {
      // prefer the row under the pointer; otherwise any bar in this lane at that x
      if (py >= by - 3 && py <= by + barH + 3) { best = j; break; }
      if (best < 0) best = j;
    }
  }
  if (best >= 0) { selLane = i; selSeg = best; }
  else { selLane = -1; selSeg = -1; }
}

function mousePressed() {
  if (mouseY >= 0 && mouseY <= drawHeight) pickBar(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0 && touches[0].y <= drawHeight) pickBar(touches[0].x, touches[0].y);
}

function toggleSimulation() {
  if (!isRunning && year >= YEAR_MAX) {
    year = YEAR_MIN;
    yearSlider.value(year);
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
