import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { channels } from '../../../shared/constants'
import { getMainLog } from '../../main'
import { handle_CMD_Actions } from '../HandleCMDActions'

export const initPuppeteerBrowserInstallation = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPuppeteerBrowserInstallation'
    )
    const toReturned = new ConfigData('puppeteer_browser_installation')
    try {
        const installedPuppetterBrowser = await handle_CMD_Actions(
            _event,
            channels.INSTALL_PUPPETEER_BROWSER
        )
        toReturned.result = installedPuppetterBrowser
    } catch (error) {
        mainLog.error(`Error on initPuppeteerBrowserInstallation 🚫`)
        toReturned.error = `Error on initPuppeteerBrowserInstallation 🚫`
        toReturned.message = `Error on initPuppeteerBrowserInstallation 🚫`
    }
    return new Promise<ConfigData>((resolve, reject) => {
        // toReturned.result ? resolve(toReturned) : reject(toReturned)
        resolve(toReturned)
    })
}
