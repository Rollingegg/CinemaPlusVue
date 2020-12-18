import Mock from 'mockjs'
import { getQuery } from '@/mock/utils'

const Random = Mock.Random

const movieUrlList = [
  'https://m.media-amazon.com/images/M/MV5BMjAwNDgxNTI0M15BMl5BanBnXkFtZTgwNTY4MDI1NzM@._V1_SY1000_CR0,0,631,1000_AL_.jpg',
  'https://m.media-amazon.com/images/M/MV5BOGFjYWNkMTMtMTg1ZC00Y2I4LTg0ZTYtN2ZlMzI4MGQwNzg4XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_CR0,0,674,1000_AL_.jpg',
  'http://img5.mtime.cn/pi/2020/10/12/091724.63529075_1000X1000.jpg',
  'http://pic1.win4000.com/pic/8/fe/219ff25e6c.jpg',
  'https://p1.meituan.net/movie/b76f37b5e3484b6837f75ef7b5bf46452066459.jpg@464w_644h_1e_1c',
  'http://n.sinaimg.cn/translate/640/w600h840/20190312/ampL-hufnxfm4278816.jpg',
  'http://img.pianbar.com/Image/201604/p480747492.jpg',
  'https://pic2.zhimg.com/v2-38900351212beb39cd0334ef68692950_qhd.jpg',
  'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/2/2ncsslue6kp57xs.jpg',
  'http://image13.m1905.cn/uploadfile/2019/0218/20190218014612118309.jpg',
  'https://p1.meituan.net/moviemachine/56d4089f70bce77395597e0b5b6ff3a12891795.jpg',
  'https://p1.meituan.net/movie/f9f90625d902e3bfb75688037a2476f83410480.jpg',
  'https://p1.meituan.net/moviemachine/6fb1855f663f9856bfc47b7d013e0474651230.jpg',
  'https://p1.meituan.net/movie/7335afbfd567ca5261d28a11d5bab706106991.jpg'
]
const movieList = []
for (let i = 0; i < 40; i++) {
  movieList.push(Mock.mock({
    id: '@increment',
    title: '@ctitle(5, 10)',
    url: Random.pick(movieUrlList),
    description: '@cparagraph(20,40)',
    likes: '@integer(100,1000)',
    rate: ((Math.random() * 39 + 60) / 10).toFixed(1),
    date: '@date()',
    status: Random.pick([0, 1, 2]),
    category: Random.pick(['奇幻', '动画', '惊悚', '剧情', '爱情', '悬疑', '犯罪', '战争']),
    actors: generateNameList(2, 7),
    directors: generateNameList(1, 2),
    len: '@integer(60,150)',
    lang: Random.pick(['国语', '英语', '日语', '韩语'])
  }))
}

function generateNameList (min, max) {
  const size = parseInt(Math.random() * (max - min) + min)
  const nameList = []
  for (let i = 0; i < size; i++) {
    nameList.push(Random.cname())
  }
  return nameList.join('/')
}

export default [
  {
    url: '/api/movies/list',
    type: 'get',
    response: options => {
      console.log(options)
      let type = getQuery(options.url, 'type')
      let limit = getQuery(options.url, 'limit')
      let result = movieList
      if (type !== null) {
        type = Number(type)
        result = result.filter(movie => movie.status === type)
      }
      if (limit !== null) {
        limit = Number(limit)
        result = result.slice(0, limit)
      }
      console.log(result)
      return {
        success: true,
        message: '',
        content: result
      }
    }
  },
  {
    url: '/api/movies/rank',
    type: 'get',
    response: options => {
      console.log(options)
      const limit = Number(getQuery(options.url, 'limit'))
      const result = movieList.slice(0, limit)
      console.log(result)
      return {
        success: true,
        message: '',
        content: result
      }
    }
  }
]
