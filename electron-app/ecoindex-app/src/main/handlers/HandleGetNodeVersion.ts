import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { getNodeV, setNodeV } from '../../shared/memory'

import { channels } from '../../shared/constants'
import { getMainLog } from '../main'
import { handle_CMD_Actions } from './HandleCMDActions'
import { sendDataToFront } from '../utils/SendDataToFront'

/**
 * Handlers, Node Version
 * @returns string
 */
export const handleGetNodeVersion = async (
    event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope('main/handleGetNodeVersion')
    try {
        const result = await handle_CMD_Actions(
            event,
            channels.GET_NODE_VERSION
        )
        if (typeof result === 'string') {
            setNodeV(result)
        } else throw new Error()
        sendDataToFront({ 'node-version': getNodeV() })
        return getNodeV()
    } catch (error) {
        mainLog.error(`Check is Node version failed 🚫`, error)
    }
}
