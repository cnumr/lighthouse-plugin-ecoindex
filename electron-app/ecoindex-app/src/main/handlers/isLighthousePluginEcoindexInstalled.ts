import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { exec } from 'child_process'
import { getMainLog } from '../main'

/**
 * Check is Mandatory is installed on host.
 * @param _event IpcMainEvent | IpcMainInvokeEvent
 * @returns boolean
 */
export const isLighthousePluginEcoindexInstalled = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event?: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/isLighthousePluginEcoindexInstalled'
    )
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
