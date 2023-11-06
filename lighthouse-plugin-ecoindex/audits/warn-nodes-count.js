/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'

class WarnNodesCount extends Audit {
  static get meta() {
    return {
      id: 'warn-nodes-count',
      title: '⚠️ Ecoindex nodes number might be ≠ Lighthouse nodes number.',
      failureTitle:
        '⚠️ Ecoindex nodes number might be ≠ Lighthouse nodes number.',
      description:
        'Explication: In Ecoindex, we count all HTML nodes, withouts SVGs content.',

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: ['NodesMinusSvgsGatherer', 'DOMStats', 'devtoolsLogs'],
    }
  }

  static get metrics() {
    return [
      {
        id: 'dom-size',
        title: 'DOM Size',
        description: 'The size of the DOM in bytes.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'request-count',
        title: 'Request Count',
        description: 'The number of network requests made by the page.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'total-compressed-size',
        title: 'Total Compressed Size',
        description: 'The total size of all compressed responses in bytes.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'custom-audit',
        title: 'custom-audit',
        description: 'custom-audit.',
        scoreDisplayMode: 'numeric',
      },
    ]
  }

  static audit(artifacts) {
    const value = artifacts.NodesMinusSvgsGatherer.value
    const DOMStats = artifacts.DOMStats.totalBodyElements
    // const success = isNaN(value) && value >= 0

    return {
      numericValue: value,
      // Cast true/false to 1/0
      score: 0.8,
      displayValue: `Ecoindex: ${value} - Lighthouse: ${DOMStats}`,
      numericUnit: 'DOM elements',
      // displayValue: value,
    }
  }
}

export default WarnNodesCount
