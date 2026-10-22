// Festival Wheel (Roots & Rivers, Chapter 7: Festivals Through the Year)
// CANVAS_HEIGHT = 732 (drawHeight 620 + controlHeight 112); iframe height 734px
// A 12-month Gregorian wheel with South Asian festivals placed on it.
// Solar festivals keep the same date. Lunisolar festivals wobble inside a season.
// Islamic (lunar) festivals drift about 11 days earlier every Gregorian year.
// Nothing about the moving dates is hard-coded: every lunar date is computed from
// the Moon's phases (Meeus, Astronomical Algorithms, ch. 49) plus simple calendar
// rules, so dates are approximate (usually right to within a day; real dates
// depend on local calendars and, for Islamic months, on sighting the new moon).
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 620;
let controlHeight = 112;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let playButton, yearSlider, colorSelect, festSelect, trailCheckbox;
let isRunning = false;          // MicroSims always start paused
let lastStep = 0;
const YEAR_MIN = 1990, YEAR_MAX = 2060;

// palette
const NAVY = '#1B2356', MARIGOLD = '#F28C12', SAFFRON = '#E2601C';
const TEAL = '#0E7C86', LEAF = '#3E8E5E', GOLD = '#F4B429', PAPER = '#FFF8EC';

const CAL = {
  solar:     { label: 'Solar: same date every year', short: 'Solar', color: GOLD },
  lunisolar: { label: 'Lunisolar: moves within a season', short: 'Lunisolar', color: TEAL },
  lunar:     { label: 'Lunar: about 11 days earlier each year', short: 'Lunar', color: SAFFRON }
};
const FAITH = {
  hindu:     { label: 'Hindu', color: MARIGOLD },
  muslim:    { label: 'Muslim', color: LEAF },
  buddhist:  { label: 'Buddhist', color: 'saddlebrown' },
  christian: { label: 'Christian', color: 'mediumpurple' },
  shared:    { label: 'Shared by many faiths', color: TEAL }
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

// ---- astronomy core (Meeus, Astronomical Algorithms, ch. 49) ----
const SYNODIC = 29.530588861;          // mean synodic month, days
const IST = 5.5 / 24;                  // UTC+5:30 as a fraction of a day
function rad(d) { return d * Math.PI / 180; }
function moonPhaseJDE(k) {             // k integer = new moon, k+0.5 = full moon
  const T = k / 1236.85, T2 = T * T;
  let jde = 2451550.09766 + SYNODIC * k + 0.00015437 * T2 - 0.00000015 * T2 * T;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = rad(2.5534 + 29.1053567 * k - 0.0000014 * T2);
  const Mp = rad(201.5643 + 385.81693528 * k + 0.0107582 * T2);
  const F = rad(160.7108 + 390.67050284 * k - 0.0016118 * T2);
  const Om = rad(124.7746 - 1.56375588 * k + 0.0020672 * T2);
  const full = Math.abs(k % 1) > 0.25;
  const a = full ? [-0.40614, 0.17302, 0.01614, 0.01043, 0.00734, -0.00515, 0.00209]
                 : [-0.40720, 0.17241, 0.01608, 0.01039, 0.00739, -0.00514, 0.00208];
  jde += a[0] * Math.sin(Mp) + a[1] * E * Math.sin(M) + a[2] * Math.sin(2 * Mp)
       + a[3] * Math.sin(2 * F) + a[4] * E * Math.sin(Mp - M) + a[5] * E * Math.sin(Mp + M)
       + a[6] * E * E * Math.sin(2 * M) - 0.00111 * Math.sin(Mp - 2 * F)
       - 0.00057 * Math.sin(Mp + 2 * F) + 0.00056 * E * Math.sin(2 * Mp + M)
       - 0.00042 * Math.sin(3 * Mp) + 0.00042 * E * Math.sin(M + 2 * F)
       + 0.00038 * E * Math.sin(M - 2 * F) - 0.00024 * E * Math.sin(2 * Mp - M)
       - 0.00017 * Math.sin(Om);
  return jde;
}
function jdFromDate(y, m, d) {         // Gregorian date at 0h UT
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}
function dateFromJD(jd) {              // returns {y, m, d} (day floored)
  const Z = Math.floor(jd + 0.5), A0 = Math.floor((Z - 1867216.25) / 36524.25);
  const A = Z + 1 + A0 - Math.floor(A0 / 4), B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25), D = Math.floor(365.25 * C);
  const Ee = Math.floor((B - D) / 30.6001);
  const d = B - D - Math.floor(30.6001 * Ee);
  const m = Ee < 14 ? Ee - 1 : Ee - 13;
  const y = m > 2 ? C - 4716 : C - 4715;
  return { y, m, d };
}
function dayStart(jd) { return Math.floor(jd + 0.5) - 0.5; } // 0h of that civil day
// new moons (k integer) around a JD
function kNear(jd) { return Math.round((jd - 2451550.09766) / SYNODIC); }
// lunation (new moon to new moon, IST) that contains a given IST moment
function lunationContaining(jdIST) {
  let k = kNear(jdIST);
  while (moonPhaseJDE(k) + IST > jdIST) k--;
  while (moonPhaseJDE(k + 1) + IST <= jdIST) k++;
  return k;                            // new moon k starts it
}
// ---- festival rules ----
// Hindu lunisolar (amanta): the lunar month containing the sun's entry into a
// sidereal sign. Approximate sankranti dates used: Meena 14 Mar, Mesha 14 Apr,
// Vrishabha 15 May, Tula 17 Oct.
function eveningOf(jdIST, h) { return dayStart(jdIST - h / 24); } // last evening (h o'clock IST) before the moment
function hinduDates(Y) {
  const out = {};
  // Holi: full moon ending Phalguna (month containing 14 Mar); colours the day after Holika Dahan
  let k = lunationContaining(jdFromDate(Y, 3, 14) + 0.5);
  let fm = moonPhaseJDE(k + 0.5) + IST;
  out.holi = eveningOf(fm, 18) + 1;
  // Vesak / Buddha Purnima: full moon of Vaishakha (month containing 15 May)
  k = lunationContaining(jdFromDate(Y, 5, 15) + 0.5);
  out.vesak = dayStart(moonPhaseJDE(k + 0.5) + IST);
  // Navaratri: begins after the new moon that starts Ashvin (month containing 17 Oct)
  k = lunationContaining(jdFromDate(Y, 10, 17) + 0.5);
  const nm = moonPhaseJDE(k) + IST;
  out.navaratri = dayStart(nm) + 1;
  out.dashami = dayStart(nm) + 10;
  // Diwali: the new moon that ends Ashvin
  out.diwali = eveningOf(moonPhaseJDE(k + 1) + IST, 18.5);
  return out;
}
// Islamic lunar: month begins the day after the first evening the crescent can be
// seen in South Asia (modelled as moon age >= 20 h at about 18:30 local time).
const RAMADAN_1447_K = kNear(jdFromDate(2026, 2, 17));
function monthStart(k) {
  const nm = moonPhaseJDE(k);
  let ev = dayStart(nm + IST) + 18.5 / 24 - IST;     // 18:30 IST on NM day, in UT
  while (ev - nm < 20 / 24) ev += 1;
  return dayStart(ev + IST) + 1;                         // the next civil day
}
function islamicEvents(Y) {
  const ev = [];
  const n0 = Math.round((jdFromDate(Y, 1, 1) - moonPhaseJDE(RAMADAN_1447_K)) / (12 * SYNODIC));
  for (let n = n0 - 2; n <= n0 + 2; n++) {
    const k = RAMADAN_1447_K + 12 * n;
    const items = [
      ['ramadan', monthStart(k)], ['eidfitr', monthStart(k + 1)],
      ['eidadha', monthStart(k + 3) + 9], ['ashura', monthStart(k + 4) + 9]];
    for (const [id, jd] of items) if (dateFromJD(jd).y === Y) ev.push({ id, jd, ah: 1447 + n });
  }
  return ev;
}

// ---- festival list ----
// kind: 'fixed' (month, day), 'window' (usual range), 'hindu' or 'islamic' (computed)
const festivals = [
  { id: 'pongal', short: 'Pongal', name: 'Pongal and Makar Sankranti', cal: 'solar', faith: 'hindu',
    kind: 'fixed', md: [1, 14], usual: '14 or 15 January',
    where: 'Tamil Nadu (India) and Tamil communities in Sri Lanka; Makar Sankranti across India and Maghe Sankranti in Nepal.',
    why: 'It is set by the sun entering Makara (Capricorn), so the date hardly moves.' },
  { id: 'losar', short: 'Losar', name: 'Losar (Tibetan New Year)', cal: 'lunisolar', faith: 'buddhist',
    kind: 'window', from: [2, 1], to: [3, 15], usual: 'February or March',
    where: 'Bhutan, Sherpa and other Himalayan communities in Nepal, and Ladakh and Sikkim in India.',
    why: 'It follows the Tibetan lunisolar calendar, so the day changes each year inside this window.' },
  { id: 'holi', short: 'Holi', name: 'Holi', cal: 'lunisolar', faith: 'hindu',
    kind: 'hindu', key: 'holi', usual: 'March (sometimes late February)',
    where: 'India and Nepal, Hindu communities in Bangladesh and Pakistan, and the diaspora.',
    why: 'The day after the full moon of Phalguna. A leap month every few years keeps it in spring.' },
  { id: 'nowruz', short: 'Nowruz', name: 'Nowruz (Persian New Year)', cal: 'solar', faith: 'shared',
    kind: 'fixed', md: [3, 21], usual: '20 or 21 March, the spring equinox',
    where: 'Afghanistan (as Nawruz), Parsi and Irani communities in India, and others.',
    why: 'It starts the solar year at the March equinox, so it stays put.' },
  { id: 'newyear', short: 'Vaisakhi', name: 'Vaisakhi, Pohela Boishakh and other solar new years', cal: 'solar', faith: 'shared',
    kind: 'fixed', md: [4, 14], usual: '13 to 15 April',
    where: 'Punjab in India and Pakistan (Vaisakhi), Bangladesh (Pohela Boishakh, fixed on 14 April), Sri Lanka (Sinhala and Tamil New Year).',
    why: 'These mark the sun entering Mesha (Aries), so they land in mid-April every year.' },
  { id: 'vesak', short: 'Vesak', name: 'Vesak (Buddha Purnima)', cal: 'lunisolar', faith: 'buddhist',
    kind: 'hindu', key: 'vesak', usual: 'the full moon of April or May',
    where: 'Sri Lanka, Nepal, Bhutan, Bangladesh and India.',
    why: 'Held on a full moon, so it shifts by up to a month, but stays in spring.' },
  { id: 'onam', short: 'Onam', name: 'Onam', cal: 'lunisolar', faith: 'shared',
    kind: 'window', from: [8, 17], to: [9, 16], usual: 'August or September (the month of Chingam)',
    where: 'Kerala, India, and Malayali families everywhere. Many people of all faiths join in.',
    why: 'It falls on the Thiruvonam star day in the solar month Chingam, so it moves inside this window.' },
  { id: 'navaratri', short: 'Navaratri', name: 'Navaratri, Durga Puja and Dashain', cal: 'lunisolar', faith: 'hindu',
    kind: 'hindu', key: 'dashami', arcFrom: 'navaratri', usual: 'September or October',
    where: 'Across India (Durga Puja in West Bengal), Hindu communities in Bangladesh, and Nepal (Dashain).',
    why: 'Nine nights after the new moon of Ashvin. The arc shows the nine nights; the dot is the tenth day.' },
  { id: 'diwali', short: 'Diwali', name: 'Diwali and Tihar', cal: 'lunisolar', faith: 'shared',
    kind: 'hindu', key: 'diwali', usual: 'October or November',
    where: 'Hindus, Sikhs, Jains and some Buddhists in India, Nepal (Tihar), Sri Lanka, Pakistan, Bangladesh.',
    why: 'Held on the new moon at the end of the lunar month Ashvin (Kartika in some regions).' },
  { id: 'christmas', short: 'Christmas', name: 'Christmas', cal: 'solar', faith: 'christian',
    kind: 'fixed', md: [12, 25], usual: '25 December',
    where: 'Christians in Kerala, Goa and Northeast India, Pakistan, Bangladesh and Sri Lanka.',
    why: 'Set on the Gregorian calendar, which follows the sun.' },
  { id: 'ramadan', short: 'Ramadan', name: 'Ramadan (month of fasting)', cal: 'lunar', faith: 'muslim',
    kind: 'islamic', usual: 'moves through every season over about 33 years',
    where: 'Muslims in Afghanistan, Pakistan, Bangladesh, India, the Maldives, Sri Lanka and beyond.',
    why: 'The Islamic year has 12 lunar months, about 354 days, so it starts about 11 days earlier each year.' },
  { id: 'eidfitr', short: 'Eid al-Fitr', name: 'Eid al-Fitr', cal: 'lunar', faith: 'muslim',
    kind: 'islamic', usual: 'the day after Ramadan ends',
    where: 'Muslim communities across South Asia. A public holiday in Pakistan, Bangladesh, India and elsewhere.',
    why: 'It begins when the new moon of Shawwal is seen, so the exact day can differ by country.' },
  { id: 'eidadha', short: 'Eid al-Adha', name: 'Eid al-Adha', cal: 'lunar', faith: 'muslim',
    kind: 'islamic', usual: 'the 10th of Dhu al-Hijjah',
    where: 'Every Muslim community in South Asia.',
    why: 'Tied to the Hajj month, so it drifts with the lunar year, about 70 days after Eid al-Fitr.' },
  { id: 'ashura', short: 'Ashura', name: 'Ashura (10 Muharram)', cal: 'lunar', faith: 'muslim',
    kind: 'islamic', usual: 'the 10th of Muharram',
    where: 'Shia mourning gatherings and processions in Pakistan, India, Bangladesh and Afghanistan; many Sunnis fast.',
    why: 'Muharram is the first Islamic month, so Ashura drifts like the other Islamic dates.' }
];
let selected = festivals.findIndex(f => f.id === 'eidfitr');

// ---- date helpers ----
function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
function daysInYear(y) { return isLeap(y) ? 366 : 365; }
function dayOfYear(jd, y) { return Math.round(jd - jdFromDate(y, 1, 1)); } // 0-based
function fmtDate(jd) { const d = dateFromJD(jd); return d.d + ' ' + MONTHS_LONG[d.m - 1]; }
function shortDate(jd) { const d = dateFromJD(jd); return d.d + ' ' + MONTHS[d.m - 1]; }

// Positions of every festival for a year: list of {f, jd, jd2 (arc end), win}
let cache = {};
function placementsFor(Y) {
  if (cache[Y]) return cache[Y];
  const h = hinduDates(Y);
  const isl = islamicEvents(Y);
  const out = [];
  for (const f of festivals) {
    if (f.kind === 'fixed') out.push({ f, jd: jdFromDate(Y, f.md[0], f.md[1]) });
    else if (f.kind === 'window') {
      const a = jdFromDate(Y, f.from[0], f.from[1]), b = jdFromDate(Y, f.to[0], f.to[1]);
      out.push({ f, jd: (a + b) / 2, win: [a, b] });
    } else if (f.kind === 'hindu') {
      const p = { f, jd: h[f.key] };
      if (f.arcFrom) p.arc = [h[f.arcFrom], h[f.key]];
      out.push(p);
    } else {
      for (const e of isl.filter(e => e.id === f.id)) {
        const p = { f, jd: e.jd, ah: e.ah };
        if (f.id === 'ramadan') {
          const end = islamicEventsAround(e.ah, 'eidfitr');
          if (end) p.arc = [e.jd, end - 1];
        }
        out.push(p);
      }
    }
  }
  cache[Y] = out;
  return out;
}
function islamicEventsAround(ah, id) {
  const k = RAMADAN_1447_K + 12 * (ah - 1447);
  if (id === 'eidfitr') return monthStart(k + 1);
  return null;
}
// first occurrence of an Islamic event in year Y (or null)
function islamicDate(Y, id) {
  const e = islamicEvents(Y).filter(e => e.id === id);
  return e.length ? e[0].jd : null;
}

// ---- p5 ----
function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: play button and year slider
  playButton = createButton('Play years');
  playButton.position(10, drawHeight + 8);
  playButton.mousePressed(toggleSimulation);
  yearSlider = createSlider(YEAR_MIN, YEAR_MAX, 2026, 1);
  yearSlider.position(200, drawHeight + 10);
  yearSlider.size(canvasWidth - 200 - 15);

  // Row 2: colour mode and festival menu
  colorSelect = createSelect();
  colorSelect.option('Color by calendar type');
  colorSelect.option('Color by faith');
  colorSelect.position(10, drawHeight + 44);
  festSelect = createSelect();
  for (const f of festivals) festSelect.option(f.short);
  festSelect.selected(festivals[selected].short);
  festSelect.position(205, drawHeight + 44);
  festSelect.changed(() => { selected = festivals.findIndex(f => f.short === festSelect.value()); });

  // Row 3: trail checkbox
  trailCheckbox = createCheckbox(' Show Islamic dates from the past 4 years', true);
  trailCheckbox.position(10, drawHeight + 80);

  describe('A circular 12-month calendar wheel with South Asian festivals marked on it: Pongal, Losar, Holi, Nowruz, Vaisakhi and Pohela Boishakh, Vesak, Onam, Navaratri and Dashain, Diwali and Tihar, Christmas, Ramadan, Eid al-Fitr, Eid al-Adha and Ashura. A year slider from 1990 to 2060 moves the computed dates. Solar festivals stay fixed, lunisolar festivals shift within a season, and Islamic festivals move about 11 days earlier each year. Clicking a festival shows its date that year, where it is celebrated, and why it moves.');
}

function draw() {
  updateCanvasSize();
  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning && millis() - lastStep > 700) {
    lastStep = millis();
    let y = yearSlider.value() + 1;
    if (y > YEAR_MAX) y = YEAR_MIN;
    yearSlider.value(y);
  }
  const Y = yearSlider.value();

  drawTitle();
  computeLayout();
  drawWheel(Y);
  drawPanel(Y);
  drawControlLabels(Y);
}

let wide, cx, cy, R, panel;
function computeLayout() {
  wide = canvasWidth >= 720;
  if (wide) {
    const areaW = canvasWidth * 0.58;
    R = Math.min(areaW / 2 - 95, (drawHeight - 70) / 2 - 75);
    cx = areaW / 2 + 5;
    cy = 70 + (drawHeight - 70) / 2;
    panel = { x: areaW + 5, y: 70, w: canvasWidth - areaW - 15, h: drawHeight - 80 };
  } else {
    R = Math.min(canvasWidth / 2 - 82, 150);
    cx = canvasWidth / 2;
    cy = 66 + R + 62;
    const top = cy + R + 60;
    panel = { x: 10, y: top, w: canvasWidth - 20, h: drawHeight - top - 8 };
  }
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let ts = 24;
  const title = 'Festival Wheel: Why Do Dates Move?';
  textSize(ts);
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('#333333');
  let instr = 'Drag the Year slider. Watch which festivals move, and how far. Click a dot.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Drag the Year slider. Tap a dot to read about it.';
  text(instr, canvasWidth / 2, 40);
}

function angleFor(jd, Y) {
  return -HALF_PI + TWO_PI * (dayOfYear(jd, Y) + 0.5) / daysInYear(Y);
}
function colorFor(f) {
  return colorSelect.value() === 'Color by faith' ? FAITH[f.faith].color : CAL[f.cal].color;
}

let hitTargets = [];
function drawWheel(Y) {
  // month ring
  const inner = R - 34;
  const off = PI / daysInYear(Y);
  const mAngle = m => (m === 12 ? angleFor(jdFromDate(Y, 1, 1), Y) + TWO_PI : angleFor(jdFromDate(Y, m + 1, 1), Y)) - off;
  for (let m = 0; m < 12; m++) {
    const a0 = mAngle(m), a1 = mAngle(m + 1);
    noStroke();
    fill(m % 2 === 0 ? '#F3E3C3' : '#FBEFD9');
    arc(cx, cy, 2 * R, 2 * R, a0, a1, PIE);
    stroke('#D9C29A');
    strokeWeight(1);
    line(cx + inner * cos(a0), cy + inner * sin(a0), cx + R * cos(a0), cy + R * sin(a0));
    noStroke();
    fill(NAVY);
    textSize(14);
    textAlign(CENTER, CENTER);
    const am = (a0 + a1) / 2;
    text(MONTHS[m], cx + (R - 17) * cos(am), cy + (R - 17) * sin(am));
  }
  // inner disc
  fill(PAPER);
  noStroke();
  circle(cx, cy, 2 * inner);
  // centre text
  fill(NAVY);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(Math.max(22, Math.min(40, R * 0.28)));
  text(Y, cx, cy - 14);
  textStyle(NORMAL);
  textSize(14);
  fill('#444444');
  text('Jan 1 at the top', cx, cy + 16);
  text('clockwise', cx, cy + 34);

  // seasonal windows and arcs (drawn under the dots)
  const pl = placementsFor(Y);
  strokeCap(ROUND);
  for (const p of pl) {
    if (p.win || p.arc) {
      const [a, b] = p.win || p.arc;
      const c = color(colorFor(p.f));
      c.setAlpha(p.win ? 90 : 150);
      stroke(c);
      strokeWeight(p.win ? 12 : 8);
      noFill();
      const a0 = angleFor(a, Y), a1 = angleFor(b, Y);
      arc(cx, cy, 2 * (R + 1), 2 * (R + 1), a0, a1 >= a0 ? a1 : a1 + TWO_PI);
    }
  }
  strokeCap(SQUARE);

  // trail of Islamic dates from earlier years
  if (trailCheckbox.checked()) {
    for (let back = 4; back >= 1; back--) {
      const yy = Y - back;
      for (const e of islamicEvents(yy)) {
        if (e.id !== 'eidfitr' && e.id !== 'ashura' && e.id !== 'eidadha' && e.id !== 'ramadan') continue;
        const f = festivals.find(x => x.id === e.id);
        // same calendar date placed on this year's wheel
        const d = dateFromJD(e.jd);
        const a = angleFor(jdFromDate(Y, d.m, Math.min(d.d, 28 + (d.m === 2 && isLeap(Y) ? 1 : (d.m === 2 ? 0 : 3)))), Y);
        const c = color(colorFor(f));
        c.setAlpha(40 + 25 * (4 - back));
        noStroke();
        fill(c);
        circle(cx + R * cos(a), cy + R * sin(a), 9);
      }
    }
  }

  // labels: place with simple collision avoidance
  hitTargets = [];
  const items = pl.map(p => ({ p, a: angleFor(p.jd, Y) }))
                  .sort((u, v) => ((u.a + HALF_PI + TWO_PI) % TWO_PI) - ((v.a + HALF_PI + TWO_PI) % TWO_PI));
  const placed = [];
  textSize(14);
  // selected festival first so it gets the best label spot
  items.sort((u, v) => (festivals[selected] === v.p.f) - (festivals[selected] === u.p.f));
  const xMin = 2, xMax = wide ? panel.x - 6 : canvasWidth - 2;
  const yMin = 58, yMax = wide ? drawHeight - 4 : panel.y - 4;
  for (const it of items) {
    const lbl = it.p.f.short;
    const w = textWidth(lbl) + 8, h = 18;
    let best = null;
    search:
    for (let tier = 0; tier < 7; tier++) {
      for (const dA of [0, 0.09, -0.09, 0.18, -0.18]) {
        const a = it.a + dA, rr = R + 16 + tier * 15;
        const lx = cx + rr * cos(a), ly = cy + rr * sin(a);
        const c = cos(a);
        let bx = c > 0.3 ? lx : (c < -0.3 ? lx - w : lx - w / 2);
        let by = ly - h / 2;
        if (bx < xMin || bx + w > xMax || by < yMin || by + h > yMax) continue;
        const cand = { x: bx, y: by, w, h };
        if (!placed.some(q => bx < q.x + q.w + 2 && bx + w + 2 > q.x && by < q.y + q.h + 1 && by + h + 1 > q.y)) { best = cand; break search; }
        if (!best) best = cand;
      }
    }
    if (!best) best = { x: constrain(cx - w / 2, xMin, xMax - w), y: yMin, w, h };
    placed.push(best);
    it.box = best;
  }
  items.reverse(); // draw selected last (on top)
  for (const it of items) {
    const f = it.p.f, col = colorFor(f);
    const mxp = cx + R * cos(it.a), myp = cy + R * sin(it.a);
    const isSel = festivals[selected] === f;
    stroke(isSel ? NAVY : '#999999');
    strokeWeight(1);
    line(mxp, myp, it.box.x + it.box.w / 2, it.box.y + it.box.h / 2);
    stroke(isSel ? NAVY : 'white');
    strokeWeight(isSel ? 3 : 2);
    fill(col);
    circle(mxp, myp, isSel ? 18 : 14);
    noStroke();
    fill(isSel ? NAVY : 'rgba(255,248,236,0.92)');
    rect(it.box.x, it.box.y, it.box.w, it.box.h, 4);
    fill(isSel ? 'white' : '#222222');
    textAlign(CENTER, CENTER);
    textStyle(isSel ? BOLD : NORMAL);
    text(f.short, it.box.x + it.box.w / 2, it.box.y + it.box.h / 2);
    textStyle(NORMAL);
    hitTargets.push({ i: festivals.indexOf(f), x: mxp, y: myp, box: it.box });
  }
}

function drawPanel(Y) {
  const f = festivals[selected];
  const p = { x: panel.x, y: panel.y, w: panel.w, h: panel.h };
  stroke('#E2CFA8');
  strokeWeight(1);
  fill('white');
  rect(p.x, p.y, p.w, p.h, 8);
  noStroke();
  let y = p.y + 10;
  const x = p.x + 12, maxW = p.w - 24;
  // title
  fill(NAVY);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  let ts = wide ? 20 : 17;
  textSize(ts);
  while (textWidth(f.name) > maxW && ts > 15) { ts--; textSize(ts); }
  for (const ln of wrapLines(f.name, maxW)) { text(ln, x, y); y += ts + 4; }
  textStyle(NORMAL);
  // calendar chip
  textSize(14);
  const chip = CAL[f.cal].label;
  fill(CAL[f.cal].color);
  rect(x, y + 1, 12, 12, 3);
  fill('#333333');
  for (const ln of wrapLines(chip, maxW - 18)) { text(ln, x + 18, y); y += 18; }
  y += 4;
  // date this year
  const pl = placementsFor(Y).filter(q => q.f === f);
  let dateLine;
  if (f.kind === 'fixed') dateLine = 'In ' + Y + ': ' + fmtDate(pl[0].jd) + ' (usually ' + f.usual + ')';
  else if (f.kind === 'window') dateLine = 'In ' + Y + ': ' + f.usual + '. The shaded band shows the usual window.';
  else if (f.kind === 'hindu') {
    dateLine = 'In ' + Y + ': about ' + fmtDate(pl[0].jd);
    if (f.id === 'navaratri') dateLine = 'In ' + Y + ': about ' + shortDate(pl[0].arc[0]) + ' to ' + shortDate(pl[0].jd) + ' (tenth day)';
  } else {
    dateLine = pl.length ? 'In ' + Y + ': about ' + pl.map(q => fmtDate(q.jd)).join(' and ') : 'Not in ' + Y;
    if (pl.length === 2) dateLine += ' (twice!)';
  }
  textStyle(BOLD);
  fill('#222222');
  for (const ln of wrapLines(dateLine, maxW)) { text(ln, x, y); y += 18; }
  textStyle(NORMAL);
  // drift line for lunar festivals
  if (f.kind === 'islamic') {
    const a = islamicDate(Y, f.id), b = islamicDate(Y + 1, f.id);
    if (a && b) {
      const da = dayOfYear(a, Y), db = dayOfYear(b, Y + 1);
      const shift = da - db + (daysInYear(Y) - 365);
      if (shift > 0) {
        fill(SAFFRON);
        for (const ln of wrapLines('Next year: about ' + fmtDate(b) + ', ' + shift + ' days earlier.', maxW)) { text(ln, x, y); y += 18; }
      }
    }
  }
  y += 4;
  fill('#333333');
  const body = [['Where: ', f.where], ['Why it moves: ', f.why]];
  for (const [k, v] of body) {
    for (const ln of wrapLines(k + v, maxW)) {
      if (y > p.y + p.h - 18) break;
      text(ln, x, y);
      y += 18;
    }
    y += 4;
  }
  // colour key (only when there is room)
  const keys = colorSelect.value() === 'Color by faith' ? Object.values(FAITH) : Object.values(CAL);
  const keyH = 26 + keys.length * 20;
  if (y + keyH < p.y + p.h - 44) {
    y += 8;
    fill(NAVY);
    textStyle(BOLD);
    text('Key', x, y);
    textStyle(NORMAL);
    y += 20;
    for (const k of keys) {
      fill(k.color);
      circle(x + 6, y + 8, 12);
      fill('#333333');
      text(k.label, x + 18, y);
      y += 20;
    }
  }
  // footnote
  if (y < p.y + p.h - 20) {
    fill('#666666');
    textSize(14);
    const note = 'Computed dates are approximate. Local calendars and moon sighting set the real day.';
    const lines = wrapLines(note, maxW);
    let ny = p.y + p.h - 6 - lines.length * 17;
    if (ny > y) for (const ln of lines) { text(ln, x, ny); ny += 17; }
  }
}

function drawControlLabels(Y) {
  noStroke();
  fill('#222222');
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Year: ' + Y, 112, drawHeight + 20);
}

function wrapLines(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (textWidth(t) > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

function pickAt(px, py) {
  if (py < 0 || py > drawHeight) return;
  for (const h of hitTargets) {
    const b = h.box;
    if (dist(px, py, h.x, h.y) < 14 || (px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h)) {
      selected = h.i;
      festSelect.selected(festivals[selected].short);
      return;
    }
  }
}
function mousePressed() { pickAt(mouseX, mouseY); }

function toggleSimulation() {
  isRunning = !isRunning;
  lastStep = millis();
  playButton.html(isRunning ? 'Pause' : 'Play years');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  yearSlider.size(canvasWidth - 200 - 15);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
