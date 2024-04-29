/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const path = require('path');
function getGatherersPath(file) {
  return path.join(
    require.resolve('lighthouse-plugin-ecoindex'),
    '../gatherers/' + file,
  )
}
/** @type {LH.Config} */
module.exports = {
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
  extends: "lighthouse:default",
  artifacts: [
    {id: 'DOMInformations', gatherer: getGatherersPath('dom-informations')},
  ],
}
