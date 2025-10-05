const path = require("path")
const webpack = require("webpack")

const CopyWebpackPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin")


const IS_DEVELOPMENT = process.env.NODE_ENV === "dev"


const dirApp = path.join(__dirname, "app")
// const dirImages = path.join(__dirname, "images")
const dirShared = path.join(__dirname, "shared")
const dirStyles = path.join(__dirname, "styles")
// const dirVideos = path.join(__dirname, "videos")
const dirNode = "node_modules"

// const $ = require("jquery")

//console.log(dirApp, dirAssets, dirStyles)

module.exports = {
  entry: [
    path.join(dirApp, "index.js"),
    path.join(dirStyles, "index.scss")
  ],
  resolve: {
    modules: [
      dirApp,
      dirShared,
      // dirImages,
      dirStyles,
      // dirVideos,
      dirNode
    ],
    fallback: {
      events: require.resolve("events/"),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: '',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),

    // Image Minifier Not Working Correctly
    // new ImageMinimizerPlugin({
    //   minimizer: {
    //     implementation: ImageMinimizerPlugin.imageminMinify,
    //     options: {
    //       plugins: [
    //         ["gifsicle", { interlaced: true }],
    //         ["mozjpeg", { progressive: true }],
    //         ["optipng", { optimizationLevel: 5 }],
    //         // ["svgo", {}],
    //       ],
    //     },
    //   },
    // }),

    new CleanWebpackPlugin()

  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },

          {
            loader: 'css-loader',
          },

          {
            loader: 'postcss-loader',
          },

          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                quietDeps: true, // <-- suppresses deprecation warnings
              },
            },
          },
        ],
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg|webp)$/i,
      //   use: [
      //     {
      //       loader: ImageMinimizerPlugin.loader,
      //     },
      //   ],
      // },
      //

      {
        test: /\.(png|jpg|gif|jpe?g|svg|woff2?|fnt|webp|mp4)$/,
        type: 'asset/resource',
        generator: {
          // filename: '[name].[hash].[ext]',
          filename: '[name].[hash].[ext]',
        },
      },

      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: [
          {
            // loader: ImageMinimizerPlugin.loader,
            loader: "file-loader",
            options: {
              outputPath: "images"
            }

          },
        ],
      },

      {
        test: /\.(glsl|frag|vert)$/,
        type: 'asset/source', // replaced raw-loader
        exclude: /node_modules/,
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/,
      },
    ],
  }

}

