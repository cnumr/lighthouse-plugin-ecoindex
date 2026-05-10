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
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'Water Consumption.',
  failureTitle: 'Water Consumption, your page consumes a lot of water.',
  description:
    'The quantity of water consumed by the page. [Learn more about the Ecoindex, Environmental footprint](https://www.ecoindex.fr/comment-ca-marche/#lempreinte-environnementale)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class EcoindexWaterConsumptionAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-water',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
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
      return createErrorResult(error as Error)
    }
  }
}

export default EcoindexWaterConsumptionAudit
