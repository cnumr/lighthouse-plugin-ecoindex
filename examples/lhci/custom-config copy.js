/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export default {
  // 1. Run your custom tests along with all the default Lighthouse tests.
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
    plugins: ['lighthouse-plugin-ecoindex'],
    disableStorageReset: true,
    preset: 'desktop',
    puppeteerScript: './.puppeteerrc.js',
    chromeFlags:
      '--disable-gpu --disable-dev-shm-usage --disable-setuid-sandbox --no-sandbox',
  },

  // 2. Register new artifact with custom gatherer.
  artifacts: [
    {
      id: 'NodesMinusSvgsGatherer',
      gatherer: 'lighthouse-plugin-ecoindex/gatherers/nodes-minus-svg-gatherer',
    },
    {
      id: 'PrintCssGatherer',
      gatherer: 'lighthouse-plugin-ecoindex/gatherers/bp/print-css-gatherer',
    },
  ],

  // 3. Add custom audit to the list of audits 'lighthouse:default' will run.
  audits: [
    'lighthouse-plugin-ecoindex/audits/warn-nodes-count',
    'lighthouse-plugin-ecoindex/audits/ecoindex-score',
    'lighthouse-plugin-ecoindex/audits/ecoindex-grade',
    'lighthouse-plugin-ecoindex/audits/ecoindex-water',
    'lighthouse-plugin-ecoindex/audits/ecoindex-ghg',
    'lighthouse-plugin-ecoindex/audits/ecoindex-nodes',
    'lighthouse-plugin-ecoindex/audits/ecoindex-size',
    'lighthouse-plugin-ecoindex/audits/ecoindex-requests',
    'lighthouse-plugin-ecoindex/audits/bp/print-css',
  ],
  groups: {
    ecologic: {
      title: 'Ecoindex results',
      description: 'Ecoindex revealant metrics',
    },
    technic: {
      title: 'Technical results',
      description: 'Technical metrics',
    },
    'best-practices': {
      title: 'Best practices',
      description:
        'CNUMR (Collectif Conception Numérique Responsable) "115 best practices" reference framework.',
    },
  },
  // 4. Create a new 'My site audits' section in the default report for our results.
  categories: {
    Ecoindex: {
      title: 'Ecoindex',
      description:
        '[Ecoindex®](https://www.ecoindex.fr/) revealant metrics, by [GreenIT.fr®](https://www.greenit.fr).  ' +
        '[GitHub](https://github.com/NovaGaia/lighthouse-plugin-ecoindex)',
      auditRefs: [
        // no category audit, warn on nodes count
        { id: 'warn-nodes-count', weight: 0 },
        // ecologic
        { id: 'eco-index-score', weight: 1, group: 'ecologic' },
        { id: 'eco-index-grade', weight: 0, group: 'ecologic' },
        { id: 'eco-index-water', weight: 0, group: 'ecologic' },
        { id: 'eco-index-ghg', weight: 0, group: 'ecologic' },
        // technic
        // lighthouse-nodes is deprecated, see warn-nodes-count
        // { id: 'lighthouse-nodes', weight: 0, group: 'technic' },
        { id: 'eco-index-nodes', weight: 0, group: 'technic' },
        { id: 'eco-index-size', weight: 0, group: 'technic' },
        { id: 'eco-index-requests', weight: 0, group: 'technic' },
        // best-practices
        { id: 'bp-print-css', weight: 0, group: 'best-practices' },
      ],
    },
  },
}
