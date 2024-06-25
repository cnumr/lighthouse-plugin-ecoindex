export interface IVersionsAPI {
  node: () => string
  chrome: () => string
  electron: () => string
  getNodeVersion: () => Promise<string>
}

export interface IElectronAPI {
  sendLogToFront: (callback) => string
  sendMessageToFrontLog: (callback) => object
  handleSetFolderOuput: () => Promise<string>
  handleSelectFolder: () => Promise<string>
  getWorkDir: (newDir: string) => Promise<string>
  isNodeInstalled: () => Promise<boolean>
  isLighthouseEcoindexPluginInstalled: () => Promise<boolean>
  handleSimpleMesures: (urlsList: SimpleUrlInput[]) => void
  handleJsonMesures: (json: IJsonMesureData) => void
  handleJsonSave: (json: IJsonMesureData) => void
  handleJsonReadAndReload: () => void
}

declare global {
  export interface IJsonMesureData {
    'extra-header': object | null
    output: string[]
    'output-path': string
    'user-agent': string
    'output-name': string
    courses: ICourse[]
  }
  export interface ICourse {
    name: string
    target: string
    course: string
    'is-best-pages': boolean
    urls: string[]
    urlSelector?: SimpleUrlInput[]
  }
  interface Window {
    versions: IVersionsAPI
    electronAPI: IElectronAPI
  }
}
