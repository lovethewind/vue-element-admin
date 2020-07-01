const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@cword(4,6)',
    parent_id: {
      id: '@increment',
      name: '@cword(4,6)',
      'status|1': ['true', 'false']
    },
    jianjie: '@csentence',
    'status|1': ['true', 'false']
  }))
}

module.exports = [
  // category list
  {
    url: '/admin/category/list',
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
  // category detail
  {
    url: '/admin/category/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const category of List) {
        if (category.id === +id) {
          return {
            code: 20000,
            data: category
          }
        }
      }
    }
  }
]
