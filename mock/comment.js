const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    author: {
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

    },
    article: {
      id: '@increment',
      title: '@ctitle(5, 20)',
      author: '@cfirst' + '@clast',
      time: +Mock.Random.date('T'),
      content: baseContent,
      'status|1': ['publish', 'draft'],
      'top|1': [true, false],
      'recommend|1': [true, false],
      view_count: '@integer(0,9999)',
      comment_count: '@integer(0,9999)',
      like_count: '@integer(0,9999)',
      collect_count: '@integer(0,9999)',
      category: '@integer(1,4)',
      display_time: '@datetime',
      'comment_disabled|1': ['true', 'false']
    },
    content: baseContent,
    parent_id: {
      id: '@increment',
      author: {
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
      },
      article: {
        id: '@increment',
        title: '@ctitle(5, 20)',
        author: '@cfirst' + '@clast',
        time: +Mock.Random.date('T'),
        content: baseContent,
        'status|1': ['publish', 'draft'],
        'top|1': [true, false],
        'recommend|1': [true, false],
        view_count: '@integer(0,9999)',
        comment_count: '@integer(0,9999)',
        like_count: '@integer(0,9999)',
        collect_count: '@integer(0,9999)',
        category: '@integer(1,4)',
        'comment_disabled|1': ['true', 'false']
      },
      content: baseContent
    }, // 回复给哪条子评论,若本身就是回复的主评论则为""
    reply_id: {
      id: '@increment',
      author: {
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
      },
      article: {
        id: '@increment',
        title: '@ctitle(5, 20)',
        author: '@cfirst' + '@clast',
        time: +Mock.Random.date('T'),
        content: baseContent,
        'status|1': ['publish', 'draft'],
        'top|1': [true, false],
        'recommend|1': [true, false],
        view_count: '@integer(0,9999)',
        comment_count: '@integer(0,9999)',
        like_count: '@integer(0,9999)',
        collect_count: '@integer(0,9999)',
        category: '@integer(1,4)',
        display_time: '@datetime',
        'comment_disabled|1': ['true', 'false']
      },
      content: baseContent
    }, // 回复给哪条主评论,若本身就是主评论则为""
    time: '@datetime',
    'status|1': ['checked', '-', 'delete']
  }))
}

module.exports = [
  {
    url: '/admin/comment/list',
    type: 'get',
    response: config => {
      const { time, author, article, page = 1, limit = 10, sort } = config.query
      let mockList = List.filter(item => {
        if (time && item.time !== +time) return false
        if (author && item.author !== author) return false
        if (article && item.article.indexOf(article) < 0) return false
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

  {
    url: '/admin/comment/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const comment of List) {
        if (comment.id === +id) {
          return {
            code: 20000,
            data: comment
          }
        }
      }
    }
  },

  {
    url: '/admin/comment/pv',
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
    url: '/admin/comment/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/admin/comment/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

