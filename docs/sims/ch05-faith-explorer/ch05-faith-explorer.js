// Faith Explorer (Roots & Rivers, Chapter 5)
// CANVAS_HEIGHT = 790 (drawHeight 690 + controlHeight 100); iframe height 792px
// Eight faith tiles (six large traditions plus two smaller communities) in
// alphabetical order, all the same size on purpose: this is not a ranking.
// Pick a faith and a lens (Origins, Sacred texts, Place of worship,
// A major festival, A core idea) to read a short card. Tick Compare to see
// two faiths side by side through the same lens.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 690;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

let faithSelect, lensSelect, compareCheckbox, faithSelectB;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

const lenses = ['Origins', 'Sacred texts', 'Place of worship', 'A major festival', 'A core idea'];

// Card text. Each entry: [Origins, Sacred texts, Place of worship, Festival, Core idea]
// Written as "many followers believe" / "in X tradition", never as the book's own claims.
const faiths = [
  { name: 'Buddhism', place: 'Vihara / temple', color: '#F6D08B', small: false, cards: [
    'Begun by Siddhartha Gautama, the Buddha, born in Lumbini (now in Nepal) about 2,500 years ago. Buddhists say he reached enlightenment at Bodh Gaya, India. Today: most Sri Lankans and Bhutanese.',
    'Theravada Buddhists (Sri Lanka) use the Pali Canon. Vajrayana Buddhists (Bhutan) also use Mahayana sutras and Tibetan teachings.',
    'A vihara or temple, often with a stupa (a dome holding relics). In Bhutan, many monasteries sit inside dzongs, fortress-like centers.',
    'Vesak (Buddha Purnima), on a full-moon day in spring, honors the Buddha\'s birth, enlightenment and passing. Many homes and streets are lit with lanterns.',
    'Buddhists follow the Four Noble Truths: life involves suffering, suffering has a cause, it can end, and the Eightfold Path of wisdom, ethics and meditation leads there.'] },
  { name: 'Christianity', place: 'Church', color: '#C9D8F0', small: false, cards: [
    'Began with Jesus in the first century CE. Many Kerala Christians trace their church to the apostle Thomas; later Portuguese and British-era missions founded other communities.',
    'The Bible, with the Old and New Testaments, read in Malayalam, Tamil, Urdu, Sinhala, Bangla, English and many other languages.',
    'A church. Goa\'s old churches, such as the Basilica of Bom Jesus, are a UNESCO World Heritage Site.',
    'Christmas and Easter. In many South Asian churches, Christmas includes local sweets, carols in regional languages and star lanterns.',
    'Christians believe God\'s love is shown in Jesus, whom they believe is the Son of God, and that people should love God and their neighbors.'] },
  { name: 'Hinduism', place: 'Mandir', color: '#F6B48B', small: false, cards: [
    'No single founder or start date. It grew over thousands of years from many traditions in South Asia. Today most people in India and Nepal are Hindu.',
    'Not one book but many: the Vedas and Upanishads, the epics Ramayana and Mahabharata (which includes the Bhagavad Gita), the Puranas, and poems in many languages.',
    'A mandir (temple). Many families also keep a home shrine for daily puja, offering light, flowers, food and prayer.',
    'Diwali, the festival of lights, in October or November. Holi, Navaratri, Durga Puja, Pongal and many regional festivals matter too.',
    'Dharma (right duty and order), karma and rebirth. Many Hindus worship one divine reality in many forms, such as Vishnu, Shiva and Devi.'] },
  { name: 'Islam', place: 'Masjid (mosque)', color: '#A8D5BA', small: false, cards: [
    'Began in Arabia in the 600s CE with the Prophet Muhammad. It reached South Asia through Arab traders, Sufi teachers and later rulers. Most people in Pakistan, Bangladesh, Afghanistan and the Maldives are Muslim.',
    'The Quran, which Muslims believe is God\'s word revealed to Muhammad, read in Arabic. The Hadith record the Prophet\'s sayings and actions.',
    'A masjid (mosque). Many Muslims, and people of other faiths too, visit dargahs, the shrines of Sufi saints, such as the dargah at Ajmer.',
    'Eid al-Fitr ends Ramadan, the month of daytime fasting. Eid al-Adha comes during the Hajj season. Shia Muslims mourn Imam Husain in Muharram.',
    'Muslims believe in tawhid, the oneness of God (Allah). The Five Pillars of practice: declaring faith, daily prayer, charity, fasting in Ramadan and the Hajj pilgrimage.'] },
  { name: 'Jainism', place: 'Jain temple', color: '#E8C4E8', small: false, cards: [
    'Jains believe their path was taught by 24 tirthankaras ("ford-makers"). The 24th, Mahavira, lived in eastern India about 2,500 years ago, around the Buddha\'s time.',
    'The Agamas, the teachings of Mahavira. The two main groups, Digambara and Svetambara, accept different collections.',
    'A Jain temple, often of carved white marble. Famous sites include Palitana in Gujarat and Shravanabelagola in Karnataka.',
    'Paryushan, a time of fasting, reflection and asking forgiveness. Many Jains also mark Mahavir Jayanti, and at Diwali they remember Mahavira reaching moksha.',
    'Jains put ahimsa first: non-violence toward every living being. Many Jains are strict vegetarians and try to harm even tiny creatures as little as possible.'] },
  { name: 'Sikhism', place: 'Gurdwara', color: '#F2D27A', small: false, cards: [
    'Founded by Guru Nanak (1469-1539) in Punjab. Nine more human Gurus followed. Most Sikhs live in Punjab, India; Kartarpur and Nankana Sahib are in Pakistan.',
    'The Guru Granth Sahib, which Sikhs honor as their living Guru. It holds hymns of the Sikh Gurus and of Hindu and Muslim saints.',
    'A gurdwara, "door to the Guru." Everyone covers their head and removes shoes. The free community kitchen, langar, feeds all visitors.',
    'Vaisakhi, in April, marks the creation of the Khalsa in 1699. Gurpurabs mark the Gurus\' birthdays and other anniversaries.',
    'Sikhs believe in one God (Ik Onkar) and teach the equality of all people, honest work, sharing with others, remembering God, and seva (selfless service).'] },
  { name: 'Jewish communities', place: 'Synagogue', color: '#BFE3E0', small: true, cards: [
    'Several old communities: Cochin Jews in Kerala, Bene Israel on the Konkan coast near Mumbai, and Baghdadi Jews in Mumbai and Kolkata. Most moved to Israel after 1948.',
    'The Torah and the Hebrew Bible, along with later teachings such as the Talmud.',
    'A synagogue. The Paradesi Synagogue in Kochi, Kerala, was built in 1568 and is still standing.',
    'Passover, Rosh Hashanah and Yom Kippur, celebrated with some local customs and foods.',
    'Jews believe in one God and a covenant (a sacred agreement) between God and the Jewish people, lived out by following the Torah.'] },
  { name: 'Zoroastrians (Parsis)', place: 'Fire temple', color: '#F3C6A5', small: true, cards: [
    'A faith founded by the prophet Zoroaster in ancient Iran. Parsis ("Persians") sailed from Iran to Gujarat more than a thousand years ago; scholars debate the exact century.',
    'The Avesta, which includes the Gathas, hymns that tradition credits to Zoroaster himself.',
    'A fire temple. The Iranshah fire at Udvada, Gujarat, is the most revered in India. Parsi tradition says it has burned for over a thousand years.',
    'Navroz, the New Year, and Khordad Sal, Zoroaster\'s birthday.',
    'Zoroastrians teach good thoughts, good words, good deeds: each person chooses between good and evil.'] }
];

let selA = 5;   // start on Sikhism
let selB = 3;   // second faith for Compare mode (Islam)
let gx, gy, gw, gh, px, py, pw, ph, wide;
let tileRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  faithSelect = createSelect();
  for (const f of faiths) faithSelect.option(f.name);
  faithSelect.selected(faiths[selA].name);
  faithSelect.position(10, drawHeight + 10);
  faithSelect.changed(() => { selA = faiths.findIndex(f => f.name === faithSelect.value()); });

  lensSelect = createSelect();
  for (const l of lenses) lensSelect.option(l);
  lensSelect.selected('Place of worship');
  lensSelect.position(10, drawHeight + 50);

  compareCheckbox = createCheckbox(' Compare', true);  // start in Compare mode
  compareCheckbox.position(200, drawHeight + 52);

  faithSelectB = createSelect();
  for (const f of faiths) faithSelectB.option(f.name);
  faithSelectB.selected(faiths[selB].name);
  faithSelectB.position(200, drawHeight + 10);
  faithSelectB.changed(() => { selB = faiths.findIndex(f => f.name === faithSelectB.value()); });

  describe('Faith Explorer. Eight equal tiles in alphabetical order: Buddhism, Christianity, Hinduism, Islam, Jainism and Sikhism, then a row of smaller communities: Jewish communities and Zoroastrians (Parsis). Choose a faith and a lens, such as Origins, Sacred texts, Place of worship, A major festival or A core idea, to read a short card. Tick Compare to show two faiths side by side through the same lens.');
}

function computeLayout() {
  wide = canvasWidth >= 700;
  const top = 64;
  if (wide) {
    gx = margin; gy = top; gw = Math.floor(canvasWidth * 0.46) - margin; gh = drawHeight - top - margin;
    px = gx + gw + margin; py = top; pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    gx = margin; gy = top; gw = canvasWidth - 2 * margin; gh = 250;
    px = margin; py = gy + gh + 8; pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin;
  }
  // position the second-row controls responsively
  const half = Math.max(150, Math.floor((canvasWidth - 30) / 2));
  faithSelect.size(Math.min(half, 230));
  faithSelectB.size(Math.min(half, 230));
  lensSelect.size(Math.min(half, 230));
  faithSelectB.position(20 + Math.min(half, 230), drawHeight + 10);
  compareCheckbox.position(20 + Math.min(half, 230), drawHeight + 52);
  faithSelectB.style('opacity', compareCheckbox.checked() ? '1' : '0.45');
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
  drawTiles();
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
  const title = 'Faith Explorer';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Tap a faith, then pick a lens below. Tick Compare to see two faiths side by side.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Tap a faith and pick a lens. Tick Compare for two.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Tap a faith and pick a lens.';
  text(instr, canvasWidth / 2, 40);
}

function drawTiles() {
  tileRects = [];
  const cols = 2;
  const gap = 8;
  // six main tiles in 3 rows of 2, then a label row, then 2 smaller-community tiles
  const labelH = 24;
  const noteH = 22;
  const rowsMain = 3;
  const tileH = (gh - labelH - noteH - gap * (rowsMain + 1)) / (rowsMain + 1);
  const tileW = (gw - gap * (cols - 1)) / cols;
  let idx = 0;
  for (let r = 0; r < rowsMain; r++) {
    for (let c = 0; c < cols; c++) {
      const x = gx + c * (tileW + gap), y = gy + r * (tileH + gap);
      drawTile(idx, x, y, tileW, tileH);
      idx++;
    }
  }
  // smaller communities label
  noStroke();
  fill(TEAL);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(14);
  const ly = gy + rowsMain * (tileH + gap) + labelH / 2;
  text('Smaller communities', gx, ly);
  textStyle(NORMAL);
  for (let c = 0; c < cols; c++) {
    const x = gx + c * (tileW + gap), y = gy + rowsMain * (tileH + gap) + labelH;
    drawTile(idx, x, y, tileW, tileH);
    idx++;
  }
  // note about order
  fill('#555555');
  textSize(14);
  textAlign(CENTER, TOP);
  let note = 'Alphabetical order, equal sizes: not a ranking.';
  if (textWidth(note) > gw) note = 'Alphabetical. Not a ranking.';
  text(note, gx + gw / 2, gy + gh - noteH + 4);
}

function drawTile(i, x, y, w, h) {
  const f = faiths[i];
  const isA = i === selA;
  const isB = compareCheckbox.checked() && i === selB;
  if (isA) { stroke(SAFFRON); strokeWeight(4); }
  else if (isB) { stroke(TEAL); strokeWeight(4); }
  else { stroke('white'); strokeWeight(2); }
  fill(f.color);
  rect(x, y, w, h, 10);
  noStroke();
  fill(NAVY);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  let ts = wide ? 17 : 15;
  textSize(ts);
  let nm = f.name;
  // split long names over two lines
  // keep 26 px clear on each side for the 1 / 2 compare badge
  const room = w - 52;
  let lines = [nm];
  if (textWidth(nm) > room) {
    const k = nm.indexOf(' ');
    if (k > 0) lines = [nm.slice(0, k), nm.slice(k + 1)];
  }
  while (lines.some(l => textWidth(l) > room) && ts > 14) { ts--; textSize(ts); }
  const lh = ts + 3;
  const showPlace = h > 52;
  const blockH = lines.length * lh + (showPlace ? 18 : 0);
  let ty = y + h / 2 - blockH / 2 + lh / 2;
  for (const l of lines) { text(l, x + w / 2, ty); ty += lh; }
  textStyle(NORMAL);
  if (showPlace) {
    textSize(14);
    fill('#333333');
    let pl = f.place;
    if (textWidth(pl) > w - 8) pl = pl.split(' ')[0];
    text(pl, x + w / 2, ty + 2);
  }
  // badge for compare
  if (isA || isB) {
    fill(isA ? SAFFRON : TEAL);
    noStroke();
    circle(x + 14, y + 14, 20);
    fill('white');
    textStyle(BOLD);
    textSize(14);
    text(isA ? '1' : '2', x + 14, y + 14);
    textStyle(NORMAL);
  }
  tileRects.push({ i, x, y, w, h });
}

