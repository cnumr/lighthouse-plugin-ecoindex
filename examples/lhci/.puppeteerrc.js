const { startFlow } = import('lighthouse')

const CustomGatherers = [
  './lighthouse-plugin-ecoindex/gatherers/nodes-minus-svg-gatherer.js',
  './lighthouse-plugin-ecoindex/gatherers/bp/print-css-gatherer.js',
  // ... ajoutez d'autres gatherers personnalisés si nécessaire
]
// https://pptr.dev/guides/configuration
// https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#puppeteerscript
/**
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */
module.exports = async (browser, context) => {
  // launch browser for LHCI
  const page = await browser.newPage()
  const session = await page.target().createCDPSession()
  const flow = await startFlow(page, {
    passes: [{ passName: 'defaultPass', gatherers: CustomGatherers }],
  })
  await flow.navigate(urls[0], {
    stepName: urls[0],
  })
  //   await page.goto(url, { waitUntil: 'networkidle0' })
  await startEcoindexPageMesure(page, session)
  await endEcoindexPageMesure()
  // close session for next run
  await page.close()
}

async function startEcoindexPageMesure(page, session) {
  page.setViewport({
    width: 1920,
    height: 1080,
  })
  await new Promise(r => setTimeout(r, 3 * 1000))
  const dimensions = await page.evaluate(() => {
    var body = document.body,
      html = document.documentElement

    var height = Math.max(
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
