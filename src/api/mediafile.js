import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/mediafile/list',
    method: 'get',
    params: query
  })
}

export function fetchMediaFile(id) {
  return request({
    url: '/admin/mediafile/detail',
    method: 'get',
    params: { id }
  })
}

export function createMediaFile(data) {
  return request({
    url: '/admin/mediafile/create',
    method: 'post',
    data
  })
}

export function updateMediaFile(data) {
  return request({
    url: '/admin/mediafile/update',
    method: 'post',
    data
  })
}
