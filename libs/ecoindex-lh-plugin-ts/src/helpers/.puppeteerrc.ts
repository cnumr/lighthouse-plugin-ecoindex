import type { Browser, CDPSession, Page } from 'puppeteer-core'

import type { LHCIOptions } from '../types/index.js'

// https://pptr.dev/guides/configuration
// https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#puppeteerscript

/**
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCIOptions}} context
 */
export default async (
  browser: Browser,
  context: { url: string; options: LHCIOptions },
) => {
  // launch browser for LHCI
  const page = await browser.newPage()
  const session = await page.createCDPSession()
  try {
    await page.goto(context.url, { waitUntil: 'networkidle0' })
  } catch (error) {
    console.error('Error getting page:', error.message)
    console.error('Retry...')
    await page.goto(context.url)
  }
  await startEcoindexPageMesure(page, session)
  await endEcoindexPageMesure()
  // close session for next run
  await page.close()
}

async function startEcoindexPageMesure(page: Page, session: CDPSession) {
  page.setViewport({
    width: 1920,
    height: 1080,
  })
  await new Promise(r => setTimeout(r, 3 * 1000))
  const dimensions = await page.evaluate(() => {
    const body = document.body,
      html = document.documentElement

    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    )
    return {
      width: document.documentElement.clientWidth,
      height: height,
      deviceScaleFactor: window.devicePixelRatio,
    }
  })
  // console.log('dimensions', dimensions)
  // We need the ability to scroll like a user. There's not a direct puppeteer function for this, but we can use the DevTools Protocol and issue a Input.synthesizeScrollGesture event, which has convenient parameters like repetitions and delay to somewhat simulate a more natural scrolling gesture.
  // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-synthesizeScrollGesture
  await session.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 600,
    yDistance: -dimensions.height,
    speed: 1000,
  })
}

/**
 * End Ecoindex flow. Wait 3s.
 */
async function endEcoindexPageMesure() {
  await new Promise(r => setTimeout(r, 3 * 1000))
}
