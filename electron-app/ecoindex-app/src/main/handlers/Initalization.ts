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
import { initPuppeteerBrowserInstallation } from './initHandlers/puppeteerBrowser_installation'
import { initPuppeteerBrowserIsInstalled } from './initHandlers/puppeteerBrowser_isInstalled'

const store = new Store()

type initializedDatas = {
    initIsNodeInstalled?: boolean
    initIsNodeNodeVersionOK?: boolean
    initGetHomeDir?: string
    initGetWorkDir?: string
    initPuppeteerBrowserIsInstalled?: boolean
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
        // #region Node has good version
        const isNode20Returned = await initIsNodeNodeVersionOK(event)
        initializedDatas.initIsNodeNodeVersionOK =
            isNode20Returned.result as boolean
        mainLog.log(isNode20Returned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            isNode20Returned
        )
        if (isNodeReturned.error) {
            mainLog.info(`Without Node 20, the app can't work. Stop and alert.`)
            const stopWithoutNode20 = new ConfigData('app_can_not_be_launched')
            stopWithoutNode20.error = `No Node 20 installed`
            stopWithoutNode20.message = `Without Node 20, the app can't work. Stop and alert.`
            getMainWindow().webContents.send(
                channels.INITIALIZATION_DATAS,
                stopWithoutNode20
            )
            // stop all
            return false
        }
        mainLog.log(`3. Get User HomeDir...`)
        // #region Home Dir
        const getHomeDirReturned = await initGetHomeDir(event)
        initializedDatas.initGetHomeDir = getHomeDirReturned.result as string
        mainLog.log(getHomeDirReturned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            getHomeDirReturned
        )
        mainLog.log(`4. Get Last used WorkDir or fallback in User HomeDir ...`)
        // #region WorkDir
        const getWorkDirReturned = await initGetWorkDir(event)
        initializedDatas.initGetWorkDir = getWorkDirReturned.result as string
        mainLog.log(getWorkDirReturned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            getWorkDirReturned
        )
        mainLog.log(`5. Is a Puppeteer Browser installed ...`)
        // #region Puppeteer Browser Installed
        let getPuppeteerBrowserIsInstalledReturned =
            await initPuppeteerBrowserIsInstalled(event)
        initializedDatas.initPuppeteerBrowserIsInstalled =
            getPuppeteerBrowserIsInstalledReturned.result !== null
        // #region Puppeteer Browser Installation
        if (getPuppeteerBrowserIsInstalledReturned.error) {
            mainLog.log(`5.a Puppeteer Browser need to be installed ...`)
            const getPuppeteerBrowserInstallationReturned =
                await initPuppeteerBrowserInstallation(event)
            // #region Puppeteer Browser Verification
            if (getPuppeteerBrowserInstallationReturned.result !== null) {
                mainLog.log(
                    `5.b Verification Puppeteer installed after installation ...`
                )
                getPuppeteerBrowserIsInstalledReturned =
                    await initPuppeteerBrowserIsInstalled(event)
                initializedDatas.initPuppeteerBrowserIsInstalled =
                    getPuppeteerBrowserIsInstalledReturned.result !== null
            }
        } else {
            mainLog.log(
                `Puppeteer Browser allready installed, no need to install it`
            )
        }
        mainLog.log(getPuppeteerBrowserIsInstalledReturned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            getPuppeteerBrowserIsInstalledReturned
        )
        if (getPuppeteerBrowserIsInstalledReturned.error) {
            mainLog.info(
                `Without Puppeteer Browser, the app can't work. Stop and alert.`
            )
            const stopWithoutPuppeteerBrowser = new ConfigData(
                'app_can_not_be_launched'
            )
            stopWithoutPuppeteerBrowser.error = `No Puppeteer Browser installed`
            stopWithoutPuppeteerBrowser.message = `Without Puppeteer Browser, the app can't work. Stop and alert.`
            getMainWindow().webContents.send(
                channels.INITIALIZATION_DATAS,
                stopWithoutPuppeteerBrowser
            )
            // stop all
            return false
        }
        // #region

        return readInitalizedDatas(initializedDatas)
    } catch (error) {
        mainLog.error(error)
        return false
    }
}
