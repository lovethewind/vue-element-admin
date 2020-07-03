const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    author: {
      id: '@increment',
      user: {
        id: '@increment',
        username: '@cfirst' + '@clast'
      }
    },
    ip: '@ip',
    'device|1': ['Windows', 'macOS', 'iPhone', 'iPad', 'iPhone', 'Android'],
    address: '@city(true)',
    time: +Mock.Random.date('T')
  }))
}

module.exports = [
  // loginhistory list
  {
    url: '/admin/loginhistory/list',
    type: 'get',
    response: config => {
      const { author, time, page = 1, limit = 10, sort } = config.query
      let mockList = List.filter(item => {
        if (time && item.type !== time) return false
        if (author && item.title !== author) return false
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
  // loginhistory detail
  {
    url: '/admin/loginhistory/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const loginhistory of List) {
        if (loginhistory.id === +id) {
          return {
            code: 20000,
            data: loginhistory
          }
        }
      }
    }
  },
  // loginhistory update
  {
    url: '/admin/loginhistory/update',
    type: 'put',
    response: config => {
      const { id } = config.query
      for (const loginhistory of List) {
        if (loginhistory.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  },
  // loginhistory delete
  {
    url: '/admin/loginhistory/delete',
    type: 'delete',
    response: config => {
      const { id } = config.query
      for (const loginhistory of List) {
        if (loginhistory.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  }
]
