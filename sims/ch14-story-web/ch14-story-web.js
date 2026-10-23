// Story Web: how South Asian stories travel (Roots & Rivers, Chapter 14)
// CANVAS_HEIGHT = 850 (drawHeight 760 + controlHeight 90); iframe height 852px
// A network of works and writers placed on a timeline (left to right by era)
// and colored by language group. Click or tap a node to read its card and
// see the links that connect it to other works. Filter by language.
// Dates are scholars' estimates where a work cannot be dated exactly.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 760;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

let langSelect, linksCheckbox, resetButton;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const PLUM = '#7B4F9E';
const ROSE = '#B5476B';

// language groups (node colors)
const groups = [
  { key: 'classical', name: 'Sanskrit and Pali', color: SAFFRON },
  { key: 'dravidian', name: 'Tamil and Kannada', color: TEAL },
  { key: 'bangla', name: 'Bangla', color: LEAF },
  { key: 'north', name: 'Hindi, Urdu, Punjabi and related', color: MARIGOLD },
  { key: 'other', name: 'Nepali and Pashto', color: ROSE },
  { key: 'english', name: 'English', color: NAVY },
  { key: 'abroad', name: 'Persian, Arabic, Javanese', color: PLUM }
];

const eras = [
  { short: 'to 1 CE', long: 'Before 1 CE' },
  { short: '1-1000', long: '1 to 1000 CE' },
  { short: '1000-1700', long: '1000 to 1700' },
  { short: '1700-1947', long: '1700 to 1947' },
  { short: '1947-now', long: '1947 to today' }
];

// The works. langs = languages used by the filter. Facts are from the
// chapter's fact log (logs/14-factcheck.md).
const nodes = [
  { id: 'valmiki', label: 'Valmiki Ramayana', era: 0, group: 'classical', langs: ['Sanskrit'],
    date: 'Oral core about 750 to 500 BCE (scholars\' estimate)', place: 'North India',
    sum: 'Prince Rama\'s exile, the capture of Sita by Ravana, and her rescue, in about 24,000 verses and seven books.' },
  { id: 'mahabharata', label: 'Mahabharata', era: 0, group: 'classical', langs: ['Sanskrit'],
    date: 'Mostly compiled about 300 BCE to 300 CE', place: 'North India',
    sum: 'A war between two sets of royal cousins, told in more than 100,000 verses: one of the longest poems ever composed.' },
  { id: 'gita', label: 'Bhagavad Gita', era: 0, group: 'classical', langs: ['Sanskrit'],
    date: 'Debated; often placed about 2nd to 1st century BCE', place: 'North India (inside the Mahabharata)',
    sum: 'About 700 verses in which Krishna answers Prince Arjuna\'s doubts on the eve of battle. Many Hindus treat it as sacred.' },
  { id: 'jataka', label: 'Jataka tales', era: 0, group: 'classical', langs: ['Pali'],
    date: 'Verses older than the prose; collected about 500 CE', place: 'India, Sri Lanka and Buddhist Asia',
    sum: '547 stories of the Buddha\'s earlier lives as people and animals, kept in the Theravada Buddhist canon.' },
  { id: 'sangam', label: 'Sangam poems', era: 0, group: 'dravidian', langs: ['Tamil'],
    date: 'About 300 BCE to 300 CE', place: 'Tamil country, South India',
    sum: '2,381 poems by 473 poets about love (akam) and about war and public life (puram).' },
  { id: 'panchatantra', label: 'Panchatantra', era: 1, group: 'classical', langs: ['Sanskrit'],
    date: 'Before 550 CE', place: 'India',
    sum: 'Animal fables set inside a frame story, told to teach young princes how to act wisely.' },
  { id: 'kalila', label: 'Kalila wa Dimna', era: 1, group: 'abroad', langs: ['Persian', 'Arabic'],
    date: 'Middle Persian about 550 CE; Arabic about 750 CE', place: 'Persia and the Arab world',
    sum: 'The Panchatantra retold and named after two jackals. From Arabic it spread into dozens of languages, all the way to Europe.' },
  { id: 'kakawin', label: 'Kakawin Ramayana', era: 1, group: 'abroad', langs: ['Old Javanese'],
    date: 'About 870 CE', place: 'Java, Indonesia',
    sum: 'A Javanese telling of Rama\'s story. Its second half is very different from Valmiki\'s.' },
  { id: 'kalidasa', label: 'Kalidasa', era: 1, group: 'classical', langs: ['Sanskrit'],
    date: 'About 4th to 5th century CE (Gupta era)', place: 'North India',
    sum: 'The play Shakuntala and the poem Meghaduta, in which an exiled lover sends a message home by a passing cloud.' },
  { id: 'kamban', label: 'Kamban Ramayana', era: 2, group: 'dravidian', langs: ['Tamil'],
    date: '12th century', place: 'Tamil Nadu, India',
    sum: 'Kamban\'s Ramavataram, a Tamil Ramayana counted among the greatest works of Tamil literature.' },
  { id: 'kabir', label: 'Kabir', era: 2, group: 'north', langs: ['Hindi'],
    date: '15th century', place: 'Varanasi, India',
    sum: 'A weaver-poet who mocked empty ritual in both Hinduism and Islam. His verses are in the Sikh Guru Granth Sahib.' },
  { id: 'krittibas', label: 'Krittivasi Ramayan', era: 2, group: 'bangla', langs: ['Bangla'],
    date: 'About 15th century', place: 'Bengal (India and Bangladesh)',
    sum: 'Krittibas Ojha\'s Bengali Ramayana, for centuries one of the most loved books in Bengal, full of Bengali village life.' },
  { id: 'tulsidas', label: 'Ramcharitmanas', era: 2, group: 'north', langs: ['Awadhi'],
    date: '16th century', place: 'North India',
    sum: 'Tulsidas retold the Ramayana in everyday Awadhi so ordinary people could follow it. Ramlila plays are based on it.' },
  { id: 'rahman', label: 'Rahman Baba', era: 2, group: 'other', langs: ['Pashto'],
    date: 'About 1632 to 1706', place: 'Peshawar (Pakistan); loved by Pashto speakers in Afghanistan too',
    sum: 'Sufi poems about God, kindness and humility. He is among the most popular poets of the Pashto language.' },
  { id: 'warisshah', label: 'Waris Shah, Heer', era: 3, group: 'north', langs: ['Punjabi'],
    date: '1766', place: 'Punjab',
    sum: 'The most famous telling of Heer and Ranjha, a tragic love story of the Punjabi countryside.' },
  { id: 'ghalib', label: 'Ghalib', era: 3, group: 'north', langs: ['Urdu', 'Persian'],
    date: 'He lived 1797 to 1869', place: 'Delhi, India',
    sum: 'Ghazals and chatty, funny letters written as the Mughal world ended. Still sung and quoted in India and Pakistan.' },
  { id: 'bhanubhakta', label: 'Nepali Ramayana', era: 3, group: 'other', langs: ['Nepali'],
    date: 'Bhanubhakta lived 1814 to 1868', place: 'Nepal',
    sum: 'Bhanubhakta Acharya made the first Nepali translation of the Ramayana. At first it spread by word of mouth.' },
  { id: 'birbal', label: 'Akbar and Birbal', era: 3, group: 'north', langs: ['Hindi', 'Urdu'],
    date: 'Birbal died in 1586; most tales spread in the 1800s', place: 'India and Pakistan',
    sum: 'Funny tales of Emperor Akbar and his quick-witted minister Birbal, a real courtier who became a folk hero.' },
  { id: 'iqbal', label: 'Iqbal', era: 3, group: 'north', langs: ['Urdu', 'Persian'],
    date: 'He lived 1877 to 1938', place: 'Sialkot and Lahore (Pakistan)',
    sum: 'Pakistan\'s national poet. His Persian poems are loved in Iran, and his early Urdu song "Saare Jahan Se Achha" is a patriotic favorite in India.' },
  { id: 'rokeya', label: 'Sultana\'s Dream', era: 3, group: 'english', langs: ['English'],
    date: '1905', place: 'Bengal (Rokeya was born in today\'s Bangladesh)',
    sum: 'Rokeya Sakhawat Hossain\'s science fiction story of Ladyland, where women run the country with solar power and flying cars.' },
  { id: 'tagore', label: 'Tagore', era: 3, group: 'bangla', langs: ['Bangla'],
    date: 'Nobel Prize in Literature, 1913', place: 'Bengal (Kolkata, India)',
    sum: 'Poet of Gitanjali, the first non-European to win the Nobel Prize in Literature. He wrote the national anthems of India and Bangladesh.' },
  { id: 'nazrul', label: 'Nazrul', era: 3, group: 'bangla', langs: ['Bangla'],
    date: '"Bidrohi" (The Rebel), 1922', place: 'Bengal; national poet of Bangladesh',
    sum: 'A fiery poem against injustice made him the "Rebel Poet". He wrote both Islamic songs and Hindu devotional songs.' },
  { id: 'devkota', label: 'Muna Madan', era: 3, group: 'other', langs: ['Nepali'],
    date: '1936', place: 'Nepal',
    sum: 'Laxmi Prasad Devkota\'s long poem about a husband who leaves Kathmandu for Lhasa to earn money, and the wife he leaves behind.' },
  { id: 'pritam', label: 'Amrita Pritam', era: 4, group: 'north', langs: ['Punjabi'],
    date: '1947', place: 'Punjab (she left Lahore for India)',
    sum: 'Her Partition poem "Ajj Aakhaan Waris Shah Nu" calls on the old poet Waris Shah to see the suffering of Punjab.' },
  { id: 'manto', label: 'Toba Tek Singh', era: 4, group: 'north', langs: ['Urdu'],
    date: '1955', place: 'Lahore, Pakistan',
    sum: 'Saadat Hasan Manto\'s story about patients in a Lahore asylum who are sorted into India and Pakistan after Partition.' },
  { id: 'khushwant', label: 'Train to Pakistan', era: 4, group: 'english', langs: ['English'],
    date: '1956', place: 'India',
    sum: 'Khushwant Singh\'s novel of Partition seen from a small border village where Sikhs and Muslims had lived side by side.' },
  { id: 'rushdie', label: 'Midnight\'s Children', era: 4, group: 'english', langs: ['English'],
    date: '1981 (Booker Prize, 1981)', place: 'India and Pakistan',
    sum: 'Salman Rushdie\'s novel about a boy born at the very moment of India\'s independence.' },
  { id: 'tomb', label: 'Tomb of Sand', era: 4, group: 'north', langs: ['Hindi', 'English'],
    date: 'Hindi 2018; English 2022', place: 'India',
    sum: 'Geetanjali Shree\'s novel of an 80-year-old woman\'s new life. The first book translated from an Indian language to win the International Booker (2022).' },
  { id: 'sevenmoons', label: 'Seven Moons', era: 4, group: 'english', langs: ['English'],
    date: '2022 (Booker Prize, 2022)', place: 'Sri Lanka',
    sum: 'Shehan Karunatilaka\'s The Seven Moons of Maali Almeida: a war photographer\'s ghost in Colombo in 1990, during the civil war.' },
  { id: 'heartlamp', label: 'Heart Lamp', era: 4, group: 'dravidian', langs: ['Kannada', 'English'],
    date: 'Kannada 1990 to 2023; English 2025', place: 'Karnataka, India',
    sum: 'Banu Mushtaq\'s stories about Muslim women in southern India, translated by Deepa Bhasthi. International Booker Prize, 2025.' }
];

// links: [a, b, reason]
const links = [
  ['valmiki', 'kamban', 'Kamban retold Rama\'s story in Tamil'],
  ['valmiki', 'krittibas', 'Krittibas retold it in Bangla'],
  ['valmiki', 'tulsidas', 'Tulsidas retold it in Awadhi'],
  ['valmiki', 'bhanubhakta', 'Bhanubhakta translated it into Nepali'],
  ['valmiki', 'kakawin', 'Rama\'s story reached Java'],
  ['mahabharata', 'gita', 'The Gita is a section of the Mahabharata'],
  ['jataka', 'panchatantra', 'They share many of the same animal fables'],
  ['panchatantra', 'kalila', 'Translated into Middle Persian, then Arabic'],
  ['sangam', 'kamban', 'Both are landmarks of Tamil poetry'],
  ['kabir', 'tagore', 'Tagore was influenced by Kabir'],
  ['tagore', 'nazrul', 'Tagore dedicated a play to Nazrul in 1923'],
  ['warisshah', 'pritam', 'Pritam\'s poem calls out to Waris Shah'],
  ['pritam', 'manto', 'Both wrote about Partition in Punjab'],
  ['manto', 'khushwant', 'Both are classics of Partition literature'],
  ['rokeya', 'rushdie', 'South Asian stories written in English'],
  ['rushdie', 'sevenmoons', 'South Asian novels that won the Booker Prize'],
  ['tomb', 'heartlamp', 'Indian-language books that won the International Booker in translation'],
  ['bhanubhakta', 'devkota', 'Two landmarks of Nepali literature'],
  ['ghalib', 'iqbal', 'Both wrote in Urdu and Persian'],
  ['rahman', 'warisshah', 'Both wrote Sufi-inspired poetry in regional languages']
];

let selected = 0; // start on the Valmiki Ramayana
let netX, netY, netW, netH, cardY, wide;

function groupOf(n) { return groups.find(g => g.key === n.group); }
function nodeById(id) { return nodes.find(n => n.id === id); }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  langSelect = createSelect();
  const allLangs = [];
  for (const n of nodes) for (const l of n.langs) if (!allLangs.includes(l)) allLangs.push(l);
  allLangs.sort();
  langSelect.option('All languages');
  for (const l of allLangs) langSelect.option(l);
  langSelect.selected('All languages');

  linksCheckbox = createCheckbox(' Show all links', true);

  resetButton = createButton('Reset');
  resetButton.mousePressed(() => {
    selected = 0;
    langSelect.selected('All languages');
    linksCheckbox.checked(true);
  });

  placeControls();

  describe('A story web. About thirty works and writers of South Asian literature are dots arranged left to right by era, from before 1 CE to today, and colored by language group. Lines link works that retell, translate or answer each other, such as the Valmiki Ramayana to Tamil, Bangla, Awadhi, Nepali and Javanese tellings, and the Panchatantra to Kalila wa Dimna. Selecting a dot shows a card with its language, date, place, a one-line summary and its links. A menu filters the web by language.');
}

function placeControls() {
  const narrow = canvasWidth < 520;
  langSelect.position(10, drawHeight + 10);
  resetButton.position(narrow ? 10 : 330, narrow ? drawHeight + 50 : drawHeight + 10);
  linksCheckbox.position(narrow ? 90 : 175, narrow ? drawHeight + 52 : drawHeight + 12);
}

function computeLayout() {
  wide = canvasWidth >= 620;
  netX = margin;
  netY = 64;
  netW = canvasWidth - 2 * margin;
  netH = wide ? 340 : 270;
  cardY = netY + netH + legendHeight() + 8;
}

function legendHeight() {
  // legend chips wrap onto rows; compute how many rows
  textSize(14);
  let x = 0, rows = 1;
  for (const g of groups) {
    const w = 22 + textWidth(g.name) + 14;
    if (x + w > netW && x > 0) { rows++; x = 0; }
    x += w;
  }
  return 26 + rows * 20;
}

// node position on screen
function nodePos(n) {
  const colW = netW / eras.length;
  const inCol = nodes.filter(m => m.era === n.era);
  const k = inCol.indexOf(n);
  const top = netY + 34, bottom = netY + netH - 14;
  const y = inCol.length === 1 ? (top + bottom) / 2 : top + k * (bottom - top) / (inCol.length - 1);
  const x = netX + n.era * colW + (wide ? 16 : colW / 2);
  return { x, y };
}

function matchesFilter(n) {
  const v = langSelect.value();
  return v === 'All languages' || n.langs.includes(v);
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
  drawNetwork();
  drawLegend();
  drawCard();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Story Web: How Stories Travel';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Click a dot to read its card. Lines show retellings, translations and answers.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Tap a dot to read its card and see its links.';
  text(instr, canvasWidth / 2, 38);
}

function drawNetwork() {
  // panel and era columns
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(netX, netY, netW, netH, 6);
  const colW = netW / eras.length;
  for (let i = 0; i < eras.length; i++) {
    const x = netX + i * colW;
    noStroke();
    fill(i % 2 === 0 ? '#FBF3E4' : '#FFFFFF');
    rect(x + 1, netY + 1, colW - 2, netH - 2, 4);
    fill(NAVY);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(14);
    const lab = textWidth(eras[i].long) < colW - 6 ? eras[i].long : eras[i].short;
    text(lab, x + colW / 2, netY + 8);
    textStyle(NORMAL);
  }

  const sel = nodes[selected];
  const showAll = linksCheckbox.checked();

  // links
  for (const L of links) {
    const a = nodeById(L[0]), b = nodeById(L[1]);
    const pa = nodePos(a), pb = nodePos(b);
    const touches = (a === sel || b === sel);
    const visible = matchesFilter(a) || matchesFilter(b);
    if (!touches && !showAll) continue;
    noFill();
    if (touches) { stroke(SAFFRON); strokeWeight(3); }
    else { stroke(visible ? '#B9B1A4' : '#E6E0D6'); strokeWeight(1.5); }
    const mx = (pa.x + pb.x) / 2;
    bezier(pa.x, pa.y, mx, pa.y, mx, pb.y, pb.x, pb.y);
  }

  // nodes
  const r = wide ? 9 : 8;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const p = nodePos(n);
    const g = groupOf(n);
    const on = matchesFilter(n);
    const linked = isLinked(sel, n);
    if (i === selected) {
      stroke(SAFFRON); strokeWeight(4);
    } else if (linked) {
      stroke(GOLD); strokeWeight(3);
    } else {
      stroke('white'); strokeWeight(2);
    }
    const c = color(g.color);
    if (!on) c.setAlpha(60);
    fill(c);
    circle(p.x, p.y, 2 * r);

    // labels: always in wide mode; in narrow mode only selected and linked
    if (wide || i === selected) {
      noStroke();
      textSize(14);
      textStyle(i === selected ? BOLD : NORMAL);
      let lab = n.label;
      let lx, align;
      if (wide) {
        const maxW = colW - 2 * r - 8;
        while (textWidth(lab) > maxW && lab.length > 4) lab = lab.slice(0, -2);
        if (lab !== n.label) lab = lab.trim() + '.';
        lx = p.x + r + 5; align = LEFT;
      } else {
        lx = p.x; align = CENTER;
      }
      textAlign(align, CENTER);
      const tw = textWidth(lab) + 6;
      const bx = align === LEFT ? lx - 3 : constrain(lx - tw / 2, netX + 2, netX + netW - tw - 2);
      const by = wide ? p.y - 10 : (p.y - 30 < netY + 28 ? p.y + 12 : p.y - 30);
      fill(255, 255, 255, on ? 225 : 150);
      rect(bx, by, tw, 20, 4);
      fill(on ? '#222222' : '#9A9A9A');
      text(lab, align === LEFT ? lx : bx + tw / 2, by + 10);
      textStyle(NORMAL);
    }
  }
}

function isLinked(a, b) {
  return links.some(L => (L[0] === a.id && L[1] === b.id) || (L[1] === a.id && L[0] === b.id));
}

