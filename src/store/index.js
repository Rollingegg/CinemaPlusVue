import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/module/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user
  },
  state: {
    device: 'desktop',
    copyright: `${new Date().getFullYear()} <a href="https://git.nju.edu.cn/beg4pass" target="_blank">Random Group</a>`
  },
  mutations: {
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    }
  },
  actions: {
    toggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    }
  }
})
