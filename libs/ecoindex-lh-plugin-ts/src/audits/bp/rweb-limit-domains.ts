import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const MAX_DOMAINS = 5

const UIStrings = {
  title: 'RWEB_0082 - Limit resource domains (≤ 5)',
  failureTitle: 'RWEB_0082 - Too many resource domains (> 5)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebLimitDomains extends Audit {
  static get meta() {
    return {
      id: 'rweb-limit-domains',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: `Reduce the number of unique domains serving page resources. [See RWEB_0082](${refsURLS.rweb.rweb_0082.en})`,
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
      displayValue: `${count} unique domain(s)`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebLimitDomains
