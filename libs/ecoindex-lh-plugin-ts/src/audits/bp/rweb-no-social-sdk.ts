import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

// platform.twitter.com reste actif après le rebranding X ; platform.x.com ajouté par précaution
const SOCIAL_SDK_DOMAINS = [
  'connect.facebook.net',
  'platform.twitter.com',
  'platform.x.com',
  'platform.linkedin.com',
  'apis.google.com',
  'platform.instagram.com',
]
const UIStrings = {
  title: 'RWEB_0059 - No official social network buttons',
  failureTitle: 'RWEB_0059 - Official social network SDK detected',
  description:
    'Replace official social network buttons with static links to reduce third-party requests. [See RWEB_0059](https://rweb.greenit.fr/en/fiches/RWEB_0059-replace-the-official-social-network-sharing-buttons)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoSocialSdk extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-social-sdk',
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

    const sdkRequests = records.filter(r =>
      SOCIAL_SDK_DOMAINS.some(domain => r.url.includes(domain)),
    )

    return {
      score: sdkRequests.length === 0 ? 1 : 0,
      displayValue: `${sdkRequests.length} social SDK request(s) detected`,
      numericValue: sdkRequests.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebNoSocialSdk
