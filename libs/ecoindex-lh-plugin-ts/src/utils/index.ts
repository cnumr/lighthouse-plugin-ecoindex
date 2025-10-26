/**
 * Utility functions for package information and logging.
 */

/**
 * Get the package name from package.json.
 * Uses require for Node.js compatibility with ES modules.
 *
 * @returns Package name or 'undefined' if not found
 */
export function getPackageName(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../package.json').name || 'undefined'
}

/**
 * Get the version from package.json.
 * Throws an error if package.json cannot be read.
 *
 * @returns Package version
 * @throws Error if package.json is unreachable
 */
export function getVersion(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('../../package.json').version || 'undefined'
  } catch {
    throw new Error(`package.json unreachable (reading version).`)
  }
}

/**
 * Custom logger that formats messages with quotes.
 * Useful for parsing logs in structured formats.
 *
 * @param message - Message to log
 */
export function customLogger(message: string): void {
  console.log(`"log":"${message}"`)
}
