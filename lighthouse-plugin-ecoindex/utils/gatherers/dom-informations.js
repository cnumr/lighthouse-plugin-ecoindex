import { Gatherer } from 'lighthouse'

class DOMInformations extends Gatherer {
  meta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'],
  }

  async getArtifact(passContext) {
    const { driver } = passContext
    const { executionContext } = driver

    function getDOMInformations() {
      // all
      const nodesCount = document.querySelectorAll('*').length
      const nodesSVGChildsCount = document.querySelectorAll('svg *').length

      // body
      const nodesBodyCount = document
        .getElementsByTagName('body')[0]
        .querySelectorAll('*').length
      const nodesBodySVGChildsCount = document
        .getElementsByTagName('body')[0]
        .querySelectorAll('svg *').length

      return {
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
      args: [],
    })

    // await driver.defaultSession.sendCommand('DOMInformations.disable')

    return results
  }
}
export default DOMInformations
