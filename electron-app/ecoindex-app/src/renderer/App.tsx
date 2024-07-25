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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/renderer/ui/tooltip'
import { labels, utils } from '../shared/constants'
import { useEffect, useState } from 'react'

import { AlertBox } from './components/Alert'
import { Bug } from 'lucide-react'
import { Button } from '@/renderer/ui/button'
import { DarkModeSwitcher } from './components/dark-mode-switcher'
import { Header } from './components/Header'
import { Input } from './ui/input'
import { JsonPanMesure } from './components/json-pan'
import { PopinLoading } from './components/loading-popin'
import { ReloadIcon } from '@radix-ui/react-icons'
import { SimplePanMesure } from './components/simple-pan'
import { TabsContent } from '@radix-ui/react-tabs'
import { Textarea } from './ui/textarea'
import { TypographyP } from './ui/typography/TypographyP'
import iconAsso from '../../assets/asso.svg'
import packageJson from '../../package.json'

function TheApp() {
    const [language, setLanguage] = useState('en')
    const [isJsonFromDisk, setIsJsonFromDisk] = useState(false)
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
    const [isNodeVersionOK, setIsNodeVersionOK] = useState(true)
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
        <div className="container relative">
            <DarkModeSwitcher
                title="Dark mode switch"
                className="absolute left-2 top-2 z-20 flex gap-2"
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute right-2 top-2 z-20"
                            onClick={copyToClipBoard}
                        >
                            <Bug className="mr-2 size-4" />
                            Debug
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            Copy application informations to clipboard.
                            <br />
                            Send theim to developper at renaud@greenit.fr.
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
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
                    {isNodeInstalled &&
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
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                id="bt-report"
                                                variant="default"
                                                onClick={copyToClipBoard}
                                            >
                                                Report
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Copy application informations to
                                                clipboard.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </AlertBox>
                    )}
                    {appReady && (
                        <>
                            <Card className="border-primary w-full">
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
                    <Card className="border-primary w-full">
                        <CardHeader>
                            <CardTitle>Console</CardTitle>
                            <CardDescription>
                                Here you cans see what is happenning hunder the
                                hood...
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="echo"
                                className="text-muted-foreground h-36"
                                readOnly
                            ></Textarea>
                        </CardContent>
                    </Card>
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
                <ReloadIcon className="mr-2 size-4 animate-spin" />
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
