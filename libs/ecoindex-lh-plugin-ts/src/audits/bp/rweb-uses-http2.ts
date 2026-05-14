import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0083 - Use HTTP/2',
  failureTitle: 'RWEB_0083 - Resources served over HTTP/1',
  description:
    'Use HTTP/2 to benefit from multiplexing and header compression. [See RWEB_0083](https://rweb.greenit.fr/en/fiches/RWEB_0083-http2-over-http1)',
  displayValuePass: 'All resources use HTTP/2+',
  displayValueFail: '{count} resource(s) on HTTP/1',
  colLabelUrl: 'URL',
}
const str_ = createIcuMessageFn('audits/bp/rweb-uses-http2.js', UIStrings)

class BPRwebUsesHttp2 extends Audit {
  static get meta() {
    return {
      id: 'rweb-uses-http2',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
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
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count }),
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
            key: 'url',
            label: str_(UIStrings.colLabelUrl),
            valueType: 'url' as const,
          },
        ],
        items: violations.map(url => ({ url })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebUsesHttp2
