import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { channels } from '../../../shared/constants'
import { getMainLog } from '../../main'
import { getMainWindow } from '../../memory'
import os from 'node:os'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initGetHomeDir = (_event: IpcMainEvent | IpcMainInvokeEvent) => {
    const mainLog = getMainLog().scope('main/initialization/initGetHomeDir')
    const toReturned = new ConfigData('homeDir')
    return new Promise<ConfigData>((resolve, reject) => {
        try {
            const { homedir } = os.userInfo()
            toReturned.result = homedir
            getMainWindow().webContents.send(
                channels.HOST_INFORMATIONS_BACK,
                toReturned
            )
            resolve(toReturned)
        } catch (error) {
            mainLog.error(`Error on initGetHomeDir 🚫`)
            toReturned.error = `Error on initGetHomeDir 🚫`
            toReturned.message = `Error on initGetHomeDir 🚫`
            getMainWindow().webContents.send(
                channels.HOST_INFORMATIONS_BACK,
                toReturned
            )
            reject(toReturned)
        }
    })
}
