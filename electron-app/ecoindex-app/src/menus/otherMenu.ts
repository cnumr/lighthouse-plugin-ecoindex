import { BrowserWindow, app as ElectronApp, shell } from 'electron'

import { config } from '../configs/app.config'
import i18n from '../configs/i18next.config'

export const otherTemplate = (
    app: typeof ElectronApp,
    mainWindow: BrowserWindow,
    _i18n: typeof i18n
): (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] => {
    const menu: any = [
        {
            label: i18n.t('&File'),
            submenu: [
                {
                    label: i18n.t('&Quit'),

                    accelerator: 'Ctrl+Q',

                    click: function () {
                        app.quit()
                    },
                },
            ],
        },
        {
            label: i18n.t('View'),
            submenu: [
                {
                    label: i18n.t('Reload'),
                    accelerator: 'Command+R',
                    click: function (_: any, focusedWindow: BrowserWindow) {
                        focusedWindow.reload()
                    },
                },
                { role: 'forceReload', label: i18n.t('Force reload') },
                {
                    label: i18n.t('Full Screen'),
                    accelerator: 'Ctrl+Command+F',
                    click: function (_: any, focusedWindow: BrowserWindow) {
                        focusedWindow.setFullScreen(
                            !focusedWindow.isFullScreen()
                        )
                    },
                },
                {
                    label: i18n.t('Minimize'),
                    accelerator: 'Command+M',
                    role: 'minimize',
                },
                {
                    type: 'separator',
                },
                {
                    label: i18n.t('Toggle Developer Tools'),
                    accelerator: 'Alt+Command+I',
                    click: function (_: any, focusedWindow: BrowserWindow) {
                        focusedWindow.webContents.toggleDevTools()
                    },
                },
            ],
        },

        {
            label: i18n.t('Help'),

            submenu: [
                {
                    label: i18n.t('Learn More'),
                    click: async () => {
                        await shell.openExternal(
                            'https://cnumr.github.io/lighthouse-plugin-ecoindex/'
                        )
                    },
                },
            ],
        },
    ]

    const languageMenu = config.languages.map((languageCode) => {
        return {
            label: i18n.t(languageCode),
            type: 'radio',
            checked: i18n.language === languageCode,
            click: () => {
                i18n.changeLanguage(languageCode)
            },
        }
    }) as unknown as Electron.Menu
    menu.push({
        label: i18n.t('Language'),
        submenu: languageMenu,
    })

    return menu as unknown as (
        | Electron.MenuItemConstructorOptions
        | Electron.MenuItem
    )[]
}
