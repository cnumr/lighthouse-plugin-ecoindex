import { Audit } from 'lighthouse'
// https://fetch.spec.whatwg.org/#concept-request-destination
// const allowedTypes = new Set([
//   'font',
//   'image',
//   'script',
//   'serviceworker',
//   'style',
//   'worker',
// ])
const roundUp = decimal => {
  return Math.ceil(decimal * 100) / 100
}
class UnoptimizedImage extends Audit {
  static get meta() {
    return {
      id: 'unoptimized-images',
      title: 'Optimizing bitmap images',
      failureTitle: 'Bitmap images have not been optimized!',
      description:
        'Bitmap images often make up most of the bytes downloaded, just ahead of CSS and JavaScript libraries. ' +
        'Optimizing them therefore has a considerable impact on the bandwidth consumed.',
      scoreDisplayMode: 'numeric',
      // The name of the artifact provides input to this audit.
      requiredArtifacts: ['OptimizedImages', 'ImageElements'],
    }
  }
  static audit(artifacts) {
    const images = artifacts.OptimizedImages
    const imageElements = artifacts.ImageElements
    const headers = images.map(image => {
      const element = imageElements.find(e => e.src === image.url)

      //   Calculate byte-per-pixel ratio using lighthouse's guidance on jpeg size and webp size
      const lossyBppRatio =
        (image['jpegSize'] - 1024) /
        (element.naturalDimensions.height * element.naturalDimensions.width)
      const losslessBppRatio =
        (image['jpegSize'] - 10240) /
        (element.naturalDimensions.height * element.naturalDimensions.width)
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
      displayValue: `${images.length} image(s) found to probably optimize`,
      numericValue: images.length,
      numericUnit: 'unitless',
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
        items: headers,
      },
    }
  }
}
export default UnoptimizedImage
