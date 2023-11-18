import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'
import refCnumr from './bp/ref-cnumr.js'

class EcoindexRequestsAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-requests',
      title: 'Number of requests',
      failureTitle:
        'Number of requests, your page calls too many external resources',
      description: `The number of \`Network.loadingFinished\` logs indicates the number of requests made to external resources. [See Ecoindex, Analysis methodology](${refCnumr.ecoindex_method.en})`,
      requiredArtifacts: ['MainDocumentContent', 'DOMStats', 'devtoolsLogs'],
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
  }

  // static get metrics() {
  //   return [
  //     {
  //       id: 'dom-size',
  //       title: 'DOM Size',
  //       description: 'The size of the DOM in bytes.',
  //       scoreDisplayMode: 'numeric',
  //     },
  //     {
  //       id: 'request-count',
  //       title: 'Request Count',
  //       description: 'The number of network requests made by the page.',
  //       scoreDisplayMode: 'numeric',
  //     },
  //     {
  //       id: 'total-compressed-size',
  //       title: 'Total Compressed Size',
  //       description: 'The total size of all compressed responses in bytes.',
  //       scoreDisplayMode: 'numeric',
  //     },
  //     {
  //       id: 'eco-index-requests',
  //       title: 'Number of requests',
  //       description:
  //         'The EcoIndex score evaluating the environmental impact of the page.',
  //       scoreDisplayMode: 'numeric',
  //     },
  //   ]
  // }

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
