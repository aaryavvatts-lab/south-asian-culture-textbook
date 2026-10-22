// Kinship Explorer (Roots & Rivers, Chapter 13)
// CANVAS_HEIGHT = 960 (drawHeight 880 + controlHeight 80); iframe height 962px
// A small family tree centered on "You". Click or tap a relative to see what
// many families call that person in Hindi-Urdu, Bangla, Punjabi, Tamil and
// Sinhala. Every script spelling is logged in logs/13-factcheck.md.
// Teaching goal: many South Asian languages use different words for the
// father's side and the mother's side, where English just says "uncle".
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 880;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

let relSelect, sideCheckbox, nextButton;
let colorBySide = true;

const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const DAD_FILL = '#CDE9EC';   // light teal, father's side
const MOM_FILL = '#FCE3C4';   // light marigold, mother's side

// Each language entry: script (original script), say (respelling), note.
// HU = Hindi-Urdu (Hindi in Devanagari, Urdu in Nastaliq).
const relatives = [
  { id: 'dfa', label: "Dad's father", side: 'dad', english: 'grandfather',
    HU: ['दादा · دادا', 'DAA-daa', ''],
    BN: ['দাদা', 'DAA-daa', 'Common in Bangladesh. In West Bengal, dada often means elder brother; grandpa may be dadu.'],
    PA: ['ਦਾਦਾ', 'DAA-daa', ''],
    TA: ['தாத்தா', 'THAAT-thaa', 'The same word is used for both grandfathers.'],
    SI: ['සීයා', 'SEE-yaa', 'The same word is used for both grandfathers.'],
    insight: 'Hindi-Urdu, Bangla and Punjabi split grandparents by side. Tamil and Sinhala do not.' },
  { id: 'dmo', label: "Dad's mother", side: 'dad', english: 'grandmother',
    HU: ['दादी · دادی', 'DAA-dee', ''],
    BN: ['দাদী', 'DAA-dee', 'Common in Bangladesh; other families use other words.'],
    PA: ['ਦਾਦੀ', 'DAA-dee', ''],
    TA: ['பாட்டி', 'PAAT-tee', 'The same word is used for both grandmothers.'],
    SI: ['ආච්චි', 'AACH-chee', 'The same word is used for both grandmothers.'],
    insight: 'Dadi (Dad\'s mother) and Nani (Mom\'s mother) are two different words in Hindi-Urdu, Bangla and Punjabi.' },
  { id: 'deb', label: "Dad's older brother", side: 'dad', english: 'uncle',
    HU: ['ताऊ · تایا', 'TAA-oo · TAA-yaa', 'Hindi tau, Urdu taya.'],
    BN: ['চাচা · জেঠা', 'CHAA-chaa · JAY-thaa', 'Muslim families often say chacha or boro ("big") chacha; Hindu families often say jetha.'],
    PA: ['ਤਾਇਆ', 'TAA-ee-aa', ''],
    TA: ['பெரியப்பா', 'peh-ree-YAP-paa', 'Literally "big father".'],
    SI: ['ලොකු තාත්තා', 'LO-ku TAAT-taa', 'Literally "big father".'],
    insight: 'Many languages also mark age: Dad\'s older brother and Dad\'s younger brother get different words.' },
  { id: 'dyb', label: "Dad's younger brother", side: 'dad', english: 'uncle',
    HU: ['चाचा · چچا', 'CHAA-chaa · CHA-chaa', ''],
    BN: ['চাচা · কাকা', 'CHAA-chaa · KAA-kaa', 'Muslim families often say chacha; Hindu families often say kaka.'],
    PA: ['ਚਾਚਾ', 'CHAA-chaa', ''],
    TA: ['சித்தப்பா', 'CHIT-thap-paa', 'Literally "little father".'],
    SI: ['බාප්පා', 'BAAP-paa', ''],
    insight: 'Tamil and Sinhala treat Dad\'s brothers almost like extra fathers: "big father" and "little father".' },
  { id: 'dsi', label: "Dad's sister", side: 'dad', english: 'aunt',
    HU: ['बुआ · پھوپھی', 'BOO-aa · PHOO-phee', 'Many Urdu speakers also say phuppo.'],
    BN: ['ফুফু · পিসি', 'FOO-foo · PI-shee', 'Muslim families often say phuphu (fufu); Hindu families often say pishi.'],
    PA: ['ਭੂਆ', 'BHOO-aa', ''],
    TA: ['அத்தை', 'ATH-thai', ''],
    SI: ['නැන්දා', 'NAN-daa', ''],
    insight: 'Dad\'s sister has her own word in all five languages. English just says "aunt".' },
  { id: 'mfa', label: "Mom's father", side: 'mom', english: 'grandfather',
    HU: ['नाना · نانا', 'NAA-naa', ''],
    BN: ['নানা', 'NAA-naa', 'Muslim families often say nana; Hindu families often say dadu.'],
    PA: ['ਨਾਨਾ', 'NAA-naa', ''],
    TA: ['தாத்தா', 'THAAT-thaa', 'Same word as for Dad\'s father.'],
    SI: ['සීයා', 'SEE-yaa', 'Same word as for Dad\'s father.'],
    insight: 'Compare with Dad\'s father: dada on one side, nana on the other.' },
  { id: 'mmo', label: "Mom's mother", side: 'mom', english: 'grandmother',
    HU: ['नानी · نانی', 'NAA-nee', ''],
    BN: ['নানী · নানু', 'NAA-nee · NAA-noo', 'Nanu is an affectionate form. Hindu families often use other words.'],
    PA: ['ਨਾਨੀ', 'NAA-nee', ''],
    TA: ['பாட்டி', 'PAAT-tee', 'Same word as for Dad\'s mother.'],
    SI: ['ආච්චි', 'AACH-chee', 'Same word as for Dad\'s mother.'],
    insight: 'Zara calls her mother\'s mother Nanu. Nobody needs to ask "which grandma?"' },
  { id: 'mbr', label: "Mom's brother", side: 'mom', english: 'uncle',
    HU: ['मामा · ماموں', 'MAA-maa · MAA-moon', ''],
    BN: ['মামা', 'MAA-maa', ''],
    PA: ['ਮਾਮਾ', 'MAA-maa', ''],
    TA: ['மாமா', 'MAA-maa', 'Also used for the husband of Dad\'s sister.'],
    SI: ['මාමා', 'MAA-maa', 'Also used for a father-in-law.'],
    insight: 'Mama means Mom\'s brother across all five languages, never "mother".' },
  { id: 'msi', label: "Mom's sister", side: 'mom', english: 'aunt',
    HU: ['मौसी · خالہ', 'MOW-see · KHAA-laa', 'Hindi mausi, Urdu khala.'],
    BN: ['খালা · মাসি', 'KHAA-laa · MAA-shee', 'Muslim families often say khala; Hindu families often say mashi.'],
    PA: ['ਮਾਸੀ', 'MAA-see', ''],
    TA: ['பெரியம்மா · சித்தி', 'peh-ree-YAM-maa · CHIT-thee', 'Older sister: "big mother". Younger sister: chithi.'],
    SI: ['ලොකු අම්මා · පුංචි අම්මා', 'LO-ku AM-maa · PUN-chi AM-maa', 'Older sister: "big mother". Younger sister: "little mother".'],
    insight: 'In Tamil and Sinhala, Mom\'s sisters are "mothers", while Dad\'s sister is not.' }
];
const LANGS = [['HU', 'Hindi-Urdu'], ['BN', 'Bangla'], ['PA', 'Punjabi'], ['TA', 'Tamil'], ['SI', 'Sinhala']];
let selected = 2; // start on Dad's older brother

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  relSelect = createSelect();
  for (let i = 0; i < relatives.length; i++) relSelect.option(relatives[i].label, i);
  relSelect.selected(String(selected));
  relSelect.changed(() => { selected = int(relSelect.value()); });
  relSelect.style('font-size', '15px');

  nextButton = createButton('Next relative');
  nextButton.mousePressed(() => { selected = (selected + 1) % relatives.length; relSelect.selected(String(selected)); });
  nextButton.style('font-size', '15px');

  sideCheckbox = createCheckbox(" Color Dad's side and Mom's side", true);
  sideCheckbox.changed(() => { colorBySide = sideCheckbox.checked(); });
  sideCheckbox.style('font-size', '15px');

  placeControls();
  describe("A family tree centered on You, with Dad's side on the left and Mom's side on the right. Choosing a relative shows the word many families use for that person in Hindi-Urdu, Bangla, Punjabi, Tamil and Sinhala, next to the single English word, such as uncle. Notes mark where usage varies by family or region.");
}

function placeControls() {
  relSelect.position(10, drawHeight + 10);
  nextButton.position(canvasWidth < 420 ? 220 : 230, drawHeight + 10);
  sideCheckbox.position(10, drawHeight + 46);
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Kinship Explorer: Who Is "Uncle"?';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  const instr = 'Click a relative to see what many families call them in five languages.';
  text(textWidth(instr) > canvasWidth - 20 ? 'Tap a relative to see their name.' : instr, canvasWidth / 2, 38);

  layout();
  drawTree();
  drawPanel();
}

// ---------- layout ----------
let tx, ty, tw, th, px, py, pw, ph, wideMode;
function layout() {
  wideMode = canvasWidth >= 720;
  const top = 62;
  if (wideMode) {
    tx = margin; ty = top; tw = Math.floor(canvasWidth * 0.46); th = drawHeight - top - margin;
    px = tx + tw + margin; py = top; pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    tx = margin; ty = top; tw = canvasWidth - 2 * margin; th = 300;
    px = margin; py = ty + th + 8; pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin;
  }
}

// Chip positions for each relative, plus Dad, Mom and You.
function chipRects() {
  const colW = tw / 2;
  const chipW = Math.min(colW - 16, 190);
  const chipH = wideMode ? 40 : 28;
  const gap = wideMode ? 28 : 6;
  const headerY = ty + (wideMode ? 14 : 8);
  const startY = headerY + (wideMode ? 34 : 26);
  const rects = [];
  let dadRow = 0, momRow = 0;
  for (const r of relatives) {
    const isDad = r.side === 'dad';
    const row = isDad ? dadRow++ : momRow++;
    const cx = tx + (isDad ? colW / 2 : colW * 1.5);
    rects.push({ x: cx - chipW / 2, y: startY + row * (chipH + gap), w: chipW, h: chipH });
  }
  const lastY = startY + 5 * (chipH + gap);
  const parentY = lastY + (wideMode ? 70 : 6);
  const pW = Math.min(chipW, 110);
  const dad = { x: tx + colW / 2 - pW / 2, y: parentY, w: pW, h: chipH };
  const mom = { x: tx + colW * 1.5 - pW / 2, y: parentY, w: pW, h: chipH };
  const you = { x: tx + tw / 2 - pW / 2, y: parentY + chipH + (wideMode ? 90 : 16), w: pW, h: chipH };
  return { rects, dad, mom, you, headerY, colW };
}

function drawTree() {
  const L = chipRects();
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(tx, ty, tw, th, 8);

  // column headers
  noStroke();
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(15);
  fill(colorBySide ? TEAL : NAVY);
  text("Dad's side", tx + L.colW / 2, L.headerY);
  fill(colorBySide ? SAFFRON : NAVY);
  text("Mom's side", tx + L.colW * 1.5, L.headerY);
  textStyle(NORMAL);

  // connecting lines: each column to its parent, parents to You
  stroke('#9AA3B5');
  strokeWeight(2);
  const lineX1 = tx + L.colW / 2, lineX2 = tx + L.colW * 1.5;
  line(lineX1, L.rects[0].y + L.rects[0].h, lineX1, L.dad.y);
  line(lineX2, L.rects[5].y + L.rects[5].h, lineX2, L.mom.y);
  const midY = (L.dad.y + L.dad.h + L.you.y) / 2;
  line(lineX1, L.dad.y + L.dad.h, lineX1, midY);
  line(lineX2, L.mom.y + L.mom.h, lineX2, midY);
  line(lineX1, midY, lineX2, midY);
  line(tx + tw / 2, midY, tx + tw / 2, L.you.y);

  // relative chips
  for (let i = 0; i < relatives.length; i++) {
    const r = L.rects[i];
    const rel = relatives[i];
    const base = colorBySide ? (rel.side === 'dad' ? DAD_FILL : MOM_FILL) : '#E8EAF2';
    if (i === selected) { stroke(SAFFRON); strokeWeight(4); }
    else { stroke('white'); strokeWeight(1); }
    fill(base);
    rect(r.x, r.y, r.w, r.h, 8);
    noStroke();
    fill(NAVY);
    textAlign(CENTER, CENTER);
    textSize(14);
    if (i === selected) textStyle(BOLD);
    text(rel.label, r.x + r.w / 2, r.y + r.h / 2 + 1);
    textStyle(NORMAL);
  }
  // Dad, Mom, You
  const fixed = [[L.dad, 'Dad', DAD_FILL], [L.mom, 'Mom', MOM_FILL], [L.you, 'You', GOLD]];
  for (const f of fixed) {
    stroke(NAVY);
    strokeWeight(1);
    fill(colorBySide || f[1] === 'You' ? f[2] : '#E8EAF2');
    rect(f[0].x, f[0].y, f[0].w, f[0].h, 14);
    noStroke();
    fill(NAVY);
    textStyle(BOLD);
    textSize(15);
    textAlign(CENTER, CENTER);
    text(f[1], f[0].x + f[0].w / 2, f[0].y + f[0].h / 2 + 1);
    textStyle(NORMAL);
  }
}

function drawPanel() {
  const rel = relatives[selected];
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 8);
  noStroke();
  const pad = 12;
  const w = pw - 2 * pad;
  let y = py + pad;
  textAlign(LEFT, TOP);

  textStyle(BOLD);
  textSize(wideMode ? 21 : 19);
  fill(rel.side === 'dad' ? TEAL : SAFFRON);
  text(rel.label, px + pad, y);
  y += wideMode ? 30 : 27;
  textSize(15);
  fill(NAVY);
  text('In English: just "' + rel.english + '"', px + pad, y);
  textStyle(NORMAL);
  y += 26;

  for (const L of LANGS) {
    const d = rel[L[0]];
    // language name, then the script (same line on phones, own line on wide screens)
    textStyle(BOLD);
    textSize(14);
    fill(LEAF);
    text(L[1], px + pad, wideMode ? y : y + 5);
    const labelW = wideMode ? 0 : 92;
    textStyle(NORMAL);
    if (wideMode) y += 19;
    let scriptSize = wideMode ? 21 : 19;
    textSize(scriptSize);
    fill('#111111');
    while (textWidth(d[0]) > w - labelW && scriptSize > 15) { scriptSize--; textSize(scriptSize); }
    text(d[0], px + pad + labelW, y);
    y += scriptSize + 9;
    // respelling
    textSize(14);
    fill(NAVY);
    for (const line of wrapLines('say: ' + d[1], w)) { text(line, px + pad, y); y += 18; }
    if (d[2] !== '') {
      fill('#555555');
      for (const line of wrapLines(d[2], w)) { text(line, px + pad, y); y += 18; }
    }
    y += 7;
  }

  // insight at the bottom
  textStyle(BOLD);
  textSize(14);
  fill(SAFFRON);
  const lines = wrapLines(rel.insight, w);
  const iy = Math.max(y + 2, py + ph - pad - lines.length * 18 - 20);
  for (let k = 0; k < lines.length; k++) text(lines[k], px + pad, iy + k * 18);
  textStyle(NORMAL);
  fill('#555555');
  text('Words vary by family and region.', px + pad, iy + lines.length * 18 + 2);
}

// ---------- shared ----------
function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const wd of words) {
    const t = cur === '' ? wd : cur + ' ' + wd;
    if (textWidth(t) > maxW && cur !== '') { lines.push(cur); cur = wd; }
    else cur = t;
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function pick(x, y) {
  layout();
  const L = chipRects();
  for (let i = 0; i < L.rects.length; i++) {
    const r = L.rects[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
  }
  return -1;
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  const i = pick(mouseX, mouseY);
  if (i >= 0) { selected = i; relSelect.selected(String(i)); }
}

function touchStarted() {
  if (touches.length > 0) {
    const t = touches[0];
    if (t.y >= 0 && t.y <= drawHeight) {
      const i = pick(t.x, t.y);
      if (i >= 0) { selected = i; relSelect.selected(String(i)); return false; }
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
