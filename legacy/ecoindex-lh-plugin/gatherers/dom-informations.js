import { Gatherer } from 'lighthouse'
import { getVersion } from '../utils/getter.js'
class DOMInformations extends Gatherer {
  meta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'],
  }

  async getArtifact(passContext) {
    const { driver } = passContext
    const { executionContext } = driver

    function getDOMInformations(version) {
      // all
      const nodesCount = document.querySelectorAll('*').length
      const nodesSVGChildsCount = document.querySelectorAll('svg *').length

      // body only
      const nodesBodyCount = document
        .getElementsByTagName('body')[0]
        .querySelectorAll('*').length
      const nodesBodySVGChildsCount = document
        .getElementsByTagName('body')[0]
        .querySelectorAll('svg *').length

      return {
        'lighthouse-plugin-ecoindex-legacy': version,
        nodesCount: nodesCount,
        nodesBodyCount: nodesBodyCount,
        nodesSVGChildsCount: nodesSVGChildsCount,
        nodesBodySVGChildsCount: nodesBodySVGChildsCount,
        nodesBodyWithoutSVGChildsCount:
          nodesBodyCount - nodesBodySVGChildsCount,
        nodesWithoutSVGChildsCount: nodesCount - nodesSVGChildsCount,
      }
    }

    // await driver.defaultSession.sendCommand('DOMInformations.enable')

    const results = await executionContext.evaluate(getDOMInformations, {
      args: [getVersion()],
    })

    // await driver.defaultSession.sendCommand('DOMInformations.disable')

    return results
  }
}
export default DOMInformations
