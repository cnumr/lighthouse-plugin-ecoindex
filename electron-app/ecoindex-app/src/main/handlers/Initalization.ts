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
import { initPluginCanInstall } from './initHandlers/plugin_canInstall'
import { initPluginGetLastVersion } from './initHandlers/plugin_getLastVersion'
import { initPluginIsIntalled } from './initHandlers/plugin_isInstalled'
import { initPluginNormalInstallation } from './initHandlers/plugin_installNormally'
import { initPluginSudoInstallation } from './initHandlers/plugin_installWithSudo'
import { initPuppeteerBrowserInstallation } from './initHandlers/puppeteerBrowser_installation'
import { initPuppeteerBrowserIsInstalled } from './initHandlers/puppeteerBrowser_isInstalled'
import { initSetNpmDir } from './initHandlers/setNpmDir'

const store = new Store()

type initializedDatas = {
    initIsNodeInstalled?: boolean
    initIsNodeNodeVersionOK?: boolean
    initGetHomeDir?: string
    initGetWorkDir?: string
    initSetNpmDir?: string
    initPuppeteerBrowserIsInstalled?: boolean
    initPluginIsIntalled?: boolean | string
    initPluginGetLastVersion?: string
    initPluginCanInstall?: boolean
    initPluginNormalInstallation?: boolean
    initPluginSudoInstallation?: boolean
}

const readInitalizedDatas = (value: initializedDatas): boolean => {
    return value.initIsNodeInstalled && value.initIsNodeNodeVersionOK
}

const APP_INSTALLED_ONCE = `app_installed_done_once`

