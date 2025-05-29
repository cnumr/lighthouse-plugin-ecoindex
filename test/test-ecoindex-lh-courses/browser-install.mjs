import {
  checkIfMandatoryBrowserInstalled,
  initBuildId,
  installMandatoryBrowser,
} from 'lighthouse-plugin-ecoindex-courses/install-browser'

const Browser = {
  CHROME: 'chrome',
  CHROMEHEADLESSSHELL: 'chrome-headless-shell',
  CHROMIUM: 'chromium',
  FIREFOX: 'firefox',
  CHROMEDRIVER: 'chromedriver',
}
console.log('************************')
await initBuildId()
console.log('************************')

const chrome = await installMandatoryBrowser(Browser.CHROME)
const chromeHeadlessShell = await installMandatoryBrowser(
  Browser.CHROMEHEADLESSSHELL,
)
if (chrome && chromeHeadlessShell) {
  console.log('Browser installed')
  //   process.parentPort?.postMessage({
  //     type: 'complete',
  //     data: 'Browser installed',
  //   })
  //   process.exit(0)
} else {
  console.log('Browser not installed')
  //   process.parentPort?.postMessage({
  //     type: 'error',
  //     data: 'Browser not installed',
  //   })
  //   process.exit(1)
}
