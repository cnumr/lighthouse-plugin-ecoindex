import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { getMainLog } from '../main'

export const isNodeInstalled = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event?: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope('main/isNodeInstalled')
}
