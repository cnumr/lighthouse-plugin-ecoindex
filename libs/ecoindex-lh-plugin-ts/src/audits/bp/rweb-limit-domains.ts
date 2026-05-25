import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const MAX_DOMAINS = 5

const UIStrings = {
  title: 'RWEB_0082 - Limit resource domains (≤ 5)',
  failureTitle: 'RWEB_0082 - Too many resource domains (> 5)',
  description:
    'Reduce the number of unique domains serving page resources. [See RWEB_0082](https://rweb.greenit.fr/en/fiches/RWEB_0082-limit-the-number-of-domains-serving-resources)',
  displayValue: '{count} unique domain(s)',
  colLabelDomain: 'Domain',
}
const str_ = createIcuMessageFn('audits/bp/rweb-limit-domains.js', UIStrings)

class BPRwebLimitDomains extends Audit {
  static get meta() {
    return {
      id: 'rweb-limit-domains',
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

    const domains = new Set<string>()
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      try {
        const { hostname } = new URL(record.url)
        domains.add(hostname)
      } catch {
        // ignore malformed URLs
      }
    }

    const count = domains.size

    return {
      score: count <= MAX_DOMAINS ? 1 : 0,
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
        items: [...domains].map(domain => ({ domain })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebLimitDomains
