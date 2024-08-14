import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import {
    getHomeDir,
    getWorkDir,
    setHomeDir,
    setWorkDir,
} from '../../shared/memory'

import Store from 'electron-store'
import { getMainLog } from '../main'
import os from 'node:os'

const store = new Store()
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
    if (newDir) {
        // log replaced by electron-log
        // setLogStream(getLogFilePathFromDir(newDir))

        setWorkDir(`${newDir}`)
        mainLog.debug(`workDir:`, newDir)
    } else {
        const _homeDir = os.homedir()
        setHomeDir(_homeDir)
        setWorkDir(store.get(`lastWorkDir`, _homeDir) as string)
    }
    return await getWorkDir()
}
