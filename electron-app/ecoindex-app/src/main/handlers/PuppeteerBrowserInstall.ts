import * as path from 'node:path'

import { ChildProcess, fork } from 'child_process'
import { IpcMainEvent, IpcMainInvokeEvent, app } from 'electron'

import Logger from 'electron-log'
import puppeteer from 'puppeteer'

/**
 * Handler to install Puppeteer Browser to make mesure with the plugin.
 * @param _event IpcMainEvent | IpcMainInvokeEvent
 * @param _echoReadable A loggin function referenced in main
 * @returns
 */
export const handleInstallPuppeteerBrowser = async (
    log: Logger.MainLogger,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent | null,
    _echoReadable: CallableFunction
) => {
    const mainLog = log.scope('main/pupperteerInstall')
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
            const childProcess: ChildProcess = fork(childPath, [], {
                stdio: 'pipe',
                env: { ...process.env },
                ...(app.isPackaged
                    ? null
                    : { execArgv: ['--inspect=127.0.0.1:9228'] }),
                // in documentation, but lint error...
                // allowLoadingUnsignedLibraries: true,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                serviceName: 'InstallPuppeteerBrowser',
            })

            childProcess.on('exit', (code: number, signal: string) => {
                mainLog.debug(
                    `handleInstallPuppeteerBrowser pid: ${childProcess.pid}; exited: ${code}; signal: ${signal}`
                )
                if (signal !== null) {
                    mainLog.error(`handleInstallPuppeteerBrowser failed 🚫`)
                    reject(`handleInstallPuppeteerBrowser failed 🚫`)
                }
            })

            childProcess.on('close', (code: number) => {
                mainLog.debug(`handleInstallPuppeteerBrowser closed: ${code}`)
                if (code === 0) {
                    mainLog.debug(`handleInstallPuppeteerBrowser done 🚀`)
                    mainLog.debug(
                        `puppeteer.executablePath()`,
                        puppeteer.executablePath()
                    )
                    resolve(`handleInstallPuppeteerBrowser done 🚀`)
                } else {
                    reject(`handleInstallPuppeteerBrowser failed 🚫`)
                }

                if (childProcess.stderr) {
                    childProcess.stderr.on('data', (data: string) => {
                        mainLog.debug(
                            `handleInstallPuppeteerBrowser stderr: ${data}`
                        )
                    })
                }
            })

            childProcess.on('disconnect', () => {
                mainLog.debug(
                    `handleInstallPuppeteerBrowser Child process disconnected`
                )
            })
            childProcess.on(
                'message',
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (message: string, _sendHandle?: CallableFunction) => {
                    mainLog.debug(
                        `handleInstallPuppeteerBrowser Child process message: ${message}`
                    )
                }
            )

            if (childProcess.stdout) {
                childProcess.stdout.on('data', () => {
                    _echoReadable(event, childProcess.stdout)
                })
            }
        })
    } catch (error) {
        mainLog.error(`handleInstallPuppeteerBrowser Error`, error)
    }
}
