export const Header = () => {
    return (
        <div className="flex items-center gap-4 py-4">
            <div className="logo-ecoindex">
                {/* <img width="100" alt="icon" src={icon} className="bg-slate-400" /> */}
                <span className="logo-ecoindex logo-ecoindex__eco">eco</span>
                <span className="logo-ecoindex logo-ecoindex__index">
                    Index
                </span>
            </div>
            <h1 className="pt-1">Measures launcher 👋</h1>
        </div>
    )
}
