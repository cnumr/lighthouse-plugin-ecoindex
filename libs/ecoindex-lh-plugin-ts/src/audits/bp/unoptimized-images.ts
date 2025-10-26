import * as LH from 'lighthouse/types/lh.js'

import type { Artifacts, GathererArtifacts } from 'lighthouse'
import {
  ContextualBaseArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'
import { ScoreDisplayMode } from 'lighthouse/types/lhr/audit-result.js'

const roundUp = (decimal: number) => {
  return Math.ceil(decimal * 100) / 100
}

class UnoptimizedImage extends Audit {
  static get meta() {
    return {
      id: 'unoptimized-images',
      title:
        'Use feature policy to check for unoptimized images during development.',
      failureTitle:
        'Use feature policy to check for unoptimized images during development.',
      description:
        'Turn on feature policy for unoptimized-images to ensure your site is using the best performing images. See [Image policies for fast load times and more](https://web.dev/image-policies/?hl=en).',
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
      // The name of the artifact provides input to this audit.
      requiredArtifacts: ['OptimizedImages', 'ImageElements'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: Artifacts) {
    // Note: OptimizedImages and ImageElements may not be available in Lighthouse 13+
    type OptimizedImage = { url: string; jpegSize?: number }
    type ImageElement = {
      src: string
      naturalDimensions?: { height: number; width: number }
    }

    const images = ((
      artifacts as unknown as { OptimizedImages?: OptimizedImage[] }
    ).OptimizedImages || []) as OptimizedImage[]
    const imageElements = ((
      artifacts as unknown as { ImageElements?: ImageElement[] }
    ).ImageElements || []) as ImageElement[]
    const headers = images.map((image: OptimizedImage) => {
      const element = imageElements.find(
        (e: ImageElement) => e.src === image.url,
      )
      // Calculate byte-per-pixel ratio using lighthouse's guidance on jpeg size and webp size
      if (image['jpegSize'] === undefined) return
      if (element === undefined) return
      if (element.naturalDimensions === undefined) return
      const lossyBppRatio =
        (image['jpegSize'] - 1024) /
        (element.naturalDimensions['height'] *
          element.naturalDimensions['width'])
      const losslessBppRatio =
        (image['jpegSize'] - 10240) /
        (element.naturalDimensions['height'] *
          element.naturalDimensions['width'])
      return {
        url: image.url,
        lossyPolicyHeader: `unoptimized-lossy-images *(${roundUp(lossyBppRatio)});`,
        losslessPolicyHeader: `unoptimized-lossless-images *(${roundUp(losslessBppRatio)});`,
      }
    })

    return {
      score:
        imageElements.length === 0
          ? 1
          : 1 - images.length / imageElements.length,
      displayValue: `Found ${images.length} unoptimized images that can be caught during development if you use the recommended feature policy headers`,
      numericValue: images.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table',
        headings: [
          {
            key: 'url',
            label: 'image URL',
            valueType: 'url',
          },
          {
            key: 'lossyPolicyHeader',
            label: 'Recommended Feature Policy header for lossy compression',
            valueType: 'text',
          },
          {
            key: 'losslessPolicyHeader',
            label: 'Recommended Feature Policy header for lossless compression',
            valueType: 'text',
          },
        ],
        items: headers.filter(
          (
            n,
          ): n is {
            url: string
            lossyPolicyHeader: string
            losslessPolicyHeader: string
          } => n !== undefined,
        ),
      } as LH.Audit.Details.Table,
    }
  }
}

export default UnoptimizedImage
