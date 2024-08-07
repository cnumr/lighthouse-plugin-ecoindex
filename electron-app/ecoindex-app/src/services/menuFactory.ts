import { BrowserWindow, Menu } from 'electron'

import { config } from '../configs/app.config'
import { darwinTemplate } from '../menus/darwinMenu'
import i18n from '@/configs/i18next.config'
import log from 'electron-log/main'
import { otherTemplate } from '../menus/otherMenu'

const menu: Electron.Menu = null

log.initialize()
const menuFactoryLog = log.scope('main/menuFactory')

// const platform = process.platform

function MenuFactoryService(menu: Electron.Menu): void {
    this.menu = menu
    this.buildMenu = buildMenu
}

export function buildMenu(
    app: Electron.App,
    mainWindow: BrowserWindow,
    _i18n: typeof i18n
) {
    // menuFactoryLog.debug(`app.name`, app.name)
    // menuFactoryLog.debug(`_i18n`, _i18n)

    try {
        if (config.platform === 'darwin') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.menu = Menu.buildFromTemplate(
                darwinTemplate(app, mainWindow, _i18n)
            )

            Menu.setApplicationMenu(this.menu)
        } else {
            this.menu = Menu.buildFromTemplate(
                otherTemplate(app, mainWindow, _i18n)
            )
            mainWindow.setMenu(this.menu)
        }
    } catch (error) {
        menuFactoryLog.error(`Error in buildMenu`, error)
    }
}

export default new (MenuFactoryService as any)(menu)
