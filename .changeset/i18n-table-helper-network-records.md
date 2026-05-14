---
"lighthouse-plugin-ecoindex-core": minor
---

i18n: translate table-helper strings + add network resource table to requests/size audits

All hardcoded strings in `table-helper.ts` (column headers, row labels, threshold descriptions) are now wrapped with `createIcuMessageFn` / `str_()`. English and French translations added to `en.json` and `fr.json`.

The `requests` and `size` audits now display a second table listing each network resource (URL, domain, transfer size in KiB) sorted by size descending, combined with the existing info table via `Audit.makeListDetails`.
