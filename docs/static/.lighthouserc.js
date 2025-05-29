module.exports = {
  ci: {
    collect: {
      url: [
        'https://www.ecoindex.fr/',
        'https://www.ecoindex.fr/comment-ca-marche/',
      ],
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
      puppeteerScript:
        './node_modules/lighthouse-plugin-ecoindex/helpers/.puppeteerrc.cjs',
    },
    assert: {
      preset: 'lighthouse:default',
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'http://localhost:9001', // The Lighthouse CI server URL
      token: 'aa5c026a-7a60-44a5-bbd4-e05647562cd4', // The Lighthouse CI server build token for the project
      ignoreDuplicateBuildFailure: true,
    },
  },
}
