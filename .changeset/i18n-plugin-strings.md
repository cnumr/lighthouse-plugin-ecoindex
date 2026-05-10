---
"lighthouse-plugin-ecoindex": minor
---

feat(i18n): migrate all audit UIStrings to Lighthouse native i18n

All 42 bp audits and core audits now use `createIcuMessageFn` + `str_()` for title, failureTitle, and description. English strings are registered in `en.json`; French translations are in `fr.json`. The plugin reads the locale passed by Lighthouse (set via `--lang` CLI flag) and resolves strings accordingly.
