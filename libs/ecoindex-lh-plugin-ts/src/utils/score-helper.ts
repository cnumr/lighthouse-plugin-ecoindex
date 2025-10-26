import type { Range } from '../types/index.js'
import round from 'lodash.round'

export const B_TO_KB = 1000

/**
 * Score ranges for different Ecoindex metrics.
 * Used to calculate audit scores based on metric values.
 */
export const METRIC_RANGES: Record<string, Range> = {
  score: { good: 76, poor: 51, lowIsBeter: false },
  grade: { good: 76, poor: 51, lowIsBeter: false },
  water: { good: 2, poor: 1, lowIsBeter: true },
  ghg: { good: 2, poor: 1, lowIsBeter: true },
  nodes: { good: 600, poor: 300, lowIsBeter: true },
  size: {
    good: 1024,
    poor: 512,
    lowIsBeter: true,
  },
  requests: { good: 40, poor: 25, lowIsBeter: true },
}

/**
 * Get the score range for a specific metric.
 *
 * @param metric - Name of the metric
 * @returns Score range configuration
 * @throws Error if metric range is not defined
 */
export function getMetricRange(metric: string): Range {
  const range = METRIC_RANGES[metric]
  if (!range) {
    throw new Error(`Invalid metric range: ${metric}`)
  }
  return range
}

/**
 * Calculate audit score based on metric value and range.
 * Uses linear interpolation between "good" and "poor" thresholds.
 *
 * Based on a precise drawing:
 * https://twitter.com/JohnMu/status/1395798952570724352
 *
 * @param range - Score range configuration (good, poor, and if lower is better)
 * @param value - Actual metric value
 * @returns Score between 0 and 1
 */
export function calculateMetricScore(range: Range, value: number): number {
  let linearScore: number

  if (range.lowIsBeter) {
    // For metrics where lower is better (nodes, size, requests, etc.)
    if (value <= range.good) return 1
    if (value > range.poor) return 0
    linearScore = round((range.poor - value) / (range.poor - range.good), 2)
  } else {
    // For metrics where higher is better (score, grade)
    if (value >= range.good) return 1
    if (value < range.poor) return 0
    linearScore = round((range.good - value) / (range.good - range.poor), 2)
  }

  return linearScore
}

/**
 * Get audit score for a specific metric and value.
 * Applies metric-specific transformations before calculating the score.
 *
 * @param metric - Name of the metric
 * @param value - Actual metric value
 * @returns Score between 0 and 1
 * @throws Error if metric is invalid
 */
export function getScoreForMetric(metric: string, value: number): number {
  switch (metric) {
    case 'score':
      return value / 100

    case 'grade':
    case 'water':
    case 'ghg':
    case 'nodes':
      return calculateMetricScore(getMetricRange(metric), value)

    case 'size':
      // Convert size from bytes to KB for scoring
      return calculateMetricScore(getMetricRange(metric), value / B_TO_KB)

    case 'requests':
      return calculateMetricScore(getMetricRange(metric), value)

    default:
      throw new Error(`Invalid metric score: ${metric}`)
  }
}
