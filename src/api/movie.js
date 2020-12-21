import request from '@/utils/request'
const domain = process.env.VUE_APP_BASE_API

/**
 * 测试
 * @returns {Promise<AxiosResponse<any>>}
 */
export function fetchMovies (param) {
  return request.get('/api/movies/list', param)
}

export function fetchMovieRank (param) {
  return request.get('/api/movies/rank', param)
}

export function fetchScheduleDataByMovieId (movieId) {
  return request.get(`${domain}/schedule/search/audience`, {
    movieId: movieId
  })
}

export function fetchSeatInfoByScheduleIdAndUserId (scheduleId, userId) {
  return request.get(`${domain}/ticket/get/occupiedSeats`, {
    scheduleId: scheduleId,
    userId: userId
  })
}

export function lockSeat (userId, scheduleId, seats) {
  return request.post(`${domain}/ticket/lockSeat`, {
    userId: userId,
    scheduleId: scheduleId,
    seats: seats
  })
}

/**
 * 支付完成购买
 * @param userId 用户id
 * @param ticketIds 电影票id列表，每个座位对应一个
 * @param total 总价
 * @param couponId 优惠券id，无则默认为0
 * @param useVipCard 是否使用vipCard，默认不使用
 * @returns {Promise<AxiosResponse<any>>}
 */
export function completeTicket (userId, ticketIds, total, couponId = 0, useVipCard = false) {
  const body = { id: ticketIds, couponId: couponId, total: total, userId: userId }
  if (useVipCard) {
    return request.post(`${domain}/ticket/vip/buy`, body)
  }
  return request.post(`${domain}/ticket/buy`, body)
}
