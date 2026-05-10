import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0033 - No embedded documents',
  failureTitle: 'RWEB_0033 - Embedded documents detected',
  description:
    'Avoid embedding documents (PDF, Word, etc.) directly in HTML. Use links instead. [See RWEB_0033](https://rweb.greenit.fr/en/fiches/RWEB_0033-do-not-display-documents-within-pages)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoEmbeddedDocs extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-embedded-docs',
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

export default BPRwebNoEmbeddedDocs
