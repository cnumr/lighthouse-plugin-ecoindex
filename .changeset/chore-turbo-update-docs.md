---
'lighthouse-plugin-ecoindex': patch
'lighthouse-plugin-ecoindex-core': patch
---

- Upgrade pnpm to 10.34.1 and add `minimumReleaseAge: 20160` (2 weeks) in `pnpm-workspace.yaml` to protect against supply chain attacks
- Update turbo to ≥2.9.14 to fix two security advisories (#234 low, #235 medium: CSRF and unexpected local code execution)
- Rename 7 audits from `rweb-*` to `bp-*` (no RWEB fiche mapping): `bp-css-containment`, `bp-no-document-write`, `bp-no-hidden-images`, `bp-no-http-errors`, `bp-no-js-errors`, `bp-no-plugins`, `bp-no-unused-code`
- Add `docs/bonnes-pratiques/04-bp.md` listing all 10 `bp/` audits without a RWEB reference (`unoptimized-images`, `badly-sized-images`, `bp-thegreenwebfoundation` included)
- Remove stale `has-cat-images` demo audit and its locale entries
- Fix `libs/ecoindex-lh-plugin-ts/README.md`: update RWEB audit table from 18 to 29 entries, add missing 12 audits, fix `rweb-css-containment` → `bp-css-containment`, add BP audits section
- Update RGESN reference URL in `docs/bonnes-pratiques/02-rgesn.md`
