# Wordtrail Academy — Plan and Implementation Record

**Status:** First-release implementation is complete in both app builds; smoke tests pass. Final responsive/browser review remains.  
**Research checked:** 2026-10-04  
**Release scope:** Classes 6–10, general Bangla-medium. English-medium is a later expansion.

## 1. Scope and editorial rules

- Learners choose a class, then browse its curriculum map, clearly labelled original practice tests, and writing bank.
- Model answers are in English with concise Bangla guidance. Answers are original examples for learning and adaptation, not copied guidebook solutions.
- Class 9–10 SSC material uses the published 2026 assessment structure. Classes 6–8 use textbook-mapped practice formats and do **not** claim one universal national term-exam pattern.
- Every Academy-generated test is labelled practice, not an official NCTB or board paper.
- The existing Saved Words data, notes, mastery, flashcards, and review schedule are preserved. On mobile, **Academy** replaces the Saved Words bottom tab; **My Wordbook** is available unobtrusively inside Academy. The desktop Wordbook shortcut remains.

## 2. Research and source inventory

### Official NCTB textbook listings

The Academy identifies the year and general Bangla-medium track, and links to the official 2026 NCTB book listings. Each grade lists *English for Today* and *English Grammar and Composition*:

- [Class 6, 2026](https://nctb.gov.bd/pages/static-pages/695b987ac4774958d7b7040b)
- [Class 7, 2026](https://nctb.gov.bd/pages/static-pages/695b9aeec4774958d7b70908)
- [Class 8, 2026](https://nctb.gov.bd/pages/static-pages/695b9858c4774958d7b703d8)
- [Classes 9–10, 2026](https://nctb.gov.bd/pages/static-pages/695b99afc4774958d7b70612)

Class 6’s 33 lessons are grouped into six study themes for navigation and revision; that theme grouping is a study map, not an official NCTB lesson-by-lesson syllabus statement. A secondary guide supplied the complete lesson-title reference when the official listing alone did not expose the contents. [Class 6 guide reference — secondary, not official](https://www.abswer.com/class-6-english-1st-paper-guide-book/)

### Official SSC 2026 assessment guidance

The [NCTB SSC 2026 revised assessment notice](https://nctb.gov.bd/pages/notices/6922e919dbfbab28ce0abfac) links to an official question-pattern PDF. The attachment was checked directly: [official NCTB question-pattern attachment](https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-nctb/2024/12/a86c5e8c48464604938faeb805500453.pdf).

Confirmed from that attachment:

- **English 1st Paper, Part B — Writing: 30 marks:** completing stories 15; writing dialogues 15.
- **English 2nd Paper, Part A — Grammar: 60 marks.**
- **English 2nd Paper, Part B — Writing: 40 marks:** Q10 paragraph 10; Q11 email/letter/application 10; Q12 short composition 20.

The Academy displays this SSC structure for Classes 9–10 and links to the notice. The exact mark breakdown is now confirmed from the official attachment rather than inferred from secondary summaries.

## 3. Implemented experience

1. The bottom mobile navigation has five entries, with **Academy** in place of Saved Words. Academy has a five-class picker for Classes 6–10.
2. Each class overview offers three focused sections: **Curriculum map**, **Practice tests**, and **Writing bank**.
3. Curriculum maps show textbook themes, language skills, and writing formats. Classes 6–8 have a note that school term plans vary and no single national exam blueprint is claimed.
4. Practice cards show reading/language tasks and writing prompts, with links to a same-class model answer wherever supplied. SSC writing sets show the confirmed paper structure and marks; practice sets are not official question papers.
5. The writing bank includes original class-appropriate paragraphs, dialogues, letters/emails, applications, story completions, and compositions as applicable, with concise Bangla guidance and filters by writing form.
6. **My Wordbook** is accessible from Academy without moving or altering saved-word data. The desktop sidebar still has its Wordbook shortcut.

## 4. Implementation and safety

- Both the standalone zero-dependency app (`/home/user/index.html`) and the modular Supabase app (`/home/user/supabase-app/`) include Academy.
- The modular curriculum and writing data live in `supabase-app/js/academy-data.js`; the standalone embeds the same data.
- Academy renderers use the existing escaped, allowlist-sanitized dynamic-render path. Dynamic links are restricted to the specific HTTPS `nctb.gov.bd` source paths.
- The Academy styles are theme-aware, responsive, keyboard/touch-accessible, and respect reduced-motion preferences.
- Class selection is session UI state; it does not write to or migrate the existing Wordbook progress schema.

## 5. Validation and remaining review

Automated checks run successfully:

- `node tests/academy-data-smoke.mjs` — modular data coverage, model forms, Bangla guidance, NCTB sources, and same-grade test-answer links.
- `node tests/smoke.cjs` — single-file app; navigation, five grade routes, model-answer links, saved-word preservation, SSC marks, NCTB-link sanitizer rules, localization, accessibility/security guards, and existing practice flows.
- `node tests/supabase-smoke.cjs` — modular files, CSP/module setup, navigation, data import, style, auth/cloud/offline/RLS requirements.
- `node --input-type=module --check < supabase-app/js/app.js` and the equivalent check for `academy-data.js`; the standalone inline script also parses with `vm.Script`.

Remaining before release: inspect both builds at desktop and narrow mobile widths in a real browser; spot-check every class’s map and representative answer for textbook fit, length, natural English, and Bangla guidance; continue expanding the bank based on learner/teacher review. No browser binary or Playwright/Puppeteer runner is installed in this workspace, so the running static preview serves the standalone build at `/` and the modular build at `/supabase-app/` for manual review. Do not claim the content is exhaustive until those checks are complete.
