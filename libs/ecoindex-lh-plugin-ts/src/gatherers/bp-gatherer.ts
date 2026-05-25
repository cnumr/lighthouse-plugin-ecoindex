import * as LH from 'lighthouse/types/lh.js'

import { Gatherer } from 'lighthouse'

class BPGatherer extends Gatherer {
  meta: LH.Gatherer.GathererMeta = {
    supportedModes: ['navigation', 'timespan', 'snapshot'] as const,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getArtifact(passContext: { driver: any }) {
    const { driver } = passContext
    const { executionContext } = driver

    function collectBPData() {
      if (typeof document === 'undefined') {
        return {
          serviceWorkerActive: false,
          inlineScriptDetails: [],
          inlineStyleDetails: [],
          animatedElementDetails: [],
          autoplayDetails: [],
          canvasDetails: [],
        }
      }

      const SNIPPET_LEN = 120

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function buildSelector(el: any) {
        let sel = el.tagName.toLowerCase()
        if (el.id) sel += `#${el.id}`
        if (el.classList.length > 0)
          sel += '.' + Array.from(el.classList).join('.')
        return sel
      }

      const serviceWorkerActive = Boolean(
        'serviceWorker' in navigator &&
        navigator.serviceWorker &&
        navigator.serviceWorker.controller,
      )

      const inlineScriptDetails = Array.from(
        document.querySelectorAll('script:not([src])'),
      )
        .filter(
          s =>
            s.getAttribute('type') !== 'application/ld+json' &&
            (s.textContent || '').trim().length > 0,
        )
        .map(s => ({
          snippet: (s.textContent || '').trim().slice(0, SNIPPET_LEN),
        }))

      const inlineStyleDetails = Array.from(document.querySelectorAll('style'))
        .filter(s => (s.textContent || '').trim().length > 0)
        .map(s => ({
          snippet: (s.textContent || '').trim().slice(0, SNIPPET_LEN),
        }))

      const animatedElementDetails = []
      for (const el of Array.from(document.querySelectorAll('*'))) {
        const cs = window.getComputedStyle(el)
        const hasAnimation =
          cs.animationName !== 'none' && cs.animationName !== ''
        const hasTransition =
          cs.transitionProperty !== 'none' &&
          cs.transitionProperty !== '' &&
          cs.transitionDuration !== '0s'
        if (hasAnimation || hasTransition) {
          const property = hasAnimation
            ? `animation: ${cs.animationName}`
            : `transition: ${cs.transitionProperty}`
          animatedElementDetails.push({ selector: buildSelector(el), property })
        }
      }

      const autoplayDetails = Array.from(
        document.querySelectorAll(
          'video[autoplay], audio[autoplay], video[preload="auto"], audio[preload="auto"]',
        ),
      ).map(el => ({
        selector: buildSelector(el),
        src: el.getAttribute('src') || '',
      }))

      const canvasDetails = Array.from(document.querySelectorAll('canvas')).map(
        el => ({ selector: buildSelector(el) }),
      )

      return {
        serviceWorkerActive,
        inlineScriptDetails,
        inlineStyleDetails,
        animatedElementDetails: animatedElementDetails.slice(0, 50),
        autoplayDetails,
        canvasDetails,
      }
    }

    const results = await executionContext.evaluate(collectBPData, { args: [] })
    return results
  }
}

export default BPGatherer
