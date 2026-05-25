import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { NetworkRequest } from 'lighthouse/core/lib/network-request.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const CAROUSEL_LIBS = ['swiper', 'slick', 'owl', 'splide', 'glide']
const UIStrings = {
  title: 'RWEB_0010 - Avoid carousels',
  failureTitle: 'RWEB_0010 - Carousel library detected',
  description:
    'Avoid using carousel/slider libraries when possible. [See RWEB_0010](https://rweb.greenit.fr/en/fiches/RWEB_0010-limiting-the-use-of-carousels)',
  displayValuePass: 'No carousel libraries detected',
  displayValueFail:
    '{count, plural, one {# carousel library detected} other {# carousel libraries detected}}',
  colLabelUrl: 'Carousel library URL',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-carousel.js', UIStrings)

class BPRwebNoCarousel extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-carousel',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['DevtoolsLog'] as (keyof LH.Artifacts)[],
    }
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    const networkRecords = await NetworkRecords.request(
      artifacts.DevtoolsLog,
      context,
    )

    const carouselUrls: string[] = []

    for (const record of networkRecords) {
      if (NetworkRequest.isNonNetworkRequest(record)) continue
      if (record.resourceType !== 'Script') continue

      const urlLower = record.url.toLowerCase()
      for (const lib of CAROUSEL_LIBS) {
        if (urlLower.includes(lib)) {
          carouselUrls.push(record.url)
          break
        }
      }
    }

    return {
      score: carouselUrls.length === 0 ? 1 : 0,
      displayValue:
        carouselUrls.length === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count: carouselUrls.length }),
      numericValue: carouselUrls.length,
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
        items: carouselUrls.map(url => ({ url })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoCarousel
