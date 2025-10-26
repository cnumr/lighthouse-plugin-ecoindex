import * as LH from 'lighthouse/types/lh.js'

import { Gatherer } from 'lighthouse'
import { getVersion } from '../utils/index.js'

/**
 * DOM Informations Gatherer for Ecoindex metrics.
 *
 * Collects DOM size information according to Ecoindex specifications:
 * - Counts all DOM elements including Shadow DOM
 * - Excludes direct children of SVG elements (not recursive)
 * - Supports navigation, timespan, and snapshot modes
 *
 * The gatherer runs in the browser context during Lighthouse navigation.
 * It counts the number of DOM nodes to calculate the Ecoindex score.
 */
class DOMInformations extends Gatherer {
  meta: LH.Gatherer.GathererMeta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'],
  }

  /**
   * Collect DOM information artifacts.
   * Executes DOM counting logic in the browser context.
   *
   * @param passContext - Lighthouse driver and execution context
   * @returns DOM metrics including total count, body count, and SVG children count
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getArtifact(passContext: { driver: any }) {
    const { driver } = passContext
    const { executionContext } = driver

    /**
     * Count DOM elements and calculate Ecoindex metrics.
     *
     * According to Ecoindex specifications:
     * - All elements are counted recursively
     * - Shadow DOM elements are included
     * - Direct children of SVG elements are excluded (not counted twice)
     *
     * @param version - Plugin version number
     * @returns Object containing DOM metrics
     */
    function getDOMInformations(version: string) {
      if (document === undefined) return null

      /**
       * Recursively count all DOM elements including Shadow DOM.
       * Uses a visited Set to prevent infinite loops in circular references.
       *
       * @param element - Element to count
       * @param visited - Set of already visited elements to prevent cycles
       * @returns Total count of elements (including the element itself)
       */
      const countElements = (
        element: Element,
        visited = new Set<Element>(),
      ): number => {
        // Protection against infinite loops (circular references in DOM)
        if (visited.has(element)) {
          return 0
        }
        visited.add(element)

        // Count this element
        let count = 1

        // Recursively count all children
        Array.from(element.children).forEach(child => {
          count += countElements(child, visited)
        })

        // Also count elements in Shadow DOM (if present)
        if (element.shadowRoot) {
          Array.from(element.shadowRoot.children).forEach(sChild => {
            count += countElements(sChild, visited)
          })
        }
        return count
      }

      /**
       * Count direct children of SVG elements.
       *
       * According to Ecoindex methodology, direct children of SVG elements
       * should not be counted as DOM nodes. This encourages the use of SVG
       * over bitmap images.
       *
       * Logic:
       * - If element is an SVG, count only its direct children
       * - Return immediately to avoid double counting
       * - Search for other SVG elements in the tree
       * - Also search in Shadow DOM
       *
       * @param element - Element to check
       * @param visited - Set of already visited elements to prevent cycles
       * @returns Number of SVG children to exclude from count
       */
      const countSVGChildren = (
        element: Element,
        visited = new Set<Element>(),
      ): number => {
        // Protection against infinite loops
        if (visited.has(element)) {
          return 0
        }
        visited.add(element)

        let count = 0

        // If it's an SVG element, count only its direct children
        // (not recursive descendants, just the first level)
        if (element.tagName.toLowerCase() === 'svg') {
          count += element.children.length

          // Stop here for this SVG: we only count direct children
          // and don't recurse into children to avoid double counting
          return count
        }

        // For non-SVG elements, continue recursion to find other SVG elements
        Array.from(element.children).forEach(child => {
          count += countSVGChildren(child, visited)
        })

        // Also search in Shadow DOM for SVG elements
        if (element.shadowRoot) {
          Array.from(element.shadowRoot.children).forEach(sChild => {
            count += countSVGChildren(sChild, visited)
          })
        }

        return count
      }

      // Count all elements in the document (minus 1 for html element itself)
      const nodesCount = countElements(document.documentElement) - 1
      const nodesSVGChildsCount = countSVGChildren(document.documentElement)

      // Count all elements in body only
      const nodesBodyCount = countElements(document.body) - 1
      const nodesBodySVGChildsCount = countSVGChildren(document.body)

      // Return calculated metrics
      return {
        'lighthouse-plugin-ecoindex-core': version,
        nodesCount: nodesCount,
        nodesBodyCount: nodesBodyCount,
        nodesSVGChildsCount: nodesSVGChildsCount,
        nodesBodySVGChildsCount: nodesBodySVGChildsCount,
        // Total body nodes excluding SVG children (used for Ecoindex score)
        nodesBodyWithoutSVGChildsCount:
          nodesBodyCount - nodesBodySVGChildsCount,
        // Total document nodes excluding SVG children
        nodesWithoutSVGChildsCount: nodesCount - nodesSVGChildsCount,
      }
    }

    const results = await executionContext.evaluate(getDOMInformations, {
      args: [getVersion()],
    })

    return results
  }
}
export default DOMInformations
