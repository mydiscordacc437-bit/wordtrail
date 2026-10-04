# Practice design notes

Wordtrail is a low-pressure vocabulary app, not an exam engine. These are product decisions, not claims that one schedule or game has been proved optimal for every learner.

## Evidence and design choices

- Retrieval and distributed practice have broad support; keep short answer/typed recall alongside recognition, and schedule due words instead of only offering new questions. Dunlosky et al. (2013) review: https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html
- Classroom findings depend on context and control condition; provide corrective feedback after each answer, not just a score at the end. Agarwal, Nunes & Blunt (2019): https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2019.00005/full
- The existing 1/3/7/14/30-day intervals are product defaults, not a personalized retention prediction. No forced daily drills, countdowns, or penalties for missed days.
- WCAG 2.2 status messages: give concise answer feedback without shifting focus, and move focus to the page heading on navigation. W3C: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- WCAG 2.2 target size: make frequently tapped practice controls comfortably large, including Academy filters. W3C: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

## Current algorithm

- Each practice type has local, bounded, validated recent-ID history. Eligible unseen items are selected first; random ties avoid a fixed sequence. Once the pool is exhausted, items are reused. Beginner/unsure excludes stretch items; advanced has a higher chance of stretch items when equally fresh.
- Usage Studio has **1,000 distinct practice tasks**, generated deterministically from **125 authored intermediate-use expressions**. Each concept has one original situation, four communicative framings, and two answer directions (choose the expression or interpret it). They are 1,000 tasks, **not 1,000 separate situations or vocabulary concepts**. Every task has a stable ID, canonical answer, four distinct options, and contrastive feedback; the standalone and modular builds share identical curated rows. Five-turn sessions avoid repeating a concept within a round and prefer unused tasks. A full 200-session rotation exercises all 1,000 task IDs before an ID is reused. This is recognition practice, not a substitute for writing or speaking freely.
- Usage Studio's rotation is stored on the learner's browser/account key. Existing Wordbook progress and review intervals are unchanged; Usage Studio answers count towards game statistics, but do not create Wordbook entries for whole phrases.
- The sampler draws four distinct skills from context, near-synonyms, opposites, phrases, listening, stories, and typed recall. If a word is due, one turn is reserved for typing it from memory. The remaining skills and their order vary, with duplicate target words avoided where possible. A correct or missed answer feeds the existing review schedule.
- On the practice page, an optional suggestion points to the lowest-accuracy skill only after at least three attempts and at least one miss. It never restricts the other games or presents an unearned percentage as a diagnosis.
- The local rotation key is scoped to the progress key (guest or signed-in browser account). It is separate from saved progress, does not sync across devices, and is not included in backups; restoring a backup resets this local history. This avoids changing the existing progress schema; it does not guarantee cross-device non-repetition.
- A completed round marks the local calendar day once. The visible streak is zero when neither today nor yesterday was practiced, but all words and practice history remain. No reminders or automatic streak restoration are added.

## Deliberately not added

- No streak freezes, XP, push notifications, leaderboards, pressure messages, or claim of a scientifically optimal interval. The user may return at their own pace.
- No external TTS/network calls or client-side secrets in the standalone build.

## Follow-up checks

- Real browser checks at narrow mobile and desktop sizes, including screen reader announcements and asynchronous speech availability.
- Learner/teacher review of Academy Class 8 and feedback on answer clarity; content remains labelled original practice, not official exam content.
- Measure repetition, return rates, and learner understanding with consent before changing the interval schedule. Test with small pools, invalid storage, same-day play, midnight rollover, and reload checkpoints.
