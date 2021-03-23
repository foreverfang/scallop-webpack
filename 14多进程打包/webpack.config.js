/**
 * PWA：渐进式网络开发应用程序（离线可访问）
 *   workbox --> workbox-webpack-plugin
 */

const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const workboxWebpackPlugin = require('workbox-webpack-plugin')

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
                        use: [
                          /**
                           * 开启多进程打包
                           * 进程开启大概600ms，进程通信也有开销
                           * 只有工作消耗时间比较长，才需要多进程打包
                           */
                          {
                            loader: 'thread-loader',
                            options: {
                              workers: 2 // 进程两个
                            }
                          },
                          {
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
                          }
                        ],
                        
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
        }),
        new workboxWebpackPlugin.GenerateSW({
            /**
             * 1.帮助serviceworker快速启动
             * 2.删除旧的 serviceWorker
             * 
             * 生成一个serviceworker 配置文件
             */
            clientsClaim: true,
            skipWaiting: true
        })
    ],
    //生产环境自动压缩js
    mode: 'production',
    devtool: 'source-map'
}