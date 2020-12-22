import db from '@/utils/localstorage'
import {
  addVipCard,
  chargeVipCard,
  fetchAllVipCardInfo, fetchCouponsByUserId,
  fetchVipBaseInfo,
  fetchVipInfo,
  login,
  logout
} from '@/api/user'
const loginAvatarUrl = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/48/h/48'
const defaultAvatarUrl = 'https://p0.meituan.net/movie/7dd82a16316ab32c8359debdb04396ef2897.png'
const user = {
  namespaced: true,
  state: {
    name: db.get('USER_NAME', null),
    avatar: db.get('USER_AVATAR', defaultAvatarUrl),
    id: db.get('USER_ID', null),
    coupons: db.get('USER_COUPONS', []),
    vipCardInfoList: db.get('VIP_CARD_INFO', []),
    consumptionHistory: {},
    isVip: db.get('isVip', false),
    memberCardInfo: db.get('VIP', {})
  },
  mutations: {
    set_name: (state, name) => {
      db.save('USER_NAME', name)
      state.name = name
    },
    set_avatar: (state, avatar) => {
      db.save('USER_AVATAR', avatar)
      state.avatar = avatar
    },
    set_id: (state, id) => {
      db.save('USER_ID', id)
      state.id = id
    },
    set_coupons: (state, coupons) => {
      db.save('USER_COUPONS', coupons)
      state.coupons = coupons
    },
    set_vipCardInfoList: (state, memberCardInfo) => {
      db.save('VIP_CARD_INFO', memberCardInfo)
      state.vipCardInfoList = memberCardInfo
    },
    set_consumptionHistory: (state, consumptionHistory) => {
      state.consumptionHistory = consumptionHistory
    },
    set_isVip: (state, isVip) => {
      db.save('IS_VIP', isVip)
      state.isVip = isVip
    },
    set_memberCardInfo: (state, info) => {
      db.save('VIP', info)
      state.memberCardInfo = info
    },
    resetUserInfo: (state) => {
      state.id = undefined
      state.name = undefined
      state.avatar = defaultAvatarUrl
      state.coupons = []
      state.consumptionHistory = {}
      state.vipCardInfoList = []
      state.memberCardInfo = {}
    }
  },
  actions: {
    // user login
    async login ({ commit, state, dispatch }, userForm) {
      const { id, username } = await login(userForm)
      commit('set_id', id)
      commit('set_name', username)
      commit('set_avatar', loginAvatarUrl)
      const vipInfoList = await fetchAllVipCardInfo()
      commit('set_vipCardInfoList', vipInfoList)
      await dispatch('updateVipInfo')
    },
    // user logout
    async logout ({ commit, state, dispatch }) {
      db.clear()
      commit('resetUserInfo')
      await logout()
    },
    async buyVipCard ({ commit, state, dispatch }, cardType) {
      try {
        await addVipCard(state.id, cardType)
        commit('set_isVip', true)
        const vipInfo = await fetchVipInfo(state.id)
        const vipBaseInfo = await fetchVipBaseInfo(state.id)
        vipInfo.discount = vipBaseInfo.discount
        vipInfo.description = vipBaseInfo.description
        commit('set_memberCardInfo', vipInfo)
      } catch (e) {
        commit('set_isVip', false)
      }
    },
    async chargeVipCard ({ commit, state, dispatch }, chargeVal) {
      const vipInfo = state.memberCardInfo
      const { balance } = await chargeVipCard(state.id, vipInfo.id, chargeVal)
      vipInfo.balance = balance
      commit('set_memberCardInfo', vipInfo)
    },
    async updateVipInfo ({ commit, state, dispatch }) {
      try {
        const vipInfo = await fetchVipInfo(state.id)
        commit('set_isVip', true)
        const vipBaseInfo = await fetchVipBaseInfo(state.id)
        vipInfo.discount = vipBaseInfo.discount
        vipInfo.description = vipBaseInfo.description
        commit('set_memberCardInfo', vipInfo)
      } catch (e) {
        console.log(e)
        commit('set_isVip', false)
      }
    },
    async fetchCoupons ({ commit, state, dispatch }) {
      const coupons = await fetchCouponsByUserId(state.id)
      commit('set_coupons', coupons)
    }
  }
}
export default user