export const initialization = async (
    event: IpcMainEvent | IpcMainInvokeEvent,
    forceInitialisation = false
) => {
    const mainLog = getMainLog().scope('main/initialization')
    const initializedDatas: initializedDatas = {}
    try {
        mainLog.log(`Initialization start...`)
        // #region Check First launch
        if (!forceInitialisation) {
            mainLog.log(`0. Is first launch?`)
            const hasBeenInstalledOnce = store.get(APP_INSTALLED_ONCE, false)
            if (!hasBeenInstalledOnce) {
                const firstLaunchDetected = new ConfigData(
                    'app_can_not_be_launched',
                    'error_type_first_install'
                )
                getMainWindow().webContents.send(
                    channels.INITIALIZATION_DATAS,
                    firstLaunchDetected
                )
                return false
            }
        } else {
            mainLog.info(`Installation asked manually for 1st installation.`)
            mainLog.debug(`forced mode started from button`)
        }
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
        mainLog.log(`3. Get Npm Dir...`)
        // #region Npm Dir
        const getNpmDirReturned = await initSetNpmDir(event)
        initializedDatas.initSetNpmDir = getNpmDirReturned.result as string
        mainLog.log(getNpmDirReturned.toString())
        mainLog.log(`4. Get User HomeDir...`)
        // #region Home Dir
        const getHomeDirReturned = await initGetHomeDir(event)
        initializedDatas.initGetHomeDir = getHomeDirReturned.result as string
        mainLog.log(getHomeDirReturned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            getHomeDirReturned
        )
        mainLog.log(`5. Get Last used WorkDir or fallback in User HomeDir ...`)
        // #region WorkDir
        const getWorkDirReturned = await initGetWorkDir(event)
        initializedDatas.initGetWorkDir = getWorkDirReturned.result as string
        mainLog.log(getWorkDirReturned.toString())
        getMainWindow().webContents.send(
            channels.INITIALIZATION_DATAS,
            getWorkDirReturned
        )
        mainLog.log(`6. Is a Puppeteer Browser installed ...`)
        // #region Puppeteer Browser Installed
        let getPuppeteerBrowserIsInstalledReturned =
            await initPuppeteerBrowserIsInstalled(event)
        initializedDatas.initPuppeteerBrowserIsInstalled =
            getPuppeteerBrowserIsInstalledReturned.result !== null
        // #region Puppeteer Browser Installation
        if (getPuppeteerBrowserIsInstalledReturned.error) {
            mainLog.log(`6.a Puppeteer Browser need to be installed ...`)
            const getPuppeteerBrowserInstallationReturned =
                await initPuppeteerBrowserInstallation(event)
            // #region Puppeteer Browser Verification
            if (getPuppeteerBrowserInstallationReturned.result !== null) {
                mainLog.log(
                    `6.b Verification Puppeteer installed after installation ...`
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

        mainLog.log(`7.1 Is a Plugin installed on host ...`)
        // #region Plugin Installed
        const getPluginIsInstalledReturned = await initPluginIsIntalled(event)
        initializedDatas.initPluginIsIntalled =
            getPluginIsInstalledReturned.result as string
        mainLog.log(getPluginIsInstalledReturned.toString())
        // #region Plugin Last Version
        if (initializedDatas.initPluginIsIntalled) {
            // plugin installed
            mainLog.log(`7.2 Plugin is Installed on host ...`)
            mainLog.log(`7.2 Check plugin last version on registry ...`)
            const getPluginGetLastVersionReturned =
                await initPluginGetLastVersion(
                    event,
                    initializedDatas.initPluginIsIntalled
                )
            initializedDatas.initPluginGetLastVersion =
                getPluginGetLastVersionReturned.result as string
            mainLog.log(getPluginGetLastVersionReturned.toString())
            if (
                initializedDatas.initPluginGetLastVersion ===
                initializedDatas.initPluginIsIntalled
            ) {
                const pluginMessage = `Plugin version installed is ${initializedDatas.initPluginGetLastVersion}`
                const pluginOK = new ConfigData('plugin_installed')
                pluginOK.result = true
                pluginOK.message = pluginMessage
                getMainWindow().webContents.send(
                    channels.INITIALIZATION_DATAS,
                    pluginOK
                )
                const pluginVersion = new ConfigData('plugin_version')
                pluginVersion.result = initializedDatas.initPluginGetLastVersion
                pluginVersion.message = pluginMessage
                getMainWindow().webContents.send(
                    channels.INITIALIZATION_DATAS,
                    pluginVersion
                )
            }
        } else {
            // plugin not installed
            mainLog.log(`7.2 Plugin NOT installed on host ...`)
            mainLog.log(`7.2 Check if electron can write in ~/.npm ...`)
            const getPluginCanInstallReturned =
                await initPluginCanInstall(event)
            initializedDatas.initPluginCanInstall =
                getPluginCanInstallReturned.result as boolean
            mainLog.log(getPluginCanInstallReturned.toString())
            if (initializedDatas.initPluginCanInstall) {
                mainLog.log(`7.3 Electron can write in ~/.npm ...`)
                mainLog.log(`7.3 Plugin installation ...`)
                const getPluginNormalInstallationReturned =
                    await initPluginNormalInstallation(event)
                initializedDatas.initPluginNormalInstallation =
                    getPluginNormalInstallationReturned.result as boolean
                mainLog.log(getPluginNormalInstallationReturned.toString())
                const normalPluginInstallation = new ConfigData(
                    'plugin_installed'
                )
                normalPluginInstallation.result =
                    initializedDatas.initPluginNormalInstallation
                normalPluginInstallation.message =
                    initializedDatas.initPluginNormalInstallation
                        ? `Plugin installed`
                        : `Installation plugin failed`
                getMainWindow().webContents.send(
                    channels.INITIALIZATION_DATAS,
                    normalPluginInstallation
                )
            } else {
                mainLog.log(`7.3 Electron CAN'T write in ~/.npm ...`)
                mainLog.log(`7.3 Plugin SUDO installation ...`)
                const getPluginSudoInstallationReturned =
                    await initPluginSudoInstallation(event)
                initializedDatas.initPluginSudoInstallation =
                    getPluginSudoInstallationReturned.result as boolean
                mainLog.log(getPluginSudoInstallationReturned.toString())
                const sudoPluginInstallation = new ConfigData(
                    'plugin_installed'
                )
                sudoPluginInstallation.result =
                    initializedDatas.initPluginNormalInstallation
                sudoPluginInstallation.message =
                    initializedDatas.initPluginNormalInstallation
                        ? `Plugin installed`
                        : `Installation plugin failed`
                getMainWindow().webContents.send(
                    channels.INITIALIZATION_DATAS,
                    sudoPluginInstallation
                )
            }
        }

        // #region END
        store.set(APP_INSTALLED_ONCE, true)
        // TODO
        return readInitalizedDatas(initializedDatas)
    } catch (error) {
        mainLog.error(error)
        return false
    }
}
