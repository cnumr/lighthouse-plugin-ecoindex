# lighthouse-plugin-ecoindex-core

## 7.4.0

### Patch Changes

- 35c6299: Update Puppeteer, Lighthouse, and Lighthouse CI dependencies.

## 7.3.4

### Patch Changes

- 6360f35: **lighthouse-plugin-ecoindex-core**
  - Renomme les fichiers d'audit `badly-sized-images`, `unoptimized-images` et `thegreenwebfoundation` avec le préfixe `bp-` pour cohérence avec les autres audits du dossier
  - Corrige les IDs correspondants (`bp-badly-sized-images`, `bp-unoptimized-images`) dans `plugin.ts`
  - Réorganise les audits `rweb-*` dans `plugin.ts` par ordre croissant de leur identifiant RWEB (RWEB_0009 → RWEB_0112)
  - Sépare clairement les sections `rweb-*` et `bp-*` dans `audits` et `auditRefs`

  **lighthouse-plugin-ecoindex-courses**
  - Supprime la dépendance `handlebars` (abandonnée, 8 CVE dont 1 critique) et la remplace par des fonctions TypeScript natives (`renderMarkdown`, `renderHtml`). Les fichiers `.md` et `.html` générés restent équivalents.
  - Synchronise `puppeteer-core` sur `25.1.0` (était `24.8.0` dans certains packages de test)
  - Corrige le conflit de types `puppeteer-core@25` / `puppeteer-core@24` (interne à lighthouse) dans `run.ts`

  **lighthouse-plugin-ecoindex**
  - Met à jour `lighthouse` de `13.0.1` → `13.3.0` (alignement avec les autres packages du monorepo)

## 7.3.3

### Patch Changes

- db1eede: - Upgrade pnpm to 10.34.1 and add `minimumReleaseAge: 20160` (2 weeks) in `pnpm-workspace.yaml` to protect against supply chain attacks
  - Upgrade puppeteer to 25.1.0, puppeteer-core to 25.1.0, @puppeteer/browsers to 3.0.4, lighthouse to 13.3.0
  - Update turbo to ≥2.9.14 to fix two security advisories (#234 low, #235 medium: CSRF and unexpected local code execution)
  - Rename 8 audits from `rweb-*` to `bp-*` (no RWEB fiche mapping): `bp-cookie-size`, `bp-css-containment`, `bp-no-document-write`, `bp-no-hidden-images`, `bp-no-http-errors`, `bp-no-js-errors`, `bp-no-plugins`, `bp-no-unused-code`
  - Add `docs/bonnes-pratiques/04-bp.md` listing all 11 `bp/` audits without a RWEB reference (`unoptimized-images`, `badly-sized-images`, `bp-thegreenwebfoundation` included)
  - Remove stale `has-cat-images` demo audit and its locale entries
  - Fix `libs/ecoindex-lh-plugin-ts/README.md`: update RWEB audit table from 18 to 28 entries, BP audits section updated to 11 entries
  - Update RGESN reference URL in `docs/bonnes-pratiques/02-rgesn.md`
  - Restrict Retype doc publication to push on `main` only (remove `workflow_dispatch` trigger)

## 7.3.2

### Patch Changes

- 66fbc8b: Remove misleading RWEB fiche references from 5 audits (Phase 1 corrections):
  - `rweb-combine-assets`: scoring threshold corrected to ≤2 files to match RWEB_0078
  - `rweb-css-containment`: no longer claims RWEB_0039 (manual-check audit)
  - `rweb-no-document-write`: no longer claims RWEB_0044 (different DOM API check)
  - `rweb-no-unused-code`: no longer claims RWEB_0046 (render-blocking check, not static linting)
  - `rweb-no-js-errors`: no longer claims RWEB_0043 (runtime errors, not static linting)

  Fix `rweb-print-css` silently skipped in Lighthouse 13 due to stale `requiredArtifacts` (`DOMStats`, `devtoolsLogs`).

## 7.3.1

### Patch Changes

- 3dc823e: feat(bp): add details tables to 12 BP audits — now exposing domains, URLs, CSS selectors and code snippets alongside the score

## 7.3.0

### Minor Changes

- 215fe14: i18n: migrate all bp audit runtime strings to Lighthouse native i18n system

  All hardcoded `displayValue`, `displayValuePass`, `displayValueFail`, and table column `label` strings in every bp audit file are now wrapped with `createIcuMessageFn` / `str_()`. English and French translations added to `en.json` and `fr.json`.

- e7c0cf7: i18n: translate table-helper strings + add network resource table to requests/size audits

  All hardcoded strings in `table-helper.ts` (column headers, row labels, threshold descriptions) are now wrapped with `createIcuMessageFn` / `str_()`. English and French translations added to `en.json` and `fr.json`.

  The `requests` and `size` audits now display a second table listing each network resource (URL, domain, transfer size in KiB) sorted by size descending, combined with the existing info table via `Audit.makeListDetails`.

### Patch Changes

- 72f6457: fix(i18n): fix French locale registration and fr.json format

  Two fixes applied:
  - `registerLocaleData` now spreads `lhLocales['fr']` before adding plugin strings, preserving Lighthouse core French translations
  - Fixed 11 doubly-wrapped `{ message: { message: "..." } }` entries in `fr.json` (plugin.js group/category strings) that caused `message.replace is not a function` at runtime

## 7.2.2

### Patch Changes

- b830700: Remove legacy directory and commented-out dead code in plugin.ts

## 7.2.1

## 7.2.0

### Minor Changes

- 9764d21: Update vulnerable dependencies: bump @usebruno/cli to 3.3.0 (fixes critical axios supply chain alert), add pnpm overrides for postcss@^8.5.14 and fast-uri@^3.1.2.

### Patch Changes

- 9764d21: Fix TypeScript error cast in TheGreenWebFoundation audit error handler.

## 7.1.0

### Minor Changes

- f614978: Add 36 RWEB GreenIT best-practice audits

  First batch: rweb-no-autoplay, rweb-no-canvas, rweb-no-inline-assets, rweb-no-gif, rweb-title-meta, rweb-no-embedded-docs, rweb-no-animations, rweb-service-worker, rweb-no-social-sdk, rweb-limit-analytics, rweb-limit-domains, rweb-no-redirects, rweb-hsts, rweb-no-cookie-on-static, rweb-limit-fonts, rweb-print-css, rweb-css-containment, rweb-no-carousel.

  Second batch: rweb-cache-control, rweb-http-compression, rweb-uses-http2, rweb-cookie-size, rweb-no-http-errors, rweb-limit-css-files, rweb-combine-assets, rweb-lazy-loading, rweb-no-document-write, rweb-no-hidden-images, rweb-no-js-errors, rweb-no-plugins, rweb-minification, rweb-optimize-svg, rweb-prefer-css, rweb-no-bitmap-ui, rweb-no-unused-code, rweb-css-splitting.

  Includes BPGatherer for DOM-based detection, refs-urls.ts RWEB entries, and a `refs:update` script to regenerate RWEB documentation URLs.

## 7.0.1

### Patch Changes

- b7b4690: Update lighthouse from 13.0.1 to 13.2.0 and puppeteer from 24.26.1 to 24.42.0.

## 7.0.0

### Minor Changes

- 1c02665: Add high-impact test page and fix null/undefined metric handling
  - Add `/heavy` route (800+ DOM nodes) to cover pages with no external network requests
  - Guard `TotalByteWeight.audit` with try-catch to prevent crash on pages with no network records
  - Add `Number.isFinite` guards in `computeEcoindexResults` to safely handle null/undefined inputs
  - Add `getExplanationForMetric` helper and populate `explanation` field in audit results
  - Fix missing `return` on `createErrorResult` calls in audit classes
  - Use optional chaining in `printSummary` to prevent `TypeError` when audit values are missing
  - Fix `stopServer` to kill all processes bound to the port (not only the PID-tracked one)

## 6.0.7

### Patch Changes

- 2f895f6: **Added**: Schema published to unpkg.com for IDE autocomplete
  - Input-file schema now available at `https://unpkg.com/lighthouse-plugin-ecoindex-core@latest/input-file/schema.json`
  - Automatic schema copy to package during build
  - Updated all test files to reference unpkg URL
  - Created `scripts/manage-schema.sh` to automate schema version management

  **Refactored**: Test infrastructure with automatic verification
  - All test projects now automatically verify results after generation
  - Created unified `test/ensure-test-server.mjs` for centralized server management
  - Added automatic verification to `@ecoindex-lh-test/plugin-core`, `@ecoindex-lh-test/courses`, and `@ecoindex-lh-test/cli`
  - Created local test pages for predictable testing (simple, svg, shadow-dom, svg-shadow-dom, complex)
  - Verification script detects latest timestamped subdirectories automatically

  **Improved**: Script organization and documentation
  - Moved all utility scripts to `scripts/` directory
  - Added comprehensive `scripts/README.md` documentation
  - Updated all script paths in package.json and documentation
  - Added npm commands: `schema:create`, `schema:update`, `test:server:*`

## 6.0.6

### Patch Changes

- bf6e97f: Upgraded to Lighthouse 13.0.1 with breaking changes adaptation and `extra-header` fix

  **Major Changes (Lighthouse 12 → 13):**
  - Upgraded Lighthouse dependency from 12.4.0 to 13.0.1
  - **Breaking Changes Addressed:**
    - Changed `artifacts.devtoolsLogs[Audit.DEFAULT_PASS]` to `artifacts.DevtoolsLog` (API change)
    - Removed `DOMStats` artifact usage (no longer available in Lighthouse 13+)
    - Added defensive handling for `OptimizedImages` and `ImageElements` artifacts (may be deprecated)
    - Updated `requiredArtifacts` in audits to use `'DevtoolsLog'` instead of `'devtoolsLogs'`

  **Refactored:**
  - Split monolithic `calcul-helper.ts` into focused modules:
    - `network-metrics.ts` - Network metrics extraction
    - `score-helper.ts` - Score calculation logic
    - `format-helper.ts` - Display formatting
    - `table-helper.ts` - Table generation
  - Enhanced code readability and maintainability

  **Fixed:**
  - Fixed DOM counting logic for SVG children (now correctly counts only direct children, not recursive descendants)
  - Fixed `extra-header` parsing error when provided as an object in JSON file (`input-file.json`) vs string from CLI
  - Fixed circular dependency issue between `extractDOMSize` and `getEcoindexNodes`
  - Added proper type checking to handle both string (CLI) and object (JSON file) formats for `extra-header`
  - Improved error handling for external `extra-header` file references

  **Improved:**
  - Added comprehensive JSDoc documentation to `dom-informations.ts` gatherer
  - Documented DOM counting logic according to Ecoindex specifications (SVG children exclusion, Shadow DOM support)
  - Enhanced code comments explaining the recursive counting algorithms

  The fix ensures `extra-header` works correctly in all three scenarios:
  - String JSON from CLI: `--extra-header '{"Cookie":"value"}'`
  - Object from JSON file: `{"extra-header": {"Cookie":"value"}}`
  - External file reference: `--extra-header ./headers.json`

## 6.0.5

### Patch Changes

- 5ddc1b4: Fix extra-header baddly convert

## 6.0.4

### Patch Changes

- 34d996e: Update Course to match EcoindexApp

## 6.0.3

### Patch Changes

- b969940: Fix error on puppeteer-script

## 6.0.2

### Patch Changes

- b34be47: bump

## 6.0.1

### Patch Changes

- 2c51205: Add logs and fix test.

## 6.0.0

### Minor Changes

- 6f29d32: fix: modification de la fonction checkIfMandatoryBrowserInstalled pour retourner null au lieu de quitter le processus si aucun navigateur obligatoire n'est installé

### Patch Changes

- 789eb47: - fix: amélioration de la gestion des erreurs lors de l'importation du script Puppeteer, ajout d'un message d'erreur si le fichier n'est pas trouvé.
  - feat: mise à jour de l'importation dynamique du script Puppeteer pour inclure des options supplémentaires (position et urls) dans l'appel de la fonction
  - docs: ajout d'une section sur l'utilisation de fichiers de script Puppeteer personnalisés pour les audits avec authentification complexe, incluant des avertissements et des exemples de configuration.
- 1c50a53: Disable the retype action from secondary actions from changeset
- f3d3bae: Passage au mono-repo
- 6f29d32: Fix les fichiers non publiés dans npm
- 6f29d32: ajout de peerDependencies pour les plugins lighthouse dans les fichiers package.json des projets ecoindex-lh-cli et ecoindex-lh-courses
- 2200618: Adds the ability to use your own puppeteer script to manage authentication that is more complex than the one provided.
- 6c4de97: Many changes:
  - Update schema and add `audit-category` in the schema
  - Add `audit-category` in the process of the measure
  - Update tests in `@ecoindex-lh-test/courses`
  - Update tests in `@ecoindex-lh-test/cli`
  - Update description of the audit `warn-nodes-count`
  - Update the description of the audits to be more Lightouse like

- 6f29d32: Change reading Node Count because of baddly implement #shadow-root (Shadow DOM).
  1. Fix error when getting page
  2. Fix unoptimized images audit
  3. Fix bad sized images audit
  4. fix: update Lighthouse configuration to include screen emulation and throttling parameters in settings
  5. Better count nodes with #shadow-root

- 56b7be4: better node count
- 90ba012: Documenatation and missing demo file
- 6f29d32: Change CliFlags type pour rendre la plupart des attributs optionels. Changement dans la gestion de l'installation des navagateurs pour peppeteer.
- 6f29d32: Meilleur gestion des Browser puppetter et des tests
- 6f29d32: - Move old plugin to ./legacy
  - fix error with puppeteer auto-install
- 6f29d32: Change CliFlags type pour rendre la plupart des attributs optionels.
- 6f29d32: Déplacement de la logique d'installation des browsers puppeter dans `lighthouse-plugin-ecoindex-courses` au lien de `lighthouse-plugin-ecoindex-core`.
- 6f29d32: Ajout de private true sur les package de test
- 6f29d32: change config of changeset
- 6f29d32: test publish and changeset (1)
- 6f29d32: feat: mise à jour de la configuration personnalisée en remplaçant le chemin du Gatherer par une implémentation directe du Gatherer dom-informations
- 6f29d32: fix: distribution de fichiers .js ESM et nettoyages des exports
- 6f29d32: - Add workflows for retype
  - Add audit better error message caused by timeout on Green Web Foundation API.
  - Add audit handler for localhost mesurement with The Green Web Foundation API.
- 6f29d32: huge roolback
- 6f29d32: fixing lighthouse version to `12.5.1` because of breaking change in lib. Must investigate with `artifacts.devtoolsLogs` see https://github.com/GoogleChrome/lighthouse/issues/15306
- 6f29d32: Fix le chemin de l'auto-install du browser Puppeteer
- 998653b: Update version of ecoindex lib (2.0.1)
- 6f29d32: - Add Bruno configuration to test thegreenwebfoundation.org api
  - Change the gatherer path to be absolute
  - Add an export of the custom config to be used in the courses package
  - Fix the courses lighthouse config baddly merged with the core config
- 6f29d32: Mise à jour de la doc pour générer une MR
- 6f29d32: Add configuration from https://lirantal.com/blog/introducing-changesets-simplify-project-versioning-with-semantic-releases
- 6f29d32: Fix wrong browser version installation.
- fb5fe3b: Cleaner Audits name and update GHG and Water display
- 6f29d32: Auto commit des changesets

## 6.0.0-next.0

### Minor Changes

- 6f29d32: fix: modification de la fonction checkIfMandatoryBrowserInstalled pour retourner null au lieu de quitter le processus si aucun navigateur obligatoire n'est installé

### Patch Changes

- 6f29d32: Fix les fichiers non publiés dans npm
- 6f29d32: ajout de peerDependencies pour les plugins lighthouse dans les fichiers package.json des projets ecoindex-lh-cli et ecoindex-lh-courses
- 6f29d32: Change reading Node Count because of baddly implement #shadow-root (Shadow DOM).
  1. Fix error when getting page
  2. Fix unoptimized images audit
  3. Fix bad sized images audit
  4. fix: update Lighthouse configuration to include screen emulation and throttling parameters in settings
  5. Better count nodes with #shadow-root

- 6f29d32: Change CliFlags type pour rendre la plupart des attributs optionels. Changement dans la gestion de l'installation des navagateurs pour peppeteer.
- 6f29d32: Meilleur gestion des Browser puppetter et des tests
- 6f29d32: - Move old plugin to ./legacy
  - fix error with puppeteer auto-install
- 6f29d32: Change CliFlags type pour rendre la plupart des attributs optionels.
- 6f29d32: Déplacement de la logique d'installation des browsers puppeter dans `lighthouse-plugin-ecoindex-courses` au lien de `lighthouse-plugin-ecoindex-core`.
- 6f29d32: Ajout de private true sur les package de test
- 6f29d32: change config of changeset
- 6f29d32: test publish and changeset (1)
- 6f29d32: feat: mise à jour de la configuration personnalisée en remplaçant le chemin du Gatherer par une implémentation directe du Gatherer dom-informations
- 6f29d32: fix: distribution de fichiers .js ESM et nettoyages des exports
- 6f29d32: - Add workflows for retype
  - Add audit better error message caused by timeout on Green Web Foundation API.
  - Add audit handler for localhost mesurement with The Green Web Foundation API.
- 6f29d32: huge roolback
- 6f29d32: fixing lighthouse version to `12.5.1` because of breaking change in lib. Must investigate with `artifacts.devtoolsLogs` see https://github.com/GoogleChrome/lighthouse/issues/15306
- 6f29d32: Fix le chemin de l'auto-install du browser Puppeteer
- 6f29d32: - Add Bruno configuration to test thegreenwebfoundation.org api
  - Change the gatherer path to be absolute
  - Add an export of the custom config to be used in the courses package
  - Fix the courses lighthouse config baddly merged with the core config
- 6f29d32: Mise à jour de la doc pour générer une MR
- 6f29d32: Add configuration from https://lirantal.com/blog/introducing-changesets-simplify-project-versioning-with-semantic-releases
- 6f29d32: Fix wrong browser version installation.
- 6f29d32: Auto commit des changesets

## 1.1.0

### Minor Changes

- fe82722: Prepare publish

## 5.3.0

### Minor Changes

- 6495067: test changeset publishing

## 5.2.0

### Minor Changes

- b273aae: test changesets
