export function TypographyList({
    children,
}: {
    children: React.ReactElement | string
}) {
    return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
}
