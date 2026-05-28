---
'lighthouse-plugin-ecoindex': patch
'lighthouse-plugin-ecoindex-core': patch
---

Update turbo to ≥2.9.14 to fix two security advisories (#234 low, #235 medium: CSRF and unexpected local code execution).

Rename 7 audits from `rweb-*` to `bp-*` (no RWEB fiche mapping): `bp-css-containment`, `bp-no-document-write`, `bp-no-hidden-images`, `bp-no-http-errors`, `bp-no-js-errors`, `bp-no-plugins`, `bp-no-unused-code`. Add `docs/bonnes-pratiques/04-bp.md` listing these audits.
