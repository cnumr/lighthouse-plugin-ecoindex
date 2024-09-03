import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { chomp, chunksToLinesAsync } from '@rauschma/stringio'

import { channels } from '../../shared/constants'
import { cleanLogString } from './CleanLogString'
import { isDev } from '../memory'
import log from 'electron-log/main'

log.initialize()
const mainLog = log.scope('main/echoReadable')

/**
 * Send message to log zone in front of the app
 * @param event
 * @param readable AsyncIterable<string>
 */
export async function _echoReadable(
    event: IpcMainEvent | IpcMainInvokeEvent,
    readable: AsyncIterable<string>
) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    for await (const line of chunksToLinesAsync(readable)) {
        // (C)
        if (isDev()) mainLog.debug('> ' + chomp(line))
        // eslint-disable-next-line no-control-regex, no-useless-escape
        win.webContents.send(
            channels.ASYNCHRONOUS_LOG,
            chomp(cleanLogString(line))
        )
    }
}
