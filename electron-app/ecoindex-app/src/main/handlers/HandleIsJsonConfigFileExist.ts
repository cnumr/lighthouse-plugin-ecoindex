import { getHomeDir, isDev } from '../../shared/memory'

import { IpcMainEvent } from 'electron'
import Store from 'electron-store'
import fs from 'node:fs'
import { getMainLog } from '../main'
import i18n from '../../configs/i18next.config'
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
        `${store.get(`lastWorkDir`, workDir ? workDir : getHomeDir())}/${utils.JSON_FILE_NAME}`.replace(
            /\//gm,
            path.sep
        )
    if (isDev()) mainLog.debug(`handleIsJsonConfigFileExist`, jsonConfigFile)
    try {
        fs.accessSync(jsonConfigFile, fs.constants.F_OK)
        showNotification({
            body: i18n.t('loading file content...'),
            subtitle: i18n.t('Config file founded 👀'),
        })
        return true
    } catch (error) {
        mainLog.debug(
            `handleIsJsonConfigFileExist: JSON missing in folder in ${store.get(`lastWorkDir`, workDir)}`
        )
        return false
    }
}
