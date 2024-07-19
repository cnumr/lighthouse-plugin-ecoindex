// import { BrowserWindow, IpcMainEvent } from 'electron'
// import { channels, utils } from '../shared/constants'
// import { chomp, chunksToLinesAsync } from '@rauschma/stringio'

import fs from 'fs'
import { shellEnv } from 'shell-env'

// let workDir = ''

// /**
//  * Send message to DEV consol log
//  * @param message
//  * @param optionalParams
//  */
// export const _sendMessageToFrontLog = (
//   mainWindow: BrowserWindow,
//   message?: any,
//   ...optionalParams: any[]
// ) => {
//   mainWindow.webContents.send(
//     channels.HOST_INFORMATIONS,
//     message,
//     optionalParams,
//   )
// }

// /**
//  * Send message to log zone in front of the app
//  * @param event
//  * @param readable
//  */
// export async function _echoReadable(event: IpcMainEvent, readable: any) {
//   const webContents = event.sender
//   const win = BrowserWindow.fromWebContents(webContents)
//   for await (const line of chunksToLinesAsync(readable)) {
//     // (C)
//     console.log('> ' + chomp(line))
//     // eslint-disable-next-line no-control-regex, no-useless-escape
//     const gm = new RegExp(']2;(.*)]1; ?(\n?)', 'gm')
//     win.webContents.send(channels.ASYNCHRONOUS_LOG, chomp(line.replace(gm, '')))
//   }
// }

// let logStream: fs.WriteStream = null

// export const getLogStream = () => {
//   return logStream
// }

// export const resetLogStream = () => {
//   logStream = null
//   console.log(`logStream reseted!`)
// }
// /**
//  * Write a log file in output dir / workDir
//  * @param message string | object
//  * @param optionalParams (string | object)[]
//  */
// export async function sendMessageToLogFile(
//   message?: string | object,
//   ...optionalParams: (string | object)[]
// ) {
//   if (!workDir) {
//     workDir = await getHomeDir()
//   }
//   const logFilePath = `${workDir}/logfile.txt`
//   if (!logStream) {
//     logStream = fs.createWriteStream(logFilePath)
//     logStream.write('')
//   }
//   const toStr = (inp: string | object) => {
//     try {
//       if (typeof inp !== 'string') {
//         return JSON.stringify(inp, null, 2)
//       }
//       return inp
//     } catch (error) {
//       return JSON.stringify(error, null, 2)
//     }
//   }
//   try {
//     const stout = toStr(message) + ' ' + optionalParams.map(str => toStr(str))
//     logStream.write(cleanLogString(stout) + '\n')
//   } catch (error) {
//     logStream.write(JSON.stringify(error, null, 2))
//   }
// }
// export const getHomeDir = async () => {
//   // fixPath()
//   const _shellEnv = await shellEnv()
//   const home = _shellEnv.HOME
//   if (!home) {
//     // _sendMessageToFrontLog('ERROR', 'Home dir not found in PATH', _shellEnv)
//     throw new Error(`Home dir not found in PATH ${_shellEnv}`)
//   }
//   return home
// }
/**
 * TODO: Method to clean returned log from sh files
 * @param stout any
 * @returns any
 */
export const cleanLogString = (stout: any) => {
  if (typeof stout !== 'string') return stout
  // eslint-disable-next-line no-control-regex, no-useless-escape
  const gm = new RegExp(']2;(.*)]1; ?(\n?)', 'gm')
  if (stout.match(gm)) return stout.replace(gm, '')
  else return stout
}
