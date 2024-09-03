import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { getMainWindow, getTryNode, setNodeDir, setTryNode } from '../../memory'

import { ConfigData } from '../../../class/ConfigData'
import Store from 'electron-store'
import { channels } from '../../../shared/constants'
import { exec } from 'child_process'
import { getMainLog } from '../../main'
import os from 'node:os'

const store = new Store()

/**
 * Initialization, Check if Node is installed on host.
 * @param _event MainEvent.
 * @returns Promise&lt;ConfigData>
 */
export const initIsNodeInstalled = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initIsNodeInstalled'
    )
    const toReturned = new ConfigData('node_installed')
    return new Promise<ConfigData>((resolve) => {
        const cmd = os.platform() === 'win32' ? `where node` : `which node`
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                mainLog.error(`exec error: ${error}`)
                toReturned.error = toReturned.message = `Node can't be detected`
                return resolve(toReturned)
            }
            if (stderr) mainLog.debug(`stderr: ${stderr}`)
            if (stdout) {
                const returned: string = stdout.trim()
                mainLog.debug(`Node path: ${returned}`)
                toReturned.result = true
                toReturned.message = `Node is Installed in ${returned}`
                setNodeDir(returned)
                store.set(`nodeDir`, returned)
                getMainWindow().webContents.send(
                    channels.HOST_INFORMATIONS_BACK,
                    toReturned
                )
                return resolve(toReturned)
            }
        })
    })
}
