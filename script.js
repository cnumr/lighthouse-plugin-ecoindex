/* eslint-disable no-undef */
import { desktopConfig, startFlow } from 'lighthouse'

import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import puppeteer from 'puppeteer-extra'
import { scrollPageToBottom } from 'puppeteer-autoscroll-down'
import { writeFileSync } from 'fs'

//import CatAudit from './lighthouse-plugin-cats/plugin.js'
//import SoftNavigationPlugin from './lighthouse-plugin-soft-navigation/plugin.js'

console.log(`Script launched 🚀`)
// Setup the browser and Lighthouse.
const PUPPETEER_OPTIONS = {
  headless: false,
  executablePath: process.env.CHROME_PATH,
  args: ['--enable-experimental-web-platform-features'],
}
const PUPPETEER_HEADLESS_OPTIONS = {
  headless: 'new',
  executablePath: process.env.CHROME_PATH,
  args: ['--no-sandbox --enable-experimental-web-platform-features'],
}
const browser = await puppeteer
  .use(StealthPlugin())
  .launch(
    process.env.CHROME_PATH == '/usr/bin/google-chrome-stable'
      ? PUPPETEER_HEADLESS_OPTIONS
      : PUPPETEER_OPTIONS,
  )
console.log(`Create new page ⌛`)
const page = await browser.newPage()

await page.setViewport({
  width: 1920,
        height: 1080,
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
  plugins: ['lighthouse-plugin-ecoindex'],
}

console.log(`startFlow ⌛`)
const flow = await startFlow(page, options)
console.log(`startFlow navigate ⌛`)
await flow.navigate(
  'https://www.manomano.fr/p/piscine-tubulaire-bestway-power-steel-549-x-274-x-122-m-30636057',
  options,
)
// Phase 1 - Start the process.
console.log(`startFlow startNavigation ⌛`)
await flow.startNavigation()
// Phase 2 - Emulate click on cookie warning (not mandatory).
console.log(`page.click ⌛`)
await page.click('#didomi-notice-agree-button')
//await flow.endTimespan();

// Phase 3 - Analyze the new state.
//await flow.snapshot();
console.log(`scrollPageToBottom ⌛`)
// let lastPosition = await scrollPageToBottom(page, {
//   size: 1000,
//   delay: 300,
// })

// await flow.navigate(async () => {
//   let lastPosition = await scrollPageToBottom(page, {
//     size: 1000,
//     delay: 300,
//   })
// })

// await flow.snapshot()
console.log(`startFlow endNavigation ⌛`)
await flow.endNavigation()
// Get the comprehensive flow report.
const reportHtmlPath = './reports/lighthouse_report.html'
console.log(`generateReport HTML ⌛`)
writeFileSync(reportHtmlPath, await flow.generateReport())
console.log('Rapport HTML enregistré à :', reportHtmlPath)
// Save results as JSON.
const reportJsonPath = './reports/lighthouse_report.json'
console.log(`generateReport JSON ⌛`)
writeFileSync(
  reportJsonPath,
  JSON.stringify(await flow.createFlowResult(), null, 2),
)

console.log('Rapport JSON enregistré à :', reportJsonPath)

// Cleanup.
await browser.close()
console.log(`Script ended 👋`)
//open(reportHtmlPath, {wait: false});
