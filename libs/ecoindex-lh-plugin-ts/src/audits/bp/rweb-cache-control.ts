import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const CACHEABLE_TYPES = new Set(['Document', 'Stylesheet', 'Script', 'Font'])
const UIStrings = {
  title: 'RWEB_0075 - Use Cache-Control headers',
  failureTitle: 'RWEB_0075 - Resources missing Cache-Control header',
  description:
    'Set Cache-Control headers on HTML, CSS, JS and font resources to reduce repeated downloads. [See RWEB_0075](https://rweb.greenit.fr/en/fiches/RWEB_0075-add-expires-or-cache-control-headers)',
  displayValuePass: 'All resources have Cache-Control',
  displayValueFail: '{count} resource(s) missing Cache-Control',
  colLabelUrl: 'URL',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebCacheControl extends Audit {
  static get meta() {
    return {
      id: 'rweb-cache-control',
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
      if (!CACHEABLE_TYPES.has(record.resourceType ?? '')) continue
      const hasCacheControl = record.responseHeaders?.some(
        h => h.name.toLowerCase() === 'cache-control',
      )
      if (!hasCacheControl) {
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

export default BPRwebCacheControl
