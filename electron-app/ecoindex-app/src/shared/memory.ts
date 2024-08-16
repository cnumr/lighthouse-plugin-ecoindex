import { BrowserWindow } from 'electron'
import Store from 'electron-store'
import fs from 'fs'
import log from 'electron-log/main'
import os from 'node:os'

const store = new Store()
const logMemory = log.scope(`main/memory`)

let workDir = ''
let nodeDir = ''
let npmDir = ''
let homeDir = ''
let nodeVersion = ''
let logStream: fs.WriteStream = null
let mainWindow: BrowserWindow = null
let welcomeWindow: BrowserWindow = null
let showedWelcome = false
let logStreamPath = ''

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
    workDir = value
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
export const getLogFilePathFromDir = (dir: string) => {
    return `${dir}/logfile.txt`
}

export const getLogSteam = () => {
    return logStream
}
export const setLogStream = (path: string) => {
    if (path) logStreamPath = path
    logStream = fs.createWriteStream(logStreamPath)
}

let tryNode = 5
export const setTryNode = () => {
    tryNode = tryNode - 1
}

export const getTryNode = () => {
    return tryNode
}
