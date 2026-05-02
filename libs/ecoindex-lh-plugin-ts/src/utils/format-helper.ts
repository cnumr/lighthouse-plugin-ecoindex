import { B_TO_KB, METRIC_RANGES } from './score-helper.js'

/**
 * Format metric value for display in audit results.
 *
 * @param metric - Name of the metric
 * @param value - Metric value to format
 * @returns Formatted string representation
 * @throws Error if metric format is invalid
 */
export function formatMetric(metric: string, value: string | number): string {
  switch (metric) {
    case 'score':
      return `${(value as number).toFixed(0)}/100`

    case 'grade':
      return String(value)

    case 'water':
      return convertWaterValue(value as number, '1')

    case 'ghg':
      return convertGhgValue(value as number, '1')

    case 'nodes':
      return `${value} ${getMetricNumericUnit(metric)}`

    case 'size':
      return `${((value as number) / B_TO_KB).toFixed(0)} ${getMetricNumericUnit(
        metric,
      )}`

    case 'requests':
      return `${value} requests`

    default:
      throw new Error(`Invalid metric format: ${metric}`)
  }
}

/**
 * Get the numeric unit for a metric.
 *
 * @param metric - Name of the metric
 * @returns Unit string
 * @throws Error if metric unit is invalid
 */
export function getMetricNumericUnit(metric: string): string {
  switch (metric) {
    case 'score':
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
 * Convert water consumption value (in centiliters) to a readable format.
 *
 * @param cl - Water consumption in centiliters
 * @param to - Conversion scale ('1', '10', '1000', '100000')
 * @returns Formatted string with unit
 */
export function convertWaterValue(
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
 * Convert greenhouse gas emission value (in grams eqCO2) to a readable format.
 *
 * @param g - GHG emission in grams eqCO2
 * @param to - Conversion scale ('1', '10', '1000', '100000')
 * @returns Formatted string with unit
 */
export function convertGhgValue(
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
 * Normalize metric value for consistent processing.
 *
 * @param metric - Name of the metric
 * @param value - Value to normalize
 * @returns Normalized value
 * @throws Error if metric is invalid
 */
export function normalizeMetricValue(
  metric: string,
  value: string | number,
): number {
  switch (metric) {
    case 'score':
      return (value as number) / 100
    case 'grade':
    case 'water':
    case 'ghg':
    case 'nodes':
    case 'size':
    case 'requests':
      return value as number
    default:
      throw new Error(`Invalid metric when normalize: ${metric}`)
  }
}

export function getExplanationForMetric(metric: string, value: number): string {
  const { good, poor, lowIsBeter } = METRIC_RANGES[metric] ?? {}

  if (lowIsBeter === undefined) {
    throw new Error(`Invalid metric explanation: ${metric}`)
  }

  const effectiveValue = metric === 'size' ? value / B_TO_KB : value

  if (lowIsBeter) {
    if (effectiveValue <= good) return explanationLabels[metric].low
    if (effectiveValue <= good * 2) return explanationLabels[metric].moderate
    return explanationLabels[metric].high
  } else {
    if (effectiveValue >= good) return explanationLabels[metric].low
    if (effectiveValue >= poor) return explanationLabels[metric].moderate
    return explanationLabels[metric].high
  }
}

const explanationLabels: Record<
  string,
  { low: string; moderate: string; high: string }
> = {
  score: {
    low: 'Low environmental impact.',
    moderate: 'Moderate environmental impact.',
    high: 'High environmental impact.',
  },
  grade: {
    low: 'Low environmental impact.',
    moderate: 'Moderate environmental impact.',
    high: 'High environmental impact.',
  },
  water: {
    low: 'Low water consumption.',
    moderate: 'Moderate water consumption.',
    high: 'High water consumption.',
  },
  ghg: {
    low: 'Low greenhouse gas emissions.',
    moderate: 'Moderate greenhouse gas emissions.',
    high: 'High greenhouse gas emissions.',
  },
  nodes: {
    low: 'Low DOM complexity.',
    moderate: 'Moderate DOM complexity.',
    high: 'High DOM complexity.',
  },
  size: {
    low: 'Low page weight.',
    moderate: 'Moderate page weight.',
    high: 'High page weight.',
  },
  requests: {
    low: 'Low number of requests.',
    moderate: 'Moderate number of requests.',
    high: 'High number of requests.',
  },
}
