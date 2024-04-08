import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import commons from './commons.js'

import { Audit } from 'lighthouse'
import refsURLS from './bp/refs-urls.js'

class EcoindexRequestsAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-requests',
      title: 'Number of requests',
      failureTitle:
        'Number of requests, your page calls too many external resources',
      description: `The number of \`Network.loadingFinished\` logs indicates the number of requests made to external resources. [See Ecoindex, Analysis methodology](${refsURLS.ecoindex.method.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
  }

  static async audit(artifacts, context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context, true)
      // console.log('requests', ecoIndexScore.requests)
      return createValueResult(ecoIndexScore, 'requests', false, true)
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexRequestsAudit
