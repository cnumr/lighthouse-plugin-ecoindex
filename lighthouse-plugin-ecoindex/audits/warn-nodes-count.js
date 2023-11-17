/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import { JSDOM } from 'jsdom'

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
      requiredArtifacts: ['MainDocumentContent', 'DOMStats', 'devtoolsLogs'],
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
    const MainDocumentContent = artifacts.MainDocumentContent
    const dom = new JSDOM(MainDocumentContent)
    const allNodes = dom.window.document.querySelectorAll('*').length
    // const svgNodes = dom.window.document.querySelectorAll('svg').length
    const svgContentNodes = dom.window.document.querySelectorAll('svg *').length
    const value = allNodes - svgContentNodes
    const DOMStats = artifacts.DOMStats.totalBodyElements

    return {
      score: 0.8,
      displayValue: `Ecoindex: ${value} - Lighthouse: ${DOMStats}`,
      numericValue: value,
      numericUnit: 'DOM elements',
    }
  }
}

export default WarnNodesCount
