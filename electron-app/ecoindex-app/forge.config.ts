import * as path from 'node:path'

import { FuseV1Options, FuseVersion } from '@electron/fuses'

import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import { mainConfig } from './webpack.main.config'
import packageJson from './package.json'
import { rendererConfig } from './webpack.renderer.config'

const { version } = packageJson

const config: ForgeConfig = {
    packagerConfig: {
        executableName:
            process.platform === 'linux'
                ? 'ecoindex-lighthouse'
                : 'EcoindexLighthouse',
        appBundleId: 'io.greenit.ecoindex-ligthouse',
        appCategoryType: 'public.app-category.developer-tools',
        appCopyright: 'Copyright 2024-2030 Green IT',
        darwinDarkModeSupport: true,
        asar: true,
        icon: path.resolve(__dirname, 'assets', 'app-ico'),
        extraResource: ['./src/extraResources/scripts', './src/locales'],
        win32metadata: {
            CompanyName: 'Green IT',
            OriginalFilename: 'EcoindexLighthouse',
        },
        osxSign: {
            optionsForFile: (filePath) => {
                // Here, we keep it simple and return a single entitlements.plist file.
                // You can use this callback to map different sets of entitlements
                // to specific files in your packaged app.
                return {
                    entitlements: './assets/default.darwin.plist',
                    hardenedRuntime: true,
                }
            },
            identity: 'Developer ID Application: Renaud Héluin (ARQGHNC9UG)',
        },
        osxNotarize: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            appleId: process.env.APPLE_ID,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            appleIdPassword: process.env.APPLE_PASSWORD,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            teamId: process.env.APPLE_TEAM_ID,
        },
    },
    rebuildConfig: {},
    makers: [
        new MakerRpm(
            {
                options: {
                    homepage:
                        'https://github.com/cnumr/lighthouse-plugin-ecoindex',
                },
            },
            ['linux']
        ),
        new MakerZIP({}, ['darwin', 'linux', 'win32']),
        new MakerDMG(
            {
                format: 'ULFO',
                background: path.resolve(__dirname, 'assets', 'dmgbg.png'),
                icon: path.resolve(__dirname, 'assets', 'app-ico.icns'),
                overwrite: true,
            },
            ['darwin']
        ),
        {
            name: '@electron-forge/maker-squirrel',
            platforms: ['win32'],
            config: (arch: string) => {
                return {
                    setupExe: `EcoindexLighthouse-win32-${arch}-${version} Setup.exe`,
                    setupIcon: path.resolve(__dirname, 'assets', 'app-ico.ico'),
                    // certificateFile: './cert.pfx',
                    // certificatePassword: process.env.CERTIFICATE_PASSWORD,
                    authors: 'Renaud Heluin',
                    description:
                        'An application to measure the ecological impact of a website with LightHouse and Ecoindex.',
                    language: 1033,
                    name: `EcoindexLighthouse`,
                }
            },
        },
        new MakerDeb(
            {
                options: {
                    categories: ['Utility'],
                    maintainer: 'Renaud Héluin',
                    homepage:
                        'https://github.com/cnumr/lighthouse-plugin-ecoindex',
                },
            },
            ['linux']
        ),
        // {
        //     name: '@electron-forge/maker-deb',
        //     config: {
        //         options: {
        //             maintainer: 'Renaud Héluin',
        //             homepage: 'https://asso.greenit.fr',
        //         },
        //     },
        // },
    ],
    publishers: [],
    plugins: [
        // new AutoUnpackNativesPlugin({}),
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        html: './src/renderer/MainWindow/index.html',
                        js: './src/renderer/MainWindow/renderer.ts',
                        name: 'main_window',
                        preload: {
                            js: './src/renderer/MainWindow/preload.ts',
                        },
                    },
                    {
                        html: './src/renderer/HelloWindow/index.html',
                        js: './src/renderer/HelloWindow/renderer.ts',
                        name: 'hello_window',
                        preload: {
                            js: './src/renderer/HelloWindow/preload.ts',
                        },
                    },
                ],
            },
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
}

export default config
