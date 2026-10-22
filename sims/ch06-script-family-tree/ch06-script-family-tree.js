// Script Family Tree (Roots & Rivers, Chapter 6)
// CANVAS_HEIGHT = 780 (drawHeight 700 + controlHeight 80); iframe height 782px
// A simplified family tree of South Asian scripts. One root is Brahmi (3rd
// century BCE), whose northern and southern branches lead to Devanagari,
// Bengali-Assamese, Gurmukhi, Gujarati, Odia, Tibetan, Kannada, Telugu, Tamil,
// Malayalam and Sinhala. A second root is Aramaic, which leads to Kharoshthi
// and (through Arabic) to the Perso-Arabic script; Thaana borrowed its letter
// shapes from numerals. Click a script to see how it writes ka, ki, ku and a
// bare k, and which languages use it. All glyphs are real Unicode characters
// (code points checked against the Unicode Character Database).
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 700;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let scriptSelect, soundSelect, debateCheckbox;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

// Fonts per script (loaded in main.html from Google Fonts; system fonts are the fallback)
const FONTS = {
  brahmi: '"Noto Sans Brahmi"', khar: '"Noto Sans Kharoshthi"', aram: '"Noto Sans Imperial Aramaic"',
  deva: '"Noto Sans Devanagari"', beng: '"Noto Sans Bengali"', guru: '"Noto Sans Gurmukhi"',
  gujr: '"Noto Sans Gujarati"', orya: '"Noto Sans Oriya"', taml: '"Noto Sans Tamil"',
  telu: '"Noto Sans Telugu"', knda: '"Noto Sans Kannada"', mlym: '"Noto Sans Malayalam"',
  sinh: '"Noto Sans Sinhala"', tibt: '"Noto Serif Tibetan"', urdu: '"Noto Nastaliq Urdu"',
  arab: '"Noto Naskh Arabic"', thaa: '"Noto Sans Thaana"'
};

// Sounds shown on the tree
const SOUNDS = ['ka', 'ki', 'ku', 'k'];
const SOUND_LABELS = { ka: 'ka', ki: 'ki', ku: 'ku', k: 'k (no vowel)' };
let sound = 'ka';

// Tree nodes. col 0-3 (3 = modern scripts), row = vertical slot.
// fam: 'b' = Brahmi family, 'a' = Aramaic family.
// g = glyphs for ka, ki, ku, k (bare consonant with a vowel-killer mark) where the script has them.
const nodes = [
  // Brahmi family
  { id: 'brahmi', name: 'Brahmi', short: 'Brahmi', col: 0, row: 5.6, fam: 'b', font: 'brahmi', historic: true,
    g: { ka: '\u{11013}', ki: '\u{11013}\u{1103A}', ku: '\u{11013}\u{1103C}', k: '\u{11013}\u{11046}' },
    when: 'In use by the 3rd century BCE',
    langs: 'Prakrits (everyday languages of the time), and an early form of Tamil',
    note: 'The best-known early examples are the rock edicts of the emperor Ashoka (mid-3rd century BCE). James Prinsep worked out how to read it again in the 1830s. Dozens of modern scripts descend from it.' },
  { id: 'gupta', name: 'Gupta script', short: 'Gupta', col: 1, row: 2.6, fam: 'b', historic: true, parent: 'brahmi',
    when: 'About the 4th to 6th centuries CE',
    langs: 'Sanskrit and Prakrits in northern India',
    note: 'A northern branch of Brahmi, named after the Gupta Empire. Its descendants spread across the north and up into the Himalaya.' },
  { id: 'sharada', name: 'Sharada', short: 'Sharada', col: 2, row: 0, fam: 'b', historic: true, parent: 'gupta',
    when: 'Medieval northwest, especially Kashmir',
    langs: 'Kashmiri and Sanskrit in the past',
    note: 'A northwestern script. Gurmukhi is its main living descendant.' },
  { id: 'nagari', name: 'Nagari', short: 'Nagari', col: 2, row: 1.5, fam: 'b', historic: true, parent: 'gupta',
    when: 'Early medieval northern India',
    langs: 'Sanskrit and early regional languages',
    note: 'The early form that grew into Devanagari.' },
  { id: 'gaudi', name: 'Gaudi (eastern)', short: 'Gaudi', col: 2, row: 3.5, fam: 'b', historic: true, parent: 'gupta',
    when: 'Medieval eastern India',
    langs: 'Early Bengali, Assamese and Odia',
    note: 'An eastern script, sometimes called Proto-Bengali. Bengali-Assamese and Odia grew out of it.' },
  { id: 'kadamba', name: 'Kadamba', short: 'Kadamba', col: 1, row: 6.5, fam: 'b', historic: true, parent: 'brahmi',
    when: 'About the 4th to 6th centuries CE',
    langs: 'Early Kannada, Sanskrit and Prakrit in the Deccan',
    note: 'A southern branch of Brahmi, named after the Kadamba kings of what is now Karnataka. Kannada and Telugu scripts grew from it.' },
  { id: 'pallava', name: 'Pallava', short: 'Pallava', col: 1, row: 9, fam: 'b', historic: true, parent: 'brahmi',
    when: 'Early medieval south India',
    langs: 'Tamil, Sanskrit and later many Southeast Asian languages',
    note: 'A southern script named after the Pallava kings of what is now Tamil Nadu. It also traveled across the sea to Southeast Asia.' },

  // modern Brahmi-family scripts
  { id: 'gurmukhi', name: 'Gurmukhi', short: 'Gurmukhi', col: 3, row: 0, fam: 'b', font: 'guru', parent: 'sharada',
    g: { ka: '\u{A15}', ki: '\u{A15}\u{A3F}', ku: '\u{A15}\u{A41}', k: '\u{A15}\u{A4D}' },
    when: 'Standardized in the 16th century',
    langs: 'Punjabi in India; Sikh scripture',
    note: 'Its standard form is popularly credited to Guru Angad, the second Sikh Guru. In Pakistan, Punjabi is usually written in Shahmukhi, a Perso-Arabic script. The virama shown for a bare k exists, but everyday Punjabi spelling almost never uses it.' },
  { id: 'devanagari', name: 'Devanagari', short: 'Devanagari', col: 3, row: 1, fam: 'b', font: 'deva', parent: 'nagari',
    g: { ka: '\u{915}', ki: '\u{915}\u{93F}', ku: '\u{915}\u{941}', k: '\u{915}\u{94D}' },
    when: 'Modern; grew out of Nagari in medieval times',
    langs: 'Hindi, Marathi, Nepali, Sanskrit, Maithili and more',
    note: 'Most letters hang from a line along the top. Notice that the "i" mark is written BEFORE the consonant but said after it.' },
  { id: 'gujarati', name: 'Gujarati', short: 'Gujarati', col: 3, row: 2, fam: 'b', font: 'gujr', parent: 'nagari',
    g: { ka: '\u{A95}', ki: '\u{A95}\u{ABF}', ku: '\u{A95}\u{AC1}', k: '\u{A95}\u{ACD}' },
    when: 'Modern',
    langs: 'Gujarati',
    note: 'A close cousin of Devanagari that drops the line along the top of the letters.' },
  { id: 'bengali', name: 'Bengali-Assamese', short: 'Bengali', col: 3, row: 3, fam: 'b', font: 'beng', parent: 'gaudi',
    g: { ka: '\u{995}', ki: '\u{995}\u{9BF}', ku: '\u{995}\u{9C1}', k: '\u{995}\u{9CD}' },
    when: 'Modern',
    langs: 'Bangla (Bengali) in Bangladesh and India; Assamese',
    note: 'Bangla and Assamese share this script, with a few different letters. It is the script of Bangladesh\'s state language.' },
  { id: 'odia', name: 'Odia', short: 'Odia', col: 3, row: 4, fam: 'b', font: 'orya', parent: 'gaudi',
    g: { ka: '\u{B15}', ki: '\u{B15}\u{B3F}', ku: '\u{B15}\u{B41}', k: '\u{B15}\u{B4D}' },
    when: 'Modern',
    langs: 'Odia (Odisha, India)',
    note: 'Famous for the rounded, umbrella-like curves on top of its letters.' },
  { id: 'tibetan', name: 'Tibetan', short: 'Tibetan', col: 3, row: 5, fam: 'b', font: 'tibt', parent: 'gupta',
    g: { ka: '\u{F40}', ki: '\u{F40}\u{F72}', ku: '\u{F40}\u{F74}', k: '' },
    when: 'Tradition dates it to the 7th century CE',
    langs: 'Dzongkha (Bhutan\'s national language), Tibetan, Ladakhi, Sikkimese and more',
    note: 'Tradition says Thonmi Sambhota created it for King Songtsen Gampo, using a Gupta-family script as the model. A bare final k is shown by a letter\'s position in a syllable, so there is no vowel-killer here.' },
  { id: 'kannada', name: 'Kannada', short: 'Kannada', col: 3, row: 6, fam: 'b', font: 'knda', parent: 'kadamba',
    g: { ka: '\u{C95}', ki: '\u{C95}\u{CBF}', ku: '\u{C95}\u{CC1}', k: '\u{C95}\u{CCD}' },
    when: 'Modern',
    langs: 'Kannada (Karnataka, India)',
    note: 'Kannada and Telugu scripts are close cousins; many letters look alike.' },
  { id: 'telugu', name: 'Telugu', short: 'Telugu', col: 3, row: 7, fam: 'b', font: 'telu', parent: 'kadamba',
    g: { ka: '\u{C15}', ki: '\u{C15}\u{C3F}', ku: '\u{C15}\u{C41}', k: '\u{C15}\u{C4D}' },
    when: 'Modern',
    langs: 'Telugu (Andhra Pradesh and Telangana, India)',
    note: 'Telugu is a Dravidian language, but its script still descends from Brahmi.' },
  { id: 'tamil', name: 'Tamil', short: 'Tamil', col: 3, row: 8, fam: 'b', font: 'taml', parent: 'pallava',
    g: { ka: '\u{B95}', ki: '\u{B95}\u{BBF}', ku: '\u{B95}\u{BC1}', k: '\u{B95}\u{BCD}' },
    when: 'Modern',
    langs: 'Tamil in India, Sri Lanka, Singapore and beyond',
    note: 'Tamil uses fewer consonant letters than most Indian scripts. The dot on top of the bare k is called the pulli.' },
  { id: 'malayalam', name: 'Malayalam', short: 'Malayalam', col: 3, row: 9, fam: 'b', font: 'mlym', parent: 'pallava',
    g: { ka: '\u{D15}', ki: '\u{D15}\u{D3F}', ku: '\u{D15}\u{D41}', k: '\u{D15}\u{D4D}' },
    when: 'Modern',
    langs: 'Malayalam (Kerala, India)',
    note: 'Grew from a southern script used to write Sanskrit, so it has letters for many Sanskrit sounds.' },
  { id: 'sinhala', name: 'Sinhala', short: 'Sinhala', col: 3, row: 10, fam: 'b', font: 'sinh', parent: 'pallava',
    g: { ka: '\u{D9A}', ki: '\u{D9A}\u{DD2}', ku: '\u{D9A}\u{DD4}', k: '\u{D9A}\u{DCA}' },
    when: 'Brahmi is thought to have reached Sri Lanka around the 3rd century BCE',
    langs: 'Sinhala in Sri Lanka; also Pali',
    note: 'Descends from Brahmi, with strong influence from south Indian scripts over the centuries. The Sinhala language is Indo-Aryan, but its letters look round like southern scripts.' },

  // Aramaic family
  { id: 'aramaic', name: 'Aramaic', short: 'Aramaic', col: 0, row: 11.9, fam: 'a', font: 'aram', historic: true,
    g: { ka: '\u{1084A}' },
    when: 'Used by the Persian Empire\'s government',
    langs: 'Aramaic, the government language of the Persian Empire',
    note: 'An abjad: it wrote consonants only. Kharoshthi grew from it, and through later scripts it is also an ancestor of Arabic.' },
  { id: 'kharosthi', name: 'Kharoshthi', short: 'Kharoshthi', col: 3, row: 11, fam: 'a', font: 'khar', historic: true, parent: 'aramaic',
    g: { ka: '\u{10A10}', ki: '\u{10A10}\u{10A01}', ku: '\u{10A10}\u{10A02}', k: '\u{10A10}\u{10A3F}' },
    when: 'From about the 4th or 3rd century BCE; it fell out of use between the 3rd and 5th centuries CE',
    langs: 'Gandhari, in Gandhara (today\'s northern Pakistan and eastern Afghanistan)',
    note: 'Written right to left. Some of Ashoka\'s edicts, at Shahbazgarhi and Mansehra in Pakistan, use it. It borrowed Aramaic shapes but added vowel marks, like Brahmi.' },
  { id: 'arabic', name: 'Arabic script', short: 'Arabic', col: 2, row: 12.5, fam: 'a', font: 'arab', historic: false, parent: 'aramaic',
    g: { ka: '\u{643}' },
    when: 'Reached South Asia with Persian and Arabic speakers, traders and rulers',
    langs: 'Arabic; adapted for Persian, then for many South Asian languages',
    note: 'Persian added extra letters, and South Asian languages added more for sounds Arabic lacks.' },
  { id: 'persoarabic', name: 'Perso-Arabic', short: 'Perso-Arabic', col: 3, row: 12, fam: 'a', font: 'urdu', parent: 'arabic', rtl: true,
    g: { ka: '\u{6A9}\u{64E}', ki: '\u{6A9}\u{650}', ku: '\u{6A9}\u{64F}', k: '\u{6A9}\u{652}' },
    when: 'Modern',
    langs: 'Urdu, Pashto, Dari, Sindhi, Balochi, Kashmiri, Shahmukhi Punjabi',
    note: 'Written right to left. Short vowel marks are usually left out, so readers fill them in. Urdu uses the flowing Nastaliq style. Sindhi writes k as \u{6AA} instead.' },
  { id: 'thaana', name: 'Thaana', short: 'Thaana', col: 3, row: 13, fam: 'a', font: 'thaa', parent: 'arabic', dashedParent: true, rtl: true,
    g: { ka: '\u{786}\u{7A6}', ki: '\u{786}\u{7A8}', ku: '\u{786}\u{7AA}', k: '\u{786}\u{7B0}' },
    when: 'Oldest surviving writing dated 1599',
    langs: 'Dhivehi (the Maldives)',
    note: 'Written right to left. Its first nine letters come from Arabic numerals and the next nine from old Dhivehi numerals. Every vowel is written as a mark (fili), so it is not a true abugida.' }
];
const ROWS = 14;
let selected = 'bengali';
let boxes = {}; // hit boxes, recalculated each frame

// layout, recalculated each frame
let tx, ty, tw, th, px, py, pw, ph, wide;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  frameRate(15);

  scriptSelect = createSelect();
  for (let n of nodes) scriptSelect.option(n.name, n.id);
  scriptSelect.selected(selected);
  scriptSelect.changed(() => { selected = scriptSelect.value(); });

  soundSelect = createSelect();
  for (let s of SOUNDS) soundSelect.option('Show ' + SOUND_LABELS[s], s);
  soundSelect.selected(sound);
  soundSelect.changed(() => { sound = soundSelect.value(); });

  debateCheckbox = createCheckbox(' Show debated link (Aramaic to Brahmi)', false);
  positionControls();

  // ask the browser to load each web font (canvas text does not trigger it)
  if (document.fonts && document.fonts.load) {
    for (let n of nodes) {
      if (n.font && n.g) document.fonts.load('24px ' + FONTS[n.font], n.g.ka).catch(() => {});
    }
  }

  describe('A simplified family tree of South Asian scripts. Brahmi branches through the Gupta, Sharada, Nagari, Gaudi, Kadamba and Pallava scripts to Gurmukhi, Devanagari, Gujarati, Bengali-Assamese, Odia, Tibetan, Kannada, Telugu, Tamil, Malayalam and Sinhala. A second root, Aramaic, leads to Kharoshthi and, through Arabic, to the Perso-Arabic script and Thaana. Each modern script shows how it writes the syllable ka. Selecting a script shows ka, ki, ku and a bare k in that script, and the languages that use it.');
}

function positionControls() {
  scriptSelect.position(10, drawHeight + 10);
  let label;
  if (canvasWidth >= 560) {
    soundSelect.position(200, drawHeight + 10);
    debateCheckbox.position(10, drawHeight + 46);
    label = ' Show debated link (Aramaic to Brahmi)';
  } else {
    soundSelect.position(10, drawHeight + 44);
    debateCheckbox.position(150, drawHeight + 44);
    label = canvasWidth < 430 ? ' Debated link' : ' Show debated link';
  }
  // change only the label text, keeping the checkbox input itself
  const span = debateCheckbox.elt.querySelector('span');
  if (span) span.textContent = label;
}

function computeLayout() {
  wide = canvasWidth >= 700;
  const top = 68;
  if (wide) {
    tx = margin; ty = top;
    tw = Math.floor(canvasWidth * 0.58) - margin;
    th = drawHeight - top - 34;
    px = tx + tw + margin; py = top;
    pw = canvasWidth - px - margin; ph = drawHeight - top - 34;
  } else {
    tx = margin; ty = top;
    tw = canvasWidth - 2 * margin;
    th = 380;
    px = margin; py = ty + th + 6;
    pw = canvasWidth - 2 * margin; ph = drawHeight - py - 28;
  }
}

function colX(c) {
  // left edge of each column as a share of the tree width
  const lefts = [0, 0.21, 0.41, 0.60];
  return tx + lefts[c] * tw;
}
function colW(c) {
  const widths = [0.18, 0.18, 0.17, 0.40];
  return widths[c] * tw;
}
function rowY(r) {
  return ty + 8 + (r + 0.5) * ((th - 16) / ROWS);
}

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

  drawTitle();
  drawTree();
  drawPanel();

  // caption inside the drawing area
  noStroke();
  fill('#333333');
  textSize(14);
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  let cap = 'Simplified tree. Scholars draw some links differently.';
  if (textWidth(cap) > canvasWidth - 20) cap = 'Simplified tree; some links are debated.';
  text(cap, canvasWidth / 2, drawHeight - 24);
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Script Family Tree: South Asia';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Click a script to see how it writes ka, ki, ku and k. Follow the lines back to the roots.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Tap a script. Follow the lines to its roots.';
  text(instr, canvasWidth / 2, 40);
}

function nodeById(id) {
  return nodes.find(n => n.id === id);
}

function nodeBox(n) {
  const h = Math.min(30, (th - 16) / ROWS - 3);
  return { x: colX(n.col), y: rowY(n.row) - h / 2, w: colW(n.col), h: h };
}

function setGlyphFont(n, size) {
  textSize(size);
  drawingContext.font = 'normal ' + size + 'px ' + FONTS[n.font] + ', sans-serif';
}

function drawTree() {
  // soft background for the tree
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 140);
  rect(tx, ty, tw, th, 6);

  // links
  for (let n of nodes) {
    if (!n.parent) continue;
    const p = nodeById(n.parent);
    const a = nodeBox(p), b = nodeBox(n);
    const x1 = a.x + a.w, y1 = a.y + a.h / 2;
    const x2 = b.x, y2 = b.y + b.h / 2;
    // the vertical 'bus' sits just right of the parent, so links that skip a column still read as siblings
    const mxp = x1 + (colX(p.col + 1) - x1) * 0.45;
    const onPath = isAncestorOrSelf(n.id, selected);
    stroke(n.fam === 'b' ? SAFFRON : TEAL);
    strokeWeight(onPath ? 4 : 2);
    if (n.dashedParent) drawingContext.setLineDash([5, 5]);
    noFill();
    line(x1, y1, mxp, y1);
    line(mxp, y1, mxp, y2);
    line(mxp, y2, x2, y2);
    drawingContext.setLineDash([]);
  }

  // debated link between Aramaic and Brahmi
  if (debateCheckbox.checked()) {
    const a = nodeBox(nodeById('aramaic')), b = nodeBox(nodeById('brahmi'));
    stroke('#7A5A10');
    strokeWeight(2);
    drawingContext.setLineDash([4, 6]);
    const x = a.x + a.w * 0.5;
    line(x, a.y, x, b.y + b.h);
    drawingContext.setLineDash([]);
    noStroke();
    fill('#7A5A10');
    textSize(14);
    textStyle(ITALIC);
    textAlign(LEFT, CENTER);
    push();
    translate(x + 5, (a.y + b.y + b.h) / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, TOP);
    text('debated', 0, 0);
    pop();
    textStyle(NORMAL);
  }

  // nodes
  boxes = {};
  for (let n of nodes) {
    const b = nodeBox(n);
    boxes[n.id] = b;
    const isSel = n.id === selected;
    if (isSel) { stroke(NAVY); strokeWeight(3); }
    else { stroke(n.fam === 'b' ? '#E9B48A' : '#8CC7CC'); strokeWeight(1.5); }
    if (n.col < 3) fill(n.historic ? '#F3EBDD' : 'white');
    else fill(n.historic ? '#EDEDED' : (n.fam === 'b' ? '#FFE7C7' : '#D8F0F2'));
    rect(b.x, b.y, b.w, b.h, 6);

    noStroke();
    textAlign(LEFT, CENTER);
    const label = wide ? n.name : n.short;
    if (n.col === 3) {
      // glyph on the left of a modern script node
      const gs = n.g && n.g[sound] !== undefined ? n.g[sound] : '';
      const glyphW = Math.min(46, b.w * 0.34);
      if (gs !== '') {
        fill(NAVY);
        setGlyphFont(n, Math.min(20, b.h - 8));
        textAlign(CENTER, CENTER);
        // Nastaliq letters sit low, so lift them a little
        const lift = n.font === 'urdu' ? b.h * 0.18 : 0;
        text(gs, b.x + glyphW / 2 + 2, b.y + b.h / 2 - lift);
      } else {
        fill('#888888');
        textSize(14);
        textAlign(CENTER, CENTER);
        text('none', b.x + glyphW / 2 + 2, b.y + b.h / 2);
      }
      fill(n.historic ? '#555555' : '#222222');
      textStyle(n.historic ? ITALIC : NORMAL);
      textSize(14);
      textAlign(LEFT, CENTER);
      let lab = label;
      while (textWidth(lab) > b.w - glyphW - 8 && lab.length > 4) lab = lab.slice(0, -2) + '.';
      text(lab, b.x + glyphW + 4, b.y + b.h / 2);
      textStyle(NORMAL);
    } else {
      fill(n.fam === 'b' ? '#7A3410' : '#0B5A61');
      textStyle(n.col === 0 ? BOLD : ITALIC);
      textSize(14);
      textAlign(CENTER, CENTER);
      let lab = n.short;
      while (textWidth(lab) > b.w - 4 && lab.length > 4) lab = lab.slice(0, -2) + '.';
      text(lab, b.x + b.w / 2, b.y + b.h / 2);
      textStyle(NORMAL);
    }
  }
}

function isAncestorOrSelf(id, target) {
  // true if node `id` lies on the path from the root to `target`
  let cur = nodeById(target);
  while (cur) {
    if (cur.id === id) return true;
    cur = cur.parent ? nodeById(cur.parent) : null;
  }
  return false;
}

function drawPanel() {
  const n = nodeById(selected);
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  noStroke();

  const pad = 10;
  let y = py + pad;
  const tw2 = pw - 2 * pad;

  fill(SAFFRON);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(wide ? 22 : 18);
  text(n.name, px + pad, y);
  y += wide ? 30 : 24;

  // glyph row
  if (n.g) {
    const keys = n.g.ki !== undefined ? SOUNDS : ['ka'];
    const cellW = Math.min(wide ? 66 : 70, tw2 / keys.length);
    const gSize = wide ? 34 : 26;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const cx = px + pad + cellW * i + cellW / 2;
      const isCur = k === sound;
      fill(isCur ? '#FFE7C7' : '#F6F6F6');
      rect(cx - cellW / 2 + 2, y, cellW - 4, gSize + 30, 6);
      fill(NAVY);
      const gs = n.g[k];
      if (gs) {
        setGlyphFont(n, gSize);
        textAlign(CENTER, CENTER);
        const lift = n.font === 'urdu' ? gSize * 0.2 : 0;
        text(gs, cx, y + gSize / 2 + 6 - lift);
      } else {
        textSize(14);
        textAlign(CENTER, CENTER);
        fill('#888888');
        text('none', cx, y + gSize / 2 + 6);
      }
      fill('#333333');
      textSize(14);
      textStyle(NORMAL);
      textAlign(CENTER, TOP);
      text(k, cx, y + gSize + 12);
    }
    y += gSize + 36;
  } else {
    fill('#555555');
    textSize(14);
    textStyle(ITALIC);
    textAlign(LEFT, TOP);
    text('A historic stage between scripts.', px + pad, y);
    textStyle(NORMAL);
    y += 22;
  }

  const bodySize = wide ? 15 : 14;
  const lead = wide ? 20 : 17;
  textSize(bodySize);
  const rowsData = [['When: ', n.when], ['Used for: ', n.langs], ['', n.note]];
  for (let r of rowsData) {
    const lines = wrapLines(r[0] + r[1], tw2);
    for (let k = 0; k < lines.length; k++) {
      if (y + lead > py + ph - 4) break;
      if (k === 0 && r[0] !== '') {
        textStyle(BOLD);
        fill(NAVY);
        textAlign(LEFT, TOP);
        text(r[0], px + pad, y);
        const lw = textWidth(r[0]);
        textStyle(NORMAL);
        fill('#222222');
        text(lines[0].substring(r[0].length), px + pad + lw, y);
      } else {
        textStyle(NORMAL);
        fill(r[0] === '' ? '#444444' : '#222222');
        textAlign(LEFT, TOP);
        text(lines[k], px + pad, y);
      }
      y += lead;
    }
    y += 4;
  }
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

function pickAt(x, y) {
  for (let id in boxes) {
    const b = boxes[id];
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
      selected = id;
      scriptSelect.selected(id);
      return true;
    }
  }
  return false;
}

function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0) return;
  pickAt(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    const t = touches[0];
    if (t.y >= 0 && t.y <= drawHeight && pickAt(t.x, t.y)) return false;
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
