import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import {
    getNodeDir,
    getNpmDir,
    getTryNode,
    isDev,
    setNodeDir,
    setNpmDir,
    setTryNode,
} from '../../shared/memory'

import { channels } from '../../shared/constants'
import fs from 'node:fs'
import { getMainLog } from '../main'
import { handle_CMD_Actions } from './HandleCMDActions'
import os from 'node:os'
import path from 'node:path'
import { sendDataToFront } from '../utils/SendDataToFront'
import { sleep } from '../utils/Sleep'

/**
 * Handlers, Get ans Set NodeDir, NpmDir
 * @param log Logger.MainLogger
 * @param event IpcMainEvent | IpcMainInvokeEvent
 * @returns boolean
 */
export const handleNodeInstalled = async (
    event: IpcMainEvent | IpcMainInvokeEvent
): Promise<boolean> => {
    const mainLog = getMainLog().scope('main/handleNodeInstalled')
    // get Node Dir
    try {
        const _nodeDir = await handle_CMD_Actions(
            event,
            channels.IS_NODE_INSTALLED
        )
        if (_nodeDir === '' && getTryNode() > 0) {
            await sleep(2000)
            setTryNode()
            return handleNodeInstalled(event)
        }
        if (_nodeDir.includes(';')) {
            if (isDev()) mainLog.debug(`Clean nodeDir path`)
            setNodeDir(_nodeDir.split(';')[2].replace('\x07', '').trim())
        } else setNodeDir(_nodeDir)
        if (isDev()) mainLog.debug(`nodeDir returned: `, _nodeDir)
        if (isDev()) mainLog.debug(`nodeDir:`, getNodeDir())

        if (os.platform() === `darwin`) {
            setNpmDir(
                getNodeDir()?.replace(/\/bin\/node$/, '') +
                    '/lib/node_modules'.replace(/\//gm, path.sep)
            )
        } else {
            setNpmDir(
                os.userInfo().homedir + `\\AppData\\Roaming\\npm\\node_modules`
            )
        }

        if (isDev()) mainLog.debug(`npmDir: `, getNpmDir())

        sendDataToFront({ 'nodeDir-raw': _nodeDir })
        sendDataToFront({ nodeDir: getNodeDir() })
        sendDataToFront({ npmDir: getNpmDir() })
        const { shell } = os.userInfo()
        sendDataToFront({ shell })
        sendDataToFront({ platform: os.platform() })
        sendDataToFront({ env: process.env })

        try {
            fs.accessSync(getNodeDir())
            return true
        } catch (error) {
            mainLog.error(`has NOT access to Node DIR 🚫`, error)
            return false
        }
    } catch (error) {
        mainLog.error(`Check is Node Installed failed 🚫`, error)
    }
}
