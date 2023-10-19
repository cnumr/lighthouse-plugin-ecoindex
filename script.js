import { writeFileSync } from 'fs'
import { desktopConfig, startFlow } from 'lighthouse'
import { scrollPageToBottom } from 'puppeteer-autoscroll-down'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
//import CatAudit from './lighthouse-plugin-cats/plugin.js'
//import SoftNavigationPlugin from './lighthouse-plugin-soft-navigation/plugin.js'

// Setup the browser and Lighthouse.
const browser = await puppeteer.use(StealthPlugin()).launch({
  headless: false,
  executablePath: process.env.CHROME_PATH,
  args: ['--enable-experimental-web-platform-features'],
})
const page = await browser.newPage()

await page.setViewport({
  width: 1024,
  height: 768,
})

const options = {
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
  plugins: ['lighthouse-plugin-cats'],
}

//const flow = await startFlow(page, {
//    config: desktopConfig,
//    extends: 'lighthouse:default',
//    plugins: [SoftNavigationPlugin]
//  });
//  page.setViewport({
//    width: 1920,
//    height: 1080,
//  })

const flow = await startFlow(page, options)

await flow.navigate(
  'https://www.manomano.fr/p/piscine-tubulaire-bestway-power-steel-549-x-274-x-122-m-30636057',
  options,
)
//
await flow.startNavigation()
await page.click('#didomi-notice-agree-button')
//await flow.endTimespan();

// Phase 3 - Analyze the new state.
//await flow.snapshot();

let lastPosition = await scrollPageToBottom(page, {
  size: 1000,
  delay: 300,
})

//await flow.navigate(async () => {
//  let lastPosition = await scrollPageToBottom(page, {
//    size: 1000,
//    delay: 300,
//  })
//})

//await flow.snapshot();
await flow.endNavigation()

// Get the comprehensive flow report.
const reportHtmlPath = './reports/lighthouse_report.html'
writeFileSync(reportHtmlPath, await flow.generateReport())
// Save results as JSON.
const reportJsonPath = './reports/lighthouse_report.json'
writeFileSync(
  reportJsonPath,
  JSON.stringify(await flow.createFlowResult(), null, 2),
)

console.log('Rapport HTML enregistré à :', reportHtmlPath)
console.log('Rapport JSON enregistré à :', reportJsonPath)

// Cleanup.
await browser.close()

//open(reportHtmlPath, {wait: false});
