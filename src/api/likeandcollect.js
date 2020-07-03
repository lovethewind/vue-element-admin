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

export function updateArticle(data) {
  return request({
    url: '/admin/article/update',
    method: 'post',
    data
  })
}
