// Checks the generated themes: valid HTML, no console errors, no axe WCAG 2 A/AA violations.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { HtmlValidate, FileSystemConfigLoader } from "html-validate";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const themes = ["fusion", "lab-bench", "launch-console"];
const dir = new URL("../themes/", import.meta.url);
let failed = false;
const fail = (msg) => { failed = true; console.error(`FAIL ${msg}`); };

const validator = new HtmlValidate(new FileSystemConfigLoader());
for (const t of themes) {
  const path = new URL(`${t}.html`, dir).pathname;
  const report = await validator.validateFile(path);
  for (const r of report.results) for (const m of r.messages) fail(`${t}.html:${m.line}:${m.column} ${m.ruleId}: ${m.message}`);
}

const browser = await chromium.launch();
for (const t of themes) {
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(new URL(`${t}.html`, dir).href);
  for (const e of errors) fail(`${t}.html console error: ${e}`);
  await page.addScriptTag({ content: readFileSync(require.resolve("axe-core/axe.min.js"), "utf8") });
  const { violations } = await page.evaluate(() => axe.run({ runOnly: ["wcag2a", "wcag2aa", "best-practice"] }));
  for (const v of violations) fail(`${t}.html axe ${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  if (!errors.length && !violations.length) console.log(`ok ${t}.html`);
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
