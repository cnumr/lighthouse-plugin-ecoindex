import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRweb0033NoEmbeddedDocs extends Audit {
  static get meta() {
    return {
      id: 'rweb-0033-no-embedded-docs',
      title: 'RWEB_0033 - No embedded documents',
      failureTitle: 'RWEB_0033 - Embedded documents detected',
      description: `Avoid embedding documents (PDF, Word, etc.) directly in HTML. Use links instead. [See RWEB_0033](${refsURLS.rweb.rweb_0033.en})`,
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts): LH.Audit.Product {
    const html = artifacts.MainDocumentContent

    const embedCount = (html.match(/<embed[^>]*>/gi) ?? []).length
    const objectCount = (html.match(/<object[^>]*>/gi) ?? []).length
    const iframePdfCount = (
      html.match(/<iframe[^>]+src=["'][^"']*\.pdf["'][^>]*>/gi) ?? []
    ).length

    const total = embedCount + objectCount + iframePdfCount

    return {
      score: total === 0 ? 1 : 0,
      displayValue:
        total === 0
          ? 'No embedded documents detected'
          : `${total} embedded document${total > 1 ? 's' : ''} found`,
      numericValue: total,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRweb0033NoEmbeddedDocs
