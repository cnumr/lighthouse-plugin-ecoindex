import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

// External scripts without async or defer block the parser
const BLOCKING_SCRIPT_RE =
  /<script\b(?=[^>]*\bsrc\b)(?![^>]*\b(?:async|defer)\b)[^>]*>/gi

class BPRwebNoUnusedCode extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-unused-code',
      title: 'RWEB_0046 - Avoid render-blocking external scripts',
      failureTitle: 'RWEB_0046 - Blocking external scripts detected',
      description: `Add async or defer to external scripts to prevent blocking the critical rendering path. [See RWEB_0046](${refsURLS.rweb.rweb_0046.en})`,
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
          ? 'No render-blocking external scripts'
          : `${count} render-blocking external script(s)`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          { key: 'url', label: 'Script URL', valueType: 'url' as const },
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
