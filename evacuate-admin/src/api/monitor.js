import request from '@/utils/request'

export function fetchMonitorList () {
  return request({
    url: '/monitor/list',
    method: 'get'
  })
}

export function deleteMonitor (id) {
  return request({
    url: '/monitor/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function createMonitor (data) {
  return request({
    url: '/monitor/create',
    method: 'post',
    data
  })
}

export function editMonitor (data) {
  return request({
    url: '/monitor/edit',
    method: 'post',
    data
  })
}

export function uploadMonitor (data) {
  return request({
    url: '/monitor/upload',
    method: 'post',
    data
  })
}
