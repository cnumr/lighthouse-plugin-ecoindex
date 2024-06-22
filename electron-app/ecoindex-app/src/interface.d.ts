export interface IVersionsAPI {
  node: () => string
  chrome: () => string
  electron: () => string
  getNodeVersion: () => Promise<string>
}

export interface IElectronAPI {
  sendLogToFront: (callback) => string
  handleSetFolderOuput: () => Promise<string>
  handleSelectFolder: () => Promise<string>
  getWorkDir: (newDir: string) => Promise<string>
  isNodeInstalled: () => Promise<boolean>
  isLighthouseEcoindexPluginInstalled: () => Promise<boolean>
  runFakeMesure: () => void
}

declare global {
  interface Window {
    versions: IVersionsAPI
    electronAPI: IElectronAPI
  }
}
