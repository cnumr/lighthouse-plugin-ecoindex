/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import refCnumr from './ref-cnumr.js'

class BPPrintCSS extends Audit {
  static get meta() {
    return {
      id: 'bp-print-css',
      title: 'Print CSS',
      failureTitle: 'No print css implemented.',
      description: `A print css must be implemented to hide useless elements when printing. [See CNUMR BP_027](${refCnumr.bp_027.en})`,

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: ['PrintCssGatherer', 'DOMStats', 'devtoolsLogs'],
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
        id: 'print-css-audit',
        title: 'print-css-audit',
        description: 'print-css-audit.',
        scoreDisplayMode: 'numeric',
      },
    ]
  }

  static audit(artifacts) {
    const value = artifacts.PrintCssGatherer.value
    // const success = isNaN(value) && value >= 0
    // console.log(
    //   'artifacts.PrintCssGatherer.value',
    //   artifacts.PrintCssGatherer.value,
    // )
    return {
      score: value > 0 ? 1 : 0,
      displayValue: `Print CSS count: ${value}`,
      numericValue: value,
    }
  }
}

export default BPPrintCSS