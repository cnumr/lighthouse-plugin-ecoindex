import type { Configuration } from 'webpack'
import { plugins } from './webpack.plugins'
import { rules } from './webpack.rules'
import webpack from 'webpack'

export const mainConfig: Configuration = {
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: './src/main/main.ts',
    // Put your normal webpack config below here
    module: {
        rules,
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            APPLE_ID: process.env.APPLE_ID,
            APPLE_PASSWORD: process.env.APPLE_PASSWORD,
            APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
        }),
    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    },
}
