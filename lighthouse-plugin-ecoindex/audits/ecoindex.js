import { Audit, NetworkRecords } from 'lighthouse'

import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { getEcoindex } from 'ecoindex'

class EcoindexAudit extends Audit {
  static get meta() {
    return {
      id: 'ecoindex-metrics',
      title: 'Ecoindex revealant metrics',
      failureTitle: 'Your page has a big impact',
      description:
        'Pages should be lightweight in order to be more sustainable.',
      requiredArtifacts: ['DOMStats', 'devtoolsLogs'],
      supportedModes: ['navigation', 'timespan', 'snapshot'],
      scoreDisplayMode: 'numeric',
    }
  }

  static get metrics() {
    return [
      {
        id: 'dom-size',
        title: 'DOM Size',
        description: 'The size of the DOM in bytes.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'request-count',
        title: 'Request Count',
        description: 'The number of network requests made by the page.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'total-compressed-size',
        title: 'Total Compressed Size',
        description: 'The total size of all compressed responses in bytes.',
        scoreDisplayMode: 'numeric',
      },
      {
        id: 'eco-index-score',
        title: 'EcoIndex Score',
        description:
          'The EcoIndex score evaluating the environmental impact of the page.',
        scoreDisplayMode: 'numeric',
      },
    ]
  }

  static calculateEcoIndexScore(domSize, requestCount, totalCompressedSize) {
    // Add your custom EcoIndex calculation logic here based on the provided metrics.
    // The EcoIndex score should be a value between 0 and 100, where 100 represents the most eco-friendly page.
    // This is just a placeholder, and you should replace it with a proper calculation.
    const ecoIndexScore = getEcoindex(
      domSize,
      requestCount,
      totalCompressedSize,
    )
    return ecoIndexScore
  }

  static async audit(artifacts, context) {
    const domSize = artifacts.DOMStats.totalBodyElements

    // repiqué de https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/byte-efficiency/total-byte-weight.js#L61
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS]

    const records = await NetworkRecords.request(devtoolsLog, context)

    let totalBytes = 0

    /** @type {Array<{url: string, totalBytes: number}>} */
    let sizeResults = []
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

    const ecoIndexScore = EcoindexAudit.calculateEcoIndexScore(
      domSize,
      requestCount,
      totalCompressedSize,
    )

    // Metric values are expected to be in kilobytes
    const metricValues = {
      'dom-size': domSize,
      'request-count': requestCount,
      'total-compressed-size': totalCompressedSize / 1024,
      'eco-index-score': ecoIndexScore.score,
    }

    return {
      score: ecoIndexScore.score / 100,
      numericValue: 1,
      numericUnit: 'unitless',
    }
  }
}

export default EcoindexAudit
