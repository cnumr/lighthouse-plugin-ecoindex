import { channels } from '../../shared/constants'
import { getMainWindow } from '../../shared/memory'

/**
 * Utils, Send data to Front.
 * @param data string | object
 */
export function sendDataToFront(data: string | object) {
    getMainWindow().webContents.send(
        channels.HOST_INFORMATIONS_BACK,
        typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    )
}
