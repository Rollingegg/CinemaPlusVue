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
