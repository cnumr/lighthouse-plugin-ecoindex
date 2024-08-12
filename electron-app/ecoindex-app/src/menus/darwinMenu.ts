import { BrowserWindow, app as ElectronApp, shell } from 'electron'

import { config } from '../configs/app.config'
import { getWelcomeWindow } from '../shared/memory'
import i18n from 'i18next'
import log from 'electron-log/main'
import pkg from '../../package.json'

log.initialize()
const darwinTemplateLog = log.scope('main/darwinTemplate')

export const darwinTemplate = (
    app: typeof ElectronApp,
    mainWindow: BrowserWindow,
    _i18n: typeof i18n
): (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] => {
    try {
        const menu: any = [
            {
                label: config.title,
                submenu: [
                    {
                        label: `${_i18n.t('About')} ${pkg.displayName}`,
                        role: 'about',
                    },
                    {
                        type: 'separator',
                    },
                    {
                        label: _i18n.t('Hide App'),
                        accelerator: 'Command+H',
                        role: 'hide',
                    },
                    {
                        label: _i18n.t('Hide Others'),
                        accelerator: 'Command+Shift+H',
                        role: 'hideothers',
                    },
                    {
                        label: _i18n.t('Show All'),
                        role: 'unhide',
                    },
                    {
                        type: 'separator',
                    },
                    {
                        label: _i18n.t('Quit'),
                        accelerator: 'Command+Q',
                        click: () => {
                            app.quit()
                        },
                    },
                ],
            },
            {
                label: _i18n.t('View'),
                submenu: [
                    {
                        label: _i18n.t('Reload'),
                        accelerator: 'Command+R',
                        click: (_: any, focusedWindow: BrowserWindow) => {
                            if (focusedWindow) {
                                focusedWindow.reload()
                            }
                        },
                    },
                    { role: 'forceReload', label: _i18n.t('Force reload') },
                    {
                        label: _i18n.t('Full Screen'),
                        accelerator: 'Ctrl+Command+F',
                        click: (_: any, focusedWindow: BrowserWindow) => {
                            if (focusedWindow) {
                                focusedWindow.setFullScreen(
                                    !focusedWindow.isFullScreen()
                                )
                            }
                        },
                    },
                    {
                        label: _i18n.t('Minimize'),
                        accelerator: 'Command+M',
                        role: 'minimize',
                    },
                    {
                        type: 'separator',
                    },
                    {
                        label: _i18n.t('Toggle Developer Tools'),
                        accelerator: 'Alt+Command+I',
                        click: (_: any, focusedWindow: BrowserWindow) => {
                            focusedWindow.webContents.toggleDevTools()
                        },
                    },
                ],
            },
            {
                label: _i18n.t('Help'),
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
                        label: `${_i18n.t('Open splash window...')}`,
                        click: async () => {
                            await getWelcomeWindow().show()
                        },
                    },
                ],
            },
            // {
            //     label: _i18n.t('Language'),
            //     submenu: whitelist.buildSubmenu(
            //         i18nBackend.changeLanguageRequest,
            //         i18nextMainBackend
            //     ),
            // },
        ]
        const languageMenu = config.lngs.map((languageCode: any) => {
            return {
                label: languageCode.lng,
                type: 'radio',
                checked: i18n.language === languageCode.code,
                click: () => {
                    i18n.changeLanguage(languageCode.code)
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
    } catch (error) {
        darwinTemplateLog.error(error)
    }
}
