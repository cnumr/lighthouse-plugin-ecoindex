import {
createErrorResult,
createValueResult,
getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'
import refsURLS from './bp/refs-urls.js'

class EcoindexGreenhouseGasEmissionAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-ghg',
      title: 'Greenhouse Gas Emission (eqCO2)',
      failureTitle:
        'Greenhouse Gas Emission (eqCO2), your page generates a lot of greenhouse gas',
      description: `Greenhouse Gas Emission (eqCO2) of your page. [See Ecoindex, Environmental footprint](${refsURLS.ecoindex.footprint.en})`,
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
      // console.log('ghg', ecoIndexScore.ghg)
      return createValueResult(ecoIndexScore, 'ghg')
    } catch (error) {
      createErrorResult(error)
    }
  }
}

export default EcoindexGreenhouseGasEmissionAudit
