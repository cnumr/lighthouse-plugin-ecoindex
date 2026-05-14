---
"@cnumr/ecoindex-lh-plugin-ts": patch
---

fix(i18n): fix French locale registration and fr.json format

Two fixes applied:
- `registerLocaleData` now spreads `lhLocales['fr']` before adding plugin strings, preserving Lighthouse core French translations
- Fixed 11 doubly-wrapped `{ message: { message: "..." } }` entries in `fr.json` (plugin.js group/category strings) that caused `message.replace is not a function` at runtime
