import { Route, MemoryRouter as Router, Routes } from 'react-router-dom'

import { Button } from '../ui/button'
import { Header } from '../components/Header'
import { TypographyH2 } from '../ui/typography/TypographyH2'
import { TypographyList } from '../ui/typography/TypographyList'
import { TypographyP } from '../ui/typography/TypographyP'

function HelloApp() {
    const closeHandler = () => {
        window.close()
    }
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Header />
            <div className="mx-auto flex flex-col items-center justify-center gap-4 *:!my-0 *:w-full">
                <TypographyP>
                    Cette application desktop vous permet de réaliser des
                    mesures comme sur le site{' '}
                    <a
                        href="https://econindex.fr/"
                        target="_blank"
                        className="underline"
                    >
                        econindex.fr
                    </a>
                    , mais en ayant aussi les mesures de{' '}
                    <strong>lighthouse</strong>, dans un seul et même rapport,
                    sans limitation 🎉
                </TypographyP>
                <TypographyH2>Principales caractéristiques</TypographyH2>
                <TypographyP>
                    Vous pourrez soit mesurer <strong>une serie d'URL</strong>,
                    soit mesurer <strong>des parcours de visites entier</strong>
                    .
                    <br />
                    Cette version d'écoindex,{' '}
                    <strong>
                        réalise des mesures stables et cohérentes avec les
                        mesures d'
                        <a
                            href="https://econindex.fr/"
                            target="_blank"
                            className="underline"
                        >
                            econindex.fr
                        </a>{' '}
                        ou{' '}
                        <code
                            title="outil en python a utiliser en ligne de command, dans le
                    terminal."
                            className="border-b border-dashed border-primary"
                        >
                            ecoindex-cli
                        </code>
                    </strong>
                    .
                    <br />
                    La gestion du cache navigateur permet d'avoir des mesures{' '}
                    <strong>réalistes</strong>.<br />
                    Avec cette application, vous obtiendrez :
                </TypographyP>
                <TypographyList className="ml-12 [&>li]:mt-0 [&_ul]:ml-8 [&_ul]:list-disc">
                    <li>
                        <strong>Mesures simple</strong> : Un rapport HTML
                        Lighthouse avec l'écoindex et ses bonnes pratiques ;
                    </li>
                    <li>
                        <strong>Mesures de parcours</strong> :
                        <ul>
                            <li>
                                Des rapports HTML, JSON Lighthouse avec
                                l'écoindex et ses bonnes pratiques, ainsi que la
                                déclaration environnementale préremplie.
                            </li>
                            <li>
                                Un fichier de configuration, sauvegardée dans le
                                dossier de mesures, vous permettra de relancer
                                autant de fois les mesures et ainsi avoir la
                                tendance des performances environnementale de ce
                                site/unités fonctionnelles.
                            </li>
                        </ul>
                    </li>
                </TypographyList>
                <TypographyH2>Informations</TypographyH2>
                <TypographyP>
                    Cette application nécessitera des addons qui ne devront être
                    installés que la première fois :
                </TypographyP>
                <TypographyList className="ml-12 [&>li]:mt-0">
                    <li>NodeJS (qui est le moteur de l'application) ;</li>
                    <li>
                        Le plugin Lighthouse ecoindex, qui pilote la mesure.
                    </li>
                </TypographyList>
                <TypographyP>
                    <strong>Ne vous inquitez pas, vous serez guider 🙏</strong>
                </TypographyP>
                <div className="grid place-items-center">
                    <Button
                        onClick={closeHandler}
                        id="close-window"
                        size="sm"
                        variant="default"
                        className="mt-8 w-fit"
                    >
                        Fermer
                    </Button>
                </div>
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
