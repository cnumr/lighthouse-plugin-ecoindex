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

class EcoindexGreenhouseGasEmissionAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-ghg',
      title: 'Greenhouse Gas Emission (eqCO2)',
      failureTitle:
        'Greenhouse Gas Emission (eqCO2), your page generates a lot of greenhouse gas',
      description: `Greenhouse Gas Emission (eqCO2) of your page. [See Ecoindex, Environmental footprint](${refsURLS.ecoindex.footprint.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: commons.supportedModes,
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context)
      // console.log('ghg', ecoIndexScore.ghg)
      return createValueResult(
        ecoIndexScore as MetricValue,
        'ghg',
      ) as LH.Audit.Product
    } catch (error) {
      return createErrorResult(error as Error)
    }
  }
}

export default EcoindexGreenhouseGasEmissionAudit
