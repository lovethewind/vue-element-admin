import request from '@/utils/request'

export function getVerificationCodeList(query) {
  return request({
    url: '/admin/verification-code/list',
    method: 'get',
    params: { query }
  })
}

export function fetchVerificationCode(id) {
  return request({
    url: '/admin/verification-code/detail',
    method: 'get',
    params: { id }
  })
}

