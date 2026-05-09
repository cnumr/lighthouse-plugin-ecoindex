import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

class BPRwebHsts extends Audit {
  static get meta() {
    return {
      id: 'rweb-hsts',
      title: 'RWEB_0084 - Enable HSTS header',
      failureTitle: 'RWEB_0084 - HSTS header missing',
      description: `Enable HSTS (HTTP Strict-Transport-Security) header to enforce HTTPS. [See RWEB_0084](${refsURLS.rweb.rweb_0084.en})`,
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
        ? 'HSTS header is present'
        : 'HSTS header is missing',
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
