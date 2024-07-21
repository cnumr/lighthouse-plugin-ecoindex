export function TypographyP({
    children,
}: {
    children: React.ReactElement | string
}) {
    return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
}
