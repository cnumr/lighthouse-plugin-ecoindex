import domInformationsGatherer from '../../gatherers/dom-informations.js'

/** @type {LH.Config} */
export default {
  extends: 'lighthouse:default',
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
    disableStorageReset: true,
    preset: 'desktop',
  },
  plugins: ['lighthouse-plugin-ecoindex-core'],
  artifacts: [
    {
      id: 'DOMInformations',
      gatherer: {
        implementation: domInformationsGatherer,
      },
    },
  ],
}
