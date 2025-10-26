import {
  convertGhgValue,
  convertWaterValue,
  getMetricNumericUnit,
} from './format-helper.js'

import { Audit as AuditClass } from 'lighthouse'
import { METRIC_RANGES } from './score-helper.js'
import type { Audit as AuditTypes } from 'lighthouse/types/lh.js'

/**
 * Create an information table for an audit result.
 * Displays metric information and good/poor thresholds.
 *
 * @param metric - Name of the metric
 * @param value - Metric value
 * @param isPercentile - Whether the metric is a percentile
 * @returns Table details for the audit result
 */
export function createInformationsTable(
  metric: string,
  value: string | number,
  isPercentile = false,
): AuditTypes.Details.Table {
  const headings: AuditTypes.Details.TableColumnHeading[] = [
    { key: 'label', valueType: 'text', label: 'Information' },
    { key: 'data', valueType: 'text', label: 'Description/value' },
  ]
  const items: AuditTypes.Details.TableItem[] = []

  // Add metric-specific information
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
        data: String(value),
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
        data: `${((value as number) / 1000).toFixed(0)} ${getMetricNumericUnit(
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

  // Add good/poor thresholds
  const range = METRIC_RANGES[metric]
  if (range) {
    if (range.lowIsBeter) {
      items.push({
        label: 'Good',
        data: `less than ${
          range.poor * (isPercentile ? 100 : 1)
        } ${getMetricNumericUnit(metric)}`,
      })
      items.push({
        label: 'Poor',
        data: `less than ${
          range.good * (isPercentile ? 100 : 1)
        } ${getMetricNumericUnit(metric)}`,
      })
    } else {
      items.push({
        label: 'Good',
        data: `more than ${
          range.good * (isPercentile ? 100 : 1)
        } ${getMetricNumericUnit(metric)}`,
      })
      items.push({
        label: 'Poor',
        data: `more than ${
          range.poor * (isPercentile ? 100 : 1)
        } ${getMetricNumericUnit(metric)}`,
      })
    }
  }

  return AuditClass.makeTableDetails(headings, items)
}
