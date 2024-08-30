import { BrowserWindow, app as ElectronApp, app, shell } from 'electron'
import { getWelcomeWindow, setHasShowedWelcomeWindow } from '../shared/memory'

import Store from 'electron-store'
import { config } from '../configs/app.config'
import { convertVersion } from '../main/utils'
import { createHelloWindow } from '../main/main'
import i18n from 'i18next'
import log from 'electron-log/main'
import pkg from '../../package.json'

log.initialize()
const darwinTemplateLog = log.scope('main/darwinTemplate')

const store = new Store()

const logFile = `${log.transports.file.getFile().path}`

export const darwinTemplate = (
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
                label: _i18n.t('Edit'),
                submenu: [
                    { label: _i18n.t('Undo'), role: 'undo' },
                    { label: _i18n.t('Redo'), role: 'redo' },
                    { type: 'separator' },
                    { label: _i18n.t('Cut'), role: 'cut' },
                    { label: _i18n.t('Copy'), role: 'copy' },
                    { label: _i18n.t('Paste'), role: 'paste' },
                    {
                        label: _i18n.t('Paste and match style'),
                        role: 'pasteAndMatchStyle',
                    },
                    { label: _i18n.t('Delete'), role: 'delete' },
                    { label: _i18n.t('Select all'), role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: _i18n.t('Speech'),
                        submenu: [
                            {
                                label: _i18n.t('Start speaking'),
                                role: 'startSpeaking',
                            },
                            {
                                label: _i18n.t('Stop speaking'),
                                role: 'stopSpeaking',
                            },
                        ],
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
                label: i18n.t('Language'),
                submenu: languageMenu,
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
                        label: `Log...`,
                        click: async () => {
                            await shell.openPath(`${logFile}`)
                        },
                    },
                    {
                        label: `${_i18n.t('Open splash window...')}`,
                        click: async () => {
                            store.set(
                                `displayHello.${convertVersion(pkg.version)}`,
                                false
                            )
                            setHasShowedWelcomeWindow(false)
                            await createHelloWindow()
                            // await getWelcomeWindow().show()
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

        return menu as unknown as (
            | Electron.MenuItemConstructorOptions
            | Electron.MenuItem
        )[]
    } catch (error) {
        darwinTemplateLog.error(error)
    }
}
