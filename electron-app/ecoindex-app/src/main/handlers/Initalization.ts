import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../class/ConfigData'
import Store from 'electron-store'
import { channels } from '../../shared/constants'
import { getMainLog } from '../main'
import { getMainWindow } from '../../shared/memory'
import { initGetHomeDir } from './initHandlers/getHomeDir'
import { initGetWorkDir } from './initHandlers/getWorkDir'
import { initIsNodeInstalled } from './initHandlers/IsNodeInstalled'
import { initIsNodeNodeVersionOK } from './initHandlers/isNodeVersionOK'

const store = new Store()

type initializedDatas = {
    initIsNodeInstalled?: boolean
    initIsNodeNodeVersionOK?: boolean
    initGetHomeDir?: string
    initGetWorkDir?: string
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
        if (isNodeReturned.error) {
            mainLog.info(`Without Node, the app can't work. Stop and alert.`)
            const stopWithoutNode = new ConfigData('app_can_not_be_launched')
            stopWithoutNode.error = `No Node installed`
            stopWithoutNode.message = `Without Node, the app can't work. Stop and alert.`
            getMainWindow().webContents.send(
                channels.INITIALIZATION_DATAS,
                stopWithoutNode
            )
            // stop all
            return false
        }
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
        mainLog.log(`3. Get User HomeDir...`)
        // #region Node installed
        const getHomeDirReturned = await initGetHomeDir(event)
        initializedDatas.initGetHomeDir = getHomeDirReturned.result as string
        mainLog.log(getHomeDirReturned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            getHomeDirReturned
        )
        mainLog.log(`4. Get Last used WorkDir or fallback in User HomeDir ...`)
        // #region Node installed
        const getWorkDirReturned = await initGetWorkDir(event)
        initializedDatas.initGetWorkDir = getWorkDirReturned.result as string
        mainLog.log(getWorkDirReturned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            getWorkDirReturned
        )

        return readInitalizedDatas(initializedDatas)
    } catch (error) {
        mainLog.error(error)
        return false
    }
}
