import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

// Detect <img> directly inside <button> or <a> — likely icon usage replaceable by CSS
const ICON_IMG_IN_BUTTON =
  /<button\b[^>]*>(?:[^<]|<(?!img\b))*<img\b[^>]*>(?:[^<]|<(?!\/button))*<\/button>/gi
const ICON_IMG_IN_ANCHOR =
  /<a\b[^>]*>(?:[^<]|<(?!img\b))*<img\b[^>]*>(?:[^<]|<(?!\/a))*<\/a>/gi
const UIStrings = {
  title: 'RWEB_0037 - Prefer CSS over images for UI elements',
  failureTitle: 'RWEB_0037 - Images used for UI icons (prefer CSS)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebPreferCss extends Audit {
  static get meta() {
    return {
      id: 'rweb-prefer-css',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: `Replace bitmap or SVG icons inside buttons and links with CSS shapes or icon fonts to reduce HTTP requests. [See RWEB_0037](${refsURLS.rweb.rweb_0037.en})`,
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const html = artifacts.MainDocumentContent || ''

    const buttons = html.match(ICON_IMG_IN_BUTTON) ?? []
    const anchors = html.match(ICON_IMG_IN_ANCHOR) ?? []
    const allMatches = [
      ...buttons.map(el => ({ context: 'button', element: el.slice(0, 150) })),
      ...anchors.map(el => ({ context: 'link', element: el.slice(0, 150) })),
    ]
    const count = allMatches.length

    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0
          ? 'No icon images in buttons/links detected'
          : `${count} image(s) used as UI icons`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          { key: 'context', label: 'Context', valueType: 'text' as const },
          {
            key: 'element',
            label: 'Element snippet',
            valueType: 'text' as const,
          },
        ],
        items: allMatches,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebPreferCss
