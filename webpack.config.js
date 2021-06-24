const path = require('path')
const webpack = require('webpack')
const fg = require('fast-glob')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { version, name, description } = require('./package.json')

module.exports = (env) => {
  const isDevMode = env.NODE_ENV === 'development'
  const portParameter = process.argv.find((i) => i.startsWith('--p=') || i.startsWith('--port='))
  let port = 5000
  if (portParameter) {
    // eslint-disable-next-line prefer-destructuring
    port = portParameter.split('=')[1]
  }
  const contentScripts = {
    'content_scripts/steam-main': './content_scripts/steam-main.js',
    'content_scripts/steam-game-detail': './content_scripts/steam-game-detail.js',
    'content_scripts/steam-explore-new': './content_scripts/steam-explore-new.js',
    'content_scripts/steam-genre': './content_scripts/steam-genre.js',
    'content_scripts/steam-tags': './content_scripts/steam-tags.js',
    'content_scripts/steam-community-recommendations':
      './content_scripts/steam-community-recommendations.js',
    'content_scripts/steam-friend-activity': './content_scripts/steam-friend-activity.js',
    'content_scripts/steam-specials': './content_scripts/steam-specials.js',
    'content_scripts/steam-curators': './content_scripts/steam-curators.js',
    'content_scripts/steam-followed-games': './content_scripts/steam-followed-games.js',
    'content_scripts/steam-user-games': './content_scripts/steam-user-games.js',
    'content_scripts/steam-bundle': './content_scripts/steam-bundle.js',
    'content_scripts/steam-search': './content_scripts/steam-search.js',
    'content_scripts/steam-wishlist': './content_scripts/steam-wishlist.js',
    'content_scripts/steam-recommender': './content_scripts/steam-recommender.js',
    'content_scripts/steam-franchise': './content_scripts/steam-franchise.js',
    'content_scripts/steam-goldenweek': './content_scripts/steam-goldenweek.js',
    'content_scripts/steam-summersale2021-genre':
      './content_scripts/steam-summersale2021-genre.js'
  }
  const config = {
    devtool: isDevMode ? 'eval-source-map' : false,
    context: path.resolve(__dirname, './src'),
    entry: {
      options: './options/index.js',
      popup: './popup/index.js',
      list: './list/index.js',
      background: './background/index.js',
      ...contentScripts
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: './',
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            extractCSS: !isDevMode
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/
        },
        {
          test: /\.scss$/,
          use: [
            isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.sass$/,
          use: [
            isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader?indentedSyntax'
          ]
        },
        {
          test: /\.styl$/,
          use: [
            isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'stylus-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]',
            esModule: false
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          loader: 'file-loader',
          options: {
            publicPath: './assets/fonts/',
            outputPath: './assets/fonts/'
          }
        }
      ]
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.runtime.esm.js'
      }
      // extensions: ['.js'],
    },
    plugins: [
      new VueLoaderPlugin(),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'assets', to: 'assets' },
          {
            from: '_locales',
            to: '_locales',
            transform(content) {
              return JSON.stringify(JSON.parse(content))
            }
          },
          {
            from: 'manifest.json',
            to: 'manifest.json',
            transform(content) {
              const manifest = JSON.parse(content)
              manifest.version = version
              if (isDevMode) {
                manifest.name = `${name} dev mode`
                manifest.description = `${description} dev mode`
              }
              return JSON.stringify(manifest)
            }
          }
        ]
      }),
      new HtmlWebpackPlugin({
        title: 'Options | Cloud Gaming Lister',
        template: './index.html',
        filename: 'options.html',
        chunks: ['options']
      }),
      new HtmlWebpackPlugin({
        title: 'Popup | Cloud Gaming Lister',
        template: './index.html',
        filename: 'popup.html',
        chunks: ['popup']
      }),
      new HtmlWebpackPlugin({
        title: 'Game List | Cloud Gaming Lister',
        template: './index.html',
        filename: 'list.html',
        chunks: ['list']
      })
    ]
  }
  if (isDevMode) {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new ExtensionReloader({
        port,
        reloadPage: true,
        entries: {
          contentScript: Object.keys(contentScripts),
          background: 'background',
          extensionPage: 'popup',
          list: 'list',
          options: 'options'
        }
      })
    )
  } else {
    config.plugins.push(
      new ScriptExtHtmlWebpackPlugin({
        async: [/runtime/],
        defaultAttribute: 'defer'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new PurgecssPlugin({
        paths: fg.sync([`./src/**/*`], {
          onlyFiles: true,
          absolute: true
        })
      }),
      new Dotenv({
        systemvars: true
      })
    )
  }
  return config
}
