import request from '@/utils/request'

/**
 * 测试
 * @returns {Promise<AxiosResponse<any>>}
 */
export function fetchMovies () {
  return request.get('/api/movie/list')
}
