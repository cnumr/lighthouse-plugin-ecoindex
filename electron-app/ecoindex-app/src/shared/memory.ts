import { BrowserWindow } from 'electron'
import Store from 'electron-store'
import log from 'electron-log/main'
import os from 'node:os'

const logMemory = log.scope(`main/memory`)
const store = new Store()

let nodeDir = ''
let npmDir = ''
let homeDir = ''
let nodeVersion = ''
let mainWindow: BrowserWindow = null
let welcomeWindow: BrowserWindow = null
let showedWelcome = false

export const getWorkDir = () => {
    const lastWorkDir = store.get(`lastWorkDir`)
    logMemory.debug(`getWorkDir>lastWorkDir`, lastWorkDir)
    if (!lastWorkDir) {
        store.set(`lastWorkDir`, os.homedir())
        return os.homedir()
    } else {
        return lastWorkDir
    }
}
export const setWorkDir = (value: string) => {
    store.set('lastWorkDir', value ? value : os.homedir())
}

export const getNodeDir = () => {
    return nodeDir
}
export const setNodeDir = (value: string) => {
    nodeDir = value
}

export const getNpmDir = () => {
    return npmDir
}
export const setNpmDir = (value: string) => {
    npmDir = value
}

export const getNodeV = () => {
    return nodeVersion
}
export const setNodeV = (value: string) => {
    nodeVersion = value
}

export const getHomeDir = () => {
    return homeDir
}
export const setHomeDir = (value: string) => {
    homeDir = value
}

export const getMainWindow = () => {
    return mainWindow
}
export const setMainWindow = (value: BrowserWindow) => {
    mainWindow = value
}

export const getWelcomeWindow = () => {
    return welcomeWindow
}
export const setWelcomeWindow = (value: BrowserWindow) => {
    welcomeWindow = value
}
export const hasShowWelcomeWindow = () => {
    return showedWelcome
}
export const setHasShowedWelcomeWindow = (value: boolean) => {
    showedWelcome = value
}

export const isDev = () => {
    return process.env['WEBPACK_SERVE'] === 'true'
}

let tryNode = 5
export const setTryNode = () => {
    tryNode = tryNode - 1
}

export const getTryNode = () => {
    return tryNode
}
