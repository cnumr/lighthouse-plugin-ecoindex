export interface IVersionsAPI {
    node: () => string
    chrome: () => string
    electron: () => string
    getNodeVersion: () => Promise<string>
}

export interface IStoreAPI {
    set: (key: string, value: any) => Promise<void>
    get: (key: string, defaultValue?: any) => Promise<string>
    delete: (key: string) => Promise<void>
}
export interface IElectronAPI {
    // i18nextElectronBackend: any
    // Main → Front
    changeLanguageInFront: (callback) => string
    sendLogToFront: (callback) => string
    sendMessageToFrontLog: (callback) => object
    sendDatasToFront: (callback) => object
    // Front → Main
    getInitialTranslations: () => Promise<object>
    handleSetFolderOuput: () => Promise<string>
    handleSelectFolder: () => Promise<string>
    getWorkDir: (newDir: string) => Promise<string>
    getHomeDir: () => Promise<string>
    isNodeInstalled: () => Promise<boolean>
    isLighthouseEcoindexPluginInstalled: () => Promise<ResultMessage>
    // handleLighthouseEcoindexPluginInstall: () => Promise<boolean>
    // handleLighthouseEcoindexPluginUpdate: () => Promise<boolean>
    // isLighthousePluginEcoindexMustBeInstallOrUpdated: () => Promise<ResultMessage>
    handleIsPuppeteerBrowserInstalled: () => Promise<boolean | string>
    handleSimpleMesures: (urlsList: ISimpleUrlInput[]) => Promise<string>
    handleJsonSaveAndCollect: (
        json: IJsonMesureData,
        andCollect: boolean
    ) => Promise<string>
    handleJsonReadAndReload: () => Promise<IJsonMesureData>
    handleIsJsonConfigFileExist: (workDir: string) => Promise<boolean>
    hideHelloWindow: () => Promise<void>
}

export interface IInitalization {
    // Front → Main
    initializeApplication: (forceInitialisation: boolean) => Promise<boolean>
    // Main → Front
    sendConfigDatasToFront: (callback) => ConfigData
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
        store: IStoreAPI
        initialisationAPI: IInitalization
    }
}
