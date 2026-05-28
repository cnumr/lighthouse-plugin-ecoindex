import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'
const UIStrings = {
  title: 'No JavaScript runtime errors in console',
  failureTitle: 'JavaScript runtime errors detected in console',
  description:
    'Fix JavaScript errors detected at runtime. These are console.error() calls recorded during page load and indicate broken features. Unlike static linting (RWEB_0043), this check does not cover code style or syntax issues.',
  displayValuePass: 'No JavaScript runtime errors',
  displayValueFail: '{count} JavaScript runtime error(s)',
  colLabelErrorMessage: 'Error message',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-js-errors.js', UIStrings)

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
        count === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count }),
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
            label: str_(UIStrings.colLabelErrorMessage),
            valueType: 'text' as const,
          },
        ],
        items: errors.map(e => ({ message: e.text })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoJsErrors
