import Mock from 'mockjs'
import movie from './movie'

const mocks = [
  ...movie
]

export default function mockXHR () {
  mocks.forEach(m => {
    Mock.mock(new RegExp(m.url), m.type || 'get', m.response)
  })
}
