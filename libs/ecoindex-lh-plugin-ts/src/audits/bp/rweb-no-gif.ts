import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const UIStrings = {
  title: 'RWEB_0099 - Avoid using GIFs',
  failureTitle: 'RWEB_0099 - GIFs detected',
  description:
    'Avoid using GIFs for animations or images; use modern formats instead. [See RWEB_0099](https://rweb.greenit.fr/en/fiches/RWEB_0099-limit-the-use-of-animated-gif)',
  displayValuePass: 'No GIFs detected',
  displayValueFail: '{count} GIF(s) detected',
  colLabelUrl: 'GIF URL',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-gif.js', UIStrings)

class BPRwebNoGif extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-gif',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
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

    const gifRecords: string[] = []
    for (const record of networkRecords) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (record.url.toLowerCase().endsWith('.gif')) {
        gifRecords.push(record.url)
      }
    }

    // Count inline <img src="*.gif"> in HTML for the score only (paths are relative, not listable as URLs)
    const htmlGifPattern = /src\s*=\s*["']([^"']*\.gif)["']/gi
    const htmlMatches = html.match(htmlGifPattern)
    const htmlGifCount = htmlMatches ? htmlMatches.length : 0

    const gifCount = gifRecords.length + htmlGifCount

    return {
      score: gifCount === 0 ? 1 : 0,
      displayValue:
        gifCount === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count: gifCount }),
      numericValue: gifCount,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          {
            key: 'url',
            label: str_(UIStrings.colLabelUrl),
            valueType: 'url' as const,
          },
        ],
        items: gifRecords.map(url => ({ url })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoGif
