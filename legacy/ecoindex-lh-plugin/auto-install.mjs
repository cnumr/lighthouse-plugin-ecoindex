import { installMandatoryBrowser } from './install-browser.cjs'

/**
 * Auto installer by the script `postinstall` in `package.json` of the mandatory browser (from Puppeteer).
 */
try {
    const installedBrowser = await installMandatoryBrowser();
    console.log(`Installed Browser`, installedBrowser)
} catch (error) {
    console.warn('Browser download failed', error);
}