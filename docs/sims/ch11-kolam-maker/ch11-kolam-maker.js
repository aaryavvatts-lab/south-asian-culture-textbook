// Kolam Maker (Roots & Rivers, Chapter 11: Art, Architecture, and Craft)
// CANVAS_HEIGHT = 680 (drawHeight 565 + controlHeight 115); iframe height 682px
// Draw on a grid of dots (pulli). With 4-fold symmetry on, every stroke is
// copied three more times, turned 90, 180 and 270 degrees around the centre,
// the way many kolam designs repeat. "Trace demo" draws a pulli kolam made of
// lines that loop around every dot and never touch one. The demo pattern is
// computed as a "mirror curve": diagonal lines through the gaps between dots
// that bounce off the edge (and off a few symmetric inner "walls" on odd grids,
// which join the loops into a single line).
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 565;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

let gridSelect, colorSelect, symCheckbox, demoButton, clearButton, saveButton;
let isRunning = false;            // the demo animation starts paused
let N = 5;                        // dots per side
let strokes = [];                 // user strokes, points in grid units (0..N)
let current = null;               // stroke being drawn
let demo = null;                  // {loops: [[{x,y}...]], dense: [[{x,y}...]], total}
let demoProgress = 1;             // 0..1 share of the demo drawn
let showDemo = true;

const NAVY = '#1B2356', MARIGOLD = '#F28C12', SAFFRON = '#E2601C';
const TEAL = '#0E7C86', LEAF = '#3E8E5E', GOLD = '#F4B429', PAPER = '#FFF8EC';
const GROUND = '#5B4636';         // swept, dampened earth at a doorstep
const INKS = { 'Rice flour white': '#FFFDF5', 'Marigold': MARIGOLD, 'Turmeric gold': GOLD, 'Leaf green': '#7FD39B' };

// ---- kolam mirror-curve geometry ----
function kolamLoops(N, mirrors) {     // mirrors: Set of "x,y" interior midpoints that act as walls
  const key = (x, y) => x + ',' + y;
  const segKey = (a, b) => { const s = [key(a.x, a.y), key(b.x, b.y)].sort(); return s[0] + '|' + s[1]; };
  const wallH = p => p.y === 0 || p.y === N || (Number.isInteger(p.y) && mirrors.has(key(p.x, p.y)));
  const wallV = p => p.x === 0 || p.x === N || (Number.isInteger(p.x) && mirrors.has(key(p.x, p.y)));
  const fix = (p, d) => {
    // at a horizontal-edge midpoint (y integer) a wall flips dy; at a vertical-edge midpoint (x integer) flips dx
    if (Number.isInteger(p.y) && wallH(p)) { if ((p.y === 0 && d.y < 0) || (p.y === N && d.y > 0) || (p.y !== 0 && p.y !== N)) d.y = -d.y; }
    if (Number.isInteger(p.x) && wallV(p)) { if ((p.x === 0 && d.x < 0) || (p.x === N && d.x > 0) || (p.x !== 0 && p.x !== N)) d.x = -d.x; }
  };
  const seen = new Set(), loops = [];
  const pts = [];
  for (let i = 0; i < N; i++) for (let j = 0; j <= N; j++) { pts.push({ x: i + 0.5, y: j }); pts.push({ x: j, y: i + 0.5 }); }
  for (const s of pts) for (const d0 of [[0.5, 0.5], [0.5, -0.5], [-0.5, 0.5], [-0.5, -0.5]]) {
    // incoming direction d0 arriving at s; compute outgoing
    let p = { ...s }, d = { x: d0[0], y: d0[1] };
    const prev = { x: p.x - d.x, y: p.y - d.y };
    if (prev.x < 0 || prev.x > N || prev.y < 0 || prev.y > N) continue;
    if (seen.has(segKey(prev, p))) continue;
    const loop = [];
    const P0 = { ...p }, D0 = { ...d };
    let guard = 0;
    while (guard++ < 20000) {
      loop.push({ x: p.x, y: p.y });
      fix(p, d);
      const n = { x: p.x + d.x, y: p.y + d.y };
      seen.add(segKey(p, n));
      p = n;
      if (p.x === P0.x && p.y === P0.y && d.x === D0.x && d.y === D0.y) break;
    }
    loops.push(loop);
  }
  return loops;
}
function rot(p, N) { return { x: N - p.y, y: p.x }; }
function singleLoopMirrors(N, steps) {
  const mirrors = new Set();
  const cands = [];
  for (let i = 0; i < N; i++) for (let j = 1; j < N; j++) { cands.push({ x: i + 0.5, y: j }); }
  let count = kolamLoops(N, mirrors).length;
  const done = new Set();
  // order candidates from centre outward for nicer look
  cands.sort((a, b) => Math.hypot(a.x - N / 2, a.y - N / 2) - Math.hypot(b.x - N / 2, b.y - N / 2));
  let improved = true;
  while (improved && count > 1) {
    improved = false;
    for (const c of cands) {
      const orbit = [c]; let q = c;
      for (let r = 0; r < 3; r++) { q = rot(q, N); if (steps === 4 || r === 1) orbit.push(q); }
      const keys = [...new Set(orbit.map(o => o.x + ',' + o.y))];
      if (keys.some(k => mirrors.has(k))) continue;
      keys.forEach(k => mirrors.add(k));
      const nc = kolamLoops(N, mirrors).length;
      if (nc < count) { count = nc; improved = true; } else keys.forEach(k => mirrors.delete(k));
      if (count === 1) break;
    }
  }
  return { mirrors, count };
}

// ---- demo geometry ----
function buildDemo() {
  const r = singleLoopMirrors(N, 4);
  const loops = kolamLoops(N, r.mirrors);
  const dense = loops.map(loop => smoothLoop(shapeLoop(loop, r.mirrors)));
  let total = 0;
  for (const d of dense) total += d.length;
  demo = { loops, dense, total, single: loops.length === 1 };
}
// Turn the corner points of a loop into rounded curves:
// at the edge of the grid the line swings around the outside of the edge dot;
// at an inner "wall" the two bouncing lines are pulled apart so they do not touch.
function shapeLoop(loop, mirrors) {
  const n = loop.length, R = 0.56;
  const edgeDot = p => (p.y === 0 ? { x: p.x, y: 0.5 } : p.y === N ? { x: p.x, y: N - 0.5 }
                    : p.x === 0 ? { x: 0.5, y: p.y } : p.x === N ? { x: N - 0.5, y: p.y } : null);
  // rotate the loop so it starts on an inner point (not in the middle of an edge run)
  let s0 = 0;
  while (s0 < n && edgeDot(loop[s0])) s0++;
  const L = loop.slice(s0).concat(loop.slice(0, s0));
  const out = [];
  let i = 0;
  while (i < n) {
    const p = L[i], c = edgeDot(p);
    if (c) {
      // a run of edge points that all wrap around the same dot
      let j = i;
      while (j + 1 < n && edgeDot(L[j + 1]) && edgeDot(L[j + 1]).x === c.x && edgeDot(L[j + 1]).y === c.y) j++;
      const prev = L[(i - 1 + n) % n], next = L[(j + 1) % n];
      const a0 = Math.atan2(prev.y - c.y, prev.x - c.x), a1 = Math.atan2(next.y - c.y, next.x - c.x);
      const t = Math.atan2(p.y - c.y, p.x - c.x);
      const norm = v => ((v % TWO_PI) + TWO_PI) % TWO_PI;
      let delta = norm(a1 - a0);
      if (norm(t - a0) > delta) delta -= TWO_PI;          // go the other way round, through the outside
      const inset = 0.38 * Math.sign(delta);
      const span = delta - 2 * inset, steps = Math.max(2, Math.ceil(Math.abs(span) / 0.5));
      for (let k = 0; k <= steps; k++) {
        const ang = a0 + inset + span * k / steps;
        out.push({ x: c.x + R * Math.cos(ang), y: c.y + R * Math.sin(ang) });
      }
      i = j + 1;
    } else if (mirrors.has(p.x + ',' + p.y)) {
      // inner wall: pull the tip back toward the side the line came from
      const prev = L[(i - 1 + n) % n], k = 0.16;
      if (Number.isInteger(p.y)) out.push({ x: p.x, y: p.y + (prev.y < p.y ? -k : k) });
      else out.push({ x: p.x + (prev.x < p.x ? -k : k), y: p.y });
      i++;
    } else { out.push(p); i++; }
  }
  return out;
}
// closed Catmull-Rom spline through the points
function smoothLoop(pts) {
  const out = [], n = pts.length, steps = 6;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  out.push(out[0]);
  return out;
}

// ---- layout ----
let gx, gy, gs;   // ground square left, top, size (pixels)
function computeLayout() {
  const top = 64, bottom = 46;
  gs = Math.min(canvasWidth - 24, drawHeight - top - bottom);
  gx = (canvasWidth - gs) / 2;
  gy = top;
}
function toPx(p) { const pad = gs / (N + 1.2); const cell = (gs - 2 * pad) / N; return { x: gx + pad + p.x * cell, y: gy + pad + p.y * cell }; }
function toGrid(x, y) { const pad = gs / (N + 1.2); const cell = (gs - 2 * pad) / N; return { x: (x - gx - pad) / cell, y: (y - gy - pad) / cell }; }
function cellPx() { const pad = gs / (N + 1.2); return (gs - 2 * pad) / N; }

// ---- p5 ----
function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: grid size and ink colour
  gridSelect = createSelect();
  for (let k = 3; k <= 7; k++) gridSelect.option(k + ' x ' + k + ' dots', k);
  gridSelect.selected('5');
  gridSelect.position(10, drawHeight + 8);
  gridSelect.changed(() => { N = int(gridSelect.value()); strokes = []; buildDemo(); demoProgress = 1; showDemo = true; isRunning = false; demoButton.html('Trace demo'); });
  colorSelect = createSelect();
  for (const k of Object.keys(INKS)) colorSelect.option(k);
  colorSelect.position(140, drawHeight + 8);

  // Row 2: symmetry
  symCheckbox = createCheckbox(' 4-fold symmetry (copy each stroke 4 ways)', true);
  symCheckbox.position(10, drawHeight + 44);

  // Row 3: buttons
  demoButton = createButton('Trace demo');
  demoButton.position(10, drawHeight + 78);
  demoButton.mousePressed(toggleSimulation);
  clearButton = createButton('Clear');
  clearButton.position(112, drawHeight + 78);
  clearButton.mousePressed(() => { strokes = []; showDemo = false; isRunning = false; demoButton.html('Trace demo'); });
  saveButton = createButton('Save');
  saveButton.position(172, drawHeight + 78);
  saveButton.mousePressed(() => saveCanvas('my-kolam', 'png'));

  buildDemo();
  describe('A kolam drawing pad: a square of dark earth with a grid of white dots. A demo pulli kolam is drawn as white lines that loop around every dot without touching any. Learners can draw their own lines with a mouse or finger; with 4-fold symmetry on, each stroke is copied in four rotated positions around the center. Controls choose 3 by 3 to 7 by 7 dots, ink color, symmetry, tracing the demo, clearing and saving.');
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

  // ground
  noStroke();
  fill(GROUND);
  rect(gx, gy, gs, gs, 10);

  const ink = INKS[colorSelect.value()];
  const w = Math.max(3, cellPx() * 0.07);

  // demo
  if (showDemo && demo) {
    if (isRunning) {
      demoProgress = Math.min(1, demoProgress + 0.004 * (60 / Math.max(frameRate(), 20)) * (5 / N));
      if (demoProgress >= 1) { isRunning = false; demoButton.html('Trace demo'); }
    }
    let budget = Math.floor(demoProgress * demo.total);
    stroke('#FFFDF5');
    strokeWeight(w);
    strokeJoin(ROUND);
    noFill();
    for (const loop of demo.dense) {
      if (budget <= 1) break;
      const m = Math.min(loop.length, budget);
      beginShape();
      for (let i = 0; i < m; i++) { const p = toPx(loop[i]); vertex(p.x, p.y); }
      endShape();
      budget -= m;
    }
  }

  // user strokes (with rotated copies)
  stroke(ink);
  strokeWeight(w);
  noFill();
  const all = current ? strokes.concat([current]) : strokes;
  for (const s of all) {
    const copies = s.sym ? 4 : 1;
    for (let r = 0; r < copies; r++) {
      beginShape();
      for (const p of s.pts) { const q = rotPt(p, r); const px = toPx(q); vertex(px.x, px.y); }
      endShape();
    }
  }

  // dots (pulli) drawn last so they stay visible
  noStroke();
  fill('#FFFDF5');
  const dr = Math.max(6, cellPx() * 0.13);
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const p = toPx({ x: i + 0.5, y: j + 0.5 });
    circle(p.x, p.y, dr);
  }
  // centre marker for symmetry
  if (symCheckbox.checked()) {
    const c = toPx({ x: N / 2, y: N / 2 });
    noFill();
    stroke(GOLD);
    strokeWeight(1.5);
    circle(c.x, c.y, 10);
  }

  drawStatus();
}

function rotPt(p, r) { // rotate r quarter-turns around the centre of the grid
  let q = { x: p.x, y: p.y };
  for (let k = 0; k < r; k++) q = { x: N - q.y, y: q.x };
  return q;
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  const title = 'Kolam Maker: Dots and Symmetry';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Draw on the ground with your mouse or finger. Loop around the dots; try not to touch them.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Draw with your finger. Loop around the dots.';
  text(instr, canvasWidth / 2, 38);
}

function drawStatus() {
  noStroke();
  fill('#333333');
  textSize(14);
  textAlign(CENTER, CENTER);
  let msg;
  if (showDemo && demo) {
    msg = demo.single ? 'Demo: one unbroken line circles all ' + (N * N) + ' dots.'
                      : 'Demo: ' + demo.loops.length + ' closed loops circle all ' + (N * N) + ' dots.';
  } else msg = strokes.length ? 'Strokes: ' + strokes.length + (symCheckbox.checked() ? ' (each shown 4 times)' : '') : 'Empty ground. Start drawing!';
  if (textWidth(msg) > canvasWidth - 20) msg = msg.replace(' unbroken', '').replace('circle all', 'around').replace('circles all', 'around');
  text(msg, canvasWidth / 2, gy + gs + 22);
  // on narrow screens there is room below the ground for a tip
  const room = drawHeight - (gy + gs + 40);
  if (room > 60) {
    fill('#555555');
    const tip = 'Kolam artists place the dots first, then draw lines that loop around them. Turn symmetry off and compare how hard it is to keep a design balanced.';
    const words = tip.split(' '); let line = '', y = gy + gs + 48;
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (textWidth(t) > canvasWidth - 30 && line) { text(line, canvasWidth / 2, y); y += 18; line = w; } else line = t;
    }
    if (line) text(line, canvasWidth / 2, y);
  }
}

// ---- drawing input (mouse and touch) ----
function inGround(x, y) { return x >= gx && x <= gx + gs && y >= gy && y <= gy + gs; }
function startStroke(x, y) {
  if (!inGround(x, y)) return false;
  if (isRunning) { isRunning = false; demoProgress = 1; demoButton.html('Trace demo'); }
  current = { pts: [toGrid(x, y)], sym: symCheckbox.checked() };
  return true;
}
function extendStroke(x, y) {
  if (!current) return false;
  const g = toGrid(constrain(x, gx, gx + gs), constrain(y, gy, gy + gs));
  const last = current.pts[current.pts.length - 1];
  if (Math.hypot(g.x - last.x, g.y - last.y) > 0.03 && current.pts.length < 2000) current.pts.push(g);
  return true;
}
function endStroke() {
  if (current && current.pts.length > 1) strokes.push(current);
  current = null;
}
function mousePressed() { startStroke(mouseX, mouseY); }
function mouseDragged() { extendStroke(mouseX, mouseY); }
function mouseReleased() { endStroke(); }
function touchStarted() {
  if (touches.length && startStroke(touches[0].x, touches[0].y)) return false;
}
function touchMoved() {
  if (current && touches.length) { extendStroke(touches[0].x, touches[0].y); return false; }
}
function touchEnded() { if (current) { endStroke(); return false; } }

function toggleSimulation() {
  if (!isRunning) {
    if (demoProgress >= 1 || !showDemo) demoProgress = 0;
    showDemo = true;
    isRunning = true;
    demoButton.html('Pause');
  } else {
    isRunning = false;
    demoButton.html('Trace demo');
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
