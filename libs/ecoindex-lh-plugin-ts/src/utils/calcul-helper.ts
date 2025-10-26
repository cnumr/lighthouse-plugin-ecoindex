import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import type {
  DOMInformationsArtifacts,
  EcoindexResults,
  MetricValue,
  Range,
} from '../types/index.js'
import {
  computeEcoIndex,
  computeGreenhouseGasesEmissionfromEcoIndex,
  computeWaterConsumptionfromEcoIndex,
  getEcoIndexGrade,
} from 'ecoindex'

import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import TotalByteWeight from 'lighthouse/core/audits/byte-efficiency/total-byte-weight.js'
import round from 'lodash.round'

export const B_TO_KB = 1000

/**
 * Calculate the number of DOM elements without SVGs content.
 * @param {Artifacts} artifacts
 * @returns number
 */
export async function getEcoindexNodes(
  artifacts: LH.Artifacts & DOMInformationsArtifacts,
) {
  const domInformations = artifacts.DOMInformations
  // console.debug(`domInformations`, domInformations)
  return domInformations.nodesBodyWithoutSVGChildsCount
}

export async function getLoadingExperience(
  artifacts: DOMInformationsArtifacts | LH.Artifacts,
  context: LH.Audit.Context,
  isTechnical = false,
): Promise<MetricValue | EcoindexResults> {
  const domSize = await getEcoindexNodes(artifacts as DOMInformationsArtifacts)

  // In Lighthouse 13+, devtoolsLogs (plural) has been replaced by DevtoolsLog (singular, capital D)
  // See https://github.com/GoogleChrome/lighthouse/issues/15306
  // DevtoolsLog is guaranteed to be available since it's in requiredArtifacts
  const devtoolsLog = artifacts.DevtoolsLog

  // Get network records from the devtools log using NetworkRecords computed artifact
  const records = await NetworkRecords.request(devtoolsLog, context)

  const { numericValue: totalByteWeight, details: totalByteDetails } =
    await TotalByteWeight.audit(artifacts, context)

  // Calculate total compressed size and request count from network records
  let totalCompressedSize = 0
  let requestCount = 0
  records.forEach(record => {
    // Exclude non-network URIs since their size is reflected in other resources.
    // Exclude records without transfer size information (or 0 bytes which won't matter anyway).
    if (NetworkRequest.isNonNetworkRequest(record) || !record.transferSize)
      return

    const result = {
      url: record.url,
      totalBytes: record.transferSize,
    }

    totalCompressedSize += result.totalBytes
    requestCount += 1
  })

  // console.log(`totalByteWeight`, totalByteWeight)
  // console.log(`{totalCompressedSize kB:${totalCompressedSize * 0.001}},`)
  // console.log(`{totalCompressedSize MB:${totalCompressedSize * 0.000001}},`)

  // console.log(`{domSize:${domSize}},`)
  // console.log(`{size:${totalCompressedSize}},`)
  // console.log(`{requests:${requestCount}},`)
  if (isTechnical) {
    return {
      nodes: domSize,
      requests: requestCount,
      size: totalByteWeight,
      sizeDetails: totalByteDetails,
    }
  }
  const ecoIndexScore = getEcoindexResults(
    domSize,
    requestCount,
    totalCompressedSize,
  )
  // console.log(`{ecoIndexScore:${JSON.stringify(ecoIndexScore)}},`)
  return ecoIndexScore
}

export function createValueResult(metricValue: MetricValue, metric: string) {
  let numericValue = undefined
  let score = undefined
  switch (metric) {
    case 'grade':
      numericValue = metricValue[metric]
      // score = metricValue['score'] / 100
      score = getScore(metric, metricValue['score'] as number)
      break
    case 'nodes':
      numericValue = metricValue[metric]
      score = getScore(metric, metricValue[metric] as number)
      break
    case 'size':
      numericValue = metricValue[metric]
      score = getScore(metric, metricValue[metric] as number)
      break
    case 'requests':
      numericValue = metricValue[metric]
      score = getScore(metric, metricValue[metric] as number)
      break
    default:
      numericValue = normalizeMetricValue(metric, metricValue[metric])
      score = getScore(metric, metricValue[metric] as number)
      break
  }
  const result = {
    numericValue: numericValue,
    score: score,
    numericUnit: getMetricNumericUnit(metric),
    displayValue: formatMetric(metric, metricValue[metric]),
    details: createInformationsTable(metric, metricValue[metric]),
  }
  // console.log('result', result)
  return result
}
/** @param {Metric} metric, @param {number} value */
function getScore(metric: string, value: number): number {
  switch (metric) {
    case 'score':
      return value / 100
    case 'grade':
      return estimateMetricScore(getMetricRange(metric), value)
    case 'water':
      return estimateMetricScore(getMetricRange(metric), value)
    case 'ghg':
      return estimateMetricScore(getMetricRange(metric), value)
    case 'nodes':
      return estimateMetricScore(getMetricRange(metric), value)
    case 'size':
      return estimateMetricScore(getMetricRange(metric), value / B_TO_KB)
    case 'requests':
      return estimateMetricScore(getMetricRange(metric), value)
    default:
      throw new Error(`Invalid metric score: ${metric}`)
  }
}

/**
 * @param {string} metric
 * @return {Range}
 */
function getMetricRange(metric: string): Range {
  switch (metric) {
    case 'score':
      return { good: 76, poor: 51, lowIsBeter: false }
    case 'grade':
      return { good: 76, poor: 51, lowIsBeter: false }
    case 'water':
      return { good: 2, poor: 1, lowIsBeter: true }
    case 'ghg':
      return { good: 2, poor: 1, lowIsBeter: true }
    case 'nodes':
      return { good: 600, poor: 300, lowIsBeter: true }
    case 'size':
      return {
        good: 1024,
        poor: 512,
        lowIsBeter: true,
      }
    case 'requests':
      return { good: 40, poor: 25, lowIsBeter: true }
    default:
      throw new Error(`Invalid metric range: ${metric}`)
  }
}

/**
 * Based on a precise drawing:
 * https://twitter.com/JohnMu/status/1395798952570724352
 *
 * @param {Range} range
 * @param {number} value
 */

function estimateMetricScore(
  { good, poor, lowIsBeter }: Range,
  value: number,
): number {
  // console.log(
  //   JSON.stringify({ range: { good: good, poor: poor }, value: value }),
  // )
  let linearScore = undefined
  if (lowIsBeter) {
    if (value <= good) return 1
    if (value > poor) return 0
    linearScore = round((poor - value) / (poor - good), 2)
  } else {
    if (value >= good) return 1
    if (value < poor) return 0
    linearScore = round((good - value) / (good - poor), 2)
  }
  return linearScore
}

/** @param {Metric} metric, @param {number} value */
function formatMetric(metric: string, value: string | number): string {
  switch (metric) {
    case 'score':
      return (value as number).toFixed(0) + '/100'
    case 'grade':
      return value + ''
    case 'water':
      return convertWaterValue(value as number, '1')
    case 'ghg':
      return convertGhgValue(value as number, '1')
    case 'nodes':
      return value + ` ${getMetricNumericUnit(metric)}`
    case 'size':
      return (
        ((value as number) / B_TO_KB).toFixed(0) +
        ` ${getMetricNumericUnit(metric)}`
      )
    case 'requests':
      return value + ' requests'
    default:
      throw new Error(`Invalid metric format: ${metric}`)
  }
}

/** @param {string} metric @param {number} value */
function normalizeMetricValue(metric: string, value: string | number) {
  switch (metric) {
    case 'score':
      return (value as number) / 100
    case 'grade':
      return value
    case 'water':
      return value
    case 'ghg':
      return value
    case 'nodes':
      return value
    case 'size':
      return value
    case 'requests':
      return value
    default:
      throw new Error(`Invalid metric when normalize: ${metric}`)
  }
}

/**
 * Get the numeric unit of a metric.
 * @param {string} metric
 * @param {number | string} value
 */
function getMetricNumericUnit(metric: string): string {
  switch (metric) {
    case 'score':
      return ''
    case 'grade':
      return ''
    case 'water':
      return 'cl'
    case 'ghg':
      return 'g eqCO2'
    case 'nodes':
      return 'DOM elements'
    case 'size':
      return 'KiB (transfered)'
    case 'requests':
      return 'requests'
    default:
      throw new Error(`Invalid metric unit: ${metric}`)
  }
}

/**
 * Convert cl to a more readable format.
 * @param {number} cl
 * @param {string} to
 * @returns {string}
 */
function convertWaterValue(
  cl: number,
  to: '1' | '10' | '1000' | '100000',
): string {
  switch (to) {
    case '1':
      return `${cl} cl`
    case '10':
      return `${cl * 10} cl`
    case '1000':
      return `${cl * 10} L`
    case '100000':
      return `${cl * 1000} L`
    default:
      return `${cl} cl`
  }
}

/**
 * Convert g eqCO2 to a more readable format.
 * @param {number} g
 * @param {string} to
 * @returns {string}
 */
function convertGhgValue(
  g: number,
  to: '1' | '10' | '1000' | '100000',
): string {
  switch (to) {
    case '1':
      return `${g} g eqCO2`
    case '10':
      return `${g * 10} g eqCO2`
    case '1000':
      return `${g} kg eqCO2`
    case '100000':
      return `${g / 10} t eqCO2`
    default:
      return `${g} g eqCO2`
  }
}
/**
 * Create informations table.
 * @param metric
 * @param value
 * @param isPercentile
 * @returns
 */
function createInformationsTable(
  metric: string,
  value: string | number,
  isPercentile = false,
): LH.Audit.Details.Table {
  const headings: LH.Audit.Details.TableColumnHeading[] = [
    { key: 'label', valueType: 'text', label: 'Information' },
    { key: 'data', valueType: 'text', label: 'Description/value' },
  ]
  const items: LH.Audit.Details.TableItem[] = []

  switch (metric) {
    case 'score':
      items.push({
        label: 'Ecoindex Score',
        data: `${value} ${getMetricNumericUnit(metric)}`,
      })
      break
    case 'grade':
      items.push({
        label: 'Ecoindex Grade',
        data: value,
      })
      break
    case 'water':
      items.push({
        label: 'Water Consumption for 10 visitors',
        data: convertWaterValue(value as number, '10'),
      })
      items.push({
        label: 'Water Consumption for 1000 visitors',
        data: convertWaterValue(value as number, '1000'),
      })
      items.push({
        label: 'Water Consumption for 100000 visitors',
        data: convertWaterValue(value as number, '100000'),
      })
      break
    case 'ghg':
      items.push({
        label: 'Greenhouse Gas Emission for 10 visitors',
        data: convertGhgValue(value as number, '10'),
      })
      items.push({
        label: 'Greenhouse Gas Emission for 1000 visitors',
        data: convertGhgValue(value as number, '1000'),
      })
      items.push({
        label: 'Greenhouse Gas Emission for 100000 visitors',
        data: convertGhgValue(value as number, '100000'),
      })
      break
    case 'nodes':
      items.push({
        label: 'DOM elements',
        data: `${value} ${getMetricNumericUnit(metric)}`,
      })
      break
    case 'size':
      items.push({
        label: 'Size of the page',
        data: `${((value as number) / B_TO_KB).toFixed(0)} ${getMetricNumericUnit(metric)}`,
      })
      break
    case 'requests':
      items.push({
        label: 'Number of requests',
        data: `${value} ${getMetricNumericUnit(metric)}`,
      })
      break
    default:
      break
  }
  if (getMetricRange(metric).lowIsBeter) {
    items.push({
      label: 'Good',
      data: `less than ${
        getMetricRange(metric).poor * (isPercentile ? 100 : 1)
      } ${getMetricNumericUnit(metric)}`,
    })
    items.push({
      label: 'Poor',
      data: `less than ${
        getMetricRange(metric).good * (isPercentile ? 100 : 1)
      } ${getMetricNumericUnit(metric)}`,
    })
  } else {
    items.push({
      label: 'Good',
      data: `more than ${
        getMetricRange(metric).good * (isPercentile ? 100 : 1)
      } ${getMetricNumericUnit(metric)}`,
    })
    items.push({
      label: 'Poor',
      data: `more than ${
        getMetricRange(metric).poor * (isPercentile ? 100 : 1)
      } ${getMetricNumericUnit(metric)}`,
    })
  }

  return Audit.makeTableDetails(headings, items)
}

/**
 * Create error result.
 *
 * @param {Error} err
 */
export function createErrorResult(err: Error) {
  console.log(err)
  // throw new Error("fail")
  return {
    score: -1,
    errorMessage: err.toString(),
  }
}
/**
 * @param {number} domSize Number of DOM elements
 * @param {number} requestCount Number of HTTP requests
 * @param {number} totalCompressedSize Page size in ko
 * @return {number}
 */
function getEcoindexResults(
  domSize: number,
  requestCount: number,
  totalCompressedSize: number,
): EcoindexResults {
  // Add your custom EcoIndex calculation logic here based on the provided metrics.
  // The EcoIndex score should be a value between 0 and 100, where 100 represents the most eco-friendly page.
  // This is just a placeholder, and you should replace it with a proper calculation.
  const _ecoindex = computeEcoIndex(
    domSize,
    requestCount,
    totalCompressedSize / 1000,
  )
  const value: EcoindexResults = {
    score: _ecoindex,
    grade: getEcoIndexGrade(_ecoindex),
    water: computeWaterConsumptionfromEcoIndex(_ecoindex),
    ghg: computeGreenhouseGasesEmissionfromEcoIndex(_ecoindex),
  }
  return value
}
