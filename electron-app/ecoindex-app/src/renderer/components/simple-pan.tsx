import { Button } from '../ui/button'
import { FC } from 'react'
import { SimpleUrlsList } from './simple-urls'
import { TypographyH2 } from '@/renderer/ui/typography/TypographyH2'

export interface ISimpleMesureLayout {
    appReady: boolean
    language: string
    simpleMesures: () => void
    urlsList: ISimpleUrlInput[]
    setUrlsList: (urlsList: ISimpleUrlInput[]) => void
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
            <TypographyH2>3. Launch the mesures</TypographyH2>
            <Button
                type="button"
                id="btn-simple-mesures"
                title="Launch the mesures"
                disabled={!appReady}
                onClick={simpleMesures}
                className="btn btn-green"
            >
                Mesures
            </Button>
        </div>
    )
}
