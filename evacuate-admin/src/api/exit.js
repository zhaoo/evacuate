import request from '@/utils/request'

export function fetchExitList () {
  return request({
    url: '/exit/list',
    method: 'get'
  })
}

export function deleteExit (id) {
  return request({
    url: '/exit/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function createExit (data) {
  return request({
    url: '/exit/create',
    method: 'post',
    data
  })
}

export function editExit (data) {
  return request({
    url: '/exit/edit',
    method: 'post',
    data
  })
}
