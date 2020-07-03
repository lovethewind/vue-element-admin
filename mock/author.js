const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'sex|1': ['male', 'female', 'security'],
    age: '@integer(10,100)',
    sign: '@cword(5,20)',
    headimg: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    address: '@city(true)',
    touxian: '@cword(5,6)',
    user: {
      id: '@increment',
      username: '@cfirst' + '@clast',
      is_staff: 0,
      is_super: 0,
      'status|1': [0, 1],
      join_date: +Mock.Random.date('T'),
      last_login: +Mock.Random.date('T'),
      email: '@email',
      phone: '@integer(10000000000,20000000000,11)'
    }
  }))
}

module.exports = [

  // author list
  {
    url: '/admin/author/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 10, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
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
  // author detail
  {
    url: '/admin/author/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const author of List) {
        if (author.id === +id) {
          return {
            code: 20000,
            data: author
          }
        }
      }
    }
  },
  // author update
  {
    url: '/admin/author/update',
    type: 'put',
    response: config => {
      const { id } = config.query
      for (const author of List) {
        if (author.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  },
  // author delete
  {
    url: '/admin/author/delete',
    type: 'delete',
    response: config => {
      const { id } = config.query
      for (const user of List) {
        if (user.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  }
]
