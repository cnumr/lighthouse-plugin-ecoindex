import {
  Browser,
  InstalledBrowser,
  computeExecutablePath,
  detectBrowserPlatform,
  getInstalledBrowsers,
  install,
} from '@puppeteer/browsers'

import logSymbols from 'log-symbols'
import os from 'node:os'
import path from 'path'

/**
 * Madatory Puppeteer Browser.
 * see https://googlechromelabs.github.io/chrome-for-testing/#stable
 */
const PUPPETEER_BROWSER_BUILD_ID_FALLBACK: string = '134.0.6998.35'

let PUPPETEER_BROWSER_BUILD_ID_CURRENT: string =
  PUPPETEER_BROWSER_BUILD_ID_FALLBACK

async function initBuildId() {
  try {
    const puppeteerCore = await import('puppeteer-core')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PUPPETEER_BROWSER_BUILD_ID_CURRENT = (puppeteerCore as any)
      .PUPPETEER_REVISIONS['chrome-headless-shell']
    console.log(`Puppeteer revisions`, PUPPETEER_BROWSER_BUILD_ID_CURRENT)
  } catch (error) {
    console.warn(
      'Failed to get build ID from puppeteer-core, using fallback:',
      error,
    )
  }
}
// ;(async () => {
//   await initBuildId()
// })()

const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer')

/**
 * Install Pupperteer browser.
 */
const installMandatoryBrowser = async (
  type: Browser,
): Promise<InstalledBrowser> => {
  const { success, info } = logSymbols
  await initBuildId()

  console.log(
    `${info} Install ${type}@${PUPPETEER_BROWSER_BUILD_ID_CURRENT || PUPPETEER_BROWSER_BUILD_ID_FALLBACK + '-fallback'} start ⏳`,
  )

  const browserInstalled = await install({
    browser: type,
    buildId:
      PUPPETEER_BROWSER_BUILD_ID_CURRENT || PUPPETEER_BROWSER_BUILD_ID_FALLBACK,
    cacheDir,
  })
  console.log(`${success} Install finished 👋`)
  return browserInstalled
}

/**
 * Test if the Puppeteer Browser with the `buildId` equal to `PUPPETEER_BROWSER_BUILD_ID`.
 * @param {boolean} debug - If true, print debug information.
 * @returns {InstalledBrowser|null}
 */
const checkIfMandatoryBrowserInstalled = async (
  debug: boolean = false,
): Promise<InstalledBrowser | ''> => {
  const { info } = logSymbols
  await initBuildId()
  const installedBrowsers = await getInstalledBrowsers({ cacheDir })
  console.log(
    `${info} ${Browser.CHROMEHEADLESSSHELL} ${PUPPETEER_BROWSER_BUILD_ID_CURRENT || PUPPETEER_BROWSER_BUILD_ID_FALLBACK + '-fallback'} is installed... ⏳`,
  )
  const mandatoryBrowserIsInstalled = installedBrowsers.filter(
    ib =>
      ib.browser === Browser.CHROMEHEADLESSSHELL &&
      ib.buildId === PUPPETEER_BROWSER_BUILD_ID_CURRENT,
  )
  if (debug) {
    console.debug(`Installed Puppeteer browsers list`, installedBrowsers)
  }
  console.log(
    `Puppeteer mandatory browser is installed?`,
    mandatoryBrowserIsInstalled.length > 0,
  )
  if (mandatoryBrowserIsInstalled.length > 0) {
    return mandatoryBrowserIsInstalled[0]
  } else {
    return null
  }
}

/**
 * Get the executablePath of the Mandatory Browser.
 * @returns {string}
 */
const getMandatoryBrowserExecutablePath = async (
  debug: boolean = false,
): Promise<string> => {
  await initBuildId()
  try {
    const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer')
    const browser = Browser.CHROMEHEADLESSSHELL
    const platform = detectBrowserPlatform()
    const options = {
      browser,
      buildId:
        PUPPETEER_BROWSER_BUILD_ID_CURRENT ||
        PUPPETEER_BROWSER_BUILD_ID_FALLBACK,
      cacheDir,
      platform,
    }
    if (debug) {
      console.debug(`computeExecutablePath(options)`, options)
    }
    const mandatoryBrowserExecutablePath = computeExecutablePath(options)
    // const installedBrowsers = await getInstalledBrowsers({ cacheDir })
    // console.debug(`Installed Puppeteer browsers list`, installedBrowsers)
    if (mandatoryBrowserExecutablePath === '')
      throw new Error('Browser not found.')
    const outputArr = mandatoryBrowserExecutablePath.split(path.sep)
    // outputArr.pop()
    const output = outputArr.join(path.sep)
    // console.log(`MandatoryBrowserExecutablePath`, output)
    return output
  } catch (error) {
    throw new Error(`Browser not found: ${error}`)
  }
}

export {
  PUPPETEER_BROWSER_BUILD_ID_CURRENT,
  PUPPETEER_BROWSER_BUILD_ID_FALLBACK,
  checkIfMandatoryBrowserInstalled,
  getMandatoryBrowserExecutablePath,
  initBuildId,
  installMandatoryBrowser,
}
