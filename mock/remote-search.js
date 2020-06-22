const Mock = require('mockjs')

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@cfirst' + '@clast'
  }))
}
// NameList.push({ name: 'mock-Pan' })

module.exports = [
  // username search
  {
    url: '/admin/search/user',
    type: 'get',
    response: config => {
      const { name } = config.query
      const mockNameList = NameList.filter(item => {
        // const lowerCaseName = item.name.toLowerCase()
        // return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
        return !(name)
      })
      return {
        code: 20000,
        data: { items: mockNameList }
      }
    }
  },

  // transaction list
  {
    url: '/admin/transaction/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: 20,
          'items|20': [{
            order_no: '@guid()',
            timestamp: +Mock.Random.date('T'),
            username: '@name()',
            price: '@float(1000, 15000, 0, 2)',
            'status|1': ['success', 'pending']
          }]
        }
      }
    }
  }
]
