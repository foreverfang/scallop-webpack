const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
process.env.NODE_ENV = "development"

const {resolve} = require('path') 

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',
      //     'css-loader'
      //   ]
      // },
      // html-loader
      // {
      //   test: /\.html$/,
      //   loader: 'html-loader'
      // },
      // {
      //   test: /\.(jpeg|png|gif|jpg)/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 100 * 1024,
      //     esModule: false,
      //     name: '[hash:10].[ext]'
      //   }
      // },
      // // 打包其他资源
      // {
      //   exclude: /\.(js|html|css|less|jpg|png|gif|jpeg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[hash:10].[ext]'
      //   }
      // },
      // {
      //   test: /\.css$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         ident: 'postcss',
      //         plugins: [
      //           resolve('postcss-preset-env')
      //         ]
      //       }
      //     }
      //   ]
      // },
      {
        /**
         * 语法检查:eslint-loader eslint
         * 只检查自己的代码，第三方的库不检查
         * 设置检查规则：
         *   package.json中eslintconfig配置
         *    "eslintConfig": {
                "extends": "airbnb-base"
              }
         *   风格指南 airbnb --> eslint-config-airbnb-base eslint-plugin-import eslint
         */ 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // 自动修复eslint错误
          fix: true
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // // css单独提取成文件
    // new MiniCssExtractPlugin({
    //   filename: 'css/built.css'
    // }),
    // new OptimizeCssAssetsPlugin()
  ],
  mode: 'development',
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true
  }
}