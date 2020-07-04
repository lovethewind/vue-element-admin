const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    code: '@integer(100000,900000,6)',
    'type|1': ['register', 'find-password', 'change-blind'],
    'method|1': ['phone', 'email'],
    'info|1': ['@email', '@integer(10000000000,20000000000,11)'],
    time: +Mock.Random.date('T')
  }))
}

module.exports = [
  // verificationcode list
  {
    url: '/admin/verificationcode/list',
    type: 'get',
    response: config => {
      const { phone, email, page = 1, limit = 10, sort } = config.query
      console.log('用户传过来的id')
      let mockList = List.filter(item => {
        if (phone && item.type !== phone) return false
        if (email && item.title !== email) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  // verificationcode detail
  {
    url: '/admin/verificationcode/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      console.log('用户传过来的id', id)
      for (const verificationCode of List) {
        if (verificationCode.id === +id) {
          return {
            code: 20000,
            data: verificationCode
          }
        }
      }
    }
  },
  // verificationcode update
  {
    url: '/admin/verificationcode/update',
    type: 'put',
    response: config => {
      const { id } = config.query
      for (const verificationCode of List) {
        if (verificationCode.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  },
  // verificationcode delete
  {
    url: '/admin/verificationcode/delete',
    type: 'delete',
    response: config => {
      const { id } = config.query
      for (const verificationCode of List) {
        if (verificationCode.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  }
]
