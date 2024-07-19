import './index.css'

import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { labels, utils } from '../shared/constants'
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
  // let appReady = false
  let loadingScreen = 0
  const [urlsList, setUrlsList] = useState<InputField[]>([
    { value: 'https://www.ecoindex.fr/' },
    { value: 'https://www.ecoindex.fr/a-propos/' },
  ])
  const [jsonDatas, setJsonDatas] = useState<IJsonMesureData>(
    utils.DEFAULT_JSON_DATA,
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
      window.electronAPI.handleJsonSaveAndCollect(jsonDatas, saveAndCollect)
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

  const setLog = (value: string) => {
    const echoElement = document.getElementById('echo') as HTMLElement
    echoElement.innerText = value
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
    const loadingPopin = document.getElementById('loadingPopin') as HTMLElement
    if (loadingScreen === 4) {
      loadingPopin.style.display = 'none'
      const _n: any = {}
      _n.body = 'Application succefully loaded.\nWelcome 👋'
      _n.subtitle = 'You can now start mesures'
      _n.priority = 'critical'
      showNotification('', _n)
    }
  }

  const installNode = () => {
    window.open(`https://nodejs.org/en/download/prebuilt-installer`, `_blank`)
  }
  const installEcoindexPlugin = async () => {
    try {
      await window.electronAPI.handleLighthouseEcoindexPluginInstall()
    } catch (error) {
      console.error(`installEcoindexPlugin`, error)
    }
  }

  useEffect(() => {
    /**
     * Handlers, Node Version
     */
    const fetchNodeVersion = async () => {
      const result = await window.versions.getNodeVersion()
      setNodeVersion(result)
      // nodeVersion = result
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
      setIsNodeInstalled(result)
      // isNodeInstalled = result
      setAppReady(result && isLighthouseEcoindexPluginInstalled)

      increment()
    }

    /**
     * Handlers, Is Ecoindex Lighthouse Plugin installed.
     */
    const fetchLighthouseEcoindexPluginInstalled = async () => {
      const result =
        await window.electronAPI.isLighthouseEcoindexPluginInstalled()
      setIsLighthouseEcoindexPluginInstalled(result)
      // isLighthouseEcoindexPluginInstalled = result
      setAppReady(result && isNodeInstalled)
      increment()
    }

    // must be the first
    fetchNodeInstalled()
    fetchNodeVersion()
    fetchWorkDir()
    fetchLighthouseEcoindexPluginInstalled()
  }, [])

  useEffect(() => {
    console.log('language', language)
  }, [language])

  useEffect(() => {
    // setAppReady(isLighthouseEcoindexPluginInstalled && isNodeInstalled)
    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
    console.log('isNodeInstalled', isNodeInstalled)
    console.log(
      'isLighthouseEcoindexPluginInstalled',
      isLighthouseEcoindexPluginInstalled,
    )
    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
  }, [isNodeInstalled, isLighthouseEcoindexPluginInstalled])

  useEffect(() => {
    console.log(`************************************`)
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
      <main className="flex flex-col justify-between p-4 h-screen">
        <div className="flex flex-col gap-2 items-center">
          <div className="logo-ecoindex">
            {/* <img width="100" alt="icon" src={icon} className="bg-slate-400" /> */}
            <span className="logo-ecoindex logo-ecoindex__eco">eco</span>
            <span className="logo-ecoindex logo-ecoindex__index">Index</span>
          </div>
          <h1>Mesures launcher 👋</h1>
          <AlertBox visible={!isNodeInstalled}>
            <span>Node is not installed!</span>
            <button
              id="bt-install-node"
              onClick={installNode}
              className="btn btn-green-outlined"
            >
              Install
            </button>
          </AlertBox>
          {isNodeInstalled && (
            <AlertBox visible={isLighthouseEcoindexPluginInstalled}>
              <span>Lighthouse Ecoindex plugin is not installed!</span>
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
          <div className="flex gap-2 items-center w-full">
            <p id="filePath" className="echo min-h-8 grid place-items-center">
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
            <div className="w-full flex gap-1">
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
                { flex: tabSelected === 0 },
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
                { flex: tabSelected === 1 },
              )}
            />
          </div>
          {/* display here the echoReadable line */}
          <p className="text-sm text-ecoindex-green font-medium">console</p>
          <textarea id="echo" className="echo h-36" readOnly></textarea>
        </div>
        <div className="text-sm text-center">
          <p className="text-xs">
            Host Informations : Node.js(
            {nodeVersion ? nodeVersion : 'loading...'})
          </p>
          <p className="text-xs">
            Internal Electron informations : Chrome (v{window.versions.chrome()}
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
