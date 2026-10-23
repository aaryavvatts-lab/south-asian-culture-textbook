// Thali Builder (Roots & Rivers, Chapter 8: Food and the Table)
// CANVAS_HEIGHT = 650 (drawHeight 560 + controlHeight 90); iframe height 652px
// A round thali with a staple in the center and six katori (small bowls).
// Choose a region to refill the plate; click or tap the center or any katori
// to read about it. The checkbox swaps the main katori between a common
// vegetarian dish and a common non-vegetarian dish from the same region.
// Each plate is one common example, not the only meal a region eats.
// No map and no borders are drawn.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let regionSelect, prevButton, nextButton, nonvegCheckbox;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const BROWN = '#8B4513';

// Slot order around the plate (clockwise from the top)
const SLOTS = ['dal', 'veg', 'main', 'extra', 'sweet', 'spice'];
const SLOT_LABEL = { staple: 'Staple', dal: 'Dal', veg: 'Veg', main: 'Main', extra: 'Side', sweet: 'Sweet', spice: 'Spices' };
const SLOT_LONG = { staple: 'Staple grain', dal: 'Dal (lentils)', veg: 'Vegetable', main: 'Main dish', extra: 'Side', sweet: 'Sweet', spice: 'Main spices' };

// Food colors (named or hex), roughly the color of each dish
const regions = [
  {
    name: 'Punjab', where: 'Pakistan and India',
    why: 'Wheat country: cool winters and irrigated plains along the Indus and its tributaries. Dairy is important. Punjabi food is shared on both sides of the border.',
    staple: { name: 'Roti (wheat flatbread)', short: 'Roti', color: '#E8C48A', note: 'Whole-wheat bread cooked on a tava. In winter many families eat makki di roti, made from maize, a crop from the Americas.' },
    dal: { name: 'Black urad dal', color: '#5A3A2A', note: 'Whole black lentils slow-cooked for hours. The rich dal makhani is usually credited to Punjabi cooks from Peshawar who settled in Delhi in the 1950s.' },
    veg: { name: 'Sarson da saag', color: '#4F7F3A', note: 'Mustard greens cooked down with spices, a winter favorite, eaten with maize bread.' },
    mainVeg: { name: 'Chole (chickpeas)', color: '#B5651D', note: 'Chickpeas simmered in a tangy, spiced onion and tomato gravy.' },
    mainNon: { name: 'Chicken karahi', color: '#B23A1E', note: 'Chicken cooked fast in a karahi, a deep wok-like pan, with tomato, ginger and green chili. Popular in Pakistan and India.' },
    extra: { name: 'Lassi or raita', color: 'white', note: 'Yogurt, either as a cool drink (lassi) or mixed with vegetables or herbs (raita), to balance the spice.' },
    sweet: { name: 'Kheer', color: '#F3E5C8', note: 'Rice slowly cooked in milk with sugar and cardamom.' },
    spice: { name: 'Cumin, garam masala, ginger, garlic, green chili', color: '#C77B30', note: 'A tadka of cumin, onion, garlic and dried red chili is common.' }
  },
  {
    name: 'Bengal', where: 'Bangladesh and India (West Bengal)',
    why: 'Rice and fish country: the wet, warm delta of the Ganga and Brahmaputra floods every monsoon. Rivers and ponds are full of fish.',
    staple: { name: 'Bhat (boiled rice)', short: 'Rice', color: 'white', note: 'Rice grows well in the flooded fields of the delta and is eaten at almost every meal.' },
    dal: { name: 'Masoor dal', color: '#E9A23B', note: 'Split red lentils, light and soupy, often tempered with panch phoron or nigella seeds.' },
    veg: { name: 'Shukto', color: '#9DB57A', note: 'A mixed vegetable stew, one of the classic vegetable dishes of Bengali cooking.' },
    mainVeg: { name: 'Begun bhaja and mixed vegetables', color: '#6B3E75', note: 'Crisp fried eggplant slices and a vegetable curry, eaten with rice and dal.' },
    mainNon: { name: 'Ilish (hilsa) in mustard', color: '#D9B44A', note: 'The ilish is the national fish of Bangladesh. Bangladesh catches most of the world\'s supply.' },
    extra: { name: 'Bhorta and pickle', color: '#C9A06A', note: 'Mashed vegetables or fish mixed with mustard oil, onion and chili, plus a tangy pickle.' },
    sweet: { name: 'Mishti doi or roshogolla', color: '#F5D7B0', note: 'Sweet set yogurt (famous in Bogura) or spongy cheese balls in syrup.' },
    spice: { name: 'Panch phoron, mustard and mustard oil, turmeric', color: '#D4A017', note: 'Panch phoron is five whole seeds: fenugreek, cumin, nigella, black mustard and fennel.' }
  },
  {
    name: 'Kerala', where: 'India (southwest coast)',
    why: 'Heavy monsoon rain, rice paddies and coconut palms. For centuries traders sailed here for black pepper and other spices.',
    staple: { name: 'Red rice', short: 'Rice', color: '#E3B7A0', note: 'Kerala red rice is used for the sadya, the festival feast served on a banana leaf.' },
    dal: { name: 'Parippu or sambar', color: '#E2B33C', note: 'Moong dal with ghee (parippu), or sambar, a lentil and vegetable stew soured with tamarind.' },
    veg: { name: 'Avial', color: '#E8E0B0', note: 'A thick stew of many vegetables with coconut, finished with coconut oil and curry leaves.' },
    mainVeg: { name: 'Thoran', color: '#7FAF5A', note: 'Finely chopped vegetables stir-fried with grated coconut and mustard seeds.' },
    mainNon: { name: 'Meen curry (fish curry)', color: '#C0392B', note: 'Fish cooked in a spiced, often sour gravy. Kerala\'s long coast and backwaters supply plenty of fish.' },
    extra: { name: 'Pickle and papadam', color: '#E6C27A', note: 'A sharp mango or lime pickle and a crisp papadam add crunch.' },
    sweet: { name: 'Payasam', color: '#C68E4E', note: 'A sweet pudding, often made with jaggery and coconut milk or with milk and rice.' },
    spice: { name: 'Black pepper, curry leaves, mustard seed, coconut', color: '#3E8E5E', note: 'Coconut oil and coconut appear in almost every dish.' }
  },
  {
    name: 'Gujarat', where: 'India (west)',
    why: 'Dry land where millet and wheat grow well. Many Gujarati families, including Jain families, are vegetarian, and many dishes are a little sweet.',
    staple: { name: 'Rotli, rice and bajra rotla', short: 'Rotli', color: '#E8C48A', note: 'Thin wheat rotli and rice every day; thick pearl millet bread (bajra rotla) in villages in winter.' },
    dal: { name: 'Gujarati dal', color: '#F2C14E', note: 'A thin dal that is a little sweet and a little sour, with jaggery and lemon.' },
    veg: { name: 'Shaak or undhiyu', color: '#6E9B45', note: 'A vegetable dish. In winter, undhiyu mixes many seasonal vegetables cooked together.' },
    mainVeg: { name: 'Kadhi', color: '#F6E27F', note: 'A yogurt and chickpea flour curry, tangy and gently sweet.' },
    mainNon: { name: 'Fish (coastal families)', color: '#C0392B', note: 'Many Gujarati families are vegetarian, but others eat meat or fish, and some coastal communities, such as the Kharwa, cook fresh and dried fish.' },
    extra: { name: 'Farsan: dhokla', color: '#F7E08A', note: 'A steamed savory cake of fermented batter, one of many farsan (snacks) on a thali.' },
    sweet: { name: 'Shrikhand', color: '#F6D58E', note: 'Thick strained yogurt sweetened with sugar and flavored with cardamom or saffron.' },
    spice: { name: 'Mustard seed, cumin, asafoetida (hing), jaggery', color: '#B8860B', note: 'The vaghar (tadka) often uses hing, which helps replace onion and garlic in Jain cooking.' }
  },
  {
    name: 'Sindh', where: 'Pakistan (lower Indus valley)',
    why: 'Hot, dry land watered by the Indus. Rice grows near the river and wheat in winter. Most Sindhis in Pakistan are Muslim and eat halal meat.',
    staple: { name: 'Rice and wheat flatbread', short: 'Rice', color: 'white', note: 'An everyday Sindhi meal is wheat flatbread or rice with a gravy dish and a dry dish.' },
    dal: { name: 'Yellow dal', color: '#F2C14E', note: 'Plain yellow dal with rice (dal chawar) is a common comfort meal.' },
    veg: { name: 'Sai bhaji', color: '#4F7F3A', note: 'Spinach and other greens cooked with lentils and vegetables, served with rice.' },
    mainVeg: { name: 'Sindhi kadhi', color: '#F6E27F', note: 'A gram flour curry full of vegetables, served with rice.' },
    mainNon: { name: 'Sindhi biryani', color: '#D35400', note: 'Meat or fish layered with rice, potatoes, tomatoes and yogurt. One of the most popular dishes in Pakistan.' },
    extra: { name: 'Papad, pickle and yogurt', color: '#E6C27A', note: 'A crisp papad, pickle or plain yogurt rounds out the meal.' },
    sweet: { name: 'Tairee', color: '#C68E4E', note: 'Sweet rice cooked with jaggery, raisins and coconut.' },
    spice: { name: 'Chili, turmeric, coriander, cumin', color: '#B03A2E', note: 'Potatoes and tomatoes, both from the Americas, are now basic Sindhi ingredients.' }
  },
  {
    name: 'Sri Lanka', where: 'Sri Lanka',
    why: 'A tropical island of rice paddies, coconut palms and fishing boats. Cinnamon drew Portuguese, Dutch and British traders.',
    staple: { name: 'Rice (or hoppers)', short: 'Rice', color: 'white', note: '"Rice and curry" means rice with several small curries. Hoppers are bowl-shaped pancakes of fermented rice batter and coconut milk.' },
    dal: { name: 'Parippu', color: '#E9A23B', note: 'A dal of red lentils, often cooked with coconut milk.' },
    veg: { name: 'Gotukola sambol', color: '#5DA64F', note: 'A fresh salad of finely cut gotukola (pennywort) leaves with coconut and lime.' },
    mainVeg: { name: 'Vegetable curry', color: '#E0A84E', note: 'A curry of jackfruit, beans or squash in coconut milk with curry leaves and pandan.' },
    mainNon: { name: 'Fish curry', color: '#A93226', note: 'Fish such as tuna cooked with spices; many recipes are soured with goraka, a dried fruit.' },
    extra: { name: 'Pol sambol', color: '#E8746A', note: 'Grated coconut, shallots, chili, lime and salt, pounded together.' },
    sweet: { name: 'Watalappam', color: '#8B5A2B', note: 'A coconut and jaggery custard linked to Sri Lanka\'s Malay community.' },
    spice: { name: 'Ceylon cinnamon, curry leaves, pandan, black pepper', color: '#A0522D', note: 'Maldive fish (dried tuna) adds a savory flavor to many dishes.' }
  },
  {
    name: 'Nepal', where: 'Nepal (hills)',
    why: 'Mountain farming on terraces. Rice grows in the valleys; higher up, people grow maize, millet, buckwheat and barley.',
    staple: { name: 'Bhat (rice) or dhido', short: 'Rice', color: 'white', note: 'Dal bhat is the everyday meal for many. In high areas, dhido, a thick porridge of millet, maize or buckwheat, is the staple.' },
    dal: { name: 'Dal with jimbu', color: '#E2B33C', note: 'Lentils flavored with jimbu, a dried Himalayan herb fried in ghee.' },
    veg: { name: 'Tarkari', color: '#7FAF5A', note: 'A vegetable curry, often potato, cauliflower or greens.' },
    mainVeg: { name: 'Saag', color: '#3F7A34', note: 'Leafy greens cooked with garlic and chili.' },
    mainNon: { name: 'Masu (goat or chicken curry)', color: '#A0522D', note: 'A meat curry, often goat or chicken, served with rice.' },
    extra: { name: 'Achar and gundruk', color: '#C0392B', note: 'A sharp pickle, and gundruk: leafy greens fermented and dried to keep through winter.' },
    sweet: { name: 'Sel roti', color: '#C68E4E', note: 'A ring of fried rice-flour bread, made for the festivals Dashain and Tihar.' },
    spice: { name: 'Timur, jimbu, cumin, turmeric', color: '#7B5E3B', note: 'Timur is a tingly, citrusy relative of Sichuan pepper.' }
  }
];

let current = 1;       // start with Bengal
let selectedSlot = 'staple';
let plateCx, plateCy, plateR, px, py, pw, ph, wide;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  regionSelect = createSelect();
  for (let r of regions) regionSelect.option(r.name);
  regionSelect.selected(regions[current].name);
  regionSelect.changed(() => {
    current = regions.findIndex(r => r.name === regionSelect.value());
    selectedSlot = 'staple';
  });

  prevButton = createButton('Previous');
  prevButton.mousePressed(() => stepRegion(-1));
  nextButton = createButton('Next');
  nextButton.mousePressed(() => stepRegion(1));

  nonvegCheckbox = createCheckbox(' Non-vegetarian version', false);
  nonvegCheckbox.changed(() => { selectedSlot = 'main'; });

  positionControls();

  describe('A round metal thali plate with a staple grain in the center and six small bowls around it: dal, vegetable, main dish, side, sweet and spices. A menu chooses one of seven regions (Punjab, Bengal, Kerala, Gujarat, Sindh, Sri Lanka, Nepal). Selecting a bowl shows the dish name and a short note, and a panel explains how the region\'s grain, climate and trade shape its food. A checkbox switches the main dish between vegetarian and non-vegetarian examples.');
}

function positionControls() {
  regionSelect.position(10, drawHeight + 10);
  prevButton.position(120, drawHeight + 10);
  nextButton.position(200, drawHeight + 10);
  nonvegCheckbox.position(10, drawHeight + 52);
}

function stepRegion(d) {
  current = (current + d + regions.length) % regions.length;
  regionSelect.selected(regions[current].name);
  selectedSlot = 'staple';
}

function computeLayout() {
  wide = canvasWidth >= 700;
  const top = 66;
  if (wide) {
    const size = min(canvasWidth * 0.52, drawHeight - top - 20);
    plateR = size / 2;
    plateCx = margin + plateR + 10;
    plateCy = top + plateR + 4;
    px = plateCx + plateR + 24;
    py = top;
    pw = canvasWidth - px - margin;
    ph = drawHeight - top - margin;
  } else {
    const size = min(canvasWidth - 2 * margin, 250);
    plateR = size / 2;
    plateCx = canvasWidth / 2;
    plateCy = top + plateR + 2;
    px = margin;
    py = plateCy + plateR + 10;
    pw = canvasWidth - 2 * margin;
    ph = drawHeight - py - margin;
  }
}

function slotPos(i) {
  const a = -HALF_PI + i * TWO_PI / SLOTS.length;
  return { x: plateCx + cos(a) * plateR * 0.64, y: plateCy + sin(a) * plateR * 0.64 };
}

function itemFor(slot) {
  const r = regions[current];
  if (slot === 'main') return nonvegCheckbox.checked() ? r.mainNon : r.mainVeg;
  return r[slot];
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
  drawPlate();
  drawPanel();
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = 'Thali Builder: Regional Plates of South Asia';
  while (textWidth(title) > canvasWidth - 20 && ts > 15) {
    ts--;
    textSize(ts);
  }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Pick a region, then click the center or any bowl to learn what is in it.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Pick a region. Tap a bowl to learn more.';
  text(instr, canvasWidth / 2, 40);
}

