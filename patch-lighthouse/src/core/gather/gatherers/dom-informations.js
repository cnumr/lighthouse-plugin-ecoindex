import * as LH from '../../../types/lh.js';

import BaseGatherer from '../base-gatherer.js';

class DOMInformations extends BaseGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'],
  }

  /**
   * @param {LH.Gatherer.Context} passContext
   * @return {Promise<LH.Artifacts.DOMInformations>}
   */
  async getArtifact(passContext) {
    const { driver } = passContext
    const { executionContext } = driver

    /**
     * @return {LH.Artifacts.DOMInformations}
     */
    function getDOMInformations() {
      // all
      // const nodesCount = document.querySelectorAll('*').length
      // const nodesSVGChildsCount = document.querySelectorAll('svg *').length

      // body
      const nodesBodyCount = document
        .getElementsByTagName('body')[0]
        .querySelectorAll('*').length
      const nodesBodySVGChildsCount = document
        .getElementsByTagName('body')[0]
        .querySelectorAll('svg *').length

      return {
        lighthousePluginEcoindex: '3.3.0',
        // nodesCount: nodesCount,
        nodesBodyCount: nodesBodyCount,
        // nodesSVGChildsCount: nodesSVGChildsCount,
        nodesBodySVGChildsCount: nodesBodySVGChildsCount,
        nodesBodyWithoutSVGChildsCount:
          nodesBodyCount - nodesBodySVGChildsCount,
        // nodesWithoutSVGChildsCount: nodesCount - nodesSVGChildsCount,
      }
    }

    // await driver.defaultSession.sendCommand('DOMInformations.enable')

    const results = await executionContext.evaluate(getDOMInformations, {
      args: [],
    })

    // await driver.defaultSession.sendCommand('DOMInformations.disable')

    return results
  }
}
export default DOMInformations
