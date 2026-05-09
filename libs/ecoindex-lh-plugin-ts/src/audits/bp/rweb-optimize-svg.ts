import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'

const SVG_SIZE_THRESHOLD = 2048

class BPRwebOptimizeSvg extends Audit {
  static get meta() {
    return {
      id: 'rweb-optimize-svg',
      title: 'RWEB_0100 - Optimize SVG files',
      failureTitle: 'RWEB_0100 - Large SVG files detected (likely unoptimized)',
      description: `SVG files over ${SVG_SIZE_THRESHOLD} bytes likely contain metadata or comments that can be removed. [See RWEB_0100](${refsURLS.rweb.rweb_0100.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const violations: Array<{ url: string; size: number }> = []
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      const isSvg =
        record.mimeType === 'image/svg+xml' ||
        record.url.toLowerCase().includes('.svg')
      if (!isSvg) continue
      const size = record.resourceSize ?? 0
      if (size > SVG_SIZE_THRESHOLD) {
        violations.push({ url: record.url, size })
      }
    }

    const count = violations.length
    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0
          ? 'All SVG files appear optimized'
          : `${count} large SVG file(s) detected`,
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
          { key: 'size', label: 'Size (bytes)', valueType: 'bytes' as const },
        ],
        items: violations,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebOptimizeSvg
