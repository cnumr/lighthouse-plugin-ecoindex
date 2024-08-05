import './index.css'
import './index.tsx'

import { cleanLogString } from '../main/utils'
import log from 'electron-log/renderer'

const frontLog = log.scope('front/renderer')

/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// window.require = require

window.electronAPI.sendLogToFront((message: string) => {
    frontLog.log(message)
    const textArea = document.getElementById('echo') as HTMLTextAreaElement
    textArea.value = textArea.value + '\n' + message
    textArea.scrollTop = textArea.scrollHeight
})

window.electronAPI.sendMessageToFrontLog(
    (message?: any, ...optionalParams: any[]) => {
        if (optionalParams && optionalParams.length > 1)
            console.log(
                message,
                optionalParams.map((out) => cleanLogString(out))
            )
        else console.log(cleanLogString(message))
    }
)

// window.electronAPI.sendDatasToFront((data: any) => {
//     if (typeof data === 'string') {
//         console.log(`sendDatasToFront`, data)
//     } else {
//         console.log(`sendDatasToFront`, JSON.stringify(data, null, 2))
//     }
// })

console.log('👋 Welcome to Ecoindex mesures launcher!')
console.log(
    '💡 More informations : https://cnumr.github.io/lighthouse-plugin-ecoindex/ and https://www.ecoindex.fr/'
)
