import * as path from 'node:path'

import { IpcMainEvent, IpcMainInvokeEvent, app } from 'electron'

import Logger from 'electron-log'
import sudoPrompt from '@vscode/sudo-prompt'

/**
 * Handler to install Puppeteer Browser to make mesure with the plugin.
 * @param event IpcMainEvent | IpcMainInvokeEvent
 * @returns
 */
export const handleInstallSudoPuppeteerBrowser = async (
    log: Logger.MainLogger,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event?: IpcMainEvent | IpcMainInvokeEvent | null
) => {
    const mainLog = log.scope('main/sudoPupperteerInstall')
    try {
        // const env = {
        //     ...process.env,
        //     PATH: `${process.env.PATH}:/usr/local/bin`,
        // }
        return new Promise<boolean | string>((resolve, reject) => {
            let childPath = path.join(
                'node_modules',
                'puppeteer',
                'install.mjs'
            )
            if (app.isPackaged) {
                childPath = path.join(
                    process.resourcesPath,
                    'puppeteer',
                    'install.mjs'
                )
                mainLog.debug(`packaged puppeter path`, childPath)
            } else {
                mainLog.debug(`puppeter path`, childPath)
            }
            sudoPrompt.exec(
                childPath,
                { name: 'Ecoindex must install addons' },
                (error, stdout, stderr) => {
                    if (stdout) {
                        // (stdout as Buffer).buffer.  .on('data')
                        mainLog.debug('runProcess', stdout)
                    }
                    if (stderr) {
                        mainLog.debug('runProcess', stderr)
                    }
                    if (error) {
                        reject(error)
                    } else {
                        // mainLog.debug(
                        //     `puppeteer.executablePath()`,
                        //     puppeteer.executablePath()
                        // )
                        resolve(stdout.toString())
                    }
                }
            )
        })
    } catch (error) {
        mainLog.error(`handleInstallPuppeteerBrowser Error`, error)
    }
}
