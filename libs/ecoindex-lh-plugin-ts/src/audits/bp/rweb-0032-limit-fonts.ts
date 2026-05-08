import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'

const MAX_FONT_FAMILIES = 2

const FONT_DOMAINS = [
  'fonts.googleapis.com',
  'use.typekit.net',
  'fonts.bunny.net',
  'fonts.adobe.com',
  'use.fontawesome.com',
  'cdn.fontawesome.com',
]

class BPRweb0032LimitFonts extends Audit {
  static get meta() {
    return {
      id: 'rweb-0032-limit-fonts',
      title: `RWEB_0032 - Limit font families (≤ ${MAX_FONT_FAMILIES})`,
      failureTitle: `RWEB_0032 - Too many external font families (> ${MAX_FONT_FAMILIES})`,
      description: `Reduce the number of external font families loaded. [See RWEB_0032](${refsURLS.rweb.rweb_0032.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const records = await NetworkRecords.request(artifacts.DevtoolsLog, context)

    const fontFamilies = new Set<string>()
    for (const record of records) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      try {
        const { hostname } = new URL(record.url)
        if (FONT_DOMAINS.includes(hostname)) {
          fontFamilies.add(hostname)
        }
      } catch {
        // ignore malformed URLs
      }
    }

    const count = fontFamilies.size

    return {
      score: count <= MAX_FONT_FAMILIES ? 1 : 0,
      displayValue: `${count} external font famil${count !== 1 ? 'ies' : 'y'}`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRweb0032LimitFonts
