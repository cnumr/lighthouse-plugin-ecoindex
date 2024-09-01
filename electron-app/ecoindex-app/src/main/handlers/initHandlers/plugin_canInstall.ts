import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { accessSync, constants } from 'node:fs'

import { ConfigData } from '../../../class/ConfigData'
import { channels } from '../../../shared/constants'
import { exec } from 'child_process'
import { getMainLog } from '../../main'
import { getMainWindow } from '../../../shared/memory'
import os from 'node:os'
import path from 'node:path'
import sudoPrompt from '@vscode/sudo-prompt'

/**
 * Detect if User can install plugins.
 * @param {IpcMainEvent | IpcMainInvokeEvent} _event electron event
 * @returns {Promise<ConfigData>}
 */
export const initPluginCanInstall = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPluginCanInstall'
    )
    mainLog.debug(`Check if User can install plugins with NPM.`)
    const toReturned = new ConfigData('plugins_can_be_installed')
    return new Promise<ConfigData>((resolve) => {
        // npm config get prefix
        const cmd = `npm config get prefix`
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                mainLog.error(`exec error: ${error}`)
                toReturned.result = false
                toReturned.message = `User can't install plugins with NPM`
                return resolve(toReturned)
            }
            if (stderr) mainLog.debug(`stderr: ${stderr}`)
            if (stdout) {
                const returned: string =
                    os.platform() === 'win32'
                        ? path.join(stdout.trim(), `node_modules`)
                        : path.join(stdout.trim(), `lib`, `node_modules`)
                // mainLog.debug(`Node path: ${returned}`)
                toReturned.result = true
                toReturned.message = `User can install plugins in ${returned}`
                try {
                    accessSync(returned, constants.R_OK && constants.W_OK)
                    toReturned.result = true
                    toReturned.message = `User can install in ${returned}`
                    getMainWindow().webContents.send(
                        channels.HOST_INFORMATIONS_BACK,
                        toReturned
                    )
                    return resolve(toReturned)
                } catch (error) {
                    toReturned.result = false
                    toReturned.message = `User CAN'T install in ${returned}`
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

/**
 * Fix User Rights on NPM Dir (fix bug with Node install on darwin).
 * @param {IpcMainEvent | IpcMainInvokeEvent} _event electron event
 * @returns {Promise<ConfigData>}
 */
export const initSudoFixNpmDirRights = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initSudoFixNpmDirRights'
    )
    if (os.platform() === 'darwin') {
        mainLog.debug(`Fix User rights on NPM Dir with sudo.`)
        const toReturned = new ConfigData('fix_npm_user_rights')
        return new Promise<ConfigData>((resolve) => {
            const cmd = `chown -R $USER $(npm config get prefix)/{lib/node_modules,bin,share} && echo "Done"`
            sudoPrompt.exec(
                cmd,
                { name: 'Fix user permissions on Node' },
                (error, stdout, stderr) => {
                    if (error) {
                        mainLog.error(`exec error: ${error}`)
                        toReturned.error = error
                        toReturned.message = `CAN'T fix Npm user rights`
                        return resolve(toReturned)
                    }
                    if (stderr) mainLog.debug(`stderr: ${stderr}`)
                    if (stdout) {
                        const returned: string = (stdout as string).trim()
                        toReturned.result = true
                        toReturned.message = `User rights FIXED returned ${returned}`
                        // getMainWindow().webContents.send(
                        //     channels.HOST_INFORMATIONS_BACK,
                        //     toReturned
                        // )
                        return resolve(toReturned)
                    }
                }
            )
        })
    } else {
        mainLog.debug(
            `NOT ON DARWIN PLATFORM, CAN'T Fix User rights on NPM Dir.`
        )
    }
}
// #region DEPRECATED
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
