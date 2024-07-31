import './index.css'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card'
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { labels, utils } from '../shared/constants'
import { useEffect, useState } from 'react'

import { AlertBox } from './components/Alert'
import { Bug } from 'lucide-react'
import { Button } from '@/renderer/ui/button'
import { ConsoleApp } from './components/console'
import { DarkModeSwitcher } from './components/dark-mode-switcher'
import { Footer } from './components/footer'
import { Header } from './components/Header'
import { Input } from './ui/input'
import { JsonPanMesure } from './components/json-pan'
import { PopinLoading } from './components/loading-popin'
import { ReloadIcon } from '@radix-ui/react-icons'
import { SimplePanMesure } from './components/simple-pan'
import { SimpleTooltip } from './components/simple-tooltip'
import { TabsContent } from '@radix-ui/react-tabs'
import { TypographyP } from './ui/typography/TypographyP'
import packageJson from '../../package.json'

function TheApp() {
    const [language, setLanguage] = useState('en')
    const [progress, setProgress] = useState(0)
    const [isJsonFromDisk, setIsJsonFromDisk] = useState(false)
    const [nodeVersion, setNodeVersion] = useState('')
    const [workDir, setWorkDir] = useState('chargement...')
    const [homeDir, setHomeDir] = useState('chargement...')
    const [appReady, setAppReady] = useState(false)
    const [datasFromHost, setDatasFromHost] = useState({})
    const [displayPopin, setDisplayPopin] = useState(true)
    const [popinText, setPopinText] = useState('Loading... 0/4')

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
    const [isNodeInstalled, setIsNodeInstalled] = useState(true)
    const [isNodeVersionOK, setIsNodeVersionOK] = useState(true)

    const blockScrolling = (block = true) => {
        const body = document.getElementsByTagName(
            `body`
        )[0] as unknown as HTMLBodyElement
        body.style.overflowY = block ? 'hidden' : 'auto'
    }
    const showHidePopinDuringProcess = async (value: string | boolean) => {
        if (typeof value === 'string') {
            setPopinText(value)
            setDisplayPopin(true)
            blockScrolling(true)
            window.scrollTo(0, 0)
        } else if (value === true) {
            setPopinText(`Done 🎉`)
            await _sleep(2000)
            setDisplayPopin(false)
            blockScrolling(false)
        } else {
            setPopinText(`Error 🚫`)
            await _sleep(4000)
            setDisplayPopin(false)
            blockScrolling(false)
        }
    }

    const runSimpleMesures = async () => {
        console.log('Simple mesures clicked')
        if (workDir === homeDir) {
            if (
                !confirm(
                    `Are you shure to want create report(s) in your default folder?\n\rDestination: ${homeDir}`
                )
            )
                return
        }
        showHidePopinDuringProcess(
            `${labels[language]['simple-mesures-label']} started 🚀`
        )
        try {
            await window.electronAPI.handleSimpleMesures(urlsList)
            showHidePopinDuringProcess(true)
        } catch (error) {
            console.error('Error on runSimpleMesures', error)
            showNotification('', {
                body: 'Error on runSimpleMesures',
                subtitle: 'Courses Mesure (Simple mode)',
            })
            showHidePopinDuringProcess(false)
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

    const runJsonSaveAndCollect = async (saveAndCollect = false) => {
        console.log('Json save clicked')
        if (workDir === homeDir) {
            if (
                !confirm(
                    `Are you shure to want create report(s) in your default folder?\n\rDestination: ${homeDir}`
                )
            )
                return
        }
        showHidePopinDuringProcess(
            `${labels[language]['full-mesures-label']} started 🚀`
        )
        try {
            console.log(`jsonDatas`, jsonDatas)
            console.log(`saveAndCollect`, saveAndCollect)
            await window.electronAPI.handleJsonSaveAndCollect(
                jsonDatas,
                saveAndCollect
            )
            showHidePopinDuringProcess(true)
        } catch (error) {
            console.error('Error on runJsonSaveAndCollect', error)
            showNotification('', {
                subtitle: '🚫 Courses Mesure (Full mode)',
                body: 'Error on runJsonSaveAndCollect',
            })
            showHidePopinDuringProcess(false)
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
        setProgress(loadingScreen * (100 / 4))
        console.log(`Verify configuration step ${loadingScreen}/4`)
        setPopinText(`Loading... ${loadingScreen}/4`)
        if (loadingScreen === 4) {
            console.log(`<><><><><><><><><><><><><><><><><><>`)
            console.log(`All data readed! 👀`)
            console.log(`isNodeInstalled`, isNodeInstalled)
            console.log(
                `isLighthouseEcoindexPluginInstalled`,
                isLighthouseEcoindexPluginInstalled
            )
            checkAppReady()
            setDisplayPopin(false)
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
    const updateEcoindexPlugin = async () => {
        try {
            await window.electronAPI.handleLighthouseEcoindexPluginUpdate()
        } catch (error) {
            console.error(`updateEcoindexPlugin`, error)
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

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(JSON.stringify(datasFromHost, null, 2))
    }

    useEffect(() => {
        /**
         * Handlers, Node Version
         */
        const fetchNodeVersion = async () => {
            const result = await window.versions.getNodeVersion()
            setNodeVersion(result)
            const major = nodeVersion.replace('v', '').split('.')[0]
            console.log(`major`, major)

            if (Number(major) >= 20) {
                setIsNodeVersionOK(false)
            }
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

        const fetchUpdateEcoindexPlugin = async () => {
            if (isLighthouseEcoindexPluginInstalled)
                await updateEcoindexPlugin()
        }

        const fetchHomeDir = async () => {
            const filePath = await window.electronAPI.getHomeDir()

            setHomeDir(filePath)
        }

        fetchWorkDir().then(() => {
            fetchHomeDir()
            fetchNodeInstalled().then(() => {
                fetchNodeVersion().then(() => {
                    fetchLighthouseEcoindexPluginInstalled().then(() => {
                        fetchUpdateEcoindexPlugin()
                    })
                })
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
        <div className="container relative">
            <DarkModeSwitcher
                title="Dark mode switch"
                className="absolute left-2 top-2 z-20 flex gap-2"
            />
            <SimpleTooltip
                tooltipContent={
                    <p>
                        Copy application informations to clipboard.
                        <br />
                        Send theim to developper at renaud@greenit.fr.
                    </p>
                }
            >
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-2 top-2 z-20"
                    onClick={copyToClipBoard}
                >
                    <Bug className="mr-2 size-4" />
                    Debug
                </Button>
            </SimpleTooltip>
            <main className="flex h-screen flex-col justify-between gap-4 p-4">
                <div className="flex flex-col items-center gap-4">
                    <Header />
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
                            <div>
                                isNodeVersionOK:{' '}
                                {isNodeVersionOK ? 'true' : 'false'}
                            </div>
                        </>
                    )}
                    {!isNodeInstalled && (
                        <AlertBox title="Error on Node">
                            <div className="flex items-center justify-between gap-4">
                                <span>
                                    Node is not installed, install it (you must
                                    be admin of your computer)! After
                                    installation, restart application.
                                </span>
                                <Button
                                    variant="default"
                                    id="bt-install-node"
                                    onClick={installNode}
                                >
                                    Install
                                </Button>
                            </div>
                        </AlertBox>
                    )}
                    {isNodeInstalled && !isNodeVersionOK && (
                        <AlertBox title="Error on Node Version">
                            <div className="flex items-center justify-between gap-4">
                                <span>
                                    Your Node installation is outdated, you must
                                    upgrade it to 20 or upper, upgrade it (you
                                    must be admin of your computer)! After
                                    upgrade, restart application.
                                </span>
                                <Button
                                    variant="default"
                                    onClick={installEcoindexPlugin}
                                >
                                    Upgrade
                                </Button>
                            </div>
                        </AlertBox>
                    )}
                    {isNodeVersionOK &&
                        !isLighthouseEcoindexPluginInstalled && (
                            <AlertBox title="Error on Ecoindex">
                                <div className="flex items-center justify-between gap-4">
                                    <span>
                                        Lighthouse Ecoindex plugin is not
                                        installed, install it (you must be admin
                                        of your computer)! After installation,
                                        restart application.
                                    </span>
                                    <Button
                                        variant="default"
                                        id="bt-install-ecoindex"
                                        onClick={installEcoindexPlugin}
                                    >
                                        Install
                                    </Button>
                                </div>
                            </AlertBox>
                        )}
                    {(!isNodeInstalled ||
                        !isLighthouseEcoindexPluginInstalled ||
                        !isNodeVersionOK) && (
                        <AlertBox variant="bug" title="Report error">
                            <div className="flex items-center justify-between gap-4">
                                <span>
                                    You have an error but you think it's a bug.
                                    Report to the developper by clicking the
                                    button (datas are saved to your clipboard)
                                    and send theim by mail to{' '}
                                    <a
                                        href="mailto:renaud@greenit.fr"
                                        className="underline"
                                    >
                                        renaud@greenit.fr
                                    </a>{' '}
                                    🙏
                                </span>
                                <SimpleTooltip
                                    tooltipContent={
                                        <p>
                                            Copy application informations to
                                            clipboard.
                                        </p>
                                    }
                                >
                                    <Button
                                        id="bt-report"
                                        variant="default"
                                        onClick={copyToClipBoard}
                                    >
                                        Report
                                    </Button>
                                </SimpleTooltip>
                            </div>
                        </AlertBox>
                    )}
                    {appReady && (
                        <>
                            <Card className="w-full border-primary">
                                <CardHeader>
                                    <CardTitle>
                                        1. Select ouput folder
                                    </CardTitle>
                                    <CardDescription>
                                        Specify where to execute the mesures.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex w-full items-center gap-2">
                                        <Input
                                            id="filePath"
                                            value={workDir}
                                            type="text"
                                            readOnly
                                        />
                                        <Button
                                            type="button"
                                            id="btn-file"
                                            disabled={!appReady}
                                            onClick={selectWorkingFolder}
                                        >
                                            Browse
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* <TypographyH2>1. Select ouput folder</TypographyH2> */}
                            <TypographyP className={`w-full`}>
                                Choose the type of mesure you want to do.
                            </TypographyP>
                            <Tabs
                                defaultValue="simple-mesure"
                                className="w-full"
                            >
                                <TabsList className="mb-4 grid w-full grid-cols-2">
                                    <TabsTrigger value="simple-mesure">
                                        {
                                            labels[language][
                                                'simple-mesures-label'
                                            ]
                                        }
                                    </TabsTrigger>
                                    <TabsTrigger value="json-mesure">
                                        {labels[language]['full-mesures-label']}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="simple-mesure">
                                    <SimplePanMesure
                                        appReady={appReady}
                                        language={language}
                                        simpleMesures={runSimpleMesures}
                                        urlsList={urlsList}
                                        setUrlsList={setUrlsList}
                                        className="border-primary"
                                    />
                                </TabsContent>
                                <TabsContent value="json-mesure">
                                    <JsonPanMesure
                                        appReady={appReady}
                                        isJsonFromDisk={isJsonFromDisk}
                                        language={language}
                                        jsonDatas={jsonDatas}
                                        setJsonDatas={setJsonDatas}
                                        mesure={() =>
                                            runJsonSaveAndCollect(true)
                                        }
                                        reload={runJsonReadAndReload}
                                        save={runJsonSaveAndCollect}
                                        notify={handlerJsonNotify}
                                        className="border-primary"
                                    />
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                    {/* display here the echoReadable line */}
                    <ConsoleApp id="echo" datasFromHost={datasFromHost} />
                </div>
                <Footer nodeVersion={nodeVersion} />
            </main>
            {displayPopin && (
                <PopinLoading
                    id="loadingPopin"
                    progress={progress}
                    showProgress={!appReady}
                >
                    <ReloadIcon className="mr-2 size-4 animate-spin" />
                    <p id="counter">{popinText}</p>
                </PopinLoading>
            )}
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
