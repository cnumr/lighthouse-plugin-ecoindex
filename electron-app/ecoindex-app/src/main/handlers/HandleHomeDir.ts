import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { getMainLog } from '../main'
import os from 'node:os'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleHomeDir = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope('main/handleHomeDir')
    try {
        const { homedir } = os.userInfo()
        return homedir
    } catch (error) {
        mainLog.error(`Error on handleHomeDir 🚫`)
        return `Error on handleHomeDir 🚫`
    }
}
