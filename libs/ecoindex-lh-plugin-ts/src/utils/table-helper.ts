import type * as LH from 'lighthouse/types/lh.js'
import {
  convertGhgValue,
  convertWaterValue,
  getMetricNumericUnit,
} from './format-helper.js'

import { Audit as AuditClass } from 'lighthouse'
import { METRIC_RANGES } from './score-helper.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  colLabelInfo: 'Information',
  colLabelDesc: 'Description/value',
  labelEcoindexScore: 'Ecoindex Score',
  labelEcoindexGrade: 'Ecoindex Grade',
  labelWater10: 'Water Consumption for 10 visitors',
  labelWater1000: 'Water Consumption for 1,000 visitors',
  labelWater100000: 'Water Consumption for 100,000 visitors',
  labelGhg10: 'Greenhouse Gas Emission for 10 visitors',
  labelGhg1000: 'Greenhouse Gas Emission for 1,000 visitors',
  labelGhg100000: 'Greenhouse Gas Emission for 100,000 visitors',
  labelDomElements: 'DOM elements',
  labelPageSize: 'Size of the page',
  labelRequests: 'Number of requests',
  labelGood: 'Good',
  labelPoor: 'Poor',
  thresholdLessText: 'less than {value} {unit}',
  thresholdMoreText: 'more than {value} {unit}',
  colLabelUrl: 'URL',
  colLabelDomain: 'Domain',
  colLabelTransferSize: 'Transfer size (KiB)',
}

const str_ = createIcuMessageFn('utils/table-helper.js', UIStrings)

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
): LH.Audit.Details.Table {
  const headings: LH.Audit.Details.TableColumnHeading[] = [
    { key: 'label', valueType: 'text', label: str_(UIStrings.colLabelInfo) },
    { key: 'data', valueType: 'text', label: str_(UIStrings.colLabelDesc) },
  ]
  const items: LH.Audit.Details.TableItem[] = []

  switch (metric) {
    case 'score':
      items.push({
        label: str_(UIStrings.labelEcoindexScore),
        data: `${value} ${getMetricNumericUnit(metric)}`,
      })
      break

    case 'grade':
      items.push({
        label: str_(UIStrings.labelEcoindexGrade),
        data: String(value),
      })
      break

    case 'water':
      items.push({
        label: str_(UIStrings.labelWater10),
        data: convertWaterValue(value as number, '10'),
      })
      items.push({
        label: str_(UIStrings.labelWater1000),
        data: convertWaterValue(value as number, '1000'),
      })
      items.push({
        label: str_(UIStrings.labelWater100000),
        data: convertWaterValue(value as number, '100000'),
      })
      break

    case 'ghg':
      items.push({
        label: str_(UIStrings.labelGhg10),
        data: convertGhgValue(value as number, '10'),
      })
      items.push({
        label: str_(UIStrings.labelGhg1000),
        data: convertGhgValue(value as number, '1000'),
      })
      items.push({
        label: str_(UIStrings.labelGhg100000),
        data: convertGhgValue(value as number, '100000'),
      })
      break

    case 'nodes':
      items.push({
        label: str_(UIStrings.labelDomElements),
        data: `${value} ${getMetricNumericUnit(metric)}`,
      })
      break

    case 'size':
      items.push({
        label: str_(UIStrings.labelPageSize),
        data: `${((value as number) / 1000).toFixed(0)} ${getMetricNumericUnit(
          metric,
        )}`,
      })
      break

    case 'requests':
      items.push({
        label: str_(UIStrings.labelRequests),
        data: `${value} ${getMetricNumericUnit(metric)}`,
      })
      break

    default:
      break
  }

  const range = METRIC_RANGES[metric]
  if (range) {
    const multiplier = isPercentile ? 100 : 1
    if (range.lowIsBeter) {
      items.push({
        label: str_(UIStrings.labelGood),
        data: str_(UIStrings.thresholdLessText, {
          value: range.poor * multiplier,
          unit: getMetricNumericUnit(metric),
        }),
      })
      items.push({
        label: str_(UIStrings.labelPoor),
        data: str_(UIStrings.thresholdLessText, {
          value: range.good * multiplier,
          unit: getMetricNumericUnit(metric),
        }),
      })
    } else {
      items.push({
        label: str_(UIStrings.labelGood),
        data: str_(UIStrings.thresholdMoreText, {
          value: range.good * multiplier,
          unit: getMetricNumericUnit(metric),
        }),
      })
      items.push({
        label: str_(UIStrings.labelPoor),
        data: str_(UIStrings.thresholdMoreText, {
          value: range.poor * multiplier,
          unit: getMetricNumericUnit(metric),
        }),
      })
    }
  }

  return AuditClass.makeTableDetails(headings, items)
}

/**
 * Create a table listing individual network resources sorted by transfer size.
 *
 * @param records - Filtered network records from extractNetworkMetrics
 * @returns Table details with URL, domain, and transfer size columns
 */
export function createNetworkRecordsTable(
  records: LH.Artifacts.NetworkRequest[],
): LH.Audit.Details.Table {
  const headings: LH.Audit.Details.TableColumnHeading[] = [
    { key: 'url', valueType: 'url', label: str_(UIStrings.colLabelUrl) },
    {
      key: 'domain',
      valueType: 'text',
      label: str_(UIStrings.colLabelDomain),
    },
    {
      key: 'size',
      valueType: 'text',
      label: str_(UIStrings.colLabelTransferSize),
    },
  ]

  const sorted = [...records].sort((a, b) => b.transferSize - a.transferSize)

  const items: LH.Audit.Details.TableItem[] = sorted.map(record => {
    let domain = record.url
    try {
      domain = new URL(record.url).hostname
    } catch {
      // keep raw url as fallback
    }
    return {
      url: record.url,
      domain,
      size: (record.transferSize / 1000).toFixed(1),
    }
  })

  return AuditClass.makeTableDetails(headings, items)
}
