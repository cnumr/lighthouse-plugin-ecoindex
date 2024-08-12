import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { channels } from '../../shared/constants'
import { exec } from 'child_process'
import { getMainLog } from '../main'
import { version } from 'react'

// 1. Check if installed
// 2. Check npm las version
// 3. Update if necessay

/**
 * Check if LighthousePluginEcoindex (Mandatory) is installed on host.
 * @param _event IpcMainEvent | IpcMainInvokeEvent
 * @returns boolean
 */
export const isLighthousePluginEcoindexInstalled = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event?: IpcMainEvent | IpcMainInvokeEvent
): Promise<ResultMessage> => {
    const mainLog = getMainLog().scope(
        'main/isLighthousePluginEcoindexInstalled'
    )
    /**
     * Version installée sur le host.
     */
    let currentVersion = ''
    /**
     * Dernière version sur le registry.
     */
    let latestVersion = ''
    return new Promise<ResultMessage>((resolve, reject) => {
        new Promise<string>((resolve) => {
            mainLog.debug(
                `Check if lighthouse-plugin-ecoindex is installed on host and which version.`
            )
            // const cmd = `npm list -g | grep lighthouse-plugin-ecoindex | grep -Eo '[0-9]{1,}.[0-9]{1,}.[0-9]{1,}'`
            const cmd = `npm list -g`
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    // mainLog.error(`exec error: ${error}`)
                    resolve(`'not installed'`)
                }
                try {
                    const lines = stdout.split('\n')
                    const filteredLines = lines.filter((line) =>
                        line.includes('lighthouse-plugin-ecoindex')
                    )
                    if (filteredLines.length < 1) {
                        resolve(`'not installed'`)
                        return
                    }
                    // Extract version numbers using a regular expression
                    const versionRegex = /\b\d+\.\d+\.\d+\b/g
                    const versions = filteredLines
                        .map((line) => {
                            const match = line.match(versionRegex)
                            return match ? match[0] : null
                        })
                        .filter((version) => version !== null)
                    if (stdout)
                        mainLog.debug(
                            `version installed: ${versions[0].trim()}`
                        )
                    // if (stderr) mainLog.error(`stderr: ${stderr}`)
                    currentVersion = versions[0].replace(`\n`, ``).trim()
                    resolve(versions[0].replace(`\n`, ``).trim())
                } catch (error) {
                    throw new Error(error)
                }
            })
        })
            .then((result) => {
                mainLog.debug(
                    `Check latest version of lighthouse-plugin-ecoindex on registry.`
                )
                return new Promise<ResultMessage>((resolve, reject) => {
                    const cmd = `npm view lighthouse-plugin-ecoindex version`
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            mainLog.error(`exec error: ${error}`)
                            reject(false)
                        }
                        if (stdout)
                            mainLog.debug(`latest version: ${stdout.trim()}`)
                        // if (stderr) mainLog.error(`stderr: ${stderr}`)
                        latestVersion = stdout.replace(`\n`, ``).trim()
                        if (result.trim() !== stdout.replace(`\n`, ``).trim()) {
                            mainLog.debug(
                                `Update from version:${result.trim()} to latest version:${stdout.trim()} needed`
                            )
                            resolve({
                                result: false,
                                message: `Need to update lighthouse-plugin-ecoindex`,
                                targetVersion: stdout.replace(`\n`, ``).trim(),
                                actualVersion: 'not installed',
                            })
                        } else
                            resolve({
                                result: true,
                                message: `lighthouse-plugin-ecoindex is up to date`,
                                targetVersion: stdout.replace(`\n`, ``).trim(),
                                actualVersion: result.replace(`\n`, ``).trim(),
                            })
                    })
                })
                    .then((result: ResultMessage) => {
                        return resolve(result)
                    })
                    .catch((badResult: ResultMessage) => {
                        return reject(badResult)
                    })
            })
            .catch((error) => {
                mainLog.error(error)
                return reject({
                    result: false,
                    message: error,
                    version: latestVersion,
                })
            })
    })
}
