import * as LH from 'lighthouse/types/lh.js'

import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/calcul-helper.js'

import { Audit } from 'lighthouse'
import { MetricValue } from '../types/index.js'
import { extractNetworkMetrics } from '../utils/network-metrics.js'
import type { ScoreDisplayMode } from 'lighthouse/types/lhr/audit-result.js'
import commons from './commons.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'Page size.',
  failureTitle: 'Page size, your page is too heavy.',
  description:
    'The sum of all the `encodedDataLengths` of these same requests + the html size of the page itself calculates the page weight. [Learn more about the Ecoindex, Analysis methodology](https://www.ecoindex.fr/comment-ca-marche/#m%C3%A9thodologie-danalyse)',
}
const str_ = createIcuMessageFn('audits/ecoindex-size.js', UIStrings)

class EcoindexSizeAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-size',
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
      const ecoIndexScore = await getLoadingExperience(artifacts, context, true)
      const { filteredRecords } = await extractNetworkMetrics(
        artifacts,
        context,
      )
      return createValueResult(
        ecoIndexScore as MetricValue,
        'size',
        filteredRecords,
      ) as LH.Audit.Product
    } catch (error) {
      return createErrorResult(error as Error)
    }
  }
}

export default EcoindexSizeAudit
