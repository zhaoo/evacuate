import axios from 'axios'
import heyui from 'heyui'

const service = axios.create({
  // baseURL: 'http://127.0.0.1:7001/api',
  baseURL: 'http://evacuate.izhaoo.com:7001/api',
  timeout: 5000
})

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      heyui.$Notice['error'](res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    heyui.$Notice['error'](error.message || 'Error')
    return Promise.reject(error)
  }
)

export default service
