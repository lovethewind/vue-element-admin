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
    article: {
      id: '@increment',
      title: '@csentence'
    },
    'like_status|1': ['true', 'false'],
    'collect_status|1': ['true', 'false'],
    time: +Mock.Random.date('T')
  }))
}

module.exports = [
  // likeandcollect list
  {
    url: '/admin/likeandcollect/list',
    type: 'get',
    response: config => {
      const { article, author, page = 1, limit = 10, sort } = config.query
      let mockList = List.filter(item => {
        if (author && item.type !== author) return false
        if (article && item.title !== article) return false
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
  // likeandcollect detail
  {
    url: '/admin/likeandcollect/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const likeandcollect of List) {
        if (likeandcollect.id === +id) {
          return {
            code: 20000,
            data: likeandcollect
          }
        }
      }
    }
  },
  // likeandcollect update
  {
    url: '/admin/likeandcollect/update',
    type: 'put',
    response: config => {
      const { id } = config.query
      for (const likeandcollect of List) {
        if (likeandcollect.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  },
  // likeandcollect delete
  {
    url: '/admin/likeandcollect/delete',
    type: 'delete',
    response: config => {
      const { id } = config.query
      for (const likeandcollect of List) {
        if (likeandcollect.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  }
]
