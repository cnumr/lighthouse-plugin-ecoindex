import type * as LH from 'lighthouse/types/lh.js'

import type { DOMInformationsArtifacts } from '../types/index.js'
import { NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import TotalByteWeight from 'lighthouse/core/audits/byte-efficiency/total-byte-weight.js'

/**
 * Interface for network metrics extracted from Lighthouse artifacts.
 */
export interface NetworkMetrics {
  /** Number of HTTP requests made during page load */
  requestCount: number
  /** Total compressed size of all network requests in bytes */
  totalCompressedSize: number
  /** Total byte weight calculated by Lighthouse */
  totalByteWeight: number
  /** Details from Lighthouse total byte weight audit */
  totalByteDetails: LH.Audit.Details.Table | undefined
}

/**
 * Extract DOM size from artifacts.
 *
 * @param artifacts - Lighthouse artifacts containing DOM informations
 * @returns Number of DOM elements (excluding SVG child elements)
 */
export async function extractDOMSize(
  artifacts: DOMInformationsArtifacts,
): Promise<number> {
  const domInformations = artifacts.DOMInformations
  return domInformations.nodesBodyWithoutSVGChildsCount
}

/**
 * Extract network metrics from Lighthouse artifacts.
 * Calculates request count and total compressed size from network records.
 *
 * In Lighthouse 13+, devtoolsLogs (plural) has been replaced by DevtoolsLog (singular, capital D).
 * See https://github.com/GoogleChrome/lighthouse/issues/15306
 *
 * @param artifacts - Lighthouse artifacts containing DevtoolsLog
 * @param context - Lighthouse audit context
 * @returns Network metrics including request count and total size
 */
export async function extractNetworkMetrics(
  artifacts: LH.Artifacts,
  context: LH.Audit.Context,
): Promise<NetworkMetrics> {
  // DevtoolsLog is guaranteed to be available since it's in requiredArtifacts
  const devtoolsLog = artifacts.DevtoolsLog

  // Get network records from the devtools log using NetworkRecords computed artifact
  const records = await NetworkRecords.request(devtoolsLog, context)

  // Get total byte weight from Lighthouse audit
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

    totalCompressedSize += record.transferSize
    requestCount += 1
  })

  return {
    requestCount,
    totalCompressedSize,
    totalByteWeight,
    totalByteDetails,
  }
}
