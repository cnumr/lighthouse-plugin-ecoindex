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

interface ILayout {
    datasFromHost: any
    id?: string
}
export const ConsoleApp: FC<ILayout> = ({ datasFromHost, id }) => {
    const copyToClipBoard = () => {
        navigator.clipboard.writeText(JSON.stringify(datasFromHost, null, 2))
    }
    return (
        <Card className="border-primary w-full">
            <CardHeader>
                <CardTitle>Console</CardTitle>
                <CardDescription>
                    Here you cans see what is happenning hunder the hood...
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Textarea
                    id={id}
                    className="text-muted-foreground h-36"
                    readOnly
                ></Textarea>
                <details className="bg-card text-card-foreground border-primary w-full rounded-lg border p-2 shadow-sm [&_svg]:open:-rotate-180">
                    <summary className="flex cursor-pointer list-none items-center gap-4 rounded-sm">
                        <div>
                            <svg
                                className="text-primary rotate-0 transform transition-all duration-300"
                                fill="none"
                                height="20"
                                width="20"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        <div className="text-primary flex items-center text-sm">
                            <Bug className="mr-2 size-4" />
                            <div>Display more datas...</div>
                        </div>
                    </summary>
                    <div className="mt-4 flex w-full flex-col gap-4 first:w-fit">
                        <SimpleTooltip
                            tooltipContent={
                                <p>
                                    Copy application informations to clipboard.
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
            </CardContent>
        </Card>
    )
}
