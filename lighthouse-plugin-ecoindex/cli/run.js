import fs, { writeFileSync } from 'fs'
import * as constants from 'lighthouse/core/config/constants.js'

import { startFlow } from 'lighthouse'
import logSymbols from 'log-symbols'
import path from 'path'
import puppeteer from 'puppeteer'
import { readExtraHeaderFile, readJSONFile } from './commands.js'

async function runCourse(urls, cliFlags) {
  console.log('runCourse')
  console.log(`${logSymbols.info} Todo ${urls}`)
}

async function runCourses(cliFlags) {
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

  if (cliFlags['url']) {
    console.log(`${logSymbols.info} Course an array of urls`)
    // console.log(`urls`, cliFlags['url'])
    await runCourse(cliFlags['url'], cliFlags)
  } else if (cliFlags['jsonFileObj']?.parcours.length === 1) {
    console.log(`${logSymbols.info} One course in the json file`)
    // console.log(`jsonFileObj`, cliFlags['jsonFileObj'])
    await runCourse(cliFlags['jsonFileObj'].parcours[0].urls, cliFlags)
  } else {
    console.log(`${logSymbols.info} Multiples courses in the json file`)
    console.log(`${logSymbols.warning} TODO...`)
  }
}

async function generateEnvironmentalStatement(cliFlags, files = []) {
  console.log('generateEnvironmentalStatement')
}

export { generateEnvironmentalStatement, runCourses }
