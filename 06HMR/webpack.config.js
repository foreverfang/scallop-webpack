/**
 * HMR: hot module replacement 热模块替换 / 模块热替换
 *  作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所有），极大提升构建速度
 * 
 * 样式文件：可以使用HMR功能：因为style-loader内部实现了
 * js文件 默认不能使用HMR功能：需要修改js代码，添加支持HMR功能的代码
 *    注意：HMR功能对js的处理，只能处理非入口js文件的其他文件
 * html文件 默认不能使用HMR功能，同时会导致问题：html不能热更新了 （不用做HMR功能）
 *   解决：修改entry入口，将文件引入
*/

const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // 入口起点
    entry: ['./src/js/index.js', './src/index.html'],
    // 输出
    output: {
        filename: 'js/built.js', // 指定一个js目录
        path: resolve(__dirname, 'build')
    },
    // loader 配置
    module: {
        rules: [
            // loader详细配置
            // 处理css资源 打包到js文件中了
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // less-loader需要下载两个依赖 less-loader less
            // 处理less资源
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            // 处理图片资源 loader需要下载两个依赖 url-loader file-loader
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
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs' // 指定目录
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            // 字体图标 打包其他资源 （除js/css/html等以外的资源）
            {
                // 排除js/css/html等资源
                exclude: /\.(js|css|html|less|jpg|png|gif|jpeg)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media' // 指定目录
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
        open: true,
        // 开启HMR功能 
        // 修改了新配置，必须重新webpack
        hot: true
    }
}
