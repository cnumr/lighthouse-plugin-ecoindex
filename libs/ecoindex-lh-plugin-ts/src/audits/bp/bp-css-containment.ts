import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'CSS files loaded — manual containment review',
  failureTitle: 'CSS containment requires manual review',
  description:
    'This audit counts CSS files loaded. It cannot automatically verify the CSS `contain` property (RWEB_0039 requires CDP introspection). Review your stylesheets manually to ensure key layout elements use `contain: layout` or `contain: paint`.',
  displayValue:
    "{count} CSS file(s) loaded — verify 'contain' property usage manually.",
}
const str_ = createIcuMessageFn('audits/bp/bp-css-containment.js', UIStrings)

class BPRwebCssContainment extends Audit {
  static get meta() {
    return {
      id: 'bp-css-containment',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
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
      displayValue: str_(UIStrings.displayValue, {
        count: cssResources.length,
      }),
      numericValue: cssResources.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebCssContainment
