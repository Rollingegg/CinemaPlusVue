import Mock from 'mockjs'
import movie from './movie'
import user from './user'

const mocks = [
  ...movie,
  ...user
]

export default function mockXHR () {
  mocks.forEach(m => {
    Mock.mock(new RegExp(m.url), m.type || 'get', m.response)
  })
}
