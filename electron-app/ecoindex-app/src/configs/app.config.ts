import pkg from '../../package.json'
export const config = {
    platform: process.platform,
    port: process.env.PORT ? process.env.PORT : 3000,
    title: pkg.displayName,
    languages: ['fr', 'en'],
    lngs: [
        { code: 'fr', lng: 'Français' },
        { code: 'en', lng: 'English' },
    ],
    fallbackLng: 'en',
    namespace: 'translation',
}
