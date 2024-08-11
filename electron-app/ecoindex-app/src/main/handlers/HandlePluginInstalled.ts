import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { getNodeDir, getNpmDir } from '../../shared/memory'

import fs from 'node:fs'
import { getMainLog } from '../main'
import path from 'node:path'

/**
 * Handlers, Is Ecoindex Lighthouse Plugin installed.
 * @param event IpcMainEvent
 * @returns boolean
 */
export const handlePluginInstalled = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope('main/handlePluginInstalled')
    try {
        fs.accessSync(getNodeDir())
    } catch (error) {
        mainLog.error(
            `in handlePluginInstalled, nodeDir is in error! 🚫`,
            error
        )

        return false
    }
    const npmDir = getNpmDir()
    const pluginDir = `${npmDir}/lighthouse-plugin-ecoindex`.replace(
        /\//gm,
        path.sep
    )
    try {
        fs.accessSync(pluginDir)
        return true
    } catch (error) {
        mainLog.debug(`Lighthouse plugin not installed`)
        return false
    }
}
