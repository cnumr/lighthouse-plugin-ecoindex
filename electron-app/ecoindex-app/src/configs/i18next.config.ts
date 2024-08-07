import i18n, { init, use } from 'i18next'
import path, { join } from 'path'

import { app } from 'electron'
import { config } from './app.config'
import i18nextBackend from 'i18next-node-fs-backend'
import log from 'electron-log/main'

log.initialize()
const i18nLog = log.scope('main/i18next.config')

try {
    const IS_PROD = process.env.NODE_ENV === 'production'
    const root = process.cwd()
    const { isPackaged } = app
    const i18nextOptions = {
        debug: true,
        backend: {
            // path where resources get loaded from
            // loadPath: './src/locales/{{lng}}/{{ns}}.json',
            loadPath:
                IS_PROD && isPackaged
                    ? path.join(
                          process.resourcesPath,
                          'locales/{{lng}}/{{ns}}.json'
                      )
                    : path.join(root, 'src/locales/{{lng}}/{{ns}}.json'),
            // path to post missing resources
            // addPath: './src/locales/{{lng}}/{{ns}}.missing.json',
            // jsonIndent to use when storing json files
            jsonIndent: 2,
        },

        interpolation: {
            escapeValue: false,
        },
        saveMissing: true,
        saveMissingTo: 'all',
        fallbackLng: config.fallbackLng,
        whitelist: config.languages,
        react: {
            wait: false,
        },
    }
    use(i18nextBackend)

    // initialize if not already initialized

    if (!i18n.isInitialized) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        init(i18nextOptions)
    }
    // i18nLog.debug(i18n)
} catch (error) {
    i18nLog.error(error)
}

export default i18n
