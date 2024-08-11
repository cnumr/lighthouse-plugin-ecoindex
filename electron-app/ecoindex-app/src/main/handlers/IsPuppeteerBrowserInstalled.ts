import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { getMainLog } from '../main'
import puppeteer from 'puppeteer'

/**
 * Check if Puppeteer mandatory Browser is installed on host.
 * @param _event IpcMainEvent | IpcMainInvokeEvent
 * @returns boolean
 */
export const isPupperteerBrowserInstalled = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event?: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope('main/isPupperteerBrowserInstalled')
    try {
        const returned = puppeteer.executablePath()
        mainLog.debug(returned)
        return true
    } catch (error) {
        return false
    }
}
