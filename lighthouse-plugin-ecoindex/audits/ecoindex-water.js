import {
  createErrorResult,
  createValueResult,
  getLoadingExperience,
} from '../utils/index.js'

import { Audit } from 'lighthouse'
import refCnumr from './bp/ref-cnumr.js'

class EcoindexWaterConsumptionAudit extends Audit {
  static get meta() {
    return {
      id: 'eco-index-water',
      title: 'Water Consumption (cl)',
      failureTitle: 'Water Consumption (cl), your page consumes a lot of water',
      description: `The quantity of water consumed by the page. [See Ecoindex, Environmental footprint](${refCnumr.ecoindex_footprint.en})`,
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
  //       id: 'eco-index-water',
  //       title: 'Water Consumption',
  //       description: 'The quantity of water consumed by the page.',
  //       scoreDisplayMode: 'numeric',
  //     },
  //   ]
  // }

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
