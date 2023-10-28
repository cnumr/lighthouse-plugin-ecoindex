import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'

class EcoindexGradeAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-grade',
      title: 'Grade',
      failureTitle: 'Grade, your page has a big impact',
      description:
        'Pages should be lightweight in order to be more sustainable.',
      requiredArtifacts: ['DOMStats', 'devtoolsLogs'],
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
  }

  static get metrics() {
    return [
      {
        id: 'dom-size',
        title: 'DOM Size',
        description: 'The size of the DOM in bytes.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'request-count',
        title: 'Request Count',
        description: 'The number of network requests made by the page.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'total-compressed-size',
        title: 'Total Compressed Size',
        description: 'The total size of all compressed responses in bytes.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'eco-index-grade',
        title: 'Ecoindex Grade',
        description:
          'The EcoIndex score evaluating the environmental impact of the page.',
        scoreDisplayMode: 'manual',
      },
    ]
  }

  static async audit(artifacts, context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context)
      console.log('grade', ecoIndexScore.grade)
      return createValueResult(ecoIndexScore, 'grade')
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexGradeAudit
