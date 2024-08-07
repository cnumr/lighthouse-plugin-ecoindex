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
    const [language, setLanguage] = useState('fr')
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
                        <h2>{t('Key features')}</h2>
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
                        <h2>{t('Key features')}</h2>
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
                {t("Version de l'application")}: {pkg.version}
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
