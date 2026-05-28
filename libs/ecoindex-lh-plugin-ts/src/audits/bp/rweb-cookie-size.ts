import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const MAX_COOKIE_BYTES = 512

const UIStrings = {
  title: 'Cookie size ≤ 512 bytes',
  failureTitle: 'Cookie header exceeds 512 bytes',
  description:
    'Keep Cookie request headers under 512 bytes to reduce HTTP overhead.',
  displayValuePass: 'No Cookie header exceeds 512 bytes',
  displayValueFail: '{count} request(s) with oversized Cookie header',
  colLabelUrl: 'URL',
  colLabelCookieSize: 'Cookie size (bytes)',
}
const str_ = createIcuMessageFn('audits/bp/rweb-cookie-size.js', UIStrings)

class BPRwebCookieSize extends Audit {
  static get meta() {
    return {
      id: 'rweb-cookie-size',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
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
          {
            key: 'size',
            label: str_(UIStrings.colLabelCookieSize),
            valueType: 'bytes' as const,
          },
        ],
        items: violations,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebCookieSize
