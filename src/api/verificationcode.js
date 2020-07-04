import request from '@/utils/request'

export function getVerificationCodeList(query) {
  return request({
    url: '/admin/verificationcode/list',
    method: 'get',
    params: { query }
  })
}

export function fetchVerificationCode(id) {
  return request({
    url: '/admin/verificationcode/detail',
    method: 'get',
    params: { id }
  })
}

