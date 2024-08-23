import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { getMainLog } from '../../main'
import os from 'node:os'
import puppeteer from 'puppeteer'

export const initPuppeteerBrowserIsInstalled = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPuppeteerBrowserIsInstalled'
    )
    const toReturned = new ConfigData('puppeteer_browser_installed')

    try {
        const { homedir } = os.userInfo()
        const { platform, arch } = os
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const executablePath = `${homedir}/.cache/puppeteer/chrome-headless-shell/${platform}_${arch}-127.0.6533.119`
        // mainLog.debug(`executablePath`, executablePath)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const browser = await puppeteer.launch()
        const puppeterVersion = await (await browser.newPage())
            .browser()
            .version()
        await browser.close()
        toReturned.result = puppeterVersion
        toReturned.message = `Puppeteer Browser installed=${puppeterVersion}`
    } catch (error) {
        mainLog.error(`Error on initPuppeteerBrowserIsInstalled 🚫`, error)
        toReturned.error = `Error on initPuppeteerBrowserIsInstalled 🚫`
        toReturned.message = `Error on initPuppeteerBrowserIsInstalled 🚫`
    }
    return new Promise<ConfigData>((resolve) => {
        // toReturned.result ? resolve(toReturned) : reject(toReturned)
        resolve(toReturned)
    })
}
