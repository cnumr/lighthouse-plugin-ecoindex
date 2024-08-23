import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { channels } from '../../../shared/constants'
import { getMainLog } from '../../main'
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

        const output = new ConfigData('node_version_is_ok')
        if (returned === '') {
            output.error = `Node version not found`
        } else {
            output.result = Number(major) >= 20
            output.message = returned
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
