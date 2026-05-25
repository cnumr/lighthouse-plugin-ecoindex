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
  title: 'RWEB_0042 - Minimize inline assets',
  failureTitle: 'RWEB_0042 - Inline assets detected',
  description:
    'Minimize the use of inline scripts and styles. [See RWEB_0042](https://rweb.greenit.fr/en/fiches/RWEB_0042-externalize-css-and-javascript)',
  displayValuePass: 'No inline assets',
  displayValueFail: '{count} inline asset(s) found',
  colLabelType: 'Type',
  colLabelSnippet: 'Snippet',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-inline-assets.js', UIStrings)

class BPRwebNoInlineAssets extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-inline-assets',
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
    const { inlineScriptDetails, inlineStyleDetails } = artifacts.BPGatherer
    const totalInlineAssets =
      inlineScriptDetails.length + inlineStyleDetails.length

    const items = [
      ...inlineScriptDetails.map(d => ({ type: 'script', snippet: d.snippet })),
      ...inlineStyleDetails.map(d => ({ type: 'style', snippet: d.snippet })),
    ]

    return {
      score: totalInlineAssets <= 2 ? 1 : 0,
      displayValue:
        totalInlineAssets === 0
          ? str_(UIStrings.displayValuePass)
          : str_(UIStrings.displayValueFail, { count: totalInlineAssets }),
      numericValue: totalInlineAssets,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      ...(totalInlineAssets > 0 && {
        details: {
          type: 'table' as const,
          headings: [
            {
              key: 'type',
              label: str_(UIStrings.colLabelType),
              valueType: 'text' as const,
            },
            {
              key: 'snippet',
              label: str_(UIStrings.colLabelSnippet),
              valueType: 'text' as const,
            },
          ],
          items,
        } as LH.Audit.Details.Table,
      }),
    }
  }
}

export default BPRwebNoInlineAssets
