import Mock from 'mockjs'

export default [
  {
    url: '/api/movie/list',
    type: 'get',
    response: _ => {
      const movieList = []
      for (let i = 0; i < 10; i++) {
        movieList.push(Mock.mock({
          id: '@increment',
          title: '@ctitle(5, 10)',
          description: '@cparagraph(20,40)',
          likes: '@integer(100,1000)',
          date: '@date()'
        }))
      }
      return {
        success: true,
        message: '',
        content: movieList
      }
    }
  }
]
