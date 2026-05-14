import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'Avoid downloading images that are not displayed',
  failureTitle: 'Images downloaded but not displayed detected',
  description:
    'Images that are downloaded but hidden waste bandwidth. Use lazy loading or remove them.',
  displayValuePass: 'No hidden downloaded images',
  displayValueFail: '{count} image(s) downloaded but not displayed',
  colLabelImageUrl: 'Image URL',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoHiddenImages extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-hidden-images',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['ImageElements'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const images = artifacts.ImageElements ?? []

    const hidden = images.filter(img => {
      const hasNaturalSize =
        img.naturalDimensions &&
        img.naturalDimensions.width > 0 &&
        img.naturalDimensions.height > 0
      const isHidden =
        img.clientRect.right - img.clientRect.left === 0 ||
        img.clientRect.bottom - img.clientRect.top === 0
      return hasNaturalSize && isHidden
    })

    const count = hidden.length
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
        items: hidden.map(img => ({ url: img.src })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoHiddenImages
