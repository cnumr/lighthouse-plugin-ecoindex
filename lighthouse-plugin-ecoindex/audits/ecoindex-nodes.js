import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'
import refsURLS from './bp/refs-urls.js'

class EcoindexNodesAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-nodes',
      title: 'Ecoindex DOM elements (nodes)',
      failureTitle: 'Ecoindex DOM elements (nodes), your page is too complex',
      description: `Explication: Counting all the DOM nodes on the page, excluding the child nodes of \`svg\` elements, gives us the number of DOM elements on the page. This method encourages you not to replace a complex svg with an image, simply to obtain a better score. [See Ecoindex, Analysis methodology](${refsURLS.ecoindex.method.en})`,
      requiredArtifacts: ['MainDocumentContent', 'DOMStats', 'devtoolsLogs'],
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
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
