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
        'https://www.ecoindex.fr/',
        // 'https://novagaia.fr/',
        // 'https://www.relocalisons.bzh/',
        // 'https://www.neuro-mav-france.org/',
        'https://practice.expandtesting.com/shadowdom/',
        // 'https://www.alodokter.com/',
      ],
      numberOfRuns: 1,
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
