import type * as LH from 'lighthouse/types/lh.js'

import { Auth } from '../types/index.js'
import { exit } from 'process'
import logSymbols from 'log-symbols'
import puppeteer from 'puppeteer'

/**
 * Init Ecoindex flow. Wait 3s, then navigate to bottom of page.
 * @param {puppeteer.Page} page
 * @param {puppeteer.CDPSession} session
 */
async function startEcoindexPageMesure(
  page: puppeteer.Page,
  session: puppeteer.CDPSession,
) {
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
 * @param {LH.UserFlow} flow
 * @param {boolean} [snapshotEnabled=false]
 */
async function endEcoindexPageMesure(
  flow: LH.UserFlow,
  snapshotEnabled = false,
) {
  await new Promise(r => setTimeout(r, 3 * 1000))
  if (snapshotEnabled) await flow.snapshot()
}

/**
 * Authenticate process
 * @param {PUPPETEER.Page} page
 * @param {PUPPETEER.Browser} browser
 * @param {PUPPETEER.CDPSession} session
 * @param {LH.UserFlow} flow
 * @param {object} authenticate
 */
async function authenticateEcoindexPageMesure(
  page: puppeteer.Page,
  authenticate: Auth,
  browser: puppeteer.Browser,
  session: puppeteer.CDPSession,
  flow: LH.UserFlow,
) {
  await page.setViewport({
    width: 1920,
    height: 1080,
  })
  try {
    await page.type(authenticate.user.target, authenticate.user.value)
    const searchValue = await page.$eval(
      authenticate.user.target,
      el => (el as HTMLInputElement).value,
    )
    console.log(
      `${logSymbols.info} (test) ${authenticate.user.target} setted with`,
      searchValue,
    )

    await page.type(authenticate.pass.target, authenticate.pass.value)
    await page.click('[type="submit"]')
    await page.waitForNavigation()
    const u = page.url()

    console.log(`${logSymbols.info} Authenticated! Landed on`, u)
    // try to mesure landed page, NOT WORKING.
    // await flow.navigate(u, { name: 'Navigate only' })
    startEcoindexPageMesure(page, session)
    endEcoindexPageMesure(flow)
    await flow.snapshot({ name: 'Landed page' })
    return u
  } catch (error) {
    console.error(`${logSymbols.error} Connection failed!`)
    console.error(error)
    exit(1)
  }
}
export {
  authenticateEcoindexPageMesure,
  endEcoindexPageMesure,
  startEcoindexPageMesure,
}
