import fs, { writeFileSync } from 'fs'
import Twig from 'twig'

import logSymbols from 'log-symbols'
import { gesToKm, scoreToGrade } from './converters.js'
const SEPARATOR = '\n---------------------------------\n'

/**
 * Prepare folder and naming files.
 * @param {object} cliFlags
 * @returns
 */
async function preparareReports(
  cliFlags,
  curseName = undefined,
  type = undefined,
) {
  // Create the output folder if it doesn't exist.
  let exportPath = `${cliFlags['output-path']}/${cliFlags['reportName']}`

  await fs.mkdirSync(exportPath, {
    recursive: true,
  })
  cliFlags['printed-path'] = {
    type: type,
    reports: {
      html: `${exportPath}/${curseName ? curseName : ''}.report.html`,
      json: `${exportPath}/${curseName ? curseName : ''}.report.json`,
    },
    statements: {
      html: `${exportPath}/statement.html`,
      json: `${exportPath}/statement.json`,
      txt: `${exportPath}/statement.txt`,
      md: `${exportPath}/statement.md`,
    },
  }
  return cliFlags['printed-path']
}

/**
 * Generate Flow JSON Output
 * @param {lighthouse.UserFlow} flow
 * @param {string} paths
 */
async function printJSONReport(flow, paths) {
  const flowResult = JSON.stringify(await flow.createFlowResult(), null, 2)
  writeFileSync(paths.reports.json, flowResult)
  console.log(`Report generated: ${paths.reports.json}`)
}

/**
 * Generate Flow HTML Output
 * @param {lighthouse.UserFlow} flow
 * @param {string} paths
 */
async function printHTMLReport(flow, paths) {
  const flowReport = await flow.generateReport()
  writeFileSync(paths.reports.html, flowReport)
  console.log(`Report generated: ${paths.reports.html}`)
}

function convertAuditsResults(lhr) {
  const audits = lhr.audits
  return {
    requestedUrl: lhr.requestedUrl,
    'eco-index-grade': audits['eco-index-grade'].numericValue,
    'eco-index-score': Number(audits['eco-index-score'].numericValue) * 100,
    'eco-index-ghg': Number(audits['eco-index-ghg'].numericValue),
    'eco-index-water': Number(audits['eco-index-water'].numericValue),
    'eco-index-nodes': Number(audits['eco-index-nodes'].numericValue),
    'eco-index-size': Number(audits['eco-index-size'].numericValue),
    'eco-index-requests': Number(audits['eco-index-requests'].numericValue),
  }
}

/**
 * Generate Environmental Statement JSON Output
 * @param {*} cliFlags
 */
async function printEnvStatementReport(cliFlags) {
  console.log(
    `${logSymbols.info} Generating Environnemental statement report...`,
  )
  const courses = []
  const summary = {}

  for (let index = 0; index < cliFlags['input-report'].length; index++) {
    // 1. Read JSON files
    const jsonFile = fs.readFileSync(
      cliFlags['input-report'][index].json,
      'utf8',
    )
    const flows = JSON.parse(jsonFile)
    // 2. Sanitize course name
    const name = cliFlags['input-report'][index].json
      .replace(cliFlags['outputPath'] + '/' + cliFlags['reportName'] + '/', '')
      .replace('.report.json', '')
    // 3. Generate course output
    // 3.1. Prepare course output
    if (cliFlags['input-report'][index].type === true) {
      // 3.1.a. Best pages of the site part
      const pages = []
      flows.steps.forEach(flow => {
        // 3.1 Add page to course output
        pages.push(convertAuditsResults(flow.lhr))
      })
      summary['course-name'] = name
      summary['ecoindexAVG'] = {
        // Grade
        'eco-index-grade': scoreToGrade(
          pages.reduce((a, b) => a + b['eco-index-score'], 0) / pages.length,
        ),
        // Score
        'eco-index-score': Math.round(
          pages.reduce((a, b) => a + b['eco-index-score'], 0) / pages.length,
        ),
        // Average water consumption (in L) per 1000 users
        'eco-index-water': (
          (pages.reduce((a, b) => a + b['eco-index-water'], 0) / pages.length) *
          10
        ).toFixed(2),
        // Average water consumption (in packs)
        'eco-index-water-equivalent': Math.round(
          ((pages.reduce((a, b) => a + b['eco-index-water'], 0) /
            pages.length) *
            10) /
            9,
        ),
        // GHG emissions (in kgCO2)
        'eco-index-ghg': (
          pages.reduce((a, b) => a + b['eco-index-ghg'], 0) / pages.length
        ).toFixed(2),
        // Equivalent km by thermal car
        'eco-index-ghg-equivalent': Math.round(
          gesToKm(
            pages.reduce((a, b) => a + b['eco-index-ghg'], 0) / pages.length,
          ),
        ),
      }
      summary['pages'] = pages
    } else {
      // 3.1.b. Normal course part
      const output = {
        'course-name': name,
        // Temorary value to removed after
        type: cliFlags['input-report'][index].type,
        pages: [],
      }
      flows.steps.forEach(flow => {
        // 3.1 Add page to course output
        output.pages.push(convertAuditsResults(flow.lhr))
      })
      // 4. Add course to output
      courses.push(output)
    }
  }
  // console.log(`output`, output)
  // 5. Generate report
  writeFileSync(
    `${cliFlags['output-path']}/${cliFlags['reportName']}/ecoindex-environmental-statement.json`,
    JSON.stringify(
      { date: cliFlags['reportName'], summary: summary, courses: courses },
      null,
      '\t',
    ),
  )
  console.log(
    `Environnemental statement generated: ${cliFlags['output-path']}/${cliFlags['reportName']}/ecoindex-environmental-statement.json`,
  )
  console.log(
    `${logSymbols.success} Generating Environnemental statement ended 🎉`,
  )
  console.log(SEPARATOR)
}

async function printEnvStatementDocuments(cliFlags) {
  const path = `${cliFlags['output-path']}/${cliFlags['reportName']}/ecoindex-environmental-statement`
  console.log(
    `${logSymbols.info} Generating Environnemental statement documents...`,
  )
  const jsonFile = fs.readFileSync(`${path}.json`, 'utf8')
  console.log(jsonFile)

  // TEST
  Twig.renderFile(
    '../templates/fr-FR/txt.twig',
    {
      foo: 'bar',
    },
    (err, txt) => {
      if (err) console.error(err)
      else {
        console.log(txt)
        writeFileSync(`${path}-test.txt`, txt)
      }
    },
    console.log(`Environnemental statement generated: ${path}-text.md`),
  )
  // Markdown
  await Twig.renderFile(
    '../templates/fr-FR/markdown.twig',
    JSON.parse(jsonFile),
    (err, md) => {
      if (err) console.error(err)
      else {
        console.log(md)
        writeFileSync(`${path}.md`, md)
      }
    },
    console.log(`Environnemental statement generated: ${path}.md`),
  )
  // HTML
  await Twig.renderFile(
    '../templates/fr-FR/html.twig',
    JSON.parse(jsonFile),
    (err, html) => {
      if (err) console.error(err)
      else {
        console.log(html)
        writeFileSync(`${path}.html`, html)
      }
    },
    console.log(`Environnemental statement generated: ${path}.html`),
  )
  // TXT
  await Twig.renderFile(
    '../templates/fr-FR/txt.twig',
    jsonFile,
    (err, txt) => {
      if (err) console.error(err)
      else {
        console.log(txt)
        writeFileSync(`${path}.txt`, txt)
      }
    },
    console.log(`Environnemental statement generated: ${path}.txt`),
  )
  console.log(
    `${logSymbols.success} Generating Environnemental documents ended 🎉`,
  )
  console.log(SEPARATOR)
}

/**
 * Print All
 * @param {*} cliFlags
 */
async function print(cliFlags, flow, curseName = undefined, type = undefined) {
  console.log(`${logSymbols.info} Generating report(s)...`)
  const paths = await preparareReports(cliFlags, curseName, type)
  let outputModes = cliFlags['output']
  if (typeof outputModes === 'string') outputModes = [outputModes]
  console.log(`Output(s)`, outputModes)

  if (outputModes.includes('html')) {
    await printHTMLReport(flow, paths)
  }
  if (outputModes.includes('json') || outputModes.includes('statement')) {
    cliFlags['input-report'].push({ json: paths.reports.json, type: type })
    await printJSONReport(flow, paths)
  }
  console.log(`${logSymbols.success} Generating report(s) ended 🎉`)
  console.log(SEPARATOR)
}

export { print, printEnvStatementDocuments, printEnvStatementReport }
