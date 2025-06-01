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

class EcoindexSizeAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-size',
      title: 'Page size',
      failureTitle: 'Page size, your page is too heavy',
      description: `The sum of all the \`encodedDataLengths\` of these same requests + the html size of the page itself calculates the page weight. [Learn more about the Ecoindex, Analysis methodology](${refsURLS.ecoindex.method.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: commons.supportedModes,
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context, true)
      // console.log('size', ecoIndexScore.size)
      return createValueResult(
        ecoIndexScore as MetricValue,
        'size',
      ) as LH.Audit.Product
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexSizeAudit
