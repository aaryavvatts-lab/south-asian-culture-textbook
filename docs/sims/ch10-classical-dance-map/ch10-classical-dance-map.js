// Classical Dance Map (Roots & Rivers, Chapter 10)
// CANVAS_HEIGHT = 800 (drawHeight 680 + controlHeight 120); iframe height 802px
// View 1: a schematic tile map with the eight classical dances recognized by
// India's Sangeet Natak Akademi in roughly their home regions, an optional
// Chhau tile (Ministry of Culture list), and a "Beyond India" row.
// View 2: six single-hand mudras drawn with simple shapes, with meanings from
// the Abhinaya Darpana (Coomaraswamy and Duggirala translation, 1917).
// Nothing here is drawn to scale and no borders are drawn.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 680;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let mapButton, handButton, itemSelect, chhauCheckbox;
let view = 'map'; // 'map' or 'hands'

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';
const SKIN = '#E8B58C';
const SKIN_DARK = '#B97A4E';

// Classical dances (Sangeet Natak Akademi list) and Chhau.
// cx, cy are rough positions in map units (0..1). Not to scale.
const dances = [
  { name: 'Kathak', cx: 0.40, cy: 0.24, kind: 'classical',
    region: 'North India (Uttar Pradesh, Rajasthan and beyond); also danced in Pakistan and Bangladesh',
    features: 'Grew from traveling storytellers and royal courts. Straight legs, fast spins, footwork that trades rhythms with the tabla.',
    costume: 'A full skirt (lehenga) or flared tunic (anarkali), or a sari; ankle bells (ghungroo).' },
  { name: 'Sattriya', cx: 0.78, cy: 0.24, kind: 'classical',
    region: 'Assam (northeast India)',
    features: 'Began in Vaishnava monasteries (sattras) after Sankardev, 1400s-1500s. Krishna stories. Recognized in 2000, the newest of the eight.',
    costume: 'Traditionally white or raw-silk colors, often in Assam silk; Assamese gold jewelry.' },
  { name: 'Manipuri', cx: 0.83, cy: 0.37, kind: 'classical',
    region: 'Manipur (northeast India); also Sylhet, Bangladesh',
    features: 'Soft, rounded, flowing moves with no hard stamping. Raas Leela dances about Krishna and Radha.',
    costume: 'Stiff, barrel-shaped mirrored skirt (potloi) that makes dancers seem to float.' },
  { name: 'Odissi', cx: 0.62, cy: 0.49, kind: 'classical',
    region: 'Odisha (east coast of India)',
    features: 'Poses like temple carvings: the S-shaped tribhangi and the square chauka. Poems such as the Gita Govinda.',
    costume: 'Bright local silk sari, silver jewelry, hair in a bun shaped like a temple spire.' },
  { name: 'Kuchipudi', cx: 0.50, cy: 0.60, kind: 'classical',
    region: 'Andhra Pradesh (named after a village there)',
    features: 'Began as all-male dance-drama. Fast, bouncy, lots of acting, Telugu songs. Tarangam: dancing on a brass plate rim.',
    costume: 'Silk costume with a pleated fan, ankle bells, kohl-lined eyes.' },
  { name: 'Bharatanatyam', cx: 0.60, cy: 0.80, kind: 'classical',
    region: 'Tamil Nadu (south India)',
    features: 'Half-sitting bent-knee stance (aramandi), steady torso, sharp geometric lines. Renamed from Sadir in 1932.',
    costume: 'Silk sari-style costume with a pleated fan that opens when the knees bend; ankle bells.' },
  { name: 'Kathakali', cx: 0.27, cy: 0.72, kind: 'classical',
    region: 'Kerala (southwest India)',
    features: 'All-night dance-drama, traditionally by men. Actors speak only with mudras, eyes and face while singers tell the story.',
    costume: 'Painted faces (green pacha for heroes), huge skirts and tall crowns.' },
  { name: 'Mohiniyattam', cx: 0.30, cy: 0.90, kind: 'classical',
    region: 'Kerala (southwest India)',
    features: 'Gentle, swaying solo dance, traditionally by women. Named after Mohini, a form of Vishnu.',
    costume: 'Ivory-white sari with gold border; hair in a round bun to one side.' },
  { name: 'Chhau', cx: 0.50, cy: 0.37, kind: 'chhau',
    region: 'Eastern India: Seraikella (Jharkhand), Purulia (West Bengal), Mayurbhanj (Odisha)',
    features: 'On the Ministry of Culture list, not the Akademi list of eight. Dance plus martial-arts moves, traditionally by men. UNESCO list, 2010.',
    costume: 'Seraikella and Purulia styles use masks; Purulia masks are large and bright.' }
];

// Beyond India row
const beyond = [
  { name: 'Kandyan', sub: 'Sri Lanka', kind: 'beyond',
    region: 'Hill country around Kandy, Sri Lanka',
    features: 'High leaps and spins, mostly to drums led by the geta bera. 18 classic vannam dances describe animals and ideas.',
    costume: 'The ves costume: shining metal headdress, beaded chest net, rattling anklets.' },
  { name: 'Attan', sub: 'Afghanistan', kind: 'beyond',
    region: 'Pashtun regions of Afghanistan and Pakistan; Afghan communities worldwide',
    features: 'Widely called the national dance of Afghanistan. A big circle that claps and spins around the dhol drum, slow to fast.',
    costume: 'Everyday or festive clothes; some dancers wave handkerchiefs.' },
  { name: 'Bhangra and Luddi', short: 'Bhangra', sub: 'Punjab', kind: 'beyond',
    region: 'Punjab, in both India and Pakistan',
    features: 'Harvest dances. Bhangra: leaps, kicks and shoulder moves to the dhol. Luddi: circle dance with claps and half-turns.',
    costume: 'Colorful festive Punjabi clothes; the dhol drummer sets the beat.' },
  { name: 'Manipuri', sub: 'Bangladesh', kind: 'beyond',
    region: 'Sylhet, Bangladesh, among Manipuri communities',
    features: 'The same classical style as in Manipur. In 1919 Rabindranath Tagore saw it in Sylhet and helped spread it across Bengal.',
    costume: 'The same mirrored potloi skirt for women dancers.' }
];

// Six single-hand mudras (Abhinaya Darpana). Finger order: index, middle, ring, little.
// ext: 1 extended, 0 folded. ang: tilt in radians. thumb: 'fold', 'out', 'ring'
const mudras = [
  { name: 'Pataka', means: 'Flag', ext: [1, 1, 1, 1], ang: [-0.04, 0, 0.03, 0.06], thumb: 'fold',
    shape: 'Fingers straight and pressed together; thumb bent in.',
    uses: 'Clouds, forest, waves, a blessing, saying "Go!"' },
  { name: 'Tripataka', means: 'Three parts of the flag', ext: [1, 1, 0, 1], ang: [-0.04, 0, 0, 0.06], thumb: 'fold',
    shape: 'Like Pataka, but the ring finger is bent.',
    uses: 'A crown, a tree, an arrow, a lamp flame' },
  { name: 'Ardhapataka', means: 'Half flag', ext: [1, 1, 0, 0], ang: [-0.04, 0, 0, 0], thumb: 'fold',
    shape: 'Like Tripataka, with the little finger also bent.',
    uses: 'Young leaves, a knife, a tower, a riverbank' },
  { name: 'Kartarimukha', means: 'Scissors face', ext: [1, 1, 0, 0], ang: [-0.32, 0.22, 0, 0], thumb: 'fold',
    shape: 'First two fingers spread like scissor blades; others folded.',
    uses: 'Separation, lightning, the corner of the eye' },
  { name: 'Mayura', means: 'Peacock', ext: [1, 1, 0, 1], ang: [-0.12, 0, 0, 0.2], thumb: 'ring',
    shape: 'Ring finger touches the thumb tip; other fingers up.',
    uses: "A peacock's beak, wiping away tears, a mark on the forehead" },
  { name: 'Alapadma', means: 'Full-bloomed lotus', ext: [1, 1, 1, 1], ang: [-0.55, -0.2, 0.15, 0.5], thumb: 'out',
    shape: 'All fingers spread and curved, like a lotus opening.',
    uses: 'A blooming lotus, the full moon, a mirror, praise' }
];

let selectedMap = 5;   // Bharatanatyam
let selectedHand = 0;  // Pataka

// layout, recalculated each frame
let wide, mx, my, mw, mh, rowY, rowH, px, py, pw, ph;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  mapButton = createButton('Dance map');
  mapButton.mousePressed(() => setView('map'));
  handButton = createButton('Hand gestures');
  handButton.mousePressed(() => setView('hands'));

  itemSelect = createSelect();
  itemSelect.changed(onSelect);

  chhauCheckbox = createCheckbox(' Show Chhau (Ministry of Culture list)', false);
  chhauCheckbox.changed(() => {
    if (!chhauCheckbox.checked() && selectedMap === 8) selectedMap = 5;
    fillSelect();
  });

  fillSelect();
  positionControls();

  describe('Classical Dance Map. A schematic tile map places the eight classical dances recognized by India\'s Sangeet Natak Akademi in roughly their home regions: Kathak in the north, Sattriya and Manipuri in the northeast, Odissi on the east coast, Kuchipudi and Bharatanatyam in the south, and Kathakali and Mohiniyattam in Kerala. A checkbox adds Chhau from the Ministry of Culture list. A Beyond India row shows Kandyan dance from Sri Lanka, Attan from Afghanistan and Pakistan, Bhangra and Luddi from Punjab, and Manipuri in Bangladesh. Selecting a tile shows its region, key features and costume. A second view draws six hand gestures, Pataka, Tripataka, Ardhapataka, Kartarimukha, Mayura and Alapadma, with their meanings.');
}

function setView(v) {
  view = v;
  fillSelect();
}

function fillSelect() {
  // rebuild the menu for the current view
  itemSelect.elt.innerHTML = '';
  if (view === 'map') {
    for (let i = 0; i < dances.length; i++) {
      if (dances[i].kind === 'chhau' && !chhauCheckbox.checked()) continue;
      itemSelect.option(dances[i].name, 'd' + i);
    }
    for (let i = 0; i < beyond.length; i++) itemSelect.option(beyond[i].name + ' (' + beyond[i].sub + ')', 'b' + i);
    itemSelect.selected(typeof selectedMap === 'number' ? 'd' + selectedMap : selectedMap);
    chhauCheckbox.show();
  } else {
    for (let i = 0; i < mudras.length; i++) itemSelect.option(mudras[i].name, 'm' + i);
    itemSelect.selected('m' + selectedHand);
    chhauCheckbox.hide();
  }
}

function onSelect() {
  const v = itemSelect.value();
  if (v[0] === 'd') selectedMap = parseInt(v.substring(1));
  else if (v[0] === 'b') selectedMap = v;
  else selectedHand = parseInt(v.substring(1));
}

function positionControls() {
  const y0 = drawHeight + 10;
  mapButton.position(10, y0);
  handButton.position(108, y0);
  if (canvasWidth >= 560) {
    itemSelect.position(236, y0);
    chhauCheckbox.position(10, y0 + 40);
  } else {
    itemSelect.position(10, y0 + 38);
    chhauCheckbox.position(10, y0 + 72);
  }
}

function computeLayout() {
  wide = canvasWidth >= 700;
  const top = 64;
  if (wide) {
    mx = margin; my = top;
    mw = Math.floor(canvasWidth * 0.58) - margin * 1.5;
    mh = 450;
    rowY = my + mh + 34; rowH = 64;
    px = mx + mw + margin; py = top;
    pw = canvasWidth - px - margin; ph = drawHeight - top - margin;
  } else {
    mx = margin; my = top;
    mw = canvasWidth - 2 * margin;
    mh = 300;
    rowY = my + mh + 30; rowH = 54;
    px = margin; py = rowY + rowH + 44;
    pw = canvasWidth - 2 * margin; ph = drawHeight - py - margin;
  }
}

