const webpack = require("webpack");
const path = require('path');
const BUILD_DIR = path.join(__dirname, '/dist');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, '/src'),
  dist: BUILD_DIR,
};

const entry = {};
entry.app = PATHS.src;

module.exports = {
  context: __dirname,
  entry,
  output: {
    path: PATHS.dist,
    filename: '[name].js',
    libraryTarget: "window",
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    }),
    new HtmlWebpackPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.jsx$/,
        use: {
          loader: "babel-loader",
        },
      }, {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'react-svg-loader'
      }
    ],
  },
};