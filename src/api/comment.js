import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/comment/list',
    method: 'get',
    params: query
  })
}

export function fetchComment(id) {
  return request({
    url: '/admin/comment/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/admin/comment/pv',
    method: 'get',
    params: { pv }
  })
}

export function createComment(data) {
  return request({
    url: '/admin/comment/create',
    method: 'post',
    data
  })
}

export function updateComment(data) {
  return request({
    url: '/admin/comment/update',
    method: 'post',
    data
  })
}

export function deleteComment(id) {
  return request({
    url: '/admin/comment/delete',
    method: 'get',
    params: { id }
  })
}
