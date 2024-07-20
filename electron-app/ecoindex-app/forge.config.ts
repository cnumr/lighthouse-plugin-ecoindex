import * as path from 'node:path'

import { FuseV1Options, FuseVersion } from '@electron/fuses'

import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'

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
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
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