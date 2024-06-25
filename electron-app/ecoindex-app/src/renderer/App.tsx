import './index.css'

import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { AlertBox } from './components/Alert'
import { JsonPanMesure } from './components/json-pan'
import { PopinLoading } from './components/loading-popin'
import { SimplePanMesure } from './components/simple-pan'
import { cn } from '../shared/tailwind-helper'
import iconAsso from '../../assets/asso.svg'
import { labels } from '../shared/constants'
import packageJson from '../../package.json'

function Hello() {
  const [language, setLanguage] = useState('en')
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
  const [jsonDatas, setJsonDatas] = useState<IJsonMesureData>({
    'extra-header': {
      Cookie: 'monster=blue',
      'x-men': 'wolverine',
      Authorization: 'Basic c3BpZTpFaXBzRXJnb1N1bTQyJA==',
      'config-source': 'input-file.json',
    },
    output: ['json', 'statement'],
    'output-path': './reports',
    'user-agent': 'insights',
    'output-name': 'ecoindex',
    courses: [
      {
        name: 'BEST PAGES',
        target: 'TBD.',
        course:
          'Visiter les données financières, les résultats financiers, les informations réglementées, la page finance',
        'is-best-pages': true,
        urls: [
          'https://www-pp.spie.com/fr',
          'https://www-pp.spie.com/fr/rejoindre-spie',
          'https://www-pp.spie.com/fr/investisseurs/cours-de-laction',
          'https://www-pp.spie.com/fr/rejoindre-spie/vous-aussi-rejoignez-spie',
          'https://www-pp.spie.com/en',
        ],
      },
      {
        name: 'INVESTORS',
        target: 'TBD.',
        course:
          'Visiter les données financières, les résultats financiers, les informations réglementées, la page finance',
        'is-best-pages': false,
        urls: [
          'https://www-pp.spie.com/en',
          'https://www-pp.spie.com/en/about-spie',
          'https://www-pp.spie.com/en/about-us/spie-around-world',
          'https://www-pp.spie.com/en/investors/share-price',
          'https://www-pp.spie.com/en/investors',
          'https://www-pp.spie.com/en/journalists/profile-key-figures',
          'https://www-pp.spie.com/en/investors/financial-results',
          'https://www-pp.spie.com/en/regulated-information',
          'https://www-pp.spie.com/en/finance',
        ],
      },
      {
        name: 'CLIENTS',
        target: 'TBD.',
        course:
          'Consulter les offres, les solutions et les expertises, les secteurs, les réalisations',
        'is-best-pages': false,
        urls: [
          'https://www-pp.spie.com/fr',
          'https://www-pp.spie.com/fr/spie-France',
          'https://www-pp.spie.com/fr/propos/spie-dans-le-monde',
          'https://www-pp.spie.com/fr/journalistes/profil-chiffres-cles',
          'https://www-pp.spie.com/fr/decouvrez-nos-offres-solutions-et-expertises',
          'https://www-pp.spie.com/fr/decouvrez-nos-offres-solutions-et-expertises/secteurs/energies/nucleaire',
          'https://www-pp.spie.com/fr/realisations',
          'https://www-pp.spie.com/fr/actualites',
          'https://www-pp.spie.com/fr/actualites/resultats-annuels-2022',
        ],
      },
      {
        name: 'CANDIDATS',
        target: 'TBD.',
        course:
          "Attérir sur l'ancienne mesure (en venant depuis l'extension chrome par exemple), aller sur la page d'accueil, lancer une nouvelle mesure",
        'is-best-pages': false,
        urls: [
          'https://www-pp.spie.com/fr/',
          'https://www-pp.spie.com/fr/rejoindre-spie',
          'https://www-pp.spie.com/fr/rejoindre-spie/vous-aussi-rejoignez-spie',
          'https://www-pp.spie.com/fr/a-propos-de-spie',
          'https://www-pp.spie.com/fr/rejoindre-spie/actionnariat-salarie',
          'https://www-pp.spie.com/fr/rejoindre-spie/7-bonnes-raisons-de-nous-rejoindre',
          'https://www-pp.spie.com/fr/rejoindre-spie/7-bonnes-raisons-de-nous-rejoindre/partager-des-valeurs-qui-ont-du-sens',
          'https://www-pp.spie.com/fr/temoignages-collaborateurs',
          'https://www-pp.spie.com/fr/developpement-durable',
        ],
      },
    ],
  })
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

  const runJsonMesures = () => {
    console.log('Json mesures clicked')
    try {
      window.electronAPI.handleJsonMesures(jsonDatas)
    } catch (error) {
      console.error('Error on runJsonMesures', error)
      showNotification('', {
        body: 'Error on runJsonMesures',
        subtitle: 'Courses Mesure (Full mode)',
      })
    }
  }

  const runJsonReadAndReload = () => {
    console.log('Json read and reload clicked')
    try {
      window.electronAPI.handleJsonReadAndReload()
    } catch (error) {
      console.error('Error on runJsonReadAndReload', error)
      showNotification('', {
        body: 'Error on runJsonReadAndReload',
        subtitle: 'Courses Mesure (Full mode)',
      })
    }
  }

  const runJsonSave = () => {
    console.log('Json save clicked')
    try {
      window.electronAPI.handleJsonSave(jsonDatas)
    } catch (error) {
      console.error('Error on runJsonSave', error)
      showNotification('', {
        body: 'Error on runJsonSave',
        subtitle: 'Courses Mesure (Full mode)',
      })
    }
  }

  const handlerJsonNotify = (title: string, message: string) => {
    console.log('Json notify clicked')
    showNotification('', { body: message, subtitle: title })
  }

  const openFile = async () => {
    const filePath = await window.electronAPI.handleSelectFolder()
    setWorkDir(filePath)
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
    console.log('increment')
    loadingScreen = loadingScreen + 1
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
              // TODO: isJsonFromDisk={false}
              isJsonFromDisk={false}
              language={language}
              jsonDatas={jsonDatas}
              setJsonDatas={setJsonDatas}
              mesure={runJsonMesures}
              reload={runJsonReadAndReload}
              save={runJsonSave}
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
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  )
}
