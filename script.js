import puppeteer from 'puppeteer'
import { startFlow } from 'lighthouse'
import { writeFileSync } from 'fs'

async function captureReport() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
  })

  const page = await browser.newPage()
  // Get a session handle to be able to send protocol commands to the page.
  const session = await page.target().createCDPSession()

  const config = {
    configContext: {
      settingsOverrides: {
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
        },
        formFactor: 'desktop',
      },
    },
    extends: 'lighthouse:default',
    plugins: ['lighthouse-plugin-ecoindex'],
  }
  const testUrl = 'https://www.ecoindex.fr'
  const flow = await startFlow(page, { config })
  // Navigate with a URL
  // await flow.navigate('https://example.com');
  await flow.navigate(testUrl)

  // await flow.navigate(async () => {
  //     await page.click('#didomi-notice-agree-button');
  // });
  // Interaction-initiated navigation via a callback function
  // await flow.navigate(async () => {
  //     await page.click('a');
  // });

  // Navigate with startNavigation/endNavigation
  await flow.startTimespan()
  await page.goto(testUrl, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 3 * 1000))
  // We need the ability to scroll like a user. There's not a direct puppeteer function for this, but we can use the DevTools Protocol and issue a Input.synthesizeScrollGesture event, which has convenient parameters like repetitions and delay to somewhat simulate a more natural scrolling gesture.
  // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-synthesizeScrollGesture
  await session.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 600,
    yDistance: -2500,
    speed: 1000,
  })
  // await page.click('#didomi-notice-agree-button');
  await new Promise(r => setTimeout(r, 3 * 1000))
  await flow.endTimespan()

  await browser.close()

  // Get the comprehensive flow report.
  const reportHtmlPath = './reports/lighthouse_report.html'
  writeFileSync(reportHtmlPath, await flow.generateReport())
  // Save results as JSON.
  const reportJsonPath = './reports/lighthouse_report.json'
  writeFileSync(
    reportJsonPath,
    JSON.stringify(await flow.createFlowResult(), null, 2),
  )

  // console.log('Rapport HTML enregistré à :', reportHtmlPath);
  // console.log('Rapport JSON enregistré à :', reportJsonPath);
}

captureReport()
