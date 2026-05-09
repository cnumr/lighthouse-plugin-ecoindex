import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'

class BPRwebNoHttpErrors extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-http-errors',
      title: 'Avoid HTTP request errors (4xx/5xx)',
      failureTitle: 'HTTP request errors detected (4xx/5xx)',
      description:
        'Fix broken resources (404, 500…) to avoid unnecessary network load and improve user experience.',
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const violations: Array<{ url: string; statusCode: number }> = []
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (record.statusCode >= 400) {
        violations.push({ url: record.url, statusCode: record.statusCode })
      }
    }

    const count = violations.length
    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0 ? 'No HTTP errors' : `${count} HTTP error(s) detected`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          { key: 'url', label: 'URL', valueType: 'url' as const },
          {
            key: 'statusCode',
            label: 'Status code',
            valueType: 'text' as const,
          },
        ],
        items: violations,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoHttpErrors
