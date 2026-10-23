// India Explorer (Roots & Rivers, Chapter 17)
// CANVAS_HEIGHT = 840 (drawHeight 760 + controlHeight 80); iframe height 842px
// A tile cartogram (NOT a traced map): one equal-sized tile for each of India's
// 28 states and 8 union territories, placed roughly where it sits in the country.
// Color the tiles by informal region or by the language family of each
// place's main official language(s). Click or tap a tile for its capital and
// official language(s).
// List and capitals: National Portal of India, "India State/UTs & Districts"
// (https://www.india.gov.in/explore-india/facts-of-india/states-ut-districts),
// checked 22 October 2026: 28 states and 8 union territories.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 760;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let colorSelect, utCheckbox;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

// Language families (of each place's main official language or languages)
const FAMILY = {
  IA: { name: 'Indo-Aryan', col: MARIGOLD },
  DR: { name: 'Dravidian', col: TEAL },
  TB: { name: 'Tibeto-Burman', col: '#7B4FA0' },
  MX: { name: 'Mixed families', col: '#9A9A9A' }
};
// Informal regions (groupings vary from source to source)
const REGION = {
  N: { name: 'North', col: '#3E6FB0' },
  NE: { name: 'Northeast', col: LEAF },
  E: { name: 'East', col: GOLD },
  W: { name: 'West', col: SAFFRON },
  C: { name: 'Central', col: '#A0522D' },
  S: { name: 'South', col: TEAL }
};

// c, r = tile column and row in a schematic grid (not to scale)
// ut = union territory; fam = language family; reg = informal region
const tiles = [
  { a: 'JK', n: 'Jammu and Kashmir', c: 1, r: 0, ut: true, cap: 'Srinagar (summer), Jammu (winter)', lang: 'Kashmiri, Dogri, Urdu, Hindi, English', fam: 'IA', reg: 'N',
    note: 'A union territory since 2019. Part of the wider Kashmir region, which is disputed.' },
  { a: 'LA', n: 'Ladakh', c: 2, r: 0, ut: true, cap: 'Leh', lang: 'Bhoti, Purgi, Urdu, Hindi, English (2025 regulation)', fam: 'MX', reg: 'N',
    note: 'A high, dry union territory since 2019. Bhoti and Purgi are Tibeto-Burman; Urdu and Hindi are Indo-Aryan.' },
  { a: 'PB', n: 'Punjab', c: 0, r: 1, ut: false, cap: 'Chandigarh', lang: 'Punjabi', fam: 'IA', reg: 'N',
    note: 'Indian Punjab has a Sikh majority. Its capital, Chandigarh, is shared with Haryana.' },
  { a: 'CH', n: 'Chandigarh', c: 1, r: 1, ut: true, cap: 'Chandigarh', lang: 'English (Hindi and Punjabi widely spoken)', fam: 'IA', reg: 'N',
    note: 'A planned city that is its own union territory and the capital of two states.' },
  { a: 'HP', n: 'Himachal Pradesh', c: 2, r: 1, ut: false, cap: 'Shimla', lang: 'Hindi; Sanskrit (second official)', fam: 'IA', reg: 'N',
    note: 'A Himalayan state of apple orchards and hill towns.' },
  { a: 'RJ', n: 'Rajasthan', c: 0, r: 2, ut: false, cap: 'Jaipur', lang: 'Hindi', fam: 'IA', reg: 'N',
    note: 'The largest state by area, home to much of the Thar Desert.' },
  { a: 'HR', n: 'Haryana', c: 1, r: 2, ut: false, cap: 'Chandigarh', lang: 'Hindi; English and Punjabi (additional)', fam: 'IA', reg: 'N',
    note: 'Wraps around three sides of Delhi.' },
  { a: 'DL', n: 'Delhi', c: 2, r: 2, ut: true, cap: 'Delhi (New Delhi is India\'s capital)', lang: 'Hindi, English; Punjabi and Urdu (additional)', fam: 'IA', reg: 'N',
    note: 'The National Capital Territory. New Delhi, the seat of government, lies inside it.' },
  { a: 'UK', n: 'Uttarakhand', c: 3, r: 2, ut: false, cap: 'Dehradun', lang: 'Hindi; Sanskrit (second official)', fam: 'IA', reg: 'N',
    note: 'Formed in 2000 from the hill districts of Uttar Pradesh. The Ganga rises here.' },
  { a: 'SK', n: 'Sikkim', c: 5, r: 2, ut: false, cap: 'Gangtok', lang: 'Nepali, English, and several more', fam: 'MX', reg: 'NE',
    note: 'A small Himalayan state. Nepali is Indo-Aryan; Bhutia, Lepcha and Limbu are Tibeto-Burman.' },
  { a: 'AR', n: 'Arunachal Pradesh', c: 8, r: 2, ut: false, cap: 'Itanagar', lang: 'English (many local Tibeto-Burman languages)', fam: 'TB', reg: 'NE',
    note: 'India\'s easternmost state, with dozens of Indigenous communities.' },
  { a: 'GJ', n: 'Gujarat', c: 0, r: 3, ut: false, cap: 'Gandhinagar', lang: 'Gujarati; Hindi', fam: 'IA', reg: 'W',
    note: 'Created on 1 May 1960 when Bombay State was split by language.' },
  { a: 'MP', n: 'Madhya Pradesh', c: 1, r: 3, ut: false, cap: 'Bhopal', lang: 'Hindi', fam: 'IA', reg: 'C',
    note: 'In the middle of the country. More Scheduled Tribe members live here than in any other state (2011 census).' },
  { a: 'UP', n: 'Uttar Pradesh', c: 2, r: 3, ut: false, cap: 'Lucknow', lang: 'Hindi; Urdu (additional)', fam: 'IA', reg: 'N',
    note: 'The most populous state, on the plains of the Ganga.' },
  { a: 'BR', n: 'Bihar', c: 3, r: 3, ut: false, cap: 'Patna', lang: 'Hindi; Urdu (additional)', fam: 'IA', reg: 'E',
    note: 'Home of Bodh Gaya, where Buddhists believe the Buddha reached enlightenment.' },
  { a: 'WB', n: 'West Bengal', c: 4, r: 3, ut: false, cap: 'Kolkata', lang: 'Bengali, English (plus others locally)', fam: 'IA', reg: 'E',
    note: 'Shares the Bengali language with Bangladesh next door.' },
  { a: 'AS', n: 'Assam', c: 6, r: 3, ut: false, cap: 'Dispur', lang: 'Assamese, Bodo; Bengali in the Barak Valley', fam: 'MX', reg: 'NE',
    note: 'Famous for tea and the Brahmaputra River. Assamese is Indo-Aryan; Bodo is Tibeto-Burman.' },
  { a: 'NL', n: 'Nagaland', c: 7, r: 3, ut: false, cap: 'Kohima', lang: 'English (many Naga languages)', fam: 'TB', reg: 'NE',
    note: 'Home to many Naga peoples, each with its own language.' },
  { a: 'DH', n: 'Dadra and Nagar Haveli and Daman and Diu', s: 'DNH & DD', c: 0, r: 4, ut: true, cap: 'Daman', lang: 'Gujarati, Hindi (English used in administration)', fam: 'IA', reg: 'W',
    note: 'Two former Portuguese territories merged into one union territory in 2020.' },
  { a: 'MH', n: 'Maharashtra', c: 1, r: 4, ut: false, cap: 'Mumbai', lang: 'Marathi', fam: 'IA', reg: 'W',
    note: 'Created on 1 May 1960 for Marathi speakers. Mumbai (formerly Bombay) is home to the Hindi film industry.' },
  { a: 'CG', n: 'Chhattisgarh', c: 2, r: 4, ut: false, cap: 'Raipur', lang: 'Hindi; Chhattisgarhi', fam: 'IA', reg: 'C',
    note: 'Formed in 2000; a large share of its people are Adivasi.' },
  { a: 'JH', n: 'Jharkhand', c: 3, r: 4, ut: false, cap: 'Ranchi', lang: 'Hindi; Santali, Mundari, Urdu and others (additional)', fam: 'IA', reg: 'E',
    note: 'Formed in 2000. Santali and Mundari, spoken here, are Austroasiatic languages.' },
  { a: 'ML', n: 'Meghalaya', c: 6, r: 4, ut: false, cap: 'Shillong', lang: 'English; Khasi and Garo (associate)', fam: 'MX', reg: 'NE',
    note: 'Khasi is an Austroasiatic language; Garo is Tibeto-Burman.' },
  { a: 'MN', n: 'Manipur', c: 7, r: 4, ut: false, cap: 'Imphal', lang: 'Manipuri (Meitei); English', fam: 'TB', reg: 'NE',
    note: 'A valley ringed by hills, home of the Manipuri classical dance style.' },
  { a: 'GA', n: 'Goa', c: 0, r: 5, ut: false, cap: 'Panaji', lang: 'Konkani, English; Marathi', fam: 'IA', reg: 'W',
    note: 'The smallest state by area; ruled by Portugal until 1961.' },
  { a: 'KA', n: 'Karnataka', c: 1, r: 5, ut: false, cap: 'Bengaluru', lang: 'Kannada', fam: 'DR', reg: 'S',
    note: 'Bengaluru (Bangalore) is a world center of software.' },
  { a: 'TS', n: 'Telangana', c: 2, r: 5, ut: false, cap: 'Hyderabad', lang: 'Telugu; Urdu', fam: 'DR', reg: 'S',
    note: 'India\'s newest state, formed on 2 June 2014 from Andhra Pradesh.' },
  { a: 'OD', n: 'Odisha', c: 3, r: 5, ut: false, cap: 'Bhubaneswar', lang: 'Odia; English', fam: 'IA', reg: 'E',
    note: 'Home of Odissi, one of India\'s classical dance styles. Formerly spelled Orissa.' },
  { a: 'TR', n: 'Tripura', c: 6, r: 5, ut: false, cap: 'Agartala', lang: 'Bengali, Kokborok, English', fam: 'MX', reg: 'NE',
    note: 'Bengali is Indo-Aryan; Kokborok is Tibeto-Burman.' },
  { a: 'MZ', n: 'Mizoram', c: 7, r: 5, ut: false, cap: 'Aizawl', lang: 'Mizo, English', fam: 'TB', reg: 'NE',
    note: 'A hilly state; most people speak Mizo, a Tibeto-Burman language.' },
  { a: 'LD', n: 'Lakshadweep', c: 0, r: 6, ut: true, cap: 'Kavaratti', lang: 'English; Malayalam widely used', fam: 'DR', reg: 'S',
    note: 'Coral islands in the Arabian Sea, off the coast of Kerala. Most islanders speak a form of Malayalam; on Minicoy, people speak Mahl (Dhivehi).' },
  { a: 'KL', n: 'Kerala', c: 1, r: 6, ut: false, cap: 'Thiruvananthapuram', lang: 'Malayalam', fam: 'DR', reg: 'S',
    note: 'Created on 1 November 1956 for Malayalam speakers.' },
  { a: 'TN', n: 'Tamil Nadu', c: 2, r: 6, ut: false, cap: 'Chennai', lang: 'Tamil; English', fam: 'DR', reg: 'S',
    note: 'Chennai (formerly Madras) is a major center of Carnatic music.' },
  { a: 'AP', n: 'Andhra Pradesh', c: 3, r: 6, ut: false, cap: 'Amaravati', lang: 'Telugu; English, Urdu', fam: 'DR', reg: 'S',
    note: 'Andhra State (1953) was the first state formed for one language.' },
  { a: 'AN', n: 'Andaman and Nicobar Islands', s: 'A & N', c: 5, r: 6, ut: true, cap: 'Sri Vijaya Puram (formerly Port Blair)', lang: 'Hindi, English', fam: 'IA', reg: 'E',
    note: 'Islands far out in the Bay of Bengal. The capital was renamed in 2024.' },
  { a: 'PY', n: 'Puducherry', c: 3, r: 7, ut: true, cap: 'Puducherry', lang: 'Tamil, Telugu, Malayalam (by area); English, French', fam: 'DR', reg: 'S',
    note: 'Four former French enclaves, so French has official standing here.' }
];

let selected = -1;
let colorMode = 'Language family';
let utOnly = false;

// layout
let gx, gy, gw, gh, cell, px, py, pw, ph, wide;
const COLS = 9, ROWS = 8;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  colorSelect = createSelect();
  colorSelect.option('Language family');
  colorSelect.option('Region');
  colorSelect.selected(colorMode);
  colorSelect.position(10, drawHeight + 10);
  colorSelect.changed(() => { colorMode = colorSelect.value(); });

  utCheckbox = createCheckbox(' Highlight the 8 union territories', false);
  utCheckbox.position(10, drawHeight + 45);
  utCheckbox.changed(() => { utOnly = utCheckbox.checked(); });

  describe('A tile cartogram of India: 36 equal squares, one for each of the 28 states and 8 union territories, placed roughly where each sits in the country but not to scale and with no borders. Tiles are colored by language family (Indo-Aryan, Dravidian, Tibeto-Burman or mixed) or by region. Clicking a tile shows its capital, official languages and a short note.');
}

function computeLayout() {
  wide = canvasWidth >= 720;
  const top = 64;
  if (wide) {
    gx = margin; gy = top;
    gw = Math.floor(canvasWidth * 0.6) - margin;
    cell = Math.min(Math.floor(gw / COLS), Math.floor((drawHeight - top - 150) / ROWS));
    gw = cell * COLS; gh = cell * ROWS;
    px = gx + Math.floor(canvasWidth * 0.6); py = top;
    pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    cell = Math.floor((canvasWidth - 2 * margin) / COLS);
    gw = cell * COLS; gh = cell * ROWS;
    gx = Math.floor((canvasWidth - gw) / 2); gy = top;
    px = margin; py = gy + gh + 166;
    pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin;
  }
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
  drawGrid();
  drawKeyAndCaption();
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
  const title = 'India Explorer: 28 States and 8 Union Territories';
  while (textWidth(title) > canvasWidth - 20 && ts > 15) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Tap a tile for its capital and languages. Change the coloring in the menu.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Tap a tile. Change the coloring in the menu.';
  text(instr, canvasWidth / 2, 38);
}

function tileColor(t) {
  return colorMode === 'Region' ? REGION[t.reg].col : FAMILY[t.fam].col;
}

function drawGrid() {
  const gap = 3;
  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    const x = gx + t.c * cell + gap / 2;
    const y = gy + t.r * cell + gap / 2;
    const s = cell - gap;
    const dim = utOnly && !t.ut;
    const col = color(tileColor(t));
    if (dim) col.setAlpha(55);
    stroke(i === selected ? NAVY : 'white');
    strokeWeight(i === selected ? 4 : 1);
    fill(col);
    rect(x, y, s, s, t.ut ? s * 0.5 : 6);
    // label: two-letter code
    noStroke();
    fill(dim ? '#777777' : 'white');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(Math.max(14, Math.min(20, s * 0.36)));
    text(t.a, x + s / 2, y + s / 2);
    textStyle(NORMAL);
  }
}

function drawKeyAndCaption() {
  // legend under the grid
  const keys = colorMode === 'Region' ? Object.values(REGION) : Object.values(FAMILY);
  textSize(14);
  textAlign(LEFT, CENTER);
  let x = gx, y = gy + gh + 14;
  for (let k of keys) {
    const w = 18 + textWidth(k.name) + 14;
    if (x + w > gx + Math.max(gw, wide ? gw : canvasWidth - 2 * margin)) { x = gx; y += 20; }
    noStroke();
    fill(k.col);
    rect(x, y - 7, 14, 14, 3);
    fill(NAVY);
    text(k.name, x + 18, y);
    x += w;
  }
  y += 20;
  fill('#444444');
  noStroke();
  const sq = 'Square = state.  Round = union territory.';
  text(sq, gx, y);
  y += 22;
  // caption (required)
  fill('#333333');
  const cap = 'Schematic map, not to scale. Not an official depiction of borders.';
  const capW = wide ? gw : canvasWidth - 2 * margin;
  if (textWidth(cap) < capW) {
    text(cap, gx, y);
  } else {
    text('Schematic map, not to scale.', gx, y);
    y += 18;
    text('Not an official depiction of borders.', gx, y);
  }
  // Kashmir note (neutral)
  y += 20;
  fill('#555555');
  const kn = 'JK and LA show the areas India administers. The wider Kashmir region is disputed among India, Pakistan and China.';
  for (let l of wrapLines(kn, capW)) { text(l, gx, y); y += 18; }
}

function drawPanel() {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  const pad = 10;
  const tw = pw - 2 * pad;
  let y = py + 12;
  textAlign(LEFT, TOP);
  noStroke();

  if (selected < 0) {
    fill(SAFFRON);
    textStyle(BOLD);
    textSize(wide ? 20 : 17);
    text('India at a glance', px + pad, y);
    y += wide ? 30 : 26;
    textStyle(NORMAL);
    const lines = [
      ['Capital', 'New Delhi'],
      ['Population (2025)', '1,463,865,525 (about 1.46 billion), World Bank'],
      ['Units', '28 states and 8 union territories (2026)'],
      ['Union languages', 'Hindi (Devanagari script) and English'],
      ['Eighth Schedule', '22 languages'],
      ['Try this', wide ? 'Look at the Language family colors: most southern tiles share one color. Many states were drawn around languages in the 1950s. Then switch the menu to Region.' : 'Switch the menu to Region.']
    ];
    y = drawRows(lines, y, tw);
    return;
  }
  const t = tiles[selected];
  fill(tileColor(t));
  rect(px, py, pw, 8, 6, 6, 0, 0);
  fill(SAFFRON);
  textStyle(BOLD);
  let ts = wide ? 20 : 17;
  textSize(ts);
  while (textWidth(t.n) > tw && ts > 14) { ts--; textSize(ts); }
  const nameLines = wrapLines(t.n, tw);
  for (let l of nameLines) { text(l, px + pad, y); y += ts + 4; }
  textStyle(ITALIC);
  textSize(14);
  fill('#555555');
  text(t.ut ? 'Union territory' : 'State', px + pad, y);
  textStyle(NORMAL);
  y += 22;
  const rows = [
    ['Capital', t.cap],
    ['Official language(s)', t.lang],
    ['Language family', FAMILY[t.fam].name],
    ['Region', REGION[t.reg].name + ' (informal grouping)'],
    ['Note', t.note]
  ];
  drawRows(rows, y, tw);
}

function drawRows(rows, y, tw) {
  const pad = 10;
  const body = wide ? 15 : 14;
  const lead = wide ? 19 : 17;
  for (let r of rows) {
    textSize(body);
    if (y + lead > py + ph - 4) break;
    if (wide) {
      textStyle(BOLD);
      fill(NAVY);
      text(r[0], px + pad, y);
      y += lead;
      textStyle(NORMAL);
      fill('#222222');
      for (let l of wrapLines(r[1], tw)) {
        if (y + lead > py + ph - 4) break;
        text(l, px + pad, y);
        y += lead;
      }
      y += 6;
    } else {
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
  return y;
}

function drawControlLabels() {
  noStroke();
  fill(NAVY);
  textSize(14);
  textAlign(LEFT, CENTER);
  const sx = colorSelect.elt.offsetWidth + 18;
  if (sx + textWidth('Color the tiles by') < canvasWidth - 10) {
    text('Color the tiles by', sx, drawHeight + 21);
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

function pickTile(mx, my) {
  if (my > drawHeight || my < 0 || mx < 0 || mx > canvasWidth) return;
  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    const x = gx + t.c * cell, y = gy + t.r * cell;
    if (mx >= x && mx < x + cell && my >= y && my < y + cell) {
      selected = i;
      return;
    }
  }
  if (mx >= gx && mx <= gx + gw && my >= gy && my <= gy + gh) selected = -1;
}

function mousePressed() {
  pickTile(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    pickTile(touches[0].x, touches[0].y);
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
