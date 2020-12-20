import Mock from 'mockjs'
import movie from './movie'
import user from './user'
import tickets from './tickets'
import { param2Obj } from './utils'

const mocks = [
  ...movie,
  ...user,
  ...tickets
]

export function mockXHR () {
  Mock.setup({
    timeout: '500-3000'
  })
  function XHR2ExpressReqWrap (respond) {
    return function (options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        result = respond({
          method: type,
          body: JSON.parse(body),
          url: url,
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }
  mocks.forEach(m => {
    Mock.mock(new RegExp(m.url), m.type || 'get', XHR2ExpressReqWrap(m.response))
  })
}
