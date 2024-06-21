export interface IVersionsAPI {
  node: () => string
  chrome: () => string
  electron: () => string
  getNodeVersion: () => Promise<string>
}

export interface IElectronAPI {
  setTitle: (title: string) => void
  handleSetFolderOuput: () => Promise<string>
  handleSelectFolder: () => Promise<string>
  getWorkDir: (newDir:string) => Promise<string>
  runFakeMesure: () => void
}

declare global {
  interface Window {
    versions: IVersionsAPI
    electronAPI: IElectronAPI
  }
}