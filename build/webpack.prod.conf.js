'use strict'
//引入path
const path = require('path')
//引入小工具
const utils = require('./utils')
//引入webpack模块
const webpack = require('webpack')
//引入全局配置
const config = require('../config')
// webpack-merge插件提供合并功能，将多个对象合并创建一个新对象。
const merge = require('webpack-merge')
//引入webpack基础配置
const baseWebpackConfig = require('./webpack.base.conf')
// 引入copy-webpack-plugin插件
// 该插件可以在webpack中复制文件和目录到编译的目录中
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 引入html-webpack-plugin插件
// html-webpack-plugin插件可以生成html文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 引入extract-text-webpack-plugin插件
// 该插件能从文件中提取文本到新的文档
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 引入optimize-css-assets-webpack-plugin插件
// 可以优化和最小化CSS资源
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

//根据环境引入配置
const env = require('../config/prod.env')
// 将webpack基础配置和生成环境配置合并
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 定义vue外部CSS加载规则
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  // 选择增强调试的开发工具
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    //输出文件的根目录
    path: config.build.assetsRoot,
    //该路径必须相对于path路径
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 引入DefinePlugin插件
    // 该插件允许创建能在编译时间内的全局常量
    // 将用户环境变量设置为product，关闭vue.js所有警告功能
    new webpack.DefinePlugin({
      //配置全局环境为生产环境
      'process.env': env
    }),
    //js压缩插件
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      // 定义vue外部CSS加载规则
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    //讲js中的css分离出来
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 压缩外部CSS代码
    // 解决extract-text-webpack-plugin带了的CSS重复的问题
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // 构建要编译输出的index.html,并在文件中嵌入资源文件
    new HtmlWebpackPlugin({
      // 输出的HTML文件名
      filename: config.build.index,
      //模板输出路径
      template: 'index.html',
      // 设置为true或body将js代码加到<body>元素结束前
      // 设置为head将js代码加到<head>里面
      // 设置为false所有静态资源css和JavaScript都不会注入到模板文件中
      inject: true,
      // 设置最小化属性
      minify: {
        //删除注释
        removeComments: true,
        //合拼空白
        collapseWhitespace: true,
        //删除属性的引号
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 通过CommonsChunkPlugin控制chunks在html文件中添加的顺序
      // 设置为dependency即按照它们之间的依赖关系添加
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    //webpac将当成模块打包的vendor.js里面
    //使用CommonsChunkPlugin将vendor.js分离到单独的文件
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      //公共模块的名字
      name: 'vendor',
      //chunks的被当成公共模块需满足的条件
      // 如果是数值的话就是chunks的被当成公共模块需被其他模块引用的最小次数
      minChunks(module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 为了使将公共模块达到长期缓存的效果
    // 引用chunk-manifest-webpack-plugin
    // 获得webpack执行时间和输出一份json文件保存chunk的id和最终引用它们的文件印射关系。
    // 避免当app bundle刷新时vendor也刷新
    new webpack.optimize.CommonsChunkPlugin({
      // 输出bundle编译清单的文件名
      name: 'manifest',
      // chunks名称
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        //path.resolve拼接静态资源绝对路径
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
// 如果开启了Gzip压缩，使用下方配置
if (config.build.productionGzip) {
  // 引入compression-webpack-plugin插件
  // 该插件为需要压缩的资源提供内容编码
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      //要进行压缩的文件名
      asset: '[path].gz[query]',
      //采用压缩算法
      algorithm: 'gzip',
      // 正则匹配,命中规则的文件进行压缩
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      // 只有文件大小大于设定的字节数的文件进行压缩
      threshold: 10240,
      // 只有文件压缩率大于设定值得文件进行压缩
      minRatio: 0.8
    })
  )
}
// 如果开启了编译报告，使用下方配置
if (config.build.bundleAnalyzerReport) {
  // 引入webpack-bundle-analyzer插件
  // BundleAnalyzerPlugin能以可视化的方式展示打包结果
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
