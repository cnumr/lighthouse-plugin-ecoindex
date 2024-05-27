import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('electronAPI', {
  // to test
  notificationApi: {
    sendNotification(message: string) {
      console.log(message)
      ipcRenderer.send('notify', message)
    },
  },
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  handleSetFolderOuput: () => ipcRenderer.invoke('dialog:handleSetFolderOuput'),
  handleLaunchEcoindexSimpleCollect: () =>
    ipcRenderer.invoke('handleLaunchEcoindexSimpleCollect'),
  handleInstallPuppeteerBrowser: () =>
    ipcRenderer.invoke('handleInstallPuppeteerBrowser'),
  onMenuInstallPuppeteerBrowser: (callback: (value: string) => void) =>
    ipcRenderer.on('menu-install-puppeteer-browser', (_event, value: string) =>
      callback(value),
    ),
  // doNotification: (callback: (value: string) => void) =>
  //   ipcRenderer.on('do-notification', (_event, value: string) =>
  //     callback(value),
  //   ),
  onMenuSetFolderOuput: (callback: (value: string) => void) =>
    ipcRenderer.on('menu-set-folder-output', (_event, value: string) =>
      callback(value),
    ),
  onUpdateCounter: (callback: (value: number) => void) =>
    ipcRenderer.on('update-counter', (_event, value: number) =>
      callback(value),
    ),
})
