// Interview Builder (Roots & Rivers, Chapter 22: Bring It Home)
// CANVAS_HEIGHT = 760 (drawHeight 640 + controlHeight 120); iframe height 762px
// Pick a theme (any chapter), a narrator and a length. The sim assembles an
// oral history interview plan: a consent script, 6-10 questions drawn from the
// plain-text question bank below, follow-up prompts and a note-taking grid.
// "Print plan" fills the print-only #print-plan block in main.html and calls
// window.print(). Nothing is saved or sent anywhere.
// MicroSim template version 2026.03 (p5.js 1.11.10)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 640;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 10;
let defaultTextSize = 16;

// controls
let themeSelect, narratorSelect, lengthSelect, newButton, printButton;
let shuffleCount = 0;   // "New questions" presses; 0 = default order
let activeTab = 1;      // 0 Consent, 1 Questions, 2 Notes
let tabBoxes = [];
let plan = null;

// palette
const NAVY = '#1B2356';
const MARIGOLD = '#F28C12';
const SAFFRON = '#E2601C';
const TEAL = '#0E7C86';
const LEAF = '#3E8E5E';
const GOLD = '#F4B429';
const PAPER = '#FFF8EC';

// ---------------------------------------------------------------------------
// QUESTION BANK (plain text). One entry per chapter theme, written from each
// chapter's Ask Your Elders topics. warm = theme warm-up, core = 4 theme
// questions, change = "how has it changed" question, note = care note.
// ---------------------------------------------------------------------------
const BANK = [
  { ch: 1, title: 'What Is South Asia?', topic: 'where our family comes from',
    warm: 'Where did you grow up? What could you see from your window or on the way to school?',
    core: [
      'What was the nearest river, mountain, desert or sea, and what did it mean to people there?',
      'What was the weather like through the year? Which season did you love most, and why?',
      'When the first monsoon rain (or the first big rain of the year) came, what did people do? Was there a smell, food or game you remember?',
      'How would you describe that place to someone who has never been to South Asia?'],
    change: 'How has that place changed since you were young, or since you moved away?' },
  { ch: 2, title: 'Ancient Roots', topic: 'stories about the ancient past',
    warm: 'What stories did you hear as a child about the very distant past?',
    core: [
      'Did you ever visit an old site, like Mohenjo-daro, Sarnath, Bodh Gaya or Anuradhapura? What was it like?',
      'How was ancient history taught in your school? What did you have to memorize?',
      'Which old story, place or ruler from history were you proudest of as a kid, and why?',
      'Did anyone in the family tell you a different version of history than your schoolbook did?'],
    change: 'Do you think young people today learn about the ancient past differently than you did?' },
  { ch: 3, title: 'Empires and Encounters', topic: 'old buildings and stories of kings and traders',
    warm: 'What is the oldest building or ruin you remember near home?',
    core: [
      'Do you know who built it, and what people said about it?',
      'Did the family have stories about kings, nawabs, rajas or traders from long ago?',
      'Were there old markets, forts or trade roads near where you grew up?',
      'Is there a building from long ago that you think everyone should see? Why that one?'],
    change: 'Has that building or place been changed, repaired or lost since you were young?' },
  { ch: 4, title: 'Colonialism, Independence, and Partition', topic: 'independence days and family memories of 1947 or 1971',
    warm: 'How did your family mark Independence Day, Victory Day or another national day when you were young?',
    core: [
      'What did older relatives tell you about 1947 or 1971, if they talked about it at all?',
      'Did anyone in the family, or their friends, have to move because of those years? (Only if you want to share.)',
      'How is that history told at home compared with how it was taught at school?',
      'Is there an object, letter or photo in the family from that time?'],
    change: 'Has the way the family talks about those years changed over time?',
    note: 'Some memories of 1947 and 1971 are painful. Ask only if they want to share, never push, and stop if they seem upset.' },
  { ch: 5, title: 'Faiths of South Asia', topic: 'faith or family values',
    warm: 'What did faith, or family values, look like in your home when you were a child?',
    core: [
      'Is there a prayer, song, ritual or saying you remember from childhood? What does it mean to you?',
      'Which day or season felt most special because of faith or family tradition?',
      'Who taught you about faith or values, and how did they teach it?',
      'What do you wish younger people understood about your faith or your values?'],
    change: 'How do you practice, or live those values, now compared with when you were young?',
    note: 'If your family is not religious, ask about values and how they were passed down instead.' },
  { ch: 6, title: 'Languages and Scripts', topic: 'the languages in our family',
    warm: 'What languages did you grow up speaking, at home and at school?',
    core: [
      'Is there a word in your language with no good English translation? What does it mean?',
      'Which language do you count, pray, dream or get angry in?',
      'Did you learn to read and write a script as a child? How was it taught?',
      'Can you teach me one phrase you used every day, and how to say it properly?'],
    change: 'Do you worry about the language being lost in our family? What would help keep it?' },
  { ch: 7, title: 'Festivals Through the Year', topic: 'festivals',
    warm: 'What was your favorite festival as a child?',
    core: [
      'What foods, clothes and sounds do you remember from that festival?',
      'What did the days just before the festival feel like at home?',
      'Who did you visit, or who came to visit you?',
      'How do you celebrate it here compared with back home?'],
    change: 'How has that festival changed since you were a child?' },
  { ch: 8, title: 'Food and the Table', topic: 'food in our family',
    warm: 'What did an ordinary weekday meal look like when you were growing up?',
    core: [
      'Is there a dish only our family makes? Who taught it to you?',
      'Were there food rules in the house? Where did they come from?',
      'What smell or taste takes you straight back to childhood?',
      'Could you teach me one dish, step by step, while I write it down?'],
    change: 'How has the way our family cooks or eats changed over the years, or since moving?' },
  { ch: 9, title: 'Music', topic: 'music and songs',
    warm: 'What songs do you remember from your childhood?',
    core: [
      'Which film songs or singers did you love as a teenager? (Just the titles; no need to write down lyrics.)',
      'Did anyone in the family learn an instrument or sing? Who taught them?',
      'Is there a song people always sing at weddings or family gatherings?',
      'Where did you hear music: radio, cassettes, a place of worship, the street?'],
    change: 'How has the music you listen to changed over your life?' },
  { ch: 10, title: 'Dance and Theater', topic: 'dance and theater',
    warm: 'What dancing do you remember at weddings or festivals?',
    core: [
      'Did anyone in the family learn a classical dance? What was practice like?',
      'Was there a folk dance from your village or region? Can you describe the steps or music?',
      'Who danced at family events, and who just watched?',
      'Do you remember a play, puppet show or street performance?'],
    change: 'How have celebrations with dancing changed since you were young?' },
  { ch: 11, title: 'Art, Architecture, and Craft', topic: 'art and craft in the home',
    warm: 'Was there art or craft in your home growing up, like alpona, kolam, rangoli, mehndi, embroidery or pottery?',
    core: [
      'Who made it, and when? Did they teach anyone?',
      'Is there a handmade object in the family that has been passed down? What is its story?',
      'What building do you think is beautiful, and why?',
      'Was your town known for a special craft?'],
    change: 'Do people still make these things by hand, or has that changed?' },
  { ch: 12, title: 'Clothing and Textiles', topic: 'clothing',
    warm: 'What did you wear every day as a child, and what did you wear for special days?',
    core: [
      'Is there a garment in the family with a story behind it?',
      'How is a saree, turban, shawl or gho tied or worn in our family? Could you show me?',
      'What fabric, color or pattern reminds you of home?',
      'Who made or bought the clothes for special occasions?'],
    change: 'How has what you wear changed since you were young, or since moving?' },
  { ch: 13, title: 'Family, Names, and Life Events', topic: 'family, names and life events',
    warm: 'What did you call each of your relatives growing up?',
    core: [
      'How was your name chosen? How were names chosen in our family?',
      'Can you tell me about a wedding, naming ceremony or other family event you remember?',
      'Who lived in your house when you were my age?',
      'Who made the big decisions in the family when you were young?'],
    change: 'How have family roles changed since you were young, or since moving?' },
  { ch: 14, title: 'Stories and Literature', topic: 'stories and books',
    warm: 'What bedtime stories did you hear as a child? Who told them?',
    core: [
      'Was there a story with a lesson that you still think about?',
      'Is there a poet, writer or book from school that you love? (Share the title, not long quotes.)',
      'Did anyone in the family tell folk tales, ghost stories or stories about relatives?',
      'Can you tell me one story the way you heard it?'],
    change: 'Do children today hear the same stories? What is different?' },
  { ch: 15, title: 'Cinema, Cricket, and Pop Culture', topic: 'films, cricket and TV',
    warm: 'What was the first film you saw in a theater?',
    core: [
      'Who was your favorite actor or singer growing up, and why?',
      'Do you have a cricket memory, a match you watched or played?',
      'What did the family watch or listen to together?',
      'Where did you watch films and matches: at home, at a neighbor\'s, in a theater?'],
    change: 'How has watching films and sports changed for you since then?' },
  { ch: 16, title: 'Science, Math, and Ideas', topic: 'learning math and science',
    warm: 'How did you learn math in school? Were there tricks or tables you memorized?',
    core: [
      'Can you show me a mental math trick you still use?',
      'Were there home remedies in your house? What were they? (We\'ll write them down as traditions, not medical advice.)',
      'Is there a scientist, doctor or inventor from the region you admire?',
      'What did people in the family want to study, and what did they end up doing?'],
    change: 'How has school changed between your generation and mine?',
    note: 'Home remedies are family traditions, not proven treatments. Record them as history, not medical advice.' },
  { ch: 17, title: 'India', topic: 'a place in India',
    warm: 'Which state or city in India are you from? (Or: which place in India have you visited, or would you like to?)',
    core: [
      'What makes that place different from other parts of India: food, language, festivals?',
      'Which languages did people speak there?',
      'Where would you take me first if we went there together?',
      'What do people from other places often get wrong about it?'],
    change: 'How has that place changed since you were young?',
    note: 'For families without Indian roots, ask about a place in India they have visited or want to visit.' },
  { ch: 18, title: 'Pakistan and Afghanistan', topic: 'home, hospitality and languages',
    warm: 'Which city or region are you from? (Or: what place in Pakistan or Afghanistan would you like to know more about?)',
    core: [
      'What does a good host do when guests arrive? What did your family serve?',
      'Which languages were spoken in your house, and which in the street?',
      'What foods remind you most of home?',
      'Is there a place or market there you would want me to see?'],
    change: 'What has changed most about that place since you were young, or since you left?' },
  { ch: 19, title: 'Bangladesh and Sri Lanka', topic: 'rivers, coasts, language and new year',
    warm: 'Which river, coast or hill country do you remember from home?',
    core: [
      'What were the monsoon, floods or cyclones like where you lived?',
      'How did your family celebrate the new year, such as Pohela Boishakh or the Sinhala and Tamil New Year?',
      'What does your language mean to you? Is there a day or song that shows that pride?',
      'What part did tea, rice or fish play in daily life?'],
    change: 'How has life near the water or in the hills changed since you were young?' },
  { ch: 20, title: 'Nepal, Bhutan, and the Maldives', topic: 'mountain and island life',
    warm: 'What was the land like where you grew up: mountains, valleys or islands? (Or: what do you know about mountain or island life?)',
    core: [
      'Which festivals were biggest in your home or town?',
      'How did the land or the sea shape the work people did?',
      'What was a long journey like, on foot, by road or by boat?',
      'What would surprise someone who has never been there?'],
    change: 'How have the mountains, valleys or coasts changed in your lifetime?' },
  { ch: 21, title: 'The South Asian Diaspora', topic: 'moving to a new country',
    warm: 'When and why did our family move? (Share only what you want to.)',
    core: [
      'What were the first weeks in the new country like?',
      'What did you bring with you, and why that?',
      'What surprised you most when you arrived?',
      'What do you miss most from back home?'],
    change: 'How has this place started to feel like home, or not, over the years?',
    note: 'Keep immigration details general. Nobody has to say exactly when or how they arrived.' },
  { ch: 22, title: 'Life story (capstone)', topic: 'your life story',
    warm: 'What is your earliest memory? Where were you, and who was with you?',
    core: [
      'Who were the most important people in your life when you were my age, and what did they teach you?',
      'What was the biggest change you lived through, and how did it change your everyday life?',
      'Is there a tradition, recipe, song or saying from your childhood that you still keep? Why that one?',
      'Tell me about a moment when you felt really proud.'],
    change: 'How have you changed since you were young, or since moving to a new place?' }
];

// Questions used with every theme
const OPENERS = [
  'Before we start: how would you like me to write your name in my notes? First name, initial, or what I call you?',
  'What were you like when you were about my age?',
  'What did a normal day look like when you were about my age?'];
const DEEPER = [
  'Is there a photo or object connected to this that you could show me?',
  'Who else in the family would remember this? Should I ask them too?'];
const CLOSERS = [
  'What do you hope I, and people my age, keep from this part of your life?',
  'If someone reads my notes in fifty years, what should they understand about this?'];
const ANYTHING_ELSE = 'Is there anything I didn\'t ask that you want me to know?';
const FOLLOWUPS = [
  'What happened next?',
  'What did that look, sound or smell like?',
  'Who else was there?',
  'How did you feel then? How do you feel about it now?',
  'Can you tell me more about that?'];

const NARRATORS = [
  { name: 'Grandparent', tip: 'Offer to talk in the language they are most comfortable in. Bring a photo or object to start the conversation.' },
  { name: 'Parent', tip: 'Pick a calm time, not right before dinner or work. Tell them you want their story, not advice.' },
  { name: 'Aunt or uncle', tip: 'Ask when they are relaxed, maybe at a visit or on a call. Say why you chose them.' },
  { name: 'Family friend or community member', tip: 'Ask ahead of time, explain the project fully, and meet where they feel comfortable. Ask how they want to be named.' }];
const LENGTHS = [10, 20, 30];
const TAB_NAMES = ['Consent', 'Questions', 'Notes'];
const TYPE_COLORS = { 'Warm-up': GOLD, 'Theme': TEAL, 'Change': LEAF, 'Closing': SAFFRON };

// ---------------------------------------------------------------------------

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: theme
  themeSelect = createSelect();
  for (const b of BANK) themeSelect.option(themeLabel(b));
  themeSelect.selected(themeLabel(BANK[7])); // start on Chapter 8, Food
  themeSelect.position(90, drawHeight + 8);
  themeSelect.changed(() => { shuffleCount = 0; rebuild(); });

  // Row 2: narrator
  narratorSelect = createSelect();
  for (const n of NARRATORS) narratorSelect.option(n.name);
  narratorSelect.position(90, drawHeight + 44);
  narratorSelect.changed(rebuild);

  // Row 3: length, new questions, print
  lengthSelect = createSelect();
  for (const L of LENGTHS) lengthSelect.option(L + ' minutes');
  lengthSelect.selected('20 minutes');
  lengthSelect.position(10, drawHeight + 82);
  lengthSelect.changed(rebuild);

  newButton = createButton('New questions');
  newButton.position(130, drawHeight + 82);
  newButton.mousePressed(() => { shuffleCount++; rebuild(); });

  printButton = createButton('Print plan');
  printButton.position(250, drawHeight + 82);
  printButton.mousePressed(printPlan);

  for (const el of [themeSelect, narratorSelect, lengthSelect, newButton, printButton]) {
    el.style('font-size', '15px');
  }
  for (const el of [newButton, printButton]) el.style('padding', '3px 8px');

  rebuild();
  positionControls();

  describe('Interview Builder. Choose a chapter theme, a narrator and an interview length. The canvas previews an oral history interview plan in three tabs: a consent script, a numbered list of 6 to 10 questions color coded as warm-up, theme, change and closing questions, and follow-up prompts with a note-taking grid. The Print plan button prints a clean version of the full plan.');
}

function themeLabel(b) {
  return b.ch === 22 ? 'Life story (capstone)' : 'Ch ' + b.ch + ': ' + b.title;
}

// Small seeded shuffle so "New questions" gives a new but repeatable set
function seededOrder(arr, seed) {
  const a = arr.slice();
  if (seed === 0) return a;
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rebuild() {
  const theme = BANK.find(b => themeLabel(b) === themeSelect.value()) || BANK[7];
  const narrator = NARRATORS.find(n => n.name === narratorSelect.value()) || NARRATORS[0];
  const minutes = parseInt(lengthSelect.value(), 10) || 20;
  const s = shuffleCount;
  const core = seededOrder(theme.core, s);
  const opener = OPENERS[s % OPENERS.length];
  const closer = CLOSERS[s % CLOSERS.length];
  const deeper = DEEPER[s % DEEPER.length];

  const qs = [];
  if (minutes >= 20) qs.push({ type: 'Warm-up', text: opener });
  qs.push({ type: 'Warm-up', text: theme.warm });
  const nCore = minutes === 10 ? 3 : 4;
  for (let i = 0; i < nCore; i++) qs.push({ type: 'Theme', text: core[i] });
  qs.push({ type: 'Change', text: theme.change });
  if (minutes === 30) qs.push({ type: 'Theme', text: deeper });
  qs.push({ type: 'Closing', text: closer });
  if (minutes === 30) qs.push({ type: 'Closing', text: ANYTHING_ELSE });

  plan = { theme, narrator, minutes, qs,
    perQ: (minutes / qs.length).toFixed(1).replace('.0', ''),
    consent: consentScript(theme, narrator, minutes) };
}

function consentScript(theme, narrator, minutes) {
  let s = 'I\'m doing an oral history project for my school\'s South Asian club about ' + theme.topic +
    '. Can I ask you some questions for about ' + minutes + ' minutes? I\'d like to take notes, and record audio only if you say yes. ' +
    'You can skip any question, and we can stop whenever you want. Later I might share one short story from our talk, using only your first name or initial, but only if you agree. You can change your mind about that later, too.';
  if (narrator.name === 'Family friend or community member') {
    s += ' My notes stay private unless you agree to share a story with my club or the Roots & Rivers Story Archive. Would you like to be named by first name, initials, or not at all?';
  } else {
    s += ' Anything you want to keep just for the family stays in the family.';
  }
  return s;
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  positionControls();

  stroke('silver');
  strokeWeight(1);
  fill(PAPER);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // control labels
  noStroke();
  fill(NAVY);
  textAlign(LEFT, CENTER);
  textSize(15);
  textStyle(BOLD);
  text('Theme', 10, drawHeight + 20);
  text('Narrator', 10, drawHeight + 56);
  textStyle(NORMAL);

  let y = drawTitle();
  y = drawSummary(y + 8);
  y = drawTabs(y + 10);
  drawPanel(y);

  noStroke();
  fill('#555555');
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text('Preview only. Nothing is saved or sent anywhere.', canvasWidth / 2, drawHeight - 6);
}

function drawTitle() {
  noStroke();
  fill(NAVY);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  const title = 'Interview Builder: Plan an Oral History';
  let ts = 24;
  textSize(ts);
  while (textWidth(title) > canvasWidth - 20 && ts > 16) { ts--; textSize(ts); }
  text(title, canvasWidth / 2, 10);
  textStyle(NORMAL);
  textSize(15);
  fill('#333333');
  let instr = 'Pick a theme, narrator and length below, read each tab, then press Print plan.';
  if (textWidth(instr) > canvasWidth - 24) instr = 'Choose below, read each tab, then print your plan.';
  const lines = wrapLines(instr, canvasWidth - 24);
  let y = 10 + ts + 8;
  for (const l of lines) { text(l, canvasWidth / 2, y); y += 19; }
  return y;
}

function drawSummary(y0) {
  const x = margin, w = canvasWidth - 2 * margin;
  textSize(15);
  const t = plan.theme;
  const line1 = (t.ch === 22 ? 'Theme: Life story (capstone)' : 'Theme: Chapter ' + t.ch + ', ' + t.title);
  const line2 = 'Narrator: ' + plan.narrator.name;
  const line3 = plan.minutes + ' minutes, ' + plan.qs.length + ' questions, about ' + plan.perQ + ' min each';
  const lines = [].concat(wrapLines(line1, w - 20), wrapLines(line2, w - 20), wrapLines(line3, w - 20));
  const h = lines.length * 19 + 14;
  stroke(NAVY);
  strokeWeight(1.5);
  fill('white');
  rect(x, y0, w, h, 8);
  noStroke();
  fill(MARIGOLD);
  rect(x, y0, 6, h, 8, 0, 0, 8);
  fill(NAVY);
  textAlign(LEFT, TOP);
  let y = y0 + 8;
  for (let i = 0; i < lines.length; i++) {
    textStyle(i === 0 ? BOLD : NORMAL);
    text(lines[i], x + 14, y);
    y += 19;
  }
  textStyle(NORMAL);
  return y0 + h;
}

function drawTabs(y0) {
  const x = margin, w = canvasWidth - 2 * margin;
  const tw = w / 3, th = 34;
  tabBoxes = [];
  for (let i = 0; i < 3; i++) {
    const tx = x + i * tw;
    const on = i === activeTab;
    stroke(on ? NAVY : 'silver');
    strokeWeight(1.5);
    fill(on ? NAVY : '#F1E6D2');
    rect(tx + 2, y0, tw - 4, th, 8, 8, 0, 0);
    noStroke();
    fill(on ? 'white' : NAVY);
    textAlign(CENTER, CENTER);
    textSize(15);
    textStyle(BOLD);
    text(TAB_NAMES[i], tx + tw / 2, y0 + th / 2);
    textStyle(NORMAL);
    tabBoxes.push({ x: tx, y: y0, w: tw, h: th });
  }
  return y0 + th;
}

function drawPanel(y0) {
  const x = margin, w = canvasWidth - 2 * margin;
  const bottom = drawHeight - 28;
  stroke(NAVY);
  strokeWeight(1.5);
  fill('white');
  rect(x, y0, w, bottom - y0, 0, 0, 8, 8);
  noStroke();
  const inner = { x: x + 12, y: y0 + 10, w: w - 24, bottom: bottom - 8 };
  if (activeTab === 0) drawConsent(inner);
  else if (activeTab === 1) drawQuestions(inner);
  else drawNotes(inner);
}

function drawConsent(b) {
  let y = b.y;
  y = heading('Read this aloud before you begin', b.x, y);
  y = para('"' + plan.consent + '"', b.x, y, b.w, '#222222', b.bottom, true);
  y += 8;
  y = heading('Tip for this narrator', b.x, y);
  y = para(plan.narrator.tip, b.x, y, b.w, '#222222', b.bottom);
  y += 8;
  y = heading('Under 18?', b.x, y);
  para('Get a parent or guardian\'s OK before sharing anything outside the family. First names only.', b.x, y, b.w, '#222222', b.bottom);
}

function drawQuestions(b) {
  let y = b.y;
  if (plan.theme.note) {
    textStyle(BOLD);
    y = para('Care note: ' + plan.theme.note, b.x, y, b.w, SAFFRON, b.bottom);
    textStyle(NORMAL);
    y += 6;
  }
  // legend
  textSize(14);
  let lx = b.x;
  for (const k of Object.keys(TYPE_COLORS)) {
    const lw = textWidth(k) + 26;
    if (lx + lw > b.x + b.w) { lx = b.x; y += 20; }
    fill(TYPE_COLORS[k]);
    circle(lx + 7, y + 8, 12);
    fill('#333333');
    textAlign(LEFT, TOP);
    text(k, lx + 17, y);
    lx += lw + 6;
  }
  y += 26;
  const lh = canvasWidth < 600 ? 18 : 19;
  for (let i = 0; i < plan.qs.length; i++) {
    const q = plan.qs[i];
    textSize(lh === 18 ? 14 : 15);
    const lines = wrapLines(q.text, b.w - 34);
    if (y + lines.length * lh > b.bottom) {
      fill(SAFFRON);
      textStyle(BOLD);
      textAlign(LEFT, TOP);
      text('+ ' + (plan.qs.length - i) + ' more in the printed plan', b.x, y);
      textStyle(NORMAL);
      return;
    }
    fill(TYPE_COLORS[q.type]);
    circle(b.x + 11, y + 9, 22);
    fill(q.type === 'Warm-up' ? NAVY : 'white');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(14);
    text(i + 1, b.x + 11, y + 9);
    textStyle(NORMAL);
    textSize(lh === 18 ? 14 : 15);
    fill('#222222');
    textAlign(LEFT, TOP);
    for (const l of lines) { text(l, b.x + 30, y); y += lh; }
    y += 7;
  }
}

function drawNotes(b) {
  let y = b.y;
  y = heading('Follow-up prompts (use any time)', b.x, y);
  textSize(15);
  for (const f of FOLLOWUPS) {
    noStroke();
    fill(TEAL);
    circle(b.x + 4, y + 9, 6);
    y = para(f, b.x + 14, y, b.w - 14, '#222222', b.bottom);
  }
  y += 8;
  y = heading('Note-taking grid', b.x, y);
  // mini grid preview
  const cols = canvasWidth < 600 ? ['Q', 'Their words', 'Ask later'] : ['Q', 'Key words they used', 'A story to save (their words)', 'Follow-up to ask later'];
  const fr = canvasWidth < 600 ? [0.12, 0.55, 0.33] : [0.07, 0.28, 0.40, 0.25];
  const rowH = 30;
  const rows = Math.max(1, Math.min(plan.qs.length, Math.floor((b.bottom - y - 30) / rowH) - 1));
  let cx = b.x;
  stroke('#9A8F7A');
  strokeWeight(1);
  for (let c = 0; c < cols.length; c++) {
    const cw = fr[c] * b.w;
    fill('#F1E6D2');
    rect(cx, y, cw, rowH);
    for (let r = 1; r <= rows; r++) { fill('white'); rect(cx, y + r * rowH, cw, rowH); }
    noStroke();
    fill(NAVY);
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    let label = cols[c];
    while (textWidth(label) > cw - 8 && label.length > 3) label = label.slice(0, -2);
    text(label, cx + 5, y + rowH / 2);
    textStyle(NORMAL);
    if (c === 0) {
      fill('#555555');
      for (let r = 1; r <= rows; r++) text(r, cx + 6, y + r * rowH + rowH / 2);
    }
    stroke('#9A8F7A');
    cx += cw;
  }
  noStroke();
  y += (rows + 1) * rowH + 6;
  if (y + 18 < b.bottom) {
    fill('#555555');
    textSize(14);
    textAlign(LEFT, TOP);
    text('The printed plan has one row for every question.', b.x, y);
  }
}

function heading(s, x, y) {
  noStroke();
  fill(TEAL);
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT, TOP);
  text(s, x, y);
  textStyle(NORMAL);
  return y + 22;
}

function para(s, x, y, w, col, bottom, italic) {
  noStroke();
  fill(col);
  const small = canvasWidth < 600;
  const lh = small ? 18 : 19;
  textSize(small ? 14 : 15);
  if (italic) textStyle(ITALIC);
  textAlign(LEFT, TOP);
  const lines = wrapLines(s, w);
  for (const l of lines) {
    if (y + lh > bottom) { textStyle(NORMAL); return y; }
    text(l, x, y);
    y += lh;
  }
  textStyle(NORMAL);
  return y;
}

function wrapLines(s, maxW) {
  const words = String(s).split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (textWidth(test) > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function mousePressed() {
  for (let i = 0; i < tabBoxes.length; i++) {
    const t = tabBoxes[i];
    if (mouseX >= t.x && mouseX <= t.x + t.w && mouseY >= t.y && mouseY <= t.y + t.h) {
      activeTab = i;
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// Printing: fill the print-only block in main.html, then print
// ---------------------------------------------------------------------------

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildPrintHTML() {
  const t = plan.theme;
  const themeName = t.ch === 22 ? 'Life story (capstone)' : 'Chapter ' + t.ch + ': ' + t.title;
  let h = '';
  h += '<h1>Oral History Interview Plan</h1>';
  h += '<p class="meta"><b>Theme:</b> ' + esc(themeName) + ' &nbsp; <b>Narrator:</b> ' + esc(plan.narrator.name) +
    ' &nbsp; <b>Length:</b> about ' + plan.minutes + ' minutes (' + plan.qs.length + ' questions)</p>';
  h += '<table class="fields"><tr><td>Interviewer (first name):</td><td>Narrator (first name or initial):</td></tr>' +
    '<tr><td>Date:</td><td>Language(s) used:</td></tr></table>';
  h += '<h2>1. Consent (read aloud)</h2><p class="script">"' + esc(plan.consent) + '"</p>';
  h += '<p class="checks">&#9744; OK to take notes &nbsp; &#9744; OK to record audio &nbsp; &#9744; OK to share one short story (first name or initial only) &nbsp; &#9744; A parent or guardian knows about this project (if I am under 18)</p>';
  h += '<p><b>Tip:</b> ' + esc(plan.narrator.tip) + '</p>';
  if (t.note) h += '<p class="note"><b>Care note:</b> ' + esc(t.note) + '</p>';
  h += '<h2>2. Questions</h2><ol>';
  for (const q of plan.qs) h += '<li><span class="tag">' + esc(q.type) + '</span> ' + esc(q.text) + '</li>';
  h += '</ol>';
  h += '<h2>3. Follow-up prompts</h2><p>' + FOLLOWUPS.map(esc).join(' &nbsp;&bull;&nbsp; ') + '</p>';
  h += '<p>Listen more than you talk. Let silence sit. Don\'t correct their memory. If a topic is painful, offer to stop or move on.</p>';
  h += '<h2>4. Notes</h2><table class="grid"><tr><th>Q</th><th>Key words they used</th><th>A story to save (their words)</th><th>Follow-up to ask later</th></tr>';
  for (let i = 1; i <= plan.qs.length; i++) h += '<tr><td>' + i + '</td><td></td><td></td><td></td></tr>';
  h += '</table>';
  h += '<h2>5. After the interview</h2><p>Thank them. Show them what you wrote and give them a copy. Store your notes privately with the date, theme and first name. Share a story only if they agreed, and only with first names or initials. See the Oral History Project page in Roots &amp; Rivers.</p>';
  h += '<p class="foot"><i>"Every family does it a little differently, and there is no wrong answer here."</i><br>Roots &amp; Rivers: An Interactive Guide to South Asian Cultures for High School Students. CC BY-NC-SA 4.0.</p>';
  return h;
}

function printPlan() {
  const box = document.getElementById('print-plan');
  if (!box) return;
  box.innerHTML = buildPrintHTML();
  window.print();
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

function positionControls() {
  if (!themeSelect) return;
  const selW = Math.max(150, canvasWidth - 100);
  themeSelect.style('width', selW + 'px');
  narratorSelect.style('width', Math.min(selW, 320) + 'px');
  themeSelect.position(90, drawHeight + 8);
  narratorSelect.position(90, drawHeight + 44);
  lengthSelect.position(10, drawHeight + 82);
  const lw = lengthSelect.elt.offsetWidth || 110;
  newButton.position(10 + lw + 10, drawHeight + 82);
  const nw = newButton.elt.offsetWidth || 115;
  printButton.position(10 + lw + 10 + nw + 10, drawHeight + 82);
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
