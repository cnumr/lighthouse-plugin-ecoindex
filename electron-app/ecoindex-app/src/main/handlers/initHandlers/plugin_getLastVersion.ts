import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { channels } from '../../../shared/constants'
import { exec } from 'child_process'
import { getMainLog } from '../../main'
import { getMainWindow } from '../../../shared/memory'

export const initPluginGetLastVersion = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent,
    currentInstalledVersion: string
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPluginGetLastVersion'
    )
    mainLog.debug(
        `Check latest version of lighthouse-plugin-ecoindex on registry.`
    )
    /**
     * Dernière version sur le registry.
     */
    let latestVersion = ''
    const toReturned = new ConfigData('plugin_installed')
    return new Promise<ConfigData>((resolve) => {
        const cmd = `npm view lighthouse-plugin-ecoindex version`
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                mainLog.error(`exec error: ${error}`)
                toReturned.error =
                    toReturned.message = `lighthouse-plugin-ecoindex can't check on registery`
                // resolve(toReturned)
            }
            if (stdout) {
                mainLog.debug(`latest version: ${stdout.trim()}`)
                // if (stderr) mainLog.error(`stderr: ${stderr}`)

                latestVersion = stdout.replace(`\n`, ``).trim()
                if (
                    currentInstalledVersion.trim() !==
                    stdout.replace(`\n`, ``).trim()
                ) {
                    toReturned.result = latestVersion.trim()
                    toReturned.message = `Update from version:${currentInstalledVersion.trim()} to latest version:${latestVersion.trim()} needed`
                    mainLog.debug(toReturned.message)
                    getMainWindow().webContents.send(
                        channels.HOST_INFORMATIONS_BACK,
                        toReturned
                    )
                    return resolve(toReturned)
                } else {
                    toReturned.result = latestVersion.trim()
                    toReturned.message = `lighthouse-plugin-ecoindex is up to date`
                    mainLog.debug(toReturned.message)
                    getMainWindow().webContents.send(
                        channels.HOST_INFORMATIONS_BACK,
                        toReturned
                    )
                    return resolve(toReturned)
                }
            }
        })
    })
}
