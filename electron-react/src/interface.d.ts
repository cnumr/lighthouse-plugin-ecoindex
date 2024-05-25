export interface IVersionsAPI {
  node: () => string
  chrome: () => string
  electron: () => string
}

export interface IElectronAPI {
  setTitle: (title: string) => void
  openFolder: () => Promise<string>
  launchEcoindexSimpleCollect: () => Promise<string>
  installPuppeteerBrowser: () => Promise<string>
  onUpdateCounter: (callback: (value: number) => void) => void
}

declare global {
  interface Window {
    versions: IVersionsAPI
    electronAPI: IElectronAPI
  }
}
