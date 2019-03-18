const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

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
      title: 'Single Landing Page WebApp',
      template: 'src/index.html'
    }),
    new WebpackPwaManifest({
      name: 'Sarp IŞIK Portfolio',
      short_name: 'Portfolio',
      description: 'Junior Frontend Developer Portfolio',
      background_color: '#ffffff'
    })
  ]
}
