
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取css文件成单独文件

// optimize-css-assets-webpack-plugin  压缩css插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// 设置node环境变量
process.env.NODE_ENV = "development"

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/built.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                // use数组中loader执行顺序：从右到左，从下到上，依次执行
                use: [
                    // 创建 style 标签，将样式放上去
                    // 创建 style 标签，将js的样式资源插入进行，添加到head中生效
                    // 'style-loader', 
                    //  这里取代 style-loader，作用：提取js中的css文件成单独文件
                    MiniCssExtractPlugin.loader,
                    // 将 css 文件整合到js文件中
                    // 将 css 文件变成 commonjs 模块加载 js 中，里面内容是样式字符串
                    'css-loader',

                    /**
                     * css兼容性处理: postcss --> postcss-loader postcss-preset-env
                     * 帮postcss找到package.json中browserslist中的配置，通过配置加载指定的css兼容性样式
                     * "browserslist": {
                     *      开发环境 => 设置node环境变量: process.env.NODE_ENV = "development"
                            "development": [
                              "last 1 chrome version",
                              "last 1 firefox version",
                              "last 1 safari version"
                            ],
                            生产环境： 默认看生产环境
                            "production": [
                              ">0.009%",
                              "not dead",
                              "not op_mini all"
                            ]
                          }
                     *  */
                    // 使用loader的默认配置
                    // postcss-loader
                    // 修改loader的配置
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                // postcss的插件
                                require('postcss-preset-env')
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        // 提取css为单独文件
        new MiniCssExtractPlugin({
            filename: 'css/built.css'
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ],
    mode: 'development'
}