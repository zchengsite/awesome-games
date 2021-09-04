// webpack.config.js
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: { 
    main: ['./src/index.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Output Management',
      template: "./src/index.html"
    }),
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin()
  ]
}
