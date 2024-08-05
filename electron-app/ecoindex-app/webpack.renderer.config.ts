import type { Configuration } from 'webpack'
import path from 'path'
import { plugins } from './webpack.plugins'
import { resolveTsAliases } from 'resolve-ts-aliases'
import { rules } from './webpack.rules'

rules.push({
    test: /\.css$/,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'postcss-loader' },
    ],
})

export const rendererConfig: Configuration = {
    module: {
        rules,
    },
    plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        alias: {
            ...resolveTsAliases(path.resolve('tsconfig.json')),
            path: require.resolve('path-browserify'),
        },
    },
}
