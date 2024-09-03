import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { getMainWindow, setNpmDir } from '../../memory'

import { ConfigData } from '../../../class/ConfigData'
import Store from 'electron-store'
import { channels } from '../../../shared/constants'
import { exec } from 'child_process'
import { getMainLog } from '../../main'
import os from 'node:os'
import path from 'node:path'

const store = new Store()

/**
 * Initialization, Read and store the Npm Dir use on host.
 * @param _event MainEvent.
 * @returns Promise&lt;ConfigData>
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initSetNpmDir = (_event: IpcMainEvent | IpcMainInvokeEvent) => {
    const mainLog = getMainLog().scope('main/initialization/initGetWorkDir')
    const toReturned = new ConfigData('npmDir')
    return new Promise<ConfigData>((resolve) => {
        try {
            // npm config get prefix
            const cmd = `npm config get prefix`
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    mainLog.error(`exec error: ${error}`)
                    toReturned.error =
                        toReturned.message = `User can't install plugins with NPM`
                    return resolve(toReturned)
                }
                if (stderr) mainLog.debug(`stderr: ${stderr}`)
                if (stdout) {
                    const returned: string =
                        os.platform() === 'win32'
                            ? path.join(stdout.trim(), `node_modules`)
                            : path.join(stdout.trim(), `lib`, `node_modules`)
                    setNpmDir(returned)
                    store.set(`npmDir`, returned)
                    toReturned.result = returned
                    toReturned.message = `Npm Dir located in ${returned}`
                    getMainWindow().webContents.send(
                        channels.HOST_INFORMATIONS_BACK,
                        toReturned
                    )
                    return resolve(toReturned)
                }
            })
        } catch (error) {
            mainLog.error(`Error on initSetNpmDir 🚫`)
            toReturned.error = `Error on initSetNpmDir 🚫`
            toReturned.message = `Error on initSetNpmDir 🚫`
            getMainWindow().webContents.send(
                channels.HOST_INFORMATIONS_BACK,
                toReturned
            )
            return resolve(toReturned)
        }
    })
}
