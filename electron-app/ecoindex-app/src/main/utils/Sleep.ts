import { getMainLog } from '../main'
import { isDev } from '../../shared/memory'

/**
 * Utils, wait method.
 * @param ms number
 * @returns Promise<unknown>
 */
export async function sleep(ms: number) {
    const mainLog = getMainLog().scope('main')
    return new Promise((resolve) => {
        if (isDev()) mainLog.debug(`wait ${ms / 1000}s`)
        setTimeout(resolve, ms)
    })
}
