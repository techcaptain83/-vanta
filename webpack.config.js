const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const util = require('util')

const srcFiles = fs.readdirSync('./src')

let entries = {
  'gallery/gallery.min': './src/gallery.js',
}

// Compile vanta.xxxxx.js files
for (let i = 0; i < srcFiles.length; i++) {
  let file = srcFiles[i]
  if (file.indexOf('vanta') == 0) {
    let fileWithoutExtension = file.replace(/\.[^/.]+$/, "")
    entries['dist/' + fileWithoutExtension + '.min'] = './src/' + file
  }
}

module.exports = {
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '.')
  },
  module: {
    rules: [
      { test: /\.(glsl|frag|vert)$/, use: ['raw-loader', 'glslify-loader'], exclude: /node_modules/ },
    ],
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]
}