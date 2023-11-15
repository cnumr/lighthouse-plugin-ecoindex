#!/usr/bin/env node

import * as constants from 'lighthouse/core/config/constants.js'

import fs, { writeFileSync } from 'fs'

import CustomArtifacts from './gatherers/index.js'
import { hideBin } from 'yargs/helpers'
import path from 'path'
import puppeteer from 'puppeteer'
import { startFlow } from 'lighthouse'
import yargs from 'yargs'

const SEPARATOR = '\n---------------------------------\n'

const DEFAULT_URLS = [
  'https://www.ecoindex.fr/',
  'https://www.ecoindex.fr/comment-ca-marche/',
]

/**
 * Init Ecoindex flow. Wait 3s, then navigate to bottom of page.
 * @param {puppeteer.Page} page
 * @param {lighthouse.UserFlow} session
 */
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
async function endEcoindexPageMesure(flow, snapshotEnabled = false) {
  await new Promise(r => setTimeout(r, 3 * 1000))
  if (snapshotEnabled) await flow.snapshot()
}

/**
 * Return config for Lighthouse
 * @param {boolean} isWarm
 * @returns {lighthouse.Config}
 */
function getConfig(
  isWarm = false,
  stepName = `undefined`,
  onlyCategories = [
    'performance',
    'seo',
    'accessibility',
    'best-practices',
    'lighthouse-plugin-ecoindex',
  ],
) {
  return {
    name: stepName,
    config: {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: onlyCategories,
        formFactor: 'desktop',
        throttling: constants.throttling.desktopDense4G,
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
        },
        emulatedUserAgent: constants.userAgents.desktop,
        maxWaitForLoad: 60 * 1000,
        disableStorageReset: isWarm,
      },
      plugins: ['lighthouse-plugin-ecoindex'],
      artifacts: CustomArtifacts,
    },
  }
}

/**
 * Launch Lighthouse and generate report
 * @param {string[]} urls
 */
async function captureReport() {
  const argv = yargs(hideBin(process.argv))
    .option('demo', {
      alias: 'd',
      type: 'boolean',
      default: false,
      description: 'Use demo URLs.',
    })
    .option('url', {
      alias: 'u',
      type: 'array',
      description: 'URL to process, supports multiple values',
    })
    .option('urls-file', {
      alias: 'f',
      type: 'string',
      describe: 'Input file path. 1 url per line.',
    })
    .option('extra-header', {
      alias: 'h',
      type: 'string',
      default: null,
      description:
        'Extra object config for Lighthouse. JSON string or path to a JSON file.',
    })
    .option('output-path', {
      alias: 'p',
      type: 'string',
      default: './reports',
      coerce: coerceOutputPath,
      description: 'Output folder.',
    })
    .option('output', {
      alias: 'o',
      type: 'string',
      default: /** @type {const} */ (['html']),
      coerce: coerceOutput,
      description:
        'Reporter for the results, supports multiple values. choices: "json", "html". WARN: "csv" is not avalailable with flow.',
    })
    .epilogue(
      'For more information on this Lighthouse Ecoindex script helper, see https://github.com/NovaGaia/lighthouse-plugin-ecoindex#readme',
    )
    .help().argv

  const filePath = argv['urls-file']
  const isDemoMode = argv['demo']
  const outputPath = argv['output-path']
  let outputModes = argv['output']
  const extraHeader = argv['extra-header']
  let urls = argv['url']

  if (!filePath && !urls && !isDemoMode) {
    console.error(
      'Use`--demo true` or please provide a file path (--urls-file) or URLs (--urls https://www.example.com --urls https://www.example1.com) as an argument',
    )
    process.exit(1)
  }
  if (filePath) {
    console.log(`Reading file ${filePath}...`)
    const resolvedPath = await path.resolve(filePath)

    await fs.readFile(resolvedPath, 'utf8', async (err, data) => {
      // Make this function async
      if (err) {
        console.error(`Error reading file from disk: ${err}`)
        process.exit(1)
      } else {
        console.log(`File ${filePath} readed.`)
        urls = data.split('\n')
        if (urls[urls.length - 1] === '') {
          urls.pop()
        }
      }
    })
  }
  let extraHeaderObj = null
  if (extraHeader && typeof extraHeader === 'string') {
    console.log(`Parsing extra-header JSON...`)
    try {
      extraHeaderObj = JSON.stringify(JSON.parse(extraHeader))
      console.log(`Parsing extra-header JSON as a string.`)
    } catch (e) {
      // console.error(`Error parsing extra-header JSON: ${e}`)
      console.log(`Reading file ${extraHeader}...`)
      const resolvedPath = await path.resolve(extraHeader)

      await fs.readFile(resolvedPath, 'utf8', async (err, data) => {
        // Make this function async
        if (err) {
          console.error(`Error reading file from disk: ${err}`)
          process.exit(1)
        } else {
          console.log(`File ${extraHeader} readed.`)
          extraHeaderObj = JSON.stringify(JSON.parse(data))
        }
      })
    }
  }

  await new Promise(r => setTimeout(r, 3 * 1000))
  console.log(`Mesure(s) start 🚀`)

  if (isDemoMode) {
    console.log('No URL provided, using default URL')
    urls = DEFAULT_URLS
  }

  // Launch a headless browser.
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
  })

  // Create a new page.
  const page = await browser.newPage()
  console.log('List of urls:', urls)
  console.log(SEPARATOR)
  if (extraHeaderObj) {
    console.log(`Setting extra-header...`)
    console.log(`extra-header`, extraHeaderObj)
    await page.setExtraHTTPHeaders(extraHeaderObj)
    console.log(SEPARATOR)
  }
  // Get a session handle to be able to send protocol commands to the page.
  const session = await page.target().createCDPSession()
  // Get a flow handle to be able to send protocol commands to the page.
  const flow = await startFlow(
    page,
    getConfig(false, `Warm Navigation: ${urls[0]}`),
  )

  console.log(`Mesuring...`)
  console.log(`Mesure 0: ${urls[0]}`)

  // Navigate with first URL
  await flow.navigate(urls[0], {
    stepName: urls[0],
  })

  await startEcoindexPageMesure(page, session)
  await endEcoindexPageMesure(flow)

  // Navigate with next URLs
  for (var i = 1; i < urls.length; i++) {
    if (urls[i].trim() !== '') {
      console.log(`Mesure ${i}: ${urls[i]}`)
      await flow.navigate(
        urls[i],
        getConfig(true, `Cold Navigation: ${urls[i]}`),
      )
      await startEcoindexPageMesure(page, session)
      await endEcoindexPageMesure(flow)
    }
  }

  console.log(SEPARATOR)
  console.log(`Mesure(s) ended 🎉`)
  // Close the browser.
  await browser.close()
  console.log(SEPARATOR)
  console.log(`Generating report...`)
  if (typeof outputModes === 'string') outputModes = [outputModes]
  console.log(`outputModes`, outputModes)
  // Save results as reports.
  const reportName = new Date().toISOString()
  // Create the output folder if it doesn't exist.
  await fs.mkdirSync(outputPath, { recursive: true })
  // Get the comprehensive flow report.
  outputModes.map(async outputMode => {
    // HTML report.
    if (outputMode === 'html') {
      const reportHtmlPath = `${outputPath}/${reportName}.report.html`
      writeFileSync(reportHtmlPath, await flow.generateReport())
      console.log(`Report generated: ${reportHtmlPath}`)
    }

    // Save results as JSON.
    if (outputMode === 'json') {
      const reportJsonPath = `${outputPath}/${reportName}.report.json`
      writeFileSync(
        reportJsonPath,
        JSON.stringify(await flow.createFlowResult(), null, 2),
      )
      console.log(`Report generated: ${reportJsonPath}`)
    }
  })
  console.log(SEPARATOR)
  console.log(`Mesure(s) finished 👋`)
}

await captureReport()

/**
 * Coerce output CLI input to `LH.SharedFlagsSettings['output']` or throw if not possible.
 * @param {Array<unknown>} values
 * @return {Array<LH.OutputMode>}
 */
// eslint-disable-next-line no-unused-vars
function coerceOutput(values) {
  // console.log(`values`, values)
  // console.log(`typeof values`, typeof values)
  // console.log(`Array.isArray(values)`, Array.isArray(values))
  const outputTypes = ['json', 'html']
  const errorHint = `Argument 'output' must be an array from choices "${outputTypes.join(
    '", "',
  )}"`
  if (!Array.isArray(values)) {
    values = [values]
  }
  if (
    !values.every(/** @return {boolean} */ item => typeof item === 'string')
  ) {
    throw new Error('Invalid values. ' + errorHint)
  }
  // Allow parsing of comma-separated values.
  const strings = values.flatMap(value => value.split(','))
  const validValues = strings.filter(
    /** @return {str is LH.OutputMode} */ str => {
      if (!outputTypes.includes(str)) {
        throw new Error(`"${str}" is not a valid 'output' value. ` + errorHint)
      }
      return true
    },
  )

  return validValues
}

/**
 * Verifies outputPath is something we can actually write to.
 * @param {unknown=} value
 * @return {string=}
 */
// eslint-disable-next-line no-unused-vars
function coerceOutputPath(value) {
  if (value === undefined) return

  if (
    typeof value !== 'string' ||
    !value ||
    !fs.existsSync(path.dirname(value))
  ) {
    throw new Error(`--output-path (${value}) cannot be written to`)
  }

  return value
}
