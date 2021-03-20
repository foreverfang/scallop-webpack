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
      },
      // 字体图标 打包其他资源 （除js/css/html以外的资源）
      {
        // 排除js/css/html资源
        exclude: /\.(js|css|html|less|jpg|png|gif|jpeg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]'
        }
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
  mode: 'development', // 开发模式
  
  // 开发服务器 devServer 自动化：用于自动编译，自动打开浏览器，自动刷新浏览器
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer 指令为：npx webpack-dev-server  (webpack5：npx webpack serve)
  devServer: {
    // 项目构建后的路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    //自动打开浏览器
    open: true
  }
}
