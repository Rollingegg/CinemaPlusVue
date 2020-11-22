import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/module/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user
  },
  state: {
    device: 'desktop'
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
