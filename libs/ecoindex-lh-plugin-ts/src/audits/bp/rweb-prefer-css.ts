import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

// Detect <img> directly inside <button> or <a> — likely icon usage replaceable by CSS
const ICON_IMG_IN_BUTTON =
  /<button\b[^>]*>(?:[^<]|<(?!img\b))*<img\b[^>]*>(?:[^<]|<(?!\/button))*<\/button>/gi
const ICON_IMG_IN_ANCHOR =
  /<a\b[^>]*>(?:[^<]|<(?!img\b))*<img\b[^>]*>(?:[^<]|<(?!\/a))*<\/a>/gi
const UIStrings = {
  title: 'RWEB_0037 - Prefer CSS over images for UI elements',
  failureTitle: 'RWEB_0037 - Images used for UI icons (prefer CSS)',
  description:
    'Replace bitmap or SVG icons inside buttons and links with CSS shapes or icon fonts to reduce HTTP requests. [See RWEB_0037](https://rweb.greenit.fr/en/fiches/RWEB_0037-use-css-instead-of-images)',
  displayValuePass: 'No icon images in buttons/links detected',
  displayValueFail: '{count} image(s) used as UI icons',
  colLabelContext: 'Context',
  colLabelElementSnippet: 'Element snippet',
}
const str_ = createIcuMessageFn('audits/bp/rweb-prefer-css.js', UIStrings)

class BPRwebPreferCss extends Audit {
  static get meta() {
    return {
      id: 'rweb-prefer-css',
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
            key: 'context',
            label: str_(UIStrings.colLabelContext),
            valueType: 'text' as const,
          },
          {
            key: 'element',
            label: str_(UIStrings.colLabelElementSnippet),
            valueType: 'text' as const,
          },
        ],
        items: allMatches,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebPreferCss
