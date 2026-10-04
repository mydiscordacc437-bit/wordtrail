# Wordtrail — English vocabulary practice

A self-contained, responsive single-file vocabulary game. Open `index.html` in a modern browser, or serve the project locally. A separate cloud-enabled modular build lives in [`supabase-app/`](supabase-app/README.md): it adds email/password auth, optional guest-data sync, and Supabase persistence.

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## What’s inside

- First-use self-assessment: beginner, intermediate, advanced, or not sure; the starting level can be changed later
- A short starter round matched to the learner’s chosen level and setting
- Five context worlds with **50 scene cards** (10 per setting)
- Clearly labeled practice goals: choosing from context, near-synonyms, opposites, common phrases, listening, and short stories
- **Synonym Switch**, **Opposite Snap**, **Phrase Finder**, **Listen & Match**, **Story Clues**, and **Recall & Type** (no answer choices), plus a four-turn mixed sampler
- Multiple-choice options are shuffled per round across scene lessons, mini-games, and Tone Shift; the chosen order is validated and retained when an active round resumes
- Typed recall accepts capitalization differences, offers an optional clue, and saves an unfinished answer draft across refreshes
- Nine short, decision-based stories using everyday situations rather than generic filler
- Common English first, with a small number of clearly labeled stretch words as the level rises
- On-demand speaker buttons, slower playback, and selectable US, UK, Australian, Indian, Canadian, and Irish English locales
- Browser/device speech synthesis discovers voices asynchronously, falls back to a generic English voice when needed, and disables speech controls accessibly when unsupported; a matching Google-named voice is preferred only when the device provides one. The standalone app is **not connected to Google Cloud Text-to-Speech** and does not include API credentials. Written examples use standard American English spelling; accent selection changes audio only.
- Optional instant interface translations in Spanish, Hindi, Bangla, and French, plus optional native-language glosses for the 50 English vocabulary entries and multilingual browser speech where supported
- Persistent light/dark theme and optional, muteable correct/incorrect answer chimes
- Context-aware definitions and near-synonym/opposite suggestions; related words are not treated as interchangeable
- Nuance Lab, a searchable wordbook, and a review queue for missed or saved words
- Due and missed words can be reviewed by typing from memory, with an optional clue; correct due answers get longer intervals and misses return sooner. Flashcards offer Easy/Medium/Hard ratings scheduled at 7/3/1 days as a practical default, not a personalized optimum.
- Tone Shift practice for choosing wording to fit the audience
- **NCTB Academy** for general Bangla-medium Classes 6–10: curriculum maps, clearly labelled original practice sets, and class-appropriate English writing models with concise Bangla guidance
- The official SSC 2026 English Paper 2 structure for Classes 9–10 (Grammar 60 + Writing 40; paragraph 10, email/letter/application 10, short composition 20); Classes 6–8 use textbook-mapped practice without a claimed national paper pattern
- Academy is the mobile bottom tab in place of Saved Words; **My Wordbook** remains available inside Academy, the desktop shortcut remains, and existing saved-word/review data are unchanged
- Accuracy, explored-word, review-schedule, completed-round, and weekly-practice tracking in browser local storage
- Downloadable JSON progress backups and a validated restore flow; no progress is sent to a server, and restoring replaces current browser progress only after you review the backup
- Active rounds resume after navigation or a page refresh (local-only checkpoint); finished rounds clear their checkpoint, and starting a new round replaces the current one
- No timers or reminders; a missed day never removes progress
- Keyboard answer shortcuts (`1`–`4`), a skip-to-content link, explicitly labeled navigation, reduced-motion support, responsive layouts, and mobile navigation; app view changes restore focus to a heading and only concise answer feedback is announced to screen readers
- Dynamic pages pass through a tag/attribute/style allowlist sanitizer before mounting, with a restrictive CSP; event handlers and unsafe URL attributes are discarded
- The app logic and deeply frozen curated vocabulary data are scoped inside a strict IIFE. This reduces global exposure but is not a security boundary; local browser storage is still user-controlled and is schema-validated on read
- The wordbook contains curated entries and saved IDs; there are no custom notes or free-form word entries to persist
- No external assets, libraries, or app network calls

## Design notes

- Recall & Type complements the multiple-choice activities rather than replacing them. In an L2 vocabulary experiment, recall formats better supported productive spelling knowledge, while recognition was more suitable when spelling production was not required (Nakata, 2016: [article](https://doi.org/10.1515/iral-2015-0022)). The app therefore offers both kinds of practice and gives feedback after an answer.
- A review of classroom retrieval-practice research found generally favorable results, while noting that outcomes vary by setting and format: [Agarwal, Nunes & Blunt (2019)](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2019.00005/full).
- Spaced review follows distributed-practice evidence and keeps the experience flexible: correct due answers extend the interval, misses return sooner, and no reminders or streak penalties are imposed. Its 1/3/7/14/30-day steps are a practical default, not an individualized optimum; a meta-analysis found that useful spacing depends on the desired retention interval ([Cepeda et al., 2006](https://doi.org/10.1037/0033-2909.132.3.354)).
- Progress uses browser `localStorage`, which is origin-specific and can be cleared by the user. The versioned, validated JSON backup flow supports a manual move to another browser or device (MDN: [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)).

## Smoke tests

With Node.js 18 or later:

```sh
node tests/academy-data-smoke.mjs
node tests/smoke.cjs
node tests/supabase-smoke.cjs
```

`tests/academy-data-smoke.mjs` checks all five grade data maps, required writing forms, Bangla guidance, official NCTB source links, and same-grade test-to-answer links. The root smoke test simulates Academy class/section navigation, saved-word preservation, SSC 2026 marks, NCTB-link sanitization, plus existing onboarding and practice flows. `tests/supabase-smoke.cjs` checks the modular app structure, auth and guest-sync integration points, RLS schema, and browser-safe key configuration. Sanitizer traversal is exercised with a small mock DOM; this is not a substitute for browser-driven testing of the native HTML parser. Sanitizer traversal is exercised with a small mock DOM; this is not a substitute for browser-driven testing of the native HTML parser.
