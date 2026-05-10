import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0083 - Use HTTP/2',
  failureTitle: 'RWEB_0083 - Resources served over HTTP/1',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebUsesHttp2 extends Audit {
  static get meta() {
    return {
      id: 'rweb-uses-http2',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: `Use HTTP/2 to benefit from multiplexing and header compression. [See RWEB_0083](${refsURLS.rweb.rweb_0083.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const violations: string[] = []
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (
        record.protocol &&
        record.protocol !== 'h2' &&
        record.protocol !== 'h3'
      ) {
        violations.push(record.url)
      }
    }

    const count = violations.length
    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0
          ? 'All resources use HTTP/2+'
          : `${count} resource(s) on HTTP/1`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [{ key: 'url', label: 'URL', valueType: 'url' as const }],
        items: violations.map(url => ({ url })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebUsesHttp2
