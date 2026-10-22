// Borders Then and Now (Roots & Rivers, Chapter 4)
// CANVAS_HEIGHT = 720 (drawHeight 630 + controlHeight 90); iframe height 722px
// A schematic block diagram (NOT a map) showing how one colonial territory
// became several countries in separate steps: 1857, 1858, 1947, 1948, 1971, 1972.
// Blocks split, merge and change name; an event panel explains each step.
// Princely states are shown as small tiles that join India or Pakistan in 1947-48.
// No borders or real shapes are drawn. MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 630;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

let backButton, nextButton, playButton, stageSlider, arrowCheckbox;
let isRunning = false;   // starts paused
let stage = 0;           // current stage index
let shown = 0;           // animated value that moves toward stage
let playTimer = 0;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

const stages = [
  { year: '1857', title: 'Company rule and the Revolt',
    text: 'The East India Company rules large areas directly. Hundreds of princely states keep their own rulers but answer to the British. Ceylon is a separate British colony. In May 1857 Indian soldiers at Meerut revolt, and the uprising spreads across the north.' },
  { year: '1858', title: 'The British Raj begins',
    text: 'After the revolt is crushed, the Government of India Act (2 August 1858) ends Company rule. The British Crown now rules British India directly. About 565 princely states stay under their own rulers, tied to Britain by treaties.' },
  { year: '1947', title: 'Independence and Partition',
    text: 'British India is split. Pakistan (14 August) and India (15 August) become independent. Pakistan has two wings, West and East, with India in between. The Radcliffe Line is announced on 17 August. Roughly 14 to 18 million people are displaced, and estimates of deaths range from about 200,000 to 2 million. Princely states join one side; Jammu and Kashmir becomes disputed.' },
  { year: '1948', title: 'Ceylon independent; last states join',
    text: 'Ceylon becomes independent on 4 February 1948, peacefully and without partition. In September 1948 India takes over Hyderabad, the largest princely state still outside. Fighting over Kashmir ends in a UN-arranged ceasefire on 1 January 1949, but the dispute remains.' },
  { year: '1971', title: 'East Pakistan becomes Bangladesh',
    text: 'After years of conflict over language, power and the 1970 election, war breaks out in March 1971. Bangladesh declares independence on 26 March; the war ends on 16 December. About 10 million refugees flee to India. Most death toll estimates range from about 300,000 to 3 million, and they are disputed.' },
  { year: '1972', title: 'Ceylon becomes Sri Lanka',
    text: 'In 1972 Ceylon becomes a republic and takes the name Sri Lanka. One colonial territory, British India, has become three countries (India, Pakistan, Bangladesh) in two separate events: 1947 and 1971.' }
];

// Main blocks. For each stage: [x, y, w, h] in diagram units (0..1), or null if hidden.
// Positions are schematic only.
const blocks = [
  { id: 'company', color: '#F6C98B', labels: ['East India Company territory', 'British India (Crown rule)', null, null, null, null],
    pos: [[0.08, 0.16, 0.84, 0.50], [0.08, 0.16, 0.84, 0.50], null, null, null, null] },
  { id: 'westpak', color: '#9CC5A1', labels: [null, null, 'West Pakistan', 'West Pakistan', 'Pakistan', 'Pakistan'],
    pos: [null, null, [0.02, 0.16, 0.24, 0.40], [0.02, 0.16, 0.24, 0.40], [0.02, 0.16, 0.24, 0.40], [0.02, 0.16, 0.24, 0.40]] },
  { id: 'india', color: '#F2B880', labels: [null, null, 'India', 'India', 'India', 'India'],
    pos: [null, null, [0.30, 0.16, 0.41, 0.58], [0.30, 0.16, 0.41, 0.58], [0.30, 0.16, 0.41, 0.58], [0.30, 0.16, 0.41, 0.58]] },
  { id: 'eastpak', color: '#A8D5BA', labels: [null, null, 'East Pakistan', 'East Pakistan', 'Bangladesh', 'Bangladesh'],
    pos: [null, null, [0.74, 0.24, 0.25, 0.26], [0.74, 0.24, 0.25, 0.26], [0.74, 0.24, 0.25, 0.26], [0.74, 0.24, 0.25, 0.26]] },
  { id: 'ceylon', color: '#B9D88F', labels: ['Ceylon (British colony)', 'Ceylon (British colony)', 'Ceylon (British colony)', 'Ceylon (independent)', 'Ceylon (independent)', 'Sri Lanka'],
    pos: [[0.38, 0.82, 0.36, 0.12], [0.38, 0.82, 0.36, 0.12], [0.38, 0.82, 0.36, 0.12], [0.38, 0.82, 0.36, 0.12], [0.38, 0.82, 0.36, 0.12], [0.38, 0.82, 0.36, 0.12]] }
];

// Princely state tiles. home = position before 1947; after = where it goes.
// 'kashmir' and 'hyderabad' are special cases.
const princely = [];
function buildPrincely() {
  // a patchwork of small tiles scattered inside British India (before 1947)
  const spots = [
    [0.14, 0.30], [0.22, 0.44], [0.36, 0.32], [0.40, 0.50], [0.50, 0.34],
    [0.56, 0.54], [0.64, 0.30], [0.72, 0.46], [0.30, 0.56], [0.82, 0.34],
    [0.50, 0.60], [0.16, 0.56]
  ];
  // destinations after 1947 (inside India unless noted)
  const dests = [
    [0.08, 0.44, 'pak'], [0.34, 0.40, 'ind'], [0.40, 0.28, 'ind'], [0.48, 0.46, 'ind'],
    [0.56, 0.30, 'ind'], [0.64, 0.50, 'ind'], [0.62, 0.38, 'ind'], [0.36, 0.60, 'ind'],
    [0.46, 0.64, 'ind'], [0.66, 0.62, 'ind'], [0.16, 0.44, 'pak'], [0.56, 0.64, 'ind']
  ];
  for (let i = 0; i < spots.length; i++) {
    princely.push({ hx: spots[i][0], hy: spots[i][1], dx: dests[i][0], dy: dests[i][1], side: dests[i][2], kind: 'normal' });
  }
  // Jammu and Kashmir: between West Pakistan and India, disputed from 1947
  princely.push({ hx: 0.27, hy: 0.38, dx: 0.29, dy: 0.04, side: 'disputed', kind: 'kashmir' });
  // Hyderabad: stays outside in 1947, joins India in 1948
  princely.push({ hx: 0.46, hy: 0.44, dx: 0.52, dy: 0.56, side: 'ind', kind: 'hyderabad' });
}

// Neighbours that were never formally colonized or were protectorates (static)
const neighbours = [
  { name: 'Afghanistan', note: 'not colonized', x: 0.02, y: 0.02, w: 0.25 },
  { name: 'Nepal', note: 'kingdom', x: 0.42, y: 0.02, w: 0.16 },
  { name: 'Bhutan', note: 'kingdom', x: 0.62, y: 0.02, w: 0.16 },
  { name: 'Maldives', note: 'protectorate to 1965', x: 0.04, y: 0.82, w: 0.30 }
];

let dx, dy, dw, dh, px, py, pw, ph, wide;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  buildPrincely();

  backButton = createButton('Back');
  backButton.position(10, drawHeight + 8);
  backButton.mousePressed(() => { isRunning = false; playButton.html('Play'); setStage(stage - 1); });

  nextButton = createButton('Next');
  nextButton.position(66, drawHeight + 8);
  nextButton.mousePressed(() => { isRunning = false; playButton.html('Play'); setStage(stage + 1); });

  playButton = createButton('Play');
  playButton.position(122, drawHeight + 8);
  playButton.mousePressed(togglePlay);

  stageSlider = createSlider(0, stages.length - 1, 0, 1);
  stageSlider.position(186, drawHeight + 10);
  stageSlider.value(stage);
  stageSlider.input(() => { setStage(stageSlider.value()); });

  arrowCheckbox = createCheckbox(' Show 1947 migration arrows', true);
  arrowCheckbox.position(10, drawHeight + 50);

  describe('A schematic block diagram, not a map. A slider steps through 1857, 1858, 1947, 1948, 1971 and 1972. In 1857 and 1858 one large block labeled East India Company territory, then British India, contains many small princely state tiles, with Ceylon as a separate British colony below. In 1947 the large block splits into Pakistan West, India and Pakistan East; princely tiles move into India or Pakistan, and Jammu and Kashmir becomes a striped disputed tile. In 1948 Ceylon becomes independent and Hyderabad joins India. In 1971 Pakistan East becomes Bangladesh. In 1972 Ceylon is renamed Sri Lanka. A panel explains each event.');
}

function setStage(s) {
  stage = constrain(s, 0, stages.length - 1);
  stageSlider.value(stage);
}

function togglePlay() {
  if (!isRunning && stage >= stages.length - 1) setStage(0);
  isRunning = !isRunning;
  playTimer = 0;
  playButton.html(isRunning ? 'Pause' : 'Play');
}

function computeLayout() {
  wide = canvasWidth >= 700;
  const top = 78;
  if (wide) {
    dx = margin; dy = top;
    dw = Math.floor(canvasWidth * 0.58) - margin;
    dh = drawHeight - top - 52;
    px = dx + dw + margin; py = top;
    pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    dx = margin; dy = top;
    dw = canvasWidth - 2 * margin;
    dh = 300;
    px = margin; py = dy + dh + 46;
    pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin;
  }
  const sw = Math.max(120, canvasWidth - 206);
  stageSlider.size(sw);
}

function X(u) { return dx + u * dw; }
function Y(v) { return dy + v * dh; }

function draw() {
  updateCanvasSize();
  computeLayout();

  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) {
    playTimer++;
    if (playTimer > 200) {
      playTimer = 0;
      if (stage < stages.length - 1) setStage(stage + 1);
      else { isRunning = false; playButton.html('Play'); }
    }
  }
  // ease the animated value toward the chosen stage
  shown = lerp(shown, stage, 0.08);
  if (abs(shown - stage) < 0.002) shown = stage;

  drawTitle();
  drawDiagram();
  drawPanel();
  drawTimelineLabels();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Borders Then and Now';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Press Next or drag the slider to step through the years. Watch blocks split and rename.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Press Next or drag the slider to step through time.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Press Next to step through time.';
  text(instr, canvasWidth / 2, 40);
  // year badge
  textStyle(BOLD);
  textSize(16);
  fill(SAFFRON);
  text('Year: ' + stages[stage].year, canvasWidth / 2, 58);
  textStyle(NORMAL);
}

// interpolate a block's rectangle between two stages
function blockRect(b, t) {
  const a = Math.floor(t), c = Math.min(a + 1, stages.length - 1);
  const f = t - a;
  const pa = b.pos[a], pc = b.pos[c];
  if (pa && pc) return { r: [lerp(pa[0], pc[0], f), lerp(pa[1], pc[1], f), lerp(pa[2], pc[2], f), lerp(pa[3], pc[3], f)], alpha: 255 };
  if (pa && !pc) return { r: pa, alpha: 255 * (1 - f) };
  if (!pa && pc) return { r: pc, alpha: 255 * f };
  return null;
}

function drawDiagram() {
  // background box
  stroke('silver');
  strokeWeight(1);
  fill('#F3F7FA');
  rect(dx, dy, dw, dh, 6);

  // neighbours (grey, dashed outline)
  for (const n of neighbours) {
    drawingContext.setLineDash([5, 4]);
    stroke('#9A9A9A');
    fill('#ECECEC');
    rect(X(n.x), Y(n.y), n.w * dw, 0.10 * dh, 6);
    drawingContext.setLineDash([]);
    noStroke();
    fill('#555555');
    textAlign(CENTER, CENTER);
    textSize(14);
    const label = fitLabel(n.name, n.w * dw - 6);
    text(label, X(n.x + n.w / 2), Y(n.y + 0.05));
  }

  // main blocks
  for (const b of blocks) {
    const br = blockRect(b, shown);
    if (!br) continue;
    const [bx, by, bw, bh] = br.r;
    const c = color(b.color);
    c.setAlpha(br.alpha);
    stroke(255, 255, 255, br.alpha);
    strokeWeight(3);
    fill(c);
    rect(X(bx), Y(by), bw * dw, bh * dh, 10);
  }

  // migration arrows in 1947 and 1948
  if (arrowCheckbox.checked() && stage >= 2 && stage <= 3 && abs(shown - stage) < 0.3) drawArrows();

  // princely state tiles
  const s = shown;
  const f = constrain(s - 1, 0, 1);  // moves between 1858 and 1947
  for (const p of princely) {
    let x = lerp(p.hx, p.dx, f), y = lerp(p.hy, p.dy, f);
    let tileFill = '#7E57C2';
    if (p.kind === 'hyderabad' && s >= 2 && s < 3) {
      // in 1947 Hyderabad has not yet joined
      x = lerp(p.hx, 0.50, f); y = lerp(p.hy, 0.50, f);
    }
    const tw = 0.05 * dw, th = 0.05 * dh;
    if (p.kind === 'kashmir' && s >= 1.5) {
      drawStripedTile(X(x), Y(y), 0.10 * dw, 0.07 * dh);
      continue;
    }
    noStroke();
    if (s >= 1.95) {
      if (p.side === 'ind') tileFill = '#C98A4B';
      if (p.side === 'pak') tileFill = '#5E9E6E';
      if (p.kind === 'hyderabad' && s < 2.95) tileFill = '#7E57C2';
    }
    fill(tileFill);
    rect(X(x) - tw / 2, Y(y) - th / 2, tw, th, 3);
  }

  // block labels on top
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  for (const b of blocks) {
    const br = blockRect(b, shown);
    if (!br) continue;
    const idx = br.alpha > 127 ? Math.round(shown) : Math.round(shown);
    let label = b.labels[Math.min(stage, b.labels.length - 1)];
    if (!label) label = b.labels[idx] || '';
    if (!label || br.alpha < 60) continue;
    const [bx, by, bw, bh] = br.r;
    textSize(15);
    const lx = X(bx + bw / 2);
    let ly = Y(by) + 14;
    if (b.id === 'ceylon') ly = Y(by + bh / 2);
    if (b.id === 'india') ly = Y(by + bh) - 14;
    textSize(wide ? 15 : 14);
    const lines = splitLabel(label, bw * dw - 4);
    if (lines.length === 1) labelText(lines[0], lx, ly, NAVY);
    else {
      const off = b.id === 'india' ? -20 : (b.id === 'ceylon' ? -10 : 0);
      labelText(lines[0], lx, ly + off, NAVY);
      labelText(lines[1], lx, ly + off + 20, NAVY);
    }
  }
  textStyle(NORMAL);

  // princely state legend and special tile labels
  textSize(14);
  if (stage <= 1) {
    labelText('Small tiles = princely states', X(0.50), Y(0.72), '#4A2C8A');
  } else {
    if (shown > 1.9) {
      labelText('J&K: disputed', X(0.29) + 0.05 * dw, Y(0.06) + 0.035 * dh + 14, '#7A1F1F');
    }
    if (stage === 2 && abs(shown - 2) < 0.2) labelText('Hyderabad: not yet joined', X(0.50), Y(0.50) + 0.025 * dh + 14, '#4A2C8A');
  }

  // caption inside the drawing area, under the diagram
  noStroke();
  fill('#333333');
  textAlign(CENTER, TOP);
  textSize(14);
  const cap1 = 'Schematic diagram, not a map. Not to scale.';
  const cap2 = 'Not an official depiction of borders.';
  if (textWidth(cap1 + ' ' + cap2) < dw - 10) {
    text(cap1 + ' ' + cap2, dx + dw / 2, dy + dh + 6);
  } else {
    text(cap1, dx + dw / 2, dy + dh + 4);
    text(cap2, dx + dw / 2, dy + dh + 21);
  }
}

function drawStripedTile(cx, cy, w, h) {
  // half green, half orange stripes: claimed by both sides
  push();
  translate(cx, cy);
  noStroke();
  const n = 6;
  for (let i = 0; i < n; i++) {
    fill(i % 2 === 0 ? '#5E9E6E' : '#C98A4B');
    rect(i * w / n, 0, w / n + 0.5, h);
  }
  noFill();
  stroke('#7A1F1F');
  strokeWeight(2);
  rect(0, 0, w, h, 3);
  pop();
}

function drawArrows() {
  // schematic two-way arrows: people crossed in both directions
  stroke(SAFFRON);
  strokeWeight(3);
  const pairs = [
    // west: between Pakistan (West) and India
    [0.22, 0.30, 0.34, 0.30], [0.34, 0.40, 0.22, 0.40],
    // east: between India and Pakistan (East)
    [0.68, 0.32, 0.80, 0.32], [0.80, 0.42, 0.68, 0.42]
  ];
  for (const p of pairs) arrow(X(p[0]), Y(p[1]), X(p[2]), Y(p[3]));
  noStroke();
  textSize(14);
  labelText('People moving both ways', X(0.50), Y(0.08) + 0.10 * dh + 12, SAFFRON);
}

function arrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  line(x2, y2, x2 - 9 * cos(a - 0.5), y2 - 9 * sin(a - 0.5));
  line(x2, y2, x2 - 9 * cos(a + 0.5), y2 - 9 * sin(a + 0.5));
}

function fitLabel(s, maxW) {
  if (textWidth(s) <= maxW) return s;
  let t = s;
  // try a shorter form inside parentheses first
  const short = s.replace(/ \(.*\)/, '');
  if (textWidth(short) <= maxW) return short;
  t = short;
  while (t.length > 3 && textWidth(t + '.') > maxW) t = t.slice(0, -1);
  return t + '.';
}

// split a label onto two lines if it is too wide
function splitLabel(s, maxW) {
  if (textWidth(s) <= maxW) return [s];
  let i = s.indexOf(' (');
  if (i < 0) {
    const mid = Math.floor(s.length / 2);
    const a = s.lastIndexOf(' ', mid), b = s.indexOf(' ', mid);
    i = (a < 0) ? b : ((b < 0 || mid - a < b - mid) ? a : b);
  }
  if (i < 0) return [fitLabel(s, maxW)];
  return [fitLabel(s.slice(0, i), maxW), fitLabel(s.slice(i + 1), maxW)];
}

function labelText(s, x, y, col) {
  const w = textWidth(s) + 8;
  noStroke();
  fill(255, 255, 255, 215);
  rect(x - w / 2, y - 11, w, 22, 4);
  fill(col);
  textAlign(CENTER, CENTER);
  text(s, x, y);
}

function drawTimelineLabels() {
  // year ticks under the slider row, in the control area
  noStroke();
  fill('#444444');
  textSize(14);
  textAlign(LEFT, CENTER);
  const sx = 186, sw = stageSlider.width;
  // only draw the ticks if there is room
  if (sw >= 240) {
    for (let i = 0; i < stages.length; i++) {
      const tx = sx + 14 + i * (sw - 28) / (stages.length - 1);
      textAlign(CENTER, CENTER);
      fill(i === stage ? SAFFRON : '#444444');
      textStyle(i === stage ? BOLD : NORMAL);
      text(stages[i].year, tx, drawHeight + 40);
    }
    textStyle(NORMAL);
  }
}

function drawPanel() {
  const st = stages[stage];
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  noStroke();
  const pad = 10;
  const tw = pw - 2 * pad;
  let y = py + pad;
  textAlign(LEFT, TOP);
  fill(SAFFRON);
  textStyle(BOLD);
  textSize(wide ? 22 : 18);
  text(st.year, px + pad, y);
  y += wide ? 30 : 24;
  fill(NAVY);
  textSize(wide ? 18 : 16);
  for (const ln of wrapLines(st.title, tw)) { text(ln, px + pad, y); y += wide ? 24 : 20; }
  y += 4;
  textStyle(NORMAL);
  fill('#222222');
  const bs = wide ? 16 : 14;
  textSize(bs);
  const lead = wide ? 22 : 18;
  for (const ln of wrapLines(st.text, tw)) {
    if (y + lead > py + ph - 4) break;
    text(ln, px + pad, y);
    y += lead;
  }
  // colour key at the bottom of the panel, if there is room
  const keys = [
    ['#7E57C2', 'Princely state (own ruler)'],
    ['#C98A4B', 'State that joined India'],
    ['#5E9E6E', 'State that joined Pakistan'],
    ['striped', 'Jammu and Kashmir: disputed']
  ];
  textSize(14);
  const kh = 22;
  let ky = py + ph - pad - keys.length * kh;
  if (ky > y + 8) {
    for (const k of keys) {
      if (k[0] === 'striped') drawStripedTile(px + pad, ky + 2, 18, 14);
      else { noStroke(); fill(k[0]); rect(px + pad, ky + 2, 18, 14, 3); }
      noStroke();
      fill('#333333');
      textAlign(LEFT, TOP);
      text(k[1], px + pad + 26, ky + 1);
      ky += kh;
    }
  }
}

function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur === '' ? w : cur + ' ' + w;
    if (textWidth(test) > maxW && cur !== '') { lines.push(cur); cur = w; } else cur = test;
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function mousePressed() {
  // tap the diagram to advance one step
  if (mouseY > dy && mouseY < dy + dh && mouseX > dx && mouseX < dx + dw) {
    isRunning = false;
    playButton.html('Play');
    setStage(stage < stages.length - 1 ? stage + 1 : 0);
  }
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
