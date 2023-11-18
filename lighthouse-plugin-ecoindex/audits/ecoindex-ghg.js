import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'
import refCnumr from './bp/ref-cnumr.js'

class EcoindexGreenhouseGasEmissionAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-ghg',
      title: 'Greenhouse Gas Emission (eqCO2)',
      failureTitle:
        'Greenhouse Gas Emission (eqCO2), your page generates a lot of greenhouse gas',
      description: `Greenhouse Gas Emission (eqCO2) of your page. [See Ecoindex, Environmental footprint](${refCnumr.ecoindex_footprint.en})`,
      requiredArtifacts: ['MainDocumentContent', 'DOMStats', 'devtoolsLogs'],
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
  }

  // static get metrics() {
  //   return [
  //     {
  //       id: 'dom-size',
  //       title: 'DOM Size',
  //       description: 'The size of the DOM in bytes.',
  //       scoreDisplayMode: 'numeric',
  //     },
  //     {
  //       id: 'request-count',
  //       title: 'Request Count',
  //       description: 'The number of network requests made by the page.',
  //       scoreDisplayMode: 'numeric',
  //     },
  //     {
  //       id: 'total-compressed-size',
  //       title: 'Total Compressed Size',
  //       description: 'The total size of all compressed responses in bytes.',
  //       scoreDisplayMode: 'numeric',
  //     },
  //     {
  //       id: 'eco-index-ghg',
  //       title: 'Greenhouse Gas Emission',
  //       description: 'Greenhouse Gas Emission (eqCO2) of your page.',
  //       scoreDisplayMode: 'numeric',
  //     },
  //   ]
  // }

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
