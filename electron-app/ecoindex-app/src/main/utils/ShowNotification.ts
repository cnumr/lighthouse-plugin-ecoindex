import { Notification } from 'electron'
import packageJson from '../../../package.json'
/**
 * Utils, Show Notification
 * @param options
 */
export function showNotification(options: any) {
    if (!options) {
        options = {
            body: 'Notification body',
            subtitle: 'Notification subtitle',
        }
    }
    if (!options.title || options.title === '') {
        options.title = packageJson.productName
    }
    const customNotification = new Notification(options)
    customNotification.show()
}
