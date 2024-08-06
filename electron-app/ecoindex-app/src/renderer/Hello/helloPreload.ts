import { contextBridge, ipcRenderer } from 'electron'

import { channels } from '../../shared/constants'

contextBridge.exposeInMainWorld('electronAPI', {
    changeLanguageInFront: (callback: any) =>
        ipcRenderer.on(
            channels.CHANGE_LANGUAGE_TO_FRONT,
            (_event, languageCode) => callback(languageCode)
        ),
})
