import './index.css'

import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { channels, labels, utils } from '../shared/constants'
import { useEffect, useState } from 'react'

import { AlertBox } from './components/Alert'
import { JsonPanMesure } from './components/json-pan'
import { PopinLoading } from './components/loading-popin'
import { SimplePanMesure } from './components/simple-pan'
import { cn } from '../shared/tailwind-helper'
import iconAsso from '../../assets/asso.svg'
import packageJson from '../../package.json'

function TheApp() {
    const [language, setLanguage] = useState('en')
    const [isJsonFromDisk, setIsJsonFromDisk] = useState(false)
    const [tabSelected, setTabSelected] = useState(0)
    const [nodeVersion, setNodeVersion] = useState('')
    // let nodeVersion = 'loading...'
    const [workDir, setWorkDir] = useState('chargement...')
    const [appReady, setAppReady] = useState(false)
    const [datasFromHost, setDatasFromHost] = useState({})
    // let appReady = false

    let loadingScreen = 0
    const [urlsList, setUrlsList] = useState<InputField[]>([
        { value: 'https://www.ecoindex.fr/' },
        { value: 'https://www.ecoindex.fr/a-propos/' },
    ])
    const [jsonDatas, setJsonDatas] = useState<IJsonMesureData>(
        utils.DEFAULT_JSON_DATA
    )
    const [
        isLighthouseEcoindexPluginInstalled,
        setIsLighthouseEcoindexPluginInstalled,
    ] = useState(true)
    // let isLighthouseEcoindexPluginInstalled = false
    const [isNodeInstalled, setIsNodeInstalled] = useState(true)
    // let isNodeInstalled = false

    // Run runFakeMesure on click on button fake
    const runSimpleMesures = () => {
        console.log('Simple mesures clicked')
        try {
            window.electronAPI.handleSimpleMesures(urlsList)
        } catch (error) {
            console.error('Error on runSimpleMesures', error)
            showNotification('', {
                body: 'Error on runSimpleMesures',
                subtitle: 'Courses Mesure (Simple mode)',
            })
        }
    }

    const runJsonReadAndReload = async () => {
        console.log('Json read and reload')
        try {
            const _jsonDatas: IJsonMesureData =
                await window.electronAPI.handleJsonReadAndReload()
            console.log(`runJsonReadAndReload`, _jsonDatas)
            if (_jsonDatas) {
                setJsonDatas(_jsonDatas)
                setIsJsonFromDisk(true)
            } else {
                setIsJsonFromDisk(false)
            }
        } catch (error) {
            console.error('Error on runJsonReadAndReload', error)
            showNotification('', {
                subtitle: '🚫 Courses Mesure (Full mode)',
                body: 'Error on runJsonReadAndReload',
            })
        }
    }

    const runJsonSaveAndCollect = (saveAndCollect = false) => {
        console.log('Json save clicked')
        try {
            console.log(`jsonDatas`, jsonDatas)
            console.log(`saveAndCollect`, saveAndCollect)
            window.electronAPI.handleJsonSaveAndCollect(
                jsonDatas,
                saveAndCollect
            )
        } catch (error) {
            console.error('Error on runJsonSaveAndCollect', error)
            showNotification('', {
                subtitle: '🚫 Courses Mesure (Full mode)',
                body: 'Error on runJsonSaveAndCollect',
            })
        }
    }

    const handlerJsonNotify = (title: string, message: string) => {
        console.log('Json notify clicked')
        showNotification('', { body: message, subtitle: title })
    }

    const selectWorkingFolder = async () => {
        const filePath = await window.electronAPI.handleSelectFolder()

        if (filePath !== undefined) setWorkDir(filePath)
    }

    const showNotification = (title: string, options: any) => {
        const _t = title === '' ? packageJson.productName : title
        new window.Notification(_t, options)
    }

    const increment = () => {
        loadingScreen = loadingScreen + 1
        console.log(`Verify configuration step ${loadingScreen}/4`)
        const counter = document.getElementById('counter') as HTMLElement
        counter.innerText = `Loading... ${loadingScreen}/4`
        const loadingPopin = document.getElementById(
            'loadingPopin'
        ) as HTMLElement
        if (loadingScreen === 4) {
            console.log(`<><><><><><><><><><><><><><><><><><>`)
            console.log(`All data readed! 👀`)
            console.log(`isNodeInstalled`, isNodeInstalled)
            console.log(
                `isLighthouseEcoindexPluginInstalled`,
                isLighthouseEcoindexPluginInstalled
            )
            checkAppReady()
            loadingPopin.style.display = 'none'
            const _n: any = {}
            _n.body = 'Application succefully loaded.\nWelcome 👋'
            _n.subtitle = 'You can now start mesures'
            _n.priority = 'critical'
            showNotification('', _n)
            console.log(`<><><><><><><><><><><><><><><><><><>`)
        } else {
            setAppReady(false)
        }
    }

    const installNode = () => {
        window.open(
            `https://nodejs.org/en/download/prebuilt-installer`,
            `_blank`
        )
    }
    const installEcoindexPlugin = async () => {
        try {
            await window.electronAPI.handleLighthouseEcoindexPluginInstall()
        } catch (error) {
            console.error(`installEcoindexPlugin`, error)
        }
    }

    /**
     * Utils, wait method.
     * @param ms number
     * @returns Promise<unknown>
     */
    async function _sleep(ms: number) {
        return new Promise((resolve) => {
            console.log(`wait ${ms / 1000}s`)

            setTimeout(resolve, ms)
        })
    }

    useEffect(() => {
        /**
         * Handlers, Node Version
         */
        const fetchNodeVersion = async () => {
            const result = await window.versions.getNodeVersion()
            setNodeVersion(result)
            increment()
        }

        /**
         * Handlers, Get WorkDir
         */
        const fetchWorkDir = async () => {
            const result = await window.electronAPI.getWorkDir('')
            setWorkDir(result)
            increment()
        }
        /**
         * LAUNCH FIRST! Handlers, Get ans Set NodeDir, NpmDir and NodeVersion.
         */
        const fetchNodeInstalled = async () => {
            const result = await window.electronAPI.isNodeInstalled()
            console.log(`fetchNodeInstalledRESULT`, result === true)
            setIsNodeInstalled(result === true)
            increment()
        }

        /**
         * Handlers, Is Ecoindex Lighthouse Plugin installed.
         */
        const fetchLighthouseEcoindexPluginInstalled = async () => {
            const result =
                await window.electronAPI.isLighthouseEcoindexPluginInstalled()
            console.log(
                `fetchLighthouseEcoindexPluginInstalledRESULT`,
                result === true
            )

            setIsLighthouseEcoindexPluginInstalled(result === true)
            increment()
        }

        fetchWorkDir().then(() => {
            fetchNodeInstalled().then(() => {
                fetchNodeVersion()
                fetchLighthouseEcoindexPluginInstalled()
            })
        })

        // get data from main
        window.electronAPI.sendDatasToFront((data: any) => {
            console.log(typeof data)

            if (typeof data === 'string') {
                const _data = JSON.parse(data)
                console.log(`sendDatasToFront`, _data)
                setDatasFromHost((oldObject) => ({
                    ...oldObject,
                    ..._data,
                }))
            } else {
                console.log(`sendDatasToFront`, JSON.stringify(data, null, 2))
                setDatasFromHost((oldObject) => ({
                    ...oldObject,
                    ...data,
                }))
            }
        })
    }, [])

    const checkAppReady = () => {
        console.log('isNodeInstalled', isNodeInstalled)
        console.log(
            'isLighthouseEcoindexPluginInstalled',
            isLighthouseEcoindexPluginInstalled
        )
        let count = 0
        if (isNodeInstalled) count++
        if (isLighthouseEcoindexPluginInstalled) count++
        setAppReady(count === 2)
    }

    useEffect(() => {
        console.log('language', language)
    }, [language])

    useEffect(() => {
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(
            `Binded on [isNodeInstalled, isLighthouseEcoindexPluginInstalled]`
        )
        checkAppReady()
        console.log(`appReady`, appReady)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
    }, [isNodeInstalled, isLighthouseEcoindexPluginInstalled])

    useEffect(() => {
        console.log(`************************************`)
        console.log(`Binded on [appReady]`)
        console.log('appReady', appReady)
        console.log(`************************************`)
    }, [appReady])

    useEffect(() => {
        const isJsonConfigFileExist = async () => {
            const result =
                await window.electronAPI.handleIsJsonConfigFileExist(workDir)
            console.log(`isJsonConfigFileExist`, result)

            result && runJsonReadAndReload()
        }
        isJsonConfigFileExist()
    }, [workDir])

    return (
        <div className="relative">
            <main className="flex h-screen flex-col justify-between p-4">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4 py-4">
                        <div className="logo-ecoindex">
                            {/* <img width="100" alt="icon" src={icon} className="bg-slate-400" /> */}
                            <span className="logo-ecoindex logo-ecoindex__eco">
                                eco
                            </span>
                            <span className="logo-ecoindex logo-ecoindex__index">
                                Index
                            </span>
                        </div>
                        <h1 className="pt-1">Mesures launcher 👋</h1>
                    </div>
                    {false && (
                        <>
                            <div>appReady: {appReady ? 'true' : 'false'}</div>
                            <div>
                                isNodeInstalled:{' '}
                                {isNodeInstalled ? 'true' : 'false'}
                            </div>
                            <div>
                                isLighthouseEcoindexPluginInstalled:{' '}
                                {isLighthouseEcoindexPluginInstalled
                                    ? 'true'
                                    : 'false'}
                            </div>
                        </>
                    )}
                    {!isNodeInstalled && (
                        <AlertBox visible={true}>
                            <span>Node is not installed!</span>
                            <button
                                id="bt-install-node"
                                onClick={installNode}
                                className="btn btn-green-outlined"
                            >
                                Install
                            </button>
                        </AlertBox>
                    )}
                    {isNodeInstalled &&
                        !isLighthouseEcoindexPluginInstalled && (
                            <AlertBox visible={true}>
                                <span>
                                    Lighthouse Ecoindex plugin is not installed!
                                </span>
                                <button
                                    id="bt-install-ecoindex"
                                    onClick={installEcoindexPlugin}
                                    className="btn btn-green-outlined"
                                >
                                    Install
                                </button>
                            </AlertBox>
                        )}
                    <h2>1. Select ouput folder</h2>
                    <div className="flex w-full items-center gap-2">
                        <p
                            id="filePath"
                            className="echo grid min-h-8 place-items-center"
                        >
                            {workDir}
                        </p>
                        <button
                            type="button"
                            id="btn-file"
                            disabled={!appReady}
                            onClick={selectWorkingFolder}
                            className="btn btn-green whitespace-nowrap"
                        >
                            Browse
                        </button>
                    </div>
                    <div className="w-full">
                        <div className="flex w-full gap-1">
                            <button
                                className={cn('tab line-clamp-1', {
                                    active: tabSelected === 0,
                                })}
                                onClick={() => setTabSelected(0)}
                                title={labels[language]['simple-mesures-label']}
                            >
                                {labels[language]['simple-mesures-label']}
                            </button>
                            <button
                                className={cn('tab line-clamp-1', {
                                    active: tabSelected === 1,
                                })}
                                onClick={() => setTabSelected(1)}
                                title={labels[language]['full-mesures-label']}
                            >
                                {labels[language]['full-mesures-label']}
                            </button>
                        </div>
                        <SimplePanMesure
                            appReady={appReady}
                            language={language}
                            simpleMesures={runSimpleMesures}
                            urlsList={urlsList}
                            setUrlsList={setUrlsList}
                            className={cn(
                                'tab-content',
                                { hidden: tabSelected !== 0 },
                                { flex: tabSelected === 0 }
                            )}
                        />
                        <JsonPanMesure
                            appReady={appReady}
                            isJsonFromDisk={isJsonFromDisk}
                            language={language}
                            jsonDatas={jsonDatas}
                            setJsonDatas={setJsonDatas}
                            mesure={() => runJsonSaveAndCollect(true)}
                            reload={runJsonReadAndReload}
                            save={runJsonSaveAndCollect}
                            notify={handlerJsonNotify}
                            className={cn(
                                'tab-content',
                                { hidden: tabSelected !== 1 },
                                { flex: tabSelected === 1 }
                            )}
                        />
                    </div>
                    {/* display here the echoReadable line */}
                    <p className="text-sm font-medium text-ecoindex-green">
                        console
                    </p>
                    <textarea
                        id="echo"
                        className="echo h-36"
                        readOnly
                    ></textarea>
                    <div className="hidden text-xs">
                        {JSON.stringify(datasFromHost, null, 2)}
                    </div>
                </div>
                <div className="text-center text-sm">
                    <p className="text-xs">
                        Host Informations : Node.js(
                        {nodeVersion ? nodeVersion : 'loading...'})
                    </p>
                    <p className="text-xs">
                        Internal Electron informations : Chrome (v
                        {window.versions.chrome()}
                        ), Node.js (v
                        {window.versions.node()}), and Electron (v
                        {window.versions.electron()})
                    </p>
                    <p className="mt-2">© 2024 - Made with ❤️ and 🌱 by</p>
                    <p className="my-4 grid place-content-center">
                        <a href="https://asso.greenit.fr">
                            <img
                                width="100"
                                alt="icon"
                                src={iconAsso}
                                className="bg-green-950"
                            />
                        </a>
                    </p>
                </div>
            </main>
            <PopinLoading id="loadingPopin">
                <p id="counter">Loading... 0/4</p>
            </PopinLoading>
        </div>
    )
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TheApp />} />
            </Routes>
        </Router>
    )
}