function X(u) { return mx + u * mw; }
function Y(v) { return my + v * mh; }

function draw() {
  updateCanvasSize();
  computeLayout();
  positionControls();

  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  if (view === 'map') {
    drawMap();
    drawInfoPanel(currentMapItem());
  } else {
    drawHands();
    drawMudraPanel();
  }
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  textSize(ts);
  const title = view === 'map' ? 'Classical Dance Map' : 'Mudras: Speaking with Your Hands';
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = view === 'map'
    ? 'Click a tile to see where a dance comes from and how to spot it.'
    : 'Click a hand. Try making the shape with your own hand.';
  if (textWidth(instr) > canvasWidth - 20) instr = view === 'map' ? 'Tap a tile to learn about a dance.' : 'Tap a hand to learn its meanings.';
  text(instr, canvasWidth / 2, 38);
}

function currentMapItem() {
  if (typeof selectedMap === 'string') return beyond[parseInt(selectedMap.substring(1))];
  return dances[selectedMap];
}

function tileRect(d) {
  const tw = Math.min(0.30, 150 / mw), th = Math.max(0.085, 30 / mh);
  return { x: X(d.cx - tw / 2), y: Y(d.cy - th / 2), w: tw * mw, h: th * mh };
}

function drawMap() {
  // soft land shape (schematic, not an outline of any country)
  stroke('silver');
  strokeWeight(1);
  fill('#E3F1F3');
  rect(mx, my, mw, mh, 6);
  noStroke();
  fill('#F6E7C8');
  beginShape();
  vertex(X(0.10), Y(0.08)); vertex(X(0.95), Y(0.08)); vertex(X(0.97), Y(0.50));
  vertex(X(0.70), Y(0.55)); vertex(X(0.55), Y(0.97)); vertex(X(0.20), Y(0.97));
  vertex(X(0.10), Y(0.55));
  endShape(CLOSE);

  // compass letters
  fill('#666666');
  textSize(14);
  textAlign(CENTER, CENTER);
  text('N', X(0.05), Y(0.06));
  text('S', X(0.05), Y(0.94));

  for (let i = 0; i < dances.length; i++) {
    const d = dances[i];
    if (d.kind === 'chhau' && !chhauCheckbox.checked()) continue;
    const r = tileRect(d);
    const sel = (selectedMap === i);
    drawTile(r, d.name, d.kind === 'chhau' ? '#FFFFFF' : '#FBD08A', sel, d.kind === 'chhau');
  }

  // Beyond India row
  noStroke();
  fill(NAVY);
  textStyle(BOLD);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text('Beyond India', mx, rowY - 4);
  textStyle(NORMAL);
  const gap = 6;
  const bw = (mw - gap * 3) / 4;
  for (let i = 0; i < beyond.length; i++) {
    const r = { x: mx + i * (bw + gap), y: rowY, w: bw, h: rowH };
    const sel = (selectedMap === 'b' + i);
    stroke(sel ? SAFFRON : 'white');
    strokeWeight(sel ? 4 : 2);
    fill('#BFE3E0');
    rect(r.x, r.y, r.w, r.h, 8);
    noStroke();
    fill(NAVY);
    textAlign(CENTER, CENTER);
    const lab = beyond[i].short || beyond[i].name;
    fitText(lab, r.w - 6, 14, true);
    text(lab, r.x + r.w / 2, r.y + r.h * 0.36);
    textStyle(NORMAL);
    fill(TEAL);
    fitText(beyond[i].sub, r.w - 6, 14, false);
    text(beyond[i].sub, r.x + r.w / 2, r.y + r.h * 0.72);
  }

  // legend + caption
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  fill('#333333');
  const capY = rowY + rowH + 6;
  const cap = 'Schematic map, not to scale. Not an official depiction of borders.';
  if (textWidth(cap) < mw) {
    text(cap, mx, capY);
  } else {
    text('Schematic map, not to scale.', mx, capY);
    text('Not an official depiction of borders.', mx, capY + 17);
  }
  // legend inside map box
  const lgx = mx + mw - 150, lgy = my + 6;
  fill(255, 255, 255, 225);
  rect(lgx, lgy, 144, 50, 6);
  fill('#FBD08A'); stroke('#999999'); strokeWeight(1);
  rect(lgx + 8, lgy + 7, 14, 14, 3);
  noStroke(); fill('#222222');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Akademi list (8)', lgx + 28, lgy + 14);
  drawingContext.setLineDash([4, 3]);
  fill('white'); stroke(SAFFRON); strokeWeight(1.5);
  rect(lgx + 8, lgy + 29, 14, 14, 3);
  drawingContext.setLineDash([]);
  noStroke(); fill('#222222');
  text('Chhau (9th)', lgx + 28, lgy + 36);
}

function drawTile(r, label, col, sel, dashed) {
  if (dashed) drawingContext.setLineDash([5, 4]);
  stroke(sel ? SAFFRON : (dashed ? SAFFRON : 'white'));
  strokeWeight(sel ? 4 : 2);
  fill(col);
  rect(r.x, r.y, r.w, r.h, 8);
  drawingContext.setLineDash([]);
  noStroke();
  fill(NAVY);
  textAlign(CENTER, CENTER);
  fitText(label, r.w - 6, 14, true);
  text(label, r.x + r.w / 2, r.y + r.h / 2);
  textStyle(NORMAL);
}

// pick the largest size from max down to 14 that fits
function fitText(s, maxW, maxSize, bold) {
  textStyle(bold ? BOLD : NORMAL);
  let ts = Math.max(maxSize, 14);
  textSize(ts);
  while (textWidth(s) > maxW && ts > 14) { ts--; textSize(ts); }
}

function drawInfoPanel(item) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 6);
  noStroke();
  const pad = 10;
  const tw = pw - 2 * pad;
  let y = py + pad;
  textAlign(LEFT, TOP);

  fill(SAFFRON);
  textStyle(BOLD);
  textSize(wide ? 22 : 18);
  text(item.name + (item.sub ? ' (' + item.sub + ')' : ''), px + pad, y, tw);
  y += wide ? 30 : 24;

  textSize(14);
  fill(item.kind === 'classical' ? LEAF : (item.kind === 'chhau' ? SAFFRON : TEAL));
  const tag = item.kind === 'classical' ? 'Classical: Sangeet Natak Akademi list of eight'
    : item.kind === 'chhau' ? 'Classical on the Ministry of Culture list only'
    : 'Beyond India';
  const tagLines = wrapLines(tag, tw);
  for (let l of tagLines) { text(l, px + pad, y); y += 18; }
  y += 4;
  textStyle(NORMAL);

  const body = wide ? 16 : 14;
  const lead = wide ? 21 : 18;
  const rows = [['Region: ', item.region], ['Spot it: ', item.features], ['Costume: ', item.costume]];
  for (let r of rows) {
    textSize(body);
    const lines = wrapLines(r[0] + r[1], tw);
    for (let k = 0; k < lines.length; k++) {
      if (k === 0) {
        textStyle(BOLD); fill(NAVY);
        text(r[0], px + pad, y);
        const lw = textWidth(r[0]);
        textStyle(NORMAL); fill('#222222');
        text(lines[0].substring(r[0].length), px + pad + lw, y);
      } else {
        fill('#222222');
        text(lines[k], px + pad, y);
      }
      y += lead;
    }
    y += wide ? 8 : 3;
  }
}

// ---------- Mudra view ----------
function handCells() {
  // returns cell rects for the 6 hands
  const cols = 3, rows = 2;
  const areaW = wide ? Math.floor(canvasWidth * 0.58) - margin * 1.5 : canvasWidth - 2 * margin;
  const areaH = wide ? drawHeight - 64 - margin : 330;
  const cw = areaW / cols, ch = areaH / rows;
  const cells = [];
  for (let i = 0; i < 6; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    cells.push({ x: margin + c * cw, y: 64 + r * ch, w: cw, h: ch });
  }
  return cells;
}

function drawHands() {
  const cells = handCells();
  for (let i = 0; i < mudras.length; i++) {
    const c = cells[i];
    const sel = i === selectedHand;
    stroke(sel ? SAFFRON : 'silver');
    strokeWeight(sel ? 3 : 1);
    fill(sel ? '#FFF1DC' : 'white');
    rect(c.x + 3, c.y + 3, c.w - 6, c.h - 6, 8);
    const s = Math.min(c.w * 1.25, (c.h - 44) / 0.75);
    drawHand(c.x + c.w / 2, c.y + (c.h - 30) / 2 + 0.15 * s + 6, s, mudras[i]);
    noStroke();
    fill(NAVY);
    textAlign(CENTER, BOTTOM);
    fitText(mudras[i].name, c.w - 10, 16, true);
    text(mudras[i].name, c.x + c.w / 2, c.y + c.h - 8);
    textStyle(NORMAL);
  }
  if (!wide) {
    // panel goes below
  }
}

// Draw a right hand, palm facing the viewer, with simple capsules.
function drawHand(cx, cy, s, m) {
  const palmW = 0.36 * s, palmH = 0.34 * s;
  const fw = 0.085 * s; // finger width
  const baseX = [-0.12, -0.04, 0.04, 0.12];
  const lens = [0.30, 0.33, 0.31, 0.24];
  const top = cy - palmH / 2;

  // thumb first (behind fingers when folded)
  const tbx = cx - palmW / 2 + 0.02 * s, tby = cy + 0.03 * s;
  let tx, ty;
  if (m.thumb === 'out') { tx = tbx - 0.18 * s; ty = tby - 0.14 * s; }
  else if (m.thumb === 'ring') { tx = cx + baseX[2] * s - 0.01 * s; ty = top - 0.07 * s; }
  else { tx = cx + 0.02 * s; ty = cy + 0.02 * s; } // folded across palm

  capsule(cx - palmW / 2 + 0.03 * s, cy + palmH / 2 - 0.02 * s, tbx, tby, fw * 1.25);

  // palm
  stroke(SKIN_DARK);
  strokeWeight(2);
  fill(SKIN);
  rect(cx - palmW / 2, top, palmW, palmH + 0.06 * s, 0.08 * s, 0.08 * s, 0.12 * s, 0.12 * s);

  // fingers
  for (let f = 0; f < 4; f++) {
    const bx = cx + baseX[f] * s, by = top + 0.03 * s;
    if (m.ext[f] === 1) {
      const a = m.ang[f];
      const L = lens[f] * s;
      let ex = bx + sin(a) * L, ey = by - cos(a) * L;
      if (m.name === 'Alapadma') {
        // curved, opening fingers: draw two segments bending outward
        const mx1 = bx + sin(a) * L * 0.55, my1 = by - cos(a) * L * 0.55;
        const a2 = a + (a >= 0 ? 0.35 : -0.35);
        ex = mx1 + sin(a2) * L * 0.5; ey = my1 - cos(a2) * L * 0.5;
        capsule(bx, by, mx1, my1, fw);
        capsule(mx1, my1, ex, ey, fw * 0.95);
      } else {
        capsule(bx, by, ex, ey, fw);
      }
      // knuckle creases
      stroke(SKIN_DARK);
      strokeWeight(1);
      const kx = lerp(bx, ex, 0.5), ky = lerp(by, ey, 0.5);
      line(kx - fw * 0.3, ky, kx + fw * 0.3, ky);
    } else if (m.thumb === 'ring' && f === 2) {
      // ring finger bends forward to meet the thumb tip
      capsule(bx, by, tx, ty, fw);
    } else {
      // folded finger: a short rounded knuckle on the palm
      capsule(bx, by - 0.02 * s, bx, by + 0.07 * s, fw);
    }
  }

  // thumb tip segment, drawn on top
  if (m.thumb === 'fold') {
    capsule(tbx, tby, tx, ty, fw * 1.1);
  } else if (m.thumb === 'out') {
    capsule(tbx, tby, tx, ty, fw * 1.1);
  } else {
    capsule(tbx, tby, tx, ty, fw * 1.1);
    noStroke();
    fill(SAFFRON);
    circle(tx, ty, fw * 0.7);
  }
}

// a rounded finger segment with an outline
function capsule(x1, y1, x2, y2, w) {
  strokeCap(ROUND);
  stroke(SKIN_DARK);
  strokeWeight(w + 3);
  line(x1, y1, x2, y2);
  stroke(SKIN);
  strokeWeight(w);
  line(x1, y1, x2, y2);
  strokeCap(ROUND);
}

function drawMudraPanel() {
  const m = mudras[selectedHand];
  let ppx, ppy, ppw, pph;
  if (wide) {
    ppx = px; ppy = py; ppw = pw; pph = ph;
  } else {
    ppx = margin; ppy = 64 + 330 + 10; ppw = canvasWidth - 2 * margin; pph = drawHeight - ppy - margin;
  }
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(ppx, ppy, ppw, pph, 6);
  noStroke();
  const pad = 10, tw = ppw - 2 * pad;
  let y = ppy + pad;
  textAlign(LEFT, TOP);
  fill(SAFFRON);
  textStyle(BOLD);
  textSize(wide ? 22 : 18);
  text(m.name, ppx + pad, y);
  y += wide ? 30 : 24;
  const body = wide ? 16 : 14, lead = wide ? 21 : 18;
  const rows = [['Name means: ', m.means], ['Hand shape: ', m.shape], ['Some meanings: ', m.uses]];
  for (let r of rows) {
    textSize(body);
    const lines = wrapLines(r[0] + r[1], tw);
    for (let k = 0; k < lines.length; k++) {
      if (k === 0) {
        textStyle(BOLD); fill(NAVY);
        text(r[0], ppx + pad, y);
        const lw = textWidth(r[0]);
        textStyle(NORMAL); fill('#222222');
        text(lines[0].substring(r[0].length), ppx + pad + lw, y);
      } else {
        fill('#222222');
        text(lines[k], ppx + pad, y);
      }
      y += lead;
    }
    y += wide ? 8 : 3;
  }
  textSize(14);
  fill('#555555');
  textStyle(ITALIC);
  const note = 'One shape, many meanings: where the hand moves and what the face shows tell the audience which meaning is meant. Teachers hold some shapes a little differently.';
  const nl = wrapLines(note, tw);
  let ny = ppy + pph - pad - nl.length * 18;
  if (ny < y) ny = y;
  if (ny + nl.length * 18 <= ppy + pph) for (let k = 0; k < nl.length; k++) text(nl[k], ppx + pad, ny + k * 18);
  textStyle(NORMAL);
}

function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (let w of words) {
    const test = cur === '' ? w : cur + ' ' + w;
    if (textWidth(test) > maxW && cur !== '') { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur !== '') lines.push(cur);
  return lines;
}

function pointerPressed(x, y) {
  if (y > drawHeight || y < 0) return;
  if (view === 'map') {
    for (let i = dances.length - 1; i >= 0; i--) {
      const d = dances[i];
      if (d.kind === 'chhau' && !chhauCheckbox.checked()) continue;
      const r = tileRect(d);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        selectedMap = i;
        itemSelect.selected('d' + i);
        return;
      }
    }
    const gap = 6, bw = (mw - gap * 3) / 4;
    for (let i = 0; i < beyond.length; i++) {
      const bx = mx + i * (bw + gap);
      if (x >= bx && x <= bx + bw && y >= rowY && y <= rowY + rowH) {
        selectedMap = 'b' + i;
        itemSelect.selected('b' + i);
        return;
      }
    }
  } else {
    const cells = handCells();
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) {
        selectedHand = i;
        itemSelect.selected('m' + i);
        return;
      }
    }
  }
}

function mousePressed() {
  pointerPressed(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    const t = touches[0];
    if (t.y >= 0 && t.y <= drawHeight) {
      pointerPressed(t.x, t.y);
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
