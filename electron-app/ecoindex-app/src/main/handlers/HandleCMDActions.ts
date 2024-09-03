import * as path from 'node:path'

import { ChildProcess, spawn } from 'child_process'
import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import {
    channels,
    scripts as custom_scripts,
    scripts,
} from '../../shared/constants'

import { _debugLogs } from '../utils/MultiDebugLogs'
import { _echoReadable } from '../utils/EchoReadable'
import { getMainLog } from '../main'
import os from 'node:os'

/**
 * Handlers, Generic CMD action
 * @deprecated Scripts `sh` or `cmd` not used. Kipping file to reuse.
 * @param log Logger.MainLogger
 * @param event IpcMainEvent
 * @param action string
 * @returns Promise<string>
 */
const handle_CMD_Actions = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: IpcMainEvent | IpcMainInvokeEvent | null,
    action: string
): Promise<string> | string => {
    const mainLog = getMainLog().scope('main/handleCMDActions')
    // Create configuration from host and script_type
    const config: {
        runner: string
        launcher: string
        filePath: string[]
        actionCMDFile: string
        actionName: string
        actionShortName: string
        cmd: string
        out: string[]
    } = {
        runner: os.platform() === 'win32' ? 'cmd.exe' : 'sh',
        launcher: os.platform() === 'win32' ? '/c' : '-c',
        filePath: undefined,
        actionCMDFile: undefined,
        actionName: undefined,
        actionShortName: undefined,
        cmd: undefined,
        out: [],
    }

    const ext = os.platform() === 'win32' ? 'bat' : 'sh'
    switch (action) {
        case channels.INSTALL_LIGHTHOUSE_PLUGIN_ECOINDEX:
            config['actionName'] = 'LighthouseEcoindexPluginInstall'
            config['actionShortName'] = 'Install plugin'
            config['actionCMDFile'] =
                `${custom_scripts.INSTALL_LIGHTHOUSE_PLUGIN_ECOINDEX}.${ext}`
            break
        // case channels.UPDATE_ECOINDEX_PLUGIN:
        //     config['actionName'] = 'LighthouseEcoindexPluginUpdate'
        //     config['actionShortName'] = 'Update plugin'
        //     config['actionCMDFile'] = `${custom_scripts.UPDATED_PLUGIN}.${ext}`
        //     break
        case channels.IS_NODE_INSTALLED:
            config['actionName'] = 'isNodeInstalled'
            config['actionShortName'] = 'Node installed'
            config['actionCMDFile'] = `${scripts.GET_NODE}.${ext}`
            break
        case channels.GET_NODE_VERSION:
            config['actionName'] = 'getNodeVersion'
            config['actionShortName'] = 'Node version'
            config['actionCMDFile'] = `${scripts.GET_NODE_VERSION}.${ext}`
            break
        case channels.INSTALL_PUPPETEER_BROWSER:
            config['actionName'] = 'installPupperteerBrowser'
            config['actionShortName'] = 'Puppeteer Browser installation'
            config['actionCMDFile'] =
                `${scripts.INSTALL_PUPPETEER_BROWSER}.${ext}`
            break

        default:
            throw new Error(`${action} not handled in handle_CMD_Actions`)
    }

    try {
        _debugLogs(`handle${config['actionName']} started 🚀`)

        config['filePath'] = [
            `${
                process.env['WEBPACK_SERVE'] === 'true'
                    ? __dirname
                    : process.resourcesPath
            }/scripts/${os.platform()}/${config['actionCMDFile']}`.replace(
                /\//gm,
                path.sep
            ),
        ]
        _debugLogs(`Try childProcess on`, config['filePath'])

        if (os.platform() === `darwin`) {
            config['cmd'] =
                `chmod +x ${config['filePath']} && ${config['runner']} ${config['filePath']}`
        } else if (os.platform() === `win32`) {
            config['cmd'] = ` ${config['filePath']}`
        }

        return new Promise((resolve, reject) => {
            const childProcess: ChildProcess = spawn(
                config['runner'] as string,
                [config['launcher'], config['cmd']],
                {
                    stdio: ['pipe', 'pipe', process.stderr, 'ipc'],
                    env: process.env,
                    windowsHide: true,
                    // shell: shell,
                }
            )

            childProcess.on('exit', (code, signal) => {
                _debugLogs(
                    `${config['actionName']} exited: ${code}; signal: ${signal}`
                )
            })

            childProcess.on('close', (code) => {
                _debugLogs(`${config['actionName']} closed: ${code}`)
                if (code === 0) {
                    // _sendMessageToFrontLog(`${config['actionShortName']} done 🚀`)
                    _debugLogs(`${config['actionShortName']} done 🚀`)
                    if (
                        action === channels.IS_NODE_INSTALLED ||
                        action === channels.GET_NODE_VERSION
                    ) {
                        if (config['out'].at(-1)) {
                            resolve(
                                config['out']
                                    .at(-1)
                                    .replace(/[\r\n]/gm, '')
                                    //.replace('\\node.exe', '') // voir si il faut l'enlever...
                                    .trim() as string
                            )
                        } else {
                            reject(
                                `Process ${config['actionShortName']} failed, out is unknown 🚫`
                            )
                        }
                    } else {
                        resolve(`${config['actionShortName']} done 🚀`)
                    }
                } else {
                    // _sendMessageToFrontLog(`${config['actionShortName']} failed 🚫`)
                    _debugLogs(`${config['actionShortName']} failed 🚫`)
                    reject(`${config['actionShortName']} failed 🚫`)
                }
            })

            if (childProcess.stderr) {
                childProcess.stderr.on('data', (data) => {
                    console.error(
                        `${config['actionShortName']} stderr: ${data}`
                    )
                    _debugLogs(`${config['actionShortName']} stderr: ${data}`)
                })
            }

            childProcess.on('disconnect', () => {
                _debugLogs(
                    `${config['actionShortName']} Child process disconnected`
                )
            })

            childProcess.on('message', (message, sendHandle) => {
                _debugLogs(
                    `${config['actionShortName']} Child process message: ${message}`
                )
            })

            if (childProcess.stdout) {
                _echoReadable(_event, childProcess.stdout)
                childProcess.stdout.on('data', (data) => {
                    config['out'].push(data.toString())
                })
            }
        })
    } catch (error) {
        _debugLogs(`error`, error)
        return `${config['actionShortName']} failed 🚫`
    }
}
