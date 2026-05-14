import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const CSS_SIZE_THRESHOLD = 10 * 1024 // 10 KB

// Link tags that target all contexts (no media splitting)
const UNSCOPED_LINK_RE = /<link\b[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi
const MEDIA_ATTR_RE = /\bmedia\s*=\s*["'](?!all\b|["'])/i
const UIStrings = {
  title: 'RWEB_0036 - Split CSS by media context',
  failureTitle: 'RWEB_0036 - Large CSS files without media targeting detected',
  description:
    'Split large CSS files by media type (print, mobile…) so only relevant styles are parsed. [See RWEB_0036](https://rweb.greenit.fr/en/fiches/RWEB_0036-divide-css)',
  displayValuePass: 'All large CSS files are scoped by media type',
  displayValueFail: '{count} large CSS file(s) without media targeting',
  colLabelCssUrl: 'CSS URL',
}
const str_ = createIcuMessageFn('audits/bp/rweb-css-splitting.js', UIStrings)

class BPRwebCssSplitting extends Audit {
  static get meta() {
    return {
      id: 'rweb-css-splitting',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['MainDocumentContent', 'DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const html = artifacts.MainDocumentContent || ''
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    // Build a map of CSS URL → resource size
    const cssSizes = new Map<string, number>()
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (record.resourceType !== 'Stylesheet') continue
      cssSizes.set(record.url, record.resourceSize ?? 0)
    }

    // Find unscoped link tags (no media attribute or media="all")
    const linkTags = html.match(UNSCOPED_LINK_RE) ?? []
    const violatingUrls: string[] = []
    for (const tag of linkTags) {
      if (MEDIA_ATTR_RE.test(tag)) continue // has a targeted media attr
      // Extract href to check size
      const hrefMatch = tag.match(/href\s*=\s*["']([^"']+)["']/i)
      if (!hrefMatch) continue
      const href = hrefMatch[1]
      for (const [url, size] of cssSizes) {
        if (url.includes(href) && size > CSS_SIZE_THRESHOLD) {
          violatingUrls.push(url)
          break
        }
      }
    }

    const violations = violatingUrls.length
    return {
      score: violations === 0 ? 1 : 0,
      displayValue:
        violations === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count: violations }),
      numericValue: violations,
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
            label: str_(UIStrings.colLabelCssUrl),
            valueType: 'url' as const,
          },
        ],
        items: violatingUrls.map(url => ({ url })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebCssSplitting
