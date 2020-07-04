import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/category/list',
    method: 'get',
    params: query
  })
}

export function fetchCategory(id) {
  return request({
    url: '/admin/category/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/admin/category/pv',
    method: 'get',
    params: { pv }
  })
}

export function createCategory(data) {
  return request({
    url: '/admin/category/create',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/admin/category/update',
    method: 'post',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: '/admin/category/delete',
    method: 'get',
    params: { id }
  })
}
