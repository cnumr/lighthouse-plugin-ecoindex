import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'

const MIN_CONTENT_LENGTH = 200
const MIN_CHARS_PER_LINE = 80

function isUnminified(content: string): boolean {
  if (content.length < MIN_CONTENT_LENGTH) return false
  const lines = content.split('\n').filter(l => l.trim().length > 0)
  if (lines.length === 0) return false
  const avgCharsPerLine = content.length / lines.length
  return avgCharsPerLine < MIN_CHARS_PER_LINE
}

class BPRwebMinification extends Audit {
  static get meta() {
    return {
      id: 'rweb-minification',
      title: 'RWEB_0077 - Minify inline CSS and JS',
      failureTitle: 'RWEB_0077 - Unminified inline CSS/JS detected',
      description: `Minify inline style and script blocks to reduce page weight. [See RWEB_0077](${refsURLS.rweb.rweb_0077.en})`,
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const html = artifacts.MainDocumentContent || ''

    const inlineStyles = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) ?? []
    const inlineScripts =
      html.match(/<script\b(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi) ?? []

    const unminifiedBlocks: Array<{ type: string; snippet: string }> = []
    for (const block of [...inlineStyles, ...inlineScripts]) {
      const contentMatch = block.match(/>([\s\S]*?)<\//i)
      if (contentMatch && isUnminified(contentMatch[1])) {
        const isStyle = block.toLowerCase().startsWith('<style')
        unminifiedBlocks.push({
          type: isStyle ? 'style' : 'script',
          snippet: contentMatch[1].trim().slice(0, 150),
        })
      }
    }

    return {
      score: unminifiedBlocks.length === 0 ? 1 : 0,
      displayValue:
        unminifiedBlocks.length === 0
          ? 'All inline assets appear minified'
          : `${unminifiedBlocks.length} unminified inline asset(s)`,
      numericValue: unminifiedBlocks.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          { key: 'type', label: 'Type', valueType: 'text' as const },
          {
            key: 'snippet',
            label: 'Content snippet',
            valueType: 'text' as const,
          },
        ],
        items: unminifiedBlocks,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebMinification
