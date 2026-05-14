import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

// External scripts without async or defer block the parser
const BLOCKING_SCRIPT_RE =
  /<script\b(?=[^>]*\bsrc\b)(?![^>]*\b(?:async|defer)\b)[^>]*>/gi
const UIStrings = {
  title: 'RWEB_0046 - Avoid render-blocking external scripts',
  failureTitle: 'RWEB_0046 - Blocking external scripts detected',
  description:
    'Add async or defer to external scripts to prevent blocking the critical rendering path. [See RWEB_0046](https://rweb.greenit.fr/en/fiches/RWEB_0046-only-load-datacode-when-necessary)',
  displayValuePass: 'No render-blocking external scripts',
  displayValueFail: '{count} render-blocking external script(s)',
  colLabelScriptUrl: 'Script URL',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-unused-code.js', UIStrings)

class BPRwebNoUnusedCode extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-unused-code',
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
    const blocking = html.match(BLOCKING_SCRIPT_RE) ?? []
    const count = blocking.length

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
            label: str_(UIStrings.colLabelScriptUrl),
            valueType: 'url' as const,
          },
        ],
        items: blocking.map(tag => {
          const srcMatch = tag.match(/src\s*=\s*["']([^"']+)["']/i)
          return { url: srcMatch ? srcMatch[1] : tag.slice(0, 100) }
        }),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoUnusedCode
