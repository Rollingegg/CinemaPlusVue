import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import VueLazyload from 'vue-lazyload'
import moment from 'moment'

if (process.env.VUE_APP_MOCK === 'true') {
  // 由于是异步mock，导致某些接口在mounted调用时，mock还没好，出现ECONNREFUSED错误
  // import('./mock').then(module => {
  //   module.default()
  // })
  // 所以改为require同步引入
  // TODO 参见模块化详解 https://segmentfault.com/a/1190000012386576
  const { mockXHR } = require('./mock')
  mockXHR()
}

Vue.config.productionTip = false
Vue.use(Antd)

// 图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/img/error.png'),
  attempt: 1
})

/*
 * 全局过滤器 时间戳
 * 页面使用过滤 如：
 * <cell title="还款日" :value="data | dateformat('YYYY-MM-DD')"></cell>
 */
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return dataStr
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
