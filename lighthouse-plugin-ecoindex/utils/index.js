import { Audit, NetworkRecords } from 'lighthouse'

import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { getEcoindex } from 'ecoindex'
import round from 'lodash.round'

const KO_TO_MO = 10000

export async function getLoadingExperience(
  artifacts,
  context,
  isTechnical = false,
) {
  const domSize = artifacts.DOMStats.totalBodyElements

  // repiqué de https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/byte-efficiency/total-byte-weight.js#L61
  const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS]

  const records = await NetworkRecords.request(devtoolsLog, context)

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
  if (isTechnical) {
    return {
      nodes: domSize,
      requests: requestCount,
      size: totalCompressedSize,
    }
  }
  const ecoIndexScore = getEcoindexResults(
    domSize,
    requestCount,
    totalCompressedSize,
  )
  return ecoIndexScore
}

export function createValueResult(metricValue, metric, isPercentile = false) {
  let numericValue = undefined
  let score = undefined
  switch (metric) {
    case 'grade':
      numericValue = undefined
      score = metricValue['score'] / 100
      break
    case 'nodes':
      numericValue = undefined
      score = getScore(metric, metricValue[metric])
      break
    case 'size':
      numericValue = undefined
      score = getScore(metric, metricValue[metric])
      break
    case 'requests':
      numericValue = undefined
      score = getScore(metric, metricValue[metric])
      break
    default:
      numericValue = normalizeMetricValue(
        metric,
        isPercentile ? metricValue[metric] * 100 : metricValue[metric],
      )
      score = getScore(metric, metricValue[metric])
      break
  }
  const result = {
    numericValue: numericValue,
    score: score,
    numericUnit: getMetricNumericUnit(metric),
    displayValue: formatMetric(metric, metricValue[metric]),
    details: createInformationsTable(metric, metricValue[metric], isPercentile),
  }
  // console.log('result', result)
  return result
}
/** @param {Metric} metric, @param {number} value */
function getScore(metric, value) {
  switch (metric) {
    case 'score':
      return value / 100
    case 'grade':
      return value == 'A' ? 1 : 0
    case 'water':
      return estimateMetricScore(getMetricRange(metric), value)
    case 'ghg':
      return estimateMetricScore(getMetricRange(metric), value)
    case 'nodes':
      return estimateMetricScore(getMetricRange(metric), value)
    case 'size':
      return estimateMetricScore(getMetricRange(metric), value)
    case 'requests':
      return estimateMetricScore(getMetricRange(metric), value)
    default:
      throw new Error(`Invalid metric score: ${metric}`)
  }
}

/**
 * @param {Metric} metric
 * @return {Range}
 */
function getMetricRange(metric) {
  switch (metric) {
    case 'score':
      return { good: 0.9, poor: 0.7 }
    case 'grade':
      return { good: 'B', poor: 'D' }
    case 'water':
      return { good: 0.5, poor: 1 }
    case 'ghg':
      return { good: 0.5, poor: 1 }
    case 'nodes':
      return { good: 600, poor: 1000 }
    case 'size':
      return { good: (2 * 10000) / KO_TO_MO, poor: (4 * 10000) / KO_TO_MO }
    case 'requests':
      return { good: 20000, poor: 60000 }
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

function estimateMetricScore({ good, poor }, value) {
  if (value <= good) return 1
  if (value > poor) return 0
  const linearScore = round((poor - value) / (poor - good), 2)
  return linearScore
}

/** @param {Metric} metric, @param {number} value */
function formatMetric(metric, value) {
  switch (metric) {
    case 'score':
      return value.toFixed(0) + '/100'
    case 'grade':
      return value + ''
    case 'water':
      return value + ' cl'
    case 'ghg':
      return value + ' eqCO2'
    case 'nodes':
      return value + ' DOM elements'
    case 'size':
      return (value / KO_TO_MO).toFixed(3) + ' Ko'
    case 'requests':
      return value + ' requests'
    default:
      throw new Error(`Invalid metric format: ${metric}`)
  }
}

/** @param {Metric} metric @param {number} value */
function normalizeMetricValue(metric, value) {
  switch (metric) {
    case 'score':
      return value / 100
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

/** @param {Metric} metric */
function getMetricNumericUnit(metric) {
  switch (metric) {
    case 'score':
      return ''
    case 'grade':
      return ''
    case 'water':
      return 'cl'
    case 'ghg':
      return 'eqCO2'
    case 'nodes':
      return 'DOM elements'
    case 'size':
      return 'Ko'
    case 'requests':
      return 'requests'
    default:
      throw new Error(`Invalid metric unit: ${metric}`)
  }
}

function createInformationsTable(metric, value, isPercentile = false) {
  const headings = [
    { key: 'label', itemType: 'text', text: 'Information' },
    { key: 'data', itemType: 'text', text: 'Description/value' },
  ]
  const items = []

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
        label: 'Water Consumption',
        data: `${value} ${getMetricNumericUnit(metric)}`,
      })
      break
    case 'ghg':
      items.push({
        label: 'Greenhouse Gas Emission',
        data: `${value} ${getMetricNumericUnit(metric)}`,
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
        data: `${(value / KO_TO_MO).toFixed(3)} ${getMetricNumericUnit(
          metric,
        )}`,
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
  if (metric == 'grade') {
    items.push({
      label: 'Good',
      data: `less than ${getMetricRange(metric).good}`,
    })
    items.push({
      label: 'Poor',
      data: `less than ${getMetricRange(metric).poor}`,
    })
  } else {
    items.push({
      label: 'Good',
      data: `less than ${
        getMetricRange(metric).good * (isPercentile ? 100 : 1)
      } ${getMetricNumericUnit(metric)}`,
    })
    items.push({
      label: 'Poor',
      data: `less than ${
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
export function createErrorResult(err) {
  console.log(err)
  // throw new Error("fail")
  return {
    score: null,
    errorMessage: err.toString(),
  }
}

/**
 * @param {number} dom Number of DOM elements
 * @param {number} req Number of HTTP requests
 * @param {number} size Page size in ko
 * @return {number}
 */
function getEcoindexResults(domSize, requestCount, totalCompressedSize) {
  // Add your custom EcoIndex calculation logic here based on the provided metrics.
  // The EcoIndex score should be a value between 0 and 100, where 100 represents the most eco-friendly page.
  // This is just a placeholder, and you should replace it with a proper calculation.
  const value = getEcoindex(domSize, requestCount, totalCompressedSize)
  return value
}
