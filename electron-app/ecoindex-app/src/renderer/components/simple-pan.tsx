import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'

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
        <Card className={className}>
            <CardHeader>
                <CardTitle>2. Urls to mesure</CardTitle>
                <CardDescription>
                    Simples mesures with HTML output.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SimpleUrlsList
                    urlsList={urlsList}
                    setUrlsList={setUrlsList}
                    visible={true}
                    language={language}
                    title=""
                />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
                <CardTitle>3. Launch the mesures</CardTitle>
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
            </CardFooter>
            {/* <TypographyH2>3. Launch the mesures</TypographyH2> */}
        </Card>
    )
}
