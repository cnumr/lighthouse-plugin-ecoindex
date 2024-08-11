import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { exec } from 'child_process'
import { getMainLog } from '../main'

// 1. Check if installed
// 2. Check npm las version
// 3. Update if necessay

/**
 * Check is Mandatory is installed on host.
 * @param _event IpcMainEvent | IpcMainInvokeEvent
 * @returns boolean
 */
export const isLighthousePluginEcoindexMustBeInstallOrUpdated = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event?: IpcMainEvent | IpcMainInvokeEvent
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
                    currentVersion = versions[0].trim()
                    resolve(versions[0].trim())
                } catch (error) {
                    throw new Error(error)
                }
            })
        })
            .then((result) => {
                mainLog.debug(
                    `Check latest version of lighthouse-plugin-ecoindex on registry.`
                )
                return new Promise<boolean>((resolve, reject) => {
                    const cmd = `npm view lighthouse-plugin-ecoindex version`
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            mainLog.error(`exec error: ${error}`)
                            return reject(false)
                        }
                        if (stdout)
                            mainLog.debug(`latest version: ${stdout.trim()}`)
                        // if (stderr) mainLog.error(`stderr: ${stderr}`)
                        latestVersion = stdout.trim()
                        if (result.trim() !== stdout.replace(`\n`, ``).trim()) {
                            mainLog.debug(
                                `Update from version:${result.trim()} to latest version:${stdout.trim()} started 🚀`
                            )
                            resolve(true)
                        } else resolve(false)
                    })
                }).then((needUpdate: boolean) => {
                    if (needUpdate) {
                        mainLog.debug(
                            `Need to update lighthouse-plugin-ecoindex`
                        )
                        new Promise<ResultMessage>((resolve, reject) => {
                            const cmd = `npm install -g lighthouse-plugin-ecoindex`
                            exec(cmd, (error, stdout, stderr) => {
                                if (error) {
                                    mainLog.error(`exec error: ${error}`)
                                    reject(
                                        `lighthouse-plugin-ecoindex install or update error ${error}`
                                    )
                                }
                                // if (stdout) mainLog.debug(`stdout: ${stdout}`)
                                // if (stdout)
                                //   mainLog.debug(
                                //     `lighthouse-plugin-ecoindex installed or updated 🎉`,
                                //   )
                                // if (stderr) mainLog.error(`stderr: ${stderr}`)
                                currentVersion = latestVersion
                                resolve({
                                    result: true,
                                    message: `lighthouse-plugin-ecoindex installed or updated 🎉`,
                                    version: currentVersion,
                                })
                            })
                        })
                            .then((result) => {
                                resolve(result)
                            })
                            .catch((error) => {
                                reject({
                                    result: false,
                                    message: error,
                                    version: currentVersion,
                                })
                            })
                    } else {
                        resolve({
                            result: true,
                            message: `Don't need to update lighthouse-plugin-ecoindex 🚫`,
                            version: latestVersion,
                        })
                    }
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
