---
'lighthouse-plugin-ecoindex-core': patch
---

Remove misleading RWEB fiche references from 5 audits (Phase 1 corrections):

- `rweb-combine-assets`: scoring threshold corrected to ≤2 files to match RWEB_0078
- `rweb-css-containment`: no longer claims RWEB_0039 (manual-check audit)
- `rweb-no-document-write`: no longer claims RWEB_0044 (different DOM API check)
- `rweb-no-unused-code`: no longer claims RWEB_0046 (render-blocking check, not static linting)
- `rweb-no-js-errors`: no longer claims RWEB_0043 (runtime errors, not static linting)

Fix `rweb-print-css` silently skipped in Lighthouse 13 due to stale `requiredArtifacts` (`DOMStats`, `devtoolsLogs`).
