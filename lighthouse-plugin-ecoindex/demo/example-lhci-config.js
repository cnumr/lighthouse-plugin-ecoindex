/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const path = require('path')
function getLighthouseConfig() {
  return path.join(
    require.resolve('lighthouse-plugin-ecoindex'),
    '../helpers/lhci/custom-config.cjs',
  )
}
function getPuppeteerConfig() {
  return 'node_modules/lighthouse-plugin-ecoindex/helpers/.puppeteerrc.cjs'
}
module.exports = {
  ci: {
    collect: {
      url: [
        'https://www.ecoindex.fr/',
        'https://www.ecoindex.fr/comment-ca-marche/',
      ],
      numberOfRuns: 1,
      settings: {
        // must adapte the path to the custom-config.js file, it must be an absolute path
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
      puppeteerScript: getPuppeteerConfig(),
    },
    assert: {
      preset: 'lighthouse:default',
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'http://localhost:9001', // The Lighthouse CI server URL
      token: 'xxx', // The Lighthouse CI server build token for the project
      ignoreDuplicateBuildFailure: true,
    },
  },
}
