import request from '@/utils/request'

/**
 * 测试
 * @returns {Promise<AxiosResponse<any>>}
 */
export function fetchMovies (param) {
  return request.get('/api/movies/list', param)
}
