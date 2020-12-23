import request from '@/utils/request'
// const domain = process.env.VUE_APP_BASE_API

/**
 * 测试
 * @returns {Promise<AxiosResponse<any>>}
 */
export function fetchMovies (param) {
  if (param.query) {
    return request.get('/movie/search', {
      keyword: param.query
    })
  }
  if (param.type) {
    if (param.type === 0) {
      return request.get('/movie/all/exclude/off')
    }
  }
  return request.get('/movie/all')
}

export function fetchMovieRank (param) {
  return request.get('/statistics/boxOffice/total')
}

export function fetchMovieDetail (userId, movieId) {
  return request.get(`/movie/${movieId}/${userId}`)
}

export function updateMovieLike (userId, movieId, isLike) {
  if (isLike) {
    return request.post(`/movie/${movieId}/unlike/?userId=${userId}`)
  }
  return request.post(`/movie/${movieId}/like/?userId=${userId}`)
}

export function getAllMoviesExcludeOff (param) {
  return request.get('/movie/all/exclude/off', param)
}

export function fetchScheduleDataByMovieId (movieId) {
  return request.get('/schedule/search/audience', {
    movieId: movieId
  })
}

export function fetchSeatInfoByScheduleIdAndUserId (scheduleId, userId) {
  return request.get('/ticket/get/occupiedSeats', {
    scheduleId: scheduleId,
    userId: userId
  })
}

export function lockSeat (userId, scheduleId, seats) {
  return request.post('/ticket/lockSeat', {
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
    return request.post('/ticket/vip/buy', body)
  }
  return request.post('/ticket/buy', body)
}
