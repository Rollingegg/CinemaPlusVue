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
