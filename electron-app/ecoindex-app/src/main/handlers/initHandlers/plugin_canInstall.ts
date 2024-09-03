import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { accessSync, constants } from 'node:fs'
import { getMainWindow, getNpmDir } from '../../memory'

import { ConfigData } from '../../../class/ConfigData'
import Store from 'electron-store'
import { channels } from '../../../shared/constants'
import { getMainLog } from '../../main'
import os from 'node:os'
import sudoPrompt from '@vscode/sudo-prompt'

const store = new Store()

/**
 * Initialization, Detect if User can install plugins.
 * @param _event MainEvent.
 * @returns Promise&lt;ConfigData>
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
        const returned = (store.get(`npmDir`, null) || getNpmDir()) as string
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
    })
}

/**
 * Fix User Rights on NPM Dir (fix bug with Node install on darwin).
 * @param _event MainEvent.
 * @returns Promise&lt;ConfigData>
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
