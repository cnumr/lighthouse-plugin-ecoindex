import * as LH from 'lighthouse/types/lh.js'

import { Audit, GathererArtifacts } from 'lighthouse'
import {
  ContextualBaseArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { ScoreDisplayMode } from 'lighthouse/types/lhr/audit-result.js'
import UrlUtils from 'lighthouse/core/lib/url-utils.js'

class BadlySizedImage extends Audit {
  static get meta() {
    return {
      id: 'badly-sized-images',
      title: 'Do not resize images in the browser',
      failureTitle: 'Images are resized in the browser!',
      description:
        'Do not resize images using the HTML attributes height and width. ' +
        'This sends images in their original size, wasting bandwidth and processor power. ' +
        'A PNG-24 image measuring 350 x 300 px is 41 KB. ' +
        'If you were to resize the same image file in HTML and display it as a 70 x 60 px thumbnail, it would still be 41 KB, when in fact it should be no more than 3 KB! ' +
        'This means 38 KB downloaded for nothing. The best solution is to resize images using software such as Photoshop, without using HTML. ' +
        "When the content added by website users has no specific added value, it's best to prevent them from inserting images using a WYSIWYG editor, such as CKEditor.",
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
      // The name of the artifact provides input to this audit.
      requiredArtifacts: ['ImageElements'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }
  static audit(artifacts: LH.Artifacts) {
    const imageElements = artifacts.ImageElements
    const imageToAudit = imageElements.filter(image => {
      // - filter out css background images since we don't have a reliable way to tell if it's a
      //   sprite sheet, repeated for effect, etc
      // - filter out images that don't have following properties:
      //   networkRecord, width, height, `object-fit` property
      // - filter all svgs as they have no natural dimensions to audit
      // - filter out images that have falsy naturalWidth or naturalHeight
      return (
        !image.isCss &&
        UrlUtils.guessMimeType(image.src) !== 'image/svg+xml' &&
        image.naturalDimensions &&
        image.naturalDimensions.height > 5 &&
        image.naturalDimensions.width > 5 &&
        image.displayedWidth &&
        image.displayedHeight &&
        image.computedStyles.objectFit === 'fill'
      )
    }) as LH.Artifacts.ImageElement[]
    const badSizedImages = imageToAudit.filter(element => {
      const tolerance = 0.05 // 5% de tolérance
      const minWidth = element.naturalDimensions.width * (1 - tolerance)
      const maxWidth = element.naturalDimensions.width * (1 + tolerance)
      return (
        element.displayedWidth < minWidth || element.displayedWidth > maxWidth
      )
    })
    const headers = badSizedImages.map(element => {
      return {
        url: element.src,
        message: `Image size in browser ${element.displayedWidth}x${element.displayedHeight}, original size ${element.naturalDimensions.width}x${element.naturalDimensions.height}.`,
      }
    })
    return {
      score:
        headers.length === 0 ? 1 : 1 - headers.length / imageElements.length,
      displayValue: `Found ${headers.length} resized image(s)`,
      numericValue: headers.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
      details: {
        type: 'table' as const,
        headings: [
          {
            key: 'url',
            label: 'image URL',
            valueType: 'url',
          },
          {
            key: 'message',
            label: 'Image(s) resized',
            valueType: 'text',
          },
        ],
        items: headers.filter(n => n !== undefined),
      } as LH.Audit.Details.Table,
    }
  }
}
export default BadlySizedImage
