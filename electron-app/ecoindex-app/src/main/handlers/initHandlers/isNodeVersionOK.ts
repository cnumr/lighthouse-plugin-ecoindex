import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { channels, utils } from '../../../shared/constants'
import { getMainWindow, setNodeV } from '../../memory'

import { ConfigData } from '../../../class/ConfigData'
import Store from 'electron-store'
import { exec } from 'child_process'
import { getMainLog } from '../../main'

const store = new Store()

/**
 * Initialization, Check if Node version is OK.
 * @param _event MainEvent.
 * @returns Promise&lt;ConfigData>
 */
export const initIsNodeNodeVersionOK = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initIsNodeNodeVersionOK'
    )
    const toReturned = new ConfigData('node_version_is_ok')
    return new Promise<ConfigData>((resolve) => {
        const cmd = `node -v`
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                mainLog.error(`exec error: ${error}`)
                toReturned.error =
                    toReturned.message = `Node version can't be detected`
                return resolve(toReturned)
            }
            if (stderr) mainLog.debug(`stderr: ${stderr}`)
            if (stdout) {
                const returned: string = stdout.trim()
                // mainLog.debug(`Node version: ${returned}`)
                const major = returned.replace('v', '').split('.')[0]
                // if (stderr) mainLog.error(`stderr: ${stderr}`)
                toReturned.result = Number(major) >= utils.LOWER_NODE_VERSION
                toReturned.message = returned
                setNodeV(returned)
                store.set(`nodeVersion`, returned)
                // mainLog.debug(toReturned)
                getMainWindow().webContents.send(
                    channels.HOST_INFORMATIONS_BACK,
                    toReturned
                )
                return resolve(toReturned)
            }
        })
    })
}
