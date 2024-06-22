import { FC, ReactNode } from 'react'

import { cn } from '../../shared/tailwind-helper'

export interface ILayout {
  children: ReactNode
  visible?: boolean
  id?: string
}
export const PopinLoading: FC<ILayout> = ({ id, children, visible = true }) => {
  return (
    <div
      id={id}
      className={cn('h-screen w-screen absolute top-0 left-0 z-10', {
        hidden: !visible,
      })}
    >
      <div className="w-full h-full absolute bg-white opacity-70"></div>
      <div className="w-full h-full absolute grid place-content-center">
        <div className=" px-4 py-3 bg-ecoindex-green shadow-lg shadow-ecoindex-green-200 rounded-full !text-ecoindex-green-50 font-black">
          {children}
        </div>
      </div>
    </div>
  )
}
