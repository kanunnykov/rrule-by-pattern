const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = {
    source: path.resolve(__dirname, 'src'),
    demo: path.resolve(__dirname, 'demo'),
    demoDist: path.resolve(__dirname, 'dist', 'es5', 'demo'),
    es5: path.resolve(__dirname, 'dist', 'es5'),
    esm: path.resolve(__dirname, 'dist', 'esm'),
};

mainConfig = {
    entry: {
        'rrule-from-template': path.join(paths.source, 'index.ts'),
        'rrule-from-template.min': path.join(paths.source, 'index.ts'),
    },
    output: {
        filename: '[name].js',
        path: paths.es5,
        library: 'rrule-from-template',
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

demoConfig = {
    entry: {
        'demo': path.join(paths.demo, 'demo.ts'),
    },
    output: {
        filename: '[name].js',
        path: paths.demoDist,
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
