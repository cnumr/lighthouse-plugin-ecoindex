import path, { dirname, join } from 'path'

import { fileURLToPath } from 'url'
import fs from 'fs'

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const moduleDir = join(__dirname, '..')

/**
 * Get the list of audit files from the audits directory.
 * Scans both root audits and bp (best practices) subdirectory.
 *
 * @returns Promise resolving to array of audit filenames
 */
async function getAuditList(): Promise<string[]> {
  const ignoredFiles = ['lighthouse-nodes.js']

  // Read all JavaScript files from audits directories
  const fileList = [
    ...fs.readdirSync(path.join(moduleDir, './audits')),
    ...fs.readdirSync(path.join(moduleDir, './audits/bp')).map(f => `bp/${f}`),
  ]

  // Filter for .js files and exclude ignored files
  return fileList
    .filter(f => {
      return /\.js$/.test(f) && !ignoredFiles.includes(f)
    })
    .sort()
}

/**
 * List all available audits and output them as JSON to stdout.
 * Used by external tools to discover available audits in this plugin.
 *
 * @returns Promise that resolves when output is written
 */
async function listAudits() {
  const auditsList = await getAuditList()
  const audits = auditsList.map(i => i.replace(/\.js$/, ''))
  process.stdout.write(JSON.stringify({ audits }, null, 2))
  process.stdout.write('\n')
}

export { listAudits }
