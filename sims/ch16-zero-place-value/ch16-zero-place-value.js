// Zero and Place Value (Roots & Rivers, Chapter 16)
// CANVAS_HEIGHT = 640 (drawHeight 560 + controlHeight 80); iframe height 642px
// Build a number from 0 to 9,999 with the up and down arrows in each column.
// The number is shown three ways: a place value table, a South Asian digit
// set (real Unicode digits) and Roman numerals (no zero, no place value).
// Tick "Hide the zeros" to see why a symbol for an empty place matters.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let digitSelect, hideCheckbox, randomButton, clearButton;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

// digits[0] = thousands, [1] = hundreds, [2] = tens, [3] = ones
let digits = [0, 5, 0, 7];
const placeNames = ['Thousands', 'Hundreds', 'Tens', 'Ones'];
const placeShort = ['1000s', '100s', '10s', '1s'];
const placeValues = [1000, 100, 10, 1];

// Unicode digit sets (code point of digit zero). Verified with the Unicode
// Character Database: U+0966 DEVANAGARI DIGIT ZERO, U+09E6 BENGALI DIGIT ZERO,
// U+0BE6 TAMIL DIGIT ZERO, U+06F0 EXTENDED ARABIC-INDIC DIGIT ZERO.
const digitSets = [
  { name: 'Devanagari (Hindi, Marathi, Nepali)', short: 'Devanagari', zero: 0x0966 },
  { name: 'Bengali (Bangla, Assamese)', short: 'Bengali', zero: 0x09E6 },
  { name: 'Tamil', short: 'Tamil', zero: 0x0BE6 },
  { name: 'Urdu (Eastern Arabic style)', short: 'Urdu', zero: 0x06F0 }
];
let setIndex = 0;

// table geometry, recalculated each frame
let tx, ty, tw, th, colW;
let pulse = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  digitSelect = createSelect();
  for (let s of digitSets) digitSelect.option(s.name);
  digitSelect.selected(digitSets[0].name);
  digitSelect.changed(() => {
    setIndex = digitSets.findIndex(s => s.name === digitSelect.value());
  });

  hideCheckbox = createCheckbox(' Hide the zeros', false);

  randomButton = createButton('Random');
  randomButton.mousePressed(() => {
    // favor numbers with at least one inside zero, so the idea shows up
    for (let k = 0; k < 4; k++) digits[k] = floor(random(10));
    if (random() < 0.7) digits[floor(random(1, 3))] = 0;
    if (digits[0] === 0) digits[0] = floor(random(1, 10));
  });

  clearButton = createButton('Clear');
  clearButton.mousePressed(() => { digits = [0, 0, 0, 0]; });

  positionControls();

  describe('A place value table with four columns: thousands, hundreds, tens and ones. Each column has up and down arrows and shows a digit with that many counters. Below the table the same number appears in our digits, in a chosen South Asian digit set (Devanagari, Bengali, Tamil or Urdu), and in Roman numerals. Empty columns glow to show that the zero is holding the place. A checkbox hides the zeros so the learner can see the number turn into a different number.');
}

function positionControls() {
  const y1 = drawHeight + 10;
  const y2 = drawHeight + 46;
  digitSelect.position(10, y1);
  if (canvasWidth >= 620) {
    hideCheckbox.position(300, y1 + 2);
    randomButton.position(450, y1);
    clearButton.position(530, y1);
  } else {
    hideCheckbox.position(10, y2 + 2);
    randomButton.position(160, y2);
    clearButton.position(240, y2);
  }
}

function currentValue() {
  return digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3];
}

function draw() {
  updateCanvasSize();
  positionControls();
  pulse += 0.06;

  // drawing area
  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  // control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawTable();
  drawRows();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Zero and Place Value';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Tap the arrows to build a number. Then tick "Hide the zeros".';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Tap arrows to build a number.';
  text(instr, canvasWidth / 2, 40);
}

function drawTable() {
  tx = margin;
  ty = 66;
  tw = canvasWidth - 2 * margin;
  th = 250;
  colW = tw / 4;

  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(tx, ty, tw, th, 8);

  for (let i = 0; i < 4; i++) {
    const cx = tx + colW * i + colW / 2;
    const x0 = tx + colW * i;
    const empty = digits[i] === 0 && hasDigitToLeftOrIsInside(i);

    // empty column glow
    if (empty && !hideCheckbox.checked()) {
      noStroke();
      const a = 60 + 40 * sin(pulse);
      fill(244, 180, 41, a);
      rect(x0 + 4, ty + 26, colW - 8, th - 30, 6);
    }

    // column divider
    if (i > 0) {
      stroke('#DDDDDD');
      line(x0, ty + 6, x0, ty + th - 6);
    }

    // header
    noStroke();
    fill(NAVY);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(14);
    const header = textWidth(placeNames[i]) < colW - 6 ? placeNames[i] : placeShort[i];
    text(header, cx, ty + 6);
    textStyle(NORMAL);

    // up arrow
    drawArrow(cx, ty + 44, true);

    // big digit
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(40);
    if (hideCheckbox.checked() && digits[i] === 0) {
      fill('#BBBBBB');
      text(' ', cx, ty + 92);
    } else {
      fill(digits[i] === 0 ? (empty ? SAFFRON : '#AAAAAA') : NAVY);
      text(digits[i], cx, ty + 92);
    }
    textStyle(NORMAL);

    // counters: a 3 x 3 grid of dots, one per unit in this column
    const r = Math.min(14, (colW - 20) / 4);
    for (let k = 0; k < 9; k++) {
      const row = floor(k / 3), col = k % 3;
      const dx = cx + (col - 1) * r * 1.35;
      const dy = ty + 130 + row * r * 1.35;
      noStroke();
      if (k < digits[i]) {
        fill([TEAL, LEAF, MARIGOLD, SAFFRON][i]);
      } else {
        fill('#EEEEEE');
      }
      circle(dx, dy, r);
    }

    // "empty" label
    if (empty) {
      fill(SAFFRON);
      textSize(14);
      textAlign(CENTER, TOP);
      const lab = hideCheckbox.checked() ? 'gap?' : 'empty';
      text(lab, cx, ty + 186);
    }

    // down arrow
    drawArrow(cx, ty + th - 22, false);
  }
}

// a zero counts as "holding a place" if there is a nonzero digit to its left
// (leading zeros are not written)
function hasDigitToLeftOrIsInside(i) {
  for (let k = 0; k < i; k++) if (digits[k] !== 0) return true;
  return false;
}

function drawArrow(cx, cy, up) {
  noStroke();
  fill(up ? TEAL : '#7A8899');
  rect(cx - 22, cy - 14, 44, 28, 6);
  fill('white');
  if (up) triangle(cx - 9, cy + 6, cx + 9, cy + 6, cx, cy - 7);
  else triangle(cx - 9, cy - 6, cx + 9, cy - 6, cx, cy + 7);
}

function writtenDigits() {
  // the number as we write it, with leading zeros removed
  const v = currentValue();
  return String(v);
}

function hiddenZeroDigits() {
  // what the reader sees if every zero symbol is left out
  let s = String(currentValue()).replace(/0/g, '');
  return s;
}

function toScript(s) {
  const z = digitSets[setIndex].zero;
  let out = '';
  for (let ch of s) {
    if (ch >= '0' && ch <= '9') out += String.fromCharCode(z + (ch.charCodeAt(0) - 48));
    else out += ch;
  }
  return out;
}

function toRoman(n) {
  if (n === 0) return '(none)';
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let out = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { out += syms[i]; n -= vals[i]; }
  }
  return out;
}

function withCommas(s) {
  return s.length > 3 ? s.slice(0, s.length - 3) + ',' + s.slice(s.length - 3) : s;
}

function drawRows() {
  const v = currentValue();
  const hide = hideCheckbox.checked();
  let shown = hide ? hiddenZeroDigits() : writtenDigits();
  if (shown === '') shown = ' ';
  let y = ty + th + 12;
  const rowH = 58;
  const bodyW = tw - 20;

  // Row 1: our digits
  drawRowBox(y, rowH, 'Our digits (Hindu-Arabic)', shown, NAVY, 30);
  y += rowH + 8;

  // Row 2: South Asian digit set
  const label2 = digitSets[setIndex].short + ' digits';
  drawRowBox(y, rowH, label2, toScript(shown), TEAL, 30);
  y += rowH + 8;

  // Row 3: Roman numerals (never affected by hiding zeros: there are none)
  drawRowBox(y, rowH, 'Roman numerals (no zero)', toRoman(v), '#6B4E16', 26);
  y += rowH + 6;

  // message line
  noStroke();
  textAlign(CENTER, TOP);
  textSize(14);
  let msg;
  const hasInnerZero = digits.some((d, i) => d === 0 && hasDigitToLeftOrIsInside(i));
  if (hide && hasInnerZero) {
    fill(SAFFRON);
    textStyle(BOLD);
    msg = 'Without zeros, ' + withCommas(String(v)) + ' looks like ' + withCommas(hiddenZeroDigits()) + '!';
  } else if (hide && v === 0) {
    fill(SAFFRON);
    textStyle(BOLD);
    msg = 'Without a zero, there is nothing to write at all!';
  } else if (hasInnerZero) {
    fill(NAVY);
    msg = 'The glowing 0 holds an empty place. Roman numerals just skip it.';
  } else {
    fill('#333333');
    msg = 'Value: ' + withCommas(String(v)) + '. Try a number with an empty place, like 507.';
  }
  const lines = wrapLines(msg, canvasWidth - 24);
  for (let k = 0; k < lines.length && k < 2; k++) text(lines[k], canvasWidth / 2, y + k * 18);
  textStyle(NORMAL);
}

function drawRowBox(y, h, label, value, col, size) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(tx, y, tw, h, 6);
  noStroke();
  fill('#444444');
  textAlign(LEFT, TOP);
  textSize(14);
  text(label, tx + 10, y + 5);
  fill(col);
  textStyle(BOLD);
  let s = size;
  textSize(s);
  while (textWidth(value) > tw - 20 && s > 16) {
    s--;
    textSize(s);
  }
  textAlign(LEFT, BOTTOM);
  text(value, tx + 10, y + h - 2);
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

function handlePress(x, y) {
  if (y > drawHeight || y < 0 || x < tx || x > tx + tw) return;
  if (y < ty || y > ty + th) return;
  const i = constrain(floor((x - tx) / colW), 0, 3);
  // top half adds one, bottom half takes one away
  if (y < ty + th / 2) digits[i] = (digits[i] + 1) % 10;
  else digits[i] = (digits[i] + 9) % 10;
}

function mousePressed() {
  handlePress(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    const t = touches[0];
    if (t.y >= 0 && t.y <= drawHeight) {
      handlePress(t.x, t.y);
      return false;
    }
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
