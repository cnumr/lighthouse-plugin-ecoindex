import { channels } from '../../shared/constants'
import { getMainLog } from '../main'
import { getMainWindow } from '../memory'

/**
 * Send message to DEV consol log
 * @param message
 * @param optionalParams
 */
export const _sendMessageToFrontLog = (
    message?: any,
    ...optionalParams: any[]
) => {
    const mainLog = getMainLog().scope('main/sendMessageToFrontLog')
    try {
        getMainWindow().webContents.send(
            channels.HOST_INFORMATIONS,
            message,
            optionalParams
        )
    } catch (error) {
        mainLog.error('Error in _sendMessageToFrontLog', error)
    }
}
