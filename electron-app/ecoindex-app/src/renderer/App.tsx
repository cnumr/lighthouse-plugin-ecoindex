import './index.css'

import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { AlertBox } from './components/Alert'
import { JsonPanMesure } from './components/json-pan'
import { PopinLoading } from './components/loading-popin'
import { SimplePanMesure } from './components/simple-pan'
import { cn } from '../shared/tailwind-helper'
import iconAsso from '../../assets/asso.svg'

type InputField = {
  value: string
}

function Hello() {
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
  const [
    isLighthouseEcoindexPluginInstalled,
    setIsLighthouseEcoindexPluginInstalled,
  ] = useState(true)
  // let isLighthouseEcoindexPluginInstalled = false
  const [isNodeInstalled, setIsNodeInstalled] = useState(true)
  // let isNodeInstalled = false

  // Run runFakeMesure on click on button fake
  const simpleMesures = () => {
    console.log('Simple mesures clicked')
    window.electronAPI.simpleMesures(urlsList)
  }

  const openFile = async () => {
    const filePath = await window.electronAPI.handleSelectFolder()
    setWorkDir(filePath)
  }
  const setLog = (value: string) => {
    const echoElement = document.getElementById('echo') as HTMLElement
    echoElement.innerText = value
  }

  const increment = () => {
    console.log('increment')
    loadingScreen = loadingScreen + 1
    const counter = document.getElementById('counter') as HTMLElement
    counter.innerText = `Loading... ${loadingScreen}/4`
    const loadingPopin = document.getElementById('loadingPopin') as HTMLElement
    if (loadingScreen === 4) {
      loadingPopin.style.display = 'none'
    }
  }

  useEffect(() => {
    const fetchNodeVersion = async () => {
      const result = await window.versions.getNodeVersion()
      setNodeVersion(result)
      // nodeVersion = result
      increment()
    }
    const fetchWorkDir = async () => {
      const result = await window.electronAPI.getWorkDir('')
      setWorkDir(result)
      increment()
    }
    const fetchNodeInstalled = async () => {
      const result = await window.electronAPI.isNodeInstalled()
      setIsNodeInstalled(result)
      // isNodeInstalled = result
      setAppReady(result && isLighthouseEcoindexPluginInstalled)

      increment()
    }

    const fetchLighthouseEcoindexPluginInstalled = async () => {
      const result =
        await window.electronAPI.isLighthouseEcoindexPluginInstalled()
      setIsLighthouseEcoindexPluginInstalled(result)
      // isLighthouseEcoindexPluginInstalled = result
      setAppReady(result && isNodeInstalled)
      increment()
    }

    fetchNodeVersion()
    fetchWorkDir()
    fetchLighthouseEcoindexPluginInstalled()
    fetchNodeInstalled()
  }, [])

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
          <AlertBox visible={!isLighthouseEcoindexPluginInstalled}>
            <span>Lighthouse Ecoindex plugin is not installed!</span>
            <button className="btn btn-green-outlined">Install</button>
          </AlertBox>
          <AlertBox visible={!isNodeInstalled}>
            <span>Node is not installed!</span>
            <button className="btn btn-green-outlined">Install</button>
          </AlertBox>
          <h2>1. Select ouput folder</h2>
          <div className="flex gap-2 items-center w-full">
            <p id="filePath" className="echo min-h-8 grid place-items-center">
              {workDir}
            </p>
            <button
              type="button"
              id="btn-file"
              disabled={!appReady}
              onClick={openFile}
              className="btn btn-green whitespace-nowrap"
            >
              Browse
            </button>
          </div>
          <div className="w-full">
            <div className="w-full flex gap-1">
              <button
                className={cn('tab', { active: tabSelected === 0 })}
                onClick={() => setTabSelected(0)}
              >
                Simple Mesure(s)
              </button>
              <button
                className={cn('tab', { active: tabSelected === 1 })}
                onClick={() => setTabSelected(1)}
              >
                Courses Mesure
              </button>
            </div>
            <SimplePanMesure
              appReady={appReady}
              simpleMesures={simpleMesures}
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
          <p className="mt-2 grid place-content-center">
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
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  )
}
