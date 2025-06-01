import * as LH from 'lighthouse/types/lh.js'

import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/calcul-helper.js'

import { Audit } from 'lighthouse'
import { MetricValue } from '../types/index.js'
import type { ScoreDisplayMode } from 'lighthouse/types/lhr/audit-result.js'
import commons from './commons.js'
import refsURLS from './bp/refs-urls.js'

class EcoindexNodesAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-nodes',
      title: 'Ecoindex DOM elements',
      failureTitle: 'Ecoindex DOM elements, your page is too complex',
      description: `Explication: Counting all the DOM nodes on the page, excluding the child nodes of \`svg\` elements, gives us the number of DOM elements on the page. This method encourages you not to replace a complex svg with an image, simply to obtain a better score. [Learn more about the Ecoindex, Analysis methodology](${refsURLS.ecoindex.method.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: commons.supportedModes,
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context, true)
      // console.log('nodes', ecoIndexScore.nodes)
      return createValueResult(
        ecoIndexScore as MetricValue,
        'nodes',
      ) as LH.Audit.Product
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexNodesAudit
