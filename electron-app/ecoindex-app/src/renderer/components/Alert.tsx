import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle, Bug, RocketIcon } from 'lucide-react'
import { FC, ReactNode } from 'react'

interface ILayout {
    children?: ReactNode | string
    variant?: 'destructive' | 'default' | 'bug'
    title: string
}

export const AlertBox: FC<ILayout> = ({
    children,
    title,
    variant = 'destructive',
}) => {
    let _variant: string
    if (variant === 'bug') {
        _variant = 'destructive'
    } else {
        _variant = variant
    }
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Alert variant={_variant} className="">
            {variant === 'destructive' && <AlertCircle className="size-4" />}
            {variant === 'default' && <RocketIcon className="size-4" />}
            {variant === 'bug' && <Bug className="size-4" />}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{children}</AlertDescription>
        </Alert>
    )
}
