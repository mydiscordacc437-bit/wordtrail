const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', 'supabase-app');
const required = ['index.html', 'style.css', 'js/config.js', 'js/auth.js', 'js/api.js', 'js/academy-data.js', 'js/app.js', 'schema.sql'];
for (const file of required) assert.ok(fs.existsSync(path.join(root, file)), `Missing Supabase deliverable: ${file}`);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const config = fs.readFileSync(path.join(root, 'js/config.js'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'js/auth.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'js/api.js'), 'utf8');
const academyData = fs.readFileSync(path.join(root, 'js/academy-data.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const schema = fs.readFileSync(path.join(root, 'schema.sql'), 'utf8');

assert.match(html, /Content-Security-Policy/);
assert.match(html, /script-src 'self' https:\/\/cdn\.jsdelivr\.net/);
assert.match(html, /<script type="module" src="\.\/js\/app\.js"><\/script>/);
const desktopNav = html.match(/<nav class="nav-list"[\s\S]*?<\/nav>/i)?.[0] || '';
const mobileNav = html.match(/<nav class="mobile-nav"[\s\S]*?<\/nav>/i)?.[0] || '';
assert.match(desktopNav, /data-view="academy"/);
assert.match(mobileNav, /data-view="academy"/);
assert.match(desktopNav, /data-view="wordbook"/);
assert.doesNotMatch(mobileNav, /data-view="wordbook"/);
assert.match(css, /\.academy-page/);
assert.match(app, /import \{ ACADEMY_CONTENT \} from '\.\/academy-data\.js'/);
assert.match(academyData, /export const ACADEMY_CONTENT/);
assert.match(academyData, /ACADEMY_SSC_TESTS_CLASS10/);
assert.match(academyData, /c910-letter-study-tour/);
assert.doesNotMatch(html, /<script\s*>/i, 'Modular application logic is external, not inline');
assert.match(html, /id="auth-signin"/);
assert.match(html, /id="auth-signup"/);
assert.match(html, /id="sync-guest"/);
assert.match(html, /id="auth-sync-now"/);
assert.doesNotMatch(html, /<main[^>]*aria-live=/i, 'The whole main view is not re-announced at every state update');
assert.match(app, /role="status" aria-live="polite" aria-atomic="true"/);
assert.match(app, /restoreFocusAfterRender/);
assert.match(app, /focusMainHeading/);
for (const selector of ['.question-card h1', '.question-instruction', '.sentence-box', '.blank-slot', '.option-button', '.feedback-card']) {
  assert.ok(css.includes(`body.dark-theme ${selector}`), `Dark theme explicitly styles ${selector}`);
}
assert.match(css, /--text-secondary:\s*#c3cec5/);
assert.match(css, /--surface-card:\s*#1b2a22/);
assert.match(css, /\.language-choice-grid/);
assert.match(css, /body\.dark-theme \.language-option\.is-selected/);

assert.match(config, /YOUR_PROJECT_REF/);
assert.match(config, /YOUR_SUPABASE_ANON_KEY/);
assert.match(config, /@supabase\/supabase-js/);
assert.match(config, /persistSession:\s*true/);
assert.doesNotMatch(`${config}\n${auth}\n${api}`, /service[_ -]?role\s*[:=]\s*['"][^'"]+['"]/i, 'No service-role secret is embedded');
assert.match(auth, /signInWithPassword/);
assert.match(auth, /signUp/);
assert.match(auth, /onAuthStateChange/);
assert.match(auth, /signOut/);
assert.match(api, /fetchUserSnapshot/);
assert.match(api, /syncGuestSnapshot/);
assert.match(api, /syncWordbook/);
assert.match(api, /saveQuizResult/);
assert.match(api, /user_wordbook/);
assert.match(api, /mastery_level/);
assert.match(api, /notes:/);

assert.match(app, /localStorage/);
assert.match(app, /queueCloudProgressSync/);
assert.match(app, /practiceHistoryKey\(\) \{ return `\$\{progressStorageKey\(\)\}:practice-history-v1`/);
assert.match(app, /rotatePractice\(suitable/);
assert.match(app, /sampler-skills/);
assert.match(app, /queueCloudQuizResult/);
assert.match(app, /word-note-form/);
assert.match(app, /sanitizeUserText\(field\.value \|\| '', 500\)/);
assert.match(app, /syncGuestSnapshot/);
assert.match(app, /guestSyncMarkerKey/);
assert.match(app, /function renderOnboardingProgress/);
assert.match(app, /select-onboarding-language/);
assert.match(app, /select-onboarding-level/);
assert.match(app, /complete-onboarding/);
assert.match(app, /onboardingShowGloss/);
assert.match(app, /SAFE_HTML_TAGS.*details.*textarea/);
assert.match(app, /const gradeNumber = 8;/);
assert.match(app, /academy-view-answer/);
assert.match(app, /nctb\\\.gov\\\.bd/);
assert.match(app, /academyWritingFilter/);

for (const table of ['profiles', 'user_wordbook', 'quiz_results']) {
  assert.match(schema, new RegExp(`create table if not exists public\\.${table}\\b`, 'i'));
  assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
}
assert.match(schema, /auth\.uid\(\)\s*=\s*user_id/);
assert.match(schema, /auth\.uid\(\)\s*=\s*id/);
assert.match(schema, /unique \(user_id, idempotency_key\)/i);
assert.match(schema, /char_length\(notes\) <= 500/i);
assert.match(schema, /english_level text/);
assert.match(schema, /ui_language text/);
assert.match(schema, /gloss_language text/);
assert.match(schema, /gloss_language in \('en', 'es', 'hi', 'bn', 'fr'\)/);
assert.match(api, /gloss_language: \['en', 'es', 'hi', 'bn', 'fr'\]/);
assert.match(schema, /show_gloss boolean/);
assert.match(api, /english_level,ui_language,gloss_language,show_gloss/);

console.log('Supabase smoke checks passed: modular files, external CSP-compatible modules, email auth, guest sync hooks, wordbook notes/mastery, quiz persistence, and RLS schema.');
