import request from '@/utils/request'

export function fetchExitList () {
  return request({
    url: '/exit/list',
    method: 'get'
  })
}
