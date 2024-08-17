import { FC, ReactNode } from 'react'

import { Progress } from '../ui/progress'
import { cn } from '../../renderer/lib/utils'

export interface ILayout {
    children: ReactNode
    id?: string
    progress: number
    className?: string
    showProgress?: boolean
    footer?: ReactNode
}
export const PopinLoading: FC<ILayout> = ({
    id,
    children,
    progress,
    className,
    showProgress = false,
    footer,
}) => {
    return (
        <div id={id} className="absolute left-0 top-0 z-10 h-screen w-screen">
            <div className="absolute h-full w-full bg-background opacity-70"></div>
            <div className="absolute grid h-full w-full place-content-center">
                <div className="relative flex flex-col items-center gap-2 rounded-md border border-primary bg-background px-4 py-3 shadow-lg shadow-primary/50">
                    <div
                        className={cn(
                            'flex items-center font-black !text-primary',
                            className
                        )}
                    >
                        {children}
                    </div>
                    {showProgress && (
                        <Progress value={progress} className="h-2 w-full" />
                    )}
                    {footer}
                </div>
            </div>
        </div>
    )
}
