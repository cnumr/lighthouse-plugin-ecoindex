const path = require('path')

const getLighthouseConfig = () => {
  return path.join(
    require.resolve('lighthouse-plugin-ecoindex-legacy'),
    '../helpers/lhci/custom-config.cjs',
  )
}

module.exports = {
  ci: {
    collect: {
      url: [
        'https://www.ecoindex.fr/',
        'https://novagaia.fr/',
        'https://www.neuro-mav-france.org/',
        // 'https://www.ecoindex.fr/a-propos/',
        // 'https://www.ecoindex.fr/ecoconception/',
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
