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
const PUPPETEER_BROWSER_BUILD_ID = '128.0.6613.137'

const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer')

/**
 * Install Pupperteer browser.
 */
const installMandatoryBrowser = async () => {
  const { success, info } = (await import('log-symbols')).default
  console.log(
    `${info} Install ${Browser.CHROMEHEADLESSSHELL}@${PUPPETEER_BROWSER_BUILD_ID} start ⏳`,
  )

  await install({
    browser: Browser.CHROMEHEADLESSSHELL,
    buildId: PUPPETEER_BROWSER_BUILD_ID,
    cacheDir,
  })
  console.log(`${success} Install finished 👋`)
}

/**
 * Test if the Puppeteer Browser with the `buildId` equal to `PUPPETEER_BROWSER_BUILD_ID`.
 * @returns {boolean|null}
 */
const checkIfMandatoryBrowserInstalled = async () => {
  const { info } = (await import('log-symbols')).default
  const installedBrowsers = await getInstalledBrowsers({ cacheDir })
  console.log(
    `${info} ${Browser.CHROMEHEADLESSSHELL} ${PUPPETEER_BROWSER_BUILD_ID} is installed... ⏳`,
  )
  const mandatoryBrowserIsInstalled = installedBrowsers.filter(
    ib =>
      ib.browser === Browser.CHROMEHEADLESSSHELL &&
      ib.buildId === PUPPETEER_BROWSER_BUILD_ID,
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
      buildId: PUPPETEER_BROWSER_BUILD_ID,
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
  PUPPETEER_BROWSER_BUILD_ID,
}
