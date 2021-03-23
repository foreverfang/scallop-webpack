/**
 * 缓存：
 *   1.babel缓存
 *      cacheDirectory: true
 *      --> 让第二次打包更快
 *   2.文件资源缓存：
 *    修改文件名 
 *       hash: 每次webpack打包构建时都会生成一个唯一的hash值。
 *           问题：因为js和css同时使用一个hash值
 *              如果重新打包会导致所有缓存失效。（可能只修改了一个文件）
 *       chunkhash: 根据chunk生成的hash值。如果打包来源同一个chunk，那么hash值就一样
 *           问题：js和css的hash值还是一样的
 *              因为css是在js中被引入，所以同属于一个chunk
 *       contenthash: 根据文件的内容生成hash值。 不同文件hash值一定不一样   -->最佳方案
 *       --> 让代码上线运行缓存更好使用
 */

const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production'

// 复用loader
const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
        // 还需要在package.json定义兼容浏览器的版本
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: [
                require('postcss-preset-env')
            ]
        }
    }
]

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/built.[contenthash:10].js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            // js语法检查
            {
                // 在package.json中eslintconfig --> airbnb 代码风格指南
                test: /\.js$/,
                exclude: /node_modules/,
                // 优先执行
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            },
            {
                // 以下loader只会匹配一个
                // 注意：不能有两个配置处理同一种类型的文件
                oneOf: [
                    {
                        test: /\.css$/,
                        use: [
                            ...commonCssLoader
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            // 注意顺序
                            ...commonCssLoader,
                            'less-loader'
                        ]
                    },
                    /**
                     * 正常来讲，一个文件只能被一个loader处理
                     * 当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序
                     *  先执行eslint，再执行babel
                     */
                    // 兼容性处理
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        //按需加载兼容
                                        useBuiltIns: 'usage',
                                        corejs: {
                                            version: 3
                                        },
                                        targets: {
                                            chrome: '65',
                                            firefox: '50',
                                            edge: '9',
                                            safari: '9',
                                            ie: '9'
                                        }
                                    }
                                ]
                            ],
                            // 开启babel缓存
                            // 第二次构建时，会读取之前的缓存
                            cacheDirectory: true
                        }
                    },
                    // 图片压缩
                    {
                        test: /\.(jpg|png|gif|jpeg)$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10 * 1024,
                            name: '[hash:10].[ext]',
                            esModule: false,
                            outputPath: 'imgs'
                        }
                    },
                    // html资源
                    {
                        test: /\.html$/,
                        loader: 'html-loader'
                    },
                    // 其他资源
                    {
                        exclude: /\.(html|js|css|less|jpg|png|gif|jpeg)$/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'media'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/built.[contenthash:10].css'
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ],
    //生产环境自动压缩js
    mode: 'production',
    devtool: 'source-map'
}