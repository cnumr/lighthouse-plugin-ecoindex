import { FC, ReactNode, useEffect, useState } from 'react'

import { cn } from '../../shared/tailwind-helper'

export interface ILayout {
  appReady: boolean
  className: string
}

export const JsonPanMesure: FC<ILayout> = ({ appReady, className }) => {
  return (
    <div className={className}>
      <h2>2. Configuration of the courses</h2>
    </div>
  )
}
