import * as LH from 'lighthouse/types/lh.js'

import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/calcul-helper.js'

import { Audit } from 'lighthouse'
import type { ScoreDisplayMode } from 'lighthouse/types/lhr/audit-result.js'
import { MetricValue } from '../types/index.js'
import refsURLS from './bp/refs-urls.js'
import commons from './commons.js'

class EcoindexRequestsAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-requests',
      title: 'Number of requests',
      failureTitle:
        'Number of requests, your page calls too many external resources',
      description: `The number of \`Network.loadingFinished\` logs indicates the number of requests made to external resources. [See Ecoindex, Analysis methodology](${refsURLS.ecoindex.method.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: commons.supportedModes,
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context, true)
      // console.log('requests', ecoIndexScore.requests)
      return createValueResult(
        ecoIndexScore as MetricValue,
        'requests',
      ) as LH.Audit.Product
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexRequestsAudit
