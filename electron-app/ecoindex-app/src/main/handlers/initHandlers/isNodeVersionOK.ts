import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { channels } from '../../../shared/constants'
import { getMainLog } from '../../main'
import { getMainWindow } from '../../../shared/memory'
import { handle_CMD_Actions } from '../HandleCMDActions'

export const initIsNodeNodeVersionOK = async (
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
            toReturned.result = Number(major) >= 20
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
