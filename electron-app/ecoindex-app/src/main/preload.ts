// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

import { channels } from '../shared/constants';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  getNodeVersion: () => ipcRenderer.invoke('get-node-version')
  //Nous pouvons exposer des variables en plus des fonctions
})

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title:string) => ipcRenderer.send('set-title', title || "Ecoindex app"),
  handleSelectFolder: () => ipcRenderer.invoke('dialog:select-folder'),
  // run runFakeMesure on click on button fake
  runFakeMesure: () => ipcRenderer.invoke('run-fake-mesure'),
  getWorkDir: (newDir:string) => ipcRenderer.invoke('get-work-dir', newDir),
  sendLogToFront: (callback:any) => ipcRenderer.on(channels.ASYNCHRONOUS_LOG, (_event, value) => callback(value)),
})