import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'

class EcoindexSizeAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-size',
      title: 'Page size in Megaoctets',
      failureTitle: 'Page size in Megaoctets, your page is too heavy',
      description: 'The total size of all assets and page, in bytes.',
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
        id: 'eco-index-size',
        title: 'Page size in Megaoctets',
        description: 'The total size of all assets and page, in bytes.',
        scoreDisplayMode: 'numeric',
      },
    ]
  }

  static async audit(artifacts, context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context, true)
      // console.log('size', ecoIndexScore.size)
      return createValueResult(ecoIndexScore, 'size')
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexSizeAudit
