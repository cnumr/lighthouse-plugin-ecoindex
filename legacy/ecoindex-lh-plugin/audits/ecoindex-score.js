import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'
import refsURLS from './bp/refs-urls.js'
import commons from './commons.js'

class EcoindexScoreAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-score',
      title: 'Ecoindex revealant metrics',
      failureTitle: 'Ecoindex, your page has an impact',
      description: `The EcoIndex score evaluating the environmental impact of the page. [See Ecoindex, Calculating the EcoIndex](${refsURLS.ecoindex.score.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
  }

  static async audit(artifacts, context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context)

      // console.log('score', ecoIndexScore.score)
      return createValueResult(ecoIndexScore, 'score')
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexScoreAudit
