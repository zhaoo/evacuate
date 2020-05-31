import request from '@/utils/request'

export function fetchMonitorList () {
  return request({
    url: '/monitor/list',
    method: 'get'
  })
}
