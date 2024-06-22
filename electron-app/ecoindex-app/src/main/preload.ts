// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

import { channels } from '../shared/constants'

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  getNodeVersion: () => ipcRenderer.invoke(channels.GET_NODE_VERSION),
  //Nous pouvons exposer des variables en plus des fonctions
})

contextBridge.exposeInMainWorld('electronAPI', {
  handleSelectFolder: () => ipcRenderer.invoke(channels.SELECT_FOLDER),
  // run runFakeMesure on click on button fake
  simpleMesures: (urlsList: SimpleUrlInput[]) =>
    ipcRenderer.invoke(channels.SIMPLE_MESURES, urlsList),
  getWorkDir: (newDir: string) =>
    ipcRenderer.invoke(channels.GET_WORKDIR, newDir),
  sendLogToFront: (callback: any) =>
    ipcRenderer.on(channels.ASYNCHRONOUS_LOG, (_event, value) =>
      callback(value),
    ),
  isLighthouseEcoindexPluginInstalled: () =>
    ipcRenderer.invoke(channels.IS_LIGHTHOUSE_ECOINDEX_INSTALLED),
  isNodeInstalled: () => ipcRenderer.invoke(channels.IS_NODE_INSTALLED),
})
