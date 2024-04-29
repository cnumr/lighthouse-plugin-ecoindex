/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import { getEcoindexNodes } from '../utils/index.js'
import commons from './commons.js'
import refsURLS from './bp/refs-urls.js'

class WarnNodesCount extends Audit {
  static get meta() {
    return {
      id: 'warn-nodes-count',
      title: '⚠️ Ecoindex nodes number might be ≠ Lighthouse nodes number.',
      failureTitle:
        '⚠️ Ecoindex nodes number might be ≠ Lighthouse nodes number.',
      description: `Explication: Counting all the DOM nodes on the page, excluding the child nodes of \`svg\` elements, gives us the number of DOM elements on the page. This method encourages you not to replace a complex svg with an image, simply to obtain a better score. [See Ecoindex, Analysis methodology](${refsURLS.ecoindex.method.en})`,

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: commons.requiredArtifacts,
    }
  }

  static async audit(artifacts, context) {
    // const MainDocumentContent = artifacts.MainDocumentContent
    // const dom = new JSDOM(MainDocumentContent)
    // const allNodes = dom.window.document.querySelectorAll('*').length
    // // const svgNodes = dom.window.document.querySelectorAll('svg').length
    // const svgContentNodes = dom.window.document.querySelectorAll('svg *').length
    const value = await getEcoindexNodes(artifacts, context)
    const DOMStats = artifacts.DOMStats.totalBodyElements

    return {
      score: value !== DOMStats ? 0.8 : 1,
      displayValue: `Ecoindex: ${value} - Lighthouse: ${DOMStats}`,
      numericValue: value,
      numericUnit: 'DOM elements',
    }
  }
}

export default WarnNodesCount
