// webpack.config.js
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { router } = require('./src/config/router')

const entryData = {}
const htmlWebpackPluginData = []

router.forEach(item => {
  htmlWebpackPluginData.push(
    new HtmlWebpackPlugin({
      filename: `${item.title}.html`,
      template: item.path,
      chunks: [item, 'vendor']
    })
  )
  entryData[item.title] = item.jsPath
})

module.exports = {
  mode: 'development',
  entry: {
    ...entryData
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    ...htmlWebpackPluginData,
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin()
  ]
}
