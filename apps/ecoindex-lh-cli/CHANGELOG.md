# lighthouse-plugin-ecoindex

## 7.4.0

### Patch Changes

- 35c6299: Update Puppeteer, Lighthouse, and Lighthouse CI dependencies.
- Updated dependencies [35c6299]
- Updated dependencies [319c8e1]
  - lighthouse-plugin-ecoindex-courses@7.4.0
  - lighthouse-plugin-ecoindex-core@7.4.0

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

- Updated dependencies [6360f35]
  - lighthouse-plugin-ecoindex-courses@7.3.4
  - lighthouse-plugin-ecoindex-core@7.3.4

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
- Updated dependencies [db1eede]
  - lighthouse-plugin-ecoindex-core@7.3.3
  - lighthouse-plugin-ecoindex-courses@7.3.3

## 7.3.2

### Patch Changes

- Updated dependencies [66fbc8b]
  - lighthouse-plugin-ecoindex-core@7.3.2
  - lighthouse-plugin-ecoindex-courses@7.3.2

## 7.3.1

### Patch Changes

- Updated dependencies [3dc823e]
  - lighthouse-plugin-ecoindex-core@7.3.1
  - lighthouse-plugin-ecoindex-courses@7.3.1

## 7.3.0

### Minor Changes

- 51d7ccb: feat(i18n): add --lang option and propagate locale to Lighthouse settings
- 48c5e30: feat(i18n): migrate all audit UIStrings to Lighthouse native i18n

  All 42 bp audits and core audits now use `createIcuMessageFn` + `str_()` for title, failureTitle, and description. English strings are registered in `en.json`; French translations are in `fr.json`. The plugin reads the locale passed by Lighthouse (set via `--lang` CLI flag) and resolves strings accordingly.

### Patch Changes

- Updated dependencies [215fe14]
- Updated dependencies [72f6457]
- Updated dependencies [51d7ccb]
- Updated dependencies [e7c0cf7]
  - lighthouse-plugin-ecoindex-core@7.3.0
  - lighthouse-plugin-ecoindex-courses@7.3.0

## 7.2.2

### Patch Changes

- Updated dependencies [b830700]
  - lighthouse-plugin-ecoindex-core@7.2.2
  - lighthouse-plugin-ecoindex-courses@7.2.2

## 7.2.1

### Patch Changes

- 02b5f0b: Fix TypeScript type inconsistencies and enable stricter compiler options
  - `installMandatoryBrowser`: add default value `Browser.CHROMEHEADLESSSHELL` so it can be called without arguments
  - `checkIfMandatoryBrowserInstalled`: correct return type from `InstalledBrowser | ''` to `InstalledBrowser | null`
  - Enable `noUnusedLocals` and `noUnusedParameters` in all tsconfigs
  - Add missing `@types/node` devDependency to `lighthouse-plugin-ecoindex-courses`

- Updated dependencies [02b5f0b]
  - lighthouse-plugin-ecoindex-courses@7.2.1
  - lighthouse-plugin-ecoindex-core@7.2.1

## 7.2.0

### Patch Changes

- Updated dependencies [9764d21]
- Updated dependencies [9764d21]
- Updated dependencies [9764d21]
  - lighthouse-plugin-ecoindex-courses@7.2.0
  - lighthouse-plugin-ecoindex-core@7.2.0

## 7.1.0

### Minor Changes

- f614978: Add 36 RWEB GreenIT best-practice audits

  First batch: rweb-no-autoplay, rweb-no-canvas, rweb-no-inline-assets, rweb-no-gif, rweb-title-meta, rweb-no-embedded-docs, rweb-no-animations, rweb-service-worker, rweb-no-social-sdk, rweb-limit-analytics, rweb-limit-domains, rweb-no-redirects, rweb-hsts, rweb-no-cookie-on-static, rweb-limit-fonts, rweb-print-css, rweb-css-containment, rweb-no-carousel.

  Second batch: rweb-cache-control, rweb-http-compression, rweb-uses-http2, rweb-cookie-size, rweb-no-http-errors, rweb-limit-css-files, rweb-combine-assets, rweb-lazy-loading, rweb-no-document-write, rweb-no-hidden-images, rweb-no-js-errors, rweb-no-plugins, rweb-minification, rweb-optimize-svg, rweb-prefer-css, rweb-no-bitmap-ui, rweb-no-unused-code, rweb-css-splitting.

  Includes BPGatherer for DOM-based detection, refs-urls.ts RWEB entries, and a `refs:update` script to regenerate RWEB documentation URLs.

### Patch Changes

- Updated dependencies [f614978]
  - lighthouse-plugin-ecoindex-core@7.1.0
  - lighthouse-plugin-ecoindex-courses@7.1.0

## 7.0.1

### Patch Changes

- Updated dependencies [b7b4690]
  - lighthouse-plugin-ecoindex-core@7.0.1
  - lighthouse-plugin-ecoindex-courses@7.0.1

## 7.0.0

### Patch Changes

- Updated dependencies [1c02665]
  - lighthouse-plugin-ecoindex-core@7.0.0
  - lighthouse-plugin-ecoindex-courses@7.0.0

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

- Updated dependencies [ba38609]
- Updated dependencies [2f895f6]
  - lighthouse-plugin-ecoindex-courses@6.0.7
  - lighthouse-plugin-ecoindex-core@6.0.7

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

- Updated dependencies [bf6e97f]
  - lighthouse-plugin-ecoindex-core@6.0.6
  - lighthouse-plugin-ecoindex-courses@6.0.6

## 6.0.5

### Patch Changes

- 5ddc1b4: Fix extra-header baddly convert
- Updated dependencies [5ddc1b4]
  - lighthouse-plugin-ecoindex-core@6.0.5
  - lighthouse-plugin-ecoindex-courses@6.0.5

## 6.0.4

### Patch Changes

- 34d996e: Update Course to match EcoindexApp
- Updated dependencies [34d996e]
  - lighthouse-plugin-ecoindex-core@6.0.4
  - lighthouse-plugin-ecoindex-courses@6.0.4

## 6.0.3

### Patch Changes

- b969940: Fix error on puppeteer-script
- Updated dependencies [b969940]
  - lighthouse-plugin-ecoindex-core@6.0.3
  - lighthouse-plugin-ecoindex-courses@6.0.3

## 6.0.2

### Patch Changes

- b34be47: bump
- Updated dependencies [b34be47]
  - lighthouse-plugin-ecoindex-core@6.0.2
  - lighthouse-plugin-ecoindex-courses@6.0.2

## 6.0.1

### Patch Changes

- 2c51205: Add logs and fix test.
- Updated dependencies [2c51205]
  - lighthouse-plugin-ecoindex-courses@6.0.1
  - lighthouse-plugin-ecoindex-core@6.0.1

## 6.0.0

### Patch Changes

- 789eb47: - fix: amélioration de la gestion des erreurs lors de l'importation du script Puppeteer, ajout d'un message d'erreur si le fichier n'est pas trouvé.
  - feat: mise à jour de l'importation dynamique du script Puppeteer pour inclure des options supplémentaires (position et urls) dans l'appel de la fonction
  - docs: ajout d'une section sur l'utilisation de fichiers de script Puppeteer personnalisés pour les audits avec authentification complexe, incluant des avertissements et des exemples de configuration.
- 1c50a53: Disable the retype action from secondary actions from changeset
- f3d3bae: Passage au mono-repo
- 2200618: Adds the ability to use your own puppeteer script to manage authentication that is more complex than the one provided.
- 6c4de97: Many changes:
  - Update schema and add `audit-category` in the schema
  - Add `audit-category` in the process of the measure
  - Update tests in `@ecoindex-lh-test/courses`
  - Update tests in `@ecoindex-lh-test/cli`
  - Update description of the audit `warn-nodes-count`
  - Update the description of the audits to be more Lightouse like

- 56b7be4: better node count
- 90ba012: Documenatation and missing demo file
- 998653b: Update version of ecoindex lib (2.0.1)
- fb5fe3b: Cleaner Audits name and update GHG and Water display
- Updated dependencies [789eb47]
- Updated dependencies [1c50a53]
- Updated dependencies [f3d3bae]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [2200618]
- Updated dependencies [6c4de97]
- Updated dependencies [6f29d32]
- Updated dependencies [56b7be4]
- Updated dependencies [90ba012]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [998653b]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [fb5fe3b]
- Updated dependencies [6f29d32]
  - lighthouse-plugin-ecoindex-core@6.0.0
  - lighthouse-plugin-ecoindex-courses@6.0.0

## 6.0.0-next.0

### Patch Changes

- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
- Updated dependencies [6f29d32]
  - lighthouse-plugin-ecoindex-core@6.0.0-next.0
  - lighthouse-plugin-ecoindex-courses@6.0.0-next.0
