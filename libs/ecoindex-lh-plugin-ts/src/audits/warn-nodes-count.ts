import * as LH from 'lighthouse/types/lh.js'

import { Audit } from 'lighthouse'
import { DOMInformationsArtifacts } from '../types/index.js'
import commons from './commons.js'
import { getEcoindexNodes } from '../utils/calcul-helper.js'
import refsURLS from './bp/refs-urls.js'

class WarnNodesCount extends Audit {
  static get meta() {
    return {
      id: 'warn-nodes-count',
      title:
        'Information ⚠️ : Ecoindex nodes number might be ≠ Lighthouse nodes number.',
      failureTitle:
        'Information ⚠️ : Ecoindex nodes number might be ≠ Lighthouse nodes number.',
      description: `Explication: Counting all the DOM nodes on the page, excluding the child nodes of \`svg\` elements, gives us the number of DOM elements on the page. This method encourages you not to replace a complex svg with an image, simply to obtain a better score. [See Ecoindex, Analysis methodology](${refsURLS.ecoindex.method.en})`,

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: commons.supportedModes,
    }
  }

  static async audit(artifacts: LH.Artifacts) {
    const value = await getEcoindexNodes(artifacts as DOMInformationsArtifacts)
    const DOMStats = artifacts.DOMStats.totalBodyElements

    return {
      score: value !== DOMStats ? 0.8 : 1,
      displayValue: `Ecoindex: ${value} - Lighthouse: ${DOMStats}`,
      // displayValue: `DOMInformations: ${JSON.stringify(
      //   (artifacts as DOMInformationsArtifacts).DOMInformations,
      //   null,
      //   2,
      // )}`,
      numericValue: value,
      numericUnit: 'DOM elements' as 'element',
    }
  }
}

export default WarnNodesCount
