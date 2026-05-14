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
  title: 'RWEB_0042 - Minimize inline assets',
  failureTitle: 'RWEB_0042 - Inline assets detected',
  description:
    'Minimize the use of inline scripts and styles. [See RWEB_0042](https://rweb.greenit.fr/en/fiches/RWEB_0042-externalize-css-and-javascript)',
  displayValuePass: 'No inline assets',
  displayValueFail: '{count} inline asset(s) found',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoInlineAssets extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-inline-assets',
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
    const { inlineScripts, inlineStyles } = artifacts.BPGatherer
    const totalInlineAssets = inlineScripts + inlineStyles

    return {
      score: totalInlineAssets <= 2 ? 1 : 0,
      displayValue:
        totalInlineAssets === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count: totalInlineAssets }),
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
