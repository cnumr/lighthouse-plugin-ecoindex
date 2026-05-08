import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRwebTitleMeta extends Audit {
  static get meta() {
    return {
      id: 'rweb-title-meta',
      title: 'RWEB_0011 - Page has title and meta description',
      failureTitle: 'RWEB_0011 - Missing title or meta description',
      description: `Ensure the page has a non-empty title and meta description. [See RWEB_0011](${refsURLS.rweb.rweb_0011.en})`,
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts): LH.Audit.Product {
    const html = artifacts.MainDocumentContent

    // Check <title>
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const hasTitle = !!(titleMatch && titleMatch[1].trim().length > 0)

    // Check <meta name="description" content="..."> — handle both attribute orders and both quote types
    const metaTagMatch = html.match(/<meta[^>]+>/gi)
    let hasMetaDescription = false
    if (metaTagMatch) {
      for (const tag of metaTagMatch) {
        const hasName = /name=["']description["']/i.test(tag)
        const contentMatch = tag.match(/content=["']([^"']*)["']/i)
        if (hasName && contentMatch && contentMatch[1].trim().length > 0) {
          hasMetaDescription = true
          break
        }
      }
    }

    const hasBoth = hasTitle && hasMetaDescription

    return {
      score: hasBoth ? 1 : 0,
      displayValue: hasBoth
        ? 'Title and meta description present'
        : 'Missing title or meta description',
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
