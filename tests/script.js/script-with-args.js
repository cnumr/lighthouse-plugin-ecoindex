#!/usr/bin/env node

import fs, { writeFileSync } from 'fs'

import { hideBin } from 'yargs/helpers'
import path from 'path'
import puppeteer from 'puppeteer'
import { startFlow } from 'lighthouse'
import yargs from 'yargs'

async function generateReport() {
  const argv = yargs(hideBin(process.argv))
    .option('urls-file', {
      alias: 'i',
      type: 'string',
      description: 'Input file path'
    })
    .option('urls', {
      alias: 'u',
      type: 'string',
      description: 'URLs to process'
    })
    .help()
    .argv;
  const reportName = new Date().toISOString()
  const reports = []

  const filePath = argv['urls-file']
  const urls = argv['urls'] ? argv['urls'].split(',') : null

  if (!filePath && !urls) {
    console.error('Please provide a file path (--urls-file=) or URLs (--urls=https://www.example.com,https://www.example1.com) as an argument')
    process.exit(1)
  }

  if (filePath) {
    const resolvedPath = path.resolve(filePath)

    fs.readFile(resolvedPath, 'utf8', async (err, data) => {
      // Make this function async
      if (err) {
        console.error(`Error reading file from disk: ${err}`)
      } else {
        const fileUrls = data.split('\n')

        for (let index = 0; index < fileUrls.length; index++) {
          const url = fileUrls[index]
          if (url.trim() !== '') {
            console.log(`URL ${index + 1}: ${url}`)
            reports.push(await captureReport(url, reportName))
          }
        }
      }
    })
  } else {
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index]
      if (url.trim() !== '') {
        console.log(`URL ${index + 1}: ${url}`)
        reports.push(await captureReport(url, reportName))
      }
    }
  }
  console.log(`reports`, reports);
  const reportJsonPath = `./reports/${reportName}-lighthouse_summary.json`
  writeFileSync(
    reportJsonPath,
    JSON.stringify(reports, null, 2),
  )
}

generateReport()

async function captureReport(url, reportName) {
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
    extends: 'lighthouse:default',
    plugins: ['lighthouse-plugin-ecoindex'],
  }
  const testUrl = url
  const flow = await startFlow(page, { config, flags: {screenEmulation: {disabled: true}}, })
  // Navigate with a URL
  await page.setViewport({width: 1920, height: 1080});
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
  const dimensions = await page.evaluate(() => {
    var body = document.body, html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    return {
      width: document.documentElement.clientWidth,
      height: height,
      deviceScaleFactor: window.devicePixelRatio,
    }
  })
  // We need the ability to scroll like a user. There's not a direct puppeteer function for this, but we can use the DevTools Protocol and issue a Input.synthesizeScrollGesture event, which has convenient parameters like repetitions and delay to somewhat simulate a more natural scrolling gesture.
  // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-synthesizeScrollGesture
  await session.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 600,
    yDistance: -dimensions.height,
    speed: 1000,
  })
  // await page.click('#didomi-notice-agree-button');
  await new Promise(r => setTimeout(r, 3 * 1000))
  await flow.endTimespan()

  await browser.close()
  
  // Get the comprehensive flow report.
  const reportHtmlPath = `./reports/${reportName}-lighthouse_report.html`
  writeFileSync(reportHtmlPath, await flow.generateReport())
  // Save results as JSON.
  const reportJsonPath = `./reports/${reportName}-lighthouse_report.json`
  writeFileSync(
    reportJsonPath,
    JSON.stringify(await flow.createFlowResult(), null, 2),
  )
  return JSON.stringify(await flow.createFlowResult(), null, 2)
  // console.log('Rapport HTML enregistré à :', reportHtmlPath);
  // console.log('Rapport JSON enregistré à :', reportJsonPath);
}
