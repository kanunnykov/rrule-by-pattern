const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const paths = {
    source: path.resolve(__dirname, 'src'),
    demo: path.resolve(__dirname, 'demo'),
    demoEs5: path.resolve(__dirname, 'demo', 'dist', 'es5'),
    es5: path.resolve(__dirname, 'dist', 'es5'),
    esm: path.resolve(__dirname, 'dist', 'esm'),
};

mainConfig = {
    entry: {
        'rruleByPattern': path.join(paths.source, 'index.ts'),
        'rruleByPattern.min': path.join(paths.source, 'index.ts'),
    },
    output: {
        filename: '[name].js',
        path: paths.es5,
        library: 'rruleByPattern',
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
            new TerserPlugin({
                exclude: /\.ts$/,
                include: /\.min\.js$/,
            }),
        ],
    },
    externals: {
        'rrule': 'rrule',
    },
};

demoConfig = {
    entry: {
        'demo': path.join(paths.demo, 'demo.ts'),
    },
    output: {
        filename: '[name].js',
        path: paths.demoEs5,
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
};

module.exports = [mainConfig, demoConfig];
