---
name: design-fusion
description: Redesign a landing page by fanning one brief out to several models (Fable, Opus, Codex, opencode), merging their specs, rendering image mockups through 9router, and building clickable HTML mocks so the user picks a direction before any production code changes. Use when asked to "improve the landing page design", "show me mocks", or to get a multi-model design opinion.
---

# design-fusion

Several models' opinions turned into clickable mocks before anything ships. The themes in `themes/` came from this loop.

## Steps

1. **Brief once and reuse it.** Point every model at the real page file, and keep the constraints identical for all of them:
   - theme (light or dark) and mood
   - no external fonts or scripts (assume a strict CSP)
   - the gzip budget
   - every element id and JS hook stays
   - AA contrast and `prefers-reduced-motion`
   - SEO content blocks stay
   - read-only, and the output is a spec of 400 words or less: hex tokens, a type scale, the hero, the main card, results, 2-3 micro-interactions, and what to cut.
2. **Fan out in parallel, in the background:**
   - a Fable subagent
   - an Opus designer subagent
   - `codex:codex-rescue` with the default model
   - `opencode run "<brief>"`, if installed
3. **Merge.** Keep what two or more specs agree on, and pick one accent that matches the existing logo. Write the result to `specs/<name>.md`. Every number in the copy must be true for the engine that serves the page.
4. **Image mockup (optional):** `POST 127.0.0.1:20128/v1/images/generations` with `ag/gemini-3.1-flash-image`.
   - `cx/gpt-image-*` returned 400 on ChatGPT accounts in Oct 2026.
   - Image text is filler, so say so when you show it.
5. **HTML mocks for the choice.** Write one shared body and a few CSS skins (see `tools/build-mocks.mjs`), then send all of them to the user. Ask with AskUserQuestion, with the recommended option first.
6. **Hand off.** The implementer copies tokens from the chosen mock into the real page, keeping the ids. Gates:
   - contrast
   - bundle budget
   - the page's own SEO/AEO/GEO score
   - tests
   - before/after screenshots

## Rules

- Mocks are for choosing. Never ship a mock file as the real page.
- Don't block on the slowest model. Merge once 3 specs are in.
- Keep the specs for the options that weren't picked. They become future themes.
