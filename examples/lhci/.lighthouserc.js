const CustomArtifacts = [
  {
    id: 'NodesMinusSvgsGatherer',
    gatherer: 'lighthouse-plugin-ecoindex/gatherers/nodes-minus-svg-gatherer',
  },
  {
    id: 'PrintCssGatherer',
    gatherer: 'lighthouse-plugin-ecoindex/gatherers/bp/print-css-gatherer',
  },
]
const CustomGatherers = [
  './lighthouse-plugin-ecoindex/gatherers/nodes-minus-svg-gatherer.js',
  './lighthouse-plugin-ecoindex/gatherers/bp/print-css-gatherer.js',
  // ... ajoutez d'autres gatherers personnalisés si nécessaire
]

module.exports = {
  ci: {
    collect: {
      // url: ['https://www.ecoindex.fr/'],
      numberOfRuns: 1,
      settings: {
        formFactor: 'desktop',
        // https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0, // 0 means unset
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
        },
        emulatedUserAgent: 'desktop',
        maxWaitForLoad: 60 * 1000,
        plugins: ['lighthouse-plugin-ecoindex'],
        disableStorageReset: true,
        preset: 'desktop',
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
      puppeteerScript: '.puppeteerrc.js',
    },
    assert: {
      preset: 'lighthouse:default',
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'http://localhost:9001',
      token: 'aa5c026a-7a60-44a5-bbd4-e05647562cd4', // The Lighthouse CI server build token for the project
      ignoreDuplicateBuildFailure: true,
    },
  },
}
