import request from '@/utils/request'

const domain = process.env.VUE_APP_BASE_API

export function fetchTickets (userid) {
  return request.get(`${domain}/ticket/get/` + userid)
}
