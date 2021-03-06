'use strict'
const path = require('path')

const production = process.env.NODE_ENV === 'production'

const babelPlugins = ['insert-css-module']
const babelProdPlugins = babelPlugins.concat(
  ['transform-react-constant-elements', 'transform-react-inline-elements']
)

const config = {
  debug: !production,
  devtool: production ? '' : 'source-map',
  entry: {
    js: ['babel-polyfill', './app/index'],
    html: './app/index.html',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel?' + JSON.stringify({
            presets: [
              require.resolve('babel-preset-react'),
              require.resolve('babel-preset-es2015'),
              require.resolve('babel-preset-stage-2'),
            ],
            plugins: production
              ? babelProdPlugins
              : babelPlugins,
          }),
         'ts?transpileOnly',
       ],
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
    modulesDirectories: ['node_modules', path.resolve('./node_modules')],
  },
}

if (production) {
  const webpack = require('webpack')

  config.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      test: /\.js$/,
    }),
  ]
}

module.exports = config
