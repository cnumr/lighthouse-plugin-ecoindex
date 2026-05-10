import * as LH from 'lighthouse/types/lh.js'

import {
  ContextualBaseArtifacts,
  GathererArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import refsURLS from './refs-urls.js'
import { createIcuMessageFn } from 'lighthouse/core/lib/i18n/i18n.js'

const BITMAP_EXTENSIONS = /\.(png|jpe?g|bmp|webp)(\?[^"']*)?["']/i

// Structural containers where bitmap images are most likely decorative/UI
const UI_CONTAINER_RE = /<(header|nav|footer|button)\b[^>]*>([\s\S]*?)<\/\1>/gi
const UIStrings = {
  title: 'RWEB_0038 - Avoid bitmap images for UI elements',
  failureTitle: 'RWEB_0038 - Bitmap images in UI containers detected',
}
const str_ = createIcuMessageFn(import.meta.url, UIStrings)

class BPRwebNoBitmapUi extends Audit {
  static get meta() {
    return {
      id: 'rweb-no-bitmap-ui',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: `Replace bitmap images (PNG/JPG/WebP) in headers, navs, footers and buttons with SVG or CSS. [See RWEB_0038](${refsURLS.rweb.rweb_0038.en})`,
      requiredArtifacts: ['MainDocumentContent'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: LH.Artifacts) {
    const html = artifacts.MainDocumentContent || ''

    const violations: Array<{ url: string; container: string }> = []
    const containers = html.match(UI_CONTAINER_RE) ?? []
    for (const container of containers) {
      const containerTag = container.match(/^<(\w+)/i)?.[1] ?? 'unknown'
      const imgs = container.match(/<img\b[^>]*>/gi) ?? []
      for (const img of imgs) {
        if (BITMAP_EXTENSIONS.test(img)) {
          const srcMatch = img.match(/src\s*=\s*["']([^"']+)["']/i)
          violations.push({
            url: srcMatch ? srcMatch[1] : img.slice(0, 80),
            container: containerTag,
          })
        }
      }
    }

    const count = violations.length
    return {
      score: count === 0 ? 1 : 0,
      displayValue:
        count === 0
          ? 'No bitmap images in UI containers'
          : `${count} bitmap image(s) in UI containers`,
      numericValue: count,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          { key: 'url', label: 'Image URL', valueType: 'url' as const },
          { key: 'container', label: 'Container', valueType: 'text' as const },
        ],
        items: violations,
      } as LH.Audit.Details.Table,
    }
  }
}

export default BPRwebNoBitmapUi
