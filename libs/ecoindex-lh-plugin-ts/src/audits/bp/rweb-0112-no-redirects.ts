import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import refsURLS from './refs-urls.js'

const REDIRECT_STATUSES = [301, 302, 307, 308]
const MAX_REDIRECTS = 1

class BPRweb0112NoRedirects extends Audit {
  static get meta() {
    return {
      id: 'rweb-0112-no-redirects',
      title: `RWEB_0112 - Avoid HTTP redirects (≤ ${MAX_REDIRECTS})`,
      failureTitle: `RWEB_0112 - Too many HTTP redirects (> ${MAX_REDIRECTS})`,
      description: `Reduce HTTP redirects to avoid unnecessary round trips. [See RWEB_0112](${refsURLS.rweb.rweb_0112.en})`,
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
      displayValue: `${redirects.length} redirect(s)`,
      numericValue: redirects.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRweb0112NoRedirects
