import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'

class EcoindexWaterConsumptionAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-water',
      title: 'Water Consumption (cl)',
      failureTitle: 'Water Consumption (cl), your page consumes a lot of water',
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
        id: 'eco-index-water',
        title: 'Water Consumption',
        description:
          'The EcoIndex score evaluating the environmental impact of the page.',
        scoreDisplayMode: 'numeric',
      },
    ]
  }

  static async audit(artifacts, context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context)
      // console.log('water', ecoIndexScore.water)
      return createValueResult(ecoIndexScore, 'water')
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexWaterConsumptionAudit
