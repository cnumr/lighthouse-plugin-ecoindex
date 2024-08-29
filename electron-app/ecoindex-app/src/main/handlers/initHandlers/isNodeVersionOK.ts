import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { getMainWindow, setNodeV } from '../../../shared/memory'

import { ConfigData } from '../../../class/ConfigData'
import Store from 'electron-store'
import { channels } from '../../../shared/constants'
import { exec } from 'child_process'
import { getMainLog } from '../../main'
import { handle_CMD_Actions } from '../HandleCMDActions'

const store = new Store()

export const initIsNodeNodeVersionOK = async (
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
                mainLog.debug(toReturned)
                return resolve(toReturned)
            }
            if (stdout) {
                const returned: string = stdout.trim()
                mainLog.debug(`Node version: ${returned}`)
                const major = returned.replace('v', '').split('.')[0]
                // if (stderr) mainLog.error(`stderr: ${stderr}`)
                toReturned.result = Number(major) >= 18
                toReturned.message = returned
                setNodeV(returned)
                store.set(`nodeVersion`, returned)
                mainLog.debug(toReturned)
                getMainWindow().webContents.send(
                    channels.HOST_INFORMATIONS_BACK,
                    toReturned
                )
                return resolve(toReturned)
            }
        })
    })
}
const initIsNodeNodeVersionOKOLD = async (
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initIsNodeNodeVersionOK'
    )
    try {
        const returned: string = await handle_CMD_Actions(
            _event,
            channels.GET_NODE_VERSION
        )
        const major = returned.replace('v', '').split('.')[0]

        const toReturned = new ConfigData('node_version_is_ok')
        if (returned === '') {
            toReturned.error = `Node version not found`
        } else {
            toReturned.result = Number(major) >= 18
            toReturned.message = returned
        }
        mainLog.debug(toReturned)
        return new Promise<ConfigData>((resolve) => {
            getMainWindow().webContents.send(
                channels.HOST_INFORMATIONS_BACK,
                toReturned
            )
            resolve(toReturned)
        })
    } catch (error) {
        mainLog.error(error)
    }
}
