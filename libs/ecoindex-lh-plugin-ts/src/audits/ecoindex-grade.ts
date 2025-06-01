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

class EcoindexGradeAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-grade',
      title: 'Grade',
      failureTitle: 'Grade, your page has a big impact',
      description: `The EcoIndex score evaluating the environmental impact of the page. [Learn more about the Ecoindex, Calculating the score](${refsURLS.ecoindex.grade.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: commons.supportedModes,
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context)
      return createValueResult(
        ecoIndexScore as MetricValue,
        'grade',
      ) as LH.Audit.Product
    } catch (error) {
      return createErrorResult(error)
    }
  }
}

export default EcoindexGradeAudit
