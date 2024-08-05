import App from './App'
import { I18nextProvider } from 'react-i18next'
import React from 'react'
import { createRoot } from 'react-dom/client'
import i18n from '../configs/i18nResources'
// import log from 'electron-log/renderer'

// const frontLog = log.scope('front/index')

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
    // <React.Suspense fallback="loading">
    // <React.StrictMode>
    <I18nextProvider i18n={i18n}>
        <App />
    </I18nextProvider>
    // </React.StrictMode>
    // </React.Suspense>
)
