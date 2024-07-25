import { FC, ReactNode } from 'react'

import { cn } from '../lib/utils'

export interface ILayout {
    children: ReactNode
    visible?: boolean
    id?: string
}
export const PopinLoading: FC<ILayout> = ({ id, children, visible = true }) => {
    return (
        <div
            id={id}
            className={cn('absolute left-0 top-0 z-10 h-screen w-screen', {
                hidden: !visible,
            })}
        >
            <div className="bg-background absolute h-full w-full opacity-70"></div>
            <div className="absolute grid h-full w-full place-content-center">
                <div className="border-primary !text-primary shadow-primary/50 bg-background flex items-center rounded-md border px-4 py-3 font-black shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    )
}
