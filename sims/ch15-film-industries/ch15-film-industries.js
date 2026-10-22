// Film Industries Map and Cricket Basics (Roots & Rivers, Chapter 15)
// CANVAS_HEIGHT = 720 (drawHeight 630 + controlHeight 90); iframe height 722px
// Tab 1: a schematic tile map of language-based film industries across South
// Asia. Click or tap a tile to see its language, center, nickname and a
// landmark film or figure with its year. No borders are drawn.
// Tab 2: an animated over of cricket: 6 legal balls (plus one wide that does
// not count) with runs adding up on a scoreboard. Starts paused.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 630;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

let filmTabButton, cricketTabButton, startButton, resetButton;
let mode = 'film';
let isRunning = false; // the over always starts paused

const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const SEA = '#D6ECF0';

// Film industries. Positions (u, v) are only roughly geographic, not to scale.
// Facts are from the Chapter 15 fact log (logs/15-factcheck.md).
const industries = [
  { short: 'Urdu/Punjabi', name: 'Lollywood (Pakistan)', u: 0.20, v: 0.17, color: '#9CC5A1',
    lang: 'Urdu and Punjabi', center: 'Lahore, Pakistan (since the 2000s, much film work has moved to Karachi)',
    landmark: 'Joyland (2022) won the Jury Prize in the Un Certain Regard section at Cannes. The Legend of Maula Jatt (2022) is a Punjabi action epic.',
    note: '"Lollywood" blends Lahore and Hollywood.' },
  { short: 'Nepali', name: 'Nepali cinema', u: 0.50, v: 0.27, color: '#E8A7A0',
    lang: 'Nepali (also Maithili, Newari and others)', center: 'Kathmandu, Nepal',
    landmark: 'Satya Harishchandra (1951), the first Nepali-language film, was made in Kolkata; Aama (1964) was the first film produced in Nepal.',
    note: 'Some call it "Cinemandu".' },
  { short: 'Dzongkha', name: 'Bhutanese cinema', u: 0.76, v: 0.15, color: '#F2B880',
    lang: 'Dzongkha', center: 'Thimphu, Bhutan',
    landmark: 'Lunana: A Yak in the Classroom (2019) was nominated for Best International Feature Film at the 2022 Oscars.',
    note: 'Gasa Lamai Singye (1989) was the first Bhutanese feature film.' },
  { short: 'Hindi', name: 'Bollywood (Hindi cinema)', u: 0.29, v: 0.47, color: '#F6C98B',
    lang: 'Hindi', center: 'Mumbai, India',
    landmark: 'Raja Harishchandra (1913), often called the first full-length Indian feature film; Alam Ara (1931), the first Indian sound film.',
    note: '"Bollywood" blends Bombay and Hollywood. It means Hindi films only, not all Indian film.' },
  { short: 'Bengali: Kolkata', name: 'Tollywood (Kolkata)', u: 0.62, v: 0.42, color: '#A8D5BA',
    lang: 'Bengali (Bangla)', center: 'Tollygunge, Kolkata, India',
    landmark: 'Satyajit Ray\'s Pather Panchali (1955); Ray received an honorary Oscar in 1992.',
    note: 'The nickname comes from Tollygunge, the studio area.' },
  { short: 'Bangla: Dhaka', name: 'Dhallywood (Bangladesh)', u: 0.82, v: 0.30, color: '#7FC39A',
    lang: 'Bangla', center: 'Dhaka, Bangladesh',
    landmark: 'Mukh O Mukhosh (1956), the first Bengali feature film made in what is now Bangladesh.',
    note: 'Singer Runa Laila became famous across Bangladesh, Pakistan and India.' },
  { short: 'Telugu', name: 'Telugu cinema (Tollywood)', u: 0.49, v: 0.54, color: '#F3A65A',
    lang: 'Telugu', center: 'Hyderabad, India',
    landmark: 'RRR (2022): its song "Naatu Naatu" won the Oscar for Best Original Song in 2023.',
    note: 'Bhishma Pratigna (1921) is generally called the first Telugu feature film. The industry is based in Film Nagar, Hyderabad.' },
  { short: 'Kannada', name: 'Sandalwood (Kannada)', u: 0.36, v: 0.64, color: '#D9C27A',
    lang: 'Kannada', center: 'Bengaluru, India',
    landmark: 'Sati Sulochana (1934), the first Kannada talkie.',
    note: 'It is also called Chandanavana, and it is based in Gandhi Nagar, Bengaluru.' },
  { short: 'Tamil', name: 'Kollywood (Tamil)', u: 0.62, v: 0.66, color: '#8FCFD4',
    lang: 'Tamil', center: 'Chennai, India (Kodambakkam)',
    landmark: 'Kalidas (1931), the first sound film with Tamil in it (it mixed Tamil and Telugu).',
    note: '"Kollywood" blends Kodambakkam, a Chennai neighborhood full of studios, and Hollywood.' },
  { short: 'Malayalam', name: 'Malayalam cinema', u: 0.46, v: 0.77, color: '#B9D88F',
    lang: 'Malayalam', center: 'Kerala, India',
    landmark: 'Vigathakumaran (released 1930), the first Malayalam feature film, made by J. C. Daniel.',
    note: 'Also called Mollywood. The first Malayalam talkie was Balan (1938).' },
  { short: 'Sinhala', name: 'Sri Lankan cinema', u: 0.62, v: 0.935, color: '#C7B3E0',
    lang: 'Sinhala and Tamil', center: 'Sri Lanka',
    landmark: 'Rekava (1956) by Lester James Peries, shown in competition at Cannes in 1957.',
    note: 'Sri Lankan cinema began in 1947 with Kadawunu Poronduwa. Films are made in Sinhala and Tamil.' }
];
let selectedFilm = 3; // start on Hindi, to show it is one tile among many

// The over: 7 deliveries, 6 legal balls
const deliveries = [
  { label: '1', runs: 1, legal: true, kind: 'run', note: 'The batters run once between the wickets: 1 run.' },
  { label: '•', runs: 0, legal: true, kind: 'dot', note: 'Dot ball: the batter blocks it. No run.' },
  { label: '4', runs: 4, legal: true, kind: 'four', note: 'Four! The ball bounces, then crosses the boundary rope: 4 runs.' },
  { label: 'Wd', runs: 1, legal: false, kind: 'wide', note: 'Wide: too far from the batter to hit. 1 extra run, and the ball does NOT count. It must be bowled again.' },
  { label: '2', runs: 2, legal: true, kind: 'run', note: 'The batters run twice: 2 runs.' },
  { label: 'W', runs: 0, legal: true, kind: 'wicket', note: 'Wicket! The ball hits the stumps and the batter is out. A new batter comes in.' },
  { label: '6', runs: 6, legal: true, kind: 'six', note: 'Six! The ball flies over the boundary without bouncing: 6 runs.' }
];
let ballIndex = 0;   // how many deliveries are finished
let t = 0;           // progress of the current delivery, 0..1
let pauseFrames = 0; // short pause between deliveries

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  filmTabButton = createButton('Film industries');
  filmTabButton.mousePressed(() => { mode = 'film'; isRunning = false; updateButtons(); });
  cricketTabButton = createButton('Cricket: one over');
  cricketTabButton.mousePressed(() => { mode = 'cricket'; updateButtons(); });

  startButton = createButton('Start');
  startButton.mousePressed(toggleSimulation);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetSimulation);

  placeControls();
  updateButtons();

  describe('Two views. Film industries: a schematic tile map of eleven language-based film industries in South Asia, from Lollywood in Lahore and Bollywood in Mumbai to Telugu, Tamil, Kannada and Malayalam cinema, Bengali cinema in Kolkata and Dhaka, and Nepali, Bhutanese and Sri Lankan cinema. Selecting a tile shows the language, the center, and a landmark film with its year. Cricket: an animated over in which a bowler delivers six legal balls plus one wide, scoring 1, dot, 4, wide, 2, wicket and 6, for 14 runs and 1 wicket.');
}

function placeControls() {
  const narrow = canvasWidth < 520;
  filmTabButton.position(10, drawHeight + 10);
  cricketTabButton.position(narrow ? 140 : 145, drawHeight + 10);
  startButton.position(10, drawHeight + 50);
  resetButton.position(90, drawHeight + 50);
}

function updateButtons() {
  for (const b of [filmTabButton, cricketTabButton]) {
    const on = (b === filmTabButton) === (mode === 'film');
    b.style('background', on ? NAVY : 'white');
    b.style('color', on ? 'white' : NAVY);
    b.style('border', '1px solid ' + NAVY);
    b.style('padding', '4px 8px');
    b.style('border-radius', '4px');
    b.style('font-size', '15px');
  }
  if (mode === 'cricket') { startButton.show(); resetButton.show(); }
  else { startButton.hide(); resetButton.hide(); }
  startButton.html(isRunning ? 'Pause' : (ballIndex >= deliveries.length ? 'Replay' : 'Start'));
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (mode === 'film') drawFilm();
  else { stepCricket(); drawCricket(); }
}

