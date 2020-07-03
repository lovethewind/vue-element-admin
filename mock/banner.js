const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@cword(5,10)',
    url: '@url',
    image: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
    index: '@integer(0,100)',
    'status|1': ['true', 'false'],
    time: '@datetime'
  }))
}

module.exports = [
  // banner list
  {
    url: '/admin/banner/list',
    type: 'get',
    response: config => {
      const { title, time, page = 1, limit = 10, sort } = config.query
      let mockList = List.filter(item => {
        if (time && item.type !== time) return false
        if (title && item.title !== title) return false
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
  // banner detail
  {
    url: '/admin/banner/detail',
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
  // banner update
  {
    url: '/admin/banner/update',
    type: 'put',
    response: config => {
      const { id } = config.query
      for (const banner of List) {
        if (banner.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  },
  // banner delete
  {
    url: '/admin/banner/delete',
    type: 'delete',
    response: config => {
      const { id } = config.query
      for (const banner of List) {
        if (banner.id === +id) {
          return {
            code: 20000,
            data: 'success'
          }
        }
      }
    }
  }
]
