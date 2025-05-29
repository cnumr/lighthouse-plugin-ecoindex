import { dirname, join } from 'node:path'

import { fileURLToPath } from 'node:url'
import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Return the version of the plugin
 * @returns {string} version
 */
export function getVersion() {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(join(__dirname, '..', 'package.json'), 'utf8'),
    )
    return packageJson.version || 'undefined'
  } catch (error) {
    throw new Error(`package.json unreachable (reading version).`, {
      cause: error,
    })
  }
}
/**
 * Return the version of the plugin
 * @returns {string} version
 */
export function getVersionCurrentBrowser() {
  const packageJson = JSON.parse(
    fs.readFileSync(
      join(__dirname, '..', '..', 'node_modules', 'puppeteer', 'package.json'),
      'utf8',
    ),
  )
  return packageJson.version
}

export function customLogger(message) {
  console.log(`"log":"${message}"`)
}
