import { FC, ReactNode, useEffect, useState } from 'react'

import { cn } from '../lib/utils'

export interface ILayout {
    children: ReactNode
    visible: boolean
}

export const AlertBox: FC<ILayout> = ({ children, visible = false }) => {
    return (
        <div
            className={cn(
                'col-span-3 rounded-xl bg-ecoindex-green-200 p-4 text-ecoindex-green-950 shadow-md',
                { hidden: !visible }
            )}
        >
            <div className="inline-flex items-start">
                <div className="flex items-center gap-3">
                    <div>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border-ecoindex-green bg-ecoindex-green-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 text-ecoindex-green-100"
                            >
                                <path d="M10.618 10.26c-.361.223-.618.598-.618 1.022 0 .226-.142.43-.36.49A6.006 6.006 0 0 1 8 12c-.569 0-1.12-.08-1.64-.227a.504.504 0 0 1-.36-.491c0-.424-.257-.799-.618-1.021a5 5 0 1 1 5.235 0ZM6.867 13.415a.75.75 0 1 0-.225 1.483 9.065 9.065 0 0 0 2.716 0 .75.75 0 1 0-.225-1.483 7.563 7.563 0 0 1-2.266 0Z"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="text-color flex items-center gap-2 font-semibold">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