function drawPanel() {
  const lensIdx = lenses.indexOf(lensSelect.value());
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  noStroke();
  const pad = 10;
  // lens heading
  fill(TEAL);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(wide ? 18 : 16);
  text('Lens: ' + lenses[lensIdx], px + pad, py + pad);
  textStyle(NORMAL);
  const top = py + pad + (wide ? 30 : 26);

  if (!compareCheckbox.checked()) {
    drawCard(faiths[selA], lensIdx, px + pad, top, pw - 2 * pad, py + ph - pad - top, SAFFRON);
  } else if (wide || pw > 560) {
    const cw = (pw - 3 * pad) / 2;
    drawCard(faiths[selA], lensIdx, px + pad, top, cw, py + ph - pad - top, SAFFRON);
    drawCard(faiths[selB], lensIdx, px + 2 * pad + cw, top, cw, py + ph - pad - top, TEAL);
  } else {
    const ch = (py + ph - pad - top - pad) / 2;
    drawCard(faiths[selA], lensIdx, px + pad, top, pw - 2 * pad, ch, SAFFRON);
    drawCard(faiths[selB], lensIdx, px + pad, top + ch + pad, pw - 2 * pad, ch, TEAL);
  }
}

function drawCard(f, lensIdx, x, y, w, h, accent) {
  stroke(accent);
  strokeWeight(2);
  fill('#FFFDF8');
  rect(x, y, w, h, 8);
  noStroke();
  const pad = 10;
  fill(accent);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  let hs = wide ? 20 : 16;
  textSize(hs);
  while (textWidth(f.name) > w - 2 * pad && hs > 15) { hs--; textSize(hs); }
  // if the name still does not fit, wrap it onto two lines
  let headLines = [f.name];
  if (textWidth(f.name) > w - 2 * pad) headLines = wrapLines(f.name, w - 2 * pad);
  let hy = y + pad;
  for (const hl of headLines) { text(hl, x + pad, hy); hy += hs + 4; }
  textStyle(NORMAL);
  fill('#222222');
  const bs = (wide && !compareCheckbox.checked()) ? 17 : (wide ? 15 : 14);
  textSize(bs);
  const lead = bs + 6;
  let ty = hy + (wide ? 8 : 6);
  for (const ln of wrapLines(f.cards[lensIdx], w - 2 * pad)) {
    if (ty + lead > y + h - 2) break;
    text(ln, x + pad, ty);
    ty += lead;
  }
}

function drawControlLabels() {
  // small hints next to the control rows, only when there is room
  noStroke();
  fill('#444444');
  textSize(14);
  textAlign(LEFT, CENTER);
  if (canvasWidth >= 620) {
    const half = Math.min(Math.max(150, Math.floor((canvasWidth - 30) / 2)), 230);
    const x = 30 + 2 * half;
    text('Faith 1 (orange) and faith 2 (teal)', x, drawHeight + 22);
    text('Lens and Compare', x, drawHeight + 62);
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
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const t of tileRects) {
    if (mouseX >= t.x && mouseX <= t.x + t.w && mouseY >= t.y && mouseY <= t.y + t.h) {
      if (compareCheckbox.checked() && t.i !== selA) {
        selB = t.i;
        faithSelectB.selected(faiths[selB].name);
      } else {
        selA = t.i;
        faithSelect.selected(faiths[selA].name);
      }
      return;
    }
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
