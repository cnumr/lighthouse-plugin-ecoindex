/**
 * Convert Version to string
 * @param version string
 * @returns string
 */
export const convertVersion = (version: string) => {
    return version.replace(/\./gm, '_').replace(/-/gm, '_')
}
