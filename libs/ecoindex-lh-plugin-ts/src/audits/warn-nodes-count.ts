import * as LH from 'lighthouse/types/lh.js'

import { Audit } from 'lighthouse'
import { DOMInformationsArtifacts } from '../types/index.js'
import commons from './commons.js'
import { getEcoindexNodes } from '../utils/calcul-helper.js'
import refsURLS from './bp/refs-urls.js'

const warnDescriptionEN =
  'Green IT would like web service designers to favor the use of SVGs over bitmap images (PNG, GIF, JPEG), which weigh down the page, whenever possible. To encourage this practice, Green IT has adapted its DOM calculation method, which explains why the results of Lighthouse and Ecoindex calculations are sometimes different. ' +
  "1st difference: In order to maximize the use of SVG, which impacts the DOM, Green IT's calculation method excludes the sub-elements of an SVG tag from the calculation. Lighthouse, on the other hand, does not exclude any element ⇒ DOM.Lighthouse > DOM.Ecoindex. " +
  '2nd difference: Lighthouse performs its calculation when the page is rendered, but does not take into account elements added or modified in JavaScript, whereas the Ecoindex calculation engine does ⇒ DOM.Lighthouse < DOM.Ecoindex. '

class WarnNodesCount extends Audit {
  static get meta() {
    return {
      id: 'warn-nodes-count',
      title:
        'Information ⚠️ : Ecoindex nodes number might be ≠ Lighthouse nodes number.',
      failureTitle:
        'Information ⚠️ : Ecoindex nodes number might be ≠ Lighthouse nodes number.',
      description: `${warnDescriptionEN} [Learn more about the Ecoindex, Analysis methodology](${refsURLS.ecoindex.method.en})`,

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: commons.requiredArtifacts,
      supportedModes: commons.supportedModes,
    }
  }

  static async audit(artifacts: LH.Artifacts) {
    const value = await getEcoindexNodes(artifacts as DOMInformationsArtifacts)

    // Note: DOMStats is no longer available in Lighthouse 13+
    // We can only display the Ecoindex value as an informational warning
    return {
      score: 1, // Always pass, this is just an informational warning
      displayValue: `Ecoindex nodes: ${value}`,
      numericValue: value,
      numericUnit: 'DOM elements' as 'element',
    }
  }
}

export default WarnNodesCount
