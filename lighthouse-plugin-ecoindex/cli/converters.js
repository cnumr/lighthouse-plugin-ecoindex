import { getEcoIndexGrade } from 'ecoindex'

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
}

/**
 * Convert GHGs (expressed in eqCo2) into kilometers traveled in a combustion-powered car
 * @param number ges
 * @returns number
 */
const gesToKm = ges => {
  return ges * base.gesToKm.coef
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
    obj.pages.push(convertPagesResults(flow.lhr))
  })
  // calculate summary
  obj.summary['eco-index-grade'] = getEcoIndexGrade(
    obj.pages.reduce((a, audit) => a + audit['eco-index-score'], 0) /
      obj.pages.length,
  )
  obj.summary['eco-index-score'] = Math.round(
    obj.pages.reduce((a, audit) => a + audit['eco-index-score'], 0) /
      obj.pages.length,
  )
  obj.summary['eco-index-water'] = (
    (obj.pages.reduce((a, audit) => a + audit['eco-index-water'], 0) /
      obj.pages.length) *
    10
  ).toFixed(2)
  obj.summary['eco-index-water-equivalent'] = Math.round(
    ((obj.pages.reduce((a, audit) => a + audit['eco-index-water'], 0) /
      obj.pages.length) *
      10) /
      9,
  )
  obj.summary['eco-index-ghg'] = (
    obj.pages.reduce((a, audit) => a + audit['eco-index-ghg'], 0) /
    obj.pages.length
  ).toFixed(2)
  obj.summary['eco-index-ghg-equivalent'] = Math.round(
    gesToKm(
      obj.pages.reduce((a, audit) => a + audit['eco-index-ghg'], 0) /
        obj.pages.length,
    ),
  )

  return obj
}

function convertPagesResults(lhr) {
  const audits = lhr.audits

  return {
    requestedUrl: lhr.requestedUrl,
    'eco-index-grade': audits['eco-index-grade'].numericValue,
    'eco-index-score': Math.round(
      Number(audits['eco-index-score'].numericValue) * 100,
      2,
    ),
    'eco-index-ghg': Number(audits['eco-index-ghg'].numericValue),
    'eco-index-water': Number(audits['eco-index-water'].numericValue),
    'eco-index-nodes': Number(audits['eco-index-nodes'].numericValue),
    'eco-index-size': Number(audits['eco-index-size'].numericValue),
    'eco-index-requests': Number(audits['eco-index-requests'].numericValue),
  }
}

export { convertCourseResults }
