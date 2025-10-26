# Test Pages for Lighthouse Ecoindex Plugin

Local test pages for consistent and reproducible testing.

## 🎯 Purpose

These test pages provide a stable environment for testing the Ecoindex Lighthouse plugin:

- ✅ **Predictable results** - Pages don't change
- ✅ **Known metrics** - Expected values are documented
- ✅ **Automated verification** - Results can be validated programmatically
- ✅ **Local testing** - No internet dependency

## 📁 Test Pages

### 1. Simple Page (`/simple`)

- Minimal HTML structure
- Basic elements for DOM counting
- **Expected**: ~20 nodes, high score

### 2. SVG Page (`/svg`)

- Contains SVG elements with multiple children
- Tests SVG children exclusion logic
- **Expected**: ~25 nodes (SVG direct children excluded)

### 3. Shadow DOM Page (`/shadow-dom`)

- Elements with Shadow DOM
- Tests Shadow DOM counting
- **Expected**: ~40 nodes (includes Shadow DOM elements)

### 4. SVG + Shadow DOM Page (`/svg-shadow-dom`)

- Combines SVG elements within Shadow DOM
- Tests that SVG children are excluded even in Shadow DOM
- Contains 3 shadow roots: one without SVG, one with a single SVG (3 children), one with 2 SVGs (5 children)
- **Expected**: ~50 nodes (Shadow DOM included, SVG direct children excluded)
- **Note**: Most complex test case

### 5. Complex Page (`/complex`)

- Realistic page with multiple elements
- Images, SVG, sections
- **Expected**: ~50 nodes, medium score

## 🚀 Usage

### Automatic Testing (Recommended)

The test server is **automatically started and stopped** by LHCI:

```bash
# From project root - LHCI handles server lifecycle
pnpm --filter @ecoindex-lh-test/plugin-core test
```

Configuration in `test-ecoindex-lh-plugin-ts/.lighthouserc.cjs`:

- Server starts automatically with `startServerCommand`
- Server stops automatically after tests complete
- Tests run against localhost URLs

### Manual Testing (Development)

For manual testing or development:

```bash
# 1. Start the server manually
cd test/test-pages
pnpm install
pnpm start

# Server runs at http://localhost:3000

# 2. In another terminal, run Lighthouse
cd test/test-ecoindex-lh-plugin-ts
lighthouse http://localhost:3000/simple --plugin=lighthouse-plugin-ecoindex-core --output html --output-path=./report.html
```

### Verify results

The verification script automatically identifies which test page each LHR file corresponds to by reading the URL from the JSON metadata.

**Automatic verification** is integrated into all test projects:

```bash
# Plugin-core (LHCI)
pnpm --filter @ecoindex-lh-test/plugin-core test
# Automatically verifies after collect

# Courses
pnpm --filter @ecoindex-lh-test/courses test:file
# Automatically verifies after generation

# CLI
pnpm --filter @ecoindex-lh-test/cli test
# Automatically verifies after generation
```

**Manual verification** is also possible:

```bash
# Scan a directory (automatically finds latest timestamped subdir)
node verify-results.js ../test-ecoindex-lh-plugin-ts/.lighthouseci

# Or for CLI/Courses reports
node verify-results.js ../test-ecoindex-lh-cli/reports/file
```

The script automatically:

- Finds the latest timestamped subdirectory
- Identifies test pages from LHR URLs
- Compares actual vs expected results
- Exits with error code if verification fails

## 📊 Expected Results

See `expected-results.json` for the expected metrics for each test page.

### Updating Expected Results

After running tests and verifying the results are correct:

```bash
# Update expected results based on actual results
# Edit expected-results.json manually with the correct values
```

## 🔧 Integration with Test Projects

The test pages are integrated into **all test projects** with automatic verification:

### `@ecoindex-lh-test/plugin-core` (LHCI)

- Config: `.lighthouserc.cjs`
- Reports: `.lighthouseci/lhr-*.json`
- Verification: Automatic after `lhci collect`

### `@ecoindex-lh-test/courses` (Courses)

- Config: URLs inline in test scripts
- Reports: `reports/file/`, `reports/obj/`, `reports/obj-puppeteer/`
- Verification: Automatic after each test script

### `@ecoindex-lh-test/cli` (CLI)

- Config: `input-file.json` or URLs via CLI
- Reports: `reports/file/<timestamp>/` or `reports/<timestamp>/`
- Verification: Automatic after generation

All projects use the same `verify-results.js` script that:

- Finds the latest timestamped subdirectory automatically
- Detects test pages from LHR URLs
- Compares against `expected-results.json`
- Fails tests if results don't match

## 📝 Notes

- All pages are static HTML files
- No external dependencies (fonts, images use data URIs)
- Results should be consistent across runs
- Adjust `expected-results.json` if thresholds need refinement
