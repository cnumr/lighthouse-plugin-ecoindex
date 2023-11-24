import { getFlags } from './cli-flags.js'
import { listAudits } from './commands.js'

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

async function begin() {
  const cliFlags = getFlags()

  // Process terminating command
  //   if (cliFlags.listAllAudits) {
  listAudits()
  //   }
}

export { begin }
