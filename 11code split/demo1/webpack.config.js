/**
 * 代码分割 code split 方案1 多入口拆分
 * 
 */
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // 单入口
    // entry: './src/js/index.js', 
    // 多入口：有一个入口，最终输出就有一个bundle
    entry: {
        main: './src/js/index.js',
        test: './src/js/test.js'
    },
    output: {
        // [name]: 取文件名
        filename: 'js/[name].[contenthash:10].js',
        path: resolve(__dirname, 'build')
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ],
    //生产环境自动压缩js
    mode: 'production'
}