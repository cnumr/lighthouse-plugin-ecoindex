import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import Logger from 'electron-log'
import puppeteer from 'puppeteer'

/**
 * Check if Puppeteer mandatory Browser is installed on host.
 * @param log Logger.MainLogger
 * @param _event IpcMainEvent | IpcMainInvokeEvent
 * @returns boolean
 */
export const isPupperteerBrowserInstalled = (
    log: Logger.MainLogger,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event?: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = log.scope('main/isPupperteerBrowserInstalled')
    try {
        const returned = puppeteer.executablePath()
        mainLog.debug(returned)
        return true
    } catch (error) {
        return false
    }
}
