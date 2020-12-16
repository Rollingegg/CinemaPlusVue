import db from '@/utils/localstorage'
import { login, logout } from '@/api/user'
const loginAvatarUrl = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/48/h/48'
const defaultAvatarUrl = 'https://p0.meituan.net/movie/7dd82a16316ab32c8359debdb04396ef2897.png'
const user = {
  namespaced: true,
  state: {
    name: db.get('USER_NAME'),
    avatar: defaultAvatarUrl,
    id: db.get('USER_ID'),
    coupons: [],
    memberCardInfo: {},
    consumptionHistory: {}
  },
  mutations: {
    set_name: (state, name) => {
      db.save('USER_NAME', name)
      state.name = name
    },
    set_avatar: (state, avatar) => {
      state.avatar = avatar
    },
    set_id: (state, id) => {
      db.save('USER_ID', id)
      state.id = id
    },
    set_coupons: (state, coupons) => {
      state.coupons = coupons
    },
    set_memberCardInfo: (state, memberCardInfo) => {
      state.memberCardInfo = memberCardInfo
    },
    set_consumptionHistory: (state, consumptionHistory) => {
      state.consumptionHistory = consumptionHistory
    },
    resetUserInfo: (state) => {
      state.id = undefined
      state.name = undefined
      state.avatar = defaultAvatarUrl
      state.coupons = []
      state.consumptionHistory = {}
      state.memberCardInfo = {}
    }
  },
  actions: {
    // user login
    async login ({ commit }, userForm) {
      const { id, username } = await login(userForm)
      commit('set_id', id)
      commit('set_name', username)
      commit('set_avatar', loginAvatarUrl)
    },
    // user logout
    async logout ({ commit, state, dispatch }) {
      db.clear()
      commit('resetUserInfo')
      await logout()
    }
  }
}
export default user
