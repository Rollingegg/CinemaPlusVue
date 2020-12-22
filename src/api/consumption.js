import request from '@/utils/request'
const domain = process.env.VUE_APP_BASE_API

export function fetchConsumptions (userId) {
  return request.get(`${domain}/consumption/` + userId)
}

export function fetchConsumptionDetail (consumptionId) {
  return request.get(`${domain}/consumption/get/` + consumptionId)
}
