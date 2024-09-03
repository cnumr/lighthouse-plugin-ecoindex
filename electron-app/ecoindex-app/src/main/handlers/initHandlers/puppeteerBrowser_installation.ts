import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { channels } from '../../../shared/constants'
import { exec } from 'child_process'
import { getMainLog } from '../../main'
import { getMainWindow } from '../../memory'

/**
 * Initialization, Install Puppeteer browsers on host.
 * @param _event MainEvent.
 * @returns Promise&lt;ConfigData>
 */
export const initPuppeteerBrowserInstallation = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPuppeteerBrowserInstallation'
    )
    const toReturned = new ConfigData('puppeteer_browser_installation')
    return new Promise<ConfigData>((resolve) => {
        const cmds = [
            `npm install -g puppeteer --loglevel=error`,
            // `npm install -g puppeteer@21.9.0 --loglevel=error`,
            // Mandatory for testing browser installed
            `npx puppeteer browsers install chrome`,
            `npx puppeteer browsers install chrome-headless-shell`,
            // Mandatory for lighthouse-plugin-ecoindex
            `npx puppeteer browsers install chrome@121.0.6167.85`,
            `npx puppeteer browsers install chrome-headless-shell@121.0.6167.85`,
        ]
        const cmd = cmds.join(` && `)
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                mainLog.error(`exec error: ${error}`)
                toReturned.error = error
                toReturned.message = `puppeteer and browsers can't be installed`
                return resolve(toReturned)
            }
            if (stderr) mainLog.debug(`stderr: ${stderr}`)
            if (stdout) {
                const returned: string = stdout.trim()
                mainLog.debug(`log: ${returned}`)
                toReturned.result = true
                toReturned.message = `puppeteer and browsers are installed`
                getMainWindow().webContents.send(
                    channels.HOST_INFORMATIONS_BACK,
                    toReturned
                )
                return resolve(toReturned)
            }
        })
    })
}
