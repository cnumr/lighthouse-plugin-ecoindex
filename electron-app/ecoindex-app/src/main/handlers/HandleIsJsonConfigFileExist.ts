import { IpcMainEvent } from 'electron'
import Store from 'electron-store'
import fs from 'node:fs'
import { getMainLog } from '../main'
import { isDev } from '../../shared/memory'
import path from 'node:path'
import { showNotification } from '../utils/ShowNotification'
import { utils } from '../../shared/constants'

const store = new Store()

/**
 * Handlers, Test if Json Config File exist in folder after selected it.
 * @param event IpcMainEvent
 * @param workDir string
 * @returns boolean
 */
export const handleIsJsonConfigFileExist = async (
    event: IpcMainEvent,
    workDir: string
) => {
    const mainLog = getMainLog().scope('main/handleIsJsonConfigFileExist')
    if (workDir === 'chargement...' || workDir === 'loading...') return
    const jsonConfigFile =
        `${store.get(`lastWorkDir`, workDir)}/${utils.JSON_FILE_NAME}`.replace(
            /\//gm,
            path.sep
        )
    if (isDev()) mainLog.debug(`handleIsJsonConfigFileExist`, jsonConfigFile)
    try {
        fs.accessSync(jsonConfigFile, fs.constants.F_OK)
        showNotification({
            body: 'Config file founded 👀',
            subtitle: 'loading file content...',
        })
        return true
    } catch (error) {
        mainLog.debug(
            `handleIsJsonConfigFileExist: JSON missing in folder in ${store.get(`lastWorkDir`, workDir)}`
        )
        return false
    }
}
