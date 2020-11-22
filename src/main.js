import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import VueLazyload from 'vue-lazyload'

if (process.env.VUE_APP_MOCK === 'true') {
  // 由于是异步mock，导致某些接口在mounted调用时，mock还没好，出现ECONNREFUSED错误
  import('./mock').then(module => {
    module.default()
  })
}

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/img/error.png'),
  loading: require('./assets/img/loading.gif'),
  attempt: 1
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
