import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'
import refsURLS from './bp/refs-urls.js'

class EcoindexWaterConsumptionAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-water',
      title: 'Water Consumption (cl)',
      failureTitle: 'Water Consumption (cl), your page consumes a lot of water',
      description: `The quantity of water consumed by the page. [See Ecoindex, Environmental footprint](${refsURLS.ecoindex.footprint.en})`,
      requiredArtifacts: [
        'MainDocumentContent',
        'DOMStats',
        'devtoolsLogs',
        'URL',
        'settings',
        'DOMInformations',
      ],
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
  }

  static async audit(artifacts, context) {
    try {
      const ecoIndexScore = await getLoadingExperience(artifacts, context)
      // console.log('water', ecoIndexScore.water)
      return createValueResult(ecoIndexScore, 'water')
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexWaterConsumptionAudit
