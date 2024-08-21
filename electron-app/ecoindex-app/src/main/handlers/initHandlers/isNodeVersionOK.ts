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
            output.message = `Node version is ${returned} and it's upper or equal to 20=${output.result}`
        }
        mainLog.debug(output)
        return new Promise<ConfigData>((resolve, reject) => {
            if (output.error) reject(output)
            else resolve(output)
        })
    } catch (error) {
        mainLog.error(error)
    }
}
