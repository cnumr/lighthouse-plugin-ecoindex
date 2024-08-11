import { getMainLog } from '../main'
import isElevated from 'native-is-elevated'

/**
 * Modified version of VSCode isAdmin() method
 * @returns boolean
 */
export const isAdmin = () => {
    const mainLog = getMainLog().scope('main/HandlerIsAdmin')
    mainLog.debug('isAdmin asked')
    try {
        let isAdmin: boolean
        if (process.platform === 'win32') {
            isAdmin = isElevated()
        } else {
            isAdmin = process.getuid() === 0
        }
        mainLog.debug('isAdmin', isAdmin)
        return isAdmin
    } catch (error) {
        mainLog.error(error)
    }
    return false
}
