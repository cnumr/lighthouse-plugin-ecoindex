import i18n, { init, use } from 'i18next'

import { config } from './app.config'

// const reactI18nextModule = ri18next.reactI18nextModule
// eslint-disable-next-line @typescript-eslint/no-var-requires
const reactI18nextModule = require('react-i18next').reactI18nextModule

const i18nextOptions = {
    interpolation: {
        escapeValue: false,
    },

    saveMissing: true,

    lng: 'en',

    fallbackLng: config.fallbackLng,

    whitelist: config.languages,

    react: {
        wait: false,
    },
}

use(reactI18nextModule)

// initialize if not already initialized

if (!i18n.isInitialized) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    init(i18nextOptions)
}

export default i18n
