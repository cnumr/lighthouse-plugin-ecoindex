---
"@cnumr/ecoindex-lh-plugin-ts": minor
---

i18n: migrate all bp audit runtime strings to Lighthouse native i18n system

All hardcoded `displayValue`, `displayValuePass`, `displayValueFail`, and table column `label` strings in every bp audit file are now wrapped with `createIcuMessageFn` / `str_()`. English and French translations added to `en.json` and `fr.json`.
