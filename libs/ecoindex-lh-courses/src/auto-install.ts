import { initBuildId, installMandatoryBrowser } from './install-browser.js'

import { Browser } from '@puppeteer/browsers'

/**
 * Auto installer by the script `postinstall` in `package.json` of the mandatory browser (from Puppeteer).
 */
const run = async () => {
  try {
    await initBuildId()
    const installedBrowserHeadless = await installMandatoryBrowser(
      Browser.CHROMEHEADLESSSHELL,
    )
    console.log(`Installed Browser`, installedBrowserHeadless)
    const installedBrowser = await installMandatoryBrowser(Browser.CHROME)
    console.log(`Installed Browser`, installedBrowser)
  } catch (error) {
    console.warn('Browser download failed', error)
  }
}

run()
