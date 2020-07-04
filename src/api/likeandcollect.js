import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/likeandcollect/list',
    method: 'get',
    params: query
  })
}

export function fetchLikeAndCollect(id) {
  return request({
    url: '/admin/likeandcollect/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/admin/likeandcollect/pv',
    method: 'get',
    params: { pv }
  })
}

export function createLikeAndCollect(data) {
  return request({
    url: '/admin/likeandcollect/create',
    method: 'post',
    data
  })
}

export function updateLikeAndCollect(data) {
  return request({
    url: '/admin/likeandcollect/update',
    method: 'post',
    data
  })
}

export function deleteLikeAndCollect(id) {
  return request({
    url: '/admin/likeandcollect/delete',
    method: 'get',
    params: { id }
  })
}
