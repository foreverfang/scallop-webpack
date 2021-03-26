
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * output
 */
module.exports = {
    entry: './src/index.js',
    output: {
        // 文件名称（指定名称+目录）
        filename: 'js/[name].js',
        // 输出文件目录（将来所有资源输出的公共目录）
        path: resolve(__dirname, 'build')
    },
    module: {
        rulse: [
            // loader 配置
            {
                test: /\.css$/,
                // 多个loader用use
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                // 排除node_modules下的js文件
                exclude: /node_modules/,
                // 只排查 src 下的js文件
                include: resolve(__dirname, 'src'),
                // 优先执行
                enforce: 'pre',
                // // 延后执行
                // enforce: 'post', 
                // 单个loader用loader
                loader: 'eslint-loader',
                options: {}
            },
            {
                // 以下配置只会生效一个
                oneOf: []
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    mode: 'development'
}