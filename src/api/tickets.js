import request from '@/utils/request'

export function fetchTickets (userid) {
  return request.get('/api/ticket/get/' + userid)
}
