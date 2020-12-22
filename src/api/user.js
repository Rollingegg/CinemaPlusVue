import request from '@/utils/request'

const domain = process.env.VUE_APP_BASE_API

export function login (loginForm) {
  return request.post(`${domain}/login`, loginForm)
}

export function logout () {
  return request.post('/logout')
}

export function checkUser (username) {
  return request.get(`${domain}/account/check/${username}`)
}

export function register (username, password) {
  return request.post(`${domain}/register`, {
    username: username,
    password: password
  })
}

export function fetchVipInfo (userId) {
  return request.get(`${domain}/vip/${userId}/get`)
}

export function fetchAllVipCardInfo () {
  return request.get('/vip/getAllVIPInfo')
}

export function addVipCard (userId, type = '普通卡') {
  return request.post('/vip/add', {
    type: type,
    userId: userId
  }, true)
}

export function fetchVipBaseInfo (userId) {
  return request.get(`/vip/${userId}/getVIPInfo`)
}

export function chargeVipCard (userId, vipId, amount) {
  return request.post('/vip/charge', {
    amount: amount,
    userId: userId,
    vipId: vipId
  })
}

export function fetchCouponsByUserId (userId) {
  return request.get(`/coupon/${userId}/get`)
}
