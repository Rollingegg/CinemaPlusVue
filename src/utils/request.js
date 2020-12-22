import axios from 'axios'
import { notification, message } from 'ant-design-vue'

const BACKEND_REQUEST = axios.create({
  // 如果url不是绝对路径，那么会在前面加上baseURL
  baseURL: process.env.VUE_APP_MOCK === 'true' ? '' : process.env.VUE_APP_BASE_API,
  timeout: 5000,
  validateStatus (status) {
    // 200 以外的状态码都视为失败
    return status === 200
  }
})

const err = (error) => {
  if (error.response) {
    const errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
    switch (error.response.status) {
      case 404:
        notification.error({
          message: '系统提示',
          description: '很抱歉，资源未找到',
          duration: 4
        })
        break
      case 403:
      case 401:
        notification.warn({
          message: '系统提示',
          description: '很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效',
          duration: 4
        })
        break
      default:
        notification.error({
          message: '系统提示',
          description: errorMessage,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
}

// 配置response拦截器
BACKEND_REQUEST.interceptors.response.use(
  /**
   * response {status,data:{success,message,content}}
   */
  (response) => {
    const res = response.data
    if (res.success) {
      return res.content
    }
    if (res === 'index') {
      return Promise.resolve()
    }
    if (res.message !== '用户卡不存在') {
      message.error(res.message || '系统内部异常，请联系网站管理员')
    }
    return Promise.reject(new Error(res.message))
  },
  err
)

/**
 * 拼接query到url后
 * 对于数组入参如ids=[1,2]
 * axios原生get的做法是转换为?ids[]=1&ids[]=2(@RequestParam需指定名称为"ids[]")
 * 因而可以转换为?ids=1,2
 * 或者转化为?ids=1&ids=1(Swagger的做法)
 * SpringBoot均可识别为list数组
 * 这里使用第一种
 * @param url 请求url
 * @param params 查询参数
 * @returns {string}
 */
function param2urlencoded (url, params) {
  let _params
  if (Object.is(params, undefined)) {
    _params = ''
  } else {
    _params = '?'
    for (const key in params) {
      if (Reflect.has(params, key) && params[key] !== null) {
        _params += `${key}=${params[key]}&`
      }
    }
  }
  return `${url}${_params.substr(0, _params.length - 1)}`
}

const request = {
  get (url, params) {
    return BACKEND_REQUEST.get(param2urlencoded(url, params))
  },
  post (url, params, useFormPost = false) {
    // 是否使用原生表单提交，对应springboot后端为不加@RequestBody注解的入参
    if (useFormPost) {
      return BACKEND_REQUEST.post(url, params, {
        transformRequest: [(params) => {
          let result = ''
          Object.keys(params).forEach((key) => {
            if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
              result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
            }
          })
          return result
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    } else {
      return BACKEND_REQUEST.post(url, params)
    }
  },
  delete (url, params) {
    return BACKEND_REQUEST.delete(param2urlencoded(url, params))
  },
  upload (url, params) {
    return BACKEND_REQUEST.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default request
