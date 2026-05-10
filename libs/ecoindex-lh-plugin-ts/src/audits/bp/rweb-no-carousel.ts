import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import refsURLS from './refs-urls.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const CAROUSEL_LIBS = ['swiper', 'slick', 'owl', 'splide', 'glide']
const UIStrings = {
  title: 'RWEB_0010 - Avoid carousels',
  failureTitle: 'RWEB_0010 - Carousel library detected',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoCarousel extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-carousel',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: `Avoid using carousel/slider libraries when possible. [See RWEB_0010](${refsURLS.rweb.rweb_0010.en})`,
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const networkRecords = await NetworkRecords.request(
      artifacts.DevtoolsLog,
      context,
    )

    let carouselCount = 0

    // Check network records for carousel library scripts
    for (const record of networkRecords) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (record.resourceType !== 'Script') continue

      const urlLower = record.url.toLowerCase()
      for (const lib of CAROUSEL_LIBS) {
        if (urlLower.includes(lib)) {
          carouselCount++
          break // Count each URL only once
        }
      }
    }

    return {
      score: carouselCount === 0 ? 1 : 0,
      displayValue:
        carouselCount === 0
          ? 'No carousel libraries detected'
          : `${carouselCount} carousel library/libraries detected`,
      numericValue: carouselCount,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebNoCarousel
