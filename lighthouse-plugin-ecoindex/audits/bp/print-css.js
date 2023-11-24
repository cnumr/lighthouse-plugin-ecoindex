/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPPrintCSS extends Audit {
  static get meta() {
    return {
      id: 'bp-print-css',
      title: '#RWEB_027 - Print CSS',
      failureTitle: '#RWEB_027 - No print css implemented.',
      description: `A print css must be implemented to hide useless elements when printing. [See #RWEB_027](${refsURLS.rweb.bp_027.en})`,

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: ['LinkElements', 'DOMStats', 'devtoolsLogs'],
    }
  }

  static audit(artifacts) {
    const stylesheets = artifacts.LinkElements.filter(
      link =>
        link.rel === 'stylesheet' && link?.node?.snippet.match(/media="print"/),
    )
    return {
      score: stylesheets.length > 0 ? 1 : 0,
      displayValue: `Print CSS count: ${stylesheets.length}`,
      numericValue: stylesheets.length,
    }
  }
}

export default BPPrintCSS