function drawTitle(title, instr, instrShort) {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  text(textWidth(instr) > canvasWidth - 20 ? instrShort : instr, canvasWidth / 2, 38);
}

// ---------------- Film tab ----------------
let mx, my, mw, mh, px, py, pw, ph, wide;

function filmLayout() {
  wide = canvasWidth >= 700;
  const top = 62;
  if (wide) {
    mx = margin; my = top; mw = Math.floor(canvasWidth * 0.55); mh = drawHeight - top - 44;
    px = mx + mw + margin; py = top; pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    mx = margin; my = top; mw = canvasWidth - 2 * margin; mh = 330;
    px = margin; py = my + mh + 44; pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin;
  }
}

function tileRect(ind) {
  textSize(14);
  textStyle(BOLD);
  const w = textWidth(ind.short) + 18;
  const h = 26;
  const x = constrain(mx + ind.u * mw - w / 2, mx + 4, mx + mw - w - 4);
  const y = my + ind.v * mh - h / 2;
  textStyle(NORMAL);
  return { x, y, w, h };
}

function drawFilm() {
  filmLayout();
  drawTitle('Film Industries of South Asia', 'Click a tile to meet a film industry. Bollywood is only one of them.', 'Tap a tile to meet a film industry.');

  stroke('silver');
  strokeWeight(1);
  fill(SEA);
  rect(mx, my, mw, mh, 8);
  // soft land shape (schematic, no borders)
  noStroke();
  fill('#F7E7C6');
  beginShape();
  const pts = [[0.06, 0.08], [0.94, 0.08], [0.95, 0.44], [0.76, 0.50], [0.62, 0.68], [0.50, 0.84], [0.36, 0.68], [0.24, 0.56], [0.08, 0.46]];
  for (const p of pts) curveVertex(mx + p[0] * mw, my + p[1] * mh);
  curveVertex(mx + pts[0][0] * mw, my + pts[0][1] * mh);
  curveVertex(mx + pts[1][0] * mw, my + pts[1][1] * mh);
  endShape();
  // island
  fill('#F7E7C6');
  ellipse(mx + 0.62 * mw, my + 0.935 * mh, 0.22 * mw, 0.09 * mh);

  for (let i = 0; i < industries.length; i++) {
    const ind = industries[i];
    const r = tileRect(ind);
    if (i === selectedFilm) { stroke(SAFFRON); strokeWeight(4); }
    else { stroke('white'); strokeWeight(2); }
    fill(ind.color);
    rect(r.x, r.y, r.w, r.h, 8);
    noStroke();
    fill(NAVY);
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(ind.short, r.x + r.w / 2, r.y + r.h / 2 + 1);
    textStyle(NORMAL);
  }

  noStroke();
  fill('#333333');
  textSize(14);
  textAlign(CENTER, TOP);
  const cap = 'Schematic map, not to scale. Not an official depiction of borders.';
  if (textWidth(cap) < mw - 10) text(cap, mx + mw / 2, my + mh + 6);
  else { text('Schematic map, not to scale.', mx + mw / 2, my + mh + 4); text('Not an official depiction of borders.', mx + mw / 2, my + mh + 21); }

  drawFilmPanel();
}

function drawFilmPanel() {
  const ind = industries[selectedFilm];
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  noStroke();
  const pad = 10;
  const tw = pw - 2 * pad;
  let y = py + pad;
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  fill(SAFFRON);
  textSize(wide ? 20 : 18);
  for (const line of wrapLines(ind.name, tw)) { text(line, px + pad, y); y += wide ? 26 : 23; }
  y += 4;
  textSize(wide ? 16 : 14);
  const lead = wide ? 21 : 18;
  const rows = [['Language: ', ind.lang], ['Center: ', ind.center], ['Landmark: ', ind.landmark], ['', ind.note]];
  for (const r of rows) {
    textStyle(NORMAL);
    const lines = wrapLines(r[0] + r[1], tw);
    for (let k = 0; k < lines.length; k++) {
      if (k === 0 && r[0] !== '') {
        textStyle(BOLD); fill(NAVY);
        text(r[0], px + pad, y);
        const lw = textWidth(r[0]);
        textStyle(NORMAL); fill('#222222');
        text(lines[0].substring(r[0].length), px + pad + lw, y);
      } else {
        fill(r[0] === '' ? '#444444' : '#222222');
        text(lines[k], px + pad, y);
      }
      y += lead;
    }
    y += wide ? 6 : 3;
  }
  // footer
  textStyle(BOLD);
  textSize(14);
  fill(TEAL);
  const foot = 'In 2023, India certified films in 25+ languages. Telugu, Tamil, Kannada and Malayalam films together outnumbered Hindi films more than 2 to 1.';
  const fl = wrapLines(foot, tw);
  const fy = py + ph - pad - fl.length * 18;
  if (fy > y) for (let k = 0; k < fl.length; k++) text(fl[k], px + pad, fy + k * 18);
  textStyle(NORMAL);
}

// ---------------- Cricket tab ----------------
function stepCricket() {
  if (!isRunning) return;
  if (pauseFrames > 0) { pauseFrames--; return; }
  t += 0.011;
  if (t >= 1) {
    t = 0;
    ballIndex++;
    pauseFrames = 50;
    if (ballIndex >= deliveries.length) { isRunning = false; updateButtons(); }
  }
}

function drawCricket() {
  drawTitle('Cricket Basics: One Over', 'Press Start to watch one over: 6 legal balls, with runs adding up.', 'Press Start to watch one over.');
  const wideC = canvasWidth >= 620;
  const fx = margin, fy = 62, fw = canvasWidth - 2 * margin, fh = wideC ? 300 : 250;

  // field
  noStroke();
  fill('#CFE8C0');
  stroke('silver');
  rect(fx, fy, fw, fh, 8);
  noStroke();
  fill('#BFE0AE');
  ellipse(fx + fw / 2, fy + fh / 2, fw * 0.94, fh * 0.92);
  // boundary rope
  noFill();
  stroke('white');
  strokeWeight(3);
  ellipse(fx + fw / 2, fy + fh / 2, fw * 0.94, fh * 0.92);
  // pitch: 22 yards, drawn left (bowler) to right (batter)
  const cx = fx + fw / 2, cy = fy + fh / 2;
  const pl = Math.min(fw * 0.42, 300), pwid = 26;
  noStroke();
  fill('#E2C89A');
  rect(cx - pl / 2, cy - pwid / 2, pl, pwid);
  // stumps
  const bowlX = cx - pl / 2 + 8, batX = cx + pl / 2 - 8;
  const current = deliveries[Math.min(ballIndex, deliveries.length - 1)];
  const inFlight = ballIndex < deliveries.length && (t > 0 || isRunning);
  const knocked = (ballIndex < deliveries.length && current.kind === 'wicket' && t > 0.55) ||
    (ballIndex > 0 && deliveries[ballIndex - 1].kind === 'wicket' && pauseFrames > 0);
  drawStumps(bowlX, cy, false);
  drawStumps(batX, cy, knocked);

  // labels
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  fill(NAVY);
  text('Bowler', bowlX - 6, cy + pwid / 2 + 6);
  text('Batter', batX + 4, cy + pwid / 2 + 6);
  textAlign(CENTER, BOTTOM);
  fill('#333333');
  text('Pitch: 22 yards (20.12 m)', cx, cy - pwid / 2 - 6);
  textAlign(CENTER, TOP);
  text('Boundary rope', cx, fy + 8);

  // players
  fill(SAFFRON);
  circle(bowlX - 18, cy, 16);
  fill(TEAL);
  circle(batX + 16, cy - 2, 16);

  // ball
  if (inFlight) {
    let bx, by;
    if (t < 0.5) {
      const s = t / 0.5;
      bx = lerp(bowlX, batX - 4, s);
      by = cy - 30 * sin(PI * s) + (current.kind === 'wide' ? s * (pwid + 12) : 0);
    } else {
      const s = (t - 0.5) / 0.5;
      let tx = batX, ty = cy;
      if (current.kind === 'four') { tx = fx + fw * 0.88; ty = fy + fh * 0.22; }
      else if (current.kind === 'six') { tx = fx + fw * 0.80; ty = fy - 4; }
      else if (current.kind === 'run') { tx = cx + pl * 0.15; ty = fy + fh * 0.80; }
      else if (current.kind === 'wide') { tx = batX + 40; ty = cy + pwid + 30; }
      const sx = current.kind === 'wide' ? batX - 4 : batX - 4;
      const sy = current.kind === 'wide' ? cy + pwid + 12 : cy;
      bx = lerp(sx, tx, s);
      by = lerp(sy, ty, s) - (current.kind === 'six' ? 40 * sin(PI * s) : 0);
    }
    fill('#B22222');
    stroke('white');
    strokeWeight(1);
    circle(bx, by, current.kind === 'six' && t > 0.5 ? 14 : 10);
  }

  drawScoreboard(fx, fy + fh + 10, fw, drawHeight - (fy + fh + 10) - margin);
}

function drawStumps(x, y, knocked) {
  stroke('#6B4423');
  strokeWeight(3);
  for (let k = -1; k <= 1; k++) {
    if (knocked) line(x + k * 5, y + 8, x + k * 5 + 8, y - 6);
    else line(x + k * 5, y + 9, x + k * 5, y - 9);
  }
  strokeWeight(1);
}

function drawScoreboard(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 6);
  noStroke();
  const done = deliveries.slice(0, ballIndex);
  const runs = done.reduce((a, d) => a + d.runs, 0);
  const legal = done.filter(d => d.legal).length;
  const wkts = done.filter(d => d.kind === 'wicket').length;

  const pad = 12;
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  fill(NAVY);
  text('Score: ' + runs + ' runs for ' + wkts + (wkts === 1 ? ' wicket' : ' wickets'), x + pad, y + 10);
  textSize(16);
  fill(SAFFRON);
  text('Legal balls: ' + legal + ' of 6', x + pad, y + 36);
  textStyle(NORMAL);

  // ball circles
  const r = 30;
  let bx = x + pad + r / 2, by = y + 82;
  for (let i = 0; i < deliveries.length; i++) {
    const d = deliveries[i];
    const isDone = i < ballIndex;
    stroke(d.legal ? NAVY : MARIGOLD);
    strokeWeight(2);
    fill(isDone ? (d.kind === 'wicket' ? '#F4C7C3' : d.legal ? '#E8EEF9' : '#FDE7C8') : 'white');
    circle(bx, by, r);
    noStroke();
    fill(isDone ? '#111111' : '#BBBBBB');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(14);
    text(isDone ? d.label : '?', bx, by + 1);
    textStyle(NORMAL);
    bx += r + 8;
  }
  textAlign(LEFT, TOP);
  noStroke();

  // explanation
  let msg;
  if (ballIndex === 0 && t === 0) msg = 'An over is 6 legal balls bowled by one bowler from one end. Press Start.';
  else if (ballIndex >= deliveries.length) msg = 'Over complete: 6 legal balls (the wide did not count), 14 runs, 1 wicket. The next over comes from the other end, by a different bowler. A T20 innings has 20 overs; an ODI innings has 50.';
  else if (pauseFrames > 0 && ballIndex > 0) msg = deliveries[ballIndex - 1].note;
  else msg = 'Ball in play...';
  textSize(15);
  fill('#222222');
  let ty = by + r / 2 + 12;
  for (const line of wrapLines(msg, w - 2 * pad)) {
    if (ty > y + h - 18) break;
    text(line, x + pad, ty);
    ty += 20;
  }
}

function toggleSimulation() {
  if (ballIndex >= deliveries.length) resetSimulation();
  isRunning = !isRunning;
  updateButtons();
}

function resetSimulation() {
  isRunning = false;
  ballIndex = 0;
  t = 0;
  pauseFrames = 0;
  updateButtons();
}

// ---------------- shared ----------------
function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const tt = cur === '' ? w : cur + ' ' + w;
    if (textWidth(tt) > maxW && cur !== '') { lines.push(cur); cur = w; }
    else cur = tt;
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function pickTile(x, y) {
  if (mode !== 'film') return -1;
  filmLayout();
  for (let i = industries.length - 1; i >= 0; i--) {
    const r = tileRect(industries[i]);
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
  }
  return -1;
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  const i = pickTile(mouseX, mouseY);
  if (i >= 0) selectedFilm = i;
}

function touchStarted() {
  if (touches.length > 0) {
    const tt = touches[0];
    if (tt.y >= 0 && tt.y <= drawHeight) {
      const i = pickTile(tt.x, tt.y);
      if (i >= 0) { selectedFilm = i; return false; }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  placeControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
