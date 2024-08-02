import * as path from 'node:path'

import { FuseV1Options, FuseVersion } from '@electron/fuses'

import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
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
        asar: true,
        icon: path.resolve(__dirname, 'assets', 'app-ico'),
        extraResource: ['./src/extraResources/scripts'],
        osxSign: {
            // optionsForFile: (filePath) => {
            //     // Here, we keep it simple and return a single entitlements.plist file.
            //     // You can use this callback to map different sets of entitlements
            //     // to specific files in your packaged app.
            //     return {
            //         entitlements: './assets/default.darwin.plist',
            //     }
            // },
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
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin', 'linux', 'win32'],
            config: {},
        },
        {
            name: '@electron-forge/maker-dmg',
            platforms: ['darwin'],
            config: {
                // background: './assets/dmg-background.png',
                format: 'ULFO',
            },
        },
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
                        'An application to mesure the ecological impact of a website with LightHouse and Ecoindex.',
                    language: 1033,
                    name: `EcoindexLighthouse`,
                }
            },
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                options: {
                    maintainer: 'Renaud Héluin',
                    homepage: 'https://asso.greenit.fr',
                },
            },
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'cnumr',
                    name: 'lighthouse-plugin-ecoindex',
                },
                tagPrefix: 'electron-v',
                // prerelease: true,
            },
        },
    ],
    plugins: [
        new AutoUnpackNativesPlugin({}),
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        // html: './src/renderer/index.html',
                        html: './src/renderer/index.html',
                        // js: './src/renderer/renderer.ts',
                        js: './src/renderer/renderer.ts',
                        name: 'main_window',
                        preload: {
                            js: './src/main/preload.ts',
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
