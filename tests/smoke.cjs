const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/i);
assert.ok(match, 'Inline application script exists');
assert.doesNotMatch(html, /<main[^>]*aria-live=/i, 'The entire dynamic page is not announced on every render');
assert.match(html, /role="status" aria-live="polite" aria-atomic="true"/, 'Answer feedback uses a concise accessible live status');
const darkThemeCss = html.match(/\/\* Dark theme surfaces and text[\s\S]*?<\/style>/i)?.[0] || '';
for (const selector of ['.question-card h1', '.question-label', '.question-instruction', '.sentence-box', '.blank-slot', '.option-button', '.feedback-card', '.language-option.is-selected', '.level-option.is-selected', '.onboarding-page > .eyebrow', '.onboarding-intro']) {
  assert.ok(darkThemeCss.includes(`body.dark-theme ${selector}`), `Dark theme explicitly styles ${selector}`);
}
assert.doesNotMatch(html, /style="[^"]*\bcolor\s*:/i, 'Question and progress text use theme-aware classes rather than inline colors');
function relativeLuminance(hex) {
  const rgb = hex.match(/[0-9a-f]{2}/gi).map(part => parseInt(part, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrastRatio(first, second) {
  const a = relativeLuminance(first); const b = relativeLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
const darkVars = darkThemeCss.match(/body\.dark-theme\s*\{([^}]+)\}/)?.[1] || '';
const cssVar = name => darkVars.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
for (const name of ['--text-primary', '--text-secondary', '--text-muted', '--accent-text']) {
  assert.ok(contrastRatio(cssVar(name), cssVar('--surface-card')) >= 4.5, `${name} meets WCAG AA contrast on the dark question card`);
}

const listeners = {};
const store = new Map();
let storageBlocked = false;
const main = { innerHTML: '', replaceChildren(fragment) { this.innerHTML = fragment.markup || ''; } };
const toast = { textContent: '', classList: { add() {}, remove() {} } };
const sidebarStreak = { textContent: '' };
const accentSelect = { id: 'accent-select', value: 'en-US' };
const levelSwitchLabel = { textContent: '' };
class FakeDomElement {
  constructor(tagName, attributes = [], textContent = '') {
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes.map(([name, value]) => ({ name, value: String(value) }));
    this.textContent = textContent;
    this.parentElement = null;
    this.children = [];
  }
  appendChild(child) { child.parentElement = this; this.children.push(child); return child; }
  setAttribute(name, value) {
    const current = this.attributes.find(attribute => attribute.name === name);
    if (current) current.value = String(value); else this.attributes.push({ name, value: String(value) });
  }
  removeAttribute(name) { this.attributes = this.attributes.filter(attribute => attribute.name !== name); }
  remove() {
    if (!this.parentElement) return;
    const siblings = this.parentElement.children;
    siblings.splice(siblings.indexOf(this), 1);
    this.parentElement = null;
  }
  replaceWith(node) {
    if (!this.parentElement) return;
    const siblings = this.parentElement.children;
    const index = siblings.indexOf(this);
    node.parentElement = this.parentElement;
    siblings[index] = node;
    this.parentElement = null;
  }
}
function allDescendants(nodes) { return nodes.flatMap(node => [node, ...allDescendants(node.children || [])]); }
function makeSanitizerFixture() {
  const root = { markup: '', children: [], querySelectorAll() { return allDescendants(this.children); }, contains(node) { while (node) { if (node === this) return true; node = node.parentElement; } return false; } };
  const button = new FakeDomElement('button', [['class', 'safe-button'], ['id', 'constructor'], ['name', 'alert'], ['onclick', 'alert(1)'], ['data-action', 'speak-word'],  ['data-word', 'hello'], ['style', 'color:#ffffff;background:url(https://example.com/x)'], ['href', 'javascript:alert(1)'], ['aria-label', '<img src=x>']], 'Speak');
  const svg = new FakeDomElement('svg', [['id', 'recall-clue'], ['onload', 'alert(1)']]);
  svg.appendChild(new FakeDomElement('path', [['d', 'M0 0L1 1'], ['fill', 'url(https://example.com/x)']]));
  const nctbLink = new FakeDomElement('a', [['href', 'https://nctb.gov.bd/pages/static-pages/123']], 'Official listing');
  const externalLink = new FakeDomElement('a', [['href', 'https://example.com/unsafe']], 'External site');
  root.children = [button, svg, nctbLink, externalLink, new FakeDomElement('script', [], 'alert(1)'), new FakeDomElement('img', [['src', 'https://example.com/x'], ['onerror', 'alert(1)']])];
  root.children.forEach(child => { child.parentElement = root; });
  return root;
}
const searchInput = { id: 'word-search', value: '', selectionStart: 0, focus() {}, setSelectionRange(start) { this.selectionStart = start; } };
const recallInput = { id: 'recall-answer', value: '' };
const progressImportInput = { id: 'progress-import', value: '', files: [], click() { this.clicked = true; } };
const exportedBlobs = [];
const exportedLinks = [];
class FakeBlob { constructor(parts, options) { this.parts = parts; this.type = options.type; } }
const bodyClasses = new Set();
const navButtons = ['home', 'games', 'explore', 'nuance', 'wordbook'].flatMap(view => [0, 1].map(() => ({
  dataset: { view },
  classList: { toggle() {} },
  setAttribute() {}
})));
const document = {
  body: { classList: { toggle(name, enabled) { enabled ? bodyClasses.add(name) : bodyClasses.delete(name); } }, appendChild() {} },
  createElement(tag) {
    if (tag === 'template') {
      const content = { markup: '', children: [], querySelectorAll() { return allDescendants(this.children); }, contains(node) { while (node) { if (node === this) return true; node = node.parentElement; } return false; } };
      const template = { content };
      Object.defineProperty(template, 'innerHTML', { set(value) {
        content.markup = String(value);
        content.children = content.markup === '__DOM_SANITIZER_FIXTURE__' ? makeSanitizerFixture().children : [];
        content.children.forEach(child => { child.parentElement = content; });
      } });
      return template;
    }
    assert.equal(tag, 'a');
    const link = { href: '', download: '', click() { exportedLinks.push(this); }, remove() {} };
    return link;
  },
  createTextNode(text) { return { textContent: String(text) }; },
  addEventListener(type, callback) { listeners[type] = callback; },
  querySelectorAll() { return navButtons; },
  getElementById(id) {
    if (id === 'main-content') return main;
    if (id === 'toast') return toast;
    if (id === 'sidebar-streak') return sidebarStreak;
    if (id === 'accent-select') return accentSelect;
    if (id === 'level-switch-label') return levelSwitchLabel;
    if (id === 'word-search') return searchInput;
    if (id === 'recall-answer') return recallInput;
    if (id === 'progress-import') return progressImportInput;
    return null;
  }
};
const spoken = [];
const speechVoices = [
  { name: 'Google UK English Female', lang: 'en-GB', default: false },
  { name: 'Device US English', lang: 'en-US', default: true }
];
const speechEvents = {};
let speechVoicesReady = true;
class FakeUtterance {
  constructor(text) { this.text = text; this.lang = ''; this.rate = 1; this.voice = null; }
}
const sandbox = {
  Blob: FakeBlob,
  document,
  window: {
    scrollTo() {},
    setTimeout() { return 1; },
    URL: { createObjectURL(blob) { exportedBlobs.push(blob); return 'blob:wordtrail-test'; }, revokeObjectURL() {} },
    SpeechSynthesisUtterance: FakeUtterance,
    speechSynthesis: {
      getVoices() { return speechVoicesReady ? speechVoices : []; },
      addEventListener(type, callback) { speechEvents[type] = callback; },
      cancel() {},
      speak(utterance) { spoken.push(utterance); }
    }
  },
  localStorage: {
    getItem(key) { if (storageBlocked) throw new Error('Storage unavailable'); return store.has(key) ? store.get(key) : null; },
    setItem(key, value) { if (storageBlocked) throw new Error('Quota exceeded'); store.set(key, value); },
    removeItem(key) { if (storageBlocked) throw new Error('Storage unavailable'); store.delete(key); }
  },
  setTimeout() { return 1; },
  clearTimeout() {},
  console
};
vm.createContext(sandbox);
const testOnlyScript = match[1].replace('    initializeSpeechVoices();\n    render();\n    })();', '    initializeSpeechVoices();\n    render();\n    globalThis.__wordtrailTest = { evaluate(expression) { return eval(expression); } };\n    })();');
assert.notEqual(testOnlyScript, match[1], 'Test-only bridge is injected without exposing application state in production');
vm.runInContext(testOnlyScript, sandbox, { filename: 'wordtrail-inline.js' });
const vmMath = vm.runInContext('Math', sandbox);
function withRandom(value, callback) {
  const original = vmMath.random;
  vmMath.random = () => value;
  try { return callback(); } finally { vmMath.random = original; }
}
function withRandomSequence(values, callback) {
  const original = vmMath.random;
  let index = 0;
  vmMath.random = () => values[index++] ?? 0.99;
  try { return callback(); } finally { vmMath.random = original; }
}

function value(expression) { return sandbox.__wordtrailTest.evaluate(expression); }
function click({ view = null, action = null, data = {} }) {
  const target = {
    closest(selector) {
      if (selector === '[data-view]' && view) return { dataset: { view } };
      if (selector === '[data-action]' && action) return { dataset: { ...data, action }, disabled: false };
      return null;
    }
  };
  listeners.click({ target });
}
function changeAccent(value) {
  accentSelect.value = value;
  listeners.change({ target: accentSelect });
}
function searchWord(value) {
  searchInput.value = value;
  searchInput.selectionStart = value.length;
  listeners.input({ target: searchInput });
}
function pressKey(key, focusedInteractive = false) {
  const event = { key, target: { closest() { return focusedInteractive ? {} : null; } }, preventDefault() { this.defaultPrevented = true; } };
  listeners.keydown(event);
  return event;
}
function clickMiniAnswer(word) { click({ action: 'mini-answer', data: { answer: word } }); }
function typeRecall(word) {
  recallInput.value = word;
  listeners.input({ target: recallInput });
}
function submitRecall(word) {
  recallInput.value = word;
  const event = { target: { id: 'recall-form' }, preventDefault() { this.prevented = true; } };
  listeners.submit(event);
  assert.equal(event.prevented, true);
}
function nextMini() { click({ action: 'next-mini' }); }
function answer(word) { click({ action: 'answer', data: { answer: word } }); }
function advance() { click({ action: 'next-question' }); }
function finishMiniGame(mode, wrongIndexes = []) {
  click({ action: 'start-mini', data: { game: mode } });
  assert.equal(value('state.view'), 'mini');
  const expectedCount = Math.min(['story', 'listen'].includes(mode) ? 4 : 5, value(`${mode.toUpperCase()}_ROUNDS.length`));
  assert.equal(value('state.miniSession.rounds.length'), expectedCount);
  if (mode === 'listen') {
    assert.match(main.innerHTML, /Listen &amp; Match/);
    assert.match(main.innerHTML, /Play the word/);
    assert.match(main.innerHTML, /Play slowly/);
  }
  if (mode === 'story') {
    assert.match(main.innerHTML, /Story Clues/);
    assert.match(main.innerHTML, /SHORT STORY/);
  }
  const count = value('state.miniSession.rounds.length');
  for (let i = 0; i < count; i += 1) {
    const round = value('currentMiniRound()');
    const selected = wrongIndexes.includes(i) ? round.options.find(option => option !== round.answer) : round.answer;
    clickMiniAnswer(selected);
    assert.match(main.innerHTML, /Nice fit\.|best fit here is/);
    nextMini();
  }
  assert.equal(value('state.view'), 'mini-summary');
}

// First visit walks through the support language and English self-assessment before any lesson starts.
assert.equal(value('state.view'), 'onboarding');
assert.equal(value('state.onboardingStep'), 'language');
assert.ok(bodyClasses.has('onboarding-mode'));
assert.match(main.innerHTML, /STEP 1 OF 2 · SUPPORT LANGUAGE/);
assert.match(main.innerHTML, /Which language would you like to use/);
assert.match(main.innerHTML, /English practice stays in English/);
assert.match(main.innerHTML, /Choose a support language to set the language for word hints/);
assert.match(main.innerHTML, /data-action="continue-onboarding-language" disabled/);
assert.match(main.innerHTML, /Español/);
assert.match(main.innerHTML, /हिन्दी/);
assert.match(main.innerHTML, /বাংলা/);
assert.match(main.innerHTML, /Français/);
assert.match(html, /class=\"skip-link\" href=\"#main-content\"/);
assert.equal((html.match(/class=\"nav-button(?: active)?\" data-view=\"(?:home|games|explore|nuance|wordbook)\" aria-label=/g) || []).length, 9, 'My Wordbook stays on desktop while Academy replaces its mobile tab');
assert.equal((html.match(/class=\"nav-button(?: active)?\" data-view=\"academy\" aria-label=\"Academy\"/g) || []).length, 2, 'Academy appears in both desktop and mobile navigation');
const desktopNav = html.match(/<nav class=\"nav-list\"[\s\S]*?<\/nav>/i)?.[0] || '';
const mobileNav = html.match(/<nav class=\"mobile-nav\"[\s\S]*?<\/nav>/i)?.[0] || '';
assert.match(desktopNav, /data-view=\"wordbook\"/, 'Desktop retains the direct Wordbook shortcut');
assert.doesNotMatch(mobileNav, /data-view=\"wordbook\"/, 'Mobile bottom tabs are uncluttered; Wordbook is reached within Academy');
assert.equal(value('ACCENT_OPTIONS.length'), 6);
assert.match(html, /http-equiv="Content-Security-Policy"/);
assert.match(html, /default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'/);
assert.doesNotMatch(html, /main\.innerHTML\s*=/, 'Dynamic render output is mounted only after allowlist sanitization');
assert.match(html, /function sanitizeHtmlFragment/);
assert.match(html, /function wordtrailApp\(\)/);
assert.doesNotMatch(html, /window\.(?:QUESTIONS|state)\s*=/);
assert.equal((html.match(/\.innerHTML\s*=/g) || []).length, 1, 'Only the inert sanitizer template parses HTML strings');
assert.equal(value("sanitizeInlineStyle('color:#ffffff;background:url(javascript:alert(1));width:50%')"), 'color:#ffffff;width:50%', 'Unsafe inline CSS is stripped by the style allowlist');
assert.equal(value("sanitizeInlineStyle('--game-tint:#e8f0dc;--score:100;background:#ffffff;width:50%;font-size:13px;margin:0;margin-left:auto;margin-top:11px')"), '--game-tint:#e8f0dc;--score:100;background:#ffffff;width:50%;font-size:13px;margin:0;margin-left:auto;margin-top:11px', 'Allowed template styles preserve expected layout and game indicators');
const sanitizedFixture = value(`(() => { const fragment = sanitizeHtmlFragment('__DOM_SANITIZER_FIXTURE__'); const button = fragment.children.find(node => node.tagName === 'BUTTON'); const svg = fragment.children.find(node => node.tagName === 'SVG'); const path = svg.children[0]; const links = fragment.children.filter(node => node.tagName === 'A'); return { buttonAttributes: button.attributes.map(attribute => attribute.name + ':' + attribute.value).sort().join('|'), svgAttributes: svg.attributes.map(attribute => attribute.name + ':' + attribute.value).join('|'), pathAttributes: path.attributes.map(attribute => attribute.name).join('|'), nctbHref: links[0]?.attributes.find(attribute => attribute.name === 'href')?.value || '', unsafeHref: links[1]?.attributes.find(attribute => attribute.name === 'href')?.value || '', scriptPresent: fragment.children.some(node => node.tagName === 'SCRIPT'), imagePresent: fragment.children.some(node => node.tagName === 'IMG') }; })()`);
assert.equal(sanitizedFixture.buttonAttributes, ['aria-label:img src=x', 'class:safe-button', 'data-action:speak-word', 'data-word:hello', 'style:color:#ffffff'].sort().join('|'), 'The sanitizer keeps only safe button attributes and CSS');
assert.equal(sanitizedFixture.svgAttributes, 'id:recall-clue', 'SVG event handlers are removed while a known application id remains');
assert.equal(value("['practice-preview-title', 'progress-import', 'word-search', 'recall-form', 'recall-answer', 'recall-clue', 'onboarding-gloss-toggle'].every(id => SAFE_HTML_IDS.has(id))"), true, 'Every application-generated dynamic id is explicitly allowlisted');
assert.equal(sanitizedFixture.pathAttributes, 'd', 'URL-bearing SVG paint attributes are removed');
assert.equal(sanitizedFixture.nctbHref, 'https://nctb.gov.bd/pages/static-pages/123', 'The sanitizer permits source-approved NCTB HTTPS links');
assert.equal(sanitizedFixture.unsafeHref, '', 'Other external links are stripped from dynamic markup');
assert.equal(sanitizedFixture.scriptPresent || sanitizedFixture.imagePresent, false, 'Executable and external-resource elements never survive sanitization');
assert.equal(value("sanitizeUserText('<script>alert(1)</script>', 80)"), 'scriptalert(1)/script', 'User-entered markup delimiters are removed before persistence');
assert.equal(value("sanitizeProgress({ ...DEFAULT_PROGRESS, glossLanguage: 'en', showGloss: true }).showGloss"), false, 'The English/no-extra-gloss option cannot display stale native-language translations');
assert.equal(value("['beginner', 'intermediate', 'advanced', 'unsure'].every(level => STARTER_PATHS[level].ids.every(id => QUESTION_BY_ID[id].env === STARTER_PATHS[level].env))"), true);
click({ view: 'home' });
assert.equal(value('state.view'), 'onboarding', 'A learner must complete setup before entering the app');
click({ action: 'select-onboarding-language', data: { language: 'bn' } });
assert.equal(value('state.progress.uiLanguage'), 'bn', 'Support-language choice also sets the app language');
assert.equal(value('state.progress.glossLanguage'), 'bn', 'Support-language choice also selects the optional word-hint language');
assert.equal(value('state.progress.showGloss'), true, 'Translated hints are enabled by default for a non-English support language');
assert.match(main.innerHTML, /আপনি কোন ভাষাটি ব্যবহার করতে চান/);
listeners.change({ target: { id: 'onboarding-gloss-toggle', checked: false } });
assert.equal(value('state.progress.showGloss'), false, 'Word hints remain optional and can be switched off during setup');
click({ action: 'select-onboarding-language', data: { language: 'en' } });
assert.equal(value('state.progress.uiLanguage'), 'en');
assert.equal(value('state.progress.glossLanguage'), 'en', 'English support selection clears a stale non-English hint language');
assert.equal(value('state.progress.showGloss'), false);
click({ action: 'continue-onboarding-language' });
assert.equal(value('state.onboardingStep'), 'level');
assert.match(main.innerHTML, /STEP 2 OF 2 · ENGLISH LEVEL/);
assert.match(main.innerHTML, /How comfortable are you with English/);
assert.match(main.innerHTML, /This is not a test/);
assert.match(main.innerHTML, /I know a few words/);
click({ action: 'select-onboarding-level', data: { level: 'beginner' } });
assert.equal(value('state.view'), 'onboarding', 'Selecting a level only selects it; it does not skip the support-language step or start a lesson');
assert.equal(value('state.progress.level'), null);
assert.match(main.innerHTML, /data-level="beginner" aria-pressed="true"/);

// Completing setup starts a short, familiar Home & Friends round and saves both choices.
withRandomSequence([0, 0.99, 0.99], () => click({ action: 'complete-onboarding' }));
assert.equal(value('state.progress.level'), 'beginner');
assert.equal(value('state.progress.uiLanguage'), 'en');
assert.equal(value('state.view'), 'challenge');
assert.equal(value('state.session.mode'), 'starter');
assert.equal(value('state.session.questions.length'), 4);
assert.equal(value('state.session.questions[0].options.indexOf(state.session.questions[0].answer)'), 3, 'Correct scene choice is shuffled away from A for a deterministic shuffle');
assert.equal(value('state.session.envId'), 'home');
assert.equal(value("state.session.questions.map(question => question.id).join(',')"), 'tired,kind,happy,comfortable');
assert.match(main.innerHTML, /Beginner · Home &amp; friends/);
assert.match(main.innerHTML, /Scene 1 of 4/);
for (let i = 0; i < 4; i += 1) {
  if (i === 0) {
    const shortcut = String(value('currentQuestion().options.indexOf(currentQuestion().answer) + 1'));
    const focused = pressKey(shortcut, true);
    assert.equal(focused.defaultPrevented, undefined, 'Number shortcuts do not interrupt a focused control');
    assert.equal(value('state.session.choice'), null);
    assert.equal(pressKey(shortcut).defaultPrevented, true, 'Number shortcuts select the matching answer');
    assert.equal(value('state.session.showingFeedback'), true);
    assert.equal(pressKey('Enter').defaultPrevented, true, 'Enter advances after feedback');
  } else {
    answer(value('currentQuestion().answer'));
    advance();
  }
}
assert.equal(value('state.view'), 'summary');
assert.match(main.innerHTML, /BEGINNER STARTER/);
assert.equal(value('state.progress.totalAnswered'), 4);
assert.equal(value('state.progress.gameRuns.scene'), 1);
assert.ok(!bodyClasses.has('onboarding-mode'));
click({ view: 'home' });
assert.match(main.innerHTML, /Start with Home &amp; friends/);
click({ action: 'start-recommended' });
assert.equal(value('state.session.mode'), 'environment');
assert.equal(value('state.session.envId'), 'home');
assert.equal(value('state.session.questions.length'), 5);
click({ view: 'games' });
click({ action: 'start-mini', data: { game: 'story' } });
assert.equal(value("state.miniSession.rounds.every(round => !round.wordId || QUESTION_BY_ID[round.wordId].band !== 'Stretch')"), true, 'Beginner story rounds avoid stretch vocabulary');
click({ view: 'games' });

// Level can be changed later; the new choice starts in a different, suitably matched setting.
value("state.progress.glossLanguage = 'bn'; state.progress.showGloss = true");
click({ action: 'change-level' });
assert.equal(value('state.view'), 'onboarding');
assert.equal(value('state.onboardingStep'), 'level');
assert.match(main.innerHTML, /Keep my current level and return home/);
assert.match(main.innerHTML, /Your support language/);
click({ action: 'select-onboarding-level', data: { level: 'intermediate' } });
assert.equal(value('state.progress.level'), 'beginner', 'A later level change remains a deliberate choice until saved');
assert.equal(value('state.view'), 'onboarding');
click({ action: 'complete-onboarding' });
assert.equal(value('state.progress.level'), 'intermediate');
assert.equal(value('state.progress.glossLanguage'), 'bn', 'Changing only the level preserves a separately configured word-hint language');
assert.equal(value('state.progress.showGloss'), true, 'Changing only the level preserves the word-hint toggle');
value("state.progress.showGloss = false; state.progress.glossLanguage = 'es'; saveProgress()");
assert.equal(value('state.session.envId'), 'market');
assert.equal(value('state.session.questions.length'), 4);
assert.equal(value("state.session.questions.every(question => question.env === 'market')"), true);
click({ view: 'games' });
assert.equal(value('state.view'), 'games');

// Academy keeps the original wordbook data, gives each grade a real curriculum/test/writing route, and labels generated exams clearly.
assert.equal(value("Object.keys(ACADEMY_CONTENT.grades).sort((a,b) => Number(a)-Number(b)).join(',')"), '6,7,8,9,10');
assert.equal(value("Object.values(ACADEMY_CONTENT.grades).every((grade,index) => grade.books.includes('English for Today') && grade.units.length > 0 && grade.tests.length > 0)"), true);
assert.equal(value("Object.entries(ACADEMY_CONTENT.grades).every(([grade, data]) => { const ids = new Set(ACADEMY_CONTENT.writing.filter(item => item.grade === Number(grade)).map(item => item.id)); return data.tests.every(test => [...(test.tasks || []).map(task => task.writingId), ...(test.writingId ? [test.writingId] : [])].filter(Boolean).every(id => ids.has(id))); })"), true, 'Every practice-test model-answer link resolves within the selected grade');
assert.equal(value("ACADEMY_CONTENT.writing.every(item => item.title && item.prompt && item.modelAnswer && item.banglaNote && ACADEMY_CONTENT.grades[item.grade])"), true, 'Every original writing model has English content and Bangla support');
assert.equal(value("Object.entries(ACADEMY_CONTENT.grades).every(([grade]) => ['paragraph','dialogue','composition','story'].every(type => ACADEMY_CONTENT.writing.some(item => item.grade === Number(grade) && item.type === type)))"), true, 'Every grade has core paragraph, dialogue, composition, and story models');
value("state.progress.savedIds = ['tired']; state.progress.uiLanguage = 'en'; state.view = 'home'; saveProgress(); render()");
click({ view: 'academy' });
assert.equal(value('state.view'), 'academy');
assert.equal(value('state.academyClass'), 8);
assert.match(main.innerHTML, /Class 8/);
click({ action: 'academy-select-class', data: { grade: '9' } });
assert.equal(value('state.academyClass'), 8, 'Unavailable class actions cannot switch grades');
assert.doesNotMatch(main.innerHTML, /data-action="academy-select-class"|data-action="academy-choose-class"/, 'Other classes are not offered');
assert.match(main.innerHTML, /My Wordbook/);
assert.match(main.innerHTML, /Classes 6–8 use textbook-mapped practice/);
click({ action: 'academy-open-section', data: { section: 'syllabus' } });
assert.match(main.innerHTML, /2026 NCTB textbook list/);
assert.match(main.innerHTML, /https:\/\/nctb\.gov\.bd\/pages\/static-pages/);
click({ action: 'academy-back-class' });
click({ action: 'academy-open-section', data: { section: 'tests' } });
assert.match(main.innerHTML, /Original practice; not an official paper/);
click({ action: 'academy-back-class' });
click({ action: 'academy-open-section', data: { section: 'writing' } });
assert.match(main.innerHTML, /Healthy Food Habits/);
click({ action: 'academy-writing-filter', data: { writingFilter: 'dialogue' } });
assert.match(main.innerHTML, /Planning a Class Trip/);
assert.doesNotMatch(main.innerHTML, /Healthy Food Habits/);
click({ view: 'wordbook' });
assert.equal(value("state.progress.savedIds.join(',')"), 'tired', 'Academy navigation does not change saved Wordbook items');
assert.match(main.innerHTML, /YOUR WORD COLLECTION/);
click({ view: 'academy' });
assert.equal(value('state.academyClass'), 8);
click({ view: 'games' });
assert.equal(value('state.view'), 'games', 'Academy returns to the existing practice navigation without altering it');

// The optional skill suggestion uses prior attempts, never locks other activities.
value("state.progress.gameStats.phrase = { answered: 5, correct: 1 }; state.progress.gameStats.listen = { answered: 5, correct: 4 }; render()");
click({ view: 'games' });
assert.match(main.innerHTML, /Want another try at Phrase Finder/);
assert.match(main.innerHTML, /data-action="start-mini" data-game="phrase"/);
assert.match(main.innerHTML, /data-game="listen"/, 'All other games remain available');
click({ action: 'start-mini', data: { game: 'phrase' } });
assert.equal(value('state.miniSession.mode'), 'phrase');
value("state.progress.gameStats.phrase = { answered: 0, correct: 0 }; state.progress.gameStats.listen = { answered: 0, correct: 0 }");
click({ view: 'games' });
assert.doesNotMatch(main.innerHTML, /Want another try at/);

// Practice choices identify their learning goal and include short stories/listening.
assert.match(main.innerHTML, /What would you like to practice/);
assert.match(main.innerHTML, /YOU’LL PRACTICE/);
assert.match(main.innerHTML, /Find a nearby word/);
assert.match(main.innerHTML, /Opposite Snap/);
assert.match(main.innerHTML, /Phrase Finder/);
assert.match(main.innerHTML, /Listen &amp; Match/);
assert.match(main.innerHTML, /Story Clues/);
assert.match(main.innerHTML, /Recall &amp; Type/);
assert.match(main.innerHTML, /not connected to Google Cloud Text-to-Speech/);
assert.equal(value('ENVIRONMENTS.length'), 5);
assert.equal(value('QUESTIONS.length'), 50);
assert.equal(value("QUESTIONS.every(question => ['es','hi','bn','fr'].every(language => WORD_GLOSSES[question.id] && WORD_GLOSSES[question.id][language]))"), true, 'Every curated vocabulary item has a gloss in all four selected languages');
assert.equal(value("['es','hi','bn','fr'].every(language => UI_TRANSLATIONS[language] && UI_TRANSLATIONS[language]['Home'] && UI_TRANSLATIONS[language]['How comfortable are you with English?'])"), true, 'Core navigation and onboarding are localized in all selected interface languages');
assert.equal(value('STORY_ROUNDS.length'), 9);
assert.equal(value('QUESTION_BY_ID ? Object.keys(QUESTION_BY_ID).length : 0'), 50);
assert.equal(value('Object.getPrototypeOf(QUESTION_BY_ID) === null && Object.getPrototypeOf(ROUND_BY_ID) === null'), true, 'Identifier lookup tables do not inherit prototype keys');
assert.equal(value('Object.isFrozen(QUESTIONS) && Object.isFrozen(QUESTIONS[0]) && Object.isFrozen(QUESTIONS[0].options)'), true, 'Curated questions and canonical options remain immutable');
assert.equal(value('TONE_SCENARIOS.every(scenario => new Set(scenario.options.map(option => option.text)).size === scenario.options.length)'), true, 'Tone Shift option identifiers are unique for safe order restoration');
const answerPositionSequences = [[0.2525, 0.3367, 0.505], [0.2525, 0.3367, 0.005], [0.2525, 0.0034, 0.005], [0.0025, 0.0034, 0.005]];
assert.equal(answerPositionSequences.map(sequence => withRandomSequence(sequence, () => value("shuffled(['answer','wrong-1','wrong-2','wrong-3']).indexOf('answer')"))).join(','), '0,1,2,3', 'Fisher–Yates ordering can place a correct answer in every answer slot');
value("startMiniGame('constructor'); startSession('constructor')");
assert.equal(value('state.view'), 'games', 'Unrecognized user-controlled activity keys are ignored safely');
assert.equal(value("ENVIRONMENTS.every(env => QUESTIONS.filter(question => question.env === env.id).length === 10)"), true);
assert.equal(value("QUESTIONS.every(question => question.options.length === 4 && new Set(question.options).size === 4 && question.options.includes(question.answer) && question.sentence.includes('____'))"), true);
assert.equal(value("new Set(QUESTIONS.map(question => question.id)).size"), 50);
assert.equal(value("QUESTIONS.every(question => ['id','env','scene','sentence','hint','answer','definition','nuance','example','family'].every(field => typeof question[field] === 'string' && question[field].trim()))"), true);
assert.equal(value("QUESTIONS.every(question => RELATED_WORDS[question.id] && ANTONYMS[question.id])"), true);
assert.equal(value("[...SYNONYM_ROUNDS, ...ANTONYM_ROUNDS, ...PHRASE_ROUNDS].every(round => round.prompt && round.explanation && round.sentence)"), true);
assert.equal(value("PHRASE_ROUNDS.every(round => round.sentence.includes('____') && round.options.includes(round.answer))"), true);
assert.equal(value("[...SYNONYM_ROUNDS, ...ANTONYM_ROUNDS, ...PHRASE_ROUNDS, ...STORY_ROUNDS, ...LISTEN_ROUNDS].every(round => round.options.length === 4 && new Set(round.options).size === 4 && round.options.includes(round.answer) && (!round.wordId || QUESTION_BY_ID[round.wordId]))"), true);
assert.equal(value("STORY_ROUNDS.every(round => round.story && round.prompt && round.explanation)"), true);
assert.equal(value("LISTEN_ROUNDS.every(round => round.audioWord && round.wordId)"), true);
assert.equal(value("STARTER_PATHS.advanced.ids.includes('diplomatic')"), true);

// Synonym Switch can be resumed after leaving its page.
withRandom(0, () => click({ action: 'start-mini', data: { game: 'synonym' } }));
assert.equal(value('currentMiniRound().options.indexOf(currentMiniRound().answer)'), 3, 'Mini-game answers also receive a randomized option position');
assert.ok(store.has(value('SESSION_STORAGE_KEY')));
click({ view: 'home' });
assert.match(main.innerHTML, /Continue this round/);
assert.match(main.innerHTML, /starting another round replaces it/);
click({ action: 'resume-session' });
assert.equal(value('state.view'), 'mini');
const firstSynonymAnswer = value('currentMiniRound().answer');
const firstSynonymOrder = value("currentMiniRound().options.join('|')");
clickMiniAnswer(firstSynonymAnswer);
assert.equal(value('state.miniSession.choice'), firstSynonymAnswer);
value('state.session = null; state.toneSession = null; state.miniSession = loadActiveSession().miniSession; state.view = \"home\"; render()');
assert.match(main.innerHTML, /Continue this round/);
click({ action: 'resume-session' });
assert.equal(value('state.view'), 'mini');
assert.equal(value('state.miniSession.choice'), firstSynonymAnswer, 'The selected answer and feedback survive a reload');
assert.equal(value("currentMiniRound().options.join('|')"), firstSynonymOrder, 'Randomized mini-game choice order survives a reload');
nextMini();
for (let i = 1; i < 5; i += 1) {
  clickMiniAnswer(value('currentMiniRound().answer'));
  nextMini();
}
assert.equal(value('state.view'), 'mini-summary');
assert.equal(value('state.progress.gameRuns.synonym'), 1);
assert.equal(store.has(value('SESSION_STORAGE_KEY')), false, 'Completed rounds do not leave a stale resume checkpoint');

// Contextual opposites track a miss and clear it when the learner retries.
finishMiniGame('antonym', [0]);
const missedRoundId = value('state.miniSession.missedIds[0]');
assert.ok(missedRoundId);
click({ action: 'retry-mini' });
assert.equal(value('state.view'), 'mini');
assert.equal(value('state.miniSession.rounds.length'), 1);
clickMiniAnswer(value('currentMiniRound().answer'));
nextMini();
assert.equal(value('state.view'), 'mini-summary');
assert.equal(value('state.progress.missedIds.includes(QUESTION_BY_ID[state.miniSession.rounds[0].wordId].id)'), false);

// A due word earns a recall turn; expired streaks display as zero before the next session.
assert.equal(value("currentPracticeStreak({ lastPlayed: '2000-01-01', streak: 12 })"), 0);
assert.equal(value("currentPracticeStreak({ lastPlayed: todayKey(), streak: 3 })"), 3);
assert.equal(value("currentPracticeStreak({ lastPlayed: previousDayKey(), streak: 3 })"), 3);
const streakCases = value(`(() => {
  const original = state.progress;
  const test = (lastPlayed, streak, dates) => {
    state.progress = { ...original, lastPlayed, streak, practiceDates: dates, gameRuns: {} };
    markPracticeDay('daily');
    const first = state.progress.streak;
    markPracticeDay('daily');
    return [first, state.progress.streak, state.progress.practiceDates.length];
  };
  try { return {
    continuation: test(previousDayKey(), 3, [previousDayKey()]),
    restart: test('2000-01-01', 20, ['2000-01-01']),
    sameDay: test(todayKey(), 4, [todayKey()])
  }; } finally { state.progress = original; saveProgress(); }
})()`);
assert.equal(streakCases.continuation.join(','), '4,4,2', 'Yesterday extends streak once, not twice');
assert.equal(streakCases.restart.join(','), '1,1,2', 'A missed day restarts the counter without deleting progress');
assert.equal(streakCases.sameDay.join(','), '4,4,1', 'Same-day practice does not inflate the counter');

value("state.progress.reviewSchedule.quiet = { stage: 0, dueAt: 1, correctCount: 0, lapses: 0, lastReviewedAt: null }");
click({ action: 'start-daily-mix' });
assert.equal(value("state.miniSession.rounds.filter(round => round.type === 'recall' && round.wordId === 'quiet').length"), 1, 'Due word appears exactly once as a retrieval turn');
assert.equal(value("new Set(state.miniSession.rounds.map(round => round.type)).size"), 4);
assert.equal(value("new Set(state.miniSession.rounds.map(round => round.wordId).filter(Boolean)).size"), value("state.miniSession.rounds.filter(round => round.wordId).length"), 'A due word does not appear twice in the sampler');
value("delete state.progress.reviewSchedule.quiet; state.progress.level = 'beginner'; state.progress.reviewSchedule.diplomatic = { stage: 0, dueAt: 1, correctCount: 0, lapses: 0, lastReviewedAt: null }");
click({ action: 'start-daily-mix' });
assert.equal(value("state.miniSession.rounds.some(round => round.wordId === 'diplomatic')"), false, 'Beginner samplers do not force stretch review');
value("delete state.progress.reviewSchedule.diplomatic; state.progress.level = 'intermediate'");

// Phrase practice, four-part sampler, listening, and short stories all complete.
finishMiniGame('phrase');
click({ action: 'start-daily-mix' });
assert.equal(value('state.miniSession.rounds.length'), 4);
assert.equal(value("new Set(state.miniSession.rounds.map(round => round.type)).size"), 4, 'Sampler draws four distinct skills');
const samplerRecallCount = value("state.miniSession.rounds.filter(round => round.type === 'recall').length");
for (let i = 0; i < 4; i += 1) {
  clickMiniAnswer(value('currentMiniRound().answer'));
  nextMini();
}
assert.equal(value('state.view'), 'mini-summary');
assert.equal(value('state.progress.gameRuns.daily'), 1);
const firstSamplerSkills = value('state.miniSession.rounds.map(round => round.type)');
click({ action: 'start-daily-mix' });
const nextSamplerSkills = value('state.miniSession.rounds.map(round => round.type)');
assert.equal(new Set(nextSamplerSkills).size, 4);
assert.notDeepEqual(nextSamplerSkills, firstSamplerSkills, 'Consecutive samplers change skills and order');
assert.deepEqual(value('loadActiveSession().miniSession.rounds.map(round => round.id)'), value('state.miniSession.rounds.map(round => round.id)'), 'Mixed-skill sampler survives reload in the same order');
// Practice history rotates per browser profile and never changes the progress schema.
const historyKey = value('practiceHistoryKey()');
assert.ok(store.has(historyKey), 'Practice rotation survives refresh');
click({ action: 'start-mini', data: { game: 'synonym' } });
const firstRotation = value('state.miniSession.rounds.map(round => round.id)');
click({ action: 'start-mini', data: { game: 'synonym' } });
const secondRotation = value('state.miniSession.rounds.map(round => round.id)');
assert.equal(new Set([...firstRotation, ...secondRotation]).size, 10, 'A large pool avoids repeating rounds across adjacent sessions');
store.set(historyKey, '{broken json');
assert.doesNotThrow(() => click({ action: 'start-mini', data: { game: 'synonym' } }), 'Corrupt rotation history does not break practice');
finishMiniGame('listen');
finishMiniGame('story');
assert.equal(value('state.progress.gameRuns.listen'), 1);
assert.equal(value('state.progress.gameRuns.story'), 1);

// Typed recall accepts case-insensitive answers and checkpoints both a clue and an unfinished draft.
click({ action: 'start-mini', data: { game: 'recall' } });
assert.equal(value('state.miniSession.mode'), 'recall');
assert.equal(value('state.miniSession.rounds.length'), 4);
assert.match(main.innerHTML, /RECALL FROM MEMORY/);
assert.match(main.innerHTML, /Type the missing word/);
assert.match(main.innerHTML, /Check answer/);
assert.doesNotMatch(main.innerHTML, /class="option-list"/);
assert.doesNotThrow(() => pressKey('1'), 'Numeric shortcuts are ignored safely for typed recall');
assert.equal(value('state.miniSession.choice'), null);
assert.equal(value("state.miniSession.rounds.every(round => round.type === 'recall' && QUESTION_BY_ID[round.wordId])"), true);
value("state.progress.showGloss = true; state.progress.glossLanguage = 'fr'; render()");
click({ action: 'toggle-recall-hint' });
assert.match(main.innerHTML, /Clue:/);
assert.match(main.innerHTML, /class=\"native-gloss\"/, 'Optional native-language gloss also appears beside typed-recall clues');
typeRecall('<img src=x onerror=alert(1)>');
assert.equal(recallInput.value, 'img src=x onerror=alert(1)', 'Free text is sanitized immediately before being used in active state');
assert.equal(JSON.parse(store.get(value('SESSION_STORAGE_KEY'))).mini.draftAnswer, 'img src=x onerror=alert(1)', 'User text is stripped of markup delimiters before storage');
assert.doesNotMatch(main.innerHTML, /<img src=/i);
typeRecall('a draft answer');
assert.equal(JSON.parse(store.get(value('SESSION_STORAGE_KEY'))).mini.draftAnswer, 'a draft answer');
click({ view: 'home' });
assert.match(main.innerHTML, /Continue this round/);
value('state.session = null; state.toneSession = null; state.miniSession = loadActiveSession().miniSession; state.view = \"home\"; render()');
click({ action: 'resume-session' });
assert.equal(value('state.miniSession.hintVisible'), true);
assert.equal(value('state.miniSession.draftAnswer'), 'a draft answer');
assert.match(main.innerHTML, /value=\"a draft answer\"/);
for (let i = 0; i < 4; i += 1) {
  const expected = value('currentMiniRound().answer');
  if (i === 1) {
    submitRecall('definitely-not-the-word');
    assert.match(main.innerHTML, new RegExp(`best fit here is .*${expected}`));
    assert.match(main.innerHTML, /id=\"recall-answer\"[^>]*disabled/);
    assert.ok(value('state.progress.missedIds.includes(currentMiniRound().wordId)'));
  } else {
    submitRecall(i === 0 ? expected.toUpperCase() : expected);
    assert.match(main.innerHTML, /Nice fit\./);
  }
  nextMini();
  if (i < 3) assert.equal(value('state.miniSession.draftAnswer'), '', 'A new recall prompt starts with a blank answer');
}
assert.equal(value('state.view'), 'mini-summary');
assert.equal(value('state.miniSession.missedIds.length'), 1);
click({ action: 'retry-mini' });
assert.equal(value('state.miniSession.rounds.length'), 1);
assert.equal(value('currentMiniRound().type'), 'recall');
submitRecall(value('currentMiniRound().answer').toUpperCase());
assert.match(main.innerHTML, /Nice fit\./);
nextMini();
assert.equal(value('state.view'), 'mini-summary');
assert.equal(value('state.progress.gameRuns.recall'), 1);
assert.equal(value('state.progress.gameStats.recall.answered'), 5 + samplerRecallCount);
assert.equal(value('state.progress.gameStats.recall.correct'), 4 + samplerRecallCount);
assert.equal(value('state.progress.missedIds.length'), 0);

// Review intervals expand after successful retrieval; a miss makes the word due again.
const scheduleStart = 1_000_000;
delete value('state.progress.reviewSchedule').ripe;
value(`updateReviewSchedule(QUESTION_BY_ID.ripe, true, ${scheduleStart})`);
assert.equal(value('state.progress.reviewSchedule.ripe.stage'), 1);
assert.equal(value('state.progress.reviewSchedule.ripe.dueAt'), scheduleStart + 86_400_000);
value(`updateReviewSchedule(QUESTION_BY_ID.ripe, true, ${scheduleStart + 3_600_000})`);
assert.equal(value('state.progress.reviewSchedule.ripe.stage'), 1, 'A same-day correct answer must not accelerate the interval');
assert.equal(value('state.progress.reviewSchedule.ripe.dueAt'), scheduleStart + 86_400_000);
assert.equal(value(`dueReviewIds(${scheduleStart + 86_400_000 - 1}).includes('ripe')`), false);
assert.equal(value(`dueReviewIds(${scheduleStart + 86_400_000}).includes('ripe')`), true);
value(`updateReviewSchedule(QUESTION_BY_ID.ripe, true, ${scheduleStart + 86_400_000})`);
assert.equal(value('state.progress.reviewSchedule.ripe.stage'), 2);
assert.equal(value('state.progress.reviewSchedule.ripe.dueAt'), scheduleStart + 86_400_000 * 4);
value(`updateReviewSchedule(QUESTION_BY_ID.ripe, false, ${scheduleStart + 86_400_000 * 4 + 1})`);
assert.equal(value('state.progress.reviewSchedule.ripe.stage'), 0);
assert.equal(value("dueReviewIds().includes('ripe')"), true);
delete value('state.progress.reviewSchedule').ripe;
value('saveProgress()');

// Accent is saved; Google-named device voices are preferred, with a clear accent fallback.
changeAccent('en-GB');
assert.equal(value('state.progress.accent'), 'en-GB');
click({ action: 'speak-word', data: { word: 'quiet' } });
assert.equal(spoken.at(-1).text, 'quiet');
assert.equal(spoken.at(-1).voice.name, 'Google UK English Female');
assert.equal(spoken.at(-1).lang, 'en-GB');
click({ action: 'speak-word', data: { word: 'quiet', rate: 'slow' } });
assert.equal(spoken.at(-1).rate, 0.72);
changeAccent('en-AU');
click({ action: 'speak-word', data: { word: 'hot' } });
assert.equal(spoken.at(-1).voice.name, 'Device US English', 'Falls back to a generic en-US voice when the selected region is unavailable');
assert.equal(spoken.at(-1).lang, 'en-US');
assert.match(toast.textContent, /No Australian English voice found/);
assert.equal(value('state.progress.accent'), 'en-AU');
speechVoicesReady = false;
value('speechVoiceCache = []');
speechVoices.push({ name: 'Device Australian English', lang: 'en-AU', default: false });
speechVoicesReady = true;
assert.equal(typeof speechEvents.voiceschanged, 'function', 'Speech voices are refreshed from the asynchronous voiceschanged event');
speechEvents.voiceschanged();
click({ action: 'speak-word', data: { word: 'hot' } });
assert.equal(spoken.at(-1).voice.name, 'Device Australian English', 'The selected regional voice is used after asynchronous discovery');
const speechSynthesis = sandbox.window.speechSynthesis;
sandbox.window.speechSynthesis = null;
assert.match(value("speakerButton('safe')"), /disabled aria-disabled=\"true\"/);
assert.match(value('speechDisabledAttributes()'), /disabled/);
click({ action: 'speak-word', data: { word: 'safe' } });
assert.match(toast.textContent, /not available in this browser/);
sandbox.window.speechSynthesis = speechSynthesis;

// A five-question world round, wordbook, reviews, and nuance controls work together.
click({ action: 'start-env', data: { env: 'campus' } });
assert.equal(value('state.view'), 'challenge');
assert.match(main.innerHTML, /Scene 1 of 5/);
const sceneChoiceOrder = value("currentQuestion().options.join('|')");
value('state.session = loadActiveSession().session; state.view = \"challenge\"; render()');
assert.equal(value("currentQuestion().options.join('|')"), sceneChoiceOrder, 'Randomized scene choice order remains stable after reload');
const savedId = value('currentQuestion().id');
click({ action: 'toggle-saved', data: { id: savedId } });
assert.ok(value('state.progress.savedIds.includes(state.session.questions[0].id)'));
answer(value('currentQuestion().answer'));
assert.match(main.innerHTML, /That fits the moment/);
assert.match(main.innerHTML, /Near-synonyms/);
assert.match(main.innerHTML, /Opposites/);
const wrongId = value('state.session.questions[1].id');
advance();
const wrongWord = value('currentQuestion().options.find(option => option !== currentQuestion().answer)');
answer(wrongWord);
assert.match(main.innerHTML, /A closer fit is/);
assert.ok(value('state.progress.missedIds.includes(state.session.questions[1].id)'));
advance();
for (let i = 0; i < 3; i += 1) {
  answer(value('currentQuestion().answer'));
  advance();
}
assert.equal(value('state.view'), 'summary');
assert.match(main.innerHTML, /TRAIL COMPLETE/);
assert.equal(value('state.session.correct'), 4);
assert.equal(value('state.progress.gameRuns.scene'), 2);
click({ action: 'review-missed' });
assert.equal(value('state.view'), 'mini');
assert.equal(value('state.miniSession.rounds.length'), 1);
assert.equal(value('currentMiniRound().type'), 'recall');
submitRecall(value('currentMiniRound().answer'));
nextMini();
assert.equal(value('state.view'), 'mini-summary');
assert.equal(value(`state.progress.missedIds.includes('${wrongId}')`), false);
click({ view: 'wordbook' });
assert.match(main.innerHTML, /Words you saved/);
assert.match(main.innerHTML, /Search by word, meaning, or example/);
assert.match(main.innerHTML, /Opposites:/);
assert.match(main.innerHTML, /data-action="speak-word"/);
searchWord(value(`QUESTION_BY_ID['${savedId}'].answer`));
assert.match(main.innerHTML, new RegExp(value(`QUESTION_BY_ID['${savedId}'].answer`)));
searchWord('no-such-word-should-match');
assert.match(main.innerHTML, /No matching words/);
click({ action: 'clear-book-search' });
click({ action: 'book-filter', data: { filter: 'review' } });
assert.match(main.innerHTML, /Review queue/);
assert.match(main.innerHTML, new RegExp(value(`QUESTION_BY_ID['${savedId}'].answer`)));
click({ action: 'start-review-one', data: { id: savedId } });
assert.equal(value('state.miniSession.mode'), 'review');
assert.equal(value('currentMiniRound().type'), 'recall');
submitRecall(value('currentMiniRound().answer'));
nextMini();
assert.equal(value('state.view'), 'mini-summary');
click({ view: 'wordbook' });
click({ view: 'home' });
click({ action: 'start-review' });
assert.equal(value('state.miniSession.mode'), 'review');
assert.ok(value('state.miniSession.rounds.length > 0 && state.miniSession.rounds.length <= 5'));
assert.equal(value("state.miniSession.rounds.every(round => round.type === 'recall')"), true);
click({ view: 'wordbook' });
click({ view: 'nuance' });
assert.match(main.innerHTML, /Compare similar words/);
click({ action: 'nuance-family', data: { family: 'looking' } });
assert.match(main.innerHTML, /glance/);
assert.match(main.innerHTML, /inspect/);
assert.match(main.innerHTML, /data-action="speak-word"/);

// Tone Shift remains optional and tracks completion without adding answer pressure.
click({ action: 'start-tone' });
assert.match(main.innerHTML, /Polite \+ specific/);
for (let i = 0; i < 3; i += 1) {
  click({ action: 'tone-answer', data: { index: String(value('state.toneSession.optionsByScenario[state.toneSession.index].findIndex(option => option.correct)')) } });
  assert.match(main.innerHTML, /A thoughtful fit/);
  click({ action: 'next-tone' });
}
assert.match(main.innerHTML, /All three messages fit their goals/);
assert.equal(value('state.toneSession.correct'), 3);
assert.equal(value('state.progress.gameRuns.tone'), 1);

// Starting a different activity clears the previous hidden round, so Home can never resume a stale session first.
click({ view: 'games' });
click({ action: 'start-mini', data: { game: 'synonym' } });
assert.ok(value('state.miniSession && state.miniSession.mode === \'synonym\''));
withRandomSequence([0, 0.99, 0.99], () => click({ action: 'start-tone' }));
assert.equal(value('state.miniSession'), null);
assert.equal(value('state.session'), null);
assert.ok(value('state.toneSession'));
click({ action: 'tone-answer', data: { index: String(value('state.toneSession.optionsByScenario[0].findIndex(option => option.correct)')) } });
const selectedToneText = value('state.toneSession.optionsByScenario[0][state.toneSession.choice].text');
const selectedToneOrder = value("state.toneSession.optionsByScenario[0].map(option => option.text).join('|')");
click({ view: 'home' });
value('state.session = null; state.miniSession = null; state.toneSession = loadActiveSession().toneSession; state.view = \"home\"; render()');
assert.match(main.innerHTML, /your Tone Shift round/);
click({ action: 'resume-session' });
assert.equal(value('state.view'), 'tone');
assert.equal(value('state.toneSession.optionsByScenario[0][state.toneSession.choice].text'), selectedToneText, 'Tone Shift selection survives reload');
assert.equal(value("state.toneSession.optionsByScenario[0].map(option => option.text).join('|')"), selectedToneOrder, 'Tone Shift randomized order survives reload');
click({ action: 'start-recommended' });
assert.equal(value('state.toneSession'), null);
assert.equal(value('state.miniSession'), null);
assert.equal(value('state.session.mode'), 'environment');

// Progress, accent, level, and gentle streak data persist and reload cleanly.
const saved = JSON.parse(store.get('wordtrail-progress-v1'));
assert.equal(saved.totalAnswered, 44);
assert.equal(saved.totalCorrect, 41);
assert.equal(saved.level, 'intermediate');
assert.equal(saved.accent, 'en-AU');
assert.ok(saved.savedIds.length > 0);
assert.ok(Object.keys(saved.reviewSchedule).length > 0);
assert.equal(saved.missedIds.includes(wrongId), false);
assert.equal(saved.practiceDates.length, 1);
assert.equal(value('accuracy()'), 93);
value('state.progress = loadProgress()');
assert.equal(value('state.progress.totalAnswered'), 44);
assert.equal(value('state.progress.level'), 'intermediate');
assert.equal(value('state.progress.accent'), 'en-AU');
assert.ok(value('Object.keys(state.progress.reviewSchedule).length > 0'));
assert.ok(value('state.progress.practiceDates.length === 1'));
store.set('wordtrail-progress-v1', '{broken json');
value('state.progress = loadProgress()');
assert.equal(value('state.progress.totalAnswered'), 0);
assert.equal(value('state.progress.practiceDates.length'), 0);
assert.equal(value('state.progress.level'), null);
assert.equal(value('state.progress.accent'), 'en-US');

(async function testProgressBackups() {
  value('state.progress = loadProgress(); state.view = \"wordbook\"; render()');
  assert.match(main.innerHTML, /Keep your progress portable/);
  assert.match(main.innerHTML, /Download backup/);
  assert.match(main.innerHTML, /Restore backup/);
  click({ action: 'choose-progress-import' });
  assert.equal(progressImportInput.clicked, true);
  click({ action: 'export-progress' });
  assert.equal(exportedLinks.length, 1);
  assert.match(exportedLinks[0].download, /^wordtrail-backup-\d{4}-\d{2}-\d{2}\.json$/);
  assert.equal(exportedBlobs.length, 1);
  assert.equal(exportedBlobs[0].type, 'application/json');
  assert.match(exportedBlobs[0].parts[0], /\"app\": \"wordtrail\"/);

  const hostileProgress = JSON.stringify({ totalAnswered: 2, totalCorrect: 500, gameStats: { recall: { answered: 2, correct: 500 } }, practiceDates: ['2026-10-02', '2026-99-99', '<script>'], lastPlayed: '<script>alert(1)</script>', savedIds: ['safe', '__proto__', 'constructor', 'toString'], missedIds: ['constructor'], reviewSchedule: { constructor: { stage: 2, dueAt: 1 } }, level: '__proto__' });
  assert.equal(value(`sanitizeProgress(JSON.parse(${JSON.stringify(hostileProgress)})).savedIds.join(',')`), 'safe');
  assert.equal(value(`sanitizeProgress(JSON.parse(${JSON.stringify(hostileProgress)})).totalCorrect`), 2);
  assert.equal(value(`sanitizeProgress(JSON.parse(${JSON.stringify(hostileProgress)})).gameStats.recall.correct`), 2);
  assert.equal(value(`sanitizeProgress(JSON.parse(${JSON.stringify(hostileProgress)})).practiceDates.join(',')`), '2026-10-02', 'Impossible and malformed practice dates are rejected');
  assert.equal(value(`sanitizeProgress(JSON.parse(${JSON.stringify(hostileProgress)})).lastPlayed`), null, 'Malformed last-played values cannot enter progress state');
  assert.equal(value(`sanitizeProgress(JSON.parse(${JSON.stringify(hostileProgress)})).missedIds.length`), 0);
  assert.equal(value(`Object.keys(sanitizeProgress(JSON.parse(${JSON.stringify(hostileProgress)})).reviewSchedule).length`), 0);
  assert.equal(value(`sanitizeProgress(JSON.parse(${JSON.stringify(hostileProgress)})).level`), null);
  store.set(value('SESSION_STORAGE_KEY'), JSON.stringify({ version: 1, scene: { mode: 'daily', questionIds: ['constructor'], index: 0 }, mini: { mode: 'synonym', roundIds: ['toString'], index: 0 } }));
  assert.equal(value('loadActiveSession().session'), null);
  assert.equal(value('loadActiveSession().miniSession'), null, 'Inherited object keys cannot be restored as game rounds');
  store.set(value('SESSION_STORAGE_KEY'), JSON.stringify({ version: 2, mini: { mode: 'synonym', roundIds: ['syn-helpful'], optionOrders: [['__proto__', 'constructor', 'toString', 'bad']], index: 0, choice: null, correct: 0, answered: 0 } }));
  assert.equal(value('loadActiveSession().miniSession.rounds[0].options.length'), 4);
  assert.equal(value('loadActiveSession().miniSession.rounds[0].options.includes(loadActiveSession().miniSession.rounds[0].answer)'), true, 'Altered stored option orders cannot replace correct choices');
  store.set(value('SESSION_STORAGE_KEY'), JSON.stringify({ version: 2, mini: { mode: 'recall', roundIds: ['recall-tired'], optionOrders: [null], index: 0, choice: null, correct: 0, answered: 0, results: [], draftAnswer: '<script>run()</script>', hintVisible: false, missedIds: [] } }));
  assert.equal(value('loadActiveSession().miniSession.draftAnswer'), 'scriptrun()/script', 'HTML-looking text recovered from localStorage is sanitized');
  store.set(value('SESSION_STORAGE_KEY'), JSON.stringify({ version: 2, scene: { mode: 'daily', questionIds: ['tired'], optionOrders: [['tired', 'kind', 'happy', 'comfortable']], index: 0, choice: null, answered: 0, correct: 0, missedIds: [] }, tone: { index: 0, choice: null, correct: 0, optionOrders: [] } }));
  assert.equal(value('loadActiveSession().session'), null);
  assert.equal(value('loadActiveSession().toneSession'), null, 'Mixed active-session payloads are discarded');
  store.set(value('SESSION_STORAGE_KEY'), JSON.stringify({ version: 1, tone: { index: 0, choice: 0, correct: 0 } }));
  const migratedTone = value('loadActiveSession().toneSession');
  assert.equal(migratedTone.optionsByScenario[0][migratedTone.choice].text, value('TONE_SCENARIOS[0].options[0].text'), 'Legacy Tone Shift selections are remapped when choices are shuffled');
  const backupText = JSON.stringify({ app: 'wordtrail', version: 1, progress: { totalAnswered: 7, totalCorrect: 5, streak: 2, practiceDates: ['2026-10-02'], gameRuns: { recall: 2 }, savedIds: ['safe', 'not-a-word'], missedIds: ['quiet'], reviewSchedule: { quiet: { stage: 2, dueAt: 123456, correctCount: 2 }, 'not-a-word': { stage: 9, dueAt: 123456 } }, level: 'advanced', accent: 'en-GB' } });
  await value(`readProgressImport({ size: ${backupText.length}, text: () => Promise.resolve(${JSON.stringify(backupText)}) })`);
  assert.equal(value('state.progress.totalAnswered'), 0, 'Reading a backup previews it without changing current progress');
  assert.equal(value('state.pendingImport.totalAnswered'), 7);
  assert.equal(value('state.pendingImport.savedIds.join(\',\')'), 'safe');
  assert.equal(value('state.pendingImport.reviewSchedule.quiet.stage'), 2);
  assert.equal(value('state.pendingImport.reviewSchedule[\"not-a-word\"]'), undefined);
  assert.match(main.innerHTML, /Backup ready to restore/);
  click({ action: 'cancel-progress-import' });
  assert.equal(value('state.pendingImport'), null);
  assert.equal(value('state.progress.totalAnswered'), 0);

  await value(`readProgressImport({ size: ${backupText.length}, text: () => Promise.resolve(${JSON.stringify(backupText)}) })`);
  store.set(value('SESSION_STORAGE_KEY'), 'stale active round');
  store.set(value('practiceHistoryKey()'), JSON.stringify({ synonym: ['syn-safe'] }));
  click({ action: 'confirm-progress-import' });
  assert.equal(store.has(value('practiceHistoryKey()')), false, 'Restoring a different profile resets old question rotation');
  assert.equal(value('state.progress.totalAnswered'), 7);
  assert.equal(value('state.progress.totalCorrect'), 5);
  assert.equal(value('state.progress.level'), 'advanced');
  assert.equal(value('state.progress.accent'), 'en-GB');
  assert.equal(value('state.progress.savedIds.length'), 1);
  assert.equal(value('state.progress.gameRuns.recall'), 2);
  assert.equal(store.has(value('SESSION_STORAGE_KEY')), false, 'Restoring completed progress clears an unrelated active-round checkpoint');
  assert.equal(value('loadProgress().totalAnswered'), 7);

  const invalid = '{\"app\":\"other-app\",\"version\":1,\"progress\":{}}';
  await value(`readProgressImport({ size: ${invalid.length}, text: () => Promise.resolve(${JSON.stringify(invalid)}) })`);
  assert.match(toast.textContent, /not a valid Wordtrail backup/);
  assert.equal(value('state.progress.totalAnswered'), 7, 'An invalid backup cannot overwrite progress');

  value("state.progress.uiLanguage = 'es'; state.onboardingStep = 'level'; state.onboardingLevel = state.progress.level; state.view = 'onboarding'; render()");
  assert.match(main.innerHTML, /¿Qué tan cómodo te sientes con el inglés\?/ , 'Interface language switches immediately');
  for (const [language, phrase] of [['fr', 'Quel est votre niveau de confort en anglais ?'], ['hi', 'आप अंग्रेज़ी में कितने सहज हैं?'], ['bn', 'ইংরেজিতে আপনি কতটা স্বচ্ছন্দ?']]) {
    value(`state.progress.uiLanguage = '${language}'; state.onboardingStep = 'level'; state.view = 'onboarding'; render()`);
    assert.ok(main.innerHTML.includes(phrase), `Level self-assessment renders in ${language}`);
  }
  for (const [language, phrase] of [['es', '¿Qué idioma prefieres usar?'], ['fr', 'Quelle langue souhaitez-vous utiliser ?'], ['hi', 'आप कौन-सी भाषा इस्तेमाल करना चाहेंगे?'], ['bn', 'আপনি কোন ভাষাটি ব্যবহার করতে চান?']]) {
    value(`state.progress.uiLanguage = '${language}'; state.onboardingLanguage = '${language}'; state.onboardingStep = 'language'; state.view = 'onboarding'; render()`);
    assert.ok(main.innerHTML.includes(phrase), `Support-language onboarding renders in ${language}`);
  }
  value("state.progress.uiLanguage = 'en'; state.onboardingLanguage = 'en'; state.onboardingStep = 'language'; render()");
  value("state.progress.uiLanguage = 'en'; state.progress.glossLanguage = 'bn'; state.progress.showGloss = true; render()");
  assert.match(value("renderGlossLine('curious')"), /কৌতূহলী/);
  assert.match(value("renderGlossLine('curious')"), /bn-BD/, 'Gloss pronunciation uses the target-language speech locale');
  speechVoices.push({ name: 'Device Mexican Spanish', lang: 'es-MX', default: false });
  value("speakWord('curioso', false, 'es-ES')");
  assert.equal(spoken.at(-1).voice.name, 'Device Mexican Spanish', 'Target-language speech falls back to another regional voice of the same language');
  assert.equal(spoken.at(-1).lang, 'es-MX');
  value("state.progress.theme = 'dark'; render()");
  assert.ok(bodyClasses.has('dark-theme'), 'Dark theme applies through the existing CSS variable system');
  value("state.progress.theme = 'light'; state.progress.savedIds = ['safe']; state.progress.reviewSchedule = {}; state.view = 'wordbook'; render()");
  click({ action: 'start-flashcards' });
  assert.equal(value('state.view'), 'flashcards');
  click({ action: 'flip-flashcard' });
  assert.match(main.innerHTML, /Hard/);
  const flashcardId = value('state.flashcardSession.ids[0]');
  const scheduleBeforeRating = Date.now();
  click({ action: 'rate-flashcard', data: { rating: 'medium' } });
  assert.equal(value(`state.progress.reviewSchedule['${flashcardId}'].stage`), 1);
  assert.equal(value(`state.progress.masteryLevels['${flashcardId}']`), 'Medium');
  assert.ok(value(`state.progress.reviewSchedule['${flashcardId}'].dueAt`) >= scheduleBeforeRating + 3 * 86_400_000);
  assert.equal(value('state.view'), 'flashcards');
  click({ action: 'toggle-sound' });
  assert.equal(value('state.progress.soundEnabled'), true, 'Answer chimes can be enabled and saved');
  click({ action: 'toggle-sound' });
  assert.equal(value('state.progress.soundEnabled'), false);

  storageBlocked = true;
  assert.doesNotThrow(() => value('loadProgress()'), 'Disabled storage is handled without a crash');
  assert.doesNotThrow(() => value('loadActiveSession()'), 'Disabled session storage is handled without a crash');
  assert.doesNotThrow(() => value('saveProgress()'), 'Storage quota failures are caught');
  assert.doesNotThrow(() => value('persistActiveSession()'), 'Session write failures are caught');
  storageBlocked = false;
  // Usage Studio draws five distinct intermediate expressions without repeating the last round.
const modularUsage = await import('../supabase-app/js/usage-data.js');
assert.equal(JSON.stringify(value('USAGE_ROUNDS')), JSON.stringify(modularUsage.USAGE_ROUNDS), 'Both builds produce exactly the same canonical practice tasks');
assert.equal(value('USAGE_CONCEPTS.length'), 125);
assert.equal(value('USAGE_ROUNDS.length'), 1000);
assert.equal(value('new Set(USAGE_ROUNDS.map(round => round.id)).size'), 1000);
assert.equal(value("USAGE_ROUNDS.every(round => round.options.length === 4 && new Set(round.options).size === 4 && round.options.includes(round.answer))"), true);
click({ action: 'start-mini', data: { game: 'usage' } });
assert.equal(value('state.miniSession.rounds.length'), 5);
const usageConcepts = value('state.miniSession.rounds.map(round => round.conceptId)');
assert.equal(new Set(usageConcepts).size, 5);
assert.match(main.innerHTML, /Usage Studio/);
assert.equal(value('loadActiveSession().miniSession.rounds.map(round => round.id).join()'), value('state.miniSession.rounds.map(round => round.id).join()'), 'New tasks recover from canonical IDs');
click({ action: 'start-mini', data: { game: 'usage' } });
assert.equal(value('state.miniSession.rounds.every(round => !' + JSON.stringify(usageConcepts) + '.includes(round.conceptId))'), true, 'Consecutive rounds avoid the same expressions');
for (let i = 0; i < 5; i += 1) { clickMiniAnswer(value('currentMiniRound().answer')); nextMini(); }
assert.equal(value('state.progress.gameRuns.usage'), 1);
assert.equal(value('state.progress.gameStats.usage.answered'), 5);
resetUsage: {
  value('resetPracticeHistory()');
  const visited = new Set();
  for (let session = 0; session < 200; session += 1) {
    value("startMiniGame('usage')");
    for (const id of value('state.miniSession.rounds.map(round => round.id)')) {
      assert.equal(visited.has(id), false, `Usage card ${id} repeated before the full bank was seen`);
      visited.add(id);
    }
  }
  assert.equal(visited.size, 1000, 'All thousand cards appear exactly once per full rotation');
  assert.equal(JSON.parse(store.get(value('practiceHistoryKey()'))).usage.length, 1000, 'Full rotation persists for this browser profile');
  value("startMiniGame('usage')");
  assert.equal(value('state.miniSession.rounds.length'), 5, 'After exhausting the pool, new rounds remain available');
}

console.log('Wordtrail smoke tests passed: randomized choices, CSP/sanitizer guards, secure storage validation, onboarding, all practice modes, speech fallbacks, backup/restore, and reload recovery.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
