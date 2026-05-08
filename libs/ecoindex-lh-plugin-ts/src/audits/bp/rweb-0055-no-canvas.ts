import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0055NoCanvas extends Audit {
  static get meta() {
    return {
      id: 'rweb-0055-no-canvas',
      title: 'RWEB_0055 - Avoid canvas elements',
      failureTitle: 'RWEB_0055 - Canvas elements detected',
      description: `Minimize the use of canvas elements. [See RWEB_0055](${refsURLS.rweb.rweb_0055.en})`,
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { canvasCount } = artifacts.BPGatherer

    return {
      score: canvasCount === 0 ? 1 : 0,
      displayValue:
        canvasCount === 0
          ? 'No canvas elements'
          : `${canvasCount} canvas element(s) found`,
      numericValue: canvasCount,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRweb0055NoCanvas
