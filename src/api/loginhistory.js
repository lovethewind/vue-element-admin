import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/loginhistory/list',
    method: 'get',
    params: query
  })
}

export function fetchLoginHistory(id) {
  return request({
    url: '/admin/loginhistory/detail',
    method: 'get',
    params: { id }
  })
}

export function createLoginHistory(data) {
  return request({
    url: '/admin/loginhistory/create',
    method: 'post',
    data
  })
}

export function updateLoginHistory(data) {
  return request({
    url: '/admin/loginhistory/update',
    method: 'post',
    data
  })
}

export function deleteLoginHistory(id) {
  return request({
    url: '/admin/loginhistory/delete',
    method: 'get',
    params: { id }
  })
}
