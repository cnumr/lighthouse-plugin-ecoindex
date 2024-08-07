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
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{t('2. Urls to mesure')}</CardTitle>
                <CardDescription>
                    {t('Simples mesures with HTML output.')}
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
                <CardTitle>{t('3. Launch the mesures')}</CardTitle>
                <CardDescription>
                    {t('Generates Html reports in seleted dir.')}
                </CardDescription>
                <Button
                    type="button"
                    id="btn-simple-mesures"
                    title={t('Launch the mesures')}
                    disabled={!appReady}
                    onClick={simpleMesures}
                    className="btn btn-green"
                >
                    {t('Mesures')}
                </Button>
            </CardFooter>
        </Card>
    )
}
