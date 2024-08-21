import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import Store from 'electron-store'
import { channels } from '../../shared/constants'
import { getMainLog } from '../main'
import { getMainWindow } from '../../shared/memory'
import { initIsNodeInstalled } from './initHandlers/IsNodeInstalled'
import { initIsNodeNodeVersionOK } from './initHandlers/isNodeVersionOK'

const store = new Store()

type initializedDatas = {
    initIsNodeInstalled?: boolean
    initIsNodeNodeVersionOK?: boolean
}

const readInitalizedDatas = (value: initializedDatas): boolean => {
    return value.initIsNodeInstalled && value.initIsNodeNodeVersionOK
}

export const initialization = async (
    event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope('main/initialization')
    const initializedDatas: initializedDatas = {}
    try {
        mainLog.log(`Initialization start...`)
        mainLog.log(`1. Node installed start...`)
        // #region Node installed
        const isNodeReturned = await initIsNodeInstalled(event)
        initializedDatas.initIsNodeInstalled = isNodeReturned.result as boolean
        mainLog.log(isNodeReturned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            isNodeReturned
        )
        mainLog.log(`2. Node Version upper or equal to 20 start...`)
        // #region Node installed
        const isNode20Returned = await initIsNodeNodeVersionOK(event)
        initializedDatas.initIsNodeNodeVersionOK =
            isNode20Returned.result as boolean
        mainLog.log(isNode20Returned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            isNode20Returned
        )

        return readInitalizedDatas(initializedDatas)
    } catch (error) {
        mainLog.error(error)
        return false
    }
}
