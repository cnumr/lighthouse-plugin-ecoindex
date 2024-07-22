import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { FC, ReactNode } from 'react'

import { AlertCircle } from 'lucide-react'

interface ILayout {
    children?: ReactNode | string
    title: string
}

export const AlertBox: FC<ILayout> = ({ children, title }) => {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{children}</AlertDescription>
        </Alert>
    )
}
