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
    title: '@csentence',
    url: '@url',
    'type|1': ['image', 'video', 'audio', 'txt', 'other'],
    count: '@integer(0,100000)',
    size: '@integer(0,9999999)',
    time: +Mock.Random.date('T')
  }))
}

module.exports = [
  // mediafile list
  {
    url: '/admin/mediafile/list',
    type: 'get',
    response: config => {
      const { article, time, page = 1, limit = 10, sort } = config.query
      let mockList = List.filter(item => {
        if (time && item.type !== time) return false
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
  // mediafile detail
  {
    url: '/admin/mediafile/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const mediafile of List) {
        if (mediafile.id === +id) {
          return {
            code: 20000,
            data: mediafile
          }
        }
      }
    }
  },
  // mediafile update
  {
    url: '/admin/mediafile/update',
    type: 'put',
    response: config => {
      const { id } = config.query
      for (const mediafile of List) {
        if (mediafile.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  },
  // mediafile delete
  {
    url: '/admin/mediafile/delete',
    type: 'delete',
    response: config => {
      const { id } = config.query
      for (const mediafile of List) {
        if (mediafile.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  }
]
