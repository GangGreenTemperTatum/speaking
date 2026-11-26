---
name: portfolio-add-content
description: Add or update a talk, podcast, publication, television, volunteering, or CVE entry in the portfolio and keep the generated site and tests in sync.
user-invocable: true
argument-hint: "[content type] [name or id]"
---

# Add Portfolio Content

The single source of truth is `docs/js/content-data.js`. Everything else is generated or asserted from it. Edit the data, regenerate, and prove the build with tests — never hand-edit `docs/data/content.json`.

## Data model

`docs/js/content-data.js` defines these arrays and exports them twice (CommonJS `module.exports` for the build and tests, `window.ContentData` for the browser):

- `conferences`, `podcasts`, `publications`, `volunteering`, `television` — entry arrays.
- `cves` — CVE records rendered on `docs/cves.html`.
- `zones`, `achievements` — homepage composition.

`build.js` requires this file, walks `docs/` for the referenced files, and writes `docs/data/content.json` (and `content-fixed.json`). The browser reads the generated JSON.

## Steps

1. **Edit `docs/js/content-data.js`.** Add one object to the right array, matching the shape of its neighbours. Give every entry a unique `id`. Keep the per-type required fields the tests enforce:
   - conference: `id`, `name`, `year`, `type: 'conference'`, `description`.
   - podcast and other types: mirror an existing sibling entry's fields exactly.
   - CVE: `cveId`, `year`, full `cvss` object (`score`, `severity`, `vector`, metrics), `references`, and researcher context labelled separately from registry facts.
2. **Add any files** (slides, PDFs, images) under the documented `docs/<type>/...` path and reference them by relative path.
3. **Regenerate:** `npm run build`. Stage the resulting `docs/data/content.json` change with your data change — the two must land together.
4. **Verify:** `npm test`. Count assertions are ranges (for example conferences must stay above 30 and below 55); if an addition crosses a boundary, widen the range in `__tests__/content-data.test.js` deliberately, do not loosen it to pass. CVE and required-field tests check exact schema.
5. For a homepage-visible item, set the entry's `featured`/zone fields the way existing featured entries set them, and confirm it renders in the real browser.

## Rules

- One entry per change; do not refactor unrelated data.
- Fetch authoritative CVE data from `https://cveawg.mitre.org/api/cve/<CVE-ID>` before filling a CVE record; never invent scores or vectors.
- Escape nothing by hand — the renderer handles output; your job is correct, well-typed data.
- A change is done only when `npm run build` is committed and `npm test` passes.
