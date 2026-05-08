import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'

class BPRwebNoGif extends Audit {
  static get meta() {
    return {
      id: 'rweb-0099-no-gif',
      title: 'RWEB_0099 - Avoid using GIFs',
      failureTitle: 'RWEB_0099 - GIFs detected',
      description: `Avoid using GIFs for animations or images; use modern formats instead. [See RWEB_0099](${refsURLS.rweb.rweb_0099.en})`,
      requiredArtifacts: ['DevtoolsLog', 'MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const networkRecords = await NetworkRecords.request(
      artifacts.DevtoolsLog,
      context,
    )
    const html = artifacts.MainDocumentContent || ''

    let gifCount = 0

    // Check network records for .gif URLs
    for (const record of networkRecords) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (record.url.toLowerCase().endsWith('.gif')) {
        gifCount++
      }
    }

    // Check HTML for inline <img> tags with .gif src
    const gifPattern = /src\s*=\s*["']([^"']*\.gif)["']/gi
    const matches = html.match(gifPattern)
    if (matches) {
      gifCount += matches.length
    }

    return {
      score: gifCount === 0 ? 1 : 0,
      displayValue:
        gifCount === 0 ? 'No GIFs detected' : `${gifCount} GIF(s) detected`,
      numericValue: gifCount,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebNoGif
