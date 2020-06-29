import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/user/login',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function getUserList(query) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: { query }
  })
}

export function fetchUser(id) {
  return request({
    url: '/admin/user/detail',
    method: 'get',
    params: { id }
  })
}
export function logout() {
  return request({
    url: '/admin/user/logout',
    method: 'post'
  })
}
