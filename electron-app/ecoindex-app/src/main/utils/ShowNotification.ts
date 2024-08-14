import { Notification } from 'electron'
import i18n from '../../configs/i18next.config'
import packageJson from '../../../package.json'
/**
 * Utils, Show Notification
 * @param options
 */
export function showNotification(options: any) {
    if (!options) {
        options = {
            body: i18n.t('Notification body'),
            subtitle: i18n.t('Notification subtitle'),
        }
    }
    if (!options.title || options.title === '') {
        options.title = packageJson.productName
    }
    const customNotification = new Notification(options)
    customNotification.show()
}
