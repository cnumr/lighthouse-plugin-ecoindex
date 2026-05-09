import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { GathererArtifacts } from 'lighthouse'
import { Audit } from 'lighthouse'
import refsURLS from './../bp/refs-urls.js'

class BPRwebPrintCss extends Audit {
  static get meta() {
    return {
      id: 'rweb-print-css',
      title: 'RWEB_0031 - Print CSS',
      failureTitle: 'RWEB_0031 - No print css implemented.',
      description: `A print css must be implemented to hide useless elements when printing. [See RWEB_0031](${refsURLS.rweb.rweb_0031.en})`,

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: ['LinkElements', 'DOMStats', 'devtoolsLogs'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const stylesheets = artifacts.LinkElements.filter(
      link =>
        link.rel === 'stylesheet' && link?.node?.snippet.match(/media="print"/),
    )
    return {
      score: stylesheets.length > 0 ? 1 : 0,
      displayValue: `Print CSS count: ${stylesheets.length}`,
      numericValue: stylesheets.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebPrintCss
