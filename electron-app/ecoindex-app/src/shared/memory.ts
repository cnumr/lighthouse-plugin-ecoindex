import { BrowserWindow } from 'electron'
import fs from 'fs'
import { shellEnv } from 'shell-env'
let workDir = ''
let logStream: fs.WriteStream = null
let mainWindow: BrowserWindow = null
let logStreamPath = ''

export const getWorkDir = () => {
  return workDir
}
export const setWorkDir = (value: string) => {
  workDir = value
}
export const getHomeDir = async () => {
  // fixPath()
  const _shellEnv = await shellEnv()
  const home = _shellEnv.HOME
  if (!home) {
    // _debugLogs('ERROR', 'Home dir not found in PATH', _shellEnv)
    throw new Error('Home dir not found in PATH')
  }
  return home
}

export const getMainWindow = () => {
  return mainWindow
}
export const setMainWindow = (value: BrowserWindow) => {
  mainWindow = value
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
