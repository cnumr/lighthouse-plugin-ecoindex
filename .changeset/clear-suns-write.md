---
'lighthouse-plugin-ecoindex-core': patch
'lighthouse-plugin-ecoindex-courses': patch
'lighthouse-plugin-ecoindex': patch
---

Upgraded to Lighthouse 13.0.1 with breaking changes adaptation and `extra-header` fix

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
