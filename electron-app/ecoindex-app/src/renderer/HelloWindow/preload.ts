import { contextBridge, ipcRenderer } from 'electron'

import { channels } from '../../shared/constants'

contextBridge.exposeInMainWorld('electronAPI', {
    changeLanguageInFront: (callback: any) =>
        ipcRenderer.on(
            channels.CHANGE_LANGUAGE_TO_FRONT,
            (_event, languageCode) => callback(languageCode)
        ),
    hideHelloWindow: () =>
        ipcRenderer.invoke(channels.SHOW_HIDE_WELCOME_WINDOW),
})
contextBridge.exposeInMainWorld('store', {
    set: (key: string, value: any) =>
        ipcRenderer.invoke('store-set', key, value),
    get: (key: string, defaultValue: any) =>
        ipcRenderer.invoke('store-get', key, defaultValue),
    delete: (key: string) => ipcRenderer.invoke('store-delete', key),
})
