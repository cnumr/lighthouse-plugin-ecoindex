# lighthouse-plugin-ecoindex

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
