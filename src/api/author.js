import request from '@/utils/request'

export function getAuthorList(query) {
  return request({
    url: '/admin/author/list',
    method: 'get',
    params: { query }
  })
}

export function fetchAuthor(id) {
  return request({
    url: '/admin/author/detail',
    method: 'get',
    params: { id }
  })
}

