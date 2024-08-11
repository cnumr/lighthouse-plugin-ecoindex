/**
 * TODO: Method to clean returned log from sh files
 * @param stout any
 * @returns any
 */
export const cleanLogString = (stout: string | any) => {
    if (typeof stout !== 'string') return stout
    // eslint-disable-next-line no-control-regex, no-useless-escape
    const gm = new RegExp(']2;(.*)]1; ?(\n?)', 'gm')
    if (stout.match(gm)) return stout.replace(gm, '')
    else return stout
}
