import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { getNodeDir, setNpmDir } from '../../../shared/memory'

import { ConfigData } from '../../../class/ConfigData'
import Store from 'electron-store'
import { channels } from '../../../shared/constants'
import { getMainLog } from '../../main'
import { getMainWindow } from '../../../shared/memory'
import os from 'node:os'
import path from 'path'

const store = new Store()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initSetNpmDir = (_event: IpcMainEvent | IpcMainInvokeEvent) => {
    const mainLog = getMainLog().scope('main/initialization/initGetWorkDir')
    const toReturned = new ConfigData('npmDir')
    if (os.platform() === `darwin`) {
        const npmPath: string =
            getNodeDir()?.replace(/\/bin\/node$/, '') +
            '/lib/node_modules'.replace(/\//gm, path.sep)
        setNpmDir(npmPath)
        store.set(`npmDir`, npmPath)
    } else {
        const npmPath: string =
            os.userInfo().homedir + `\\AppData\\Roaming\\npm\\node_modules`
        setNpmDir(npmPath)
        store.set(`npmDir`, npmPath)
    }

    return new Promise<ConfigData>((resolve, reject) => {
        try {
            toReturned.result = store.get(`npmDir`) as string
            getMainWindow().webContents.send(
                channels.HOST_INFORMATIONS_BACK,
                toReturned
            )
            resolve(toReturned)
        } catch (error) {
            mainLog.error(`Error on initSetNpmDir 🚫`)
            toReturned.error = `Error on initSetNpmDir 🚫`
            toReturned.message = `Error on initSetNpmDir 🚫`
            getMainWindow().webContents.send(
                channels.HOST_INFORMATIONS_BACK,
                toReturned
            )
            resolve(toReturned)
        }
    })
}
