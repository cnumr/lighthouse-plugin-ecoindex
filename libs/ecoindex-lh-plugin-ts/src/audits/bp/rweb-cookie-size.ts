import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'

const MAX_COOKIE_BYTES = 512

class BPRwebCookieSize extends Audit {
  static get meta() {
    return {
      id: 'rweb-cookie-size',
      title: `RWEB_0062 - Cookie size ≤ ${MAX_COOKIE_BYTES} bytes`,
      failureTitle: `RWEB_0062 - Cookie header exceeds ${MAX_COOKIE_BYTES} bytes`,
      description: `Keep Cookie request headers under ${MAX_COOKIE_BYTES} bytes to reduce HTTP overhead. [See RWEB_0062](${refsURLS.rweb.rweb_0062.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const violations: Array<{ url: string; size: number }> = []
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      const cookieHeader = (
        record as unknown as {
          requestHeaders?: Array<{ name: string; value: string }>
        }
      ).requestHeaders?.find(
        (h: { name: string; value: string }) =>
          h.name.toLowerCase() === 'cookie',
      )
      if (cookieHeader && cookieHeader.value.length > MAX_COOKIE_BYTES) {
        violations.push({ url: record.url, size: cookieHeader.value.length })
      }
    }

    const count = violations.length
    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0
          ? `No Cookie header exceeds ${MAX_COOKIE_BYTES} bytes`
          : `${count} request(s) with oversized Cookie header`,
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
            key: 'size',
            label: 'Cookie size (bytes)',
            valueType: 'bytes' as const,
          },
        ],
        items: violations,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebCookieSize
