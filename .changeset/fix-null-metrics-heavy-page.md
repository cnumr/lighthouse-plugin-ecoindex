---
"lighthouse-plugin-ecoindex-core": minor
"lighthouse-plugin-ecoindex-courses": minor
---

Add high-impact test page and fix null/undefined metric handling

- Add `/heavy` route (800+ DOM nodes) to cover pages with no external network requests
- Guard `TotalByteWeight.audit` with try-catch to prevent crash on pages with no network records
- Add `Number.isFinite` guards in `computeEcoindexResults` to safely handle null/undefined inputs
- Add `getExplanationForMetric` helper and populate `explanation` field in audit results
- Fix missing `return` on `createErrorResult` calls in audit classes
- Use optional chaining in `printSummary` to prevent `TypeError` when audit values are missing
- Fix `stopServer` to kill all processes bound to the port (not only the PID-tracked one)
