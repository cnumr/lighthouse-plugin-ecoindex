import fs, { writeFileSync } from 'fs'

import { UserFlow } from 'lighthouse/core/user-flow'
import path from 'path'

/**
 * Prepare folder and naming files.
 * @param {object} cliFlags
 * @returns
 */
async function preparareReports(cliFlags) {
  // Save results as reports.
  const reportName = new Date().toISOString()
  // Create the output folder if it doesn't exist.
  const exportPath = `${cliFlags['output-path']}/${reportName}`
  await fs.mkdirSync(exportPath, {
    recursive: true,
  })
  return {
    reports: {
      html: `${exportPath}/report.html`,
      json: `${exportPath}/report.json`,
    },
    statements: {
      html: `${exportPath}/statement.html`,
      json: `${exportPath}/statement.json`,
      txt: `${exportPath}/statement.txt`,
      md: `${exportPath}/statement.md`,
    },
  }
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
 *
 * @param {[lighthouse.UserFlow]} flows
 * @param {object} paths
 */
async function printEnvStatementReport_flows(flows, paths) {
  const output = []
  for (let index = 0; index < flows.length; index++) {
    const flow = flows[index]
    const flowResult = JSON.stringify(await flow.createFlowResult(), null, 2)
    output.push(flowResult) // ne sauvegarder que les données d'ecoindex
  }
  writeFileSync(paths.statements.json, output)
}
async function printEnvStatementReport_files(cliFlags) {}

/**
 * Print All
 * @param {*} cliFlags
 */
async function print(cliFlags) {
  const paths = await preparareReports(cliFlags)
  let outputModes = cliFlags['output']
  if (typeof outputModes === 'string') outputModes = [outputModes]
  console.log(`outputModes`, outputModes)

  for (let index = 0; index < cliFlags['reportsFlows'].length; index++) {
    const flow = cliFlags['reportsFlows'][index]
    if (outputModes.includes('html')) {
      printHTMLReport(flow, paths)
    }
    if (outputModes.includes('json')) {
      printJSONReport(flow, paths)
    }
  }
  if (outputModes.includes('statement')) {
    printEnvStatementReport_flows(cliFlags['reportsFlows'], paths)
  }
}

export { print }
