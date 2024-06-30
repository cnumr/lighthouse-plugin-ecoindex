import { FC } from 'react'
import { SimpleUrlsList } from './simple-urls'

export interface ISimpleMesureLayout {
  appReady: boolean
  language: string
  simpleMesures: () => void
  urlsList: SimpleUrlInput[]
  setUrlsList: (urlsList: SimpleUrlInput[]) => void
  className: string
}

export const SimplePanMesure: FC<ISimpleMesureLayout> = ({
  appReady,
  language,
  simpleMesures,
  urlsList,
  setUrlsList,
  className,
}) => {
  return (
    <div className={className}>
      <SimpleUrlsList
        urlsList={urlsList}
        setUrlsList={setUrlsList}
        visible={true}
        language={language}
        title="2. Urls to mesure"
      />
      <h2>3. Launch the mesures</h2>
      <button
        type="button"
        id="btn-simple-mesures"
        title="Launch the mesures"
        disabled={!appReady}
        onClick={simpleMesures}
        className="btn btn-green"
      >
        Mesures
      </button>
    </div>
  )
}
