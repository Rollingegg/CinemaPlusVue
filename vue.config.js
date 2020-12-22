'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = process.env.VUE_APP_TITLE || 'Random Theatre' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 3000 // dev port
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true, // 配置自动启动浏览器
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API || 'http://localhost:8080',
        changeOrigin: false,
        pathRewrite: {
          '^/api': '/api'
        },
        logLevel: 'debug'
      }
    }
  },
  // vue.config.js for less-loader@6.0.0
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#0063B1',
            'link-color': '#0063B1'
          },
          javascriptEnabled: true
        }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack (config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // use svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          // 经测试，通过cdn打包后约莫能减少400K的体积
          // 配置第三方资源的cdn
          const cdn = {
            js: [
              // vue必须在第一个
              'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
              'https://cdn.bootcss.com/vuex/3.5.1/vuex.min.js',
              'https://cdn.bootcss.com/vue-router/3.4.9/vue-router.min.js',
              'https://cdn.bootcss.com/axios/0.21.0/axios.min.js',
              'http://cdn.staticfile.org/moment.js/2.29.1/moment.min.js'
            ]
          }
          // 配置cdn依赖
          // 格式为 'aaa' : 'bbb', 其中，aaa表示要引入的资源的名字，bbb表示该模块提供给外部引用的名字，由对应的库自定。
          // 例如，vue为Vue，vue-router为VueRouter.
          config.set('externals', {
            vue: 'Vue',
            vuex: 'Vuex',
            'vue-router': 'VueRouter',
            axios: 'axios',
            moment: 'moment',
            mockjs: 'Mock'
          })
          // 通过 html-webpack-plugin注入到 index.html之中
          config.plugin('html').tap(args => {
            args[0].cdn = cdn
            return args
          })

          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          // gzip压缩(暂时用nginx开启gzip，打包暂不压缩)
          // 依赖"compression-webpack-plugin": "^4.0.0"(6.0或之后依赖webpack高版本，与vuecli的webpack版本不符合，会出现tapPromise undefined的错误)
          // 定义gzip压缩文件类型
          // const productionGzipExtensions = ['html', 'js', 'css']
          // config
          //   .plugin('CompressionWebpackPlugin')
          //   .use('compression-webpack-plugin', [{
          //     filename: '[path].gz[query]',
          //     algorithm: 'gzip',
          //     test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          //     threshold: 10240,
          //     minRatio: 0.8
          //   }])
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                antd: {
                  name: 'chunk-antd', // split ant-design-vue into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?ant-design(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
