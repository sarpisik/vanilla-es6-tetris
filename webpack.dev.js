const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: { usedExports: true },
  devtool: 'inline-source-map', // map error to source
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    watchContentBase: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
})
