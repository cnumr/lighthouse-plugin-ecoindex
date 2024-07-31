import { Bug, ClipboardCopy } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'

import { Button } from '../ui/button'
import { FC } from 'react'
import { SimpleTooltip } from './simple-tooltip'
import { Textarea } from '../ui/textarea'
import { TypographyH2 } from '../ui/typography/TypographyH2'
import { TypographyH3 } from '../ui/typography/TypographyH3'

interface ILayout {
    datasFromHost: any
    id?: string
}
export const ConsoleApp: FC<ILayout> = ({ datasFromHost, id }) => {
    const copyToClipBoard = () => {
        navigator.clipboard.writeText(JSON.stringify(datasFromHost, null, 2))
    }
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
                    <div>Show informations</div>
                </div>
            </summary>

            <div className="mt-4 flex w-full flex-col gap-4 first:w-fit">
                <TypographyH3>Console</TypographyH3>
                <Textarea
                    id={id}
                    className="h-36 text-muted-foreground"
                    readOnly
                ></Textarea>
                <SimpleTooltip
                    tooltipContent={
                        <p>Copy application informations to clipboard.</p>
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
                        Copy datas
                    </Button>
                </SimpleTooltip>
                <pre className="ligatures-none flex overflow-auto bg-slate-800 text-sm leading-6 text-slate-50">
                    <code className="min-w-full flex-none p-5">
                        {JSON.stringify(datasFromHost, null, 2)}
                    </code>
                </pre>
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
