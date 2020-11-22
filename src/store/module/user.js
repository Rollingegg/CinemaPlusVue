import db from '@/utils/localstorage'
import { logout } from '@/api/user'

const user = {
  namespaced: true,
  state: {
    name: 'steve',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
    id: '',
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
    }
  },
  actions: {
    // user logout
    logout ({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          db.clear()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default user
