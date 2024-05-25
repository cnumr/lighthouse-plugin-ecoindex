export interface IVersionsAPI {
  node: () => string
  chrome: () => string
  electron: () => string
}

export interface IElectronAPI {
  setTitle: (title: string) => void
  handleSetFolderOuput: () => Promise<string>
  handleLaunchEcoindexSimpleCollect: () => Promise<string>
  handleInstallPuppeteerBrowser: () => Promise<string>
  onMenuInstallPuppeteerBrowser: (callback: (value: string) => void) => void
  onMenuSetFolderOuput: (callback: (value: string) => void) => void
  onUpdateCounter: (callback: (value: number) => void) => void
}

declare global {
  interface Window {
    versions: IVersionsAPI
    electronAPI: IElectronAPI
  }
}
