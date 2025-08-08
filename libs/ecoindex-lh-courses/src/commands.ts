import type * as LH from 'lighthouse/types/lh.js'

import { CliFlags, Course, StatementsObj } from './types/index.js'
import {
  checkIfMandatoryBrowserInstalled,
  getMandatoryBrowserExecutablePath,
  installMandatoryBrowser,
} from './install-browser.js'
import fs, { promises as fsPromises } from 'fs'
import path, { dirname, join } from 'path'

import { Browser } from '@puppeteer/browsers'
import { cleanPath } from './converters.js'
import custom_config_default from 'lighthouse-plugin-ecoindex-core/helpers/custom-config'
import { fileURLToPath } from 'url'
import { isDate } from 'util/types'
import logSymbols from 'log-symbols'
import slugifyLib from 'slugify'

// const moduleDir = '../'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const moduleDir = join(__dirname, '..')

/**
 * Returns list of audit names for external querying.
 * @return {Array<string>}
 */
async function getAuditList() {
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

async function dateToFileString(date: string | Date) {
  let _date: string | null | Date = undefined
  if (date === undefined) {
    _date = new Date().toISOString()
  } else {
    _date = date
  }
  if (isDate(_date)) {
    return _date.toISOString().replace(/:/g, '-')
  }
  return _date.replace(/:/g, '-')
}

/**
 * Read en config JSON file
 * @param {CliFlags} cliFlags
 */
async function readJSONFile(cliFlags: CliFlags) {
  const filePath = cliFlags['json-file']
  if (filePath) {
    console.log(`${logSymbols.info} Reading file ${filePath}`)
    const resolvedPath = path.resolve(filePath)
    try {
      const data = await fsPromises.readFile(resolvedPath, 'utf8')
      console.log(`${logSymbols.success} File ${filePath} readed.`)
      cliFlags['jsonFileObj'] = JSON.parse(data)
    } catch (error) {
      console.error(
        `${logSymbols.error} Error reading file from disk: ${error}`,
      )
      process.exit(1)
    }
  }
}

/**
 * Read en extra-heder JSON file
 * @param {CliFlags} cliFlags
 */
async function readExtraHeaderFile(cliFlags: CliFlags) {
  const extraHeader = cliFlags['extra-header']
  if (extraHeader && typeof extraHeader === 'string') {
    console.log(`${logSymbols.info} Parsing extra-header JSON...`)
    try {
      cliFlags['extraHeaderObj'] = JSON.parse(extraHeader)
      console.log(`${logSymbols.info} Parsing extra-header JSON as a string.`)
    } catch {
      console.log(`${logSymbols.info} Reading file ${extraHeader}`)
      const resolvedPath = await path.resolve(extraHeader)
      try {
        const data = fs.readFileSync(resolvedPath, 'utf8')
        console.log(`${logSymbols.success} File ${extraHeader} readed.`)
        cliFlags['extraHeaderObj'] = JSON.parse(data)
      } catch (error) {
        console.error(
          `${logSymbols.error} Error reading file from disk: ${error}`,
        )
        process.exit(1)
      }
    }
  }
}

/**
 * Get the path to the gatherer for the dom-informations plugin
 * @returns {string} The path to the gatherer
 */
// const getGathererDomInformationsPath = () => {
//   const gathererResolvedPath = resolve(
//     'node_modules',
//     'lighthouse-plugin-ecoindex-core',
//     'dist',
//     'gatherers',
//     'dom-informations',
//   )
//   const gathererPath = path.join(
//     'node_modules',
//     'lighthouse-plugin-ecoindex-core',
//     'dist',
//     'gatherers',
//     'dom-informations',
//   )
//   console.debug(`Gatherer path (using path.join)`, gathererPath)
//   console.debug(`Gatherer path (using resolve)`, gathererResolvedPath)
//   return gathererResolvedPath
// }

/**
 * Return config for Lighthouse
 * @param {boolean} isWarm
 * @returns {lighthouse.Config}
 */
function getLighthouseConfig(
  isWarm = false,
  stepName = `undefined`,
  onlyCategories = ['lighthouse-plugin-ecoindex-core'],
  userAgent: string,
): LH.UserFlow.Options {
  return {
    name: stepName,
    config: {
      ...custom_config_default,
      settings: {
        ...custom_config_default.settings,
        formFactor: custom_config_default.settings.formFactor as
          | 'mobile'
          | 'desktop',
        onlyCategories: onlyCategories,
        emulatedUserAgent:
          userAgent === 'random'
            ? userAgentStrings[
                Math.floor(Math.random() * userAgentStrings.length)
              ]
            : userAgent,
        disableStorageReset: isWarm,
      },
    },
  }
}

const userAgentStrings = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.2227.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.3497.92 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
]

async function getPuppeteerConfig() {
  const state = await checkIfMandatoryBrowserInstalled()
  if (!state) {
    try {
      const installedBrowserHeadless = await installMandatoryBrowser(
        Browser.CHROMEHEADLESSSHELL,
      )
      console.log(`Installed Browser`, installedBrowserHeadless)
      const installedBrowser = await installMandatoryBrowser(Browser.CHROME)
      console.log(`Installed Browser`, installedBrowser)
    } catch (error) {
      console.warn('Browser download failed', error)
    }
  }
  return {
    headless: true,
    executablePath: await getMandatoryBrowserExecutablePath(),
    ignoreHTTPSErrors: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
  }
}

function getEnvStatementsObj(
  exportPath: string,
  withStatement = true,
): StatementsObj {
  const _exportPath = withStatement
    ? `${exportPath}/statements`
    : `${exportPath}`
  return {
    courses: [] as Course[],
    statements: {
      json: cleanPath(`${_exportPath}/ecoindex-environmental-statement.json`),
      html: cleanPath(`${_exportPath}/ecoindex-environmental-statement.html`),
      md: cleanPath(`${_exportPath}/ecoindex-environmental-statement.md`),
    },
  }
}

const normalizeSlug = (
  str: { props?: { children: string[] } } | string[] | string,
) => {
  if (str === ``) {
    throw new Error(`Object or String argument can't be empty.`)
  }
  let output = ``

  if (typeof str === 'object') {
    if (Array.isArray(str)) {
      str.forEach(child => {
        output = output + normalizeSlug(child)
      })
      return output
    } else if (str.props && str.props.children) {
      return normalizeSlug(str.props.children)
    }
  }

  try {
    output = (str as string).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  } catch (error) {
    console.warn(error)
    console.warn(`str`, str)
  }
  return output
}

const slugifyFn = slugifyLib as unknown as (
  str: string,
  options?: { lower?: boolean },
) => string

/**
 * Méthode pour slugifier un object ou une string
 * @param {*} children
 * @returns {String} Object or String mith slug format.
 */
const slugify = (children: string) => {
  let slug = ``

  slug = normalizeSlug(children).replace(/\W/g, '-')

  return slugifyFn(slug, {
    lower: true,
  })
}

export {
  dateToFileString,
  getEnvStatementsObj,
  getLighthouseConfig,
  getPuppeteerConfig,
  listAudits,
  readExtraHeaderFile,
  readJSONFile,
  slugify,
}
