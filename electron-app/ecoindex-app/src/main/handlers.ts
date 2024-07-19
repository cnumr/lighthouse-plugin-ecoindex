// import { ChildProcess, spawn } from 'child_process'
// import {
//   _echoReadable,
//   _sendMessageToFrontLog,
//   _sendMessageToLogFile,
// } from './utils'

// import { IpcMainEvent } from 'electron'
// import os from 'os'

// async function handleLighthouseEcoindexPluginInstall(event: IpcMainEvent) {
//   try {
//     console.log(`handleLighthouseEcoindexPluginInstall`)
//     _sendMessageToLogFile(`handleLighthouseEcoindexPluginInstall started 🚀`)

//     const filePath = [`${__dirname}/scripts/${os.platform()}/install-plugin.sh`]

//     const { shell, homedir } = os.userInfo()
//     let runner = ''
//     if (shell === '/bin/zsh') {
//       runner = 'zsh'
//     }
//     const o = { shell, runner, filePath, __dirname, homedir }
//     _sendMessageToLogFile(`informations`, JSON.stringify(o, null, 2))
//     _sendMessageToFrontLog(`informations`, JSON.stringify(o, null, 2))
//     try {
//       _sendMessageToFrontLog(`Try childProcess on`, filePath)
//       const childProcess: ChildProcess = spawn(
//         runner,
//         ['-c', `chmod +x ${filePath} && ${runner} ${filePath}`],
//         {
//           stdio: ['pipe', 'pipe', process.stderr, 'ipc'],
//           env: process.env,
//           // shell: shell,
//         },
//       )

//       // childProcess.on('exit', (code, signal) => {
//       //   _sendMessageToLogFile(
//       //     `Child process exited with code ${code} and signal ${signal}`,
//       //   )
//       // })

//       childProcess.on('close', code => {
//         // _sendMessageToLogFile(`Child process close with code ${code}`)
//         _sendMessageToFrontLog('Installation done 🚀')
//         _sendMessageToLogFile('Installation done 🚀')
//       })

//       childProcess.stdout.on('data', data => {
//         _sendMessageToFrontLog(data)
//         _sendMessageToLogFile(data)
//       })

//       if (childProcess.stderr) {
//         childProcess.stderr.on('data', data => {
//           _sendMessageToFrontLog(`stderr: ${data.toString()}`)
//           _sendMessageToLogFile(`stderr: ${data.toString()}`)
//         })
//       }

//       // childProcess.on('disconnect', () => {
//       //   _sendMessageToLogFile('Child process disconnected')
//       // })

//       childProcess.on('message', (message, sendHandle) => {
//         _sendMessageToFrontLog(`Child process message: ${message}`)
//         _sendMessageToLogFile(`Child process message: ${message}`)
//       })

//       await _echoReadable(event, childProcess.stdout)
//       return 'Installation done'
//     } catch (error) {
//       // throw(error)
//       _sendMessageToFrontLog(`error`, error)
//       _sendMessageToLogFile(`error`, error)
//       return 'Installation failed'
//     }
//   } catch (error) {
//     _sendMessageToFrontLog(`error`, error)
//     _sendMessageToLogFile(`error`, error)
//   }
// }
