const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "./dist/bundle.js",
  },
  devServer: {
    contentBase: "./dist",
    hot: true,
  },
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
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin("dist", {}),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: "./index.html",
      filename: "index.html",
    }),
    new WebpackMd5Hash(),
    new CopyWebpackPlugin([
      // {
      //     from: './src/assets',
      //     to: './assets'
      // },
      // {
      //     from: 'manifest.json',
      //     to: 'manifest.json'
      // }
    ]),
    new CompressionPlugin({
      algorithm: "gzip",
    }),
  ],
};
