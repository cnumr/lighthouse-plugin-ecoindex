import * as LH from 'lighthouse/types/lh.js'

import { Gatherer } from 'lighthouse'

class BPGatherer extends Gatherer {
  meta: LH.Gatherer.GathererMeta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'],
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getArtifact(passContext: { driver: any }) {
    const { driver } = passContext
    const { executionContext } = driver

    function collectBPData() {
      if (typeof document === 'undefined') {
        return {
          autoplaying: 0,
          serviceWorkerActive: false,
          canvasCount: 0,
          inlineScripts: 0,
          inlineStyles: 0,
          animatedElements: 0,
        }
      }

      const autoplaying = document.querySelectorAll(
        'video[autoplay], audio[autoplay], video[preload="auto"], audio[preload="auto"]',
      ).length

      const serviceWorkerActive = Boolean(
        'serviceWorker' in navigator &&
        navigator.serviceWorker &&
        navigator.serviceWorker.controller,
      )

      const canvasCount = document.querySelectorAll('canvas').length

      const inlineScripts = Array.from(
        document.querySelectorAll('script:not([src])'),
      ).filter(
        s =>
          s.getAttribute('type') !== 'application/ld+json' &&
          (s.textContent || '').trim().length > 0,
      ).length

      const inlineStyles = Array.from(
        document.querySelectorAll('style'),
      ).filter(s => (s.textContent || '').trim().length > 0).length

      let animatedElements = 0
      const allElements = Array.from(document.querySelectorAll('*'))
      for (const el of allElements) {
        const cs = window.getComputedStyle(el)
        const hasAnimation =
          cs.animationName !== 'none' && cs.animationName !== ''
        const hasTransition =
          cs.transitionProperty !== 'none' &&
          cs.transitionProperty !== '' &&
          cs.transitionDuration !== '0s'
        if (hasAnimation || hasTransition) animatedElements++
      }

      return {
        autoplaying,
        serviceWorkerActive,
        canvasCount,
        inlineScripts,
        inlineStyles,
        animatedElements,
      }
    }

    const results = await executionContext.evaluate(collectBPData, { args: [] })
    return results
  }
}

export default BPGatherer