function drawPlate() {
  // plate rim and body
  noStroke();
  fill('#B9BEC4');
  circle(plateCx, plateCy, plateR * 2 + 6);
  fill('#E4E7EA');
  circle(plateCx, plateCy, plateR * 2 - 6);
  fill('#D3D7DB');
  circle(plateCx, plateCy, plateR * 2 - 18);

  // center staple
  const st = regions[current].staple;
  const cr = plateR * 0.30;
  stroke(selectedSlot === 'staple' ? SAFFRON : 'white');
  strokeWeight(selectedSlot === 'staple' ? 4 : 2);
  fill(st.color);
  circle(plateCx, plateCy, cr * 2);
  noStroke();
  fill(NAVY);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(15);
  text(st.short, plateCx, plateCy);
  textStyle(NORMAL);

  // katori
  const kr = plateR * 0.22;
  for (let i = 0; i < SLOTS.length; i++) {
    const s = SLOTS[i];
    const p = slotPos(i);
    const it = itemFor(s);
    // bowl rim
    stroke(selectedSlot === s ? SAFFRON : '#9AA0A6');
    strokeWeight(selectedSlot === s ? 4 : 2);
    fill('#C7CCD1');
    circle(p.x, p.y, kr * 2 + 6);
    noStroke();
    fill(it.color);
    circle(p.x, p.y, kr * 2 - 4);
    // label on a small white tag so it reads on any food color
    textSize(14);
    textStyle(BOLD);
    const lab = SLOT_LABEL[s];
    const tw = textWidth(lab) + 8;
    fill(255, 255, 255, 225);
    rect(p.x - tw / 2, p.y - 10, tw, 20, 4);
    fill(NAVY);
    text(lab, p.x, p.y);
    textStyle(NORMAL);
    // veg / non-veg marker on the main bowl
    if (s === 'main') {
      const nv = nonvegCheckbox.checked();
      const mx = p.x + kr * 0.75, my = p.y - kr * 0.85;
      stroke(nv ? BROWN : LEAF);
      strokeWeight(2);
      fill('white');
      rect(mx - 7, my - 7, 14, 14);
      noStroke();
      fill(nv ? BROWN : LEAF);
      circle(mx, my, 7);
    }
  }
}

function drawPanel() {
  const r = regions[current];
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 8);

  noStroke();
  textAlign(LEFT, TOP);
  let y = py + 8;
  const x = px + 10;
  const w = pw - 20;
  const lh = 18;

  fill(SAFFRON);
  textStyle(BOLD);
  textSize(18);
  text(r.name, x, y);
  const nameW = textWidth(r.name);
  textStyle(NORMAL);
  textSize(14);
  fill('#555555');
  if (nameW + textWidth(r.where) + 20 < w) {
    text(r.where, x + nameW + 10, y + 3);
    y += 26;
  } else {
    y += 24;
    text(r.where, x, y);
    y += 20;
  }

  fill(TEAL);
  textStyle(BOLD);
  text('Why here?', x, y);
  textStyle(NORMAL);
  y += lh;
  fill('#222222');
  for (let line of wrapLines(r.why, w)) { text(line, x, y); y += lh; }

  y += 6;
  stroke(GOLD);
  strokeWeight(2);
  line(x, y, x + w, y);
  noStroke();
  y += 8;

  const it = itemFor(selectedSlot);
  fill(NAVY);
  textStyle(BOLD);
  textSize(14);
  let head = SLOT_LONG[selectedSlot] + ': ' + it.name;
  if (selectedSlot === 'main') head += nonvegCheckbox.checked() ? ' (non-veg)' : ' (veg)';
  for (let line of wrapLines(head, w)) { text(line, x, y); y += lh; }
  textStyle(NORMAL);
  fill('#222222');
  for (let line of wrapLines(it.note, w)) { text(line, x, y); y += lh; }

  if (wide) {
    y += 8;
    stroke(GOLD);
    strokeWeight(2);
    line(x, y, x + w, y);
    noStroke();
    y += 8;
    fill(TEAL);
    textStyle(BOLD);
    text('On this plate', x, y);
    textStyle(NORMAL);
    y += lh + 2;
    const all = ['staple'].concat(SLOTS);
    for (let sl of all) {
      if (y > py + ph - 3 * lh) break;
      const itm = itemFor(sl);
      fill(sl === selectedSlot ? SAFFRON : NAVY);
      textStyle(BOLD);
      const lab = SLOT_LABEL[sl] + ': ';
      text(lab, x, y);
      const lw = textWidth(lab);
      textStyle(NORMAL);
      fill('#222222');
      const ls = wrapLines(itm.name, w - lw);
      for (let k = 0; k < ls.length; k++) { text(ls[k], x + lw, y); y += lh; }
    }
    y += 6;
    fill('#666666');
    for (let line of wrapLines('One common example per region. Real families cook many more dishes.', w)) { text(line, x, y); y += lh; }
  }
}

function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (let wd of words) {
    const t = cur === '' ? wd : cur + ' ' + wd;
    if (textWidth(t) > maxW && cur !== '') { lines.push(cur); cur = wd; }
    else cur = t;
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;
  if (dist(mouseX, mouseY, plateCx, plateCy) < plateR * 0.30) { selectedSlot = 'staple'; return; }
  const kr = plateR * 0.22;
  for (let i = 0; i < SLOTS.length; i++) {
    const p = slotPos(i);
    if (dist(mouseX, mouseY, p.x, p.y) < kr + 4) { selectedSlot = SLOTS[i]; return; }
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
