import { FC, ReactNode, useEffect, useState } from 'react'

import { Progress } from '../ui/progress'
import { cn } from '../lib/utils'

export interface ILayout {
    children: ReactNode
    visible?: boolean
    id?: string
    progress: number
}
export const PopinLoading: FC<ILayout> = ({
    id,
    children,
    visible = true,
    progress,
}) => {
    return (
        <div
            id={id}
            className={cn('absolute left-0 top-0 z-10 h-screen w-screen', {
                hidden: !visible,
            })}
        >
            <div className="bg-background absolute h-full w-full opacity-70"></div>
            <div className="absolute grid h-full w-full place-content-center">
                <div className="border-primary shadow-primary/50 bg-background relative flex flex-col gap-2 rounded-md border px-4 py-3 shadow-lg">
                    <div className="!text-primary flex items-center font-black">
                        {children}
                    </div>
                    <Progress value={progress} className="h-2 w-full" />
                </div>
            </div>
        </div>
    )
}
