import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'

const TEXT_TYPES = new Set(['Document', 'Stylesheet', 'Script'])
const ENCODING_PATTERN = /gzip|br|deflate|zstd/i

class BPRwebHttpCompression extends Audit {
  static get meta() {
    return {
      id: 'rweb-http-compression',
      title: 'RWEB_0076 - Compress text resources (≥ 95%)',
      failureTitle: 'RWEB_0076 - Text resources not compressed',
      description: `Enable gzip/brotli compression for HTML, CSS and JS resources. [See RWEB_0076](${refsURLS.rweb.rweb_0076.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    let total = 0
    const uncompressed: string[] = []
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (!TEXT_TYPES.has(record.resourceType ?? '')) continue
      total++
      const encoding = record.responseHeaders?.find(
        h => h.name.toLowerCase() === 'content-encoding',
      )?.value
      if (!encoding || !ENCODING_PATTERN.test(encoding)) {
        uncompressed.push(record.url)
      }
    }

    const compressed = total - uncompressed.length

    if (total === 0) {
      return {
        score: 1,
        displayValue: 'No text resources to check',
        numericValue: 1,
        numericUnit: 'unitless' as
          | 'unitless'
          | 'byte'
          | 'millisecond'
          | 'element',
        details: {
          type: 'table' as const,
          headings: [{ key: 'url', label: 'URL', valueType: 'url' as const }],
          items: [],
        } as LH.Audit.Details.Table,
      }
    }

    const ratio = compressed / total
    return {
      score: ratio >= 0.95 ? 1 : 0,
      displayValue: `${compressed}/${total} text resources compressed (${Math.round(ratio * 100)}%)`,
      numericValue: compressed,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          { key: 'url', label: 'Uncompressed URL', valueType: 'url' as const },
        ],
        items: uncompressed.map(url => ({ url })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebHttpCompression
