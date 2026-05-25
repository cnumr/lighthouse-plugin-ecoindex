import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const MAX_FONT_FAMILIES = 2

const UIStrings = {
  title: 'RWEB_0032 - Limit font families (≤ 2)',
  failureTitle: 'RWEB_0032 - Too many external font families (> 2)',
  description:
    'Reduce the number of external font families loaded. [See RWEB_0032](https://rweb.greenit.fr/en/fiches/RWEB_0032-prefer-standard-fonts)',
  displayValue:
    '{count, plural, one {# external font family} other {# external font families}}',
  colLabelDomain: 'Font domain',
}
const str_ = createIcuMessageFn('audits/bp/rweb-limit-fonts.js', UIStrings)

const FONT_DOMAINS = [
  'fonts.googleapis.com',
  'use.typekit.net',
  'fonts.bunny.net',
  'fonts.adobe.com',
  'use.fontawesome.com',
  'cdn.fontawesome.com',
]

class BPRwebLimitFonts extends Audit {
  static get meta() {
    return {
      id: 'rweb-limit-fonts',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const fontFamilies = new Set<string>()
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      try {
        const { hostname } = new URL(record.url)
        if (FONT_DOMAINS.includes(hostname)) {
          fontFamilies.add(hostname)
        }
      } catch {
        // ignore malformed URLs
      }
    }

    const count = fontFamilies.size

    return {
      score: count <= MAX_FONT_FAMILIES ? 1 : 0,
      displayValue: str_(UIStrings.displayValue, { count }),
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
            key: 'domain',
            label: str_(UIStrings.colLabelDomain),
            valueType: 'text' as const,
          },
        ],
        items: [...fontFamilies].map(domain => ({ domain })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebLimitFonts
