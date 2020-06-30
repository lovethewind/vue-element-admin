const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    username: '@cfirst' + '@clast',
    password: '******',
    'is_staff|1': ['true', 'false'],
    'is_super|1': ['true', 'false'],
    'status|1': ['0', '1'],
    join_date: +Mock.Random.date('T'),
    last_login: +Mock.Random.date('T'),
    email: '@email',
    phone: '@integer(10000000000,20000000000,11)'
  }))
}

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // user list
  {
    url: '/admin/user/list',
    type: 'get',
    response: config => {
      const { join_date, username, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (join_date && item.type !== join_date) return false
        if (username && item.title.indexOf(username) < 0) return false
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
  // user detail
  {
    url: '/admin/user/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      console.log('用户传过来的id', id)
      for (const user of List) {
        if (user.id === +id) {
          return {
            code: 20000,
            data: user
          }
        }
      }
    }
  }
]
