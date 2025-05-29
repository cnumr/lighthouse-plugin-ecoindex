import type * as LH from 'lighthouse/types/lh.js'

import fs, { writeFileSync } from 'fs'
import path, { dirname } from 'path'
import { getEnvStatementsObj, slugify } from './commands.js'
import { cleanPath, convertCourseResults } from './converters.js'
import {
  CliFlags,
  Course,
  PrinterOutput,
  StatementsReport,
  SummaryToPrint,
  SummaryToPrintItem,
} from './types/index.js'

import Handlebars from 'handlebars'
import logSymbols from 'log-symbols'
import { fileURLToPath } from 'url'
import { B_TO_KB } from './utils/index.js'

const SEPARATOR = '\n---------------------------------\n'
const _dirname = fileURLToPath(dirname(import.meta.url))

Handlebars.registerHelper('toDateString', function (date) {
  const _date = new Date(date)
  return _date.toDateString()
})
Handlebars.registerHelper('plus1', function (n) {
  return Number(n) + 1
})
Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})
Handlebars.registerHelper('convertPageSize', function (size) {
  return (size / B_TO_KB).toFixed(3)
})

/**
 * Prepare folder and naming files.
 * @param {object} cliFlags
 * @returns
 */
async function preparareReports(
  cliFlags: CliFlags,
  course: Course = undefined,
) {
  // Create the output folder if it doesn't exist.
  const exportPath = cliFlags['exportPath']

  if (course) {
    await fs.mkdirSync(cleanPath(`${exportPath}/statements`), {
      recursive: true,
    })
  } else {
    await fs.mkdirSync(cleanPath(`${exportPath}`), {
      recursive: true,
    })
    console.log(
      `${logSymbols.info} With \`url\` option, generic report(s) are generated.`,
    )
    return {
      html: cleanPath(`${exportPath}/generic.report.html`),
      json: cleanPath(`${exportPath}/generic.report.json`),
    }
  }

  if (cliFlags['envStatementsObj'] === undefined) {
    cliFlags['envStatementsObj'] = getEnvStatementsObj(exportPath)
  }
  const courseName = slugify(course?.name || 'best-pages')
  const output: PrinterOutput = {
    id: courseName,
    type: course['is-best-pages'] ? 'best-pages' : 'course',
    target: course.target,
    name: course.name,
    course: course.course,
    reports: {
      html: cleanPath(
        `${exportPath}/${courseName ? courseName : 'best-pages'}.report.html`,
      ),
      json: cleanPath(
        `${exportPath}/${courseName ? courseName : 'best-pages'}.report.json`,
      ),
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
async function printJSONReport(flow: LH.UserFlow, path: string) {
  const flowResult = JSON.stringify(await flow.createFlowResult(), null, 2)
  writeFileSync(path, flowResult)
  console.log(`Report generated: ${path}`)
}

/**
 * Generate Flow HTML Output
 * @param {lighthouse.UserFlow} flow
 * @param {string} paths
 */
async function printHTMLReport(flow: LH.UserFlow, path: string) {
  try {
    const flowReport = await flow.generateReport()
    writeFileSync(path, flowReport)
    console.log(`Report generated: ${path}`)
  } catch (error) {
    console.log(path)
    console.error(`${logSymbols.error} ${error}`)
  }
}

/**
 * Generate Environmental Statement JSON Output
 * @param {*} cliFlags
 */
async function printEnvStatementReport(cliFlags: CliFlags, type = 'json-file') {
  if (cliFlags['outputFiles'] === undefined) {
    cliFlags['outputFiles'] = {}
  }
  if (type === 'input-report') {
    const filesPath = cliFlags['input-report']
    const outputReportsPath = cliFlags['output-path']
    await fs.mkdirSync(`${outputReportsPath}`, {
      recursive: true,
    })
    cliFlags['envStatementsObj'] = getEnvStatementsObj(outputReportsPath, false)
    if (filesPath && filesPath.length > 0) {
      console.log(`${logSymbols.info} Reading Lighthouse report file(s)`)
      for (let index = 0; index < filesPath.length; index++) {
        const lighthouseReport = filesPath[index]
        cliFlags['envStatementsObj'].courses.push({
          id: undefined,
          type: index === 0 ? 'best-pages' : 'course',
          target: '[À MODIFIER]',
          name: '[À MODIFIER]',
          course: '[À MODIFIER]',
          reports: {
            json: lighthouseReport,
          },
        })
      }
      console.log(SEPARATOR)
    } else {
      console.error(`${logSymbols.error} No Lighthouse report file(s) found.`)
      process.exit(0)
    }
  }
  console.log(
    `${logSymbols.info} Generating Environnemental statement report...`,
  )

  const output: StatementsReport = {
    version_api: '1.0.0',
    date: cliFlags['generationDate'],
    best_pages: {},
    courses: [],
  }

  const envStatementsObj = cliFlags['envStatementsObj']

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
      output.best_pages = {
        ...convertCourseResults(
          flows,
          envStatementsObj.courses[index] as unknown as Course,
        ),
      }
    } else {
      // 3.1.b. Normal course part
      const _output = {
        ...convertCourseResults(
          flows,
          envStatementsObj.courses[index] as unknown as Course,
        ),
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
  if (cliFlags['outputFiles']['statements'] === undefined) {
    cliFlags['outputFiles']['statements'] = []
  }
  cliFlags['outputFiles']['statements'].push(envStatementsObj.statements.json)
  console.log(
    `Environnemental statement generated: ${envStatementsObj.statements.json}`,
  )
  console.log(
    `${logSymbols.success} Generating Environnemental statement ended 🎉`,
  )
  console.log(SEPARATOR)
}

/**
 * Generate Environmental Statement Documents from JSON and Twig templates
 * @param {CliFlags} cliFlags
 */
async function printEnvStatementDocuments(cliFlags: CliFlags) {
  const envStatementsObj = cliFlags['envStatementsObj']
  if (cliFlags['outputFiles'] === undefined) {
    cliFlags['outputFiles'] = {}
  }
  console.log(
    `${logSymbols.info} Generating Environnemental statement documents...`,
  )
  // Add informations documents and assets
  const exportPath = cliFlags['exportPath']
  try {
    await fs.mkdirSync(cleanPath(`${exportPath}/assets`), {
      recursive: true,
    })
    await fs.copyFileSync(
      cleanPath(path.join(_dirname, `templates/fr_FR/docs/README.md`)),
      cleanPath(`${exportPath}/README.md`),
    )
    await fs.copyFileSync(
      cleanPath(
        path.join(_dirname, `templates/fr_FR/docs/assets/eco-conception.png`),
      ),
      cleanPath(`${exportPath}/assets/eco-conception.png`),
    )
    await fs.copyFileSync(
      cleanPath(
        path.join(
          _dirname,
          `templates/fr_FR/docs/assets/logo-asso-greenit.svg`,
        ),
      ),
      cleanPath(`${exportPath}/assets/logo-asso-greenit.svg`),
    )
  } catch (error) {
    console.error(`${logSymbols.error} ${error}`)
  }

  const jsonFile = fs.readFileSync(envStatementsObj.statements.json, 'utf8')

  // Markdown
  try {
    const sourceMD = fs.readFileSync(
      cleanPath(path.join(_dirname, `templates/fr_FR/markdown.handlebars`)),
      'utf8',
    )
    const templateMD = Handlebars.compile(sourceMD)
    const mdContent = templateMD(JSON.parse(jsonFile))
    writeFileSync(envStatementsObj.statements.md, mdContent)
    if (cliFlags['outputFiles']['statements'] === undefined) {
      cliFlags['outputFiles']['statements'] = []
    }
    cliFlags['outputFiles']['statements'].push(envStatementsObj.statements.md)
    console.log(
      `Environnemental statement generated: ${envStatementsObj.statements.md}`,
    )
  } catch (error) {
    console.error(`${logSymbols.error} ${error}`)
  }
  try {
    const sourceHTML = fs.readFileSync(
      cleanPath(path.join(_dirname, `templates/fr_FR/html.handlebars`)),
      'utf8',
    )
    const templateHTML = Handlebars.compile(sourceHTML)
    const htmlContent = templateHTML(JSON.parse(jsonFile))
    writeFileSync(envStatementsObj.statements.html, htmlContent)
    if (cliFlags['outputFiles']['statements'] === undefined) {
      cliFlags['outputFiles']['statements'] = []
    }
    cliFlags['outputFiles']['statements'].push(envStatementsObj.statements.html)
    console.log(
      `Environnemental statement generated: ${envStatementsObj.statements.html}`,
    )
  } catch (error) {
    console.error(`${logSymbols.error} ${error}`)
  }
  console.log(
    `${logSymbols.success} Generating Environnemental documents ended 🎉`,
  )
  console.log(SEPARATOR)
}

/**
 * Generate Summary report from JSON
 * @param {*} cliFlags
 */
async function printSummary(cliFlags: CliFlags): Promise<void> {
  console.log(`${logSymbols.info} Generating Summary report...`)
  const jsonFiles = cliFlags['outputFiles']['json']
  const output: SummaryToPrint[] = []
  jsonFiles.forEach(jsonFile => {
    const json = fs.readFileSync(jsonFile, 'utf8')
    const o = JSON.parse(json)
    const datas: SummaryToPrintItem[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    o.steps.forEach((item: any): void => {
      // ommit "snapshot" and "timestamp"
      if (item.lhr['gatherMode'] !== 'navigation') return null
      const it: SummaryToPrintItem = {
        url: item.lhr.finalDisplayedUrl,
        score: 0,
        detail: {},
        ecoindex: {},
      }
      const categories = Object.values(item.lhr.categories)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories.forEach((category: any) => {
        it.detail[category.id] = category.score
      })
      it.score = (
        (it.detail['best-practices'] +
          it.detail['seo'] +
          it.detail['accessibility'] +
          it.detail['performance']) /
        4
      ).toFixed(2) as unknown as number
      it.ecoindex = {
        'eco-index-score': {
          score: item.lhr.audits['eco-index-score'].numericValue.toFixed(2),
          displayValue: item.lhr.audits['eco-index-score'].displayValue,
        },
        'eco-index-grade': {
          score: item.lhr.audits['eco-index-grade'].numericValue,
          displayValue: item.lhr.audits['eco-index-grade'].displayValue,
        },
        'eco-index-water': {
          score: item.lhr.audits['eco-index-water'].numericValue,
          displayValue: item.lhr.audits['eco-index-water'].displayValue,
        },
        'eco-index-ghg': {
          score: item.lhr.audits['eco-index-ghg'].numericValue,
          displayValue: item.lhr.audits['eco-index-ghg'].displayValue,
        },
        'eco-index-nodes': {
          score: item.lhr.audits['eco-index-nodes'].numericValue,
          displayValue: item.lhr.audits['eco-index-nodes'].displayValue,
        },
        'eco-index-size': {
          score: item.lhr.audits['eco-index-size'].numericValue,
          displayValue: item.lhr.audits['eco-index-size'].displayValue,
        },
        'eco-index-requests': {
          score: item.lhr.audits['eco-index-requests'].numericValue,
          displayValue: item.lhr.audits['eco-index-requests'].displayValue,
        },
      }
      datas.push(it)
    })
    output.push(datas)
  })
  const exportPath = cliFlags['exportPath']
  writeFileSync(
    cleanPath(`${exportPath}/summary.report.json`),
    JSON.stringify(output, null, '\t'),
  )
  console.log(`Summary report generated: ${exportPath}/summary.report.json`)
  console.log(`${logSymbols.success} Generating Summary report ended 🎉`)
}

/**
 * Print All
 * @param {CliFlags} cliFlags
 * @param {LH.UserFlow} flow
 * @param {Course} course
 */
async function print(
  cliFlags: CliFlags,
  flow: LH.UserFlow,
  course: Course = undefined,
) {
  console.log(`${logSymbols.info} Generating report(s)...`)
  if (cliFlags['outputFiles'] === undefined) {
    cliFlags['outputFiles'] = {}
  }
  const paths = await preparareReports(cliFlags, course)
  let outputModes = cliFlags['output']
  if (typeof outputModes === 'string') outputModes = [outputModes]
  console.log(`Output(s)`, outputModes)

  if (outputModes.includes('html')) {
    if (cliFlags['outputFiles']['html'] === undefined) {
      cliFlags['outputFiles']['html'] = []
    }
    cliFlags['outputFiles']['html'].push(paths.html)
    await printHTMLReport(flow, paths.html)
  }
  if (outputModes.includes('json') || outputModes.includes('statement')) {
    if (cliFlags['outputFiles']['json'] === undefined) {
      cliFlags['outputFiles']['json'] = []
    }
    cliFlags['outputFiles']['json'].push(paths.json)
    await printJSONReport(flow, paths.json)
  }
  console.log(`${logSymbols.success} Generating report(s) ended 🎉`)
  console.log(SEPARATOR)
}

export {
  print,
  printEnvStatementDocuments,
  printEnvStatementReport,
  printSummary,
}
