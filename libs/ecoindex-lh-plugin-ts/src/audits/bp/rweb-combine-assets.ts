import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0078 - Combine CSS and JS files (≤ 10 each)',
  failureTitle: 'RWEB_0078 - Too many separate CSS/JS files',
  description:
    'Concatenate CSS and JS files to reduce HTTP requests. [See RWEB_0078](https://rweb.greenit.fr/en/fiches/RWEB_0078-combining-css-and-javascript-files)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebCombineAssets extends Audit {
  static get meta() {
    return {
      id: 'rweb-combine-assets',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const assets: Array<{ url: string; type: string }> = []
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (record.resourceType === 'Stylesheet')
        assets.push({ url: record.url, type: 'CSS' })
      else if (record.resourceType === 'Script')
        assets.push({ url: record.url, type: 'JS' })
    }

    const cssCount = assets.filter(a => a.type === 'CSS').length
    const jsCount = assets.filter(a => a.type === 'JS').length
    const max = Math.max(cssCount, jsCount)
    let score: number
    if (max <= 10) {
      score = 1
    } else if (max <= 15) {
      score = 0.5
    } else {
      score = 0
    }

    return {
      score,
      displayValue: `${cssCount} CSS + ${jsCount} JS files`,
      numericValue: max,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          { key: 'url', label: 'URL', valueType: 'url' as const },
          { key: 'type', label: 'Type', valueType: 'text' as const },
        ],
        items: assets,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebCombineAssets
