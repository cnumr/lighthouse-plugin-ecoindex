import { cn } from '@/renderer/lib/utils'

export function TypographyList({
    children,
    className,
}: {
    children?: React.ReactNode
    className?: string
}) {
    return (
        <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}>
            {children}
        </ul>
    )
}
