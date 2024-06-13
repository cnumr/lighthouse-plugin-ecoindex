import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'
import commons from './commons.js'
import refsURLS from './bp/refs-urls.js'

class EcoindexSizeAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-size',
      title: 'Page size in kilobytes',
      failureTitle: 'Page size in kilobytes, your page is too heavy',
      description: `The sum of all the \`encodedDataLengths\` of these same requests + the html size of the page itself calculates the page weight. [See Ecoindex, Analysis methodology](${refsURLS.ecoindex.method.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
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
