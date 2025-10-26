import type * as LH from 'lighthouse/types/lh.js'

import type {
  DOMInformationsArtifacts,
  EcoindexResults,
  MetricValue,
} from '../types/index.js'
import {
  computeEcoIndex,
  computeGreenhouseGasesEmissionfromEcoIndex,
  computeWaterConsumptionfromEcoIndex,
  getEcoIndexGrade,
} from 'ecoindex'
import { extractDOMSize, extractNetworkMetrics } from './network-metrics.js'
import {
  formatMetric,
  getMetricNumericUnit,
  normalizeMetricValue,
} from './format-helper.js'

import { createInformationsTable } from './table-helper.js'
import { getScoreForMetric } from './score-helper.js'

/**
 * Calculate the number of DOM elements without SVGs content.
 *
 * @param artifacts - Lighthouse artifacts containing DOM informations
 * @returns Number of DOM elements (excluding SVG children)
 */
export async function getEcoindexNodes(
  artifacts: LH.Artifacts & DOMInformationsArtifacts,
): Promise<number> {
  return extractDOMSize(artifacts)
}

/**
 * Get loading experience metrics from Lighthouse artifacts.
 * Calculates Ecoindex score based on DOM size, request count, and total compressed size.
 *
 * @param artifacts - Lighthouse artifacts
 * @param context - Lighthouse audit context
 * @param isTechnical - If true, returns raw technical values instead of Ecoindex score
 * @returns Either raw metric values or computed Ecoindex results
 */
export async function getLoadingExperience(
  artifacts: DOMInformationsArtifacts | LH.Artifacts,
  context: LH.Audit.Context,
  isTechnical = false,
): Promise<MetricValue | EcoindexResults> {
  // Extract DOM size
  const domSize = await extractDOMSize(artifacts as DOMInformationsArtifacts)

  // Extract network metrics (request count, total compressed size)
  const networkMetrics = await extractNetworkMetrics(artifacts, context)

  // Return technical values if requested
  if (isTechnical) {
    const result: MetricValue = {
      nodes: domSize,
      requests: networkMetrics.requestCount,
      size: networkMetrics.totalByteWeight,
    }
    return result
  }

  // Calculate Ecoindex score
  return computeEcoindexResults(
    domSize,
    networkMetrics.requestCount,
    networkMetrics.totalCompressedSize,
  )
}

/**
 * Create an audit result from metric values.
 * Calculates score, formats display value, and creates information table.
 *
 * @param metricValue - Raw metric values
 * @param metric - Name of the metric to process
 * @returns Audit result with score, display value, and details
 */
export function createValueResult(metricValue: MetricValue, metric: string) {
  let numericValue: number | undefined
  let score: number | undefined

  // Get numeric value and calculate score based on metric type
  switch (metric) {
    case 'grade':
      numericValue = metricValue[metric] as number
      score = getScoreForMetric(metric, metricValue['score'] as number)
      break

    case 'nodes':
    case 'size':
    case 'requests':
      numericValue = metricValue[metric] as number
      score = getScoreForMetric(metric, metricValue[metric] as number)
      break

    default:
      numericValue = normalizeMetricValue(metric, metricValue[metric])
      score = getScoreForMetric(metric, metricValue[metric] as number)
      break
  }

  return {
    numericValue: numericValue,
    score: score,
    numericUnit: getMetricNumericUnit(metric),
    displayValue: formatMetric(metric, metricValue[metric]),
    details: createInformationsTable(metric, metricValue[metric]),
  }
}

/**
 * Create an error result for audit failures.
 *
 * @param err - Error that occurred during audit
 * @returns Audit result with error message
 */
export function createErrorResult(err: Error) {
  console.log(err)
  return {
    score: -1,
    errorMessage: err.toString(),
  }
}

/**
 * Compute Ecoindex results based on DOM size, request count, and total compressed size.
 *
 * @param domSize - Number of DOM elements
 * @param requestCount - Number of HTTP requests
 * @param totalCompressedSize - Total page size in bytes
 * @returns Computed Ecoindex results (score, grade, water, ghg)
 */
function computeEcoindexResults(
  domSize: number,
  requestCount: number,
  totalCompressedSize: number,
): EcoindexResults {
  const _ecoindex = computeEcoIndex(
    domSize,
    requestCount,
    totalCompressedSize / 1000, // Convert bytes to KB
  )

  const value: EcoindexResults = {
    score: _ecoindex,
    grade: getEcoIndexGrade(_ecoindex),
    water: computeWaterConsumptionfromEcoIndex(_ecoindex),
    ghg: computeGreenhouseGasesEmissionfromEcoIndex(_ecoindex),
  }

  return value
}
