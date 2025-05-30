import {
  authenticateEcoindexPageMesure,
  dateToFileString,
  endEcoindexPageMesure,
  getLighthouseConfig,
  getPuppeteerConfig,
  readExtraHeaderFile,
  readJSONFile,
  startEcoindexPageMesure,
} from './commands.js'
import {
  print,
  printEnvStatementDocuments,
  printEnvStatementReport,
  printSummary,
} from './printer.js'
import type { CliFlags, Course } from './types/index.js'

import { startFlow } from 'lighthouse'
import logSymbols from 'log-symbols'
import puppeteer from 'puppeteer'

const SEPARATOR = '\n---------------------------------\n'
/**
 * Run a course of URLs.
 * @param {string[]} urls
 * @param {CliFlags} cliFlags
 * @param {Course} course
 */
async function runCourse(
  urls: string[],
  cliFlags: CliFlags,
  course: Course = undefined,
) {
  let landingUrl = null
  // remove duplicate URLs
  const uniqUrls = [...new Set(urls)]
  if (uniqUrls.length !== urls.length) {
    console.log(
      `${logSymbols.warning} ${
        urls.length - uniqUrls.length
      } duplicate(s) url has been removed from list!`,
    )
  }
  console.log(SEPARATOR)
  const auth = cliFlags['auth']
  if (course) {
    console.log(
      `${logSymbols.info} Mesure(s) start${
        course.name ? ', course: ' + course.name : ''
      } 🚀`,
    )
  } else {
    console.log(`${logSymbols.info} Mesure(s) start 🚀`)
  }
  const options = await getPuppeteerConfig()
  console.debug(
    `${logSymbols.info} puppeteer executablePath`,
    options.executablePath,
  )

  // Launch a headless browser.
  const browser = await puppeteer.launch(options)

  // Create a new page.
  const page = await browser.newPage()
  console.log('List of urls:', uniqUrls)
  console.log(SEPARATOR)

  // Add extra-header
  if (cliFlags['extraHeaderObj']) {
    console.log(`${logSymbols.info} Setting extra-header...`)
    console.log(
      `${logSymbols.success} extra-header`,
      cliFlags['extraHeaderObj'],
    )
    await page.setExtraHTTPHeaders(cliFlags['extraHeaderObj'])
    console.log(SEPARATOR)
  }
  // Get a session handle to be able to send protocol commands to the page.
  const session = await page.createCDPSession()
  // Get a flow handle to be able to send protocol commands to the page.
  const flow = await startFlow(
    page,
    getLighthouseConfig(
      true, // try to avoid Invalid dependency graph created, cycle detected
      `Warm Navigation: ${uniqUrls[0]}`,
      cliFlags['audit-category'],
      cliFlags['user-agent'],
    ),
  )
  console.log(`${logSymbols.info} Mesuring...`)
  for (let index = 0; index < uniqUrls.length; index++) {
    if (landingUrl && uniqUrls[index] === landingUrl) {
      console.log(
        `${logSymbols.warning} Skipped duplicate mesure on ${landingUrl}`,
      )
    } else {
      if (index === 0) {
        await flow.navigate(uniqUrls[index], {
          name: `Warm Navigation: ${uniqUrls[index]}`,
        })
      } else {
        await flow.navigate(
          uniqUrls[index],
          getLighthouseConfig(
            false,
            `Cold Navigation: ${uniqUrls[index]}`,
            cliFlags['audit-category'],
            cliFlags['user-agent'],
          ),
        )
      }
      console.log(`Mesure ${index}: ${uniqUrls[index]}`)
      const cookies = await browser.cookies()
      console.debug(`cookies`, cookies.length)

      if (auth && uniqUrls[index] === auth.url) {
        // Authenticate if current URL == auth URL
        console.log(`${logSymbols.info} Authentication page detected!`)

        landingUrl = await authenticateEcoindexPageMesure(
          page,
          auth,
          browser,
          session,
          flow,
        )
      } else {
        // Normal mesure
        await startEcoindexPageMesure(page, session)
        await endEcoindexPageMesure(flow)
      }
    }
  }
  // Second mesure for the auth landing page is NOT WORKING
  // trying...
  // let stepToRM = -1
  // flow._gatherSteps.forEach((step, index) => {
  //   if (!step.artifacts.URL.requestedUrl) {
  //     console.log(
  //       `Clean step ${index} with ${step.artifacts.URL.finalDisplayedUrl}, try to retry...`,
  //     )
  //     stepToRM = index
  //   }
  // })
  // // clean
  // if (stepToRM > -1) {
  //   flow._gatherSteps.splice(stepToRM, 1)
  // }
  // // verify
  // flow._gatherSteps.forEach(step => {
  //   console.debug(step.artifacts.URL)
  // })

  // // try to mesure landed page.
  // if (landingUrl) {
  //   console.log(
  //     `${logSymbols.info} Mesure Authentication landing page ${landingUrl}`,
  //   )
  //   await flow.navigate(
  //     landingUrl,
  //     getLighthouseConfig(
  //       false,
  //       `Mesure Authentication landing page (Cold Navigation): ${landingUrl}`,
  //       cliFlags['audit-category'],
  //       cliFlags['user-agent'],
  //     ),
  //   )
  //   await startEcoindexPageMesure(page, session)
  //   await endEcoindexPageMesure(flow)
  // }

  console.log(`${logSymbols.success} Mesure(s) ended`)
  console.log(SEPARATOR)

  // Generate Reports
  await print(cliFlags, flow, course)
  // Close the browser.
  await browser.close()
}

/**
 * Run courses from CLI flags.
 * @param {CliFlags} cliFlags
 */
async function runCourses(cliFlags: CliFlags) {
  // validate minimum options
  if (!cliFlags['json-file'] && !cliFlags['url'] && !cliFlags['demo']) {
    console.error(
      `${logSymbols.error} Use \`lighthouse-ecoindex collect --demo true\` \nOR please provide a file path \`lighthouse-ecoindex collect --json-file ./input-file.json\` \nOR provide URLs \`lighthouse-ecoindex collect --url https://www.example.com --url https://www.example1.com\` as options.`,
    )
    process.exit(1)
  }
  // validate no conflict options
  if (cliFlags['json-file'] && cliFlags['url']) {
    console.error(
      `${logSymbols.error} You can not use \`--json-file\` and \`--url\` options at the same time.`,
    )
    process.exit(1)
  }
  // Read config file
  await readJSONFile(cliFlags)
  // Read extra-header file
  await readExtraHeaderFile(cliFlags)
  // save `extra-header` from input file in specific var.
  if (cliFlags['jsonFileObj']?.['extra-header']) {
    console.log(
      `${logSymbols.warning} Extra-header overrided by \`${cliFlags['json-file']}\` file.`,
    )
    cliFlags['extraHeaderObj'] = cliFlags['jsonFileObj']?.['extra-header']
  }
  // save `output-path` from input file in specific var.
  if (cliFlags['jsonFileObj']?.['output-path']) {
    console.log(
      `${logSymbols.warning} Output-path overrided by \`${cliFlags['json-file']}\` file.`,
    )
    cliFlags['exportPath'] = `${
      cliFlags['jsonFileObj']?.['output-path']
    }/${await dateToFileString(cliFlags['generationDate'])}`
  }
  // save `output` from input file in specific var.
  if (cliFlags['jsonFileObj']?.['output']) {
    console.log(
      `${logSymbols.warning} Output overrided by \`${cliFlags['json-file']}\` file.`,
    )
    cliFlags['output'] = cliFlags['jsonFileObj']?.['output']
  }
  if (cliFlags['jsonFileObj']?.['user-agent']) {
    console.log(
      `${logSymbols.warning} User-agent overrided by \`${cliFlags['json-file']}\` file.`,
    )
    cliFlags['user-agent'] = cliFlags['jsonFileObj']['user-agent']
  }
  if (cliFlags['jsonFileObj']?.['auth']) {
    console.log(
      `${logSymbols.warning} Authentification (auth) overrided by \`${cliFlags['json-file']}\` file.`,
    )
    cliFlags['auth'] = cliFlags['jsonFileObj']['auth']
    console.log(`${logSymbols.info} Authentication informations:`)
    console.log(cliFlags['auth'])
  }
  if (
    !cliFlags['output'].includes('json') &&
    cliFlags['output'].includes('statement')
  ) {
    if (cliFlags['jsonFileObj']?.['output']) {
      console.log(
        `${logSymbols.error} Statement files need json file. Use \`"output": ["json", "statement"]\` in input file.`,
      )
    } else {
      console.log(
        `${logSymbols.error} Statement files need json file. Use \`--output json --output statement\``,
      )
    }
    process.exit(1)
  }
  // send to the right workflow
  if (cliFlags['url']) {
    console.log(`${logSymbols.info} Course an array of urls`)
    await runCourse(cliFlags['url'], cliFlags)
  } else if (cliFlags['jsonFileObj']?.courses.length === 1) {
    console.log(`${logSymbols.info} One course in the json file`)
    await runCourse(cliFlags['jsonFileObj'].courses[0].urls, cliFlags)
  } else {
    console.log(`${logSymbols.info} Multiples courses in the json file`)
    for (
      let index = 0;
      index < cliFlags['jsonFileObj'].courses.length;
      index++
    ) {
      const courses = cliFlags['jsonFileObj'].courses[index]
      await runCourse(courses.urls, cliFlags, courses)
    }
  }
  if (
    cliFlags['output'].includes('json') &&
    cliFlags['output'].includes('statement') &&
    cliFlags['url'] === undefined
  ) {
    await printEnvStatementReport(cliFlags)
    await printEnvStatementDocuments(cliFlags)
  }
  if (cliFlags['output'].includes('json') && cliFlags['url'] === undefined) {
    await printSummary(cliFlags)
  }
}

/**
 * Generate Environmental Statement
 * @param {CliFlags} cliFlags
 */
async function generateEnvironmentalStatement(cliFlags: CliFlags) {
  console.log(`${logSymbols.info} generateEnvironmentalStatement`)
  // 1. Lire les fichiers JSON
  // 2. Générer le fichier JSON de sortie
  await printEnvStatementReport(cliFlags, 'input-report')
  // 3. Générer MD et HTML
  await printEnvStatementDocuments(cliFlags)
}

export { generateEnvironmentalStatement, runCourses }
