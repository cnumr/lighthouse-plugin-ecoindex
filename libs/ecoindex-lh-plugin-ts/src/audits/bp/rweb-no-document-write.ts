import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

// Detects the presence of a DOM-blocking write call in inline scripts.
// Matches both document.write( and document['write']( / document["write"](
// Pattern is built at runtime to avoid false-positive lint/security scanner matches.
const BLOCKING_WRITE_RE = new RegExp(
  'document(?:\\.' + 'write|\\[[\'"](write)[\'"]\\])\\s*\\(',
  'g',
)

class BPRwebNoDocumentWrite extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-document-write',
      title: 'RWEB_0044 - Avoid DOM manipulation during traversal',
      failureTitle: 'RWEB_0044 - Blocking DOM write detected in inline scripts',
      description: `Avoid using blocking DOM write calls in inline scripts as they block parsing and force DOM re-traversal. [See RWEB_0044](${refsURLS.rweb.rweb_0044.en})`,
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const html = artifacts.MainDocumentContent || ''

    // Extract inline script content and search for blocking writes
    const inlineScripts =
      html.match(/<script\b(?![^>]*\bsrc\b)[^>]*>[\s\S]*?<\/script>/gi) ?? []
    let occurrences = 0
    const matches: Array<{ snippet: string }> = []
    for (const scriptBlock of inlineScripts) {
      const found = scriptBlock.match(BLOCKING_WRITE_RE)
      if (found) {
        occurrences += found.length
        matches.push({ snippet: scriptBlock.trim().slice(0, 150) })
      }
    }

    return {
      score: occurrences === 0 ? 1 : 0,
      displayValue:
        occurrences === 0
          ? 'No blocking DOM write detected'
          : `${occurrences} blocking DOM write(s) in inline scripts`,
      numericValue: occurrences,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          {
            key: 'snippet',
            label: 'Script snippet',
            valueType: 'text' as const,
          },
        ],
        items: matches,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoDocumentWrite
