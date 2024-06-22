import './index.css'

import { useEffect, useState } from 'react'
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'

import iconAsso from '../../assets/asso.svg'
import icon from '../../assets/icon.svg'
import { cn } from '../shared/tailwind-helper'
import { AlertBox } from './components/Alert'

function Hello() {
  const [data, setdata] = useState('')
  const [workDir, setWorkDir] = useState('chargement...')
  const [appReady, setAppReady] = useState(false)
  const [
    isLighthouseEcoindexPluginInstalled,
    setIsLighthouseEcoindexPluginInstalled,
  ] = useState(true)
  const [isNodeInstalled, setIsNodeInstalled] = useState(true)
  // Run runFakeMesure on click on button fake
  const fakeMesure = () => {
    console.log('fake button clicked')
    window.electronAPI.runFakeMesure()
  }

  const openFile = async () => {
    const filePath = await window.electronAPI.handleSelectFolder()
    setWorkDir(filePath)
  }
  const setLog = (value: string) => {
    const echoElement = document.getElementById('echo') as HTMLElement
    echoElement.innerText = value
  }

  useEffect(() => {
    const fetchNodeVersion = async () => {
      const result = await window.versions.getNodeVersion()
      setdata(result)
    }
    const fetchWorkDir = async () => {
      const result = await window.electronAPI.getWorkDir('')
      setWorkDir(result)
      // const filePathElement = document.getElementById('filePath') as HTMLElement;
      // filePathElement.innerText = result
    }
    const fetchNodeInstalled = async () => {
      const result = await window.electronAPI.isNodeInstalled()
      setIsNodeInstalled(result)
      // const el = document.getElementById('isNodeInstalled') as HTMLElement
      // el.innerText = result.toString()
      if (isLighthouseEcoindexPluginInstalled && isNodeInstalled) {
        setAppReady(true)
      }
      console.log(`NodeInstalled: ${result}`)
    }

    const fetchLighthouseEcoindexPluginInstalled = async () => {
      const result =
        await window.electronAPI.isLighthouseEcoindexPluginInstalled()
      setIsLighthouseEcoindexPluginInstalled(result)
      // const el = document.getElementById(
      //   'isLighthouseEcoindexPluginInstalled',
      // ) as HTMLElement
      // el.innerText = result.toString()
      if (isLighthouseEcoindexPluginInstalled && isNodeInstalled) {
        setAppReady(true)
      }
      console.log(`LighthouseEcoindexPluginInstalled: ${result}`)
    }

    fetchNodeVersion()
    fetchWorkDir()
    fetchLighthouseEcoindexPluginInstalled()
    fetchNodeInstalled()
  }, [])

  return (
    <div>
      <main className="flex flex-col justify-between p-4 h-screen">
        <div className="flex flex-col gap-2 items-center">
          <div className="logo-ecoindex">
            {/* <img width="100" alt="icon" src={icon} className="bg-slate-400" /> */}
            <span className="logo-ecoindex logo-ecoindex__eco">eco</span>
            <span className="logo-ecoindex logo-ecoindex__index">Index</span>
          </div>
          <h1 className="font-black text-xl text-ecoindex-green">
            Mesures launcher 👋
          </h1>
          {/* <div className="flex gap-2 items-center text-sm text-gray-500 font-medium">
            <p>
              Plugin installed:{' '}
              <span id="isLighthouseEcoindexPluginInstalled"></span>
            </p>
            <p>
              Node installed: <span id="isNodeInstalled"></span>
            </p>
          </div> */}
          <AlertBox visible={!isLighthouseEcoindexPluginInstalled}>
            <span>Lighthouse Ecoindex plugin is not installed!</span>
            <button className="btn btn-green-outlined">Install</button>
          </AlertBox>
          <AlertBox visible={!isNodeInstalled}>
            <span>Node is not installed!</span>
            <button className="btn btn-green-outlined">Install</button>
          </AlertBox>
          <div className="flex gap-2 items-center w-full">
            <p id="filePath" className="echo min-h-8 grid place-items-center">
              {workDir}
            </p>
            <button
              type="button"
              id="btn-file"
              onClick={openFile}
              disabled={appReady}
              className="btn btn-green whitespace-nowrap"
            >
              Select output folder
            </button>
          </div>
          <button
            id="btn-fake"
            disabled={appReady}
            onClick={fakeMesure}
            className="btn btn-green"
          >
            Fake Measure
          </button>
          {/* display here the echoReadable line */}
          <p className="text-sm text-gray-500 font-medium">console</p>
          <textarea id="echo" className="echo h-36" readOnly></textarea>
        </div>
        <div className="text-sm text-center">
          <p className="text-xs text-gray-500">
            Host Informations : Node.js({data ? data : 'loading...'})
          </p>
          <p className="text-xs text-gray-500">
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
