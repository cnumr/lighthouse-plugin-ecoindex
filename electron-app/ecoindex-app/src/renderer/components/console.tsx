import { Bug, ClipboardCopy } from 'lucide-react'

import { Button } from '../ui/button'
import { FC } from 'react'
import { SimpleTooltip } from './simple-tooltip'
import { Textarea } from '../ui/textarea'
import { TypographyH3 } from '../ui/typography/TypographyH3'
import { useTranslation } from 'react-i18next'

interface ILayout {
    datasFromHost: any
    id?: string
    appReady?: boolean
    isFirstStart?: boolean
    isNodeInstalled?: boolean
    isLighthouseEcoindexPluginInstalled?: boolean
    isPuppeteerBrowserInstalled?: boolean
    isNodeVersionOK?: boolean
    workDir?: string
    homeDir?: string
    npmDir?: string
    puppeteerBrowserInstalled?: string
    userCanWrite?: boolean
}
export const ConsoleApp: FC<ILayout> = ({
    datasFromHost,
    id,
    appReady,
    isFirstStart,
    isNodeInstalled,
    isLighthouseEcoindexPluginInstalled,
    isPuppeteerBrowserInstalled,
    isNodeVersionOK,
    workDir,
    homeDir,
    npmDir,
    puppeteerBrowserInstalled,
    userCanWrite,
}) => {
    const copyToClipBoard = () => {
        navigator.clipboard.writeText(JSON.stringify(datasFromHost, null, 2))
    }
    const { t } = useTranslation()
    return (
        <details className="w-full rounded-lg border border-primary bg-card p-2 text-card-foreground shadow-sm [&_svg]:open:-rotate-180">
            <summary className="flex cursor-pointer list-none items-center gap-4 rounded-sm">
                <div>
                    <svg
                        className="rotate-0 transform text-primary transition-all duration-300"
                        fill="none"
                        height="20"
                        width="20"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div className="flex items-center text-sm text-primary">
                    <Bug className="mr-2 size-4" />
                    <div>{t('Show informations')}</div>
                </div>
            </summary>

            <div className="mt-4 flex w-full flex-col gap-4 first:w-fit">
                <TypographyH3>{t('Console')}</TypographyH3>
                <Textarea
                    id={id}
                    className="h-36 text-muted-foreground"
                    readOnly
                ></Textarea>
                <SimpleTooltip
                    tooltipContent={
                        <p>
                            {t('Copy application informations to clipboard.')}
                        </p>
                    }
                >
                    <Button
                        id="bt-report"
                        variant="default"
                        size="sm"
                        onClick={copyToClipBoard}
                        className="flex w-fit items-center"
                    >
                        <ClipboardCopy className="mr-2 size-4" />
                        {t('Copy datas')}
                    </Button>
                </SimpleTooltip>
                <pre className="ligatures-none flex overflow-auto bg-slate-800 text-sm leading-6 text-slate-50">
                    <code className="min-w-full flex-none p-5">
                        {JSON.stringify(datasFromHost, null, 2)}
                    </code>
                </pre>
                <TypographyH3>{t('Configuration datas')}</TypographyH3>
                <div className="flex w-full flex-col text-sm">
                    {appReady && (
                        <div>appReady: {appReady ? 'true' : 'false'}</div>
                    )}
                    {isFirstStart && (
                        <div>
                            isFirstStart: {isFirstStart ? 'true' : 'false'}
                        </div>
                    )}
                    {isNodeInstalled && (
                        <div>
                            isNodeInstalled:{' '}
                            {isNodeInstalled ? 'true' : 'false'}
                        </div>
                    )}
                    {isLighthouseEcoindexPluginInstalled && (
                        <div>
                            isLighthouseEcoindexPluginInstalled:{' '}
                            {isLighthouseEcoindexPluginInstalled
                                ? 'true'
                                : 'false'}
                        </div>
                    )}
                    {isPuppeteerBrowserInstalled && (
                        <div>
                            isPuppeteerBrowserInstalled:{' '}
                            {isPuppeteerBrowserInstalled ? 'true' : 'false'}
                        </div>
                    )}
                    {isNodeVersionOK && (
                        <div>
                            isNodeVersionOK:{' '}
                            {isNodeVersionOK ? 'true' : 'false'}
                        </div>
                    )}
                    {workDir && <div>workDir: {workDir}</div>}
                    {homeDir && <div>homeDir: {homeDir}</div>}
                    {npmDir && <div>npmDir: {npmDir}</div>}
                    {puppeteerBrowserInstalled && (
                        <div>PuppeteerBrowser: {puppeteerBrowserInstalled}</div>
                    )}
                    {userCanWrite && (
                        <div>
                            userCanWrite: {userCanWrite ? 'true' : 'false'}
                        </div>
                    )}
                </div>
            </div>
        </details>
        // <Card className="w-full border-primary">
        //     <CardHeader>
        //         <CardTitle>Console</CardTitle>
        //         <CardDescription>
        //             Here you cans see what is happenning hunder the hood...
        //         </CardDescription>
        //     </CardHeader>
        //     <CardContent className="flex flex-col gap-4">

        //     </CardContent>
        // </Card>
    )
}
