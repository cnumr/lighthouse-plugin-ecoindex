import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'

const STATIC_RESOURCE_TYPES = ['Image', 'Stylesheet', 'Script', 'Font']

class BPRweb0081NoCookieOnStatic extends Audit {
  static get meta() {
    return {
      id: 'rweb-0081-no-cookie-on-static',
      title: 'RWEB_0081 - No cookies on static resources',
      failureTitle: 'RWEB_0081 - Cookies detected on static resources',
      description: `Avoid sending cookies with static resources (images, CSS, JS, fonts). [See RWEB_0081](${refsURLS.rweb.rweb_0081.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const networkRecords = await NetworkRecords.request(
      artifacts.DevtoolsLog,
      context,
    )

    // Count static resources loaded
    const staticResources = networkRecords.filter(record => {
      if (NetworkRequest.isNonNetworkRequest(record)) return false
      return STATIC_RESOURCE_TYPES.includes(record.resourceType)
    }).length

    // Informational audit: cannot automatically verify request cookies via DevtoolsLog
    // Score is always 1 (informational - audit cannot be automatically verified)
    return {
      score: 1,
      notApplicable: false,
      displayValue: `Manual check required: ${staticResources} static resource(s) loaded. Verify no cookies sent with these requests.`,
      numericValue: staticResources,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRweb0081NoCookieOnStatic
