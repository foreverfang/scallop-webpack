/**
 * 
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
    },
    devtool: 'eval-source-map'
}

/**
 * source-map: 一种提供源代码到构建后代码映射技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）
 *   [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
 *   source-map: 外部
 *      错误代码准确信息和源代码的错误位置
 *
 *   inline-source-map：内联
 *    1.只生成一个内联source-map
 *      错误代码准确信息和源代码的错误位置
 *
 *   hidden-source-map: 外部
 *    1.错误代码错误原因，但是没有错误位置，不能追踪到源代码错误，只能提示到构建后代码的错误位置
 *
 *   eval-source-map：内联
 *    1.每一个文件都生成对应的source-map，都在eval
 *
 *   nosources-source-map： 外部
 *      错误代码准确信息，但是没有任何源代码信息
 *
 *   cheap-source-map: 外部
 *      错误代码准确信息和源代码的错误位置
 *      只能精确到行
 *
 *   cheap-module-source-map: 外部
 *      错误代码准确信息和源代码的错误位置
 *      module会将loader的source map 加入
 *
 *   内联和外部的区别：1.外部生成了文件，内联没有 2.内联构建速度更快
 *
 *    开发环境：速度快，调试更友好
 *       速度(eval > inline > cheap ...)
 *              eval-cheap-source-map
 *              eval-source-map
 *       调试更友好
 *               source-map
 *               cheap-module-source-map
 *               cheap-source-map
 *
 *    --> eval-source-map / eval-cheap-module-source-map
 *
 *    生产环境：源代码要不要隐藏？调试要不要更友好
 *              内联会让体积更大，所以生产环境一般不用内联
 *               source-map
 *              nosources-source-map  全部隐藏
 *              hidden-source-map  只隐藏源代码，会提示构建后代码错误信息
 *    --> source-map / cheap-module-source-map
 */
