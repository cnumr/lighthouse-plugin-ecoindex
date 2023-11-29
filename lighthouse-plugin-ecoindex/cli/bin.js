import { generateEnvironmentalStatement, runCourses } from './run.js'

import { getFlags } from './cli-flags.js'
import { listAudits } from './commands.js'
import logSymbols from 'log-symbols'

/**
 * @fileoverview The relationship between these CLI modules:
 *
 *   index.js     : only calls bin.js's begin()
 *   cli-flags.js : leverages yargs to read argv, outputs LH.CliFlags
 *   bin.js       : CLI args processing. cwd, list/print commands
 *   run.js       : chrome-launcher bits, calling core, output to Printer
 *
 *   index ---->    bin    ---->      run      ----> printer
 *                  ⭏  ⭎               ⭏  ⭎
 *               cli-flags        lh-core/index
 */

const DEMO_INPUT_FILE_PATH =
  'lighthouse-plugin-ecoindex/demo/example-input-file.json'

/**
 * @return {Promise<void>}
 */
async function begin() {
  const cliFlags = getFlags()

  if (cliFlags._[0] === 'collect' || cliFlags._[0] === 'convert') {
    if (cliFlags.listAllAudits) {
      listAudits()
    }
    if (cliFlags['demo']) {
      console.log(`${logSymbols.warning} Demo mode enabled.`)
      cliFlags['json-file'] = DEMO_INPUT_FILE_PATH
    }
    console.log(`${logSymbols.info} Command ${cliFlags._[0]} started`)
    if (cliFlags._[0] === 'collect') {
      if (cliFlags['url'] !== undefined) {
        console.log(
          `${logSymbols.warning} Using \`url\` option disable \`Environnemental Statement\` documents generation. Use \`json-file\` to enable it.`,
        )
      }
      await runCourses(cliFlags)
    } else if (cliFlags._[0] === 'convert') {
      await generateEnvironmentalStatement(cliFlags)
    }

    console.log(`${logSymbols.success} Mesure(s) and report(s) finished 👋`)
    process.exit(0)
  }
  console.error(
    `${logSymbols.error} The command \`${cliFlags._[0]}\` is not supported.`,
  )
  process.exit(1)
}

export { begin }
