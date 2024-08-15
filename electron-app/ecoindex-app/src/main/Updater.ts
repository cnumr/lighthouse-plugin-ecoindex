/*
 * Copyright 2018 forCandies <work@forcandies.com> (http://forcandies.com)
 *
 * ISC License
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose with or without fee is hereby granted, provided
 * that the above copyright notice and this permission notice appear
 * in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
 * WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 * THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
 * NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import { app, autoUpdater, dialog } from 'electron'

import { format } from 'util'
import i18n from '../configs/i18next.config'
import log from 'electron-log/main'
import os from 'node:os'
import pkg from '../../package.json'

log.initialize()
const updaterLog = log.scope('main/Updater')

let IS_PROD = process.env.NODE_ENV === 'production'

let version = app.getVersion()

// eslint-disable-next-line no-constant-condition
if (false) {
    IS_PROD = true
    version = '1.3.8'
}

/**
 *
 */
class Updater {
    /**
     * @type {Updater}
     */
    private static instance: Updater = new Updater()

    /**
     * @type {boolean}
     */
    private isSilentMode = true

    /**
     *
     */
    constructor() {
        if (Updater.instance) {
            throw new Error(
                'Error: Instantiation failed: Use Updater.getInstance() instead of new.'
            )
        }

        // https://github.com/cnumr/lighthouse-plugin-ecoindex/releases.atom
        updaterLog.debug(`IS_PROD`, IS_PROD)
        if (IS_PROD) {
            let _arch = ''
            if (os.platform() === 'darwin') {
                _arch = 'x64'
            } else _arch = os.arch()
            const feedUrl = `https://update.electronjs.org/cnumr/lighthouse-plugin-ecoindex/${process.platform}-${_arch}/${version}`
            // const feedUrl = `https://update.electronjs.org/cnumr/lighthouse-plugin-ecoindex/${process.platform}-${os.arch()}/${app.getVersion()}`
            const userAgent = format(
                '%s/%s (%s: %s)',
                pkg.productName,
                version,
                os.platform(),
                _arch
            )

            updaterLog.log('feedUrl', feedUrl)
            updaterLog.log('userAgent', userAgent)

            autoUpdater.setFeedURL({
                url: feedUrl,
                headers: { 'User-Agent': userAgent },
            })
            this.create()
        } else {
            updaterLog.debug('Auto-Updater disabled (dev-mode)')
        }

        Updater.instance = this
    }

    /**
     * @param {boolean} isSilentMode
     */
    public checkForUpdates(isSilentMode = true): void {
        if (!IS_PROD) {
            return
        }

        this.isSilentMode = isSilentMode
        updaterLog.debug(`checkForUpdates (isSilentMode)`, isSilentMode)
        autoUpdater.checkForUpdates()
    }

    /**
     *
     */
    protected create(): void {
        autoUpdater.on('error', this.onError.bind(this))
        autoUpdater.on(
            'checking-for-update',
            this.onCheckingOnUpdate.bind(this)
        )
        autoUpdater.on('update-available', this.onUpdateAvailable.bind(this))
        autoUpdater.on(
            'update-not-available',
            this.onUpdateNotAvailable.bind(this)
        )
        autoUpdater.on('update-downloaded', this.onUpdateDownloaded.bind(this))

        setInterval(() => this.checkForUpdates(), 60 * 60 * 1000)
    }

    /**
     * @param {Error} error
     */
    protected onError(error: Error): void {
        updaterLog.error('updater error')
        updaterLog.error(error)
    }

    /**
     *
     */
    protected onCheckingOnUpdate(): void {
        updaterLog.log('checking-for-update')
    }

    /**
     *
     */
    protected onUpdateAvailable(): void {
        if (!this.isSilentMode) {
            dialog.showMessageBox({
                type: 'info',
                message: i18n.t('A new version of EcoindexApp is available!'),
                detail: i18n.t(
                    'The new version is being downloaded in the background. Once it is downloaded, you will be notified.'
                ),
            })
        }

        updaterLog.log('update-available; downloading...')
    }

    /**
     *
     */
    protected onUpdateNotAvailable(): void {
        if (!this.isSilentMode) {
            dialog.showMessageBox({
                type: 'info',
                message: i18n.t('You’re up-to-date!'),
                detail: i18n.t(
                    `EcoindexApp {{version}} is currently the newest version available.`,
                    { version }
                ),
            })
        }

        updaterLog.log('update-not-available')
    }

    /**
     * @param {Event} _
     * @param {string} releaseNotes
     * @param {string} releaseName
     * @param {Date} _releaseDate
     * @param {String} _updateURL
     */
    protected onUpdateDownloaded(
        _: Event,
        releaseNotes: string,
        releaseName: string,
        _releaseDate: Date,
        _updateURL: string
    ): void {
        updaterLog.log('update-downloaded', {
            releaseName,
            _releaseDate,
            _updateURL,
            releaseNotes,
        })

        const options = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: i18n.t('Application Update'),
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: i18n.t(
                'A new version has been downloaded. Restart the application to apply the updates.'
            ),
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dialog.showMessageBox(options, (response: any) => {
            if (response === 0) {
                autoUpdater.quitAndInstall()
            }
        })
    }

    /**
     * @returns {Updater}
     */
    public static getInstance(): Updater {
        return Updater.instance
    }
}

export default Updater
