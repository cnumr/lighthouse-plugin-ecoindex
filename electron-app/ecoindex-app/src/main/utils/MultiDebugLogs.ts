import { _sendMessageToFrontLog } from './SendMessageToFrontLog'
import { getMainLog } from '../main'

/**
 * Helpers, Launch Multi Debug
 * @param message any
 * @param optionalParams any
 */
export const _debugLogs = (message?: any, ...optionalParams: any[]) => {
    const mainLog = getMainLog().scope('main/multi')
    _sendMessageToFrontLog(message, ...optionalParams)
    mainLog.debug(message, ...optionalParams)
}
