export interface IVersionsAPI {
    node: () => string
    chrome: () => string
    electron: () => string
    getNodeVersion: () => Promise<string>
}

export interface IElectronAPI {
    // Main → Front
    sendLogToFront: (callback) => string
    sendMessageToFrontLog: (callback) => object
    sendDatasToFront: (callback) => object
    // Front → Main
    handleSetFolderOuput: () => Promise<string>
    handleSelectFolder: () => Promise<string>
    getWorkDir: (newDir: string) => Promise<string>
    isNodeInstalled: () => Promise<boolean>
    isLighthouseEcoindexPluginInstalled: () => Promise<boolean>
    handleLighthouseEcoindexPluginInstall: () => Promise<boolean>
    handleLighthouseEcoindexPluginUpdate: () => Promise<boolean>
    handleSimpleMesures: (urlsList: ISimpleUrlInput[]) => void
    handleJsonSaveAndCollect: (
        json: IJsonMesureData,
        andCollect: boolean
    ) => void
    handleJsonReadAndReload: () => Promise<IJsonMesureData>
    handleIsJsonConfigFileExist: (workDir: string) => Promise<boolean>
}

declare global {
    export interface IJsonMesureData {
        'extra-header': object | null
        output: string[]
        'output-path'?: string
        'user-agent'?: string
        'output-name'?: string
        courses: ICourse[]
    }
    export interface ICourse {
        name: string
        target: string
        course: string
        'is-best-pages': boolean
        urls: string[] | ISimpleUrlInput[]
        urlSelector?: ISimpleUrlInput[]
    }
    export interface ISimpleUrlInput {
        value: string
    }
    export interface IKeyValue {
        [key: string]: string
    }
    interface Window {
        versions: IVersionsAPI
        electronAPI: IElectronAPI
    }
}
