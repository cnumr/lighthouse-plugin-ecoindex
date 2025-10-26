/**
 * Ecoindex calculation utilities.
 * Fallback implementation from https://github.com/ecoindex/ecoindex-js
 *
 * NOTE: This is a FALLBACK and is NOT USED by the plugin.
 * The plugin uses the 'ecoindex' npm package instead.
 *
 * @see https://github.com/ecoindex/ecoindex-js
 */
const reference = {
  quantiles: {
    dom_size: [
      0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949,
      1076, 1237, 1459, 1801, 2479, 594601,
    ],
    nb_request: [
      0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170,
      205, 281, 3920,
    ],
    response_size: [
      0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47,
      1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73,
      5400.08, 8037.54, 223212.26,
    ],
  },
  targets: {
    dom_size: 600,
    nb_request: 40,
    response_size: 1024,
  },
  medians: {
    dom_size: 693,
    nb_request: 78,
    response_size: 2420,
  },
  grades: [
    {
      value: 80,
      grade: 'A',
      color: '#349A47',
    },
    {
      value: 70,
      grade: 'B',
      color: '#51B84B',
    },
    {
      value: 55,
      grade: 'C',
      color: '#CADB2A',
    },
    {
      value: 40,
      grade: 'D',
      color: '#F6EB15',
    },
    {
      value: 25,
      grade: 'E',
      color: '#FECD06',
    },
    {
      value: 10,
      grade: 'F',
      color: '#F99839',
    },
    {
      value: 0,
      grade: 'G',
      color: '#ED2124',
    },
  ],
}

/**
 * Get the list of Ecoindex grades (A-G) with their thresholds and colors.
 * Each grade has a minimum value, letter grade, and associated color.
 *
 * @returns Array of grade objects with value, grade, and color properties
 */
export function getEcoIndexGradesList() {
  return reference.grades
}

/**
 * Get the quantile reference data for Ecoindex calculation.
 * Contains percentile thresholds for DOM size, number of requests, and response size.
 * Used to compute the quantile position of a metric value.
 *
 * @returns Object containing arrays of quantiles for DOM, requests, and size metrics
 */
export function getQuantiles(): {
  dom: number[]
  size: number[]
  req: number[]
} {
  return {
    dom: reference.quantiles.dom_size,
    req: reference.quantiles.nb_request,
    size: reference.quantiles.response_size,
  }
}

/**
 * Compute Ecoindex score based on the formula from www.ecoindex.fr.
 * Uses quantile interpolation for DOM size, requests, and response size.
 *
 * Formula: 100 - (5 × (3 × q_dom + 2 × q_req + q_size)) / 6
 * - Weights: DOM (3×), requests (2×), size (1×)
 * - Score range: 0-100 (higher is better)
 *
 * @param dom - Number of elements in DOM
 * @param req - Number of HTTP requests
 * @param size - Total response size in KB
 * @returns Ecoindex score between 0 and 100
 */
export function computeEcoIndex(
  dom: number,
  req: number,
  size: number,
): number {
  const quantiles = getQuantiles()
  const q_dom = computeQuantile(quantiles.dom, dom)
  const q_req = computeQuantile(quantiles.req, req)
  const q_size = computeQuantile(quantiles.size, size)

  return 100 - (5 * (3 * q_dom + 2 * q_req + q_size)) / 6
}

/**
 * Compute quantile index for a given value using linear interpolation.
 * Finds the position of a value within quantile boundaries and interpolates.
 *
 * @param quantiles - Array of quantile boundaries
 * @param value - Value to find quantile position for
 * @returns Interpolated quantile index (decimal)
 */
export function computeQuantile(quantiles: number[], value: number): number {
  for (let i = 1; i < quantiles.length; i++) {
    if (value < quantiles[i])
      return (
        i - 1 + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1])
      )
  }
  return quantiles.length - 1
}

/**
 * Get the letter grade (A-G) associated with an Ecoindex score.
 * Returns false if the score is outside the valid range (0-100).
 *
 * @param ecoIndex - The Ecoindex score (0-100)
 * @returns Letter grade (A-G) or false if invalid
 */
export function getEcoIndexGrade(ecoIndex: number): string | boolean {
  if (ecoIndex < 0 || ecoIndex > 100) {
    return false
  }

  const ecoIndexGrades = getEcoIndexGradesList()
  let name: boolean | string = false,
    i = 0
  do {
    if (ecoIndex > ecoIndexGrades[i].value) {
      name = ecoIndexGrades[i].grade
    }
  } while (name === false && i++ < ecoIndexGrades.length - 1)

  return name
}

/**
 * Calculate greenhouse gas emission (in grams eqCO2) based on Ecoindex score.
 * Formula: 2 + (2 × (50 - ecoIndex)) / 100
 * Higher scores result in lower emissions.
 *
 * @param ecoIndex - The Ecoindex score (0-100)
 * @returns Greenhouse gas emission in grams eqCO2 (formatted to 2 decimal places)
 */
export function computeGreenhouseGasesEmissionfromEcoIndex(
  ecoIndex: number,
): string {
  return (2 + (2 * (50 - ecoIndex)) / 100).toFixed(2)
}

/**
 * Calculate water consumption (in centiliters) based on Ecoindex score.
 * Formula: 3 + (3 × (50 - ecoIndex)) / 100
 * Higher scores result in lower water consumption.
 *
 * @param ecoIndex - The Ecoindex score (0-100)
 * @returns Water consumption in centiliters (formatted to 2 decimal places)
 */
export function computeWaterConsumptionfromEcoIndex(ecoIndex: number): string {
  return (3 + (3 * (50 - ecoIndex)) / 100).toFixed(2)
}
