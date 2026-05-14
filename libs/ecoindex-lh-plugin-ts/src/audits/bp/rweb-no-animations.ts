import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0009 - No animated elements',
  failureTitle: 'RWEB_0009 - Animated elements detected',
  description:
    'Avoid animations and transitions to reduce CPU and battery usage. [See RWEB_0009](https://rweb.greenit.fr/en/fiches/RWEB_0009-avoid-javascriptcss-animations)',
  displayValuePass: 'No animated elements',
  displayValueFail: '{count} animated element(s) found',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoAnimations extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-animations',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
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
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count: animatedElements }),
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
