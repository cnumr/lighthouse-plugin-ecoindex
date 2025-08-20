import * as LH from 'lighthouse/types/lh.js'

import { Gatherer } from 'lighthouse'
import { getVersion } from '../utils/index.js'

class DOMInformations extends Gatherer {
  meta: LH.Gatherer.GathererMeta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'],
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getArtifact(passContext: { driver: any }) {
    const { driver } = passContext
    const { executionContext } = driver

    function getDOMInformations(version: string) {
      if (document === undefined) return null

      // Fonction récursive pour compter tous les éléments, y compris dans les shadow roots
      const countElements = (
        element: Element,
        visited = new Set<Element>(),
      ): number => {
        // Protection contre les boucles infinies
        if (visited.has(element)) {
          return 0
        }
        visited.add(element)

        let count = 1
        Array.from(element.children).forEach(child => {
          count += countElements(child, visited)
        })

        if (element.shadowRoot) {
          Array.from(element.shadowRoot.children).forEach(sChild => {
            count += countElements(sChild, visited)
          })
        }
        return count
      }

      // Fonction pour compter les éléments SVG, y compris dans les shadow roots
      const countSVGElements = (
        element: Element,
        visited = new Set<Element>(),
      ): number => {
        // Protection contre les boucles infinies
        if (visited.has(element)) {
          return 0
        }
        visited.add(element)

        let count = 0

        // Si l'élément est un SVG, on compte tous ses descendants
        if (element.tagName.toLowerCase() === 'svg') {
          // Fonction récursive pour compter tous les descendants de l'élément SVG
          const countAllDescendants = (
            el: Element,
            descendantsVisited = new Set<Element>(),
          ): number => {
            // Protection contre les boucles infinies dans les descendants
            if (descendantsVisited.has(el)) {
              return 0
            }
            descendantsVisited.add(el)

            let descendantCount = 0
            Array.from(el.children).forEach(child => {
              descendantCount +=
                1 + countAllDescendants(child, descendantsVisited) // +1 pour l'enfant + ses descendants
            })
            return descendantCount
          }
          count += countAllDescendants(element)
        }

        // On continue la récursion pour tous les enfants (pour trouver d'autres SVG)
        Array.from(element.children).forEach(child => {
          count += countSVGElements(child, visited)
        })

        // On vérifie aussi dans les shadow roots
        if (element.shadowRoot) {
          Array.from(element.shadowRoot.children).forEach(sChild => {
            count += countSVGElements(sChild, visited)
          })
        }

        return count
      }

      // Comptage pour tout le document
      const nodesCount = countElements(document.documentElement) - 1
      const nodesSVGChildsCount = countSVGElements(document.documentElement)

      // Comptage pour le body uniquement
      // const body = document.getElementsByTagName('body')[0]
      const nodesBodyCount = countElements(document.body) - 1
      const nodesBodySVGChildsCount = countSVGElements(document.body)

      return {
        'lighthouse-plugin-ecoindex-core': version,
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
