'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
//这个插件可以自动生成html，获取在已存在的html插入css、js等  
const HtmlWebpackPlugin = require('html-webpack-plugin')
// webpack-merge插件提供合并功能，将多个对象合并创建一个新对象。  
// 引入friendly-errors-webpack-plugin插件  
// 更好的识别webpack错误并提供更好的开发体验  
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(app) {
      //接口返回json数据，上面配置的数据seller就赋值给data请求后调用
      //接口返回json数据，上面配置的数据seller就赋值给data请求后调用
      app.get('/api/Seller', (req, res) => {
        res.json({
          errno: 0,
          data: seller
        })
      })
      app.get('/api/Goods', (req, res) => {
        res.json({
          errno: 0,
          data: goods
        })
      })
      app.get('/api/Ratings', (req, res) => {
        res.json({
          errno: 0,
          data: ratings
        })
      })
    }
  },
  plugins: [
    // 引入DefinePlugin插件  
    // 该插件允许创建能在编译时间内的全局常量  
    // 将用户环境变量设置为dev，关闭vue.js所有警告功能  
    new webpack.DefinePlugin({
      //配置全局环境为生产环境
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // 将所有webpack bundles集成到一个html页面  
    new HtmlWebpackPlugin({
      // 输出的HTML文件名  
      filename: 'index.html',
      // 模板文件路径 
      template: 'index.html',
      // 设置为true或body将js代码加到<body>元素结束前  
      // 设置为head将js代码加到<head>里面  
      // 设置为false所有静态资源css和JavaScript都不会注入到模板文件中  
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
const express = require('express')
const app = express()
var appData = require('../data.json')  //加载本地文件
var seller = appData.seller  //获取相对应的本地数据
var goods = appData.goods
var ratings = appData.ratings
var apiRoutes = express.Router()
app.use('/api', apiRoutes)
// apiRoutes.get('/seller', function (req, res) {
//   res.json({
//     errno: 0,
//     data: seller
//   })
// })
// apiRoutes.get('/goods', function (req, res) {
//   res.json({
//     errno: 0,
//     data: goods
//   })
// })
// apiRoutes.get('/ratings', function (req, res) {
//   res.json({
//     errno: 0,
//     data: ratings
//   })
// })
app.use('/api', apiRoutes)