function drawLegend() {
  let x = netX, y = netY + netH + 8;
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  fill('#333333');
  text('Dot color = language group', x, y);
  y += 20;
  for (const g of groups) {
    const w = 22 + textWidth(g.name) + 14;
    if (x + w > netX + netW && x > netX) { x = netX; y += 20; }
    fill(g.color);
    circle(x + 7, y + 8, 12);
    fill('#222222');
    text(g.name, x + 18, y);
    x += w;
  }
}

function drawCard() {
  const n = nodes[selected];
  const g = groupOf(n);
  const cx = netX, cw = netW, ch = drawHeight - cardY - 8;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(cx, cardY, cw, ch, 6);
  // color strip
  noStroke();
  fill(g.color);
  rect(cx, cardY, 8, ch, 6, 0, 0, 6);

  const pad = 16;
  let y = cardY + 10;
  const tw = cw - pad - 12;
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  fill(SAFFRON);
  text(n.label, cx + pad, y);
  y += 26;

  textSize(14);
  const rows = [
    ['Language: ', n.langs.join(' and ')],
    ['When: ', n.date],
    ['Where: ', n.place]
  ];
  for (const r of rows) y = labeledWrap(r[0], r[1], cx + pad, y, tw);
  y += 2;
  textStyle(NORMAL);
  fill('#222222');
  for (const line of wrapLines(n.sum, tw)) { text(line, cx + pad, y); y += 18; }
  y += 4;

  // links list
  const mine = links.filter(L => L[0] === n.id || L[1] === n.id);
  textStyle(BOLD);
  fill(TEAL);
  if (mine.length === 0) {
    text('No links drawn yet. Can you think of one?', cx + pad, y);
  } else {
    if (!wide) {
      const names = mine.map(L => nodeById(L[0] === n.id ? L[1] : L[0]).label).join(', ');
      const lines = wrapLines('Linked to: ' + names, tw);
      textStyle(NORMAL);
      fill('#222222');
      for (const line of lines) { text(line, cx + pad, y); y += 18; }
      return;
    }
    text('Linked to:', cx + pad, y);
    y += 18;
    textStyle(NORMAL);
    fill('#222222');
    for (const L of mine) {
      const other = nodeById(L[0] === n.id ? L[1] : L[0]);
      const lines = wrapLines('- ' + other.label + ': ' + L[2], tw);
      for (const line of lines) {
        if (y > cardY + ch - 20) break;
        text(line, cx + pad, y);
        y += 18;
      }
    }
  }
  textStyle(NORMAL);
}

function labeledWrap(label, value, x, y, maxW) {
  textStyle(BOLD);
  fill(NAVY);
  const lw = textWidth(label);
  textStyle(NORMAL);
  const lines = wrapLines(value, maxW - lw);
  textStyle(BOLD);
  fill(NAVY);
  text(label, x, y);
  textStyle(NORMAL);
  fill('#222222');
  for (let k = 0; k < lines.length; k++) {
    text(lines[k], x + lw, y);
    y += 18;
  }
  return y;
}

function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur === '' ? w : cur + ' ' + w;
    if (textWidth(t) > maxW && cur !== '') { lines.push(cur); cur = w; }
    else cur = t;
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function pickNode(mx, my) {
  if (my < netY || my > netY + netH) return -1;
  let best = -1, bestD = 18;
  for (let i = 0; i < nodes.length; i++) {
    const p = nodePos(nodes[i]);
    const d = dist(mx, my, p.x, p.y);
    if (d < bestD) { bestD = d; best = i; }
  }
  // in wide mode, a click on a label also selects
  if (best < 0 && wide) {
    const colW = netW / eras.length;
    for (let i = 0; i < nodes.length; i++) {
      const p = nodePos(nodes[i]);
      if (mx > p.x && mx < p.x + colW - 20 && abs(my - p.y) < 10) return i;
    }
  }
  return best;
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  const i = pickNode(mouseX, mouseY);
  if (i >= 0) selected = i;
}

function touchStarted() {
  if (touches.length > 0) {
    const t = touches[0];
    if (t.y >= 0 && t.y <= drawHeight) {
      const i = pickNode(t.x, t.y);
      if (i >= 0) { selected = i; return false; }
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
