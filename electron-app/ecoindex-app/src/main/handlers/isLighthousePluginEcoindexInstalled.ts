import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import Logger from 'electron-log'
import { exec } from 'child_process'

/**
 * Check is Mandatory is installed on host.
 * @param log Logger.MainLogger
 * @param _event IpcMainEvent | IpcMainInvokeEvent
 * @returns boolean
 */
export const isLighthousePluginEcoindexInstalled = (
    log: Logger.MainLogger,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event?: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = log.scope('main/isLighthousePluginEcoindexInstalled')
    return new Promise<boolean>((resolve, reject) => {
        const cmd = 'npm list -g | grep lighthouse-plugin-ecoindex'
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                mainLog.error(`exec error: ${error}`)
                reject(false)
                return
            }
            if (stdout) mainLog.debug(`stdout: ${stdout}`)
            if (stderr) mainLog.error(`stderr: ${stderr}`)
            resolve(true)
        })
    })
}
