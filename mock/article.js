const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@ctitle(5, 20)',
    author: {
      id: '@increment',
      user: {
        id: '@increment',
        username: '@cfirst' + '@clast'
      }
    },
    content: baseContent,
    category: {
      id: '@increment',
      name: '@cword(4,6)',
      parent_id: {
        id: '@increment',
        name: '@cword(4,6)',
        'status|1': ['true', 'false']
      }
    },
    'status|1': ['publish', 'check', 'draft', 'delete'],
    'top|1': [true, false],
    'recommend|1': [true, false],
    view_count: '@integer(0,9999)',
    comment_count: '@integer(0,9999)',
    like_count: '@integer(0,9999)',
    collect_count: '@integer(0,9999)',
    time: '@datetime',
    'comment_disabled|1': [true, false]
  }))
}

module.exports = [
  {
    url: '/admin/article/list',
    type: 'get',
    response: config => {
      const { search_comment_disabled, search_status, search_top, search_recommend, search_date, search_content, page = 1, limit = 10, sort } = config.query
      let mockList = List.filter(item => {
        if (search_comment_disabled && item.comment_disabled.toString() !== search_comment_disabled) return false
        if (search_status && item.status !== search_status) return false
        if (search_top && item.top.toString() !== search_top) return false
        if (search_recommend && item.recommend.toString() !== search_recommend) return false
        if (search_date && item.time <= search_date[0] && item.time >= search_date[1]) return false
        if (search_content && item.title.indexOf(search_content) < 0 && item.content.indexOf(search_content) < 0 && item.author.user.username.indexOf(search_content) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      console.log('我在搜索', pageList, pageList.length)
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/admin/article/update',
    type: 'put',
    response: config => {
      console.log('更新文章', config.body)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/admin/article/delete',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

