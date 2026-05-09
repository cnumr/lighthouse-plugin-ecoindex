import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRwebNoAutoplay extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-autoplay',
      title: 'RWEB_0106 - No video/audio autoplay',
      failureTitle: 'RWEB_0106 - Autoplay video/audio detected',
      description: `Avoid autoplay on video and audio elements. [See RWEB_0106](${refsURLS.rweb.rweb_0106.en})`,
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { autoplaying } = artifacts.BPGatherer

    return {
      score: autoplaying === 0 ? 1 : 0,
      displayValue: `${autoplaying} autoplay element(s)`,
      numericValue: autoplaying,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebNoAutoplay
