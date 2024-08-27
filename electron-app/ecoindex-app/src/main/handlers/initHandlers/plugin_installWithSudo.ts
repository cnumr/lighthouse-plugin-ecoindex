import * as path from 'node:path'

import { IpcMainEvent, IpcMainInvokeEvent, app } from 'electron'

import { ConfigData } from '../../../class/ConfigData'
import { channels } from '../../../shared/constants'
import { getMainLog } from '../../main'
import { getMainWindow } from '../../../shared/memory'
import sudoPrompt from '@vscode/sudo-prompt'

export const initPluginSudoInstallation = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent
) => {
    const mainLog = getMainLog().scope(
        'main/initialization/initPluginSudoInstallation'
    )
    mainLog.debug(`Install plugin.`)
    const toReturned = new ConfigData('plugin_installed')
    return new Promise<ConfigData>((resolve) => {
        // to keep for memory
        // let childPath = path.join('node_modules', 'puppeteer', 'install.mjs')
        // if (app.isPackaged) {
        //     childPath = path.join(
        //         process.resourcesPath,
        //         'puppeteer',
        //         'install.mjs'
        //     )
        //     mainLog.debug(`packaged puppeter path`, childPath)
        // } else {
        //     mainLog.debug(`puppeter path`, childPath)
        // }
        const cmd = `npm install -g --loglevel=error lighthouse-plugin-ecoindex`
        sudoPrompt.exec(
            cmd,
            { name: 'Ecoindex must install addons' },
            (error, stdout, stderr) => {
                if (error) {
                    mainLog.error(`exec error: ${error}`)
                    toReturned.error = error
                    toReturned.message = `lighthouse-plugin-ecoindex install or update error`
                    return resolve(toReturned)
                }
                if (stderr) mainLog.debug(`stderr: ${stderr}`)
                if (stdout) {
                    mainLog.debug(`stdout: ${stdout}`)
                    toReturned.result = true
                    toReturned.message = `lighthouse-plugin-ecoindex installed or updated 🎉`
                    getMainWindow().webContents.send(
                        channels.HOST_INFORMATIONS_BACK,
                        toReturned
                    )
                    return resolve(toReturned)
                }
            }
        )
    })
}
