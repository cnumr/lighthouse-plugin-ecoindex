const {
  Browser,
  install,
  getInstalledBrowsers,
  computeExecutablePath,
  detectBrowserPlatform,
} = require('@puppeteer/browsers')
const os = require('node:os')
const path = require('path')

/**
 * Madatory Puppeteer Browser.
 * see https://googlechromelabs.github.io/chrome-for-testing/#stable
 */
const PUPPETEER_BROWSER_BUILD_ID_FALLBACK = '128.0.6613.137'

const PUPPETEER_BROWSER_BUILD_ID_CURRENT =
  require('puppeteer-core/lib/cjs/puppeteer/revisions.js').PUPPETEER_REVISIONS[
    'chrome-headless-shell'
  ]

const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer')

console.log(`Puppeteer revisions`, PUPPETEER_BROWSER_BUILD_ID_CURRENT)

/**
 * Install Pupperteer browser.
 */
const installMandatoryBrowser = async () => {
  const { success, info } = (await import('log-symbols')).default

  console.log(
    `${info} Install ${Browser.CHROMEHEADLESSSHELL}@${PUPPETEER_BROWSER_BUILD_ID_CURRENT || PUPPETEER_BROWSER_BUILD_ID_FALLBACK + '-fallback'} start ⏳`,
  )

  const browserInstalled = await install({
    browser: Browser.CHROMEHEADLESSSHELL,
    buildId:
      PUPPETEER_BROWSER_BUILD_ID_CURRENT || PUPPETEER_BROWSER_BUILD_ID_FALLBACK,
    cacheDir,
  })
  console.log(`${success} Install finished 👋`)
  return browserInstalled
}

/**
 * Test if the Puppeteer Browser with the `buildId` equal to `PUPPETEER_BROWSER_BUILD_ID`.
 * @returns {boolean|null}
 */
const checkIfMandatoryBrowserInstalled = async () => {
  const { info } = (await import('log-symbols')).default
  const installedBrowsers = await getInstalledBrowsers({ cacheDir })
  console.log(
    `${info} ${Browser.CHROMEHEADLESSSHELL} ${PUPPETEER_BROWSER_BUILD_ID_CURRENT || PUPPETEER_BROWSER_BUILD_ID_FALLBACK + '-fallback'} is installed... ⏳`,
  )
  const mandatoryBrowserIsInstalled = installedBrowsers.filter(
    ib =>
      (ib.browser === Browser.CHROMEHEADLESSSHELL &&
        ib.buildId === PUPPETEER_BROWSER_BUILD_ID_CURRENT) ||
      PUPPETEER_BROWSER_BUILD_ID_FALLBACK,
  )

  console.debug(`Installed Puppeteer browsers list`, installedBrowsers)
  console.log(
    `Puppeteer mandatory browser is installed?`,
    mandatoryBrowserIsInstalled.length > 0,
  )
  return mandatoryBrowserIsInstalled.length > 0
    ? mandatoryBrowserIsInstalled[0]
    : null
}

/**
 * Get the executablePath of the Mandatory Browser.
 * @returns {string}
 */
const getMandatoryBrowserExecutablePath = async () => {
  try {
    const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer')
    const browser = Browser.CHROMEHEADLESSSHELL
    const platform = detectBrowserPlatform()
    const options = {
      browser,
      buildId:
        PUPPETEER_BROWSER_BUILD_ID_CURRENT['chrome-headless-shell'] ||
        PUPPETEER_BROWSER_BUILD_ID_FALLBACK,
      cacheDir,
      platform,
    }
    // console.debug(`computeExecutablePath(options)`, options)
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

module.exports = {
  installMandatoryBrowser,
  checkIfMandatoryBrowserInstalled,
  getMandatoryBrowserExecutablePath,
  PUPPETEER_BROWSER_BUILD_ID_FALLBACK,
  PUPPETEER_BROWSER_BUILD_ID_CURRENT,
}
