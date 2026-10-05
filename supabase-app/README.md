# Wordtrail: modular Supabase app

This directory contains the separate cloud-enabled version of Wordtrail. It shares the vocabulary game and interface with the single-file app at the workspace root, but keeps the markup, styling, browser logic, Supabase auth/API, and database schema in separate files.

## Files

- `index.html` — static app shell and account dialog
- `style.css` — responsive styling, themes, accessibility and interaction states
- `js/config.js` — Supabase URL/public-key placeholders and CDN client setup
- `js/auth.js` — email/password sign-up, sign-in, session restore, auth events and sign-out
- `js/api.js` — profile, streak, quiz-result, and wordbook read/write/sync functions
- `js/app.js` — vocabulary app, local guest mode, user-data validation, and cloud integration
- `schema.sql` — tables, sign-up profile trigger, indexes and row-level security policies

## Setup

1. Create a Supabase project and enable **Email** under Authentication → Providers.
2. Run `schema.sql` in the project’s SQL Editor. The app expects its `profiles`, `user_wordbook`, and `quiz_results` tables and RLS policies.
3. Open `js/config.js` and replace `YOUR_PROJECT_REF` and `YOUR_SUPABASE_ANON_KEY` with the project URL and the browser-safe **anon/public** key from the project’s API settings. The SDK is loaded from jsDelivr as `@supabase/supabase-js` v2.
4. Never put a `service_role` key in this client app. The public key is only appropriate because all user tables enforce RLS; keep the policies enabled.
5. Serve the workspace over HTTP (ES modules do not work reliably from `file://`):

   ```sh
   cd /path/to/workspace
   python3 -m http.server 4173
   ```

   Open `http://localhost:4173/supabase-app/`. The single-file version remains at `http://localhost:4173/`.

For email confirmation, configure the project’s email templates and allowed redirect URLs in Supabase. If confirmation is enabled, the user can sign in after confirming; an in-app **Sync guest data** action remains available so local progress can be migrated later.

## Data behavior

- Guest play works without a Supabase project and keeps validated progress in browser storage.
- Sign-up/sign-in uses Supabase Auth. The user can choose whether to sync this browser’s guest profile/streak, scores, saved words, mastery levels, and notes. Sync is marked per account and can also be started from the account dialog.
- Authenticated progress is cached locally and synchronized asynchronously. Cloud reads and writes are scoped by the signed-in user and enforced again by RLS.
- Quiz completions are saved in `quiz_results`; the guest import uses a fixed idempotency key so it is not imported repeatedly.
- Saved wordbook entries store a mastery level, bounded personal note (up to 500 characters), and save timestamp. The spaced-review schedule itself remains in that browser’s validated progress cache.
- If the SDK/CDN or Supabase is unavailable, the app falls back to guest/local mode and does not discard local progress.

## Security notes

Dynamic app markup passes through an allowlist sanitizer; user-authored notes and profile text are length-limited and rendered as text. Keyboard focus moves to the current view heading after navigation, answer results use compact live announcements, and reduced-motion settings are respected. The page uses a restrictive CSP and the database schema enables RLS for all user data. Browser-side validation is defense-in-depth, not an authorization boundary: RLS is the security boundary. Never disable RLS or use a service-role secret in the browser.
