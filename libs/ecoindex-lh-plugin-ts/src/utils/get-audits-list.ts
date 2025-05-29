import path, { dirname, join } from 'path'

import fs from 'fs'
import { fileURLToPath } from 'url'

// const moduleDir = '../'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const moduleDir = join(__dirname, '..')

/**
 * Returns list of audit names for external querying.
 * @return {Promise<string[]>}
 */
async function getAuditList(): Promise<string[]> {
  const ignoredFiles = ['lighthouse-nodes.js']

  const fileList = [
    ...fs.readdirSync(path.join(moduleDir, './audits')),
    ...fs.readdirSync(path.join(moduleDir, './audits/bp')).map(f => `bp/${f}`),
  ]
  return fileList
    .filter(f => {
      return /\.js$/.test(f) && !ignoredFiles.includes(f)
    })
    .sort()
}

async function listAudits() {
  const auditsList = await getAuditList()
  const audits = auditsList.map(i => i.replace(/\.js$/, ''))
  process.stdout.write(JSON.stringify({ audits }, null, 2))
  process.stdout.write('\n')
  //   process.exit(0)
}

export { listAudits }
