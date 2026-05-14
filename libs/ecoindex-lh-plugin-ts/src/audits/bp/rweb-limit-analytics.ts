import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

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
const UIStrings = {
  title: 'RWEB_0111 - Limit analytics tools (≤ 1)',
  failureTitle: 'RWEB_0111 - Multiple analytics tools detected',
  description:
    'Limit analytics tools to one per page. [See RWEB_0111](https://rweb.greenit.fr/es/fiches/RWEB_0111-limitar-las-herramientas-de-analisis-y-los-datos-recopilados)',
  displayValue: '{count} analytics tool(s) detected',
}
const str_ = createIcuMessageFn('audits/bp/rweb-limit-analytics.js', UIStrings)

class BPRwebLimitAnalytics extends Audit {
  static get meta() {
    return {
      id: 'rweb-limit-analytics',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
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
      displayValue: str_(UIStrings.displayValue, { count }),
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebLimitAnalytics
