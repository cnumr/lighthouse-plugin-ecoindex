import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import {
    getHomeDir,
    getWorkDir,
    setHomeDir,
    setWorkDir,
} from '../../shared/memory'

import { getMainLog } from '../main'
import os from 'node:os'

/**
 * Handlers, Get WorkDir
 * @param event IpcMainEvent | IpcMainInvokeEvent
 * @param newDir string
 * @returns string
 */
export const handleWorkDir = async (
    _event: IpcMainEvent | IpcMainInvokeEvent,
    newDir: string
) => {
    const mainLog = getMainLog().scope('main/handleWorkDir')
    const { homedir } = os.userInfo()
    if (!homedir) {
        mainLog.error('Home dir not found in userInfo()')
        throw new Error('Home dir not found in userInfo()')
    }
    setHomeDir(`${homedir}`)
    if (newDir) {
        // log replaced by electron-log
        // setLogStream(getLogFilePathFromDir(newDir))

        setWorkDir(`${newDir}`)
    } else {
        setWorkDir(`${getHomeDir()}`)
    }
    return await getWorkDir()
}
