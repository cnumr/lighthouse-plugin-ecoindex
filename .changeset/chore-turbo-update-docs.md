---
'lighthouse-plugin-ecoindex': patch
'lighthouse-plugin-ecoindex-core': patch
---

- Upgrade pnpm to 10.34.1 and add `minimumReleaseAge: 20160` (2 weeks) in `pnpm-workspace.yaml` to protect against supply chain attacks
- Upgrade puppeteer to 25.1.0, puppeteer-core to 25.1.0, @puppeteer/browsers to 3.0.4, lighthouse to 13.3.0
- Update turbo to ≥2.9.14 to fix two security advisories (#234 low, #235 medium: CSRF and unexpected local code execution)
- Rename 8 audits from `rweb-*` to `bp-*` (no RWEB fiche mapping): `bp-cookie-size`, `bp-css-containment`, `bp-no-document-write`, `bp-no-hidden-images`, `bp-no-http-errors`, `bp-no-js-errors`, `bp-no-plugins`, `bp-no-unused-code`
- Add `docs/bonnes-pratiques/04-bp.md` listing all 11 `bp/` audits without a RWEB reference (`unoptimized-images`, `badly-sized-images`, `bp-thegreenwebfoundation` included)
- Remove stale `has-cat-images` demo audit and its locale entries
- Fix `libs/ecoindex-lh-plugin-ts/README.md`: update RWEB audit table from 18 to 28 entries, BP audits section updated to 11 entries
- Update RGESN reference URL in `docs/bonnes-pratiques/02-rgesn.md`
- Restrict Retype doc publication to push on `main` only (remove `workflow_dispatch` trigger)
