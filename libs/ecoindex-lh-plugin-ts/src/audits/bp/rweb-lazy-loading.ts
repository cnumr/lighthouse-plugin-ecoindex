import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0051 - Use lazy loading for images',
  failureTitle: 'RWEB_0051 - Images without lazy loading detected',
  description:
    'Add loading="lazy" to below-the-fold images to defer their download. [See RWEB_0051](https://rweb.greenit.fr/en/fiches/RWEB_0051-use-lazy-loading)',
  displayValuePass: 'All images use lazy loading',
  displayValueFail: '{count} image(s) without lazy loading',
  colLabelImageUrl: 'Image URL',
}
const str_ = createIcuMessageFn('audits/bp/rweb-lazy-loading.js', UIStrings)

class BPRwebLazyLoading extends Audit {
  static get meta() {
    return {
      id: 'rweb-lazy-loading',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const html = artifacts.MainDocumentContent || ''

    // Find <img> tags missing loading="lazy"
    const imgPattern = /<img\b[^>]*>/gi
    const imgs = html.match(imgPattern) ?? []
    const violations = imgs.filter(
      tag => !/loading\s*=\s*["']lazy["']/i.test(tag),
    )

    const count = violations.length
    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count }),
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          {
            key: 'url',
            label: str_(UIStrings.colLabelImageUrl),
            valueType: 'url' as const,
          },
        ],
        items: violations.map(tag => {
          const srcMatch = tag.match(/src\s*=\s*["']([^"']+)["']/i)
          return { url: srcMatch ? srcMatch[1] : tag.slice(0, 100) }
        }),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebLazyLoading
