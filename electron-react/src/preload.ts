import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  launchEcoindexSimpleCollect: () =>
    ipcRenderer.invoke('launchEcoindexSimpleCollect'),
  installPuppeteerBrowser: () => ipcRenderer.invoke('installPuppeteerBrowser'),
  onUpdateCounter: (callback: (value: number) => void) =>
    ipcRenderer.on('update-counter', (_event, value: number) =>
      callback(value),
    ),
})
