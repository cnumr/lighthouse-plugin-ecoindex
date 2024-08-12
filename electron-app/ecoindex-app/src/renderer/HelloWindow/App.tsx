import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Button } from '../ui/button'
import { DarkModeSwitcher } from '../components/dark-mode-switcher'
import { Header } from '../components/Header'
import i18nResources from '../../configs/i18nResources'
import log from 'electron-log/renderer'
import pkg from '../../../package.json'
import { useTranslation } from 'react-i18next'

const frontLog = log.scope('front/HelloApp')

function HelloApp() {
    const [language, setLanguage] = useState('en')
    const closeHandler = () => {
        window.close()
    }

    useEffect(() => {
        /**
         * Handler (main->front), Change language from Menu.
         */
        window.electronAPI.changeLanguageInFront((lng: string) => {
            frontLog.debug(`changeLanguageInFront`, lng)
            setLanguage(lng)
            try {
                i18nResources.changeLanguage(lng, (err, t) => {
                    if (err)
                        return frontLog.log('something went wrong loading', err)
                    t('key') // -> same as i18next.t
                })
            } catch (error) {
                frontLog.error(error)
            }
        })
    }, [])

    const { t } = useTranslation()
    return (
        <div className="relative flex flex-col items-center justify-center gap-4 p-8">
            <DarkModeSwitcher visible={false} />
            <Header />
            <div className="prose mx-auto !max-w-max dark:prose-invert prose-headings:underline">
                <p className="text-sm italic">
                    {t(
                        'You can change the application language in the menu, Language.'
                    )}
                </p>
                {language === 'en' ? (
                    <>
                        <p>
                            This desktop application allows you to perform
                            measurements as on the{' '}
                            <a
                                href="https://econindex.fr/"
                                target="_blank"
                                className="underline"
                            >
                                econindex.fr
                            </a>{' '}
                            website, but also having the{' '}
                            <strong>lighthouse</strong> measurements, in one and
                            the same report, without limitation 🎉
                        </p>
                        <h2>Key features</h2>
                        <p>
                            You can either measure{' '}
                            <strong>a series of URLs</strong>, or measure{' '}
                            <strong>entire visit paths</strong>.
                            <br />
                            This version of ecoindex provides stable, consistent
                            measurements with{' '}
                            <a
                                href="https://econindex.fr/"
                                target="_blank"
                                className="underline"
                            >
                                econindex.fr
                            </a>{' '}
                            or{' '}
                            <code
                                title="python tool for use on the command line, in the terminal."
                                className="border-b border-dashed border-primary"
                            >
                                ecoindex-cli
                            </code>
                            .<br />
                            Browser cache management ensures{' '}
                            <strong>realistic</strong> measurements.
                        </p>
                        <p>With this application, you'll get :</p>
                        <ul>
                            <li>
                                <strong>Simple measurements:</strong>
                                <ul>
                                    <li>
                                        An HTML Lighthouse report with the
                                        ecoindex and its best practices.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>Route measurements:</strong>
                                <ul>
                                    <li>
                                        HTML, JSON Lighthouse reports with
                                        ecoindex and best practices, plus
                                        pre-filled environmental declaration ;
                                    </li>
                                    <li>
                                        A configuration file, saved in the
                                        measurements folder, will enable you to
                                        re-run the measurements as many times as
                                        you like, and thus get a trend of the
                                        environmental performance of this
                                        site/functional units.
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <h2>Important information</h2>
                        <p>
                            This application will require addons that need to be
                            installed only the first time:
                        </p>
                        <ul>
                            <li>NodeJS (the application's engine) ;</li>
                            <li>
                                Lighthouse ecoindex plugin, which drives the
                                measurement.
                            </li>
                        </ul>
                        <p>
                            <strong>
                                Don't worry, we'll guide you through 🙏
                            </strong>
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            Cette application de bureau vous permet d'effectuer
                            mesures comme sur le site{' '}
                            <a
                                href="https://econindex.fr/"
                                target="_blank"
                                className="underline"
                            >
                                econindex.fr
                            </a>{' '}
                            , mais aussi d'avoir les mesures de{' '}
                            <strong>lighthouse</strong>, dans un seul et même
                            rapport, sans limitation. 🎉
                        </p>
                        <h2>Informations clés</h2>
                        <p>
                            Vous pouvez soit mesurer{' '}
                            <strong>une série d'URLs</strong>, ou des{' '}
                            <strong>parcours de visite entiers</strong>.
                            <br />
                            Cette version d'ecoindex fournit des mesures stables
                            et cohérentes comme avec{' '}
                            <a
                                href="https://econindex.fr/"
                                target="_blank"
                                className="underline"
                            >
                                econindex.fr
                            </a>{' '}
                            ou{' '}
                            <code
                                title="outil en python qui s'utilise en ligne de commande, dans le terminal."
                                className="border-b border-dashed border-primary"
                            >
                                ecoindex-cli
                            </code>
                            .<br />
                            La gestion du cache du navigateur garantit des
                            mesures <strong>réalistes</strong>
                        </p>
                        <p>Avec cette application, vous obtiendrez :</p>
                        <ul>
                            <li>
                                <strong>Mesures simples :</strong>
                                <ul>
                                    <li>
                                        Un rapport HTML Lighthouse avec
                                        l'écoindex et ses bonnes pratiques.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>Mesures de parcours :</strong>
                                <ul>
                                    <li>
                                        Les rapports de Lighthouse en HTML ou
                                        JSON avec l'ecoindex, ses bonnes
                                        pratiques et la génération de la
                                        déclaration environnementale,
                                        pré-remplie.
                                    </li>
                                    <li>
                                        Un fichier de configuration, enregistré
                                        dans le dossier des mesures, vous
                                        permettra de relancer les mesures autant
                                        de fois que vous le souhaitez, et
                                        d'obtenir ainsi une tendance de la
                                        performance environnementale de ce site
                                        / de cette unité fonctionnelle.
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <h2>Information importante</h2>
                        <p>
                            Cette application nécessite des modules
                            complémentaires qui ne doivent être installés que la
                            première fois :
                        </p>
                        <ul>
                            <li>NodeJS (le moteur de l'application) ;</li>
                            <li>
                                Plugin Lighthouse ecoindex, qui pilote la
                                mesure.
                            </li>
                        </ul>
                        <p>
                            <strong>
                                Ne vous inquiétez pas, nous vous guiderons pas à
                                pas 🙏
                            </strong>
                        </p>
                    </>
                )}
            </div>
            <div className="grid place-items-center">
                <Button
                    onClick={closeHandler}
                    id="close-window"
                    size="default"
                    variant="default"
                    className="mt-8 w-fit"
                    title={t('Close this window')}
                >
                    {t('Close')}
                </Button>
            </div>
            <div className="prose prose-sm text-center font-semibold dark:prose-invert">
                {t('Version of the application')}: {pkg.version}
            </div>
        </div>
    )
}

export default function Hello() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HelloApp />} />
            </Routes>
        </Router>
    )
}
