import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import Store from 'electron-store'
import { getMainLog } from '../../main'
import os from 'node:os'

const store = new Store()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initGetWorkDir = (_event: IpcMainEvent | IpcMainInvokeEvent) => {
    const mainLog = getMainLog().scope('main/initialization/initGetWorkDir')
    const toReturned = new ConfigData('workDir')
    const { homedir } = os.userInfo()
    let lastWorkDir = store.get(`lastWorkDir`)
    if (!lastWorkDir) {
        store.set(`lastWorkDir`, homedir)
        lastWorkDir = homedir
    }

    return new Promise<ConfigData>((resolve, reject) => {
        try {
            toReturned.result = lastWorkDir as string
            resolve(toReturned)
        } catch (error) {
            mainLog.error(`Error on initGetWorkDir 🚫`)
            toReturned.error = `Error on initGetWorkDir 🚫`
            toReturned.message = `Error on initGetWorkDir 🚫`
            reject(toReturned)
        }
    })
}
