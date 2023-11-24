import logSymbols from 'log-symbols'
import { getFlags } from './cli-flags.js'
import { listAudits } from './commands.js'
import { generateEnvironmentalStatement, runCourses } from './run.js'

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

/**
 * @return {Promise<void>}
 */
async function begin() {
  const cliFlags = getFlags()

  if (cliFlags._[0] === 'collect' || cliFlags._[0] === 'convert') {
    if (cliFlags.listAllAudits) {
      listAudits()
    }
    console.log(`${logSymbols.info} Command ${cliFlags._[0]} started`)
    if (cliFlags._[0] === 'collect') {
      return runCourses(cliFlags)
    } else if (cliFlags._[0] === 'convert') {
      return generateEnvironmentalStatement(cliFlags)
    }
  }
  console.error(
    `${logSymbols.error} The command \`${cliFlags._[0]}\` is not supported.`,
  )
  process.exit(1)
}

export { begin }
