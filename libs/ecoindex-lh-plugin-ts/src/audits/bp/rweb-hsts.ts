import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0084 - Enable HSTS header',
  failureTitle: 'RWEB_0084 - HSTS header missing',
  description:
    'Enable HSTS (HTTP Strict-Transport-Security) header to enforce HTTPS. [See RWEB_0084](https://rweb.greenit.fr/en/fiches/RWEB_0084-favor-hsts-preload-list-over-301-redirects)',
  displayValuePass: 'HSTS header is present',
  displayValueFail: 'HSTS header is missing',
}
const str_ = createIcuMessageFn('audits/bp/rweb-hsts.js', UIStrings)

class BPRwebHsts extends Audit {
  static get meta() {
    return {
      id: 'rweb-hsts',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const networkRecords = await NetworkRecords.request(
      artifacts.DevtoolsLog,
      context,
    )

    // Find the main document response
    const mainDocument = networkRecords.find(r => r.resourceType === 'Document')

    let hasHSTS = false
    if (mainDocument?.responseHeaders) {
      hasHSTS = mainDocument.responseHeaders.some(
        h => h.name.toLowerCase() === 'strict-transport-security',
      )
    }

    return {
      score: hasHSTS ? 1 : 0,
      displayValue: hasHSTS
        ? str_(UIStrings.displayValuePass)
        : str_(UIStrings.displayValueFail),
      numericValue: hasHSTS ? 1 : 0,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebHsts
