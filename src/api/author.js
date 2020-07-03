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

export function updateAuthor(query) {
  return request({
    url: '/admin/author/update',
    method: 'get',
    params: { query }
  })
}

export function deleteAuthor(id) {
  return request({
    url: '/admin/author/delete',
    method: 'get',
    params: { id }
  })
}
