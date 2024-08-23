/**
 * Object used to transport datas from `Back` to `Front`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ConfigData {
    static WORKDIR = 'workDir'
    static HOMEDIR = 'homeDir'
    static NPMDIR = 'npmDir'
    static APP_READY = 'appReady'
    static PLUGIN_INSTALLED = 'plugin_installed'
    static PLUGIN_VERSION = 'plugin_version'
    static NODE_INSTALLED = 'node_installed'
    static NODE_VERSION_IS_OK = 'node_version_is_ok'
    static PUPPETEER_BROWSER_INSTALLED = 'puppeteer_browser_installed'
    static PUPPETEER_BROWSER_INSTALLATION = 'puppeteer_browser_installation'
    static APP_CAN_NOT_BE_LAUNCHED = 'app_can_not_be_launched'
    /**
     * The type of the content.
     */
    readonly type: string
    /**
     * The result if success.
     */
    result?: object | string | boolean
    /**
     * The error if fail.
     */
    error?: any
    /**
     * A message if needed.
     */
    message?: string

    /**
     * Constructor
     * @param type string
     */
    constructor(
        type:
            | 'workDir'
            | 'homeDir'
            | 'npmDir'
            | 'appReady'
            | 'plugin_installed'
            | 'plugin_version'
            | 'node_installed'
            | 'node_version_is_ok'
            | 'puppeteer_browser_installed'
            | 'puppeteer_browser_installation'
            | 'app_can_not_be_launched'
    ) {
        this.type = type
    }
    /**
     * Return a string representation of the object
     * @returns ConfigData object in string format.
     */
    toString(): string {
        const output: ConfigData = { type: this.type }
        if (this.result)
            output.result =
                typeof this.result === 'string'
                    ? this.result
                    : JSON.stringify(this.result)
        output.message =
            typeof this.message === 'string'
                ? this.message
                : JSON.stringify(this.message)
        if (this.error)
            output.error =
                typeof this.error === 'string'
                    ? this.error
                    : (this.error as Error).message
        return JSON.stringify(output, null, 2)
    }
}