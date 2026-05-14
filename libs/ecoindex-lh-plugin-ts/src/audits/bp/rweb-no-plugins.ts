import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const PLUGIN_MIME_TYPES = [
  'application/x-shockwave-flash',
  'application/x-silverlight',
  'application/x-silverlight-2',
  'application/java-applet',
  'application/x-java-applet',
]

const PLUGIN_PATTERN = new RegExp(
  `<(?:object|embed)\\b[^>]*type\\s*=\\s*["'](${PLUGIN_MIME_TYPES.map(t => t.replace(/\//g, '\\/')).join('|')})["'][^>]*>`,
  'gi',
)
const UIStrings = {
  title: 'Do not use browser plugins (Flash, Silverlight, Java)',
  failureTitle: 'Browser plugin detected (Flash, Silverlight, Java)',
  description:
    'Remove Flash, Silverlight and Java applet elements — these plugins are obsolete, insecure and unsupported.',
  displayValuePass: 'No browser plugins detected',
  displayValueFail: '{count} browser plugin(s) detected',
  colLabelPluginElement: 'Plugin element',
}
const str_ = createIcuMessageFn('audits/bp/rweb-no-plugins.js', UIStrings)

class BPRwebNoPlugins extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-plugins',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const html = artifacts.MainDocumentContent || ''
    const found = html.match(PLUGIN_PATTERN) ?? []
    const count = found.length

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
            key: 'element',
            label: str_(UIStrings.colLabelPluginElement),
            valueType: 'text' as const,
          },
        ],
        items: found.map(el => ({ element: el.slice(0, 150) })),
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoPlugins
