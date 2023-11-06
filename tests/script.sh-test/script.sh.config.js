/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// eslint-disable-next-line no-unused-vars
import * as LH from 'lighthouse'

/** @type {LH.Config} */
const config = {
  extends: 'lighthouse:default',
  plugins: ['lighthouse-plugin-ecoindex'],
  artifacts: [
    {
      id: 'NodesMinusSvgsGatherer',
      gatherer: 'lighthouse-plugin-ecoindex/gatherers/nodes-minus-svg-gatherer',
    },
  ],
  settings: {
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
    },
  },
}

export default config
