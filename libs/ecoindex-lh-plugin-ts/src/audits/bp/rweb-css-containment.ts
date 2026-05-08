import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'

class BPRwebCssContainment extends Audit {
  static get meta() {
    return {
      id: 'rweb-css-containment',
      title: 'RWEB_0039 - Use CSS containment',
      failureTitle: 'RWEB_0039 - CSS containment not verified',
      description: `Use CSS containment property to optimize rendering performance. [See RWEB_0039](${refsURLS.rweb.rweb_0039.en})`,
      scoreDisplayMode: 'manual' as LH.Audit.ScoreDisplayMode,
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const networkRecords = await NetworkRecords.request(
      artifacts.DevtoolsLog,
      context,
    )

    // Check if any CSS resources are loaded
    const cssResources = networkRecords.filter(record => {
      if (NetworkRequest.isNonNetworkRequest(record)) return false
      const contentType = record.mimeType?.toLowerCase() || ''
      const isCSSByMime = contentType.includes('text/css')
      const isCSSByUrl = record.url.toLowerCase().endsWith('.css')
      return isCSSByMime || isCSSByUrl
    })

    // Informational audit: cannot automatically verify CSS property content via DevtoolsLog
    // Score is null (not applicable for automatic scoring)
    return {
      score: null as number | null,
      displayValue: `${cssResources.length} CSS file(s) loaded — verify 'contain' property usage manually.`,
      numericValue: cssResources.length,
      numericUnit: 'unitless' as 'unitless' | 'byte' | 'millisecond' | 'element',
    }
  }
}

export default BPRwebCssContainment
