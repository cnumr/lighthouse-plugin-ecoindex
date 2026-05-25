import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import type { BPArtifacts } from '../../types/index.js'
import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0106 - No video/audio autoplay',
  failureTitle: 'RWEB_0106 - Autoplay video/audio detected',
  description:
    'Avoid autoplay on video and audio elements. [See RWEB_0106](https://rweb.greenit.fr/es/fiches/RWEB_0106-evitar-la-reproduccion-y-carga-automatica-de-videos-y-sonidos)',
  displayValue: '{count} autoplay element(s)',
  colLabelElement: 'Element',
  colLabelSrc: 'Source',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-autoplay.js', UIStrings)

class BPRwebNoAutoplay extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-autoplay',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['BPGatherer'] as unknown as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts & BPArtifacts) {
    const { autoplayDetails } = artifacts.BPGatherer
    const count = autoplayDetails.length

    return {
      score: count === 0 ? 1 : 0,
      displayValue: str_(UIStrings.displayValue, { count }),
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      ...(count > 0 && {
        details: {
          type: 'table' as const,
          headings: [
            {
              key: 'selector',
              label: str_(UIStrings.colLabelElement),
              valueType: 'text' as const,
            },
            {
              key: 'src',
              label: str_(UIStrings.colLabelSrc),
              valueType: 'text' as const,
            },
          ],
          items: autoplayDetails.map(d => ({
            selector: d.selector,
            src: d.src || '—',
          })),
        } as LH.Audit.Details.Table,
      }),
    }
  }
}

export default BPRwebNoAutoplay
