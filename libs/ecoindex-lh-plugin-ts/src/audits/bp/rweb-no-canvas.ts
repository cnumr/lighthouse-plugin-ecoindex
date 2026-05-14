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
  title: 'RWEB_0055 - Avoid canvas elements',
  failureTitle: 'RWEB_0055 - Canvas elements detected',
  description:
    'Minimize the use of canvas elements. [See RWEB_0055](https://rweb.greenit.fr/en/fiches/RWEB_0055-limit-canvas-use)',
  displayValuePass: 'No canvas elements',
  displayValueFail: '{count} canvas element(s) found',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoCanvas extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-canvas',
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

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { canvasCount } = artifacts.BPGatherer

    return {
      score: canvasCount === 0 ? 1 : 0,
      displayValue:
        canvasCount === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count: canvasCount }),
      numericValue: canvasCount,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebNoCanvas
