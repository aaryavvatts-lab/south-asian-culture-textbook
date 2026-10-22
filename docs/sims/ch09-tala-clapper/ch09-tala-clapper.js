// Tala Clapper (Roots & Rivers, Chapter 9: Music)
// CANVAS_HEIGHT = 600 (drawHeight 530 + controlHeight 100); iframe height 632px
// Beat dots sit in a circle like a clock face. Press Start to light each beat
// in turn and see the hand gesture: clap, wave, or (in Adi tala) finger counts.
// Sam, the first beat of the cycle, is the large star-marked dot at the top.
// Sound: short WebAudio tones synthesized in the browser (no recordings).
// No sound plays until the user presses Start; the "Sound on" box mutes it.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 530;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;
let sliderLeftMargin = 150;

// controls
let talaSelect, startButton, tempoSlider, soundCheckbox;
let isRunning = false; // MicroSims always start paused

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

// Beat kinds: 'clap', 'wave', 'count' (Hindustani beat inside a section),
// 'finger' (Carnatic finger count). sam = first beat of the cycle.
// Structures: Teentaal 4+4+4+4, wave on 9 (X 2 0 3); Rupak 3+2+2 starting on
// a wave, claps on 4 and 6; Dadra 3+3, wave on 4; Adi tala laghu 4 + drutam 2
// + drutam 2 (palm, pinky, ring, middle, palm, flip, palm, flip).
const talas = [
  {
    name: 'Teentaal', system: 'Hindustani', sections: [4, 4, 4, 4],
    marks: ['X', '2', '0', '3'],
    kinds: ['clap', 'count', 'count', 'count', 'clap', 'count', 'count', 'count',
            'wave', 'count', 'count', 'count', 'clap', 'count', 'count', 'count'],
    about: '16 beats in four sections of 4. Clap on 1 (sam), 5 and 13. Wave on 9 (khali): the deep tabla bass goes quiet, and sam is 8 beats away.'
  },
  {
    name: 'Rupak', system: 'Hindustani', sections: [3, 2, 2],
    marks: ['X/0', '2', '3'],
    kinds: ['wave', 'count', 'count', 'clap', 'count', 'clap', 'count'],
    about: '7 beats in sections of 3 + 2 + 2. Rupak starts on a wave: sam is also khali. Claps on 4 and 6.'
  },
  {
    name: 'Dadra', system: 'Hindustani', sections: [3, 3],
    marks: ['X', '0'],
    kinds: ['clap', 'count', 'count', 'wave', 'count', 'count'],
    about: '6 beats in two sections of 3. Clap on 1 (sam), wave on 4 (khali). Common in light classical songs and film songs.'
  },
  {
    name: 'Adi tala', system: 'Carnatic', sections: [4, 2, 2],
    marks: ['Laghu', 'Drutam', 'Drutam'],
    kinds: ['clap', 'finger', 'finger', 'finger', 'clap', 'wave', 'clap', 'wave'],
    fingers: { 1: 'Pinky', 2: 'Ring finger', 3: 'Middle finger' },
    about: '8 beats: 4 + 2 + 2. Palm on 1, then pinky, ring and middle finger; palm and flip; palm and flip. The most widely used tala in Carnatic music.'
  }
];

let current = 0;        // start with Teentaal
let beat = -1;          // -1 = not started; otherwise 0-based beat index
let cycles = 0;
let lastBeatTime = 0;
let clickedBeat = -1;
let flash = 0;

// layout
let cx, cy, R, px, py, pw, ph, wide;

// WebAudio (created only after the user presses Start)
let audioCtx = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  talaSelect = createSelect();
  for (let t of talas) talaSelect.option(t.name + ' (' + t.kinds.length + ')', t.name);
  talaSelect.selected(talas[current].name);
  talaSelect.changed(() => {
    current = talas.findIndex(t => t.name === talaSelect.value());
    beat = -1;
    cycles = 0;
    clickedBeat = -1;
    if (isRunning) { beat = 0; lastBeatTime = millis(); playBeat(0); }
  });

  startButton = createButton('Start');
  startButton.mousePressed(toggleSimulation);

  soundCheckbox = createCheckbox(' Sound on', true);

  tempoSlider = createSlider(40, 160, 70, 1);

  positionControls();

  describe('A circle of beat dots like a clock face shows one cycle of a South Asian tala: Teentaal (16 beats), Rupak (7), Dadra (6) or the Carnatic Adi tala (8). Sam, the first beat, is a large star-marked dot at the top; claps are filled dots, waves are hollow dots, and finger counts are small dots. Pressing Start lights each beat in turn at the chosen tempo, shows the hand gesture in the center, counts the cycles, and plays short synthesized clicks with a distinct low tone on sam.');
}

function positionControls() {
  talaSelect.position(10, drawHeight + 10);
  startButton.position(150, drawHeight + 10);
  soundCheckbox.position(220, drawHeight + 12);
  tempoSlider.position(sliderLeftMargin, drawHeight + 58);
  tempoSlider.size(max(80, canvasWidth - sliderLeftMargin - 20));
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
  if (isRunning) {
    ensureAudio();
    if (beat < 0) { beat = 0; cycles = 0; }
    lastBeatTime = millis();
    playBeat(beat);
  }
}

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

// Short synthesized tones. kind: 'sam', 'clap', 'wave', 'count', 'finger'
function tone(freq, dur, gain, type) {
  if (!audioCtx || !soundCheckbox.checked()) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function playBeat(i) {
  const t = talas[current];
  const k = t.kinds[i];
  flash = 1;
  if (i === 0) {
    tone(196, 0.45, 0.35, 'sine');      // sam: low, longer tone
    tone(784, 0.08, 0.12, 'triangle');
  } else if (k === 'clap') {
    tone(1046, 0.09, 0.25, 'triangle'); // clap: bright click
  } else if (k === 'wave') {
    tone(330, 0.12, 0.10, 'sine');      // wave: soft, muted tick
  } else {
    tone(1568, 0.03, 0.05, 'sine');     // count or finger: quiet tick
  }
}

function computeLayout() {
  wide = canvasWidth >= 700;
  const top = 66;
  if (wide) {
    const areaW = canvasWidth * 0.55;
    R = min(areaW, drawHeight - top - 20) / 2 - 34;
    cx = margin + areaW / 2;
    cy = top + (drawHeight - top) / 2 - 4;
    px = margin + areaW + 10;
    py = top;
    pw = canvasWidth - px - margin;
    ph = drawHeight - top - margin;
  } else {
    R = min(canvasWidth - 2 * margin, 290) / 2 - 34;
    cx = canvasWidth / 2;
    cy = top + R + 36;
    px = margin;
    py = cy + R + 34;
    pw = canvasWidth - 2 * margin;
    ph = drawHeight - py - margin;
  }
}

function beatPos(i, n, rr) {
  const a = -HALF_PI + i * TWO_PI / n;
  return { x: cx + cos(a) * rr, y: cy + sin(a) * rr, a: a };
}

function draw() {
  updateCanvasSize();
  computeLayout();

  // advance the beat clock
  const bpm = tempoSlider.value();
  const interval = 60000 / bpm;
  if (isRunning && millis() - lastBeatTime >= interval) {
    lastBeatTime += interval;
    if (millis() - lastBeatTime > interval) lastBeatTime = millis(); // catch up after a stall
    beat = (beat + 1) % talas[current].kinds.length;
    if (beat === 0) cycles++;
    playBeat(beat);
  }
  flash = max(0, flash - 0.06);

  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawCircle();
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
  const title = 'Tala Clapper: Count the Cycle, Find Sam';
  while (textWidth(title) > canvasWidth - 20 && ts > 15) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Pick a tala, press Start, and clap or wave along. Land on sam!';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Press Start and clap along. Land on sam!';
  text(instr, canvasWidth / 2, 40);
}

function drawCircle() {
  const t = talas[current];
  const n = t.kinds.length;

  // section arcs (alternating soft colors)
  let start = 0;
  noFill();
  strokeCap(SQUARE);
  for (let s = 0; s < t.sections.length; s++) {
    const len = t.sections[s];
    const a0 = -HALF_PI + (start - 0.42) * TWO_PI / n;
    const a1 = -HALF_PI + (start + len - 1 + 0.42) * TWO_PI / n;
    stroke(['#F6D9A8', '#CFE7E4', '#E3DDF0', '#D6EBCF'][s % 4]);
    strokeWeight(26);
    arc(cx, cy, R * 2, R * 2, a0, a1);
    // section mark outside the circle
    textStyle(BOLD);
    textSize(14);
    const ang = -HALF_PI + start * TWO_PI / n;
    const p = beatPos(start, n, R + 24 + textWidth(t.marks[s]) / 2 * abs(cos(ang)));
    noStroke();
    fill(TEAL);
    textAlign(CENTER, CENTER);
    text(t.marks[s], p.x, p.y);
    textStyle(NORMAL);
    noFill();
    start += len;
  }
  strokeCap(ROUND);

  // beat dots
  for (let i = 0; i < n; i++) {
    const p = beatPos(i, n, R);
    const k = t.kinds[i];
    const isNow = (i === beat);
    let d = (k === 'clap' || k === 'wave') ? 22 : 14;
    if (i === 0) d = 30;
    if (isNow) {
      noStroke();
      fill(242, 140, 18, 90 + 120 * flash);
      circle(p.x, p.y, d + 18);
    }
    if (k === 'wave') {
      stroke(TEAL);
      strokeWeight(3);
      fill(isNow ? GOLD : 'white');
    } else if (k === 'clap') {
      stroke(isNow ? SAFFRON : NAVY);
      strokeWeight(2);
      fill(isNow ? SAFFRON : MARIGOLD);
    } else {
      stroke(NAVY);
      strokeWeight(1);
      fill(isNow ? SAFFRON : NAVY);
    }
    if (i === clickedBeat) { stroke(LEAF); strokeWeight(4); }
    circle(p.x, p.y, d);
    if (i === 0) drawStar(p.x, p.y, 7, 3, isNow ? 'white' : (k === 'wave' ? TEAL : 'white'));
    // beat number just inside the circle
    const q = beatPos(i, n, R - 30);
    noStroke();
    fill(isNow ? SAFFRON : '#444444');
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(isNow ? BOLD : NORMAL);
    text(i + 1, q.x, q.y);
    textStyle(NORMAL);
  }

  // center read-out
  noStroke();
  textAlign(CENTER, CENTER);
  if (beat < 0) {
    fill('#555555');
    textSize(16);
    text('Press Start', cx, cy - 10);
    textSize(14);
    text(t.name + ': ' + n + ' beats', cx, cy + 14);
  } else {
    const g = gestureFor(beat);
    fill(beat === 0 ? SAFFRON : NAVY);
    textStyle(BOLD);
    textSize(beat === 0 ? 24 : 22);
    text(beat === 0 ? 'SAM' : g.toUpperCase(), cx, cy - 18);
    textStyle(NORMAL);
    textSize(14);
    fill('#333333');
    text(beat === 0 ? g + ' on beat 1' : 'Beat ' + (beat + 1) + ' of ' + n, cx, cy + 8);
    text('Cycle ' + (cycles + 1), cx, cy + 28);
  }
}

function drawStar(x, y, r1, r2, col) {
  noStroke();
  fill(col);
  beginShape();
  for (let k = 0; k < 10; k++) {
    const r = k % 2 === 0 ? r1 : r2;
    const a = -HALF_PI + k * PI / 5;
    vertex(x + cos(a) * r, y + sin(a) * r);
  }
  endShape(CLOSE);
}

function gestureFor(i) {
  const t = talas[current];
  const k = t.kinds[i];
  if (k === 'clap') return t.system === 'Carnatic' ? 'Palm' : 'Clap';
  if (k === 'wave') return t.system === 'Carnatic' ? 'Flip' : 'Wave';
  if (k === 'finger') return t.fingers[i];
  return 'Count';
}

function describeBeat(i) {
  const t = talas[current];
  const k = t.kinds[i];
  let s = 'Beat ' + (i + 1) + ': ';
  if (i === 0) s += 'sam, the first beat. ';
  if (k === 'clap') s += t.system === 'Carnatic' ? 'beat the palm on your thigh (a clap).' : 'clap (tali). It starts a section.';
  else if (k === 'wave') s += t.system === 'Carnatic' ? 'turn the hand over and tap with the back (a wave).' : 'wave (khali, "empty"). The tabla plays mostly light strokes, without the deep bass.';
  else if (k === 'finger') s += 'touch the ' + t.fingers[i].toLowerCase() + ' to your thigh (laghu count).';
  else s += 'counted silently inside the section.';
  return s;
}

function drawPanel() {
  const t = talas[current];
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 8);
  noStroke();
  textAlign(LEFT, TOP);
  const x = px + 10, w = pw - 20, lh = 18;
  let y = py + 8;

  fill(SAFFRON);
  textStyle(BOLD);
  textSize(18);
  text(t.name, x, y);
  const nw = textWidth(t.name);
  textStyle(NORMAL);
  textSize(14);
  fill('#555555');
  text(t.system + ' | ' + t.sections.join(' + ') + ' = ' + t.kinds.length + ' beats', x + nw + 10, y + 3);
  y += 26;

  fill('#222222');
  const body = clickedBeat >= 0 ? describeBeat(clickedBeat) : t.about;
  for (let line of wrapLines(body, w)) { text(line, x, y); y += lh; }

  // legend (only if room)
  if (y + 4 * lh < py + ph) {
    y += 8;
    const items = [['clap', t.system === 'Carnatic' ? 'Palm (clap)' : 'Clap (tali)'],
                   ['wave', t.system === 'Carnatic' ? 'Flip (back of hand)' : 'Wave (khali)'],
                   ['small', t.system === 'Carnatic' ? 'Finger count' : 'Counted beat'],
                   ['sam', 'Sam (first beat)']];
    let lx = x;
    for (let it of items) {
      textSize(14);
      const lw = 22 + textWidth(it[1]) + 14;
      if (lx + lw > x + w) { lx = x; y += lh + 4; }
      const yy = y + 8;
      if (it[0] === 'clap') { stroke(NAVY); strokeWeight(1); fill(MARIGOLD); circle(lx + 8, yy, 14); }
      else if (it[0] === 'wave') { stroke(TEAL); strokeWeight(3); fill('white'); circle(lx + 8, yy, 13); }
      else if (it[0] === 'small') { stroke(NAVY); strokeWeight(1); fill(NAVY); circle(lx + 8, yy, 9); }
      else { stroke(NAVY); strokeWeight(1); fill(MARIGOLD); circle(lx + 8, yy, 16); drawStar(lx + 8, yy, 5, 2, 'white'); }
      noStroke();
      fill('#222222');
      text(it[1], lx + 20, y);
      lx += lw;
    }
    y += lh + 6;
  }
  if (wide && y + 2 * lh < py + ph) {
    fill('#666666');
    for (let line of wrapLines('Tip: click any beat dot to see what your hand does on that beat.', w)) { text(line, x, y); y += lh; }
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(16);
  text('Tempo: ' + tempoSlider.value() + ' bpm', 10, drawHeight + 68);
}

function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (let wd of words) {
    const tt = cur === '' ? wd : cur + ' ' + wd;
    if (textWidth(tt) > maxW && cur !== '') { lines.push(cur); cur = wd; }
    else cur = tt;
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;
  const n = talas[current].kinds.length;
  for (let i = 0; i < n; i++) {
    const p = beatPos(i, n, R);
    if (dist(mouseX, mouseY, p.x, p.y) < 18) { clickedBeat = (clickedBeat === i ? -1 : i); return; }
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
