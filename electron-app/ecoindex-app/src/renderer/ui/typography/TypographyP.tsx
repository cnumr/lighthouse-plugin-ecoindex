import { cn } from '@/renderer/lib/utils'

export function TypographyP({
    children,
    className,
}: {
    children: React.ReactElement | string
    className?: string
}) {
    return (
        <p className={cn(`leading-7 [&:not(:first-child)]:mt-6`, className)}>
            {children}
        </p>
    )
}
