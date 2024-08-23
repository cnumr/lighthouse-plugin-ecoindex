import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { getTryNode, setNodeDir, setTryNode } from '../../../shared/memory'

import { ConfigData } from '../../../class/ConfigData'
import Store from 'electron-store'
import { channels } from '../../../shared/constants'
import { getMainLog } from '../../main'
import { handle_CMD_Actions } from '../HandleCMDActions'
import { sleep } from '../../../main/utils/Sleep'

const store = new Store()

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

export const initIsNodeInstalled = async (
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initIsNodeInstalled'
    )
    try {
        const returned: string = await fetchNode(_event)

        const output = new ConfigData('node_installed')
        if (returned === '') {
            output.error = `Node not found`
        } else {
            output.result = true
            output.message = `Node is Installed in ${returned}`
            setNodeDir(returned)
            store.set(`nodeDir`, returned)
        }
        mainLog.debug(output)
        return new Promise<ConfigData>((resolve, reject) => {
            // output.error ? reject(output) : resolve(output)
            resolve(output)
        })
    } catch (error) {
        mainLog.error(error)
    }
}