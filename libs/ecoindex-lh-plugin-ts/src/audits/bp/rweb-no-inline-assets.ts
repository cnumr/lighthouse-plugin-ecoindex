import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRwebNoInlineAssets extends Audit {
  static get meta() {
    return {
      id: 'rweb-0042-no-inline-assets',
      title: 'RWEB_0042 - Minimize inline assets',
      failureTitle: 'RWEB_0042 - Inline assets detected',
      description: `Minimize the use of inline scripts and styles. [See RWEB_0042](${refsURLS.rweb.rweb_0042.en})`,
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { inlineScripts, inlineStyles } = artifacts.BPGatherer
    const totalInlineAssets = inlineScripts + inlineStyles

    return {
      score: totalInlineAssets <= 2 ? 1 : 0,
      displayValue:
        totalInlineAssets === 0
          ? 'No inline assets'
          : `${totalInlineAssets} inline asset(s) found`,
      numericValue: totalInlineAssets,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebNoInlineAssets
