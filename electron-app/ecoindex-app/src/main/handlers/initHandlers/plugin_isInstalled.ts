import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { exec } from 'child_process'
import { getMainLog } from '../../main'

export const initPluginIsIntalled = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPluginIsIntalled'
    )
    /**
     * Version installée sur le host.
     */
    let currentVersion = ''
    const toReturned = new ConfigData('plugin_installed')
    return new Promise<ConfigData>((resolve) => {
        const cmd = `npm list -g`
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                // mainLog.error(`exec error: ${error}`)
                mainLog.debug(`Lighthouse plugin not installed`)
                // return false
                toReturned.error =
                    toReturned.message = `lighthouse-plugin-ecoindex is installed on host`
                resolve(toReturned)
            }
            if (stdout)
                try {
                    const lines = stdout.split('\n')
                    const filteredLines = lines.filter((line) =>
                        line.includes('lighthouse-plugin-ecoindex')
                    )
                    if (filteredLines.length < 1) {
                        mainLog.debug(`Lighthouse plugin not installed`)
                        // return false
                        toReturned.error =
                            toReturned.message = `lighthouse-plugin-ecoindex is installed on host`
                        resolve(toReturned)
                    }
                    // Extract version numbers using a regular expression
                    const versionRegex = /\b\d+\.\d+\.\d+\b/g
                    const versions = filteredLines
                        .map((line) => {
                            const match = line.match(versionRegex)
                            return match ? match[0] : null
                        })
                        .filter((version) => version !== null)
                    currentVersion = versions[0].replace(`\n`, ``).trim()
                    mainLog.debug(`version installed: ${currentVersion}`)
                    toReturned.result = true
                    toReturned.message = `${currentVersion}`
                    resolve(toReturned)
                } catch (error) {
                    throw new Error(error)
                }
            // if (stderr) mainLog.error(`stderr: ${stderr}`)
        })
    })
}
