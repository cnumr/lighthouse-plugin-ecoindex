import * as LH from 'lighthouse/types/lh.js'

import { Audit, NetworkRecords } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const STATIC_RESOURCE_TYPES = new Set(['Image', 'Stylesheet', 'Script', 'Font'])
const UIStrings = {
  title: 'RWEB_0081 - No cookies on static resources',
  failureTitle: 'RWEB_0081 - Cookies detected on static resources',
  description:
    'Avoid sending cookies with static resources (images, CSS, JS, fonts). [See RWEB_0081](https://rweb.greenit.fr/en/fiches/RWEB_0081-host-static-resources-on-a-cookie-free-domain)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoCookieOnStatic extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-cookie-on-static',
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

    const staticWithCookie = networkRecords.filter(record => {
      if (!STATIC_RESOURCE_TYPES.has(record.resourceType ?? '')) return false
      const hasCookie =
        (
          record as unknown as {
            requestHeaders?: Array<{ name: string; value: string }>
          }
        ).requestHeaders?.some(
          (h: { name: string; value: string }) =>
            h.name.toLowerCase() === 'cookie' && h.value.length > 0,
        ) ?? false
      return hasCookie
    })

    const count = staticWithCookie.length
    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0
          ? 'No static resources with Cookie header'
          : `${count} static resource${count > 1 ? 's' : ''} sent with Cookie header`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default BPRwebNoCookieOnStatic
