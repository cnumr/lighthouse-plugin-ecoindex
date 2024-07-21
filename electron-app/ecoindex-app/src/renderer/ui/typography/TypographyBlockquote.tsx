export function TypographyBlockquote({
    children,
}: {
    children: React.ReactElement | string
}) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
            {children}
        </blockquote>
    )
}
