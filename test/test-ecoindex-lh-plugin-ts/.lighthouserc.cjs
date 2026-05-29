const path = require('path')
const fs = require('fs')
const os = require('os')

/**
 * Get the path to the custom Lighthouse config file.
 * @returns {string} The path to the custom Lighthouse config file.
 */
const getLighthouseConfig = () => {
  return path.join(
    require.resolve('lighthouse-plugin-ecoindex-core'),
    '../helpers/lhci/custom-config.js',
  )
}

/**
 * Find the Chrome for Testing executable installed by auto-install.js
 * (via @puppeteer/browsers in ~/.cache/puppeteer/chrome/).
 * Returns undefined if not found — lhci will fall back to its own Chromium.
 * @returns {string | undefined}
 */
function findInstalledChrome() {
  const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome')
  if (!fs.existsSync(cacheDir)) return undefined

  const versions = fs
    .readdirSync(cacheDir)
    .filter(d => fs.statSync(path.join(cacheDir, d)).isDirectory())
    .sort()
    .reverse()

  for (const version of versions) {
    const candidates = [
      path.join(
        cacheDir,
        version,
        'chrome-mac-arm64',
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing',
      ),
      path.join(
        cacheDir,
        version,
        'chrome-mac-x64',
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing',
      ),
      path.join(cacheDir, version, 'chrome-linux64', 'chrome'),
      path.join(cacheDir, version, 'chrome-win64', 'chrome.exe'),
    ]
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate
    }
  }
  return undefined
}

const chromePath = findInstalledChrome()
// Make puppeteer@21 (CJS, required by @lhci/cli) use the same Chrome
// instead of downloading its own version.
if (chromePath) process.env.PUPPETEER_EXECUTABLE_PATH = chromePath

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/simple',
        'http://localhost:3000/svg',
        'http://localhost:3000/shadow-dom',
        'http://localhost:3000/svg-shadow-dom',
        'http://localhost:3000/complex',
        'http://localhost:3000/heavy',
        'http://localhost:3000/bp-violations',
      ],
      numberOfRuns: 1,
      startServerCommand: 'node ../../test/ensure-test-server.mjs start',
      startServerReadyPattern: 'Test server ready',
      startServerReadyTimeout: 30000,
      settings: {
        configPath: getLighthouseConfig(),
        locale: 'fr',
      },
      puppeteerLaunchOptions: {
        headless: 'new',
        executablePath: chromePath,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox',
        ],
      },
      puppeteerScript: './.puppeteerrc.cjs',
    },
    assert: {
      preset: 'lighthouse:default',
    },
  },
}
