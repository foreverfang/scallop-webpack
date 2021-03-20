// webpack配置文件
// 开发环境 webpack ./src/index.js -o ./build/built.js --mode=development

const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 入口起点
  entry: './src/index.js',
  // 输出
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  // loader 配置
  module: {
    rules: [
      // loader详细配置
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // less-loader需要下载两个依赖 less-loader less
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      // 图片资源loader 需要下载两个依赖 url-loader file-loader
      {
        test: /\.(jpg|png|gif|jpeg)/,
        loader: 'url-loader',
        options: {
          // 图片大小小于80kb，就会被base64处理
          // 有点：减少请求数量（减轻服务器压力）
          // 缺点：图片体积会更大（文件请求速度变慢）
          limit: 80 * 1024,
          // 问题：url-loader模式使用es6模块化解析，而html-loader引入图片是commonjs
          // 解决：关闭url-loader的ES6模块化解析，使用commonjs
          esModule: false,
          // 给图片进行重命名
          // [hash:10]取图片的hash的前十位
          // [ext]取文件原来的扩展名
          name: '[hash:10].[ext]'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  // plugins配置
  plugins: [
    // plugins详细配置
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  // 模式
  mode: 'development' // 开发模式
}
