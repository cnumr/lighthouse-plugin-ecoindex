import { getWorkDir, isDev } from '../../shared/memory'

import { IpcMainEvent } from 'electron'
import { _debugLogs } from '../utils/MultiDebugLogs'
import { _sendMessageToFrontLog } from '../utils/SendMessageToFrontLog'
import { convertJSONDatasFromString } from '../utils/ConvertJSONDatas'
import fs from 'node:fs'
import { getMainLog } from '../main'
import { showNotification } from '../utils/ShowNotification'
import { utils } from '../../shared/constants'

/**
 * Handlers, Json config Read and Reload.
 * @param event IpcMainEvent
 * @returns Promise<IJsonMesureData>
 */
export const handleJsonReadAndReload = async (
    event: IpcMainEvent
): Promise<IJsonMesureData> => {
    const mainLog = getMainLog().scope('main/handleJsonReadAndReload')
    showNotification({
        subtitle: '🧩 JSON reload',
        body: 'Process intialization.',
    })
    try {
        const _workDir = await getWorkDir()
        if (!_workDir || _workDir === '') {
            throw new Error('Work dir not found')
        }
        const jsonFilePath = `${_workDir}/${utils.JSON_FILE_NAME}`
        return new Promise((resolve, reject) => {
            const jsonStream = fs.createReadStream(jsonFilePath)
            jsonStream.on('data', function (chunk) {
                const jsonDatas = JSON.parse(chunk.toString())
                if (isDev()) mainLog.debug(`jsonDatas`, jsonDatas)

                showNotification({
                    subtitle: '🔄 JSON reload',
                    body: 'Json file read and reloaded.',
                })
                resolve(
                    convertJSONDatasFromString(jsonDatas) as IJsonMesureData
                )
            })
        })
    } catch (error) {
        _sendMessageToFrontLog(
            'ERROR',
            'Json file not read and reloaded',
            error
        )
        _debugLogs('ERROR', 'Json file not read and reloaded', error)
        showNotification({
            subtitle: '🚫 JSON reload',
            body: `Json file not read and reloaded. ${error}`,
        })
        // throw new Error(`Json file not read and reloaded. ${error}`)
    }
}
