# Wordtrail: project handoff

Continue an existing project. The full workspace zip is uploaded. Unzip it, read `README.md`, `ACADEMY_PLAN.md` and `supabase-app/README.md`, then read this file. Do not rewrite things that already work.

## 1. What it is
Wordtrail is an English vocabulary practice web app. It ships as two builds that must stay in sync:

| Build | Location | Notes |
|---|---|---|
| Standalone | `index.html` (about 490 KB) | One file, zero dependencies, no network calls, progress in localStorage |
| Cloud | `supabase-app/` | Modular ES modules, Supabase email/password auth, guest-data sync, RLS |

Serve with `python3 -m http.server 4173`. Standalone is at `/`, cloud build at `/supabase-app/`. ES modules don't work from `file://`.

## 2. File map
```
index.html                 standalone app (inline CSS/JS, embeds Academy data)
academy-renderers.snippet  Academy render code + ACADEMY_UI_TRANSLATIONS (es/hi/bn/fr)
academy-style.snippet      Academy CSS
ACADEMY_PLAN.md            Academy plan, sources, status
supabase-app/
  index.html, style.css
  js/app.js (2358 lines)   whole app inside one strict IIFE: wordtrailApp()
  js/academy-data.js       exports ACADEMY_CONTENT
  js/api.js                fetchUserSnapshot, upsertProfile, syncWordbook,
                           syncUserSnapshot, saveQuizResult, syncGuestSnapshot
  js/auth.js               sign in / sign up / sign out / session restore
  js/config.js             Supabase URL + anon key PLACEHOLDERS
  schema.sql               profiles, user_wordbook, quiz_results + RLS
tests/                     academy-data-smoke.mjs, smoke.cjs, supabase-smoke.cjs
```

## 3. Features (both builds)
- Onboarding self-assessment (beginner/intermediate/advanced/unsure), starter round
- 5 context worlds (campus, market, workplace, home, travel), 50 scene cards
- Mini-games: Synonym Switch, Opposite Snap, Phrase Finder, Listen & Match, Story Clues, Recall & Type, mixed sampler; Tone Shift; 9 decision-based stories
- Spaced review (1/3/7/14/30-day steps), flashcards (Easy/Medium/Hard = 7/3/1 days), Nuance Lab, searchable wordbook
- Speech synthesis in US/UK/AU/IN/CA/IE locales, with accessible fallback
- UI translations: Spanish, Hindi, Bangla, French; native-language glosses
- Light/dark theme, optional chimes, keyboard shortcuts (1-4), reduced motion
- JSON progress backup and validated restore
- Security: allowlist HTML sanitizer, restrictive CSP, schema-validated storage reads, no external assets in the standalone build

Main render functions in `app.js`: renderHome, renderGames, renderExplore, renderNuance, renderWordbook, renderFlashcards, renderChallenge, renderMiniGame, renderSummary, renderTone, plus the Academy ones below.

## 4. NCTB Academy (latest feature, first release done)
- Scope: general Bangla-medium Classes 6-10. English-medium is a later expansion.
- Academy is the mobile bottom-nav tab in place of Saved Words. "My Wordbook" is reachable inside Academy and the desktop shortcut remains. Saved-word data is untouched.
- Per class: Curriculum map, Practice tests, Writing bank.
- Code: `renderAcademyClassPicker`, `renderAcademyClassHome`, `renderAcademySyllabus`, `renderAcademyTests`, `renderAcademyWriting`, `renderAcademy`.
- Data shape (`ACADEMY_CONTENT`): `{ year: 2026, track, sourceNote, sources{6..10, ssc2026}, grades{6..10}, writing[] }`
  - each grade: `books, units, grammar, writingFormats, tests`
  - each writing item: `{ id, grade, type, title, unit, prompt, modelAnswer, banglaNote }`
- Current content: 60 writing items. Units per class: 6, 9, 11, 16, 16 (Classes 6 to 10). Tests per class: 2, 2, 2, 3, 3.
- Writing items by class: Class 6 has 13; Class 7 has 13; Class 8 has 12; Class 9 has 13; Class 10 has 9.
- Editorial rules: all tests and answers are original, labelled practice, not official papers. Classes 6-8 claim no national exam pattern. Classes 9-10 show the official SSC 2026 English Paper 2 structure (Grammar 60; Writing 40 = paragraph 10, email/letter/application 10, composition 20). Model answers in English with concise Bangla guidance. Dynamic links restricted to specific `nctb.gov.bd` HTTPS paths.

## 5. Storage and cloud
- localStorage keys: `wordtrail-progress-v1`, `wordtrail-active-session-v1`; per-user variants when signed in; a per-user guest-sync marker.
- Supabase: profiles (username, streak, level, ui/gloss language), user_wordbook (mastery, notes up to 500 chars), quiz_results (idempotency key). RLS on all tables. Sign-up trigger creates the profile.
- `config.js` still has placeholders (`YOUR_PROJECT_REF`, `YOUR_SUPABASE_ANON_KEY`). Cloud mode is not live until these are filled with the anon/public key. The app falls back to guest mode when unconfigured.

## 6. Status
- Done: all features above in both builds. Verified in this handoff: Node v22, all three smoke tests pass.
- Not done:
  1. No real-browser check at desktop and mobile widths (no Playwright or browser was available). Tests use a mock DOM.
  2. Per-class content review for textbook fit, natural English, Bangla guidance.
  3. Content coverage is uneven: Class 10 has only 1 paragraph and 1 dialogue; Classes 6-8 have no application type.
  4. Do not call the content exhaustive until 1 and 2 are done.

## 7. Rules for the new agent
1. Keep both builds in sync. Change `academy-data.js` and the embedded copy in `index.html` together.
2. Do not change the saved-word or progress schema without a migration and validation.
3. Never put a `service_role` key in client code. Keep RLS on.
4. Keep the sanitizer, CSP, and accessibility behavior (focus to heading on navigation, concise live announcements).
5. After every change run:
   ```
   node tests/academy-data-smoke.mjs
   node tests/smoke.cjs
   node tests/supabase-smoke.cjs
   ```
6. Don't invent NCTB facts. Verify against the official sources listed in `ACADEMY_PLAN.md`.

## 8. Subsequent work
- Academy currently displays only Class 8; content for Classes 6, 7, 9 and 10 remains available in the code for a future release.
- Practice uses bounded per-browser/account question rotation. The opening path is now level-specific and ordered: four starter questions, then three guided lessons, with a missed/due word revisited before advancing. Once the guided path is done, scene rounds rotate by setting and rise in difficulty. Usage Studio and Conversation Lab now provide 2,000 stable tasks from 125 authored everyday expressions: the second bank uses four ordered stages per concept (recognise, interpret, edit, type), with two variants each. Their local stage cache is separate from the Wordbook schema. See `PRACTICE_DESIGN.md` for the scope and limitations (the eight tasks per concept reuse one authored situation).
- Run `node tests/usage-data-smoke.mjs` alongside the three existing smoke checks after changing the practice bank. Keep the standalone embedded rows and `supabase-app/js/usage-data.js` in sync.
- Browser, accessibility and editorial reviews are still needed; cloud authentication remains unconfigured without the user's Supabase public project configuration.

Vocabulary shelf: `supabase-app/js/essential-words.js` is the modular editorial list (1,302 unique entries, 20 topics); its equivalent is embedded inside `index.html` for the offline build. Navigation, home CTA, searchable/topic-filtered paginated view, and pronunciation buttons are in both builds. Speech uses browser synthesis with Google-named matching-accent preference, not Google Cloud TTS; availability depends on device. Typed recall only exposes answer pronunciation after checking. Keep both builds synchronized when editing the shelf.
