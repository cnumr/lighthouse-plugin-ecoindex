import iconAsso from '../../../assets/asso.svg'
export const Footer = ({ nodeVersion }: { nodeVersion: string }) => {
    return (
        <div className="text-center text-sm">
            <p className="text-xs">
                Host Informations : Node.js(
                {nodeVersion ? nodeVersion : 'loading...'})
            </p>
            <p className="text-xs">
                Internal Electron informations : Chrome (v
                {window.versions.chrome()}
                ), Node.js (v
                {window.versions.node()}), and Electron (v
                {window.versions.electron()})
            </p>
            <p className="mt-2">© 2024 - Made with ❤️ and 🌱 by</p>
            <p className="my-4 grid place-content-center">
                <a href="https://asso.greenit.fr">
                    <img
                        width="100"
                        alt="icon"
                        src={iconAsso}
                        className="bg-green-950"
                    />
                </a>
            </p>
        </div>
    )
}
