import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0035 - Limit CSS stylesheets (≤ 7)',
  failureTitle: 'RWEB_0035 - Too many CSS stylesheets',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebLimitCssFiles extends Audit {
  static get meta() {
    return {
      id: 'rweb-limit-css-files',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: `Keep the number of CSS files to 7 or fewer to reduce HTTP requests. [See RWEB_0035](${refsURLS.rweb.rweb_0035.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const cssUrls: string[] = []
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (record.resourceType === 'Stylesheet') {
        cssUrls.push(record.url)
      }
    }

    const cssCount = cssUrls.length
    let score: number
    if (cssCount <= 7) {
      score = 1
    } else if (cssCount <= 10) {
      score = 0.5
    } else {
      score = 0
    }

    return {
      score,
      displayValue: `${cssCount} CSS stylesheet(s)`,
      numericValue: cssCount,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          { key: 'url', label: 'Stylesheet URL', valueType: 'url' as const },
        ],
        items: cssUrls.map(url => ({ url })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebLimitCssFiles
