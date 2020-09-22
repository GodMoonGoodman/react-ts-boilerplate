const path = require('path')
const appIndex = path.resolve(__dirname, 'src', 'index.tsx')

const appBuild = path.resolve(__dirname, 'build')

const appPublic = path.resolve(__dirname, 'public')

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const appHtml = path.resolve(__dirname, 'public', 'index.html')

require('dotenv').config()
const webpack = require('webpack')

function getClientEnv(nodeEnv) {
  return {
    'process.env': JSON.stringify(
      Object.keys(process.env)
        .filter((key) => /^REACT_APP/i.test(key))
        .reduce(
          (env, key) => {
            env[key] = process.env[key]
            return env
          },
          { NODE_ENV: nodeEnv }
        )
    ),
  }
}

module.exports = (webpackEnv) => {
  const clientEnv = getClientEnv(webpackEnv)
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  return {
    mode: webpackEnv,
    entry: appIndex,
    output: {
      path: appBuild,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: isEnvDevelopment ? true : false,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: appHtml }),
      new webpack.DefinePlugin(clientEnv),
    ],
    devServer: {
      port: 3000,
      contentBase: appPublic,
      open: true,
      historyApiFallback: true,
      overlay: true,
    },
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
  }
}
