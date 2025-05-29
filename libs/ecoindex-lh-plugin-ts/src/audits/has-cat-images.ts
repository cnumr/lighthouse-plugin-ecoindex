import type { Artifacts, GathererArtifacts } from 'lighthouse'
import {
  ContextualBaseArtifacts,
  UniversalBaseArtifacts,
} from 'lighthouse/types/artifacts.js'

import { Audit } from 'lighthouse'

class CatAudit extends Audit {
  static get meta() {
    return {
      id: 'has-cat-images-id',
      title: 'Page has least one cat image',
      failureTitle: 'Page does not have at least one cat image',
      description:
        'Pages should have lots of cat images to keep users happy. ' +
        'Consider adding a picture of a cat to your page improve engagement.',
      requiredArtifacts: ['ImageElements'] as (
        | keyof UniversalBaseArtifacts
        | keyof ContextualBaseArtifacts
        | keyof GathererArtifacts
      )[],
    }
  }

  static audit(artifacts: Artifacts) {
    // Artifacts requested in `requiredArtifacts` above are passed to your audit.
    // See the "API -> Plugin Audits" section below for what artifacts are available.
    const images = artifacts.ImageElements
    const catImages = images.filter(image =>
      image.src.toLowerCase().includes('cat'),
    )

    return {
      // Give users a 100 if they had a cat image, 0 if they didn't.
      score: catImages.length > 0 ? 1 : 0,
      // Also return the total number of cat images that can be used by report JSON consumers.
      numericValue: catImages.length,
      numericUnit: 'unitless' as
        | 'unitless'
        | 'byte'
        | 'millisecond'
        | 'element',
    }
  }
}

export default CatAudit
