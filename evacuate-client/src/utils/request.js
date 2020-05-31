import axios from 'axios'
import { Notify } from 'vant'

const service = axios.create({
  baseURL: 'http://evacuate.izhaoo.com:7001/api',
  // withCredentials: true,
  timeout: 5000
})

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      Notify({ type: 'danger', message: res.message || 'Error' })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Notify({ type: 'danger', message: error.message || 'Error' })
    return Promise.reject(error)
  }
)

export default service
