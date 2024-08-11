import { IpcMainEvent, IpcMainInvokeEvent, dialog } from 'electron'

import { getMainLog } from '../main'
import { setWorkDir } from '../../shared/memory'

/**
 * Handlers, SelectFolder
 * @param log Logger.MainLogger
 * @returns string
 */
export const handleSelectFolder = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope('main/handleSelectFolder')
    try {
        const options: Electron.OpenDialogOptions = {
            properties: ['openDirectory', 'createDirectory'],
        }
        const { canceled, filePaths } = await dialog.showOpenDialog(options)
        if (!canceled) {
            setWorkDir(`${filePaths[0]}`)
            return `${filePaths[0]}`
        }
    } catch (error) {
        mainLog.error(`Error in handleSelectFolder`)
    }
}
