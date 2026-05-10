import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'RWEB_0043 - No JavaScript errors in console',
  failureTitle: 'RWEB_0043 - JavaScript errors detected',
  description:
    'Fix JavaScript errors to avoid broken features and wasted processing. [See RWEB_0043](https://rweb.greenit.fr/en/fiches/RWEB_0043-validate-your-code-with-a-linter)',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoJsErrors extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-js-errors',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['ConsoleMessages'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const messages = artifacts.ConsoleMessages ?? []

    const errors = messages.filter(
      msg =>
        msg.level === 'error' ||
        (msg as unknown as { type?: string }).type === 'error',
    )

    const count = errors.length
    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0 ? 'No JavaScript errors' : `${count} JavaScript error(s)`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          {
            key: 'message',
            label: 'Error message',
            valueType: 'text' as const,
          },
        ],
        items: errors.map(e => ({ message: e.text })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoJsErrors
