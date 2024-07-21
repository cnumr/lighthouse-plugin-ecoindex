// eslint-disable-next-line @typescript-eslint/no-var-requires, import/default
import CopyPlugin from 'copy-webpack-plugin'
import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import webpack from 'webpack'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: 'webpack-infrastructure',
    }),
    new webpack.EnvironmentPlugin({
        APPLE_ID: process.env.APPLE_ID,
        APPLE_PASSWORD: process.env.APPLE_PASSWORD,
        APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
    }),
    new CopyPlugin({
        patterns: [{ from: 'src/extraResources', to: '.' }],
    }),
]
