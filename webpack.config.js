const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = {
    source: path.resolve(__dirname, 'src'),
    es5: path.resolve(__dirname, 'dist', 'es5'),
    esm: path.resolve(__dirname, 'dist', 'esm'),
};

module.exports = {
    entry: {
        'rrule-from-custom-template': path.join(paths.source, 'index.ts'),
        'rrule-from-custom-template.min': path.join(paths.source, 'index.ts'),
    },
    output: {
        filename: '[name].js',
        path: paths.es5,
        library: 'rrule-from-custom-template',
        libraryTarget: 'umd',
        globalObject: "typeof self !== 'undefined' ? self : this",
    },
    devtool: 'source-map',
    mode: 'production',
    resolve: {
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                loader: 'ts-loader',
                test: /\.ts$/,
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                exclude: /\.ts$/,
                include: /\.min\.js$/,
            }),
        ],
    },
    externals: {
        rrule: 'rrule'
    },
};
