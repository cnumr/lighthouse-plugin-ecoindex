import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'

class EcoindexNodesAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-nodes',
      title: 'Ecoindex DOM elements (nodes)',
      failureTitle: 'Ecoindex DOM elements (nodes), your page is too complex',
      description: 'The number of HTML elements in the DOM.',
      requiredArtifacts: ['NodesMinusSvgsGatherer', 'devtoolsLogs'],
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
        id: 'eco-index-nodes',
        title: 'DOM elements',
        description:
          'The EcoIndex score evaluating the environmental impact of the page.',
        scoreDisplayMode: 'numeric',
      },
    ]
  }

  static async audit(artifacts, context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context, true)
      // console.log('nodes', ecoIndexScore.nodes)
      return createValueResult(ecoIndexScore, 'nodes', false, true)
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexNodesAudit
