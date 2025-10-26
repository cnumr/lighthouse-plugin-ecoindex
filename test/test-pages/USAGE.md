# Usage Guide - Test Pages

## 🚀 Quick Start

### Automatic Testing (Integrated with LHCI)

The easiest way to use test pages is through the automatic LHCI integration:

```bash
# From project root
pnpm --filter @ecoindex-lh-test/plugin-core test
```

This will:

1. ✅ Automatically start the test server
2. ✅ Run Lighthouse on all test pages
3. ✅ Open the report in your browser
4. ✅ Automatically stop the server

**No manual setup required!**

### Manual Testing (Development/Debugging)

If you need to test manually:

#### 1. Install dependencies

```bash
cd test/test-pages
pnpm install
```

#### 2. Start the test server

```bash
pnpm start
```

Server will run on `http://localhost:3000`

#### 3. Open pages in browser

- Simple: http://localhost:3000/simple
- SVG: http://localhost:3000/svg
- Shadow DOM: http://localhost:3000/shadow-dom
- SVG + Shadow DOM: http://localhost:3000/svg-shadow-dom
- Complex: http://localhost:3000/complex

#### 4. Run Lighthouse tests

From project root:

```bash
# Build the plugin first
pnpm --filter lighthouse-plugin-ecoindex-core build

# Run tests manually
lighthouse http://localhost:3000/simple --plugin=lighthouse-plugin-ecoindex-core --output html --output-path=./report.html
```

## 📊 Expected Results

### Simple Page

- DOM nodes: ~15-25
- Requests: ~3-7
- Score: 80-100 (excellent)

### SVG Page

- DOM nodes: ~20-30 (SVG children excluded)
- Requests: ~3-7
- Score: 70-100
- Note: 2 SVG elements with 5 direct children total

### Shadow DOM Page

- DOM nodes: ~35-50 (includes Shadow DOM)
- Requests: ~3-7
- Score: 70-100
- Note: 2 shadow roots created with JavaScript

### SVG + Shadow DOM Page

- DOM nodes: ~45-65 (Shadow DOM included, SVG children excluded)
- Requests: ~3-7
- Score: 70-95
- Note: Most complex test - 3 shadow roots, 2 containing SVGs (8 total SVG children)

### Complex Page

- DOM nodes: ~40-65
- Requests: ~8-15
- Score: 60-90
- Note: Realistic page with images

## ✅ Verification Script

Verify that results match expectations:

```bash
node verify-results.js <lhr-file-path> <page-key>

# Examples
node verify-results.js .lighthouseci/url-simple.lhr.json simple
node verify-results.js .lighthouseci/url-svg.lhr.json svg
node verify-results.js .lighthouseci/url-shadow-dom.lhr.json shadow-dom
node verify-results.js .lighthouseci/url-svg-shadow-dom.lhr.json svg-shadow-dom
node verify-results.js .lighthouseci/url-complex.lhr.json complex
```

## ⚙️ LHCI Configuration

The test pages are integrated with LHCI for automatic server management.

### Configuration File

`test/test-ecoindex-lh-plugin-ts/.lighthouserc.cjs`:

```javascript
{
  ci: {
    collect: {
      url: [
        'http://localhost:3000/simple',
        'http://localhost:3000/svg',
        'http://localhost:3000/shadow-dom',
        'http://localhost:3000/svg-shadow-dom',
        'http://localhost:3000/complex'
      ],
      startServerCommand: 'pnpm --filter @ecoindex-lh-test/test-pages start',
      startServerReadyPattern: 'Test server running',
      startServerReadyTimeout: 30000
    }
  }
}
```

### How It Works

1. **Automatic Start**: LHCI runs `startServerCommand` before collecting metrics
2. **Ready Detection**: Waits for `startServerReadyPattern` in server logs
3. **Timeout Protection**: Fails after `startServerReadyTimeout` milliseconds
4. **Automatic Stop**: Server stops when tests complete

### Using in Other Test Projects

To use test pages in another test project, add to their `.lighthouserc.*`:

```javascript
{
  ci: {
    collect: {
      url: ['http://localhost:3000/simple'],
      startServerCommand: 'pnpm --filter @ecoindex-lh-test/test-pages start',
      startServerReadyPattern: 'Test server running',
      startServerReadyTimeout: 30000
    }
  }
}
```

## 🔧 Integration with Existing Tests

The local test pages can replace or complement the current test URLs.

### Option 1: Use alongside existing tests

Run both local and internet-based tests for comprehensive coverage.

### Option 2: Replace internet tests

Use only local test pages for stability and predictability.

## 📝 Customizing Test Pages

### Add a new test page

1. Create `test-pages/new-page.html`
2. Add entry to `expected-results.json`
3. Update `server.js` to add route
4. Test and adjust expected values

### Update expected results

After verifying results are correct:

1. Run Lighthouse on page
2. Check actual values in LHR file
3. Update `expected-results.json` with actual values
4. Consider adding tolerance if values vary slightly

## 🐛 Debugging

### Server not starting

```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port
PORT=3001 node server.js
```

### Tests failing verification

1. Check server is running
2. Verify Lighthouse is using correct URL
3. Look at actual values in LHR file
4. Adjust expected values or tolerance

## 🎯 Benefits

- **Consistency**: Same results every time
- **Speed**: No internet dependency
- **Control**: You control the test content
- **Automation**: Can verify results programmatically
- **Regression testing**: Catch breaking changes quickly
