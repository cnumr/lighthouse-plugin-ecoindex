export function getPackageName(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../package.json').name || 'undefined'
}
/**
 * Return the version of the plugin
 * @returns {string} version
 */
export function getVersion(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('../../package.json').version || 'undefined'
  } catch {
    throw new Error(`package.json unreachable (reading version).`)
  }
}

export function customLogger(message: string): void {
  console.log(`"log":"${message}"`)
}
