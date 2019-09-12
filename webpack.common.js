const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader', options: { outputPath: 'fonts/' } }]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'images/' }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Tetris',
      template: 'src/index.html'
    }),
    new WebpackPwaManifest({
      name: 'Tetris Game App',
      short_name: 'Tetris',
      description: 'Tetris game application built on javascript by Sarp IŞIK',
      background_color: '#145fff'
    }),
    new CopyPlugin([{ from: './assets/favicon', to: 'favicon/' }])
  ]
};
