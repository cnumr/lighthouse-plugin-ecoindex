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
  title: 'RWEB_0011 - Page has title and meta description',
  failureTitle: 'RWEB_0011 - Missing title or meta description',
  description:
    'Ensure the page has a non-empty title and meta description. [See RWEB_0011](https://rweb.greenit.fr/en/fiches/RWEB_0011-relevant-page-titles-and-metadescriptions)',
  displayValuePass: 'Title and meta description present',
  displayValueFail: 'Missing title or meta description',
}
const str_ = createIcuMessageFn('audits/bp/rweb-title-meta.js', UIStrings)

class BPRwebTitleMeta extends Audit {
  static get meta() {
    return {
      id: 'rweb-title-meta',
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
    const { pageTitle, metaDescription } = artifacts.BPGatherer
    const hasTitle = pageTitle.trim().length > 0
    const hasMetaDescription = metaDescription.trim().length > 0

    const hasBoth = hasTitle && hasMetaDescription

    return {
      score: hasBoth ? 1 : 0,
      displayValue: hasBoth
        ? str_(UIStrings.displayValuePass)
        : str_(UIStrings.displayValueFail),
      numericValue: hasBoth ? 1 : 0,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebTitleMeta
