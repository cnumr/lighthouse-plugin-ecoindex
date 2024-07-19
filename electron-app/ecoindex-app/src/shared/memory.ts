import { BrowserWindow } from 'electron'
import fs from 'fs'
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
export const getMainWindow = () => {
  return mainWindow
}
export const setMainWindow = (value: BrowserWindow) => {
  mainWindow = value
}

export const getLogFileInDir = (dir: string) => {
  return `${dir}/logfile.txt`
}
export const getLogSteam = () => {
  return logStream
}
export const setLogStream = (path: string) => {
  if (path) logStreamPath = path
  logStream = fs.createWriteStream(logStreamPath)
}
