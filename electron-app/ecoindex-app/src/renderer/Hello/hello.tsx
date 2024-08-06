import AppHello from './AppHello'
import { I18nextProvider } from 'react-i18next'
import React from 'react'
import { createRoot } from 'react-dom/client'
import i18n from '../../configs/i18nResources'

const container = document.getElementById('root') as HTMLElement
console.log(container)

const root = createRoot(container)
root.render(
    <React.Suspense fallback="loading">
        <I18nextProvider i18n={i18n}>
            <AppHello />
        </I18nextProvider>
    </React.Suspense>
)
