import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import {
    getMainWindow,
    getTryNode,
    setNodeDir,
    setTryNode,
} from '../../../shared/memory'

import { ConfigData } from '../../../class/ConfigData'
import Store from 'electron-store'
import { channels } from '../../../shared/constants'
import { exec } from 'child_process'
import { getMainLog } from '../../main'
import { handle_CMD_Actions } from '../HandleCMDActions'
import os from 'node:os'
import { sleep } from '../../../main/utils/Sleep'

const store = new Store()

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

// #region DEPRECATED
/**
 *
 * @param _event
 * @returns {string}
 */
const fetchNode = async (
    _event: IpcMainEvent | IpcMainInvokeEvent
): Promise<string> => {
    const _nodeDir = await handle_CMD_Actions(
        _event,
        channels.IS_NODE_INSTALLED
    )
    // #region tries read node
    // give some tries before return false
    if (_nodeDir === '' && getTryNode() > 0) {
        await sleep(2000)
        setTryNode()
        return fetchNode(_event)
    }
    return _nodeDir as string
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initIsNodeInstalledOld = async (
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initIsNodeInstalled'
    )
    try {
        const returned: string = await fetchNode(_event)

        const toReturned = new ConfigData('node_installed')
        if (returned === '') {
            toReturned.error = `Node not found`
        } else {
            toReturned.result = true
            toReturned.message = `Node is Installed in ${returned}`
            setNodeDir(returned)
            store.set(`nodeDir`, returned)
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
