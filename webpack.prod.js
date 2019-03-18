const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const webpack = require('webpack')
// Workbox, info = https://webpack.js.org/guides/progressive-web-application
const WorkboxPlugin = require('workbox-webpack-plugin')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer()]
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
      // chunkFilename: '[id].css'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true
    }),
    new HtmlWebpackPartialsPlugin([
      {
        // Merge analytics html into index.html
        path: path.join(__dirname, './src/partials/analytics.html'),
        location: 'head',
        priority: 'high',
        options: {
          ga_property_id: 'UA-136431806-1'
        }
      }
    ])
  ]
})
