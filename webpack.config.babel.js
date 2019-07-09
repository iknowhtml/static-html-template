import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { HotModuleReplacementPlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserJSPlugin from 'terser-webpack-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';

// Two parameters are passed in at bundle time, env & argv. argv contains all flags passed into webpack, including mode.
const webpackConfiguration = (env, argv) => ({
  entry: path.resolve('src', 'index.js'),
  output: {
    path: path.resolve('dist'),
    filename: 'index.js',
  },
  // Configures Loaders
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  // Configures Plugins
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: '',
      filename: 'index.html',
      template: path.resolve('src', 'index.ejs'),
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            }
          : false,
      hash: process.env.NODE_ENV === 'production',
      //Prevents automatic injection of CSS & HTML into template.
      inject: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  // Configures Optimizations
  optimization:
    process.env.NODE_ENV === 'production'
      ? {
          minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCssAssetsWebpackPlugin({}),
          ],
        }
      : {},
  //Configures Webpack DevServer
  devServer: {
    port: 8080,
    // Enables webpack's Hot Module Replacement feature.
    hot: true,
    // Shows a full-screen overlay in the browser when there are compiler errors or warnings. Disabled by default.
    overlay: {
      warnings: true,
      errors: true,
    },
    // Sets and watches the content base so that dev server will reload page on HTML changes
    contentBase: path.resolve('src'),
    watchContentBase: true,
  },
});

export default webpackConfiguration;
