/**
 * Object used to transport datas from `Back` to `Front`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ConfigData {
    static WORKDIR = 'workDir'
    static HOMEDIR = 'homeDir'
    static NPMDIR = 'npmDir'
    static APP_READY = 'appReady'
    static PLUGINS_CAN_BE_INSTALLED = 'plugins_can_be_installed'
    static FIX_NPM_USER_RIGHTS = 'fix_npm_user_rights'
    static PLUGIN_INSTALLED = 'plugin_installed'
    static PLUGIN_VERSION = 'plugin_version'
    static NODE_INSTALLED = 'node_installed'
    static NODE_VERSION_IS_OK = 'node_version_is_ok'
    static PUPPETEER_BROWSER_INSTALLED = 'puppeteer_browser_installed'
    static PUPPETEER_BROWSER_INSTALLATION = 'puppeteer_browser_installation'
    static APP_CAN_NOT_BE_LAUNCHED = 'app_can_not_be_launched'
    static ERROR_TYPE_NO_NODE = 'error_type_no_node'
    static ERROR_TYPE_NO_WRITE_ACCESS = 'error_type_no_write_access'
    static ERROR_TYPE_CANT_FIX_USER_RIGHTS = 'error_type_cant_fix_user_rights'
    static ERROR_TYPE_FIRST_INSTALL = 'error_type_first_install'

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

    readonly errorType?: string

    /**
     * Constructor
     * @param {string} type type of ConfigData object.
     * @param {string} errorType type of error handle by ConfigData object.
     */
    constructor(
        type:
            | 'workDir'
            | 'homeDir'
            | 'npmDir'
            | 'appReady'
            | 'plugins_can_be_installed'
            | 'fix_npm_user_rights'
            | 'plugin_installed'
            | 'plugin_version'
            | 'node_installed'
            | 'node_version_is_ok'
            | 'puppeteer_browser_installed'
            | 'puppeteer_browser_installation'
            | 'app_can_not_be_launched',
        errorType?:
            | 'error_type_no_node'
            | 'error_type_no_write_access'
            | 'error_type_first_install'
            | 'error_type_cant_fix_user_rights'
    ) {
        this.type = type
        this.errorType = errorType
        if (errorType && type !== 'app_can_not_be_launched') {
            throw new Error(
                "`errorType `can't be used outside of `type` of `app_can_not_be_launched`."
            )
        }
    }
    /**
     * Return a string representation of the object
     * @returns ConfigData object in string format.
     */
    toString(): string {
        const output: ConfigData = {
            type: this.type,
        }
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
