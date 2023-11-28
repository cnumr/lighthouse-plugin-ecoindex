import fs, { writeFileSync } from 'fs'
import Twig from 'twig'

import logSymbols from 'log-symbols'
import { slugify } from './commands.js'
import { convertCourseResults } from './converters.js'
const SEPARATOR = '\n---------------------------------\n'

/**
 * Prepare folder and naming files.
 * @param {object} cliFlags
 * @returns
 */
async function preparareReports(cliFlags, course = undefined) {
  // Create the output folder if it doesn't exist.
  let exportPath = `${cliFlags['output-path']}/${cliFlags['generationDate']}`

  await fs.mkdirSync(`${exportPath}/statements`, {
    recursive: true,
  })

  if (cliFlags['envStatementsObj'] === undefined) {
    cliFlags['envStatementsObj'] = {
      courses: [],
      statements: {
        json: `${exportPath}/statements/ecoindex-environmental-statement.json`,
        html: `${exportPath}/statements/ecoindex-environmental-statement.html`,
        txt: `${exportPath}/statements/ecoindex-environmental-statement.txt`,
        md: `${exportPath}/statements/ecoindex-environmental-statement.md`,
      },
    }
  }
  const courseName = slugify(course?.name)
  const output = {
    id: courseName,
    type: course['is-best-pages'] ? 'best-pages' : 'course',
    target: course.target,
    name: course.name,
    course: course.course,
    reports: {
      html: `${exportPath}/${courseName ? courseName : ''}.report.html`,
      json: `${exportPath}/${courseName ? courseName : ''}.report.json`,
    },
  }
  cliFlags['envStatementsObj'].courses.push(output)
  return output.reports
}

/**
 * Generate Flow JSON Output
 * @param {lighthouse.UserFlow} flow
 * @param {string} paths
 */
async function printJSONReport(flow, path) {
  const flowResult = JSON.stringify(await flow.createFlowResult(), null, 2)
  writeFileSync(path, flowResult)
  console.log(`Report generated: ${path}`)
}

/**
 * Generate Flow HTML Output
 * @param {lighthouse.UserFlow} flow
 * @param {string} paths
 */
async function printHTMLReport(flow, path) {
  const flowReport = await flow.generateReport()
  writeFileSync(path, flowReport)
  console.log(`Report generated: ${path}`)
}

/**
 * Generate Environmental Statement JSON Output
 * @param {*} cliFlags
 */
async function printEnvStatementReport(cliFlags) {
  console.log(
    `${logSymbols.info} Generating Environnemental statement report...`,
  )

  const output = {
    date: cliFlags['generationDate'],
    'best-pages': {},
    courses: [],
  }

  const envStatementsObj = cliFlags['envStatementsObj']

  console.log(`envStatementsObj`, JSON.stringify(envStatementsObj))
  for (let index = 0; index < envStatementsObj.courses.length; index++) {
    // 1. Read JSON files
    const jsonFile = fs.readFileSync(
      envStatementsObj.courses[index].reports.json,
      'utf8',
    )
    const flows = JSON.parse(jsonFile)
    // 2. Sanitize course name

    if (envStatementsObj.courses[index].type === 'best-pages') {
      // 3.1.a. Best pages of the site part
      output['best-pages'] = {
        ...convertCourseResults(flows, envStatementsObj.courses[index]),
      }
    } else {
      // 3.1.b. Normal course part
      const _output = {
        ...convertCourseResults(flows, envStatementsObj.courses[index]),
      }
      // 4. Add course to output
      output.courses.push(_output)
    }
  }
  // 5. Generate report
  writeFileSync(
    envStatementsObj.statements.json,
    JSON.stringify(output, null, '\t'),
  )
  console.log(
    `Environnemental statement generated: ${envStatementsObj.statements.json}`,
  )
  console.log(
    `${logSymbols.success} Generating Environnemental statement ended 🎉`,
  )
  console.log(SEPARATOR)
}

async function printEnvStatementDocuments(cliFlags) {
  const envStatementsObj = cliFlags['envStatementsObj']
  console.log(
    `${logSymbols.info} Generating Environnemental statement documents...`,
  )
  const jsonFile = fs.readFileSync(envStatementsObj.statements.json, 'utf8')
  console.log(jsonFile)

  // Markdown
  await Twig.renderFile(
    '../templates/fr-FR/markdown.twig',
    JSON.parse(jsonFile),
    (err, md) => {
      if (err) console.error(err)
      else {
        console.log(md)
        writeFileSync(envStatementsObj.statements.md, md)
      }
    },
    console.log(
      `Environnemental statement generated: ${envStatementsObj.statements.md}`,
    ),
  )
  // HTML
  await Twig.renderFile(
    '../templates/fr-FR/html.twig',
    JSON.parse(jsonFile),
    (err, html) => {
      if (err) console.error(err)
      else {
        console.log(html)
        writeFileSync(envStatementsObj.statements.html, html)
      }
    },
    console.log(
      `Environnemental statement generated: ${envStatementsObj.statements.html}`,
    ),
  )
  // TXT
  await Twig.renderFile(
    '../templates/fr-FR/txt.twig',
    jsonFile,
    (err, txt) => {
      if (err) console.error(err)
      else {
        console.log(txt)
        writeFileSync(envStatementsObj.statements.txt, txt)
      }
    },
    console.log(
      `Environnemental statement generated: ${envStatementsObj.statements.txt}`,
    ),
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
async function print(cliFlags, flow, course = undefined) {
  console.log(`${logSymbols.info} Generating report(s)...`)
  const paths = await preparareReports(cliFlags, course)
  let outputModes = cliFlags['output']
  if (typeof outputModes === 'string') outputModes = [outputModes]
  console.log(`Output(s)`, outputModes)

  if (outputModes.includes('html')) {
    await printHTMLReport(flow, paths.html)
  }
  if (outputModes.includes('json') || outputModes.includes('statement')) {
    await printJSONReport(flow, paths.json)
  }
  console.log(`${logSymbols.success} Generating report(s) ended 🎉`)
  console.log(SEPARATOR)
}

export { print, printEnvStatementDocuments, printEnvStatementReport }
