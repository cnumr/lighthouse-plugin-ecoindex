import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { exec } from 'child_process'
import { getMainLog } from '../../main'

export const initPluginNormalInstallation = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPluginNormalInstallation'
    )
    mainLog.debug(`Install plugin.`)
    const toReturned = new ConfigData('plugin_installed')
    return new Promise<ConfigData>((resolve) => {
        const cmd = `npm install -g --loglevel=error lighthouse-plugin-ecoindex`
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                mainLog.error(`exec error: ${error}`)
                toReturned.error = error
                toReturned.message = `lighthouse-plugin-ecoindex install or update error`
                return resolve(toReturned)
            }
            if (stderr) mainLog.debug(`stderr: ${stderr}`)
            if (stdout) {
                mainLog.debug(`stdout: ${stdout}`)
                toReturned.result = true
                toReturned.message = `lighthouse-plugin-ecoindex installed or updated 🎉`
                return resolve(toReturned)
            }
        })
    })
}
