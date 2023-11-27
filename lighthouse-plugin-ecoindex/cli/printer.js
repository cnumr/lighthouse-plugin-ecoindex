import fs, { writeFileSync } from 'fs'

import logSymbols from 'log-symbols'

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
      html: `${exportPath}/${curseName ? curseName + '-' : ''}.report.html`,
      json: `${exportPath}/${curseName ? curseName + '-' : ''}.report.json`,
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

/**
 * Generate Environmental Statement JSON Output
 * @param {*} cliFlags
 */
async function printEnvStatementReport(cliFlags) {
  const output = []
  for (let index = 0; index < cliFlags['input-report'].length; index++) {
    // 1. Read JSON file
    const jsonFile = fs.readFileSync(
      cliFlags['input-report'][index].json,
      'utf8',
    )
    const name = cliFlags['input-report'][index].json
      .replace(cliFlags['outputPath'] + '/' + cliFlags['reportName'] + '/', '')
      .replace('.json', '')
    const flows = JSON.parse(jsonFile)
    const _output = {
      'course-name': name,
      type: cliFlags['input-report'][index].type,
      pages: [],
    }
    flows.steps.forEach(flow => {
      const audits = flow.lhr.audits
      const result = {
        requestedUrl: flow.lhr.requestedUrl,
        'eco-index-grade': audits['eco-index-grade'].numericValue,
        'eco-index-score': audits['eco-index-score'].numericValue,
        'eco-index-ghg': audits['eco-index-ghg'].numericValue,
        'eco-index-water': audits['eco-index-water'].numericValue,
        'eco-index-nodes': audits['eco-index-nodes'].numericValue,
        'eco-index-size': audits['eco-index-size'].numericValue,
        'eco-index-requests': audits['eco-index-requests'].numericValue,
      }
      _output.pages.push(result)
    })
    output.push(_output)
  }
  // console.log(`output`, output)
  writeFileSync(
    `${cliFlags['output-path']}/${cliFlags['reportName']}/ecoindex-environmental-statement.json`,
    JSON.stringify(
      { date: cliFlags['reportName'], courses: output },
      null,
      '\t',
    ),
  )
}

/**
 * Print All
 * @param {*} cliFlags
 */
async function print(cliFlags, flow, curseName = undefined, type = undefined) {
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
}

export { print, printEnvStatementReport }
