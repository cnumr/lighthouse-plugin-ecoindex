import {
  BrowserWindow,
  Menu,
  MenuItem,
  Notification,
  app,
  dialog,
  ipcMain,
} from 'electron'
import { executablePath, default as puppeteer } from 'puppeteer'

import { spawn } from 'child_process'
import settings from 'electron-settings'
import { IpcMainEvent } from 'electron/main'
import os from 'os'
import path from 'path'
import { updateElectronApp } from 'update-electron-app'

console.log('File used for Persisting Data - ' + settings.file())

function welcomeNotification() {
  if (Notification.isSupported()) {
    const initNotif = new Notification()
    initNotif.title = 'Ecoindex App is started!'
    initNotif.body = 'Hello 👋'
    initNotif.silent = true
    initNotif.show()
  }
}

function showNotification(title = 'Hello', body = 'Hello, world!') {
  const startNotif = new Notification()
  startNotif.title = title
  startNotif.body = body
  startNotif.show()
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

function handleSetTitle(event: IpcMainEvent, title: string) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

async function handleFolderOuputSelector() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (!canceled) {
    return filePaths[0]
  }
}
async function handleInstallPuppeteerBrowser() {
  async function checkPuppeteerBrowserVersion(version: string) {
    console.log('targetVersion', version)

    console.log('defaultPath', executablePath())
    const path = executablePath().replace(
      /(\d+\.)(\d+\.)(\d+\.)(\d+)/gm,
      versionToCheck,
    )
    console.log('newPath', path)

    const browser = await puppeteer.launch({
      headless: true,
      product: 'chrome',
      executablePath: path,
    })

    const installedVersion = await browser.version()
    console.log('installedVersion', installedVersion)

    await browser.close()

    return installedVersion === `Chrome/${version}`
  }

  const versionToCheck = '121.0.6167.85'
  const isInstalled = await checkPuppeteerBrowserVersion(versionToCheck)
  console.log(
    `Puppeteer browser version ${versionToCheck} is installed: ${isInstalled}`,
  )
  if (isInstalled) {
    showNotification(
      `Warning`,
      `Puppeteer browser version ${versionToCheck} is already installed`,
    )
    return
  }

  console.log('installPuppeteerBrowser')
  showNotification(
    'Puppeteer browser installation started...',
    'This process may take a few minutes',
  )

  const ls = spawn('npx', [
    'puppeteer',
    'browsers',
    'install',
    'chrome@121.0.6167.85',
  ])
  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString())
  })

  ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString())
  })

  ls.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString())
  })
}

async function handleLaunchEcoindexSimpleCollect() {
  showNotification(
    'Collect Ecoindex is started...',
    'This process may take a few minutes',
  )
  return
  const ls = spawn('npx', ['lighthouse-plugin-ecoindex', 'collect', '-d'])
  ls.stdout.on('data', function (data) {
    console.log(data.toString())
  })

  ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString())
  })

  ls.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString())
  })
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const myMenuItem = new MenuItem({
    label: 'Actions',
    submenu: [
      {
        type: 'normal',
        enabled: false,
        label: 'Todo once',
      },
      {
        click: () =>
          mainWindow.webContents.send('menu-install-puppeteer-browser'),
        label: 'Install puppeteer browser (chrome@121.0.6167.85)',
      },
      {
        type: 'separator',
      },
      {
        type: 'normal',
        enabled: false,
        label: 'Configurations',
      },
      {
        click: () => mainWindow.webContents.send('menu-set-folder-output'),
        label: 'Set folder output',
      },
      // {
      //   click: () => mainWindow.webContents.send('update-counter', 1),
      //   label: 'Increment',
      // },
      // {
      //   click: () => mainWindow.webContents.send('update-counter', -1),
      //   label: 'Decrement',
      // },
    ],
  })
  const myMenu = Menu.getApplicationMenu()
  myMenu.insert(1, myMenuItem)
  Menu.setApplicationMenu(myMenu)

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    // Open the DevTools only in dev mode.
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    )
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.handle('handleInstallPuppeteerBrowser', handleInstallPuppeteerBrowser)
  ipcMain.handle(
    'handleLaunchEcoindexSimpleCollect',
    handleLaunchEcoindexSimpleCollect,
  )
  ipcMain.handle('dialog:handleSetFolderOuput', handleFolderOuputSelector)
  ipcMain.handle('ping', () => 'pong')
  welcomeNotification()
  createWindow()
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

updateElectronApp()
