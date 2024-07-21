export function TypographyH3({
    children,
}: {
    children: React.ReactElement | string
}) {
    return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {children}
        </h3>
    )
}
