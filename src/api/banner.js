import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/banner/list',
    method: 'get',
    params: query
  })
}

export function fetchBanner(id) {
  return request({
    url: '/admin/banner/detail',
    method: 'get',
    params: { id }
  })
}

export function createBanner(data) {
  return request({
    url: '/admin/banner/create',
    method: 'post',
    data
  })
}

export function updateBanner(data) {
  return request({
    url: '/admin/banner/update',
    method: 'post',
    data
  })
}
