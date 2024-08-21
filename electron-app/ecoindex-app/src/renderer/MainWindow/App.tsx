import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { useCallback, useEffect, useState } from 'react'

import { AlertBox } from '../components/Alert'
import { Bug } from 'lucide-react'
import { Button } from '@/renderer/ui/button'
import { ConfigData } from '../../class/ConfigData'
import { ConsoleApp } from '../components/console'
import { DarkModeSwitcher } from '../components/dark-mode-switcher'
import { Footer } from '../components/footer'
import { Header } from '../components/Header'
import { Input } from '../ui/input'
import { JsonPanMesure } from '../components/json-pan'
import { PopinLoading } from '../components/loading-popin'
import { ReloadIcon } from '@radix-ui/react-icons'
import { SimplePanMesure } from '../components/simple-pan'
import { SimpleTooltip } from '../components/simple-tooltip'
import { TabsContent } from '@radix-ui/react-tabs'
import { TypographyP } from '../ui/typography/TypographyP'
import i18nResources from '../../configs/i18nResources'
import log from 'electron-log/renderer'
import packageJson from '../../../package.json'
import { useTranslation } from 'react-i18next'
import { utils } from '../../shared/constants'

const frontLog = log.scope('front/App')

function TheApp() {
    // #region useState, useTranslation
    // const [language, setLanguage] = useState('en')
    const [progress, setProgress] = useState(0)
    const [isJsonFromDisk, setIsJsonFromDisk] = useState(false)
    const [nodeVersion, setNodeVersion] = useState('')
    const [workDir, setWorkDir] = useState('loading...')
    const [homeDir, setHomeDir] = useState('loading...')
    const [appReady, setAppReady] = useState(false)
    const [datasFromHost, setDatasFromHost] = useState({})
    const [displayPopin, setDisplayPopin] = useState(true)
    const [popinText, setPopinText] = useState('Loading... 0/4')
    const [pluginVersion, setPluginVersion] = useState('loading...')
    const [isNodeInstalled, setIsNodeInstalled] = useState(false)
    const [isNodeVersionOK, setIsNodeVersionOK] = useState(false)
    const [isPuppeteerBrowserInstalled, setIsPuppeteerBrowserInstalled] =
        useState(false)
    const [
        isLighthouseEcoindexPluginInstalled,
        setIsLighthouseEcoindexPluginInstalled,
    ] = useState(false)

    const [displayReloadButton, setDisplayReloadButton] = useState(false)

    let loadingScreen = 0
    const [urlsList, setUrlsList] = useState<InputField[]>([
        { value: 'https://www.ecoindex.fr/' },
        { value: 'https://www.ecoindex.fr/a-propos/' },
    ])
    const [jsonDatas, setJsonDatas] = useState<IJsonMesureData>(
        utils.DEFAULT_JSON_DATA
    )

    const { t } = useTranslation()

    // endregion

    // region popin
    /**
     * Necessary display waiting popin.
     * @param block boolean
     */
    const blockScrolling = (block = true) => {
        const body = document.getElementsByTagName(
            `body`
        )[0] as unknown as HTMLBodyElement
        body.style.overflowY = block ? 'hidden' : 'auto'
    }

    /**
     * Show/Hide waiting popin during process.
     * @param value string | boolean
     */
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

    /**
     * Increment function to handle the waiting popin.
     */
    const increment = () => {
        const STEPS = 5
        loadingScreen = loadingScreen + 1
        setProgress(loadingScreen * (100 / STEPS))
        frontLog.log(`Verify configuration step ${loadingScreen}/${STEPS}`)
        setPopinText(`${t('Loading...')} ${loadingScreen}/${STEPS}`)
        if (loadingScreen === STEPS) {
            frontLog.log(`<><><><><><><><><><><><><><><><><><>`)
            frontLog.log(`All data readed! 👀`)
            frontLog.log(`isNodeInstalled`, isNodeInstalled)
            frontLog.log(
                `isLighthouseEcoindexPluginInstalled`,
                isLighthouseEcoindexPluginInstalled
            )
            frontLog.log(
                `isPuppeteerBrowserInstalled`,
                isPuppeteerBrowserInstalled
            )
            checkAppReady()
            setDisplayPopin(false)
            const _n: any = {}
            _n.body = t('Application succefully loaded.\nWelcome 👋')
            _n.subtitle = t('You can now start measures')
            _n.priority = 'critical'
            showNotification('', _n)
            frontLog.log(`<><><><><><><><><><><><><><><><><><>`)
            setDisplayReloadButton(false)
        } else {
            setAppReady(false)
        }
    }
    // #endregion

    // #region handlers
    /**
     * Handler, launch simple mesure with the plugin.
     * @returns Promise<void>
     */
    const runSimpleMesures = async () => {
        frontLog.debug('Simple measures clicked')
        if (workDir === homeDir) {
            if (
                !confirm(
                    `${t(
                        'Are you shure to want create report(s) in your default folder?'
                    )}\n\rDestination: ${homeDir}`
                )
            )
                return
        }
        setDisplayReloadButton(false)
        showHidePopinDuringProcess(
            `${t('Url(s) Measure (Simple mode)')} started 🚀`
        )
        try {
            await window.electronAPI.handleSimpleMesures(urlsList)
            showHidePopinDuringProcess(true)
        } catch (error) {
            frontLog.error('Error on runSimpleMesures', error)
            showNotification('', {
                body: t('Error on runSimpleMesures'),
                subtitle: t('Courses Measure (Simple mode)'),
            })
            showHidePopinDuringProcess(false)
        }
    }

    /**
     * Handler, Read and Reload the Json configuration for mesures of parcours. Relaunched when workDir change.
     */
    const runJsonReadAndReload = useCallback(async () => {
        frontLog.log('Json read and reload')
        try {
            const _jsonDatas: IJsonMesureData =
                await window.electronAPI.handleJsonReadAndReload()
            frontLog.debug(`runJsonReadAndReload`, _jsonDatas)
            if (_jsonDatas) {
                setJsonDatas(_jsonDatas)
                setIsJsonFromDisk(true)
            } else {
                setIsJsonFromDisk(false)
            }
        } catch (error) {
            frontLog.error('Error on runJsonReadAndReload', error)
            showNotification('', {
                subtitle: '🚫 Courses Measure (Full mode)',
                body: 'Error on runJsonReadAndReload',
            })
        }
    }, [])

    /**
     * Handler, launch measures of parcours.
     * 1. Save Json configuration in workDir.
     * 2. Launch measures with the plugin.
     * @param saveAndCollect boolean
     * @returns Promise<void>
     */
    const runJsonSaveAndCollect = async (saveAndCollect = false) => {
        frontLog.debug('Json save clicked')
        if (workDir === homeDir) {
            if (
                !confirm(
                    t(
                        `Are you shure to want create report(s) in your default folder?\n\rDestination: {{homeDir}}`,
                        { homeDir }
                    )
                )
            )
                return
        }
        setDisplayReloadButton(false)
        showHidePopinDuringProcess(
            `${t('Courses Measure (Full mode)')} started 🚀`
        )
        try {
            frontLog.debug(`jsonDatas`, jsonDatas)
            frontLog.debug(`saveAndCollect`, saveAndCollect)
            await window.electronAPI.handleJsonSaveAndCollect(
                jsonDatas,
                saveAndCollect
            )
            showHidePopinDuringProcess(true)
        } catch (error) {
            frontLog.error('Error on runJsonSaveAndCollect', error)
            showNotification('', {
                subtitle: t('🚫 Courses Measure (Full mode)'),
                body: t('Error on runJsonSaveAndCollect'),
            })
            showHidePopinDuringProcess(false)
        }
    }

    /**
     * Handlers, notify user.
     * @param title string
     * @param message string
     */
    const handlerJsonNotify = (title: string, message: string) => {
        frontLog.debug('Json notify clicked')
        showNotification('', { body: message, subtitle: title })
    }

    /**
     * Handler for selecting workDir.
     */
    const selectWorkingFolder = async () => {
        const filePath = await window.electronAPI.handleSelectFolder()

        if (filePath !== undefined) {
            setWorkDir(filePath)
        }
    }

    /**
     * Handler to open URL of the official Node.js installer.
     */
    const installNode = () => {
        window.open(
            `https://nodejs.org/en/download/prebuilt-installer`,
            `_blank`
        )
    }

    // /**
    //  * Handler to install Puppetter, Puppetter/Chrome Browser and lighthouse-plugin-ecoindex.
    //  */
    // const installEcoindexPlugin = async () => {
    //   try {
    //     await window.electronAPI.handleLighthouseEcoindexPluginInstall()
    //   } catch (error) {
    //     frontLog.error(`installEcoindexPlugin`, error)
    //   }
    // }

    // #region utils
    /**
     * Utils, wait method.
     * @param ms number
     * @returns Promise<unknown>
     */
    async function _sleep(ms: number) {
        return new Promise((resolve) => {
            frontLog.debug(`wait ${ms / 1000}s`)

            setTimeout(resolve, ms)
        })
    }

    /**
     * Notify user.
     * @param title string
     * @param options any
     */
    const showNotification = (title: string, options: any) => {
        const _t = title === '' ? packageJson.productName : title
        new window.Notification(_t, options)
    }

    /**
     * Handler to copy in clipboard the content of datasFromHost.
     */
    const copyToClipBoard = () => {
        navigator.clipboard.writeText(JSON.stringify(datasFromHost, null, 2))
    }

    /**
     * Handlers, force window refresh
     */
    const forceRefresh = () => {
        // getMainWindow().webContents.reload()
        window.location.reload()
    }

    /**
     * Send text to console on front.
     * @param message string
     */
    const sendLogToFront = (message: string) => {
        const textArea = document.getElementById('echo') as HTMLTextAreaElement
        textArea.value = textArea.value + '\n' + message
        textArea.scrollTop = textArea.scrollHeight
    }

    /**
     * Handler, check and update if App is ready to use.
     */
    const checkAppReady = () => {
        frontLog.log(`%%%%%%%%%%%%%%% checkAppReady %%%%%%%%%%%%%%%`)
        frontLog.log('isNodeInstalled', isNodeInstalled)
        frontLog.log(
            'isLighthouseEcoindexPluginInstalled',
            isLighthouseEcoindexPluginInstalled
        )
        frontLog.log('isPuppeteerBrowserInstalled', isPuppeteerBrowserInstalled)
        let count = 0
        if (isNodeInstalled) count++
        if (isLighthouseEcoindexPluginInstalled) count++
        if (isPuppeteerBrowserInstalled) count++
        setAppReady(count === 3)
        frontLog.log(`%%%%%%%%%%%%%%% checkAppReady ${count} %%%%%%%%%%%%%%%`)
    }

    /**
     * Display information in log and check if App is ready.
     */
    const logEventAndCheckAppReady = useCallback((name: string) => {
        frontLog.debug(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        frontLog.debug(`Binded on [${name}]`)
        checkAppReady()
        frontLog.debug(`appReady`, appReady)
        frontLog.debug(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
    }, [])

    const handleDisplayReloadButton = async () => {
        frontLog.debug(
            `handleDisplayReloadButton launched, isLighthouseEcoindexPluginInstalled`,
            isLighthouseEcoindexPluginInstalled
        )
        if (!isLighthouseEcoindexPluginInstalled) {
            setDisplayReloadButton(false)
            await _sleep(30000)
            setDisplayReloadButton(true)
        } else {
            frontLog.debug(`handleDisplayReloadButton canceled`)
        }
    }

    // #endregion

    // #region useEffect
    useEffect(() => {
        /**
         * Handlers, install Puppeteer Browser on Host
         */
        const fetchIsPuppeteerBrowserInstalled = async () => {
            return new Promise<string | boolean>((resolve, reject) => {
                window.electronAPI
                    .handleIsPuppeteerBrowserInstalled()
                    .then((value) => {
                        frontLog.debug(
                            `fetchIsPuppeteerBrowserInstalled Done 🎉`,
                            value
                        )
                        resolve(value as boolean)
                    })
                    .catch((value) => {
                        frontLog.error(
                            `fetchIsPuppeteerBrowserInstalled Failed 🚫`,
                            value
                        )
                        reject(value as boolean)
                    })
            }).then((value: boolean) => {
                setIsLighthouseEcoindexPluginInstalled(value)
                increment()
            })
        }
        /**
         * Handlers, Node Version
         */
        const fetchNodeVersion = async () => {
            const result = await window.versions.getNodeVersion()
            setNodeVersion(result)
            const major = nodeVersion.replace('v', '').split('.')[0]

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
            frontLog.debug(`fetchWorkDir result: `, result)
            const storedWorkDir = await window.store.get(
                `lastWorkDir`,
                result !== '' ? result : homeDir
            )
            frontLog.debug(`fetchWorkDir storedWorkDir:`, storedWorkDir)
            setWorkDir(storedWorkDir)
            increment()
        }
        /**
         * LAUNCH FIRST! Handlers, Get ans Set NodeDir, NpmDir and NodeVersion.
         */
        const fetchNodeInstalled = async () => {
            const result = await window.electronAPI.isNodeInstalled()
            frontLog.debug(`fetchNodeInstalledRESULT`, result === true)
            setIsNodeInstalled(result === true)
            increment()
        }

        /**
         * Handler, force update of lighthouse-plugin-ecoindex
         */
        const fetchIsLighthousePluginEcoindexInstalled = async () => {
            try {
                handleDisplayReloadButton()
                const result =
                    await window.electronAPI.isLighthouseEcoindexPluginInstalled()
                setIsLighthouseEcoindexPluginInstalled(result.result)
                setPluginVersion(result.targetVersion)
                frontLog.debug(result.message)
                // sendLogToFront(`Lighthouse-plugin-ecoindex installed.`)
                increment()
            } catch (error) {
                frontLog.error(
                    `fetchIsLighthousePluginEcoindexInstalled`,
                    error
                )
            }
        }

        /**
         * Handlers, to get user home dir.
         */
        const fetchHomeDir = async () => {
            const filePath = await window.electronAPI.getHomeDir()
            setHomeDir(filePath)
        }

        /**
         * Launch the mandatory actions at startup, once.
         */
        // fetchHomeDir().then(() => {
        //     fetchWorkDir().then(() => {
        //         fetchNodeInstalled().then(() => {
        //             fetchNodeVersion().then(() => {
        //                 fetchIsPuppeteerBrowserInstalled().then(() => {
        //                     fetchIsLighthousePluginEcoindexInstalled().then(
        //                         () => {
        //                             setDisplayReloadButton(false)
        //                         }
        //                     )
        //                 })
        //             })
        //         })
        //     })
        // })

        /**
         * Handler (main->front), get data from main
         */
        window.electronAPI.sendDatasToFront((data: any) => {
            if (typeof data === 'string') {
                const _data = JSON.parse(data)
                // frontLog.debug(`sendDatasToFront`, _data)
                setDatasFromHost((oldObject) => ({
                    ...oldObject,
                    ..._data,
                }))
            } else {
                // frontLog.debug(`sendDatasToFront`, JSON.stringify(data, null, 2))
                setDatasFromHost((oldObject) => ({
                    ...oldObject,
                    ...data,
                }))
            }
        })

        /**
         * Handler (main->front), Change language from Menu.
         */
        window.electronAPI.changeLanguageInFront((lng: string) => {
            try {
                i18nResources.changeLanguage(lng, (err, t) => {
                    if (err)
                        return frontLog.error(
                            'something went wrong loading',
                            err
                        )
                    t('key') // -> same as i18next.t
                })
            } catch (error) {
                frontLog.error(error)
            }
        })

        const getLanguage = async () => {
            try {
                const gettedLng = await window.store.get(`language`)
                if (gettedLng) {
                    i18nResources.changeLanguage(gettedLng)
                }
            } catch (error) {
                frontLog.debug(error)
            }
        }
        getLanguage()
    }, [])

    // #region initialisationAPI
    useEffect(() => {
        const initalization = async () => {
            frontLog.debug(`initializeApplication start 🚀`)
            const result =
                await window.initialisationAPI.initializeApplication()
            frontLog.debug(`initializeApplication ended '${result}' 👍`)
        }
        initalization()

        window.initialisationAPI.sendConfigDatasToFront(
            (configData: ConfigData) => {
                frontLog.debug(`sendConfigDatasToFront`, configData)
                // todo
                if (configData.error) {
                    frontLog.error(configData)
                    return
                }
                switch (configData.type) {
                    case ConfigData.WORKDIR:
                        setWorkDir(configData.result as string)
                        break
                    case ConfigData.HOMEDIR:
                        setHomeDir(configData.result as string)
                        break
                    case ConfigData.NODE_INSTALLED:
                        setIsNodeInstalled(configData.result as boolean)
                        break
                    case ConfigData.NODE_VERSION_IS_OK:
                        setIsNodeVersionOK(configData.result as boolean)
                        break
                    case ConfigData.PLUGIN_INSTALLED:
                        setIsLighthouseEcoindexPluginInstalled(
                            configData.result as boolean
                        )
                        break
                    case ConfigData.PLUGIN_VERSION:
                        setPluginVersion(configData.result as string)
                        break
                    case ConfigData.PUPPETEER_BROWSER_INSTALLED:
                        setIsPuppeteerBrowserInstalled(
                            configData.result as boolean
                        )
                        break
                    case ConfigData.APP_READY:
                        setAppReady(configData.result as boolean)
                        break

                    default:
                        throw new Error('ConfigData not handle in App.tsx')
                }
            }
        )
    }, [])

    /**
     * Detect isNodeInstalled change.
     */
    // useEffect(() => {
    //     logEventAndCheckAppReady(`isNodeInstalled`)
    // }, [isNodeInstalled, logEventAndCheckAppReady])

    /**
     * Detect isLighthouseEcoindexPluginInstalled change.
     */
    // useEffect(() => {
    //     logEventAndCheckAppReady(`isLighthouseEcoindexPluginInstalled`)
    // }, [isLighthouseEcoindexPluginInstalled, logEventAndCheckAppReady])

    /**
     * Detect setIsPuppeteerBrowserInstalled change.
     */
    // useEffect(() => {
    //     logEventAndCheckAppReady(`setIsPuppeteerBrowserInstalled`)
    // }, [setIsPuppeteerBrowserInstalled, logEventAndCheckAppReady])

    /**
     * Detect workDir change.
     */
    useEffect(() => {
        const isJsonConfigFileExist = async () => {
            const lastWorkDir = await window.store.get(`lastWorkDir`, workDir)
            const result =
                await window.electronAPI.handleIsJsonConfigFileExist(
                    lastWorkDir
                )
            frontLog.log(`isJsonConfigFileExist`, result)

            result && runJsonReadAndReload()
        }
        isJsonConfigFileExist()
    }, [workDir, runJsonReadAndReload])

    // #endregion

    // #region JSX

    return (
        <div className="container relative">
            <DarkModeSwitcher
                title={t('Dark mode switch')}
                className="absolute left-2 top-2 z-20 flex gap-2"
            />
            <SimpleTooltip
                tooltipContent={
                    <p>
                        {t(
                            'Copy application informations to clipboard.<br />Send theim to developper at renaud@greenit.fr.'
                        )}
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
                    {t('Debug')}
                </Button>
            </SimpleTooltip>
            <main className="flex h-screen flex-col justify-between gap-4 p-4">
                <div className="flex flex-col items-center gap-4">
                    <Header />
                    {true && (
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
                                    {t(
                                        'Node is not installed, install it (you must be admin of your computer)! After installation, restart application.'
                                    )}
                                </span>
                                <Button
                                    variant="destructive"
                                    id="bt-install-node"
                                    onClick={installNode}
                                >
                                    {t('Install')}
                                </Button>
                            </div>
                        </AlertBox>
                    )}
                    {isNodeInstalled && !isNodeVersionOK && (
                        <AlertBox title="Error on Node Version">
                            <div className="flex items-center justify-between gap-4">
                                <span>
                                    {t(
                                        'Your Node installation is outdated, you must upgrade it to 20 or upper, upgrade it (you must be admin of your computer)! After upgrade, restart application.'
                                    )}
                                </span>
                                <Button
                                    variant="destructive"
                                    onClick={installNode}
                                >
                                    {t('Upgrade')}
                                </Button>
                            </div>
                        </AlertBox>
                    )}
                    {/* {isNodeVersionOK && !isLighthouseEcoindexPluginInstalled && (
            <AlertBox title="Error on Ecoindex">
              <div className="flex items-center justify-between gap-4">
                <span>
                  {t(
                    'Lighthouse Ecoindex plugin is not installed, install it (you must be admin of your computer)! After installation, restart application.',
                  )}
                </span>
                <Button
                  variant="destructive"
                  id="bt-install-ecoindex"
                  onClick={installEcoindexPlugin}
                >
                  {t('Install')}
                </Button>
              </div>
            </AlertBox>
          )} */}
                    {(!isNodeInstalled ||
                        !isLighthouseEcoindexPluginInstalled ||
                        !isNodeVersionOK) && (
                        <AlertBox variant="bug" title="Report error">
                            <div className="flex items-center justify-between gap-4">
                                <span>
                                    {t(
                                        "You have an error but you think it's a bug. Report to the developper by clicking the button (datas are saved to your clipboard) and send theim by mail to "
                                    )}
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
                                            {t(
                                                'Copy application informations to clipboard.'
                                            )}
                                        </p>
                                    }
                                >
                                    <Button
                                        id="bt-report"
                                        variant="default"
                                        onClick={copyToClipBoard}
                                    >
                                        {t('Report')}
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
                                        {t('1. Select ouput folder')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t(
                                            'Specify where to execute the measures.'
                                        )}
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
                                            {t('Browse')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* <TypographyH2>1. Select ouput folder</TypographyH2> */}
                            <TypographyP className={`w-full`}>
                                {t(
                                    'Choose the type of measure you want to do.'
                                )}
                            </TypographyP>
                            <Tabs
                                defaultValue="simple-mesure"
                                className="w-full"
                            >
                                <TabsList className="mb-4 grid w-full grid-cols-2">
                                    <TabsTrigger value="simple-mesure">
                                        {t('Url(s) Measure (Simple mode)')}
                                    </TabsTrigger>
                                    <TabsTrigger value="json-mesure">
                                        {t('Courses Measure (Full mode)')}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="simple-mesure">
                                    <SimplePanMesure
                                        appReady={appReady}
                                        language={i18nResources.language}
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
                                        language={i18nResources.language}
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
                <Footer
                    nodeVersion={nodeVersion}
                    pluginVersion={pluginVersion}
                    appVersion={packageJson.version}
                    repoUrl={packageJson.homepage}
                />
            </main>
            {displayPopin && (
                <PopinLoading
                    id="loadingPopin"
                    progress={progress}
                    showProgress={!appReady}
                    className="flex !flex-col items-center"
                    footer={
                        displayReloadButton && (
                            <Button
                                id="bt-reload"
                                variant="destructive"
                                size="sm"
                                onClick={forceRefresh}
                                className="max-w-fit"
                            >
                                {t('Reload if too long')}
                            </Button>
                        )
                    }
                >
                    <div className="flex flex-nowrap items-center">
                        <ReloadIcon className="mr-2 size-4 animate-spin" />
                        <p id="counter">{popinText}</p>
                    </div>
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
