import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const REDIRECT_STATUSES = [301, 302, 307, 308]
const MAX_REDIRECTS = 1

const UIStrings = {
  title: 'RWEB_0112 - Avoid HTTP redirects (≤ 1)',
  failureTitle: 'RWEB_0112 - Too many HTTP redirects (> 1)',
  description:
    'Reduce HTTP redirects to avoid unnecessary round trips. [See RWEB_0112](https://rweb.greenit.fr/en/fiches/RWEB_0112-avoir-redirections)',
  displayValue: '{count} redirect(s)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoRedirects extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-redirects',
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

    const redirects = records.filter(r =>
      REDIRECT_STATUSES.includes(r.statusCode),
    )

    return {
      score: redirects.length <= MAX_REDIRECTS ? 1 : 0,
      displayValue: str_(UIStrings.displayValue, { count: redirects.length }),
      numericValue: redirects.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebNoRedirects
