import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0009 - No animated elements',
  failureTitle: 'RWEB_0009 - Animated elements detected',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoAnimations extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-animations',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: `Avoid animations and transitions to reduce CPU and battery usage. [See RWEB_0009](${refsURLS.rweb.rweb_0009.en})`,
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts): LH.Audit.Product {
    const { animatedElements } = artifacts.BPGatherer

    return {
      score: animatedElements === 0 ? 1 : 0,
      displayValue:
        animatedElements === 0
          ? 'No animated elements'
          : `${animatedElements} animated element${animatedElements > 1 ? 's' : ''} found`,
      numericValue: animatedElements,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebNoAnimations
