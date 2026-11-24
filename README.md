# design-fusion

Three light landing-page themes and the multi-model workflow that produced them. Each theme is a single self-contained HTML file: no fonts, no scripts, no CDN.

| Theme | File | Spec | Feel |
|---|---|---|---|
| Fusion | `themes/fusion.html` | `specs/fusion.md` | violet with an amber marker, hard black shadows, stamp grade |
| Lab bench | `themes/lab-bench.html` | `specs/lab-bench.md` | graph paper, signal green, monospace data |
| Launch console | `themes/launch-console.html` | `specs/launch-console.md` | soft shadows, centred, Stripe-like |

Open any file in a browser. Rebuild the themes after editing the generator:

```bash
bun tools/build-mocks.mjs
```

Check the themes for valid HTML, console errors and axe (WCAG 2 A/AA) violations:

```bash
npm install
npx playwright install chromium
npm test
```

`skills/design-fusion/SKILL.md` is a Claude Code skill: brief several models, merge their specs, render mockups and let a person pick. To install it:

```bash
ln -s "$PWD/skills/design-fusion" ~/.claude/skills/design-fusion
```

The themes were first made for [findable](https://github.com/nadimtuhin/findable). Fusion is the one that shipped there.

MIT licensed.
