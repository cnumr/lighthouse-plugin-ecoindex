import { FC } from 'react'
import { SimpleUrlsList } from './simple-urls'
import { cn } from '../../shared/tailwind-helper'

export interface ILayout {
  appReady: boolean
  simpleMesures: () => void
  urlsList: SimpleUrlInput[]
  setUrlsList: (urlsList: SimpleUrlInput[]) => void
  className: string
}

export const SimplePanMesure: FC<ILayout> = ({
  appReady,
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
      />
      <h2>3. Launch the mesures</h2>
      <button
        type="button"
        id="btn-simple-mesures"
        disabled={!appReady}
        onClick={simpleMesures}
        className="btn btn-green"
      >
        Mesures
      </button>
    </div>
  )
}
