# lighthouse-plugin-ecoindex-core

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
