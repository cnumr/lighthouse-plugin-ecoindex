import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRwebServiceWorker extends Audit {
  static get meta() {
    return {
      id: 'rweb-0060-service-worker',
      title: 'RWEB_0060 - Service Worker active',
      failureTitle: 'RWEB_0060 - No active Service Worker detected',
      description: `A Service Worker improves caching and reduces network requests. [See RWEB_0060](${refsURLS.rweb.rweb_0060.en})`,
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { serviceWorkerActive } = artifacts.BPGatherer

    return {
      score: serviceWorkerActive ? 1 : 0,
      displayValue: serviceWorkerActive
        ? 'Service Worker active'
        : 'No Service Worker',
      numericValue: serviceWorkerActive ? 1 : 0,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebServiceWorker
