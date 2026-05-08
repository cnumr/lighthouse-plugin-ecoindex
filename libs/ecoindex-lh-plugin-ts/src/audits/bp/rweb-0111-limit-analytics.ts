import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

const ANALYTICS_DOMAINS = [
  'www.google-analytics.com',
  'analytics.google.com',
  'www.googletagmanager.com',
  'script.hotjar.com',
  'static.hotjar.com',
  'cdn.matomo.cloud',
  'cdn.mixpanel.com',
  'api.segment.io',
  'cdn.segment.com',
  'cdn.amplitude.com',
  'js.hs-analytics.net',
  'js.hsforms.net',
]

class BPRweb0111LimitAnalytics extends Audit {
  static get meta() {
    return {
      id: 'rweb-0111-limit-analytics',
      title: 'RWEB_0111 - Limit analytics tools (≤ 1)',
      failureTitle: 'RWEB_0111 - Multiple analytics tools detected',
      description: `Limit analytics tools to one per page. [See RWEB_0111](${refsURLS.rweb.rweb_0111.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const matchedDomains = new Set<string>()
    for (const record of records) {
      for (const domain of ANALYTICS_DOMAINS) {
        if (record.url.includes(domain)) {
          matchedDomains.add(domain)
        }
      }
    }

    const count = matchedDomains.size

    return {
      score: count <= 1 ? 1 : 0,
      displayValue: `${count} analytics tool(s) detected`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRweb0111LimitAnalytics
