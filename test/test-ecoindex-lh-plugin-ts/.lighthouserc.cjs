const path = require('path')

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

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/simple',
        'http://localhost:3000/svg',
        'http://localhost:3000/shadow-dom',
        'http://localhost:3000/svg-shadow-dom',
        'http://localhost:3000/complex',
      ],
      numberOfRuns: 1,
      startServerCommand: 'node ../../test/ensure-test-server.mjs start',
      startServerReadyPattern: 'Test server ready',
      startServerReadyTimeout: 30000,
      settings: {
        configPath: getLighthouseConfig(),
      },
      puppeteerLaunchOptions: {
        headless: 'new',
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
