import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { getMainLog } from '../../main'
import os from 'node:os'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initGetHomeDir = (_event: IpcMainEvent | IpcMainInvokeEvent) => {
    const mainLog = getMainLog().scope('main/initialization/initGetHomeDir')
    const toReturned = new ConfigData('homeDir')
    return new Promise<ConfigData>((resolve, reject) => {
        try {
            const { homedir } = os.userInfo()
            toReturned.result = homedir
            resolve(toReturned)
        } catch (error) {
            mainLog.error(`Error on handleHomeDir 🚫`)
            toReturned.error = `Error on handleHomeDir 🚫`
            toReturned.message = `Error on handleHomeDir 🚫`
            reject(toReturned)
        }
    })
}
