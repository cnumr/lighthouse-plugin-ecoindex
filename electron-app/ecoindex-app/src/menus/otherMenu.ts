import { BrowserWindow, app as ElectronApp, shell } from 'electron'

import Store from 'electron-store'
import { config } from '../configs/app.config'
import { getWelcomeWindow } from '../shared/memory'
import i18n from 'i18next'
import log from 'electron-log/main'
import pkg from '../../package.json'

log.initialize()
const otherTemplateLog = log.scope('main/otherTemplate')

const store = new Store()

const logFile = `${log.transports.file.getFile().path}`

export const otherTemplate = (
    app: typeof ElectronApp,
    mainWindow: BrowserWindow,
    _i18n: typeof i18n
): (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] => {
    try {
        const languageMenu = config.lngs.map((languageCode: any) => {
            return {
                label: languageCode.lng,
                type: 'radio',
                checked: i18n.language === languageCode.code,
                click: () => {
                    store.set(`language`, languageCode.code)
                    i18n.changeLanguage(languageCode.code)
                },
            }
        }) as unknown as Electron.Menu
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
                label: i18n.t('Language'),
                submenu: languageMenu,
            },
            {
                label: i18n.t('Help'),

                submenu: [
                    {
                        label: `${_i18n.t('Learn More about')} ${pkg.displayName}`,
                        click: async () => {
                            await shell.openExternal(
                                'https://cnumr.github.io/lighthouse-plugin-ecoindex/'
                            )
                        },
                    },
                    {
                        label: `Log...`,
                        click: async () => {
                            await shell.openPath(`${logFile}`)
                        },
                    },
                    {
                        label: `${_i18n.t('Open splash window...')}`,
                        click: async () => {
                            await getWelcomeWindow().show()
                        },
                    },
                ],
            },
        ]

        return menu as unknown as (
            | Electron.MenuItemConstructorOptions
            | Electron.MenuItem
        )[]
    } catch (error) {
        otherTemplateLog.error(error)
    }
}
