import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { accessSync, constants } from 'node:fs'

import { ConfigData } from '../../../class/ConfigData'
import { channels } from '../../../shared/constants'
import { exec } from 'child_process'
import { getMainLog } from '../../main'
import { getMainWindow } from '../../../shared/memory'
import os from 'node:os'
import path from 'node:path'

export const initPluginCanInstall = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPluginGetLastVersion'
    )
    mainLog.debug(
        `Check latest version of lighthouse-plugin-ecoindex on registry.`
    )
    const toReturned = new ConfigData('plugin_installed')
    return new Promise<ConfigData>((resolve) => {
        // npm config get prefix
        const cmd = `npm config get prefix`
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                mainLog.error(`exec error: ${error}`)
                toReturned.result = false
                toReturned.message = `Cant't if user can write`
                return resolve(toReturned)
            }
            if (stderr) mainLog.debug(`stderr: ${stderr}`)
            if (stdout) {
                const returned: string = path.join(
                    stdout.trim(),
                    `lib`,
                    `node_modules`
                )
                // mainLog.debug(`Node path: ${returned}`)
                // if (stderr) mainLog.error(`stderr: ${stderr}`)
                toReturned.result = true
                toReturned.message = `User can is instal plugin in ${returned}`
                try {
                    accessSync(returned, constants.R_OK && constants.W_OK)
                    toReturned.result = true
                    toReturned.message = `User can write in ${returned}`
                    getMainWindow().webContents.send(
                        channels.HOST_INFORMATIONS_BACK,
                        toReturned
                    )
                    return resolve(toReturned)
                } catch (error) {
                    toReturned.result = false
                    toReturned.message = `User CAN'T write in ${returned}`
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
const initPluginCanInstallOLD = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPluginGetLastVersion'
    )
    mainLog.debug(
        `Check latest version of lighthouse-plugin-ecoindex on registry.`
    )
    const toReturned = new ConfigData('plugin_installed')
    return new Promise<ConfigData>((resolve) => {
        try {
            const { homedir } = os.userInfo()
            // for testing `/Users/normaluser/Public` is not writable or readable
            // const npmPath = path.join(
            //     os.platform() === 'win32' ? `C:\\` : `/`,
            //     `Users`,
            //     `normaluser`,
            //     `Public`
            // )
            // npm config get prefix
            const npmPath = path.join(homedir, '.npm')
            accessSync(npmPath, constants.R_OK && constants.W_OK)
            toReturned.result = true
            toReturned.message = `User can write`
        } catch (error) {
            toReturned.result = false
            toReturned.message = `User CAN'T write`
        }
        getMainWindow().webContents.send(
            channels.HOST_INFORMATIONS_BACK,
            toReturned
        )
        resolve(toReturned)
    })
}
