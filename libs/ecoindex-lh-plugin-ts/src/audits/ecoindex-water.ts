import * as LH from 'lighthouse/types/lh.js'

import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/calcul-helper.js'

import { Audit } from 'lighthouse'
import type { ScoreDisplayMode } from 'lighthouse/types/lhr/audit-result.js'
import { MetricValue } from '../types/index.js'
import refsURLS from './bp/refs-urls.js'
import commons from './commons.js'

class EcoindexWaterConsumptionAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-water',
      title: 'Water Consumption (cl)',
      failureTitle: 'Water Consumption (cl), your page consumes a lot of water',
      description: `The quantity of water consumed by the page. [See Ecoindex, Environmental footprint](${refsURLS.ecoindex.footprint.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: commons.supportedModes,
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context)
      // console.log('water', ecoIndexScore.water)
      return createValueResult(
        ecoIndexScore as MetricValue,
        'water',
      ) as LH.Audit.Product
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexWaterConsumptionAudit
