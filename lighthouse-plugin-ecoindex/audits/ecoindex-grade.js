import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'
import refsURLS from './bp/refs-urls.js'

class EcoindexGradeAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-grade',
      title: 'Grade',
      failureTitle: 'Grade, your page has a big impact',
      description: `The EcoIndex score evaluating the environmental impact of the page. [See Ecoindex, Calculating the score](${refsURLS.ecoindex.grade.en})`,
      requiredArtifacts: ['MainDocumentContent', 'DOMStats', 'devtoolsLogs'],
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
  }

  static async audit(artifacts, context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context)
      // console.log('grade', ecoIndexScore.grade)
      return createValueResult(ecoIndexScore, 'grade')
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexGradeAudit
