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
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'Ecoindex revealant metrics.',
  failureTitle: 'Ecoindex, your page could be improved.',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class EcoindexScoreAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-score',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: `The EcoIndex score evaluating the environmental impact of the page. [Learn more about the Ecoindex, Calculating the EcoIndex](${refsURLS.ecoindex.score.en})`,
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: commons.supportedModes,
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context)

      // customLogger(`EcoindexScoreAudit ${ecoIndexScore.score.toString()}`)
      return createValueResult(
        ecoIndexScore as MetricValue,
        'score',
      ) as LH.Audit.Product
    } catch (error) {
      return createErrorResult(error as Error)
    }
  }
}

export default EcoindexScoreAudit
