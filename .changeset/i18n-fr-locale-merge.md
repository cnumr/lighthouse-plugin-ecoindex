---
"@cnumr/ecoindex-lh-plugin-ts": patch
---

fix(i18n): merge plugin fr locale with Lighthouse built-in fr strings

`registerLocaleData` replaces the entire locale object. Plugin now spreads
`lhLocales['fr']` before adding its own strings, preserving Lighthouse core
French translations while adding plugin-specific ones.
