import { FC, ReactNode } from 'react'

import { Progress } from '../ui/progress'

export interface ILayout {
    children: ReactNode
    id?: string
    progress: number
    showProgress?: boolean
}
export const PopinLoading: FC<ILayout> = ({
    id,
    children,
    progress,
    showProgress = false,
}) => {
    return (
        <div id={id} className="absolute left-0 top-0 z-10 h-screen w-screen">
            <div className="absolute h-full w-full bg-background opacity-70"></div>
            <div className="absolute grid h-full w-full place-content-center">
                <div className="relative flex flex-col gap-2 rounded-md border border-primary bg-background px-4 py-3 shadow-lg shadow-primary/50">
                    <div className="flex items-center font-black !text-primary">
                        {children}
                    </div>
                    {showProgress && (
                        <Progress value={progress} className="h-2 w-full" />
                    )}
                </div>
            </div>
        </div>
    )
}
