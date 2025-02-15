import * as path from 'node:path'

import { getEcoIndexGrade } from '../utils/EcoindexJS.js'

/**
 * Convertion base
 */
const base = {
  gesToKm: {
    label:
      'Converting GHGs (expressed in eqCo2) into kilometers traveled in a combustion-powered car',
    coef: 0.216,
    description:
      '(Data > Datasets > 3. Indirect emissions from transport > Passenger transport > Passenger transport - Road > Passenger car > Fleet average - all engines (9) > Average car/engine/2018',
  },
  waterToPack: {
    label:
      'Converting water consumption (expressed in liters) into packs of mineral water of 6 bottles of 1.5 liters',
    coef: 9,
    description:
      'https://www.ecoindex.fr/ecoconception/ecoindex/ecoindex-2-1/#water',
  },
}

/**
 * Converter helper
 * @param string type
 * @param number value
 * @returns
 */
function convert(type, value) {
  switch (type) {
    case 'water-to-pack':
      return Math.round(Number(value) / base.waterToPack.coef)
    case 'ges-to-km':
      return Math.round(Number(value) / base.gesToKm.coef)
    case 'cl-to-l':
      return Number(value).toFixed(2)
    case 'round0':
      return Math.round(Number(value))
    case 'fixed2':
      return Number(value).toFixed(2)
    default:
      console.warn('Converter not found')
      break
  }
}

function convertCourseResults(flows, course) {
  const obj = {
    'course-name': course.name || 'not required',
    'course-target': course.target || 'not required',
    'course-description': course.course || 'not required',
    summary: {},
    pages: [],
  }
  // get pages
  flows.steps.forEach(flow => {
    // 3.1 Add page to course output
    // ommit "snapshot" and "timestamp"
    if (flow.lhr['gatherMode'] === 'navigation')
      obj.pages.push(convertPagesResults(flow.lhr))
  })
  // calculate summary
  obj.summary['eco-index-grade'] = getEcoIndexGrade(
    obj.pages.reduce((a, audit) => a + audit['eco-index-score'], 0) /
      obj.pages.length,
  )
  obj.summary['eco-index-score'] = convert(
    'round0',
    obj.pages.reduce((a, audit) => a + audit['eco-index-score'], 0) /
      obj.pages.length,
  )
  obj.summary['eco-index-water'] = convert(
    'cl-to-l',
    obj.pages.reduce((a, audit) => a + Number(audit['eco-index-water']), 0) /
      obj.pages.length,
  )
  obj.summary['eco-index-water-equivalent'] = convert(
    'water-to-pack',
    obj.pages.reduce((a, audit) => a + Number(audit['eco-index-water']), 0) /
      obj.pages.length,
  )
  obj.summary['eco-index-ghg'] = convert(
    'fixed2',
    obj.pages.reduce((a, audit) => a + Number(audit['eco-index-ghg']), 0) /
      obj.pages.length,
  )
  obj.summary['eco-index-ghg-equivalent'] = convert(
    'ges-to-km',
    obj.pages.reduce((a, audit) => a + Number(audit['eco-index-ghg']), 0) /
      obj.pages.length,
  )

  return obj
}

function convertPagesResults(lhr) {
  const audits = lhr.audits

  return {
    requestedUrl: lhr.requestedUrl,
    'eco-index-grade': audits['eco-index-grade'].numericValue,
    'eco-index-score': convert(
      'round0',
      Number(audits['eco-index-score'].numericValue) * 100,
    ),
    // Émission de GES rapportée à 1 000 utilisateurs (kilos CO2e)
    'eco-index-ghg': convert(
      'fixed2',
      Number(audits['eco-index-ghg'].numericValue),
    ),
    'eco-index-ghg-equivalent': convert(
      'ges-to-km',
      Number(audits['eco-index-ghg'].numericValue),
    ),
    // Consommation d'eau rapportée à 1 000 utilisateurs (en litres)
    'eco-index-water': convert(
      'fixed2',
      Number(audits['eco-index-water'].numericValue) * 10,
    ),
    // Conversion en packs d'eau minérale de 6 bouteilles de 1,5 litre
    'eco-index-water-equivalent': convert(
      'water-to-pack',
      Number(audits['eco-index-water'].numericValue) * 10,
    ),
    'eco-index-nodes': Number(audits['eco-index-nodes'].numericValue),
    'eco-index-size': Number(audits['eco-index-size'].numericValue),
    'eco-index-requests': Number(audits['eco-index-requests'].numericValue),
  }
}

function cleanPath(thePath) {
  return thePath.replace(/\//gm, path.sep)
}

export { cleanPath, convertCourseResults }
