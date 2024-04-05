import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'

/**
 * @deprecated use lighthouse-plugin-ecoindex/audits/ecoindex-nodes.js
 */
class LighthouseNodesAudit extends Audit {
  static get meta() {
    return {
      id: 'lighthouse-nodes',
      title: 'LH DOM elements (nodes)',
      failureTitle: 'LH DOM elements (nodes), your page is too complex',
      description:
        'Pages should be lightweight in order to be more sustainable.',
      // desabled because we don't need to run this audit if we don't have the NodesMinusSvgsGatherer
      requiredArtifacts: [
        'MainDocumentContent',
        'DOMStats',
        'devtoolsLogs',
        'URL',
        'settings',
        'DOMInformations',
      ],

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
    if (artifacts['NodesMinusSvgsGatherer']) {
      return { score: null, notApplicable: true }
    }
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context, true)
      // console.log('nodes', ecoIndexScore.nodes)
      return createValueResult(ecoIndexScore, 'nodes', false, true)
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default LighthouseNodesAudit
