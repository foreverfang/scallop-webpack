
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/built.js',
        path: resolve(__dirname, 'build')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // 压缩html代码
            minify: {
                // 移除空格
                collapseWhitespace: true,
                //一处注释
                removeComments: true,
                // 去掉引号
                removeAttributeQuotes: true
            }
        }),
    ],
    // mode设置生产环境（production）自动压缩js代码
    mode: 'production'
}