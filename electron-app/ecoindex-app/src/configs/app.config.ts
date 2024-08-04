import * as os from 'node:os'

import pkg from '../../package.json'
export const config = {
    platform: os.platform(),
    port: process.env.PORT ? process.env.PORT : 3000,
    title: pkg.displayName,
    languages: ['fr', 'en'],
    fallbackLng: 'fr',
    namespace: 'translation',
}
