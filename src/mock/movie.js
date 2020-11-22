import Mock from 'mockjs'
import getQuery from '@/mock/utils'

const Random = Mock.Random

const movieList = []
for (let i = 0; i < 30; i++) {
  movieList.push(Mock.mock({
    id: '@increment',
    title: '@ctitle(5, 10)',
    url: 'https://m.media-amazon.com/images/M/MV5BMjAwNDgxNTI0M15BMl5BanBnXkFtZTgwNTY4MDI1NzM@._V1_SY1000_CR0,0,631,1000_AL_.jpg',
    description: '@cparagraph(20,40)',
    likes: '@integer(100,1000)',
    date: '@date()',
    type: Random.pick([0, 1, 2])
  }))
}

export default [
  {
    url: '/api/movies/list',
    type: 'get',
    response: options => {
      console.log(options)
      const type = Number(getQuery(options.url, 'type'))
      const limit = Number(getQuery(options.url, 'limit'))
      const result = movieList.filter(movie => movie.type === type).slice(0, limit)
      console.log(result)
      return {
        success: true,
        message: '',
        content: result
      }
    }
  }
]
