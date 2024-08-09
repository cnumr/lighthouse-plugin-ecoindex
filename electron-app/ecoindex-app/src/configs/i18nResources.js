import i18n from 'i18next'
import log from 'electron-log/renderer'
import resourcesToBackend from 'i18next-resources-to-backend'

const i18nLog = log.scope('main/i18nResources.js')
try {
    i18n.use(
        resourcesToBackend(
            (language, namespace) =>
                import(`../locales/${language}/${namespace}.json`)
        )
    )
        .on('failedLoading', (lng, ns, msg) => console.error(msg))
        .init({
            debug: false,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false, // not needed for react as it escapes by default
            },
        })
    i18n.languages = ['en', 'fr']
} catch (error) {
    i18nLog.error(error)
}

export default i18n
